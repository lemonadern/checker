import React, { useState } from "react";
import { CourseStatusMap, SyllabusItem } from "../types.ts";
import { checkAllRequirements } from "../requirements/index.ts";

// フィルターの種類を定義
type FilterType = "all" | "satisfied" | "unsatisfied";

interface GraduationRequirementCheckerProps {
  syllabusItems: SyllabusItem[];
  courseStatuses: CourseStatusMap;
}

export const GraduationRequirementChecker: React.FC<
  GraduationRequirementCheckerProps
> = ({
  syllabusItems,
  courseStatuses,
}: GraduationRequirementCheckerProps) => {
  // 表示フィルターの状態
  const [filterType, setFilterType] = useState<FilterType>("all");

  // 卒業要件のチェックを実行
  const { results, allSatisfied } = checkAllRequirements(
    syllabusItems,
    courseStatuses,
  );

  // フィルタリングされた結果
  const filteredResults = results.filter((result) => {
    if (filterType === "all") return true;
    if (filterType === "satisfied") return result.satisfied;
    if (filterType === "unsatisfied") return !result.satisfied;
    return true;
  });

  // 表示するフィルターラベル
  const filterLabels: Record<FilterType, string> = {
    all: "すべて",
    satisfied: "合格のみ",
    unsatisfied: "不合格のみ",
  };

  return (
    <div className="space-y-4">
      {/* 全体の結果 */}
      <div
        className={`p-4 border rounded ${
          allSatisfied
            ? "bg-green-50 border-green-500"
            : "bg-red-50 border-red-500"
        }`}
      >
        <h3 className="text-xl font-semibold mb-2">卒業要件判定</h3>
        <div
          className={`text-lg font-bold ${
            allSatisfied ? "text-green-600" : "text-red-600"
          }`}
        >
          {allSatisfied ? "合格" : "不合格"}
        </div>
        <div className="text-gray-700 mt-1">
          パスしたルール:{" "}
          {results.filter((result) => result.satisfied).length}/{results.length}
        </div>
      </div>

      {/* フィルター選択UI */}
      <div className="bg-white p-4 border border-[#d0d0d0] rounded">
        <div className="flex items-center space-x-2">
          <span className="font-medium">表示:</span>
          <div className="flex space-x-2">
            {(Object.keys(filterLabels) as FilterType[]).map((type) => (
              <button
                key={type}
                className={`px-3 py-1 rounded text-sm font-medium ${
                  filterType === type
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
                onClick={() => setFilterType(type)}
              >
                {filterLabels[type]}
                {type !== "all" && (
                  <span className="ml-1">
                    ({type === "satisfied" 
                      ? results.filter(r => r.satisfied).length
                      : results.filter(r => !r.satisfied).length})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 個別の要件チェック結果 */}
      {filteredResults.length === 0 ? (
        <div className="bg-white p-4 border border-[#d0d0d0] rounded text-center text-gray-500">
          表示する要件がありません
        </div>
      ) : (
        filteredResults.map((result, index) => (
          <div
            key={index}
            className="bg-white p-4 border border-[#d0d0d0] rounded"
          >
            <h3 className="text-xl font-semibold mb-2">{result.name}</h3>
            <div className="flex items-center space-x-2 mb-2">
              <div
                className={`text-lg font-bold ${
                  result.satisfied ? "text-green-600" : "text-red-600"
                }`}
              >
                {result.satisfied ? "合格" : "不合格"}
              </div>
              {result.details && (
                <div className="text-gray-700">
                  {result.details.completed !== undefined &&
                    result.details.total !== undefined && (
                    <span>
                      ({result.details.completed}/{result.details.total})
                    </span>
                  )}
                </div>
              )}
            </div>
            <p className="text-gray-700">{result.message}</p>

            {/* 詳細情報表示 */}
            {result.details && (
              <div className="mt-2">
                <h4 className="font-semibold text-lg mb-1">詳細情報</h4>
                <div className="space-y-3">
                  {/* 単位取得済み・履修予定の科目 */}
                  {result.details.completedItems &&
                    result.details.completedItems.length > 0 && (
                    <div>
                      <h5 className="font-medium">取得済み・履修予定の科目</h5>
                      <ul className="bg-gray-50 p-3 border border-gray-200 rounded max-h-32 overflow-y-auto">
                        {result.details.completedItems.map((item, itemIndex) => (
                          <li
                            key={`complete-${itemIndex}`}
                            className="mb-1 text-green-600"
                          >
                            {item.授業科目} ({item.単位数}単位)
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* 未取得の科目 */}
                  {result.details.incompleteItems &&
                    result.details.incompleteItems.length > 0 && (
                    <div>
                      <h5 className="font-medium">未取得の科目</h5>
                      <ul className="bg-gray-50 p-3 border border-gray-200 rounded max-h-32 overflow-y-auto">
                        {result.details.incompleteItems.map((item, itemIndex) => (
                          <li
                            key={`incomplete-${itemIndex}`}
                            className="mb-1 text-red-600"
                          >
                            {item.授業科目} ({item.単位数}単位)
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};
