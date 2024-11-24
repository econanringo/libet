// lib/firestore.ts
import { db } from "../firebaseConfig"; // Firebase設定ファイルからdbをインポート
import { collection, addDoc } from "firebase/firestore";

export const saveVideo = async (video: { title: string, videoId: string, speaker: string, date: string, recaptchaToken: string }) => {
  try {
    const docRef = await addDoc(collection(db, "videos"), video);
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};
