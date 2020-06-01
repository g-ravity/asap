import * as Sentry from "@sentry/node";
import { Request, Response, Router } from "express";
import { Message, User } from "../../../types";
import { verifyAuth } from "../middleware/authMiddleware";
import { UserDocRef } from "../utils/firebaseContants";

export const router = Router();

/**
 * Types
 */
type FetchUserRes = Response<Message | User>;

/**
 * Fetch User Handler
 */
router.get(
  "/",
  verifyAuth,
  async (req: Request<{}, null, null>, res: FetchUserRes): Promise<FetchUserRes> => {
    try {
      const { id } = req.user!;

      const userDoc = await UserDocRef(id).get();
      if (!userDoc.exists) throw new Error();

      const user = userDoc.data() as User;
      return res.send(user);
    } catch (err) {
      Sentry.captureException(err);
      return res.status(500).send({ message: "Something Went Wrong!" });
    }
  }
);
