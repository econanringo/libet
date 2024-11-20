"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";
import Link from "next/link";
import Image from "next/image";
import { Video } from "../types";

export default function VideoListPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  // Firebase からデータをフェッチする関数
  const fetchVideos = async () => {
    setLoading(true);
    const videosRef = collection(db, "videos");
    const snapshot = await getDocs(videosRef);

    const videoList: Video[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Video[];
    setVideos(videoList);
    setLoading(false);
  };

  // 初回レンダリング時とリロードボタン押下時にデータを取得
  useEffect(() => {
    fetchVideos();
  }, []);

  if (loading) {
    return <p>Loading videos...</p>;
  }

  return (
    <div>
      <h1>Video List</h1>
      <button
        onClick={fetchVideos}
        style={{
          padding: "10px 20px",
          marginBottom: "20px",
          backgroundColor: "#0070f3",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Refresh
      </button>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {videos.map((video) => (
          <li key={video.id} style={{ marginBottom: "20px" }}>
            <Link href={`/videos/${video.id}`}>
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
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
