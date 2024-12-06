import { db } from "../firebaseConfig"; // Firebase設定ファイル
import { collection, addDoc } from "firebase/firestore";

type Video = {
  title: string;
  videoId: string;
  speaker: string;
  date: string;
  tags: string[]; // 必須フィールド
  recaptchaToken: string;
};

// 動画情報を保存する関数
export const saveVideo = async (video: {
  title: string;
  videoId: string;
  speaker: string;
  date: string;
  tags: string[]; // タグをサポート
  recaptchaToken: string;
}) => {
  try {
    const docRef = await addDoc(collection(db, "videos"), video);
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};
