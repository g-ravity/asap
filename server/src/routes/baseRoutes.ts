import * as Sentry from "@sentry/node";
import { Request, Response, Router } from "express";
import { User } from "../../../types";
import { verifyAuth } from "../middleware/authMiddleware";
import { UserDoc } from "../utils/firebaseContants";

export const router = Router();

router.get(
  "/",
  verifyAuth,
  async (req: Request<{}, null, null>, res: Response): Promise<Response<User>> => {
    try {
      const { id } = req.user!;

      const userDoc = await UserDoc(id).get();
      if (!userDoc.exists) throw new Error();

      const user = userDoc.data() as User;
      return res.send(user);
    } catch (err) {
      Sentry.captureException(err);
      return res.status(500).send({ message: "Something Went Wrong!" });
    }
  }
);
