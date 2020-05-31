import * as Sentry from "@sentry/node";
import { Request, Response, Router } from "express";
import { firestore } from "firebase-admin";
import * as Yup from "yup";
import { ItemIds, Project, UserIdWithName } from "../../../types";
import { db } from "../config/firebase";
import getSchema from "../config/yup";
import { verifyAuth } from "../middleware/authMiddleware";
import { ProjectDBRef, ProjectDocRef, UserDocRef } from "../utils/firebaseContants";
import { router as listRoutes } from "./listRoutes";

export const router = Router();

/**
 * Types
 */
type AddProjectReq = Request<{}, null, Pick<Project, "name">>;
type ProjectRes = Response<string>;

/**
 * Handler
 */
router.post(
  "/",
  verifyAuth,
  async (req: AddProjectReq, res: ProjectRes): Promise<ProjectRes> => {
    const project = req.body;

    try {
      await ProjectCreateSchema.validate(project);
      const user: UserIdWithName = { id: req.user!.id, name: req.user!.name };
      const projectForSubmit: Partial<Project> = {
        ...project,
        listIds: [],
        memberIds: [],
        createdAt: new Date(),
        createdBy: user
      };

      console.log("Project For Submit: ", projectForSubmit);

      // Batched Write
      const batch = db.batch();
      const projectDocRef = ProjectDBRef().doc();
      batch.set(projectDocRef, projectForSubmit);
      batch.update(UserDocRef(user.id), { projectIds: firestore.FieldValue.arrayUnion(projectDocRef.id) });
      await batch.commit();

      return res.status(200).send("Project created successfully!");
    } catch (err) {
      Sentry.captureException(err);
      return res.status(500).send("Something Went Wrong!");
    }
  }
);

/**
 * Types
 */
type UpdateProjectReq = Request<Pick<ItemIds, "projectId">, null, Pick<Project, "name" | "memberIds">>;

/**
 * Handler
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
        res.status(400).send("Empty object not allowed!");
      }

      await ProjectUpdateSchema.validate(project);
      const projectDoc = await ProjectDocRef(projectId).get();
      if (!projectDoc.exists) {
        return res.status(404).send("Project doesn't exist");
      }

      const user: UserIdWithName = { id: req.user!.id, name: req.user!.name };
      const projectForSubmit: Partial<Project> = {
        ...project,
        updatedAt: new Date(),
        updatedBy: user
      };

      console.log("Project For Submit: ", projectForSubmit);
      await ProjectDocRef(projectId).update(projectForSubmit);
      return res.status(200).send("Project successfully updated!");
    } catch (err) {
      Sentry.captureException(err);
      return res.status(500).send("Something Went Wrong!");
    }
  }
);

/**
 * Types
 */
type DeleteProjectReq = Request<Pick<ItemIds, "projectId">, null, {}>;

/**
 * Handler
 */
router.delete(
  "/:projectId",
  verifyAuth,
  async (req: DeleteProjectReq, res: ProjectRes): Promise<ProjectRes> => {
    const { projectId } = req.params;
    console.log("Project ID: ", projectId);

    try {
      const projectDoc = await ProjectDocRef(projectId).get();
      if (!projectDoc.exists) {
        return res.status(404).send("Project doesn't exist");
      }

      // Batched Write
      const batch = db.batch();
      batch.delete(ProjectDocRef(projectId));
      batch.update(UserDocRef(req.user!.id), { projectIds: firestore.FieldValue.arrayRemove(projectId) });
      await batch.commit();

      return res.status(200).send("Project successfully deleted!");
    } catch (err) {
      Sentry.captureException(err);
      return res.status(500).send("Something Went Wrong!");
    }
  }
);

/**
 * List Routes
 */
router.use("/:projectId/lists", verifyAuth, listRoutes);

/**
 * Validation Schemas
 */
const ProjectCreateSchema = getSchema({ name: Yup.string().min(3, "Too short!").required("Required!") });

const ProjectUpdateSchema = getSchema({
  name: Yup.string().min(3, "Too short!"),
  memberIds: Yup.array().ensure().of(Yup.string())
});
