import "./App.css";
import { useEffect, useState } from "react";
import { parse } from "@std/csv";
import { CourseStatus, CourseStatusMap, SyllabusItem } from "./types.ts";
import { CSV_COLUMNS, CSV_FILES } from "./constants.ts";
import { SyllabusTable } from "./components/SyllabusTable.tsx";
import { GraduationRequirementChecker } from "./components/GraduationRequirementChecker.tsx";

// LocalStorageのキー
const STORAGE_KEY = "course-statuses";

function App() {
  const [syllabusItems, setSyllabusItems] = useState<SyllabusItem[]>([]);
  // 科目番号をキーとして、履修状態を保存するオブジェクト
  const [courseStatuses, setCourseStatuses] = useState<CourseStatusMap>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCSVs = async () => {
      try {
        const allItems: SyllabusItem[] = [];

        // 全てのCSVファイルを並行して読み込む
        await Promise.all(
          CSV_FILES.map(async (filePath) => {
            const response = await fetch(filePath);
            const text = await response.text();

            // 1行目（ヘッダー行）を除外
            const lines = text.split("\n");
            const csvText = lines.slice(1).join("\n");

            // Denoの標準ライブラリを使用してCSVをパース
            const data = parse(csvText, {
              columns: CSV_COLUMNS,
            });

            // 全てのアイテムを1つの配列に追加
            allItems.push(...(data as SyllabusItem[]));
          }),
        );

        // すべてのデータをまとめてセット
        setSyllabusItems(allItems);

        // LocalStorageから履修状態を取得
        let initialStatuses: CourseStatusMap = {};
        try {
          const savedStatuses = localStorage.getItem(STORAGE_KEY);
          if (savedStatuses) {
            initialStatuses = JSON.parse(savedStatuses);
            console.log("LocalStorageから履修状態を復元しました");
          }
        } catch (e) {
          console.error("LocalStorageからの復元に失敗しました", e);
        }

        // 新しい科目があれば未履修として追加
        allItems.forEach((item) => {
          if (!initialStatuses[item.科目番号]) {
            initialStatuses[item.科目番号] = "未履修";
          }
        });

        setCourseStatuses(initialStatuses);
      } catch (err) {
        setError(
          "CSVデータの読み込みに失敗しました: " +
            (err instanceof Error ? err.message : String(err)),
        );
      } finally {
        setLoading(false);
      }
    };

    loadCSVs();
  }, []);

  // 履修状態が変更されるたびにLocalStorageに保存
  useEffect(() => {
    if (Object.keys(courseStatuses).length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(courseStatuses));
      } catch (e) {
        console.error("LocalStorageへの保存に失敗しました", e);
      }
    }
  }, [courseStatuses]);

  // 履修状態が変更されたときの処理
  const handleStatusChange = (courseCode: string, newStatus: CourseStatus) => {
    setCourseStatuses((prev: CourseStatusMap) => ({
      ...prev,
      [courseCode]: newStatus,
    }));
  };

  return (
    <div className="flex flex-col w-full h-screen bg-[#fafafa] text-[#111]">
      <div className="flex flex-1 overflow-hidden">
        {/* 左側 */}
        <div className="w-1/2 p-4 overflow-auto">
          <h2 className="text-2xl font-bold mb-4">シラバスデータ</h2>
          <SyllabusTable
            syllabusItems={syllabusItems}
            courseStatuses={courseStatuses}
            onStatusChange={handleStatusChange}
            loading={loading}
            error={error}
          />
        </div>

        {/* 右側 */}
        <div className="w-1/2 bg-white border-l border-[#d0d0d0] p-4 overflow-auto">
          <h2 className="text-2xl font-bold mb-4">卒業要件チェッカー</h2>
          {loading
            ? <p className="text-center py-8">読み込み中...</p>
            : error
            ? <p className="text-red-500 text-center py-8">{error}</p>
            : (
              <GraduationRequirementChecker
                syllabusItems={syllabusItems}
                courseStatuses={courseStatuses}
              />
            )}
        </div>
      </div>
      
      {/* フッター */}
      <footer className="py-3 px-4 border-t border-[#d0d0d0] bg-white text-center text-sm text-gray-600">
        <div className="flex justify-center items-center space-x-2">
          <span>豊田高専専攻科 卒業要件チェッカー</span>
          <span className="text-gray-400">|</span>
          <a 
            href="https://github.com/lemonadern/checker" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center hover:text-blue-600 transition-colors"
          >
            <svg className="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512">
              <path fill="currentColor" d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z" />
            </svg>
            GitHub
          </a>
        </div>
      </footer>
    </div>
  );
}

export default App;
