import * as Sentry from "@sentry/node";
import { Request, Response, Router } from "express";
import { firestore } from "firebase-admin";
import isEqual from "lodash/isEqual";
import * as Yup from "yup";
import { Activity, ItemIds, List, Message, Project, UserIdWithName } from "../../../types";
import { db } from "../config/firebase";
import getSchema from "../config/yup";
import { ActivityDBRef, ListDBRef, ListDocRef, ProjectDocRef } from "../utils/firebaseContants";

export const router = Router({ mergeParams: true });

/**
 * Types
 */
type AddListReq = Request<Pick<ItemIds, "projectId">, null, Pick<List, "name">>;
type ListRes = Response<Message>;

/**
 * Create List Handler
 */
router.post(
  "/",
  async (req: AddListReq, res: ListRes): Promise<ListRes> => {
    const list = req.body;
    const { projectId } = req.params;
    console.log("Project ID: ", projectId);

    try {
      const projectDoc = await ProjectDocRef(projectId).get();

      // Permission Checks
      if (!projectDoc.exists) {
        return res.status(404).send({ message: "Project doesn't exist!" });
      }
      if (!(projectDoc.data() as Project).members.filter(member => isEqual(member, req.user!)).length) {
        return res.status(403).send({ message: "Not a member of the project" });
      }

      await ListSchema.validate(list);

      const user: UserIdWithName = { id: req.user!.id, name: req.user!.name };
      const listForSubmit: List = {
        ...list,
        updatedAt: new Date(),
        updatedBy: user,
        taskIds: []
      };

      const activityForSubmit: Activity = {
        activityType: "create",
        activityItem: "list",
        activityTime: listForSubmit.updatedAt,
        activityCreator: user,
        projectId,
        newLabel: listForSubmit.name
      };

      console.log("List For Submit: ", listForSubmit);
      console.log("Activity For Submit: ", activityForSubmit);

      // Batched Write
      const batch = db.batch();
      const listDocRef = ListDBRef().doc();
      batch.set(listDocRef, listForSubmit);
      const activityDocRef = ActivityDBRef().doc();
      batch.set(activityDocRef, activityForSubmit);
      batch.update(ProjectDocRef(projectId), { listIds: firestore.FieldValue.arrayUnion(listDocRef.id) });
      await batch.commit();

      return res.status(200).send({ message: "List created successfully!" });
    } catch (err) {
      Sentry.captureException(err);
      return res.status(500).send({ message: "Something Went Wrong!" });
    }
  }
);

/**
 * Types
 */
type UpdateListReq = Request<Pick<ItemIds, "projectId" | "listId">, null, Pick<List, "name">>;

/**
 * Update List Handler
 */
router.put(
  "/:listId",
  async (req: UpdateListReq, res: ListRes): Promise<ListRes> => {
    const list = req.body;
    const { listId, projectId } = req.params;
    console.log("List ID: ", listId);

    try {
      const projectDoc = await ProjectDocRef(projectId).get();

      // Permission Checks
      if (!projectDoc.exists) {
        return res.status(404).send({ message: "Project doesn't exist!" });
      }
      if (!(projectDoc.data() as Project).members.filter(member => isEqual(member, req.user!)).length) {
        return res.status(403).send({ message: "Not a member of the project" });
      }
      if (!(projectDoc.data() as Project).listIds.includes(listId)) {
        return res.status(404).send({ message: "List not found in Project" });
      }

      const listDoc = await ListDocRef(listId).get();
      await ListSchema.validate(list);

      const user: UserIdWithName = { id: req.user!.id, name: req.user!.name };
      const listForSubmit: Partial<List> = {
        ...list,
        updatedAt: new Date(),
        updatedBy: user
      };

      const activityForSubmit: Activity = {
        activityType: "update",
        activityItem: "list",
        activityTime: listForSubmit.updatedAt!,
        activityCreator: user,
        projectId,
        oldLabel: (listDoc.data() as List).name,
        newLabel: listForSubmit.name
      };

      console.log("List For Submit: ", listForSubmit);
      console.log("Activity For Submit: ", activityForSubmit);

      // Batch Write
      const batch = db.batch();
      batch.update(ListDocRef(listId), listForSubmit);
      const activityDocRef = ActivityDBRef().doc();
      batch.set(activityDocRef, activityForSubmit);
      await batch.commit();

      return res.status(200).send({ message: "List successfully updated!" });
    } catch (err) {
      Sentry.captureException(err);
      return res.status(500).send({ message: "Something Went Wrong!" });
    }
  }
);

/**
 * Types
 */
type DeleteListReq = Request<Pick<ItemIds, "projectId" | "listId">, null, {}>;

/**
 * Delete List Handler
 */
router.delete(
  "/:listId",
  async (req: DeleteListReq, res: ListRes): Promise<ListRes> => {
    const { listId, projectId } = req.params;
    console.log("List ID: ", listId);

    try {
      const projectDoc = await ProjectDocRef(projectId).get();

      // Permission Checks
      if (!projectDoc.exists) {
        return res.status(404).send({ message: "Project doesn't exist!" });
      }
      if (!(projectDoc.data() as Project).members.filter(member => isEqual(member, req.user!)).length) {
        return res.status(403).send({ message: "Not a member of the project" });
      }
      if (!(projectDoc.data() as Project).listIds.includes(listId)) {
        return res.status(404).send({ message: "List not found in Project" });
      }

      const listDoc = await ListDocRef(listId).get();

      const activityForSubmit: Activity = {
        activityType: "delete",
        activityItem: "list",
        activityTime: new Date(),
        activityCreator: req.user!,
        projectId,
        oldLabel: (listDoc.data() as List).name
      };

      console.log("Activity For Submit: ", activityForSubmit);

      // Batched Write
      const batch = db.batch();
      batch.delete(ListDocRef(listId));
      const activityDocRef = ActivityDBRef().doc();
      batch.set(activityDocRef, activityForSubmit);
      batch.update(ProjectDocRef(projectId), { listIds: firestore.FieldValue.arrayRemove(listDoc.id) });
      await batch.commit();

      return res.status(200).send({ message: "List successfully deleted!" });
    } catch (err) {
      Sentry.captureException(err);
      return res.status(500).send({ message: "Something Went Wrong!" });
    }
  }
);

/**
 * Validation Schemas
 */
const ListSchema = getSchema({ name: Yup.string().min(1, "Name cannot be empty!").required("Required!") });
