import {
  CourseStatusMap,
  RequirementCheckFn,
  RequirementCheckResult,
  SyllabusItem,
} from "../../types.ts";
import { filterCompletedCourses } from "../utils.ts";
import { 
  HUMANITIES_SOCIAL_SCIENCE_COURSES, 
  ENGLISH_COURSES,
  MATH_SCIENCE_COURSES,
  INFORMATION_TECHNOLOGY_COURSES,
  COMPUTER_ARCHITECTURE_COURSE,
  COMPUTER_SYSTEM_COURSES,
  SYSTEM_PROGRAMMING_COURSES,
  SYSTEM_PROGRAMMING_COURSES_FULL,
  INFORMATION_COMMUNICATION_COURSES,
  COMPUTER_APPLICATION_COURSES,
  MATHEMATICAL_SCIENCE_COURSES,
  MATHEMATICAL_SCIENCE_COURSES_FULL,
  EXPERIMENT_PRACTICE_REQUIRED_COURSES
} from "../../constants/jabeeRequirements.ts";

/**
 * JABEEプログラムの人文・社会科学系科目要件チェック関数
 * 人文・社会科学系科目について、6科目以上の単位修得が必要
 */
export const checkJabeeHumanitiesSocialScienceRequirement: RequirementCheckFn = (
  syllabusItems: SyllabusItem[],
  courseStatuses: CourseStatusMap,
): RequirementCheckResult => {
  // 人文・社会科学系科目の一覧から、シラバスに含まれる科目を抽出
  const humanitiesSocialScienceCourses = syllabusItems.filter((item) =>
    HUMANITIES_SOCIAL_SCIENCE_COURSES.includes(item.授業科目)
  );

  // 単位取得済みまたは履修予定の科目を抽出
  const completedCourses = filterCompletedCourses(
    humanitiesSocialScienceCourses,
    courseStatuses
  );

  // 未履修の科目
  const incompleteCourses = humanitiesSocialScienceCourses.filter(
    (course) => !completedCourses.some((c) => c.科目番号 === course.科目番号)
  );

  // 要件を満たしているかどうか（6科目以上修得しているか）
  const requiredCourseCount = 6;
  const satisfied = completedCourses.length >= requiredCourseCount;

  return {
    name: "JABEE人文・社会科学系科目要件",
    satisfied,
    message: satisfied
      ? `人文・社会科学系科目を${completedCourses.length}科目修得済み（要件: ${requiredCourseCount}科目以上）`
      : `人文・社会科学系科目の修得が不足しています（現在: ${completedCourses.length}科目、必要: ${requiredCourseCount}科目以上）`,
    details: {
      total: requiredCourseCount,
      completed: completedCourses.length,
      completedItems: completedCourses,
      incompleteItems: incompleteCourses,
    },
  };
};

/**
 * JABEEプログラムの英語科目要件チェック関数
 * 英語科目について、6科目以上の単位修得が必要
 */
export const checkJabeeEnglishRequirement: RequirementCheckFn = (
  syllabusItems: SyllabusItem[],
  courseStatuses: CourseStatusMap,
): RequirementCheckResult => {
  // 英語科目の一覧から、シラバスに含まれる科目を抽出
  const englishCourses = syllabusItems.filter((item) =>
    ENGLISH_COURSES.includes(item.授業科目)
  );

  // 単位取得済みまたは履修予定の科目を抽出
  const completedCourses = filterCompletedCourses(
    englishCourses,
    courseStatuses
  );

  // 未履修の科目
  const incompleteCourses = englishCourses.filter(
    (course) => !completedCourses.some((c) => c.科目番号 === course.科目番号)
  );

  // 要件を満たしているかどうか（6科目以上修得しているか）
  const requiredCourseCount = 6;
  const satisfied = completedCourses.length >= requiredCourseCount;

  return {
    name: "JABEE英語科目要件",
    satisfied,
    message: satisfied
      ? `英語科目を${completedCourses.length}科目修得済み（要件: ${requiredCourseCount}科目以上）`
      : `英語科目の修得が不足しています（現在: ${completedCourses.length}科目、必要: ${requiredCourseCount}科目以上）`,
    details: {
      total: requiredCourseCount,
      completed: completedCourses.length,
      completedItems: completedCourses,
      incompleteItems: incompleteCourses,
    },
  };
};

/**
 * JABEEプログラムの数学・自然科学系科目要件チェック関数
 * 数学・自然科学系科目について、10科目以上の単位修得が必要
 */
