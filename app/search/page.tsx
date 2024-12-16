"use client";

import { useState } from "react";
import { fetchFilteredVideos, Video } from "@/lib/firestore";
import Link from "next/link";
import Image from "next/image";

export default function DiscoverPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [filters, setFilters] = useState({
    title: "",
    date: "",
    speaker: "",
    tags: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);

    // 空文字があれば検索を実行しない
    if (!filters.title && !filters.date && !filters.speaker && !filters.tags) {
      setVideos([]);
      setLoading(false);
      return;
    }

    // タグをカンマで区切って配列に変換
    const tagsArray = filters.tags.split(",").map((tag) => tag.trim()).filter(Boolean);

    // Firestoreから動画データを取得
    const results = await fetchFilteredVideos({
      title: filters.title || undefined,
      date: filters.date || undefined,
      speaker: filters.speaker || undefined,
      tags: tagsArray.length > 0 ? tagsArray : undefined,
    });

    setVideos(results);
    setLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-2xl text-center font-bold mb-6">動画検索</h1>
      <div className="mb-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          <input
            type="text"
            placeholder="タイトルで検索"
            value={filters.title}
            onChange={(e) => setFilters({ ...filters, title: e.target.value })}
            className="border border-gray-300 rounded-md p-2"
          />
          <input
            type="date"
            value={filters.date}
            onChange={(e) => setFilters({ ...filters, date: e.target.value })}
            className="border border-gray-300 rounded-md p-2"
          />
          <input
            type="text"
            placeholder="発表者名で検索"
            value={filters.speaker}
            onChange={(e) => setFilters({ ...filters, speaker: e.target.value })}
            className="border border-gray-300 rounded-md p-2"
          />
          <input
            type="text"
            placeholder="タグ（カンマ区切り）"
            value={filters.tags}
            onChange={(e) => setFilters({ ...filters, tags: e.target.value })}
            className="border border-gray-300 rounded-md p-2"
          />
          <button
            type="submit"
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
          >
            検索
          </button>
        </form>
        
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
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
                </div>
                <h2 className="text-lg font-semibold mt-2">{video.title}</h2>
                <p className="text-sm text-gray-600">{video.speaker}</p>
                <p className="text-sm text-gray-500">{video.date}</p>
              </Link>
            </div>
          ))}
        </div>
      )}
      <div className="text-center">
        <a href="/discover" className="text-white bg-red-500 hover:bg-red-600 focus:ring-4 focus:ring-primary-300 rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800">動画一覧に戻る</a>
      </div>
    </div>
    
  );
}
