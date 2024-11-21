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
    return <p className="text-center text-xl">Loading videos...</p>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* 最新の動画 */}
      <div className="mb-8 flex items-center space-x-8">
        {videos.length > 0 && (
          <Link href={`/videos/${videos[0].id}`} className="flex w-full">
            {/* 左側にタイトルと情報 */}
            <div className="flex-1">
              <small className="text-red-500 font-bold">Recommend</small>
              <h2 className="text-3xl font-semibold text-gray-800 mb-2">
                {videos[0].title}
              </h2>
              <p className="text-sm text-gray-600">{videos[0].speaker}</p>
              <p className="text-sm text-gray-600">{videos[0].date}</p>
            </div>

            {/* 右側にサムネイル画像 (少し大きめ) */}
            <div className="relative w-full sm:w-1/2 lg:w-1/2 h-56 sm:h-64 lg:h-72 ml-4">
              <Image
                src={`https://img.youtube.com/vi/${videos[0].videoId}/0.jpg`}
                alt={videos[0].title}
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
            </div>
          </Link>
        )}
      </div>
      <div className="border border-gray-300"></div>
      {/* 他の動画リスト（4つ横並び） */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {videos.slice(1, 5).map((video) => (
          <div
            key={video.id}
            className="relative b pt-4 pb-6 border-r- border-gray-300"
          >
            {/* サムネイル画像 */}

            <Link href={`/videos/${video.id}`}>
              <div className="relative w-full h-40 mb-4">
                <Image
                  src={`https://img.youtube.com/vi/${video.videoId}/0.jpg`}
                  alt={video.title}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg"
                />
              </div>

              {/* 動画情報 */}
              <h2 className="text-lg font-semibold text-gray-800">{video.title}</h2>
              <p className="text-sm text-gray-600">{video.speaker}</p>
              <p className="text-sm text-gray-600">{video.date}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
