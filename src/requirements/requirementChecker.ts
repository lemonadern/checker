import {
  CourseStatusMap,
  RequirementCheckResult,
  SyllabusItem,
} from "../types.ts";
import { requirementChecks } from "./requirementDefinitions.ts";

/**
 * すべての卒業要件チェックを実行し、結果を返す
 * @param syllabusItems シラバス項目の配列
 * @param courseStatuses 科目の履修状態
 * @returns 卒業要件チェック結果の配列と全体の合否判定
 */
export const checkAllRequirements = (
  syllabusItems: SyllabusItem[],
  courseStatuses: CourseStatusMap,
): {
  results: RequirementCheckResult[];
  allSatisfied: boolean;
} => {
  // すべての要件チェックを実行
  const results = requirementChecks.map((check) =>
    check(syllabusItems, courseStatuses)
  );

  // 全体の合格/不合格判定
  const allSatisfied = results.every((result) => result.satisfied);

  return {
    results,
    allSatisfied,
  };
};
