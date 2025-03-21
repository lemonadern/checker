import { RequirementCheckFn } from "../types.ts";
import {
  checkInformationScienceRequiredCourses,
  checkJabeeComputerApplicationRequirement,
  checkJabeeComputerArchitectureRequirement,
  checkJabeeComputerSystemCoursesRequirement,
  checkJabeeEnglishRequirement,
  checkJabeeExperimentPracticeRequirement,
  checkJabeeHumanitiesSocialScienceRequirement,
  checkJabeeInformationCommunicationRequirement,
  checkJabeeInformationTechnologyRequirement,
  checkJabeeMathematicalScienceFullRequirement,
  checkJabeeMathematicalScienceRequirement,
  checkJabeeMathScienceRequirement,
  checkJabeeSystemProgrammingFullRequirement,
  checkJabeeSystemProgrammingRequirement,
  checkRequiredCourses,
  createAdvancedCourseGeneralCreditsCheck,
  createAdvancedCourseGraduationCheck,
  createAdvancedCourseSpecialtyCreditsCheck,
  createAdvancedCourseSpecialtyRelatedCreditsCheck,
  createRequiredCoursesCreditsCheck,
} from "./rules/index.ts";

/**
 * 卒業要件のチェック関数リスト
 * 新しい要件を追加する場合は、ここに関数を追加する
 */
export const requirementChecks: RequirementCheckFn[] = [
  // 必履修科目のチェック
  checkRequiredCourses,

  // 必修科目単位要件チェック
  createRequiredCoursesCreditsCheck(),

  // 専攻科終了要件チェック
  createAdvancedCourseGraduationCheck(),

  // 専攻科一般科目要件チェック
  createAdvancedCourseGeneralCreditsCheck(),

  // 専攻科専門関連科目要件チェック
  createAdvancedCourseSpecialtyRelatedCreditsCheck(),

  // 専攻科専門科目要件チェック
  createAdvancedCourseSpecialtyCreditsCheck(),

  // JABEE人文・社会科学系科目要件チェック
  checkJabeeHumanitiesSocialScienceRequirement,

  // JABEE英語科目要件チェック
  checkJabeeEnglishRequirement,

  // JABEE数学・自然科学系科目要件チェック
  checkJabeeMathScienceRequirement,

  // JABEE情報技術系科目要件チェック
  checkJabeeInformationTechnologyRequirement,

  // JABEE専門科目群：コンピュータアーキテクチャの履修
  checkJabeeComputerArchitectureRequirement,

  // JABEE専門科目群：コンピュータシステム系科目について、5科目以上の単位修得
  checkJabeeComputerSystemCoursesRequirement,

  // JABEE専門科目群：システムプログラム系科目について
  checkJabeeSystemProgrammingRequirement,

  // JABEE専門科目群：システムプログラム系科目において、5科目以上の単位修得
  checkJabeeSystemProgrammingFullRequirement,

  // JABEE専門科目群：情報通信・信号処理系科目について、4科目以上の単位修得
  checkJabeeInformationCommunicationRequirement,

  // JABEE専門科目群：コンピュータ応用系科目について、3科目以上の単位修得
  checkJabeeComputerApplicationRequirement,

  // JABEE専門科目群：数理科学系科目について、情報数学Ⅰと情報数学Ⅱから1科目以上の単位修得
  checkJabeeMathematicalScienceRequirement,

  // JABEE専門科目群：数理科学系科目について、選択必修科目を含む4科目以上の単位修得
  checkJabeeMathematicalScienceFullRequirement,

  // JABEE専門科目群：実験・実習系科目について、すべての必修科目の単位修得
  checkJabeeExperimentPracticeRequirement,

  // 「情報科学」教育プログラムにおける必修科目
  checkInformationScienceRequiredCourses,
  // TODO: 他の要件チェック関数を追加
];
