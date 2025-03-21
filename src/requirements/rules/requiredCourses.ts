import {
  CourseStatusMap,
  RequirementCheckFn,
  RequirementCheckResult,
  SyllabusItem,
} from "../../types.ts";
import { filterCompletedCourses, filterIncompleteCourses } from "../utils.ts";

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
  const completedCourses = filterCompletedCourses(
    requiredCourses,
    courseStatuses,
  );

  // 未履修の必履修科目
  const uncompletedCourses = filterIncompleteCourses(
    requiredCourses,
    courseStatuses,
  );

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
      completedItems: completedCourses,
      incompleteItems: uncompletedCourses,
    },
  };
};

/**
 * 必修科目の単位取得要件チェック関数
 * 科目区分2が「必修」の科目をすべて修得しているかチェックする
 */
export const createRequiredCoursesCreditsCheck = (): RequirementCheckFn => {
  return (
    syllabusItems: SyllabusItem[],
    courseStatuses: CourseStatusMap,
  ): RequirementCheckResult => {
    // 必修科目を抽出（科目区分2が「必修」の科目）
    const requiredCourses = syllabusItems.filter((item) =>
      item.科目区分2 === "必修"
    );

    // 単位取得済みまたは履修予定の必修科目
    const completedCourses = filterCompletedCourses(
      requiredCourses,
      courseStatuses,
    );

    // 未履修の必修科目
    const incompleteCourses = filterIncompleteCourses(
      requiredCourses,
      courseStatuses,
    );

    // すべての必修科目を履修しているかどうか
    const satisfied = incompleteCourses.length === 0;

    // 必修科目の総単位数を計算
    const totalRequiredCredits = requiredCourses.reduce((sum, course) => {
      return sum + parseInt(course.単位数, 10);
    }, 0);

    // 取得済みまたは履修予定の必修科目の単位数
    const completedCredits = completedCourses.reduce((sum, course) => {
      return sum + parseInt(course.単位数, 10);
    }, 0);

    return {
      name: "必修科目単位要件",
      satisfied,
      message: satisfied
        ? `すべての必修科目を履修済みです（${completedCredits}単位）`
        : `必修科目が${incompleteCourses.length}科目（${
          totalRequiredCredits - completedCredits
        }単位分）未履修です`,
      details: {
        total: requiredCourses.length,
        completed: completedCourses.length,
        completedItems: completedCourses,
        incompleteItems: incompleteCourses,
      },
    };
  };
};
