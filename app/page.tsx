import Link from "next/link";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { Video } from "../types";

const VideosPage = async () => {
  // Firestore から動画データを取得
  const videosCollection = collection(db, "videos");
  const querySnapshot = await getDocs(videosCollection);

  // 取得した動画データを配列に変換
  const videos: Video[] = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Video),
  }));

  return (
    <div>
      <h1>Video List</h1>
      <ul>
        {videos.map((video) => (
          <li key={video.id}>
            <Link href={`/videos/${video.id}`}>
                <h2>{video.title}</h2>
                <p>Speaker: {video.speaker}</p>
                <p>Date: {video.date}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VideosPage;
