import * as admin from "firebase-admin";
import { Request, Response } from "express";
import * as Yup from "yup";
import { Project } from "../../../types";

const db = admin.firestore();

type AddProjectReq = Request<
  {},
  null,
  {
    project: Project;
  }
>;

const projectSchema = Yup.object().shape({
  name: Yup.string().min(3, "Too short!").required("Required!"),
  listIds: Yup.array().of(Yup.string()).nullable().required("Required!"),
  memberIds: Yup.array().of(Yup.string()).nullable().required("Required!"),
  createdBy: Yup.object().shape({
    name: Yup.string().required("Required!"),
    id: Yup.string().required("Required!")
  }),
  modifiedBy: Yup.object().shape({
    name: Yup.string().required("Required!"),
    id: Yup.string().required("Required!")
  }),
  createdAt: Yup.date().default(() => new Date())
});

export const addProject = (req: AddProjectReq, res: Response): Response => {
  const { project } = req.body;
  if (!project) {
    return res.status(500).send("Invalid Parameters");
  }
  return res;
};
