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
    return (
        <div role="status" className="h-screen w-screen flex justify-center items-center">
          <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" /><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" /></svg>
          <span className="sr-only">Loading...</span>
        </div>

    )
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
