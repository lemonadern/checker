import React from "react";
import { CourseStatusMap, SyllabusItem } from "../types.ts";
import { checkAllRequirements } from "../requirements/index.ts";

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
  // 卒業要件のチェックを実行
  const { results, allSatisfied } = checkAllRequirements(
    syllabusItems,
    courseStatuses,
  );

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
      </div>

      {/* 個別の要件チェック結果 */}
      {results.map((result, index) => (
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

          {/* 未履修の必履修科目などの詳細表示 */}
          {!result.satisfied && result.details?.items &&
            result.details.items.length > 0 && (
            <div className="mt-2">
              <h4 className="font-semibold text-lg mb-1">詳細情報</h4>
              <ul className="bg-gray-50 p-3 border border-gray-200 rounded max-h-32 overflow-y-auto">
                {result.details.items.map((
                  item: SyllabusItem,
                  itemIndex: number,
                ) => (
                  <li key={itemIndex} className="mb-1 text-red-600">
                    {item.授業科目}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
