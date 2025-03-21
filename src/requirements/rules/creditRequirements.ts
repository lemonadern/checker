import {
  CourseStatusMap,
  RequirementCheckFn,
  RequirementCheckResult,
  SyllabusItem,
} from "../../types.ts";

/**
 * 単位数によるチェック関数
 * 指定された科目区分と最低単位数をもとに、十分な単位を修得しているかチェックする
 */
export const createCreditCheck = (
  name: string,
  targetCategory: string,
  minCredits: number,
): RequirementCheckFn => {
  return (
    syllabusItems: SyllabusItem[],
    courseStatuses: CourseStatusMap,
  ): RequirementCheckResult => {
    // 対象の科目区分の科目を抽出
    const categoryCourses = syllabusItems.filter((item) =>
      item.科目区分1 === targetCategory
    );

    // 単位取得済みまたは履修予定の科目
    const completedCourses = categoryCourses.filter((course) => {
      const status = courseStatuses[course.科目番号] || "未履修";
      return status === "単位取得済み" || status === "履修予定";
    });

    // 単位数の合計を計算
    const totalCredits = completedCourses.reduce((sum, course) => {
      return sum + parseInt(course.単位数, 10);
    }, 0);

    const satisfied = totalCredits >= minCredits;

    return {
      name,
      satisfied,
      message: satisfied
        ? `${targetCategory}の単位を${totalCredits}単位取得済み（必要単位: ${minCredits}）`
        : `${targetCategory}の単位が不足しています（現在: ${totalCredits}単位、必要: ${minCredits}単位）`,
      details: {
        total: minCredits,
        completed: totalCredits,
        items: completedCourses,
      },
    };
  };
};
