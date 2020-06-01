import * as Sentry from "@sentry/node";
import { Request, Response, Router } from "express";
import { firestore } from "firebase-admin";
import isEqual from "lodash/isEqual";
import * as Yup from "yup";
import { Activity, ItemIds, Message, Project, UserIdWithName } from "../../../types";
import { db } from "../config/firebase";
import getSchema from "../config/yup";
import { verifyAuth } from "../middleware/authMiddleware";
import {
  ActivityDBRef,
  ActivityDocRef,
  ListDocRef,
  ProjectDBRef,
  ProjectDocRef,
  UserDocRef
} from "../utils/firebaseContants";
import { router as listRoutes } from "./listRoutes";

export const router = Router();

/**
 * Types
 */
type AddProjectReq = Request<{}, null, Pick<Project, "name">>;
type ProjectRes = Response<Message>;

/**
 * Create Project Handler
 */
router.post(
  "/",
  verifyAuth,
  async (req: AddProjectReq, res: ProjectRes): Promise<ProjectRes> => {
    const project = req.body;

    try {
      await ProjectSchema.validate(project);

      const user: UserIdWithName = { id: req.user!.id, name: req.user!.name };
      const projectForSubmit: Omit<Project, "updatedAt" | "updatedBy"> = {
        ...project,
        listIds: [],
        members: [user],
        createdAt: new Date(),
        createdBy: user
      };

      const projectDocRef = ProjectDBRef().doc();

      const activityForSubmit: Activity = {
        activityType: "create",
        activityItem: "project",
        projectId: projectDocRef.id,
        activityTime: projectForSubmit.createdAt,
        activityCreator: user
      };

      console.log("Project For Submit: ", projectForSubmit);
      console.log("Activity For Submit: ", activityForSubmit);

      // Batched Write
      const batch = db.batch();
      batch.set(projectDocRef, projectForSubmit);
      const activityDocRef = ActivityDBRef().doc();
      batch.set(activityDocRef, activityForSubmit);
      batch.update(UserDocRef(user.id), { projectIds: firestore.FieldValue.arrayUnion(projectDocRef.id) });
      await batch.commit();

      return res.status(200).send({ message: "Project created successfully!" });
    } catch (err) {
      Sentry.captureException(err);
      return res.status(500).send({ message: "Something Went Wrong!" });
    }
  }
);

/**
 * Types
 */
type UpdateProjectReq = Request<Pick<ItemIds, "projectId">, null, Pick<Project, "name">>;

/**
 * Update Project Handler
 */
router.put(
  "/:projectId",
  verifyAuth,
  async (req: UpdateProjectReq, res: ProjectRes): Promise<ProjectRes> => {
    const project = req.body;
    const { projectId } = req.params;
    console.log("Project ID: ", projectId);

    try {
      if (!Object.keys(project).length) {
        res.status(400).send({ message: "Empty object not allowed!" });
      }

      const projectDoc = await ProjectDocRef(projectId).get();

      // Permission Checks
      if (!projectDoc.exists) {
        return res.status(404).send({ message: "Project doesn't exist" });
      }
      if (!(projectDoc.data() as Project).members.filter(member => isEqual(member, req.user!)).length) {
        return res.status(403).send({ message: "Not a member of the project" });
      }

      await ProjectSchema.validate(project);

      const user: UserIdWithName = { id: req.user!.id, name: req.user!.name };
      const projectForSubmit: Partial<Project> = {
        ...project,
        updatedAt: new Date(),
        updatedBy: user
      };

      const activityForSubmit: Activity = {
        activityType: "update",
        activityItem: "project",
        activityTime: projectForSubmit.updatedAt!,
        activityCreator: user,
        projectId,
        oldLabel: (projectDoc.data() as Project).name,
        newLabel: projectForSubmit.name
      };

      console.log("Project For Submit: ", projectForSubmit);
      console.log("Activity For Submit: ", activityForSubmit);

      // Batched Write
      const batch = db.batch();
      batch.update(ProjectDocRef(projectId), projectForSubmit);
      const activityDocRef = ActivityDBRef().doc();
      batch.set(activityDocRef, activityForSubmit);
      await batch.commit();

      return res.status(200).send({ message: "Project successfully updated!" });
    } catch (err) {
      Sentry.captureException(err);
      return res.status(500).send({ message: "Something Went Wrong!" });
    }
  }
);

/**
 * Types
 */
type DeleteProjectReq = Request<Pick<ItemIds, "projectId">, null, {}>;

/**
 * Delete Project Handler
 */
router.delete(
  "/:projectId",
  verifyAuth,
  async (req: DeleteProjectReq, res: ProjectRes): Promise<ProjectRes> => {
    const { projectId } = req.params;
    console.log("Project ID: ", projectId);

    try {
      const projectDoc = await ProjectDocRef(projectId).get();

      // Permission Checks
      if (!projectDoc.exists) {
        return res.status(404).send({ message: "Project doesn't exist" });
      }
      if (!isEqual((projectDoc.data() as Project).createdBy, req.user!)) {
        return res.status(403).send({ message: "Only owner can delete project!" });
      }

      const activityDocs = (await ActivityDBRef().where("projectId", "==", projectId).get()).docs;

      // Batched Write
      const batch = db.batch();
      const { listIds }: Partial<Project> = projectDoc.data()!;
      for (let i = 0; i < listIds!.length; i += 1) {
        batch.delete(ListDocRef(listIds![i]));
      }
      for (let i = 0; i < activityDocs.length; i += 1) {
        batch.delete(ActivityDocRef(activityDocs[i].id));
      }
      batch.delete(ProjectDocRef(projectId));
      batch.update(UserDocRef(req.user!.id), { projectIds: firestore.FieldValue.arrayRemove(projectId) });
      await batch.commit();

      return res.status(200).send({ message: "Project successfully deleted!" });
    } catch (err) {
      Sentry.captureException(err);
      return res.status(500).send({ message: "Something Went Wrong!" });
    }
  }
);

/**
 * Validation Schemas
 */
const ProjectSchema = getSchema({ name: Yup.string().min(3, "Too short!").required("Required!") });

/**
 * List Routes
 */
router.use("/:projectId/lists", verifyAuth, listRoutes);
