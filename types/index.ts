export interface Id {
  id: string;
}
export interface Project {
  name: string;
  listIds: string[] | null;
  memberIds: string[];
  createdBy: UserIdWithName;
  modifiedBy: UserIdWithName;
  createdAt: Date;
}
export interface User {
  name: string;
  email: string;
  password: string;
  displayImage?: string;
  facebookId?: string;
  googleId?: string;
  projectIds: Array<string>;
}

type UserIdWithName = Pick<User & Id, "id" | "name">;