export const checkJabeeMathScienceRequirement: RequirementCheckFn = (
  syllabusItems: SyllabusItem[],
  courseStatuses: CourseStatusMap,
): RequirementCheckResult => {
  // 数学・自然科学系科目の一覧から、シラバスに含まれる科目を抽出
  const mathScienceCourses = syllabusItems.filter((item) =>
    MATH_SCIENCE_COURSES.includes(item.授業科目)
  );

  // 単位取得済みまたは履修予定の科目を抽出
  const completedCourses = filterCompletedCourses(
    mathScienceCourses,
    courseStatuses
  );

  // 未履修の科目
  const incompleteCourses = mathScienceCourses.filter(
    (course) => !completedCourses.some((c) => c.科目番号 === course.科目番号)
  );

  // 要件を満たしているかどうか（10科目以上修得しているか）
  const requiredCourseCount = 10;
  const satisfied = completedCourses.length >= requiredCourseCount;

  return {
    name: "JABEE数学・自然科学系科目要件",
    satisfied,
    message: satisfied
      ? `数学・自然科学系科目を${completedCourses.length}科目修得済み（要件: ${requiredCourseCount}科目以上）`
      : `数学・自然科学系科目の修得が不足しています（現在: ${completedCourses.length}科目、必要: ${requiredCourseCount}科目以上）`,
    details: {
      total: requiredCourseCount,
      completed: completedCourses.length,
      completedItems: completedCourses,
      incompleteItems: incompleteCourses,
    },
  };
};

/**
 * JABEEプログラムの情報技術系科目要件チェック関数
 * 情報技術系科目について、2科目以上の単位修得が必要
 */
export const checkJabeeInformationTechnologyRequirement: RequirementCheckFn = (
  syllabusItems: SyllabusItem[],
  courseStatuses: CourseStatusMap,
): RequirementCheckResult => {
  // 情報技術系科目の一覧から、シラバスに含まれる科目を抽出
  const informationTechnologyCourses = syllabusItems.filter((item) =>
    INFORMATION_TECHNOLOGY_COURSES.includes(item.授業科目)
  );

  // 単位取得済みまたは履修予定の科目を抽出
  const completedCourses = filterCompletedCourses(
    informationTechnologyCourses,
    courseStatuses
  );

  // 未履修の科目
  const incompleteCourses = informationTechnologyCourses.filter(
    (course) => !completedCourses.some((c) => c.科目番号 === course.科目番号)
  );

  // 要件を満たしているかどうか（2科目以上修得しているか）
  const requiredCourseCount = 2;
  const satisfied = completedCourses.length >= requiredCourseCount;

  return {
    name: "JABEE情報技術系科目要件",
    satisfied,
    message: satisfied
      ? `情報技術系科目を${completedCourses.length}科目修得済み（要件: ${requiredCourseCount}科目以上）`
      : `情報技術系科目の修得が不足しています（現在: ${completedCourses.length}科目、必要: ${requiredCourseCount}科目以上）`,
    details: {
      total: requiredCourseCount,
      completed: completedCourses.length,
      completedItems: completedCourses,
      incompleteItems: incompleteCourses,
    },
  };
};

/**
 * JABEE専門科目群：コンピュータシステム系科目について、コンピュータアーキテクチャの履修
 * コンピュータアーキテクチャが履修済みまたは履修予定であることが必要
 */
export const checkJabeeComputerArchitectureRequirement: RequirementCheckFn = (
  syllabusItems: SyllabusItem[],
  courseStatuses: CourseStatusMap,
): RequirementCheckResult => {
  // コンピュータアーキテクチャに該当する科目を抽出
  const computerArchitectureCourses = syllabusItems.filter((item) =>
    item.授業科目 === COMPUTER_ARCHITECTURE_COURSE
  );

  // 該当科目が見つからない場合
  if (computerArchitectureCourses.length === 0) {
    return {
      name: "JABEE専門科目群：1. コンピュータシステム系科目について、コンピュータアーキテクチャの履修",
      satisfied: false,
      message: `コンピュータアーキテクチャの科目がシラバスに見つかりません`,
      details: {
        completed: 0,
        total: 1,
        completedItems: [],
        incompleteItems: [],
      },
    };
  }

  // 単位取得済みまたは履修予定の科目を抽出
  const completedCourses = filterCompletedCourses(
    computerArchitectureCourses,
    courseStatuses
  );

  // 要件を満たしているかどうか（コンピュータアーキテクチャが履修済みまたは履修予定）
  const satisfied = completedCourses.length > 0;

  return {
    name: "JABEE専門科目群：1. コンピュータシステム系科目について、コンピュータアーキテクチャの履修",
    satisfied,
    message: satisfied
      ? `コンピュータアーキテクチャを履修済みまたは履修予定です`
      : `コンピュータアーキテクチャを履修する必要があります`,
    details: {
      total: 1,
      completed: completedCourses.length,
      completedItems: completedCourses,
      incompleteItems: computerArchitectureCourses.filter(
        (course) => !completedCourses.some((c) => c.科目番号 === course.科目番号)
      ),
    },
  };
};

