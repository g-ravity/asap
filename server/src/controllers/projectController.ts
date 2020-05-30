import * as admin from "firebase-admin";
import { Request, Response } from "express";
import * as Yup from "yup";
import * as Sentry from "@sentry/node";
import { Project, UserIdWithName } from "../../../types";
import { getProjectDBRef, getProjectDocRef } from "../utils/firebaseContants";

const db = admin.firestore();

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

const projectCreateSchema = Yup.object()
  .shape({
    name: Yup.string().min(3, "Too short!").required("Required!")
  })
  .strict(true)
  .noUnknown();

const projectUpdateSchema = Yup.object()
  .shape({
    name: Yup.string().min(3, "Too short!"),
    listIds: Yup.array().ensure().of(Yup.string()),
    memberIds: Yup.array().ensure().of(Yup.string())
  })
  .strict(true)
  .noUnknown();

export const addProject = async (req: AddProjectReq, res: Response): Promise<Response> => {
  try {
    const { project } = req.body;
    console.log(project);
    await projectCreateSchema.validate(project);
    const user: UserIdWithName = { id: req.user!.id, name: req.user!.name };
    const projectForSubmit: Project = {
      ...project,
      listIds: [],
      memberIds: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: user,
      updatedBy: user
    };
    console.log("Project For Submit: ", projectForSubmit);
    await db.collection(getProjectDBRef()).add(projectForSubmit);
    res.send("Project successfully created!");
    return res;
  } catch (err) {
    Sentry.captureException(err);
    return res.status(500).send("Something Went Wrong!");
  }
};

export const updateProject = async (req: UpdateProjectReq, res: Response): Promise<Response> => {
  try {
    const { project } = req.body;
    const { projectId } = req.params;
    console.log(req.params);
    if (!Object.keys(project).length) {
      throw new Error("Empty object not allowed !");
    }
    await projectUpdateSchema.validate(project);
    const projectDoc = await db.doc(getProjectDocRef(projectId)).get();
    if (!projectDoc.exists) {
      return res.status(400).send("InvalidProject Id");
    }
    const user: UserIdWithName = { id: req.user!.id, name: req.user!.name };
    const projectForSubmit: Partial<Project> = {
      ...project,
      updatedAt: new Date(),
      updatedBy: user
    };
    console.log("Project For Submit: ", projectForSubmit);
    await db.doc(getProjectDocRef(projectId)).update(projectForSubmit);
    res.send("Project successfully updated!");
    return res;
  } catch (err) {
    Sentry.captureException(err);
    return res.status(500).send("Something Went Wrong!");
  }
};

export const deleteProject = async (req: DeleteProjectReq, res: Response): Promise<Response> => {
  try {
    const { projectId } = req.params;
    console.log(req.params);
    const projectDoc = await db.doc(getProjectDocRef(projectId)).get();
    if (!projectDoc.exists) {
      return res.status(400).send("Invalid Project Id");
    }
    await db.doc(getProjectDocRef(projectId)).delete();
    res.send("Project successfully deleted");
    return res;
  } catch (err) {
    Sentry.captureException(err);
    return res.status(500).send("Something Went Wrong!");
  }
};
