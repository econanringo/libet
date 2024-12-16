import { db } from "../firebaseConfig"; // Firebase設定ファイル
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";

// Video型を外部にエクスポート
export type Video = {
  id?: string;  // `id` は必須ではなく、オプショナルにする
  title: string;
  videoId: string;
  speaker: string;
  date: string;
  tags: string[]; // 必須フィールド
  recaptchaToken: string;
};

// 動画情報を保存する関数
export const saveVideo = async (video: Omit<Video, "id">) => {
  try {
    const docRef = await addDoc(collection(db, "videos"), video);
    console.log("Document written with ID: ", docRef.id);
    
    // 保存後に生成されたIDをvideoオブジェクトに追加
    const savedVideo: Video = { ...video, id: docRef.id };
    return savedVideo;  // 保存された動画オブジェクトを返す
  } catch (e) {
    console.error("Error adding document: ", e);
    return null;
  }
};

// 動画情報を取得する関数（検索対応）
export const fetchFilteredVideos = async ({
  title,
  date,
  speaker,
  tags,
}: {
  title?: string;
  date?: string;
  speaker?: string;
  tags?: string[];
}) => {
  try {
    const videosRef = collection(db, "videos");

    let q = query(videosRef);

    // 日付フィルター（完全一致）
    if (date) {
      q = query(q, where("date", "==", date));
    }

    // タグフィルター
    if (tags && tags.length > 0) {
      tags.forEach(tag => {
        q = query(q, where("tags", "array-contains", tag));
      });
    }

    // Firestoreからすべての動画を取得
    const snapshot = await getDocs(q);
    let videos = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Video[];

    // タイトルや発表者名に対する部分一致検索をクライアントサイドで行う
    if (title) {
      videos = videos.filter((video) =>
        video.title.toLowerCase().includes(title.toLowerCase())
      );
    }

    if (speaker) {
      videos = videos.filter((video) =>
        video.speaker.toLowerCase().includes(speaker.toLowerCase())
      );
    }

    return videos;
  } catch (e) {
    console.error("Error fetching filtered videos: ", e);
    return [];
  }
};
