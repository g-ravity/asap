import { db } from "../config/firebase";

export const UserDBRef = (): FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData> =>
  db.collection(`users`);

export const UserDocRef = (id: string): FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData> =>
  db.doc(`users/${id}`);

export const ProjectDBRef = (): FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData> =>
  db.collection(`projects`);

export const ProjectDocRef = (id: string): FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData> =>
  db.doc(`projects/${id}`);

export const ListDBRef = (): FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData> =>
  db.collection(`lists`);

export const ListDocRef = (id: string): FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData> =>
  db.doc(`lists/${id}`);
