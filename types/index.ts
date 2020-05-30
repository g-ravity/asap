export interface Id {
  id: string;
}

export interface CreateInfo {
  createdBy: UserIdWithName;
  createdAt: Date;
}

export interface UpdateInfo {
  updatedBy: UserIdWithName;
  updatedAt: Date;
}

export interface Project extends CreateInfo, UpdateInfo {
  name: string;
  listIds: string[];
  memberIds: string[];
}
export interface User extends Pick<CreateInfo, "createdAt"> {
  name: string;
  email: string;
  password?: string;
  displayImage?: string;
  facebookId?: string;
  googleId?: string;
  projectIds: Array<string>;
}

export type UserIdWithName = Pick<User & Id, "id" | "name">;