/**
 * JABEE専門科目群：コンピュータシステム系科目について、5科目以上の単位修得
 * コンピュータシステム系科目について、5科目以上の単位修得が必要
 */
export const checkJabeeComputerSystemCoursesRequirement: RequirementCheckFn = (
  syllabusItems: SyllabusItem[],
  courseStatuses: CourseStatusMap,
): RequirementCheckResult => {
  // コンピュータシステム系科目の一覧から、シラバスに含まれる科目を抽出
  const computerSystemCourses = syllabusItems.filter((item) =>
    COMPUTER_SYSTEM_COURSES.includes(item.授業科目)
  );

  // 単位取得済みまたは履修予定の科目を抽出
  const completedCourses = filterCompletedCourses(
    computerSystemCourses,
    courseStatuses
  );

  // 未履修の科目
  const incompleteCourses = computerSystemCourses.filter(
    (course) => !completedCourses.some((c) => c.科目番号 === course.科目番号)
  );

  // 要件を満たしているかどうか（5科目以上修得しているか）
  const requiredCourseCount = 5;
  const satisfied = completedCourses.length >= requiredCourseCount;

  return {
    name: "JABEE専門科目群：2. コンピュータシステム系科目について、5科目以上の単位修得",
    satisfied,
    message: satisfied
      ? `コンピュータシステム系科目を${completedCourses.length}科目修得済み（要件: ${requiredCourseCount}科目以上）`
      : `コンピュータシステム系科目の修得が不足しています（現在: ${completedCourses.length}科目、必要: ${requiredCourseCount}科目以上）`,
    details: {
      total: requiredCourseCount,
      completed: completedCourses.length,
      completedItems: completedCourses,
      incompleteItems: incompleteCourses,
    },
  };
};

/**
 * JABEE専門科目群：システムプログラム系科目要件チェック関数
 * アルゴリズムとデータ構造・プログラミング言語論・ソフトウェア設計をすべて履修し、
 * これらの科目から二科目以上の単位修得が必要
 */
