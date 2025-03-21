import {
  CourseStatusMap,
  RequirementCheckFn,
  RequirementCheckResult,
  SyllabusItem,
} from "../../types.ts";
import { filterCompletedCourses } from "../utils.ts";
import { INFORMATION_SCIENCE_REQUIRED_COURSES } from "../../constants/informationScienceRequirements.ts";

/**
 * 「情報科学」教育プログラムにおける必修科目要件チェック関数
 * 19科目すべての必修科目の単位修得が必要
 */
export const checkInformationScienceRequiredCourses: RequirementCheckFn = (
  syllabusItems: SyllabusItem[],
  courseStatuses: CourseStatusMap,
): RequirementCheckResult => {
  // 必修科目の一覧から、シラバスに含まれる科目を抽出
  const requiredCourses = syllabusItems.filter((item) =>
    INFORMATION_SCIENCE_REQUIRED_COURSES.includes(item.授業科目)
  );

  // 単位取得済みまたは履修予定の科目を抽出
  const completedCourses = filterCompletedCourses(
    requiredCourses,
    courseStatuses,
  );

  // 未履修の科目
  const incompleteCourses = requiredCourses.filter(
    (course) => !completedCourses.some((c) => c.科目番号 === course.科目番号),
  );

  // シラバスにすべての必修科目が含まれているか確認
  const allCoursesExist = INFORMATION_SCIENCE_REQUIRED_COURSES.every((
    courseName,
  ) => requiredCourses.some((item) => item.授業科目 === courseName));

  // シラバスに含まれていない科目リスト
  const missingCourses = INFORMATION_SCIENCE_REQUIRED_COURSES.filter((
    courseName,
  ) => !requiredCourses.some((item) => item.授業科目 === courseName));

  // すべての必修科目を修得しているかどうか
  const totalRequiredCourses = INFORMATION_SCIENCE_REQUIRED_COURSES.length;
  const satisfied = allCoursesExist &&
    completedCourses.length === totalRequiredCourses;

  // メッセージ生成
  let message = "";
  if (!allCoursesExist) {
    message = `シラバスに含まれていない必修科目があります: ${
      missingCourses.join(", ")
    }`;
  } else if (!satisfied) {
    message =
      `必修科目の単位修得が不足しています（現在: ${completedCourses.length}科目、必要: ${totalRequiredCourses}科目）`;
  } else {
    message = `必修科目をすべて修得済み（${completedCourses.length}科目）`;
  }

  return {
    name: "「情報科学」教育プログラムにおける必修科目",
    satisfied,
    message,
    details: {
      total: totalRequiredCourses,
      completed: completedCourses.length,
      completedItems: completedCourses,
      incompleteItems: incompleteCourses,
    },
  };
};
