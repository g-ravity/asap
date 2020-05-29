export const getProjectDBRef = (): string => {
  return `projects`;
};

export const getProjectDocRef = (projectId: string): string => {
  return `projects/${projectId}`;
};
