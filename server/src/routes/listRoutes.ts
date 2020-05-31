import * as Sentry from "@sentry/node";
import { Request, Response, Router } from "express";
import { firestore } from "firebase-admin";
import * as Yup from "yup";
import { ItemIds, List, UserIdWithName } from "../../../types";
import { db } from "../config/firebase";
import getSchema from "../config/yup";
import { ListDBRef, ListDocRef, ProjectDocRef } from "../utils/firebaseContants";

export const router = Router({ mergeParams: true });

/**
 * Types
 */
type AddListReq = Request<Pick<ItemIds, "projectId">, null, Pick<List, "name">>;
type ListRes = Response<string>;

/**
 * Handler
 */
router.post(
  "/",
  async (req: AddListReq, res: ListRes): Promise<ListRes> => {
    const list = req.body;
    const { projectId } = req.params;
    console.log("Project ID: ", projectId);

    try {
      const projectDoc = await ProjectDocRef(projectId).get();
      if (!projectDoc.exists) {
        return res.status(404).send("Project doesn't exist!");
      }

      await ListSchema.validate(list);
      const user: UserIdWithName = { id: req.user!.id, name: req.user!.name };
      const listForSubmit: List = {
        ...list,
        updatedAt: new Date(),
        updatedBy: user,
        taskIds: []
      };

      console.log("List For Submit: ", listForSubmit);

      // Batched Write
      const batch = db.batch();
      const listDocRef = ListDBRef().doc();
      batch.set(listDocRef, listForSubmit);
      batch.update(ProjectDocRef(projectId), { listIds: firestore.FieldValue.arrayUnion(listDocRef.id) });
      await batch.commit();

      return res.status(200).send("List created successfully!");
    } catch (err) {
      Sentry.captureException(err);
      return res.status(500).send("Something Went Wrong!");
    }
  }
);

/**
 * Types
 */
type UpdateListReq = Request<Pick<ItemIds, "projectId" | "listId">, null, Pick<List, "name">>;

/**
 * Handler
 */
router.put(
  "/:listId",
  async (req: UpdateListReq, res: ListRes): Promise<ListRes> => {
    const list = req.body;
    const { listId } = req.params;
    console.log("List ID: ", listId);

    try {
      await ListSchema.validate(list);
      const listDoc = await ListDocRef(listId).get();
      if (!listDoc.exists) {
        return res.status(404).send("List doesn't exist");
      }

      const user: UserIdWithName = { id: req.user!.id, name: req.user!.name };
      const listForSubmit: Partial<List> = {
        ...list,
        updatedAt: new Date(),
        updatedBy: user
      };

      console.log("List For Submit: ", listForSubmit);
      await ListDocRef(listId).update(listForSubmit);

      return res.status(200).send("List successfully updated!");
    } catch (err) {
      Sentry.captureException(err);
      return res.status(500).send("Something Went Wrong!");
    }
  }
);

/**
 * Types
 */
type DeleteListReq = Request<Pick<ItemIds, "projectId" | "listId">, null, {}>;

/**
 * Handler
 */
router.delete(
  "/:listId",
  async (req: DeleteListReq, res: ListRes): Promise<ListRes> => {
    const { listId, projectId } = req.params;
    console.log("List ID: ", listId);

    try {
      const listDoc = await ListDocRef(listId).get();
      if (!listDoc.exists) {
        return res.status(404).send("List doesn't exist");
      }

      // Batched Write
      const batch = db.batch();
      batch.delete(ListDocRef(listId));
      batch.update(ProjectDocRef(projectId), { listIds: firestore.FieldValue.arrayRemove(listDoc.id) });
      await batch.commit();

      return res.status(200).send("List successfully deleted!");
    } catch (err) {
      Sentry.captureException(err);
      return res.status(500).send("Something Went Wrong!");
    }
  }
);

/**
 * Validation Schemas
 */
const ListSchema = getSchema({ name: Yup.string().min(1, "Name cannot be empty!").required("Required!") });
