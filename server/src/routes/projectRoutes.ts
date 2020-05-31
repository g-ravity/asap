import { Router } from "express";
import * as projectControllers from "../controllers/projectControllers";
import { verifyAuth } from "../middleware/authMiddleware";

export const router = Router();

router.post("/", verifyAuth, projectControllers.addProject);
router.put("/:projectId", verifyAuth, projectControllers.updateProject);
router.delete("/:projectId", verifyAuth, projectControllers.deleteProject);
