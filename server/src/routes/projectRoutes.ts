import { Router } from "express";
import * as projectControllers from "../controllers/projectControllers";
import { verifyAuth } from "../middleware/authMiddleware";
import { router as listRoutes } from "./listRoutes";

export const router = Router();

router.post("/", verifyAuth, projectControllers.addProject);
router.put("/:projectId", verifyAuth, projectControllers.updateProject);
router.delete("/:projectId", verifyAuth, projectControllers.deleteProject);
router.use("/:projectId/lists", verifyAuth, listRoutes);
