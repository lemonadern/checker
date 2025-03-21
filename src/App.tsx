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
    <div className="flex w-full h-screen bg-[#fafafa] text-[#111]">
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
  );
}

export default App;
