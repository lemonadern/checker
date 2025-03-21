import React from "react";
import { CourseStatus, CourseStatusMap, SyllabusItem } from "../types.ts";

interface SyllabusTableProps {
  syllabusItems: SyllabusItem[];
  courseStatuses: CourseStatusMap;
  onStatusChange: (courseCode: string, newStatus: CourseStatus) => void;
  loading: boolean;
  error: string | null;
}

export const SyllabusTable: React.FC<SyllabusTableProps> = ({
  syllabusItems,
  courseStatuses,
  onStatusChange,
  loading,
  error,
}: SyllabusTableProps) => {
  // 履修状態に応じた背景色を取得
  const getStatusBgColor = (status: CourseStatus): string => {
    switch (status) {
      case "単位取得済み":
        return "bg-green-100";
      case "単位なし（F）":
        return "bg-red-100";
      case "履修予定":
        return "bg-blue-100";
      case "履修かつF予定":
        return "bg-amber-100";
      default:
        return "";
    }
  };

  // 履修状態に応じたセレクトボックスの背景色を取得（より濃い色）
  const getSelectBgColor = (status: CourseStatus): string => {
    switch (status) {
      case "単位取得済み":
        return "bg-green-200";
      case "単位なし（F）":
        return "bg-red-200";
      case "履修予定":
        return "bg-blue-200";
      case "履修かつF予定":
        return "bg-amber-200";
      default:
        return "bg-gray-200";
    }
  };

  if (loading) {
    return <p className="text-center py-8">読み込み中...</p>;
  }

  if (error) {
    return <p className="text-red-500 text-center py-8">{error}</p>;
  }

  return (
    <table className="min-w-full bg-white border border-[#d0d0d0]">
      <thead>
        <tr className="bg-[#fafafa]">
          <th className="border-b border-[#d0d0d0] px-4 py-2 text-left">
            授業科目
          </th>
          <th className="border-b border-[#d0d0d0] px-4 py-2 text-left">
            学科
          </th>
          <th className="border-b border-[#d0d0d0] px-4 py-2 text-left">
            単位数
          </th>
          <th className="border-b border-[#d0d0d0] px-4 py-2 text-left">
            学年
          </th>
          <th className="border-b border-[#d0d0d0] px-4 py-2 text-left">
            履修状態
          </th>
        </tr>
      </thead>
      <tbody>
        {syllabusItems.map((item: SyllabusItem, index: number) => (
          <tr
            key={index}
            className={`${getStatusBgColor(courseStatuses[item.科目番号])}`}
          >
            <td className="border-b border-[#d0d0d0] px-4 py-2">
              {item.授業科目}
            </td>
            <td className="border-b border-[#d0d0d0] px-4 py-2">{item.学科}</td>
            <td className="border-b border-[#d0d0d0] px-4 py-2">
              {item.単位数}
            </td>
            <td className="border-b border-[#d0d0d0] px-4 py-2">{item.学年}</td>
            <td className="border-b border-[#d0d0d0] px-4 py-2">
              <select
                className={`w-full p-2 border border-[#d0d0d0] rounded ${
                  getSelectBgColor(courseStatuses[item.科目番号])
                } focus:ring-2 focus:ring-[#000] focus:outline-none`}
                value={courseStatuses[item.科目番号] || "未履修"}
                onChange={(e) =>
                  onStatusChange(item.科目番号, e.target.value as CourseStatus)}
              >
                <option value="未履修">未履修</option>
                <option value="単位取得済み">単位取得済み</option>
                <option value="単位なし（F）">単位なし（F）</option>
                <option value="履修予定">履修予定</option>
                <option value="履修かつF予定">履修かつF予定</option>
              </select>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
