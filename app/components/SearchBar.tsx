import { useState } from "react";

interface SearchBarProps {
  onSearch: (keyword: string, tag: string | null) => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [keyword, setKeyword] = useState("");
  const [tag, setTag] = useState("");

  const handleSearch = () => {
    onSearch(keyword.trim(), tag.trim() || null); // タグが空の場合は null を渡す
  };

  return (
    <div className="w-full p-4 bg-gray-100 flex flex-col gap-4 md:flex-row items-center">
      <input
        type="text"
        placeholder="キーワードを入力"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
      />
      <input
        type="text"
        placeholder="タグを入力 (オプション)"
        value={tag}
        onChange={(e) => setTag(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
      />
      <button
        onClick={handleSearch}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        検索
      </button>
    </div>
  );
};

export default SearchBar;
