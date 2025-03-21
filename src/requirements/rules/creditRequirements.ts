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

    // 未履修の科目
    const incompleteCourses = categoryCourses.filter((course) => {
      const status = courseStatuses[course.科目番号] || "未履修";
      return status !== "単位取得済み" && status !== "履修予定";
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
        completedItems: completedCourses,
        incompleteItems: incompleteCourses,
      },
    };
  };
};

/**
 * 専攻科科目の共通チェックロジック
 * 指定された条件でフィルタリングした科目について、単位要件を満たしているかチェックする
 * 
 * @param name チェック要件の名前
 * @param filterFn 科目フィルタリングの条件関数
 * @param requiredCredits 必要な単位数
 * @param messagePrefix メッセージの接頭辞（「専攻科の〇〇科目」など）
 */
export const createAdvancedCourseCheck = (
  name: string,
  filterFn: (item: SyllabusItem) => boolean,
  requiredCredits: number,
  messagePrefix: string,
): RequirementCheckFn => {
  return (
    syllabusItems: SyllabusItem[],
    courseStatuses: CourseStatusMap,
  ): RequirementCheckResult => {
    // 条件に合致する科目を抽出
    const filteredCourses = syllabusItems.filter(filterFn);

    // 単位取得済みまたは履修予定の科目
    const completedCourses = filteredCourses.filter((course) => {
      const status = courseStatuses[course.科目番号] || "未履修";
      return status === "単位取得済み" || status === "履修予定";
    });

    // 未履修の科目
    const incompleteCourses = filteredCourses.filter((course) => {
      const status = courseStatuses[course.科目番号] || "未履修";
      return status !== "単位取得済み" && status !== "履修予定";
    });

    // 単位数の合計を計算
    const totalCredits = completedCourses.reduce((sum, course) => {
      return sum + parseInt(course.単位数, 10);
    }, 0);

    const satisfied = totalCredits >= requiredCredits;

    return {
      name,
      satisfied,
      message: satisfied
        ? `${messagePrefix}を${totalCredits}単位取得済み（要件: ${requiredCredits}単位以上）`
        : `${messagePrefix}が不足しています（現在: ${totalCredits}単位、必要: ${requiredCredits}単位以上）`,
      details: {
        total: requiredCredits,
        completed: totalCredits,
        completedItems: completedCourses,
        incompleteItems: incompleteCourses,
      },
    };
  };
};

/**
 * 専攻科の終了要件チェック関数
 * 専攻科の場合、合計62単位以上が必要
 *
 * 専攻科の単位の修得に関する規程 第2条 1
 * https://www.toyota-ct.ac.jp/wp/wp-content/uploads/2024/05/1e4fa6f1cc1d9371b03d5cf6a0c88648.pdf
 */
export const createAdvancedCourseGraduationCheck = (): RequirementCheckFn => {
  return createAdvancedCourseCheck(
    "専攻科終了要件",
    (item) => item.本科または専攻科 === "専攻科",
    62,
    "専攻科の単位"
  );
};

/**
 * 専攻科の一般科目要件チェック関数
 * 専攻科の場合、一般科目10単位以上が必要
 *
 * 専攻科の単位の修得に関する規程 第2条
 */
export const createAdvancedCourseGeneralCreditsCheck = (): RequirementCheckFn => {
  return createAdvancedCourseCheck(
    "専攻科一般科目要件",
    (item) => item.本科または専攻科 === "専攻科" && item.科における科目種 === "一般科目",
    10,
    "専攻科の一般科目"
  );
};

/**
 * 専攻科の専門関連科目要件チェック関数
 * 専攻科の場合、専門関連科目12単位以上が必要
 *
 * 専攻科の単位の修得に関する規程 第2条
 */
export const createAdvancedCourseSpecialtyRelatedCreditsCheck = (): RequirementCheckFn => {
  return createAdvancedCourseCheck(
    "専攻科専門関連科目要件",
    (item) => 
      item.本科または専攻科 === "専攻科" && 
      item.科における科目種 === "専門関連科目",
    12,
    "専攻科の専門関連科目"
  );
};

/**
 * 専攻科の専門科目要件チェック関数
 * 専攻科の場合、専門科目36単位以上が必要
 *
 * 専攻科の単位の修得に関する規程 第2条
 */
export const createAdvancedCourseSpecialtyCreditsCheck = (): RequirementCheckFn => {
  return createAdvancedCourseCheck(
    "専攻科専門科目要件",
    (item) => 
      item.本科または専攻科 === "専攻科" && 
      item.科における科目種 === "専門科目", 
    36,
    "専攻科の専門科目"
  );
};
