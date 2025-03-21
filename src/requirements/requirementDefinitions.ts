import { RequirementCheckFn } from "../types.ts";
import { 
  checkRequiredCourses, 
  createAdvancedCourseGraduationCheck,
  createAdvancedCourseGeneralCreditsCheck,
  createAdvancedCourseSpecialtyRelatedCreditsCheck,
  createAdvancedCourseSpecialtyCreditsCheck
} from "./rules/index.ts";

/**
 * 卒業要件のチェック関数リスト
 * 新しい要件を追加する場合は、ここに関数を追加する
 */
export const requirementChecks: RequirementCheckFn[] = [
  // 必履修科目のチェック
  checkRequiredCourses,

  // 専攻科終了要件チェック
  createAdvancedCourseGraduationCheck(),
  
  // 専攻科一般科目要件チェック
  createAdvancedCourseGeneralCreditsCheck(),
  
  // 専攻科専門関連科目要件チェック
  createAdvancedCourseSpecialtyRelatedCreditsCheck(),
  
  // 専攻科専門科目要件チェック
  createAdvancedCourseSpecialtyCreditsCheck(),
  
  // TODO: 他の要件チェック関数を追加
];
