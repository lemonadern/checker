import React, { useMemo, useState } from "react";
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
  // フィルターの状態
  const [courseTypeFilter, setCourseTypeFilter] = useState<string>("すべて");
  const [gradeFilter, setGradeFilter] = useState<string>("すべて");
  const [categoryFilter, setCategoryFilter] = useState<string>("すべて");

  // 選択状態の管理
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [bulkStatus, setBulkStatus] = useState<CourseStatus>("未履修");

  // 展開状態の管理（スマホ表示用）
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  // 本科/専攻科の一覧を取得
  const courseTypes = useMemo(() => {
    const types = new Set<string>();
    syllabusItems.forEach((item) => {
      types.add(item.本科または専攻科);
    });
    return ["すべて", ...Array.from(types)];
  }, [syllabusItems]);

  // 科目区分（専門/一般）の一覧を取得
  const categories = useMemo(() => {
    const cats = new Set<string>();
    syllabusItems.forEach((item) => {
      cats.add(item.科目区分1);
    });
    return ["すべて", ...Array.from(cats)];
  }, [syllabusItems]);

  // 学年の一覧を取得
  const grades = useMemo(() => {
    const gradesSet = new Set<string>();
    syllabusItems.forEach((item) => {
      gradesSet.add(item.学年);
    });
    return ["すべて", ...Array.from(gradesSet).sort()];
  }, [syllabusItems]);

  // フィルタリングされたアイテム
  const filteredItems = useMemo(() => {
    return syllabusItems.filter((item) => {
      // 本科/専攻科でフィルタリング
      if (
        courseTypeFilter !== "すべて" &&
        item.本科または専攻科 !== courseTypeFilter
      ) {
        return false;
      }

      // 科目区分（専門/一般）でフィルタリング
      if (
        categoryFilter !== "すべて" &&
        item.科目区分1 !== categoryFilter
      ) {
        return false;
      }

      // 学年でフィルタリング
      if (gradeFilter !== "すべて" && item.学年 !== gradeFilter) {
        return false;
      }

      return true;
    });
  }, [syllabusItems, courseTypeFilter, categoryFilter, gradeFilter]);

  // 全て選択/解除の処理
  const toggleSelectAll = (isSelected: boolean) => {
    if (isSelected) {
      // 全て選択
      const newSelectedItems = new Set<string>();
      filteredItems.forEach((item: SyllabusItem) => {
        newSelectedItems.add(item.科目番号);
      });
      setSelectedItems(newSelectedItems);
    } else {
      // 全て解除
      setSelectedItems(new Set());
    }
  };

  // 個別の選択変更処理
  const toggleSelectItem = (courseCode: string, isSelected: boolean) => {
    const newSelectedItems = new Set(selectedItems);
    if (isSelected) {
      newSelectedItems.add(courseCode);
    } else {
      newSelectedItems.delete(courseCode);
    }
    setSelectedItems(newSelectedItems);
  };

  // 行の展開/折りたたみを切り替え
  const toggleRowExpand = (courseCode: string) => {
    const newExpandedRows = new Set(expandedRows);
    if (expandedRows.has(courseCode)) {
      newExpandedRows.delete(courseCode);
    } else {
      newExpandedRows.add(courseCode);
    }
    setExpandedRows(newExpandedRows);
  };

  // 選択したアイテムの一括更新
  const updateSelectedItems = () => {
    // 選択されたアイテムがない場合は何もしない
    if (selectedItems.size === 0) return;

    // 各選択アイテムの状態を更新
    selectedItems.forEach((courseCode: string) => {
      onStatusChange(courseCode, bulkStatus);
    });
  };

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

  // 全て選択されているかどうか
  const isAllSelected = filteredItems.length > 0 &&
    filteredItems.every((item: SyllabusItem) =>
      selectedItems.has(item.科目番号)
    );

  // 選択件数
  const selectedCount = selectedItems.size;

  return (
    <div>
      {/* フィルターUI */}
      <div className="mb-4 flex flex-wrap gap-4">
        <div className="flex items-center">
          <label htmlFor="courseTypeFilter" className="mr-2 font-medium">
            本科/専攻科:
          </label>
          <select
            id="courseTypeFilter"
            className="p-2 border border-[#d0d0d0] rounded bg-white focus:ring-2 focus:ring-[#000] focus:outline-none"
            value={courseTypeFilter}
            onChange={(e) => setCourseTypeFilter(e.target.value)}
          >
            {courseTypes.map((type: string) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center">
          <label htmlFor="gradeFilter" className="mr-2 font-medium">
            学年:
          </label>
          <select
            id="gradeFilter"
            className="p-2 border border-[#d0d0d0] rounded bg-white focus:ring-2 focus:ring-[#000] focus:outline-none"
            value={gradeFilter}
            onChange={(e) => setGradeFilter(e.target.value)}
          >
            {grades.map((grade: string) => (
              <option key={grade} value={grade}>{grade}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center">
          <label htmlFor="categoryFilter" className="mr-2 font-medium">
            一般/専門:
          </label>
          <select
            id="categoryFilter"
            className="p-2 border border-[#d0d0d0] rounded bg-white focus:ring-2 focus:ring-[#000] focus:outline-none"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            {categories.map((category: string) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div className="ml-auto text-sm text-gray-600">
          表示: {filteredItems.length}科目 / 全{syllabusItems.length}科目
        </div>
      </div>

      {/* 一括更新UI */}
      {selectedCount > 0 && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded flex items-center gap-3">
          <span className="font-medium">{selectedCount}科目を選択中</span>
          <select
            className={`p-2 border border-[#d0d0d0] rounded ${
              getSelectBgColor(bulkStatus)
            } focus:ring-2 focus:ring-[#000] focus:outline-none`}
            value={bulkStatus}
            onChange={(e) => setBulkStatus(e.target.value as CourseStatus)}
          >
            <option value="未履修">未履修</option>
            <option value="単位取得済み">単位取得済み</option>
            <option value="単位なし（F）">単位なし（F）</option>
            <option value="履修予定">履修予定</option>
            <option value="履修かつF予定">履修かつF予定</option>
          </select>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded"
            onClick={updateSelectedItems}
          >
            一括更新
          </button>
          <button
            className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded"
            onClick={() => setSelectedItems(new Set())}
          >
            選択解除
          </button>
        </div>
      )}

      {/* PCではテーブル表示、スマホではアコーディオン表示 */}
      <div className="hidden md:block">
        <table className="min-w-full bg-white border border-[#d0d0d0]">
          <thead>
            <tr className="bg-[#fafafa]">
              <th className="border-b border-[#d0d0d0] px-4 py-2 text-left">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={(e) => toggleSelectAll(e.target.checked)}
                  className="w-4 h-4 accent-blue-500"
                  title="全て選択/解除"
                />
              </th>
              <th className="border-b border-[#d0d0d0] px-4 py-2 text-left hidden md:table-cell">
                本科または専攻科
              </th>
              <th className="border-b border-[#d0d0d0] px-4 py-2 text-left hidden md:table-cell">
                学年
              </th>
              <th className="border-b border-[#d0d0d0] px-4 py-2 text-left">
                授業科目
              </th>
              <th className="border-b border-[#d0d0d0] px-4 py-2 text-left">
                単位数
              </th>
              <th className="border-b border-[#d0d0d0] px-4 py-2 text-left">
                履修状態
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item: SyllabusItem, index: number) => (
              <tr
                key={index}
                className={`${
                  getStatusBgColor(courseStatuses[item.科目番号])
                } ${
                  selectedItems.has(item.科目番号)
                    ? "bg-opacity-70 border-l-4 border-blue-500"
                    : ""
                }`}
              >
                <td className="border-b border-[#d0d0d0] px-4 py-2">
                  <input
                    type="checkbox"
                    checked={selectedItems.has(item.科目番号)}
                    onChange={(e) =>
                      toggleSelectItem(item.科目番号, e.target.checked)}
                    className="w-4 h-4 accent-blue-500"
                  />
                </td>
                <td className="border-b border-[#d0d0d0] px-4 py-2 hidden md:table-cell">
                  {item.本科または専攻科}
                </td>
                <td className="border-b border-[#d0d0d0] px-4 py-2 hidden md:table-cell">
                  {item.学年}
                </td>
                <td className="border-b border-[#d0d0d0] px-4 py-2">
                  {item.授業科目}
                </td>
                <td className="border-b border-[#d0d0d0] px-4 py-2">
                  {item.単位数}
                </td>
                <td className="border-b border-[#d0d0d0] px-4 py-2">
                  <select
                    className={`w-full p-2 border border-[#d0d0d0] rounded ${
                      getSelectBgColor(courseStatuses[item.科目番号])
                    } focus:ring-2 focus:ring-[#000] focus:outline-none`}
                    value={courseStatuses[item.科目番号] || "未履修"}
                    onChange={(e) =>
                      onStatusChange(
                        item.科目番号,
                        e.target.value as CourseStatus,
                      )}
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
      </div>

      {/* スマホ表示用アコーディオンリスト */}
      <div className="md:hidden">
        <div className="border border-[#d0d0d0] rounded-lg overflow-hidden bg-white">
          {filteredItems.map((item: SyllabusItem, index: number) => {
            const isExpanded = expandedRows.has(item.科目番号);
            return (
              <div
                key={index}
                className={`border-b border-[#d0d0d0] last:border-b-0 ${
                  getStatusBgColor(courseStatuses[item.科目番号])
                } ${
                  selectedItems.has(item.科目番号)
                    ? "bg-opacity-70 border-l-4 border-blue-500"
                    : ""
                }`}
              >
                {/* ヘッダー部分 - 常に表示 */}
                <div
                  className="flex items-center justify-between p-3 cursor-pointer"
                  onClick={() => toggleRowExpand(item.科目番号)}
                >
                  <div className="flex items-center flex-1">
                    <input
                      type="checkbox"
                      checked={selectedItems.has(item.科目番号)}
                      onChange={(e) => {
                        e.stopPropagation();
                        toggleSelectItem(item.科目番号, e.target.checked);
                      }}
                      className="w-4 h-4 accent-blue-500 mr-3"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div className="flex-1">
                      <div className="font-medium">{item.授業科目}</div>
                      <div className="text-sm text-gray-600">
                        {item.単位数}単位
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <select
                      className={`mr-3 p-2 border border-[#d0d0d0] rounded ${
                        getSelectBgColor(courseStatuses[item.科目番号])
                      } focus:ring-2 focus:ring-[#000] focus:outline-none`}
                      value={courseStatuses[item.科目番号] || "未履修"}
                      onChange={(e) => {
                        e.stopPropagation();
                        onStatusChange(
                          item.科目番号,
                          e.target.value as CourseStatus,
                        );
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <option value="未履修">未履修</option>
                      <option value="単位取得済み">単位取得済み</option>
                      <option value="単位なし（F）">単位なし（F）</option>
                      <option value="履修予定">履修予定</option>
                      <option value="履修かつF予定">履修かつF予定</option>
                    </select>

                    <svg
                      className={`w-5 h-5 transform transition-transform duration-200 ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>

                {/* 詳細情報 - 展開時のみ表示 */}
                <div
                  className={`px-4 pb-3 pt-0 transition-all duration-200 ${
                    isExpanded
                      ? "max-h-36 opacity-100"
                      : "max-h-0 opacity-0 overflow-hidden"
                  }`}
                >
                  <div className="border-t border-gray-200 pt-2 text-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-gray-600">本科または専攻科:</div>
                      <div>{item.本科または専攻科}</div>

                      <div className="text-gray-600">学年:</div>
                      <div>{item.学年}</div>

                      <div className="text-gray-600">科目区分:</div>
                      <div>{item.科目区分1}</div>

                      <div className="text-gray-600">科目番号:</div>
                      <div>{item.科目番号}</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
