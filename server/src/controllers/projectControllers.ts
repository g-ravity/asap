import * as Sentry from "@sentry/node";
import { Request, Response } from "express";
import * as Yup from "yup";
import { Project, UserIdWithName } from "../../../types";
import schema from "../config/yup";
import { ProjectDB, ProjectDoc } from "../utils/firebaseContants";

/**
 * Types
 */
type AddProjectReq = Request<
  {},
  null,
  {
    project: Pick<Project, "name" | "listIds" | "memberIds">;
  }
>;

type UpdateProjectReq = Request<
  {
    projectId: string;
  },
  null,
  {
    project: Pick<Project, "name" | "listIds" | "memberIds">;
  }
>;

type DeleteProjectReq = Request<
  {
    projectId: string;
  },
  null,
  {}
>;

/**
 * Controllers
 */
export const addProject = async (req: AddProjectReq, res: Response<string>): Promise<Response<string>> => {
  const { project } = req.body;

  try {
    await projectCreateSchema.validate(project);
    const user: UserIdWithName = { id: req.user!.id, name: req.user!.name };
    const projectForSubmit: Partial<Project> = {
      ...project,
      listIds: [],
      memberIds: [],
      createdAt: new Date(),
      createdBy: user
    };

    console.log("Project For Submit: ", projectForSubmit);
    await ProjectDB().add(projectForSubmit);
    res.send("Project created successfully!");
    return res;
  } catch (err) {
    Sentry.captureException(err);
    return res.status(500).send("Something Went Wrong!");
  }
};

export const updateProject = async (req: UpdateProjectReq, res: Response<string>): Promise<Response<string>> => {
  const { project } = req.body;
  const { projectId } = req.params;
  console.log("Project ID: ", projectId);

  try {
    if (!Object.keys(project).length) {
      throw new Error("Empty object not allowed!");
    }

    await projectUpdateSchema.validate(project);
    const projectDoc = await ProjectDoc(projectId).get();
    if (!projectDoc.exists) {
      return res.status(404).send("Project doesn't exist");
    }

    const user: UserIdWithName = { id: req.user!.id, name: req.user!.name };
    const projectForSubmit: Partial<Project> = {
      ...project,
      updatedAt: new Date(),
      updatedBy: user
    };

    console.log("Project For Submit: ", projectForSubmit);
    await ProjectDoc(projectId).update(projectForSubmit);
    res.send("Project successfully updated!");
    return res;
  } catch (err) {
    Sentry.captureException(err);
    return res.status(500).send("Something Went Wrong!");
  }
};

export const deleteProject = async (req: DeleteProjectReq, res: Response<string>): Promise<Response<string>> => {
  const { projectId } = req.params;
  console.log("Project ID: ", projectId);

  try {
    const projectDoc = await ProjectDoc(projectId).get();
    if (!projectDoc.exists) {
      return res.status(404).send("Project doesn't exist");
    }

    await ProjectDoc(projectId).delete();
    res.send("Project successfully deleted");
    return res;
  } catch (err) {
    Sentry.captureException(err);
    return res.status(500).send("Something Went Wrong!");
  }
};

/**
 * Validation Schemas
 */
const projectCreateSchema = schema({ name: Yup.string().min(3, "Too short!").required("Required!") });

const projectUpdateSchema = schema({
  name: Yup.string().min(3, "Too short!"),
  listIds: Yup.array().ensure().of(Yup.string()),
  memberIds: Yup.array().ensure().of(Yup.string())
});
