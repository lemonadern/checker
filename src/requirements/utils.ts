import { CourseStatusMap, SyllabusItem } from "../types.ts";

/**
 * 単位取得済みまたは履修予定の科目をフィルタリングするユーティリティ関数
 * @param courses フィルタリング対象の科目リスト
 * @param courseStatuses 科目の履修状態
 * @returns 単位取得済みまたは履修予定の科目リスト
 */
export const filterCompletedCourses = (
  courses: SyllabusItem[],
  courseStatuses: CourseStatusMap,
): SyllabusItem[] => {
  return courses.filter((course) => {
    const status = courseStatuses[course.科目番号] || "未履修";
    return status === "単位取得済み" || status === "履修予定";
  });
};

/**
 * 未履修の科目をフィルタリングするユーティリティ関数
 * @param courses フィルタリング対象の科目リスト
 * @param courseStatuses 科目の履修状態
 * @returns 未履修の科目リスト
 */
export const filterIncompleteCourses = (
  courses: SyllabusItem[],
  courseStatuses: CourseStatusMap,
): SyllabusItem[] => {
  return courses.filter((course) => {
    const status = courseStatuses[course.科目番号] || "未履修";
    return status !== "単位取得済み" && status !== "履修予定";
  });
};
