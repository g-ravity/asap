import * as argon2 from "argon2";
import { randomBytes } from "crypto";
import { Id, User } from "../../../../types";
import { UserDB } from "../../utils/firebaseContants";

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

    if (password) {
      const salt = randomBytes(32);
      user.password = await argon2.hash(password, { salt });
    }

    console.log("User to be Registered: ", user);

    const userDoc = await UserDB().add(user);

    return { id: userDoc.id, ...user };
  } catch (err) {
    throw new Error(err);
  }
};