export const checkJabeeSystemProgrammingRequirement: RequirementCheckFn = (
  syllabusItems: SyllabusItem[],
  courseStatuses: CourseStatusMap,
): RequirementCheckResult => {
  // システムプログラム系科目の一覧から、シラバスに含まれる科目を抽出
  const systemProgrammingCourses = syllabusItems.filter((item) =>
    SYSTEM_PROGRAMMING_COURSES.includes(item.授業科目)
  );

  // 必要な科目がすべてシラバスに存在するか確認
  const allCoursesExist = SYSTEM_PROGRAMMING_COURSES.every((courseName) => 
    systemProgrammingCourses.some((item) => item.授業科目 === courseName)
  );

  // シラバスに必要な科目がすべて存在しない場合
  if (!allCoursesExist) {
    // 不足している科目をリストアップ
    const missingCourses = SYSTEM_PROGRAMMING_COURSES.filter((courseName) => 
      !systemProgrammingCourses.some((item) => item.授業科目 === courseName)
    );

    return {
      name: "JABEE専門科目群：3. システムプログラム系科目についてアルゴリズムとデータ構造・プログラミング言語論・ソフトウェア設計をすべて履修し、これらの科目から二科目以上の単位修得",
      satisfied: false,
      message: `システムプログラム系の必要科目が不足しています: ${missingCourses.join(', ')}`,
      details: {
        total: SYSTEM_PROGRAMMING_COURSES.length,
        completed: 0,
        completedItems: [],
        incompleteItems: []
      },
    };
  }

  // 単位取得済みまたは履修予定の科目を抽出
  const completedCourses = filterCompletedCourses(
    systemProgrammingCourses,
    courseStatuses
  );

  // 履修状況をチェック
  const isAllEnrolled = SYSTEM_PROGRAMMING_COURSES.every((courseName) => 
    systemProgrammingCourses.some((item) => 
      item.授業科目 === courseName && 
      ["単位取得済み", "履修予定", "履修中"].includes(courseStatuses[item.科目番号] || "")
    )
  );

  // 未履修の科目
  const incompleteCourses = systemProgrammingCourses.filter(
    (course) => !completedCourses.some((c) => c.科目番号 === course.科目番号)
  );

  // 要件を満たしているかどうか
  // 1. すべての科目を履修している（履修予定含む）
  // 2. 2科目以上の単位を修得している
  const requiredCompletedCount = 2;
  const isTwoOrMoreCompleted = completedCourses.length >= requiredCompletedCount;
  const satisfied = isAllEnrolled && isTwoOrMoreCompleted;

  // 合格/不合格の理由を生成
  let message = "";
  if (satisfied) {
    message = `システムプログラム系の全科目を履修し、${completedCourses.length}科目の単位を修得済みです（要件: 全科目履修かつ${requiredCompletedCount}科目以上の単位修得）`;
  } else if (!isAllEnrolled) {
    // 履修していない科目をリストアップ
    const notEnrolledCourses = SYSTEM_PROGRAMMING_COURSES.filter((courseName) => 
      !systemProgrammingCourses.some((item) => 
        item.授業科目 === courseName && 
        ["単位取得済み", "履修予定", "履修中"].includes(courseStatuses[item.科目番号] || "")
      )
    );
    message = `システムプログラム系の以下の科目が未履修です: ${notEnrolledCourses.join(', ')}`;
  } else if (!isTwoOrMoreCompleted) {
    message = `システムプログラム系科目の単位修得が${completedCourses.length}科目で不足しています（要件: ${requiredCompletedCount}科目以上）`;
  }

  return {
    name: "JABEE専門科目群：3. システムプログラム系科目についてアルゴリズムとデータ構造・プログラミング言語論・ソフトウェア設計をすべて履修し、これらの科目から二科目以上の単位修得",
    satisfied,
    message,
    details: {
      total: requiredCompletedCount,
      completed: completedCourses.length,
      completedItems: completedCourses,
      incompleteItems: incompleteCourses
    },
  };
};

/**
 * JABEE専門科目群：システムプログラム系科目において、5科目以上の単位修得
 * システムプログラム系科目の完全なリストから5科目以上の単位修得が必要
 */
export const checkJabeeSystemProgrammingFullRequirement: RequirementCheckFn = (
  syllabusItems: SyllabusItem[],
  courseStatuses: CourseStatusMap,
): RequirementCheckResult => {
  // システムプログラム系科目の一覧から、シラバスに含まれる科目を抽出
  const systemProgrammingCourses = syllabusItems.filter((item) =>
    SYSTEM_PROGRAMMING_COURSES_FULL.includes(item.授業科目)
  );

  // 単位取得済みまたは履修予定の科目を抽出
  const completedCourses = filterCompletedCourses(
    systemProgrammingCourses,
    courseStatuses
  );

  // 未履修の科目
  const incompleteCourses = systemProgrammingCourses.filter(
    (course) => !completedCourses.some((c) => c.科目番号 === course.科目番号)
  );

  // 要件を満たしているかどうか（5科目以上修得しているか）
  const requiredCourseCount = 5;
  const satisfied = completedCourses.length >= requiredCourseCount;

  return {
    name: "JABEE専門科目群：4. システムプログラム系科目において、5科目以上の単位修得",
    satisfied,
    message: satisfied
      ? `システムプログラム系科目を${completedCourses.length}科目修得済み（要件: ${requiredCourseCount}科目以上）`
      : `システムプログラム系科目の修得が不足しています（現在: ${completedCourses.length}科目、必要: ${requiredCourseCount}科目以上）`,
    details: {
      total: requiredCourseCount,
      completed: completedCourses.length,
      completedItems: completedCourses,
      incompleteItems: incompleteCourses,
    },
  };
};

/**
 * JABEEプログラムの情報通信・信号処理系科目要件チェック関数
 * 情報通信・信号処理系科目について、4科目以上の単位修得が必要
 */
