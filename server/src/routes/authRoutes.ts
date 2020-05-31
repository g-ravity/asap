import { Router } from "express";
import * as authControllers from "../controllers/authControllers";

export const router = Router();

router.post("/signUp", authControllers.signUp);
router.post("/signIn", authControllers.signIn);
router.get("/signOut", authControllers.signOut);
router.get("/google", authControllers.googleOAuth);
router.get("/google/callback", authControllers.googleOAuthCallback);
router.get("/facebook", authControllers.facebookOAuth);
router.get("/facebook/callback", authControllers.facebookOAuthCallback);
