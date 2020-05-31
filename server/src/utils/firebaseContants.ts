import { db } from "../config/firebase";

export const ProjectDB = (): FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData> =>
  db.collection(`projects`);

export const ProjectDoc = (id: string): FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData> =>
  db.doc(`projects/${id}`);

export const UserDB = (): FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData> =>
  db.collection(`users`);

export const UserDoc = (id: string): FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData> =>
  db.doc(`users/${id}`);
