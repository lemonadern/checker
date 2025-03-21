import {
  CourseStatusMap,
  RequirementCheckFn,
  RequirementCheckResult,
  SyllabusItem,
} from "../../types.ts";

/**
 * 必履修科目のチェック関数
 * すべての必履修科目を修得しているかチェックする
 */
export const checkRequiredCourses: RequirementCheckFn = (
  syllabusItems: SyllabusItem[],
  courseStatuses: CourseStatusMap,
): RequirementCheckResult => {
  // 必履修科目を抽出（履修上の区分が「必履修」の科目）
  const requiredCourses = syllabusItems.filter((item) =>
    item.履修上の区分 === "必履修"
  );

  // 単位を修得済みまたは履修予定の必履修科目
  const completedCourses = requiredCourses.filter((course) => {
    const status = courseStatuses[course.科目番号] || "未履修";
    return status === "単位取得済み" || status === "履修予定";
  });

  // 未履修の必履修科目
  const uncompletedCourses = requiredCourses.filter((course) => {
    const status = courseStatuses[course.科目番号] || "未履修";
    return status !== "単位取得済み" && status !== "履修予定";
  });

  const satisfied = uncompletedCourses.length === 0;

  return {
    name: "必履修科目チェック",
    satisfied,
    message: satisfied
      ? "すべての必履修科目を履修済みです"
      : `必履修科目で未履修のものが${uncompletedCourses.length}科目あります`,
    details: {
      total: requiredCourses.length,
      completed: completedCourses.length,
      items: uncompletedCourses,
    },
  };
};
