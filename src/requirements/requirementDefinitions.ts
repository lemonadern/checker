import { RequirementCheckFn } from "../types.ts";
import { checkRequiredCourses, createCreditCheck } from "./rules/index.ts";

/**
 * 卒業要件のチェック関数リスト
 * 新しい要件を追加する場合は、ここに関数を追加する
 */
export const requirementChecks: RequirementCheckFn[] = [
  // 必履修科目のチェック
  checkRequiredCourses,

  // 科目区分ごとの単位数チェック
  createCreditCheck("専門科目（必修）", "専門", 10),
  createCreditCheck("一般科目", "一般", 8),
  // TODO: 他の要件チェック関数を追加
];
