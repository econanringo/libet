import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";
import Link from "next/link";
import Image from "next/image";
import { Video } from "../types";

export default async function VideoListPage() {
  const videosRef = collection(db, "videos");
  const snapshot = await getDocs(videosRef);

  const videos: Video[] = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Video[];

  return (
    <div>
      <h1>Video List</h1>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {videos.map((video) => (
          <li key={video.id} style={{ marginBottom: "20px" }}>
            <Link href={`/videos/${video.id}`}>
              <a style={{ textDecoration: "none", color: "inherit" }}>
                {/* サムネイル画像 */}
                <div
                  style={{
                    position: "relative",
                    width: "320px", // サムネイルの幅
                    height: "180px", // サムネイルの高さ (16:9 アスペクト比)
                    overflow: "hidden",
                    borderRadius: "8px", // 角を丸くする
                  }}
                >
                  <Image
                    src={`https://img.youtube.com/vi/${video.videoId}/0.jpg`}
                    alt={video.title}
                    layout="fill" // 親要素を埋める
                    objectFit="cover" // 画像を親要素にフィット
                  />
                </div>
                <h2 style={{ margin: "10px 0 5px" }}>{video.title}</h2>
                <p>Speaker: {video.speaker}</p>
                <p>Date: {video.date}</p>
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
