/**
 * General
 */
export interface Id {
  id: string;
}

export interface ItemIds {
  projectId: string;
  listId: string;
  taskId: string;
}

export interface CreateInfo {
  createdBy: UserIdWithName;
  createdAt: Date;
}

export interface UpdateInfo {
  updatedBy: UserIdWithName;
  updatedAt: Date;
}

export type Message = {
  message: string;
};

/**
 * User
 */
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

/**
 * Project
 */
export interface Project extends CreateInfo, UpdateInfo {
  name: string;
  listIds: string[];
  members: UserIdWithName[];
}

/**
 * List
 */
export interface List extends UpdateInfo {
  name: string;
  taskIds: string[];
}

/**
 * Activity
 */
export interface Activity {
  activityType: "create" | "update" | "delete";
  activityItem: "list" | "project" | "task" | "label" | "status" | "priority";
  projectId: string;
  activityCreator: UserIdWithName;
  activityTime: Date;
  oldLabel?: string;
  newLabel?: string;
}