export const checkJabeeInformationCommunicationRequirement: RequirementCheckFn = (
  syllabusItems: SyllabusItem[],
  courseStatuses: CourseStatusMap,
): RequirementCheckResult => {
  // 情報通信・信号処理系科目の一覧から、シラバスに含まれる科目を抽出
  const informationCommunicationCourses = syllabusItems.filter((item) =>
    INFORMATION_COMMUNICATION_COURSES.includes(item.授業科目)
  );

  // 履修済みまたは履修予定の科目の数を数える
  const completedOrPlannedCourses = informationCommunicationCourses.filter((item) => {
    const status = courseStatuses[item.科目番号];
    return status === "単位取得済み" || status === "履修予定";
  });

  // 必要な科目数 (4科目以上)
  const requiredCourseCount = 4;
  const completedCount = completedOrPlannedCourses.length;
  
  // 要件を満たしているかを判定
  const satisfied = completedCount >= requiredCourseCount;

  // 結果メッセージを作成
  let message: string;
  if (satisfied) {
    message = `JABEE専門科目群：情報通信・信号処理系科目の要件を満たしています (${completedCount}科目 / 必要${requiredCourseCount}科目)`;
  } else {
    message = `JABEE専門科目群：情報通信・信号処理系科目の要件を満たしていません (${completedCount}科目 / 必要${requiredCourseCount}科目)`;
  }

  // 未完了の科目のリスト
  const incompleteCourses = informationCommunicationCourses.filter(
    (course) => !completedOrPlannedCourses.some((c) => c.科目番号 === course.科目番号)
  );

  return {
    name: "JABEE専門科目群：5. 情報通信・信号処理系科目について、4科目以上の単位修得",
    satisfied,
    message,
    details: {
      total: requiredCourseCount,
      completed: completedCount,
      completedItems: completedOrPlannedCourses,
      incompleteItems: incompleteCourses,
    },
  };
};

/**
 * JABEEプログラムの専門科目群のコンピュータ応用系科目要件チェック関数
 * コンピュータ応用系科目について、3科目以上の単位修得が必要
 */
export const checkJabeeComputerApplicationRequirement: RequirementCheckFn = (
  syllabusItems: SyllabusItem[],
  courseStatuses: CourseStatusMap,
): RequirementCheckResult => {
  // コンピュータ応用系科目の一覧から、シラバスに含まれる科目を抽出
  const computerApplicationCourses = syllabusItems.filter((item) =>
    COMPUTER_APPLICATION_COURSES.includes(item.授業科目)
  );

  // 単位取得済みまたは履修予定の科目を抽出
  const completedCourses = filterCompletedCourses(
    computerApplicationCourses,
    courseStatuses
  );

  // 未履修の科目
  const incompleteCourses = computerApplicationCourses.filter(
    (course) => !completedCourses.some((c) => c.科目番号 === course.科目番号)
  );

  // 要件を満たしているかどうか（3科目以上修得しているか）
  const requiredCourseCount = 3;
  const satisfied = completedCourses.length >= requiredCourseCount;

  return {
    name: "JABEE専門科目群：6. コンピュータ応用系科目について、3科目以上の単位修得",
    satisfied,
    message: satisfied
      ? `コンピュータ応用系科目を${completedCourses.length}科目修得済み（要件: ${requiredCourseCount}科目以上）`
      : `コンピュータ応用系科目の修得が不足しています（現在: ${completedCourses.length}科目、必要: ${requiredCourseCount}科目以上）`,
    details: {
      total: requiredCourseCount,
      completed: completedCourses.length,
      completedItems: completedCourses,
      incompleteItems: incompleteCourses,
    },
  };
};

/**
 * JABEEプログラムの専門科目群の数理科学系科目要件チェック関数
 * 情報数学Ⅰと情報数学Ⅱから1科目以上の単位修得が必要
 */
export const checkJabeeMathematicalScienceRequirement: RequirementCheckFn = (
  syllabusItems: SyllabusItem[],
  courseStatuses: CourseStatusMap,
): RequirementCheckResult => {
  // 数理科学系科目の一覧から、シラバスに含まれる科目を抽出
  const mathematicalScienceCourses = syllabusItems.filter((item) =>
    MATHEMATICAL_SCIENCE_COURSES.includes(item.授業科目)
  );

  // 単位取得済みまたは履修予定の科目を抽出
  const completedCourses = filterCompletedCourses(
    mathematicalScienceCourses,
    courseStatuses
  );

  // 未履修の科目
  const incompleteCourses = mathematicalScienceCourses.filter(
    (course) => !completedCourses.some((c) => c.科目番号 === course.科目番号)
  );

  // 要件を満たしているかどうか（1科目以上修得しているか）
  const requiredCourseCount = 1;
  const satisfied = completedCourses.length >= requiredCourseCount;

  return {
    name: "JABEE専門科目群：7. 数理科学系科目について、情報数学Ⅰと情報数学Ⅱから1科目以上の単位修得",
    satisfied,
    message: satisfied
      ? `数理科学系科目を${completedCourses.length}科目修得済み（要件: ${requiredCourseCount}科目以上）`
      : `数理科学系科目（情報数学Ⅰ・Ⅱ）の修得が必要です`,
    details: {
      total: requiredCourseCount,
      completed: completedCourses.length,
      completedItems: completedCourses,
      incompleteItems: incompleteCourses,
    },
  };
};

