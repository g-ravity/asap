export interface Project {
  name: string;
  listIds: string[] | null;
  memberIds: string[];
  createdBy: UserIdWithName;
  modifiedBy: UserIdWithName;
  createdAt: Date;
}

export interface UserIdWithName {
  name: string;
  id: string;
}
