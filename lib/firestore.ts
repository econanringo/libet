import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { Video } from "../types";

export const saveVideo = async (video: Video) => {
  try {
    const docRef = await addDoc(collection(db, "videos"), video);
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};
