"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { Video } from "@/types";

// YouTube Data API で動画の詳細を取得
const fetchYouTubeDetails = async (videoId: string) => {
  const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
  const url = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=contentDetails&key=${apiKey}`;

  const response = await axios.get(url);
  const duration = response.data.items[0]?.contentDetails?.duration;

  // ISO 8601 のフォーマットを「分:秒」に変換
  const match = duration.match(/PT(\d+M)?(\d+S)?/);
  const minutes = match[1] ? parseInt(match[1]) : 0;
  const seconds = match[2] ? parseInt(match[2]) : 0;

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

export default function VideoListPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  // Firebase から動画データを取得
  const fetchVideos = async () => {
    setLoading(true);
    const videosRef = collection(db, "videos");
    const snapshot = await getDocs(videosRef);

    const videoList: Video[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Video[];

    // YouTube API で各動画の分数を取得
    const videoDetails = await Promise.all(
      videoList.map(async (video) => {
        const duration = await fetchYouTubeDetails(video.videoId);
        return { ...video, duration };
      })
    );

    setVideos(videoDetails);
    setLoading(false);
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  if (loading) {
    return (
      <div role="status" className="h-screen w-screen flex justify-center items-center">
        <svg
          aria-hidden="true"
          className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
          <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
        </svg>
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-2xl text-center font-bold mb-6">動画一覧</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {videos.map((video) => (
          <div key={video.id} className="relative">
            <Link href={`/videos/${video.id}`}>
              <div className="relative w-full h-40">
                <Image
                  src={`https://img.youtube.com/vi/${video.videoId}/0.jpg`}
                  alt={video.title}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg"
                />
                {/* 動画の再生時間 */}
                <span className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-sm px-2 py-1 rounded">
                  {video.duration}
                </span>
              </div>
              <h2 className="text-lg font-semibold mt-2">{video.title}</h2>
              <p className="text-sm text-gray-600">{video.speaker}</p>
            </Link>
          </div>
        ))}
      </div>
      <div className="text-center">
        <a href="/search" className="text-white bg-red-500 hover:bg-red-600 focus:ring-4 focus:ring-primary-300 rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800">もっと動画を見る</a>
      </div>
    </div>
  );
}
