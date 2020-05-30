export const getProjectDBRef = (): string => {
  return `projects`;
};

export const getProjectDocRef = (projectId: string): string => {
  return `projects/${projectId}`;
};

export const getUserDBRef = (): string => {
  return `users`;
};

export const getUserDocRef = (userId: string): string => {
  return `users/${userId}`;
};
