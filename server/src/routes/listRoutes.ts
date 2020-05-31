import { Router } from "express";
import * as listControllers from "../controllers/listControllers";

export const router = Router({ mergeParams: true });

router.post("/", listControllers.addList);
router.put("/:listId", listControllers.updateList);
router.delete("/:listId", listControllers.deleteList);