/**
 * JABEEプログラムの専門科目群の数理科学系科目要件チェック関数（完全なリスト）
 * 選択必修科目を含む4科目以上の単位修得が必要
 */
export const checkJabeeMathematicalScienceFullRequirement: RequirementCheckFn = (
  syllabusItems: SyllabusItem[],
  courseStatuses: CourseStatusMap,
): RequirementCheckResult => {
  // 数理科学系科目の一覧から、シラバスに含まれる科目を抽出
  const mathematicalScienceCourses = syllabusItems.filter((item) =>
    MATHEMATICAL_SCIENCE_COURSES_FULL.includes(item.授業科目)
  );

  // 単位取得済みまたは履修予定の科目を抽出
  const completedCourses = filterCompletedCourses(
    mathematicalScienceCourses,
    courseStatuses
  );

  // 未履修の科目
  const incompleteCourses = mathematicalScienceCourses.filter(
    (course) => !completedCourses.some((c) => c.科目番号 === course.科目番号)
  );

  // 要件を満たしているかどうか（4科目以上修得しているか）
  const requiredCourseCount = 4;
  const satisfied = completedCourses.length >= requiredCourseCount;

  return {
    name: "JABEE専門科目群：8. 数理科学系科目について、選択必修科目を含む4科目以上の単位修得",
    satisfied,
    message: satisfied
      ? `数理科学系科目を${completedCourses.length}科目修得済み（要件: ${requiredCourseCount}科目以上）`
      : `数理科学系科目の修得が不足しています（現在: ${completedCourses.length}科目、必要: ${requiredCourseCount}科目以上）`,
    details: {
      total: requiredCourseCount,
      completed: completedCourses.length,
      completedItems: completedCourses,
      incompleteItems: incompleteCourses,
    },
  };
};

/**
 * JABEEプログラムの専門科目群の実験・実習系科目要件チェック関数
 * すべての必修科目の単位修得が必要
 */
export const checkJabeeExperimentPracticeRequirement: RequirementCheckFn = (
  syllabusItems: SyllabusItem[],
  courseStatuses: CourseStatusMap,
): RequirementCheckResult => {
  // 実験・実習系必修科目の一覧から、シラバスに含まれる科目を抽出
  const experimentPracticeCourses = syllabusItems.filter((item) =>
    EXPERIMENT_PRACTICE_REQUIRED_COURSES.includes(item.授業科目)
  );

  // 単位取得済みまたは履修予定の科目を抽出
  const completedCourses = filterCompletedCourses(
    experimentPracticeCourses,
    courseStatuses
  );

  // 未履修の科目
  const incompleteCourses = experimentPracticeCourses.filter(
    (course) => !completedCourses.some((c) => c.科目番号 === course.科目番号)
  );

  // シラバスにすべての必修科目が含まれているか確認
  const allCoursesExist = EXPERIMENT_PRACTICE_REQUIRED_COURSES.every((courseName) => 
    experimentPracticeCourses.some((item) => item.授業科目 === courseName)
  );

  // シラバスに含まれていない科目リスト
  const missingCourses = EXPERIMENT_PRACTICE_REQUIRED_COURSES.filter((courseName) => 
    !experimentPracticeCourses.some((item) => item.授業科目 === courseName)
  );

  // すべての必修科目を修得しているかどうか
  const totalRequiredCourses = EXPERIMENT_PRACTICE_REQUIRED_COURSES.length;
  const satisfied = allCoursesExist && completedCourses.length === totalRequiredCourses;

  // メッセージ生成
  let message = "";
  if (!allCoursesExist) {
    message = `シラバスに含まれていない実験・実習系必修科目があります: ${missingCourses.join(", ")}`;
  } else if (!satisfied) {
    message = `実験・実習系必修科目の単位修得が不足しています（現在: ${completedCourses.length}科目、必要: ${totalRequiredCourses}科目）`;
  } else {
    message = `実験・実習系必修科目をすべて修得済み（${completedCourses.length}科目）`;
  }

  return {
    name: "JABEE専門科目群：9. 実験・実習系科目について、すべての必修科目の単位修得",
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