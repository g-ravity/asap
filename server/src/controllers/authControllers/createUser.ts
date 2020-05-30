import * as bcrypt from "bcryptjs";
import { User, Id } from "../../../../types";
import { db } from "../../config/firebase";
import { getUserDBRef } from "../../utils/firebaseContants";

/**
 * Create User
 */
export default async (params: Omit<User, "projectIds" | "createdAt">): Promise<User & Id> => {
  try {
    const { password } = params;

    const user: User = {
      ...params,
      projectIds: [],
      createdAt: new Date()
    };
    console.log(user);

    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    const userDocRef = db.collection(getUserDBRef()).doc();
    await userDocRef.set(user);

    return { id: userDocRef.id, ...user };
  } catch (err) {
    throw new Error(err);
  }
};
