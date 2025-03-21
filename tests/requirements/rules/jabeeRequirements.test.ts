import { describe, it } from "@std/testing/bdd";
import { assertEquals } from "@std/assert";
import { SyllabusItem, CourseStatusMap } from "../../../src/types.ts";
import { 
  checkJabeeHumanitiesSocialScienceRequirement,
  checkJabeeEnglishRequirement,
  checkJabeeMathScienceRequirement,
  checkJabeeInformationTechnologyRequirement,
  checkJabeeComputerArchitectureRequirement,
  checkJabeeComputerSystemCoursesRequirement,
  checkJabeeSystemProgrammingRequirement,
  checkJabeeSystemProgrammingFullRequirement,
  checkJabeeInformationCommunicationRequirement,
  checkJabeeComputerApplicationRequirement,
  checkJabeeMathematicalScienceRequirement,
  checkJabeeMathematicalScienceFullRequirement,
  checkJabeeExperimentPracticeRequirement
} from "../../../src/requirements/rules/index.ts";
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
  MATHEMATICAL_SCIENCE_COURSES_FULL
} from "../../../src/constants/jabeeRequirements.ts";

describe("checkJabeeHumanitiesSocialScienceRequirement", () => {
  // テスト用の人文・社会科学系科目のシラバスアイテムを作成
  const createHumanitiesCourseItem = (
    courseName: string,
    courseNumber: string,
    credits: string = "2"
  ): SyllabusItem => ({
    本科または専攻科: "本科",
    科目区分1: "一般",
    科目区分2: "選択",
    科における科目種: "一般科目",
    授業科目: courseName,
    科目番号: courseNumber,
    単位種別: "学修単位",
    単位数: credits,
    学科: "情報科学専攻",
    学年: "3",
    学期: "前期",
    担当教員: "教員A",
    履修上の区分: "区分なし"
  });

  // テスト用のシラバスアイテム作成
  const mockSyllabusItems: SyllabusItem[] = [
    // 人文・社会科学系科目から最初の7科目をテスト用に追加
    ...HUMANITIES_SOCIAL_SCIENCE_COURSES.slice(0, 7).map((course, index) => 
      createHumanitiesCourseItem(course, `H${5000 + index}`)
    ),
    // 人文・社会科学系ではない科目も追加
    {
      本科または専攻科: "本科",
      科目区分1: "専門",
      科目区分2: "必修",
      科における科目種: "専門科目",
      授業科目: "数学A",
      科目番号: "M1001",
      単位種別: "学修単位",
      単位数: "2",
      学科: "情報科学専攻",
      学年: "3",
      学期: "前期",
      担当教員: "教員B",
      履修上の区分: "必履修"
    }
  ];

  it("6科目以上の人文・社会科学系科目を履修している場合、要件を満たしていると判定する", () => {
    // 6科目が履修済みの状態
    const mockCourseStatuses: CourseStatusMap = {
      "H5000": "単位取得済み",
      "H5001": "単位取得済み",
      "H5002": "単位取得済み",
      "H5003": "単位取得済み",
      "H5004": "単位取得済み",
      "H5005": "履修予定",
      "H5006": "未履修",
      "M1001": "単位取得済み"
    };

    const result = checkJabeeHumanitiesSocialScienceRequirement(
      mockSyllabusItems,
      mockCourseStatuses
    );

    assertEquals(result.name, "JABEE人文・社会科学系科目要件");
    assertEquals(result.satisfied, true);
    assertEquals(result.details?.completed, 6); // 6科目履修済み
    assertEquals(result.details?.completedItems?.length, 6);
    assertEquals(result.details?.total, 6); // 要件は6科目以上
  });

  it("5科目以下の人文・社会科学系科目しか履修していない場合、要件を満たしていないと判定する", () => {
    // 5科目のみ履修済みの状態
    const mockCourseStatuses: CourseStatusMap = {
      "H5000": "単位取得済み",
      "H5001": "単位取得済み",
      "H5002": "単位取得済み",
      "H5003": "単位取得済み",
      "H5004": "単位取得済み",
      "H5005": "未履修",
      "H5006": "未履修",
      "M1001": "単位取得済み"
    };

    const result = checkJabeeHumanitiesSocialScienceRequirement(
      mockSyllabusItems,
      mockCourseStatuses
    );

    assertEquals(result.satisfied, false); // 要件未達
    assertEquals(result.details?.completed, 5); // 5科目しか履修していない
  });

  it("「履修予定」の科目も含めて6科目以上あれば要件を満たしていると判定する", () => {
    // 4科目が単位取得済み、2科目が履修予定の状態
    const mockCourseStatuses: CourseStatusMap = {
      "H5000": "単位取得済み",
      "H5001": "単位取得済み",
      "H5002": "単位取得済み",
      "H5003": "単位取得済み",
      "H5004": "履修予定",
      "H5005": "履修予定",
      "H5006": "未履修",
      "M1001": "単位取得済み"
    };

    const result = checkJabeeHumanitiesSocialScienceRequirement(
      mockSyllabusItems,
      mockCourseStatuses
    );

    assertEquals(result.satisfied, true); // 要件達成
    assertEquals(result.details?.completed, 6); // 6科目履修（予定含む）
  });

  it("シラバスに人文・社会科学系科目がない場合、要件を満たさないと判定する", () => {
    // 人文・社会科学系科目を含まないシラバス
    const noHumanitiesSyllabusItems: SyllabusItem[] = [
      {
        本科または専攻科: "本科",
        科目区分1: "専門",
        科目区分2: "必修",
        科における科目種: "専門科目",
        授業科目: "数学A",
        科目番号: "M1001",
        単位種別: "学修単位",
        単位数: "2",
        学科: "情報科学専攻",
        学年: "3",
        学期: "前期",
        担当教員: "教員B",
        履修上の区分: "必履修"
      }
    ];

    const mockCourseStatuses: CourseStatusMap = {
      "M1001": "単位取得済み"
    };

    const result = checkJabeeHumanitiesSocialScienceRequirement(
      noHumanitiesSyllabusItems,
      mockCourseStatuses
    );

    assertEquals(result.satisfied, false); // 要件未達
    assertEquals(result.details?.completed, 0); // 0科目
  });
});

describe("checkJabeeEnglishRequirement", () => {
  // テスト用の英語科目のシラバスアイテムを作成
  const createEnglishCourseItem = (
    courseName: string,
    courseNumber: string,
    credits: string = "2"
  ): SyllabusItem => ({
    本科または専攻科: "本科",
    科目区分1: "一般",
    科目区分2: "必修",
    科における科目種: "一般科目",
    授業科目: courseName,
    科目番号: courseNumber,
    単位種別: "学修単位",
    単位数: credits,
    学科: "情報科学専攻",
    学年: "2",
    学期: "前期",
    担当教員: "教員C",
    履修上の区分: "必履修"
  });

  // テスト用のシラバスアイテム作成
  const mockSyllabusItems: SyllabusItem[] = [
    // 英語科目から最初の7科目をテスト用に追加
    ...ENGLISH_COURSES.slice(0, 7).map((course, index) => 
      createEnglishCourseItem(course, `E${7000 + index}`)
    ),
    // 英語科目ではない科目も追加
    {
      本科または専攻科: "本科",
      科目区分1: "一般",
      科目区分2: "必修",
      科における科目種: "一般科目",
      授業科目: "国語",
      科目番号: "J1001",
      単位種別: "学修単位",
      単位数: "2",
      学科: "情報科学専攻",
      学年: "1",
      学期: "前期",
      担当教員: "教員D",
      履修上の区分: "必履修"
    }
  ];

  it("6科目以上の英語科目を履修している場合、要件を満たしていると判定する", () => {
    // 6科目が履修済みの状態
    const mockCourseStatuses: CourseStatusMap = {
      "E7000": "単位取得済み",
      "E7001": "単位取得済み",
      "E7002": "単位取得済み",
      "E7003": "単位取得済み",
      "E7004": "単位取得済み",
      "E7005": "履修予定",
      "E7006": "未履修",
      "J1001": "単位取得済み"
    };

    const result = checkJabeeEnglishRequirement(
      mockSyllabusItems,
      mockCourseStatuses
    );

    assertEquals(result.name, "JABEE英語科目要件");
    assertEquals(result.satisfied, true);
    assertEquals(result.details?.completed, 6); // 6科目履修済み
    assertEquals(result.details?.completedItems?.length, 6);
    assertEquals(result.details?.total, 6); // 要件は6科目以上
  });

  it("5科目以下の英語科目しか履修していない場合、要件を満たしていないと判定する", () => {
    // 5科目のみ履修済みの状態
    const mockCourseStatuses: CourseStatusMap = {
      "E7000": "単位取得済み",
      "E7001": "単位取得済み",
      "E7002": "単位取得済み",
      "E7003": "単位取得済み",
      "E7004": "単位取得済み",
      "E7005": "未履修",
      "E7006": "未履修",
      "J1001": "単位取得済み"
    };

    const result = checkJabeeEnglishRequirement(
      mockSyllabusItems,
      mockCourseStatuses
    );

    assertEquals(result.satisfied, false); // 要件未達
    assertEquals(result.details?.completed, 5); // 5科目しか履修していない
  });

  it("「履修予定」の科目も含めて6科目以上あれば要件を満たしていると判定する", () => {
    // 3科目が単位取得済み、3科目が履修予定の状態
    const mockCourseStatuses: CourseStatusMap = {
      "E7000": "単位取得済み",
      "E7001": "単位取得済み",
      "E7002": "単位取得済み",
      "E7003": "履修予定",
      "E7004": "履修予定",
      "E7005": "履修予定",
      "E7006": "未履修",
      "J1001": "単位取得済み"
    };

    const result = checkJabeeEnglishRequirement(
      mockSyllabusItems,
      mockCourseStatuses
    );

    assertEquals(result.satisfied, true); // 要件達成
    assertEquals(result.details?.completed, 6); // 6科目履修（予定含む）
  });

  it("シラバスに英語科目がない場合、要件を満たさないと判定する", () => {
    // 英語科目を含まないシラバス
    const noEnglishSyllabusItems: SyllabusItem[] = [
      {
        本科または専攻科: "本科",
        科目区分1: "一般",
        科目区分2: "必修",
        科における科目種: "一般科目",
        授業科目: "国語",
        科目番号: "J1001",
        単位種別: "学修単位",
        単位数: "2",
        学科: "情報科学専攻",
        学年: "1",
        学期: "前期",
        担当教員: "教員D",
        履修上の区分: "必履修"
      }
    ];

    const mockCourseStatuses: CourseStatusMap = {
      "J1001": "単位取得済み"
    };

    const result = checkJabeeEnglishRequirement(
      noEnglishSyllabusItems,
      mockCourseStatuses
    );

    assertEquals(result.satisfied, false); // 要件未達
    assertEquals(result.details?.completed, 0); // 0科目
  });
});

describe("checkJabeeMathScienceRequirement", () => {
  // テスト用の数学・自然科学系科目のシラバスアイテムを作成
  const createMathScienceCourseItem = (
    courseName: string,
    courseNumber: string,
    credits: string = "2"
  ): SyllabusItem => ({
    本科または専攻科: "本科",
    科目区分1: "一般",
    科目区分2: "必修",
    科における科目種: "数学・自然科学",
    授業科目: courseName,
    科目番号: courseNumber,
    単位種別: "学修単位",
    単位数: credits,
    学科: "情報科学専攻",
    学年: "3",
    学期: "前期",
    担当教員: "テスト太郎",
    履修上の区分: "必修",
  });

  it("10科目以上履修している場合は合格", () => {
    // 数学・自然科学系科目のモックデータを作成
    const mathScienceCourses = MATH_SCIENCE_COURSES.slice(0, 12).map((courseName, index) => 
      createMathScienceCourseItem(courseName, `MS${String(index + 1).padStart(3, "0")}`)
    );

    // 11科目を履修済みに設定
    const courseStatusMap: CourseStatusMap = {};
    for (let i = 0; i < 10; i++) {
      courseStatusMap[`MS${String(i + 1).padStart(3, "0")}`] = "単位取得済み";
    }
    courseStatusMap[`MS011`] = "履修予定";

    const result = checkJabeeMathScienceRequirement(mathScienceCourses, courseStatusMap);
    assertEquals(result.satisfied, true);
    assertEquals(result.details?.completed, 11);
  });

  it("10科目未満の場合は不合格", () => {
    // 数学・自然科学系科目のモックデータを作成
    const mathScienceCourses = MATH_SCIENCE_COURSES.slice(0, 11).map((courseName, index) => 
      createMathScienceCourseItem(courseName, `MS${String(index + 1).padStart(3, "0")}`)
    );

    // 9科目のみ履修済みに設定
    const courseStatusMap: CourseStatusMap = {};
    for (let i = 0; i < 9; i++) {
      courseStatusMap[`MS${String(i + 1).padStart(3, "0")}`] = "単位取得済み";
    }

    const result = checkJabeeMathScienceRequirement(mathScienceCourses, courseStatusMap);
    assertEquals(result.satisfied, false);
    assertEquals(result.details?.completed, 9);
  });

  it("予定科目や履修中科目も含めて10科目以上の場合は合格", () => {
    // 数学・自然科学系科目のモックデータを作成
    const mathScienceCourses = MATH_SCIENCE_COURSES.slice(0, 11).map((courseName, index) => 
      createMathScienceCourseItem(courseName, `MS${String(index + 1).padStart(3, "0")}`)
    );

    // 8科目履修済み、2科目履修中に設定
    const courseStatusMap: CourseStatusMap = {};
    for (let i = 0; i < 8; i++) {
      courseStatusMap[`MS${String(i + 1).padStart(3, "0")}`] = "単位取得済み";
    }
    courseStatusMap[`MS009`] = "履修予定";
    courseStatusMap[`MS010`] = "履修予定";

    const result = checkJabeeMathScienceRequirement(mathScienceCourses, courseStatusMap);
    assertEquals(result.satisfied, true);
    assertEquals(result.details?.completed, 10);
  });
});

describe("checkJabeeInformationTechnologyRequirement", () => {
  // テスト用の情報技術系科目のシラバスアイテムを作成
  const createInfoTechCourseItem = (
    courseName: string,
    courseNumber: string,
    credits: string = "2"
  ): SyllabusItem => ({
    本科または専攻科: "本科",
    科目区分1: "専門",
    科目区分2: "選択",
    科における科目種: "専門科目",
    授業科目: courseName,
    科目番号: courseNumber,
    単位種別: "学修単位",
    単位数: credits,
    学科: "情報科学専攻",
    学年: "4",
    学期: "前期",
    担当教員: "教員E",
    履修上の区分: "選択"
  });

  it("2科目以上の情報技術系科目を履修している場合、要件を満たしていると判定する", () => {
    // 情報技術系科目のモックデータを作成
    const infoTechCourses = INFORMATION_TECHNOLOGY_COURSES.slice(0, 3).map((courseName, index) => 
      createInfoTechCourseItem(courseName, `IT${String(index + 1).padStart(3, "0")}`)
    );

    // 2科目を履修済みに設定
    const courseStatusMap: CourseStatusMap = {
      "IT001": "単位取得済み",
      "IT002": "単位取得済み",
      "IT003": "未履修"
    };

    const result = checkJabeeInformationTechnologyRequirement(infoTechCourses, courseStatusMap);
    assertEquals(result.satisfied, true);
    assertEquals(result.details?.completed, 2);
  });

  it("情報技術系科目を1科目しか履修していない場合、要件を満たしていないと判定する", () => {
    // 情報技術系科目のモックデータを作成
    const infoTechCourses = INFORMATION_TECHNOLOGY_COURSES.slice(0, 3).map((courseName, index) => 
      createInfoTechCourseItem(courseName, `IT${String(index + 1).padStart(3, "0")}`)
    );

    // 1科目のみ履修済みに設定
    const courseStatusMap: CourseStatusMap = {
      "IT001": "単位取得済み",
      "IT002": "未履修",
      "IT003": "未履修"
    };

    const result = checkJabeeInformationTechnologyRequirement(infoTechCourses, courseStatusMap);
    assertEquals(result.satisfied, false);
    assertEquals(result.details?.completed, 1);
  });

  it("「履修予定」の科目も含めて2科目以上あれば要件を満たしていると判定する", () => {
    // 情報技術系科目のモックデータを作成
    const infoTechCourses = INFORMATION_TECHNOLOGY_COURSES.slice(0, 3).map((courseName, index) => 
      createInfoTechCourseItem(courseName, `IT${String(index + 1).padStart(3, "0")}`)
    );

    // 1科目単位取得済み、1科目履修予定の状態
    const courseStatusMap: CourseStatusMap = {
      "IT001": "単位取得済み",
      "IT002": "履修予定",
      "IT003": "未履修"
    };

    const result = checkJabeeInformationTechnologyRequirement(infoTechCourses, courseStatusMap);
    assertEquals(result.satisfied, true);
    assertEquals(result.details?.completed, 2);
  });

  it("シラバスに情報技術系科目がない場合、要件を満たさないと判定する", () => {
    // 情報技術系科目を含まないシラバス
    const noInfoTechSyllabusItems: SyllabusItem[] = [
      {
        本科または専攻科: "本科",
        科目区分1: "一般",
        科目区分2: "必修",
        科における科目種: "一般科目",
        授業科目: "国語",
        科目番号: "J1001",
        単位種別: "学修単位",
        単位数: "2",
        学科: "情報科学専攻",
        学年: "1",
        学期: "前期",
        担当教員: "教員D",
        履修上の区分: "必履修"
      }
    ];

    const mockCourseStatuses: CourseStatusMap = {
      "J1001": "単位取得済み"
    };

    const result = checkJabeeInformationTechnologyRequirement(
      noInfoTechSyllabusItems,
      mockCourseStatuses
    );

    assertEquals(result.satisfied, false);
    assertEquals(result.details?.completed, 0);
  });
});

describe("checkJabeeComputerArchitectureRequirement", () => {
  // テスト用のコンピュータアーキテクチャ科目のシラバスアイテムを作成
  const createComputerArchitectureCourseItem = (
    courseNumber: string = "CA001",
    credits: string = "2"
  ): SyllabusItem => ({
    本科または専攻科: "本科",
    科目区分1: "専門",
    科目区分2: "必修",
    科における科目種: "専門科目",
    授業科目: COMPUTER_ARCHITECTURE_COURSE,
    科目番号: courseNumber,
    単位種別: "学修単位",
    単位数: credits,
    学科: "情報科学専攻",
    学年: "3",
    学期: "前期",
    担当教員: "教員F",
    履修上の区分: "必履修"
  });

  it("コンピュータアーキテクチャを履修している場合、要件を満たしていると判定する", () => {
    // コンピュータアーキテクチャを含むシラバス
    const syllabusItems: SyllabusItem[] = [
      createComputerArchitectureCourseItem(),
      {
        本科または専攻科: "本科",
        科目区分1: "専門",
        科目区分2: "必修",
        科における科目種: "専門科目",
        授業科目: "プログラミング入門",
        科目番号: "P001",
        単位種別: "学修単位",
        単位数: "2",
        学科: "情報科学専攻",
        学年: "1",
        学期: "前期",
        担当教員: "教員G",
        履修上の区分: "必履修"
      }
    ];

    // コンピュータアーキテクチャを履修済みに設定
    const courseStatusMap: CourseStatusMap = {
      "CA001": "単位取得済み",
      "P001": "単位取得済み"
    };

    const result = checkJabeeComputerArchitectureRequirement(syllabusItems, courseStatusMap);
    assertEquals(result.satisfied, true);
    assertEquals(result.details?.completed, 1);
  });

  it("コンピュータアーキテクチャが履修予定の場合も、要件を満たしていると判定する", () => {
    // コンピュータアーキテクチャを含むシラバス
    const syllabusItems: SyllabusItem[] = [
      createComputerArchitectureCourseItem()
    ];

    // コンピュータアーキテクチャが履修予定の状態
    const courseStatusMap: CourseStatusMap = {
      "CA001": "履修予定"
    };

    const result = checkJabeeComputerArchitectureRequirement(syllabusItems, courseStatusMap);
    assertEquals(result.satisfied, true);
    assertEquals(result.details?.completed, 1);
  });

  it("コンピュータアーキテクチャを履修していない場合、要件を満たしていないと判定する", () => {
    // コンピュータアーキテクチャを含むシラバス
    const syllabusItems: SyllabusItem[] = [
      createComputerArchitectureCourseItem()
    ];

    // コンピュータアーキテクチャが未履修の状態
    const courseStatusMap: CourseStatusMap = {
      "CA001": "未履修"
    };

    const result = checkJabeeComputerArchitectureRequirement(syllabusItems, courseStatusMap);
    assertEquals(result.satisfied, false);
    assertEquals(result.details?.completed, 0);
  });

  it("シラバスにコンピュータアーキテクチャがない場合、要件を満たしていないと判定する", () => {
    // コンピュータアーキテクチャを含まないシラバス
    const syllabusItems: SyllabusItem[] = [
      {
        本科または専攻科: "本科",
        科目区分1: "専門",
        科目区分2: "必修",
        科における科目種: "専門科目",
        授業科目: "プログラミング入門",
        科目番号: "P001",
        単位種別: "学修単位",
        単位数: "2",
        学科: "情報科学専攻",
        学年: "1",
        学期: "前期",
        担当教員: "教員G",
        履修上の区分: "必履修"
      }
    ];

    const courseStatusMap: CourseStatusMap = {
      "P001": "単位取得済み"
    };

    const result = checkJabeeComputerArchitectureRequirement(syllabusItems, courseStatusMap);
    assertEquals(result.satisfied, false);
    assertEquals(result.details?.completed, 0);
  });
});

describe("checkJabeeComputerSystemCoursesRequirement", () => {
  // テスト用のコンピュータシステム系科目のシラバスアイテムを作成
  const createComputerSystemCourseItem = (
    courseName: string,
    courseNumber: string,
    credits: string = "2"
  ): SyllabusItem => ({
    本科または専攻科: "本科",
    科目区分1: "専門",
    科目区分2: "選択",
    科における科目種: "専門科目",
    授業科目: courseName,
    科目番号: courseNumber,
    単位種別: "学修単位",
    単位数: credits,
    学科: "情報科学専攻",
    学年: "3",
    学期: "前期",
    担当教員: "教員H",
    履修上の区分: "選択"
  });

  it("5科目以上のコンピュータシステム系科目を履修している場合、要件を満たしていると判定する", () => {
    // コンピュータシステム系科目のモックデータを作成
    const computerSystemCourses = COMPUTER_SYSTEM_COURSES.map((courseName, index) => 
      createComputerSystemCourseItem(courseName, `CS${String(index + 1).padStart(3, "0")}`)
    );

    // 5科目を履修済みに設定
    const courseStatusMap: CourseStatusMap = {
      "CS001": "単位取得済み",
      "CS002": "単位取得済み",
      "CS003": "単位取得済み",
      "CS004": "単位取得済み",
      "CS005": "単位取得済み",
      "CS006": "未履修"
    };

    const result = checkJabeeComputerSystemCoursesRequirement(computerSystemCourses, courseStatusMap);
    assertEquals(result.satisfied, true);
    assertEquals(result.details?.completed, 5);
  });

  it("4科目以下のコンピュータシステム系科目しか履修していない場合、要件を満たしていないと判定する", () => {
    // コンピュータシステム系科目のモックデータを作成
    const computerSystemCourses = COMPUTER_SYSTEM_COURSES.map((courseName, index) => 
      createComputerSystemCourseItem(courseName, `CS${String(index + 1).padStart(3, "0")}`)
    );

    // 4科目のみ履修済みに設定
    const courseStatusMap: CourseStatusMap = {
      "CS001": "単位取得済み",
      "CS002": "単位取得済み",
      "CS003": "単位取得済み",
      "CS004": "単位取得済み",
      "CS005": "未履修",
      "CS006": "未履修"
    };

    const result = checkJabeeComputerSystemCoursesRequirement(computerSystemCourses, courseStatusMap);
    assertEquals(result.satisfied, false);
    assertEquals(result.details?.completed, 4);
  });

  it("「履修予定」の科目も含めて5科目以上あれば要件を満たしていると判定する", () => {
    // コンピュータシステム系科目のモックデータを作成
    const computerSystemCourses = COMPUTER_SYSTEM_COURSES.map((courseName, index) => 
      createComputerSystemCourseItem(courseName, `CS${String(index + 1).padStart(3, "0")}`)
    );

    // 3科目履修済み、2科目履修予定に設定
    const courseStatusMap: CourseStatusMap = {
      "CS001": "単位取得済み",
      "CS002": "単位取得済み",
      "CS003": "単位取得済み",
      "CS004": "履修予定",
      "CS005": "履修予定",
      "CS006": "未履修"
    };

    const result = checkJabeeComputerSystemCoursesRequirement(computerSystemCourses, courseStatusMap);
    assertEquals(result.satisfied, true);
    assertEquals(result.details?.completed, 5);
  });

  it("シラバスにコンピュータシステム系科目が不足している場合、要件を満たさないと判定する", () => {
    // 3科目しかないシラバス
    const limitedCourses = COMPUTER_SYSTEM_COURSES.slice(0, 3).map((courseName, index) => 
      createComputerSystemCourseItem(courseName, `CS${String(index + 1).padStart(3, "0")}`)
    );

    // すべて履修済みに設定
    const courseStatusMap: CourseStatusMap = {
      "CS001": "単位取得済み",
      "CS002": "単位取得済み",
      "CS003": "単位取得済み"
    };

    const result = checkJabeeComputerSystemCoursesRequirement(limitedCourses, courseStatusMap);
    assertEquals(result.satisfied, false);
    assertEquals(result.details?.completed, 3);
  });
});

describe("checkJabeeSystemProgrammingRequirement", () => {
  // テスト用のシステムプログラム系科目のシラバスアイテムを作成
  const createSystemProgrammingCourseItem = (
    courseName: string,
    courseNumber: string,
    credits: string = "2"
  ): SyllabusItem => ({
    本科または専攻科: "本科",
    科目区分1: "専門",
    科目区分2: "必修",
    科における科目種: "専門科目",
    授業科目: courseName,
    科目番号: courseNumber,
    単位種別: "学修単位",
    単位数: credits,
    学科: "情報科学専攻",
    学年: "3",
    学期: "前期",
    担当教員: "教員I",
    履修上の区分: "必履修"
  });

  it("システムプログラム系の全科目を履修し、2科目以上単位修得している場合、要件を満たしていると判定する", () => {
    // システムプログラム系の全科目をシラバスに追加
    const systemProgrammingCourses = SYSTEM_PROGRAMMING_COURSES.map((courseName, index) => 
      createSystemProgrammingCourseItem(courseName, `SP${String(index + 1).padStart(3, "0")}`)
    );

    // 全科目を履修し、2科目の単位を修得
    const courseStatusMap: CourseStatusMap = {
      "SP001": "単位取得済み",
      "SP002": "単位取得済み",
      "SP003": "履修予定"
    };

    const result = checkJabeeSystemProgrammingRequirement(systemProgrammingCourses, courseStatusMap);
    assertEquals(result.satisfied, true);
    assertEquals(result.details?.completed, 2);
  });

  it("全科目を履修しているが、単位修得が1科目しかない場合、要件を満たしていないと判定する", () => {
    // システムプログラム系の全科目をシラバスに追加
    const systemProgrammingCourses = SYSTEM_PROGRAMMING_COURSES.map((courseName, index) => 
      createSystemProgrammingCourseItem(courseName, `SP${String(index + 1).padStart(3, "0")}`)
    );

    // 全科目を履修しているが、1科目しか単位を修得していない
    const courseStatusMap: CourseStatusMap = {
      "SP001": "単位取得済み",
      "SP002": "履修予定",
      "SP003": "履修予定"
    };

    const result = checkJabeeSystemProgrammingRequirement(systemProgrammingCourses, courseStatusMap);
    assertEquals(result.satisfied, false);
    assertEquals(result.details?.completed, 1);
  });

  it("すべての科目が履修予定で単位未修得の場合、要件を満たしていないと判定する", () => {
    // システムプログラム系の全科目をシラバスに追加
    const systemProgrammingCourses = SYSTEM_PROGRAMMING_COURSES.map((courseName, index) => 
      createSystemProgrammingCourseItem(courseName, `SP${String(index + 1).padStart(3, "0")}`)
    );

    // すべて履修予定だが単位未修得
    const courseStatusMap: CourseStatusMap = {
      "SP001": "履修予定",
      "SP002": "履修予定",
      "SP003": "履修予定"
    };

    const result = checkJabeeSystemProgrammingRequirement(systemProgrammingCourses, courseStatusMap);
    assertEquals(result.satisfied, false);
    assertEquals(result.details?.completed, 0);
  });

  it("いくつかの科目が未履修の場合、要件を満たしていないと判定する", () => {
    // システムプログラム系の全科目をシラバスに追加
    const systemProgrammingCourses = SYSTEM_PROGRAMMING_COURSES.map((courseName, index) => 
      createSystemProgrammingCourseItem(courseName, `SP${String(index + 1).padStart(3, "0")}`)
    );

    // 1科目が未履修
    const courseStatusMap: CourseStatusMap = {
      "SP001": "単位取得済み",
      "SP002": "単位取得済み",
      "SP003": "未履修"
    };

    const result = checkJabeeSystemProgrammingRequirement(systemProgrammingCourses, courseStatusMap);
    assertEquals(result.satisfied, false);
  });

  it("必要な科目がシラバスに含まれていない場合、要件を満たしていないと判定する", () => {
    // 一部の科目のみシラバスに含まれている場合
    const partialCourses = SYSTEM_PROGRAMMING_COURSES.slice(0, 2).map((courseName, index) => 
      createSystemProgrammingCourseItem(courseName, `SP${String(index + 1).padStart(3, "0")}`)
    );

    // 含まれている科目は履修済み
    const courseStatusMap: CourseStatusMap = {
      "SP001": "単位取得済み",
      "SP002": "単位取得済み"
    };

    const result = checkJabeeSystemProgrammingRequirement(partialCourses, courseStatusMap);
    assertEquals(result.satisfied, false);
  });

  it("全科目を履修し、3科目すべての単位を修得している場合、要件を満たしていると判定する", () => {
    // システムプログラム系の全科目をシラバスに追加
    const systemProgrammingCourses = SYSTEM_PROGRAMMING_COURSES.map((courseName, index) => 
      createSystemProgrammingCourseItem(courseName, `SP${String(index + 1).padStart(3, "0")}`)
    );

    // 全科目の単位を修得
    const courseStatusMap: CourseStatusMap = {
      "SP001": "単位取得済み",
      "SP002": "単位取得済み",
      "SP003": "単位取得済み"
    };

    const result = checkJabeeSystemProgrammingRequirement(systemProgrammingCourses, courseStatusMap);
    assertEquals(result.satisfied, true);
    assertEquals(result.details?.completed, 3);
  });
});

describe("checkJabeeSystemProgrammingFullRequirement", () => {
  // テスト用のシステムプログラム系科目のシラバスアイテムを作成
  const createSystemProgrammingCourseFullItem = (
    courseName: string,
    courseNumber: string,
    credits: string = "2"
  ): SyllabusItem => ({
    本科または専攻科: "本科",
    科目区分1: "専門",
    科目区分2: "必修",
    科における科目種: "専門科目",
    授業科目: courseName,
    科目番号: courseNumber,
    単位種別: "学修単位",
    単位数: credits,
    学科: "情報科学専攻",
    学年: "3",
    学期: "前期",
    担当教員: "教員J",
    履修上の区分: "必履修"
  });

  it("5科目以上のシステムプログラム系科目を履修している場合、要件を満たしていると判定する", () => {
    // システムプログラム系の全科目をシラバスに追加
    const systemProgrammingCourses = SYSTEM_PROGRAMMING_COURSES_FULL.map((courseName, index) => 
      createSystemProgrammingCourseFullItem(courseName, `SPF${String(index + 1).padStart(3, "0")}`)
    );

    // 5科目の単位を修得
    const courseStatusMap: CourseStatusMap = {
      "SPF001": "単位取得済み",
      "SPF002": "単位取得済み",
      "SPF003": "単位取得済み",
      "SPF004": "単位取得済み",
      "SPF005": "単位取得済み",
      "SPF006": "未履修"
    };

    const result = checkJabeeSystemProgrammingFullRequirement(systemProgrammingCourses, courseStatusMap);
    assertEquals(result.satisfied, true);
    assertEquals(result.details?.completed, 5);
  });

  it("4科目以下のシステムプログラム系科目しか履修していない場合、要件を満たしていないと判定する", () => {
    // システムプログラム系の全科目をシラバスに追加
    const systemProgrammingCourses = SYSTEM_PROGRAMMING_COURSES_FULL.map((courseName, index) => 
      createSystemProgrammingCourseFullItem(courseName, `SPF${String(index + 1).padStart(3, "0")}`)
    );

    // 4科目のみ単位を修得
    const courseStatusMap: CourseStatusMap = {
      "SPF001": "単位取得済み",
      "SPF002": "単位取得済み",
      "SPF003": "単位取得済み",
      "SPF004": "単位取得済み",
      "SPF005": "未履修",
      "SPF006": "未履修"
    };

    const result = checkJabeeSystemProgrammingFullRequirement(systemProgrammingCourses, courseStatusMap);
    assertEquals(result.satisfied, false);
    assertEquals(result.details?.completed, 4);
  });

  it("「履修予定」の科目も含めて5科目以上あれば要件を満たしていると判定する", () => {
    // システムプログラム系の全科目をシラバスに追加
    const systemProgrammingCourses = SYSTEM_PROGRAMMING_COURSES_FULL.map((courseName, index) => 
      createSystemProgrammingCourseFullItem(courseName, `SPF${String(index + 1).padStart(3, "0")}`)
    );

    // 3科目単位取得済み、2科目履修予定の状態
    const courseStatusMap: CourseStatusMap = {
      "SPF001": "単位取得済み",
      "SPF002": "単位取得済み",
      "SPF003": "単位取得済み",
      "SPF004": "履修予定",
      "SPF005": "履修予定",
      "SPF006": "未履修"
    };

    const result = checkJabeeSystemProgrammingFullRequirement(systemProgrammingCourses, courseStatusMap);
    assertEquals(result.satisfied, true);
    assertEquals(result.details?.completed, 5);
  });

  it("シラバスに含まれるシステムプログラム系科目が少ない場合、要件を満たさないと判定する", () => {
    // 4科目しかないシラバス
    const limitedCourses = SYSTEM_PROGRAMMING_COURSES_FULL.slice(0, 4).map((courseName, index) => 
      createSystemProgrammingCourseFullItem(courseName, `SPF${String(index + 1).padStart(3, "0")}`)
    );

    // すべて履修済みに設定
    const courseStatusMap: CourseStatusMap = {
      "SPF001": "単位取得済み",
      "SPF002": "単位取得済み",
      "SPF003": "単位取得済み",
      "SPF004": "単位取得済み"
    };

    const result = checkJabeeSystemProgrammingFullRequirement(limitedCourses, courseStatusMap);
    assertEquals(result.satisfied, false);
    assertEquals(result.details?.completed, 4);
  });

  it("全6科目すべての単位を修得している場合、要件を満たしていると判定する", () => {
    // システムプログラム系の全科目をシラバスに追加
    const systemProgrammingCourses = SYSTEM_PROGRAMMING_COURSES_FULL.map((courseName, index) => 
      createSystemProgrammingCourseFullItem(courseName, `SPF${String(index + 1).padStart(3, "0")}`)
    );

    // 全科目の単位を修得
    const courseStatusMap: CourseStatusMap = {
      "SPF001": "単位取得済み",
      "SPF002": "単位取得済み",
      "SPF003": "単位取得済み",
      "SPF004": "単位取得済み",
      "SPF005": "単位取得済み",
      "SPF006": "単位取得済み"
    };

    const result = checkJabeeSystemProgrammingFullRequirement(systemProgrammingCourses, courseStatusMap);
    assertEquals(result.satisfied, true);
    assertEquals(result.details?.completed, 6);
  });
});

describe("checkJabeeInformationCommunicationRequirement", () => {
  // テスト用の情報通信・信号処理系科目のシラバスアイテムを作成
  const createInfoCommCourseItem = (
    courseName: string,
    courseNumber: string,
    credits: string = "2"
  ): SyllabusItem => ({
    本科または専攻科: "本科",
    科目区分1: "専門",
    科目区分2: "選択",
    科における科目種: "専門科目",
    授業科目: courseName,
    科目番号: courseNumber,
    単位種別: "学修単位",
    単位数: credits,
    学科: "情報科学専攻",
    学年: "3",
    学期: "前期",
    担当教員: "教員K",
    履修上の区分: "選択"
  });

  it("4科目以上の情報通信・信号処理系科目を履修している場合、要件を満たしていると判定する", () => {
    // 情報通信・信号処理系科目のモックデータを作成
    const infoCommCourses = INFORMATION_COMMUNICATION_COURSES.map((courseName, index) => 
      createInfoCommCourseItem(courseName, `IC${String(index + 1).padStart(3, "0")}`)
    );

    // 4科目の単位を修得
    const courseStatusMap: CourseStatusMap = {
      "IC001": "単位取得済み",
      "IC002": "単位取得済み",
      "IC003": "単位取得済み",
      "IC004": "単位取得済み",
      "IC005": "未履修",
      "IC006": "未履修",
      "IC007": "未履修",
      "IC008": "未履修",
      "IC009": "未履修"
    };

    const result = checkJabeeInformationCommunicationRequirement(infoCommCourses, courseStatusMap);
    assertEquals(result.satisfied, true);
    assertEquals(result.details?.completed, 4);
  });

  it("3科目以下の情報通信・信号処理系科目しか履修していない場合、要件を満たしていないと判定する", () => {
    // 情報通信・信号処理系科目のモックデータを作成
    const infoCommCourses = INFORMATION_COMMUNICATION_COURSES.map((courseName, index) => 
      createInfoCommCourseItem(courseName, `IC${String(index + 1).padStart(3, "0")}`)
    );

    // 3科目のみ単位を修得
    const courseStatusMap: CourseStatusMap = {
      "IC001": "単位取得済み",
      "IC002": "単位取得済み",
      "IC003": "単位取得済み",
      "IC004": "未履修",
      "IC005": "未履修",
      "IC006": "未履修",
      "IC007": "未履修",
      "IC008": "未履修",
      "IC009": "未履修"
    };

    const result = checkJabeeInformationCommunicationRequirement(infoCommCourses, courseStatusMap);
    assertEquals(result.satisfied, false);
    assertEquals(result.details?.completed, 3);
  });

  it("「履修予定」の科目も含めて4科目以上あれば要件を満たしていると判定する", () => {
    // 情報通信・信号処理系科目のモックデータを作成
    const infoCommCourses = INFORMATION_COMMUNICATION_COURSES.map((courseName, index) => 
      createInfoCommCourseItem(courseName, `IC${String(index + 1).padStart(3, "0")}`)
    );

    // 2科目単位取得済み、2科目履修予定の状態
    const courseStatusMap: CourseStatusMap = {
      "IC001": "単位取得済み",
      "IC002": "単位取得済み",
      "IC003": "履修予定",
      "IC004": "履修予定",
      "IC005": "未履修",
      "IC006": "未履修",
      "IC007": "未履修",
      "IC008": "未履修",
      "IC009": "未履修"
    };

    const result = checkJabeeInformationCommunicationRequirement(infoCommCourses, courseStatusMap);
    assertEquals(result.satisfied, true);
    assertEquals(result.details?.completed, 4);
  });

  it("シラバスに含まれる情報通信・信号処理系科目が少ない場合でも、4科目以上修得していれば要件を満たすと判定する", () => {
    // 4科目のみのシラバス
    const limitedCourses = INFORMATION_COMMUNICATION_COURSES.slice(0, 4).map((courseName, index) => 
      createInfoCommCourseItem(courseName, `IC${String(index + 1).padStart(3, "0")}`)
    );

    // すべて履修済みに設定
    const courseStatusMap: CourseStatusMap = {
      "IC001": "単位取得済み",
      "IC002": "単位取得済み",
      "IC003": "単位取得済み",
      "IC004": "単位取得済み"
    };

    const result = checkJabeeInformationCommunicationRequirement(limitedCourses, courseStatusMap);
    assertEquals(result.satisfied, true);
    assertEquals(result.details?.completed, 4);
  });

  it("全9科目すべての単位を修得している場合、要件を満たしていると判定する", () => {
    // 情報通信・信号処理系科目のすべてをシラバスに追加
    const infoCommCourses = INFORMATION_COMMUNICATION_COURSES.map((courseName, index) => 
      createInfoCommCourseItem(courseName, `IC${String(index + 1).padStart(3, "0")}`)
    );

    // 全科目の単位を修得
    const courseStatusMap: CourseStatusMap = {};
    for (let i = 1; i <= 9; i++) {
      courseStatusMap[`IC${String(i).padStart(3, "0")}`] = "単位取得済み";
    }

    const result = checkJabeeInformationCommunicationRequirement(infoCommCourses, courseStatusMap);
    assertEquals(result.satisfied, true);
    assertEquals(result.details?.completed, 9);
  });
});

describe("checkJabeeComputerApplicationRequirement", () => {
  it("3科目以上のコンピュータ応用系科目を履修している場合、要件を満たしていると判定する", () => {
    // コンピュータ応用系科目のモックデータを作成
    const computerApplicationCourses = [
      createComputerApplicationCourseItem("知能メディア処理", "CA001"),
      createComputerApplicationCourseItem("応用情報システム", "CA002"),
      createComputerApplicationCourseItem("パターン情報処理", "CA003"),
      createComputerApplicationCourseItem("知識情報工学", "CA004"),
    ];

    // 科目ステータスのモックデータを作成（3科目は単位取得済み）
    const courseStatuses: CourseStatusMap = {
      CA001: "単位取得済み",
      CA002: "単位取得済み",
      CA003: "単位取得済み",
      CA004: "未履修",
    };

    // 要件チェック関数を実行
    const result = checkJabeeComputerApplicationRequirement(
      computerApplicationCourses,
      courseStatuses
    );

    // 3科目以上履修しているので、要件を満たしているはず
    assertEquals(result.satisfied, true);
    assertEquals(result.details?.completed, 3);
  });

  it("2科目以下のコンピュータ応用系科目しか履修していない場合、要件を満たしていないと判定する", () => {
    // コンピュータ応用系科目のモックデータを作成
    const computerApplicationCourses = [
      createComputerApplicationCourseItem("知能メディア処理", "CA001"),
      createComputerApplicationCourseItem("応用情報システム", "CA002"),
      createComputerApplicationCourseItem("パターン情報処理", "CA003"),
      createComputerApplicationCourseItem("知識情報工学", "CA004"),
    ];

    // 科目ステータスのモックデータを作成（2科目のみ単位取得済み）
    const courseStatuses: CourseStatusMap = {
      CA001: "単位取得済み",
      CA002: "単位取得済み",
      CA003: "未履修",
      CA004: "未履修",
    };

    // 要件チェック関数を実行
    const result = checkJabeeComputerApplicationRequirement(
      computerApplicationCourses,
      courseStatuses
    );

    // 2科目以下の履修なので、要件を満たしていないはず
    assertEquals(result.satisfied, false);
    assertEquals(result.details?.completed, 2);
  });

  it("「履修予定」の科目も含めて3科目以上あれば要件を満たしていると判定する", () => {
    // コンピュータ応用系科目のモックデータを作成
    const computerApplicationCourses = [
      createComputerApplicationCourseItem("知能メディア処理", "CA001"),
      createComputerApplicationCourseItem("応用情報システム", "CA002"),
      createComputerApplicationCourseItem("パターン情報処理", "CA003"),
      createComputerApplicationCourseItem("知識情報工学", "CA004"),
    ];

    // 科目ステータスのモックデータを作成（2科目は単位取得済み、1科目は履修予定）
    const courseStatuses: CourseStatusMap = {
      CA001: "単位取得済み",
      CA002: "単位取得済み",
      CA003: "履修予定",
      CA004: "未履修",
    };

    // 要件チェック関数を実行
    const result = checkJabeeComputerApplicationRequirement(
      computerApplicationCourses,
      courseStatuses
    );

    // 履修予定も含めて3科目あるので、要件を満たしているはず
    assertEquals(result.satisfied, true);
    assertEquals(result.details?.completed, 3);
  });

  it("全科目すべての単位を修得している場合、要件を満たしていると判定する", () => {
    // コンピュータ応用系科目のモックデータを作成
    const computerApplicationCourses = [
      createComputerApplicationCourseItem("知能メディア処理", "CA001"),
      createComputerApplicationCourseItem("応用情報システム", "CA002"),
      createComputerApplicationCourseItem("パターン情報処理", "CA003"),
      createComputerApplicationCourseItem("知識情報工学", "CA004"),
    ];

    // 科目ステータスのモックデータを作成（全科目単位取得済み）
    const courseStatuses: CourseStatusMap = {
      CA001: "単位取得済み",
      CA002: "単位取得済み",
      CA003: "単位取得済み",
      CA004: "単位取得済み",
    };

    // 要件チェック関数を実行
    const result = checkJabeeComputerApplicationRequirement(
      computerApplicationCourses,
      courseStatuses
    );

    // 全科目履修しているので、要件を満たしているはず
    assertEquals(result.satisfied, true);
    assertEquals(result.details?.completed, 4);
  });
});

// コンピュータ応用系科目のテスト用関数
const createComputerApplicationCourseItem = (
  courseName: string,
  courseNumber: string,
  credits: string = "2"
): SyllabusItem => ({
  本科または専攻科: "本科",
  科目区分1: "専門",
  科目区分2: "選択",
  科における科目種: "専門科目",
  授業科目: courseName,
  科目番号: courseNumber,
  単位種別: "学修単位",
  単位数: credits,
  学科: "情報科学専攻",
  学年: "3",
  学期: "前期",
  担当教員: "教員K",
  履修上の区分: "選択"
});

// 数理科学系科目のテスト用関数
const createMathematicalScienceCourseItem = (
  courseName: string,
  courseNumber: string,
  credits: string = "2"
): SyllabusItem => ({
  本科または専攻科: "本科",
  科目区分1: "専門",
  科目区分2: "選択",
  科における科目種: "専門科目",
  授業科目: courseName,
  科目番号: courseNumber,
  単位種別: "学修単位",
  単位数: credits,
  学科: "情報科学専攻",
  学年: "3",
  学期: "前期",
  担当教員: "教員K",
  履修上の区分: "選択"
});

describe("checkJabeeMathematicalScienceRequirement", () => {
  it("情報数学Ⅰを履修している場合、要件を満たしていると判定する", () => {
    // 数理科学系科目のモックデータを作成
    const mathematicalScienceCourses = [
      createMathematicalScienceCourseItem("情報数学Ⅰ", "MS001"),
      createMathematicalScienceCourseItem("情報数学Ⅱ", "MS002"),
    ];

    // 科目ステータスのモックデータを作成（情報数学Ⅰのみ単位取得済み）
    const courseStatuses: CourseStatusMap = {
      MS001: "単位取得済み",
      MS002: "未履修",
    };

    // 要件チェック関数を実行
    const result = checkJabeeMathematicalScienceRequirement(
      mathematicalScienceCourses,
      courseStatuses
    );

    // 情報数学Ⅰを履修しているので、要件を満たしているはず
    assertEquals(result.satisfied, true);
    assertEquals(result.details?.completed, 1);
  });

  it("情報数学Ⅱを履修している場合、要件を満たしていると判定する", () => {
    // 数理科学系科目のモックデータを作成
    const mathematicalScienceCourses = [
      createMathematicalScienceCourseItem("情報数学Ⅰ", "MS001"),
      createMathematicalScienceCourseItem("情報数学Ⅱ", "MS002"),
    ];

    // 科目ステータスのモックデータを作成（情報数学Ⅱのみ単位取得済み）
    const courseStatuses: CourseStatusMap = {
      MS001: "未履修",
      MS002: "単位取得済み",
    };

    // 要件チェック関数を実行
    const result = checkJabeeMathematicalScienceRequirement(
      mathematicalScienceCourses,
      courseStatuses
    );

    // 情報数学Ⅱを履修しているので、要件を満たしているはず
    assertEquals(result.satisfied, true);
    assertEquals(result.details?.completed, 1);
  });

  it("情報数学Ⅰと情報数学Ⅱの両方を履修している場合、要件を満たしていると判定する", () => {
    // 数理科学系科目のモックデータを作成
    const mathematicalScienceCourses = [
      createMathematicalScienceCourseItem("情報数学Ⅰ", "MS001"),
      createMathematicalScienceCourseItem("情報数学Ⅱ", "MS002"),
    ];

    // 科目ステータスのモックデータを作成（両方とも単位取得済み）
    const courseStatuses: CourseStatusMap = {
      MS001: "単位取得済み",
      MS002: "単位取得済み",
    };

    // 要件チェック関数を実行
    const result = checkJabeeMathematicalScienceRequirement(
      mathematicalScienceCourses,
      courseStatuses
    );

    // 両方履修しているので、要件を満たしているはず
    assertEquals(result.satisfied, true);
    assertEquals(result.details?.completed, 2);
  });

  it("「履修予定」の科目も含めて要件を満たしていると判定する", () => {
    // 数理科学系科目のモックデータを作成
    const mathematicalScienceCourses = [
      createMathematicalScienceCourseItem("情報数学Ⅰ", "MS001"),
      createMathematicalScienceCourseItem("情報数学Ⅱ", "MS002"),
    ];

    // 科目ステータスのモックデータを作成（情報数学Ⅰは履修予定）
    const courseStatuses: CourseStatusMap = {
      MS001: "履修予定",
      MS002: "未履修",
    };

    // 要件チェック関数を実行
    const result = checkJabeeMathematicalScienceRequirement(
      mathematicalScienceCourses,
      courseStatuses
    );

    // 履修予定も含めて要件を満たしているはず
    assertEquals(result.satisfied, true);
    assertEquals(result.details?.completed, 1);
  });

  it("どちらの情報数学も履修していない場合、要件を満たしていないと判定する", () => {
    // 数理科学系科目のモックデータを作成
    const mathematicalScienceCourses = [
      createMathematicalScienceCourseItem("情報数学Ⅰ", "MS001"),
      createMathematicalScienceCourseItem("情報数学Ⅱ", "MS002"),
    ];

    // 科目ステータスのモックデータを作成（両方とも未履修）
    const courseStatuses: CourseStatusMap = {
      MS001: "未履修",
      MS002: "未履修",
    };

    // 要件チェック関数を実行
    const result = checkJabeeMathematicalScienceRequirement(
      mathematicalScienceCourses,
      courseStatuses
    );

    // どちらも履修していないので、要件を満たしていないはず
    assertEquals(result.satisfied, false);
    assertEquals(result.details?.completed, 0);
  });
}); 

describe("checkJabeeMathematicalScienceFullRequirement", () => {
  it("数理科学系科目を4科目以上履修している場合、要件を満たしていると判定する", () => {
    // 数理科学系科目のモックデータを作成
    const mathematicalScienceCourses = [
      createMathematicalScienceCourseItem("数値解析", "MSF001"),
      createMathematicalScienceCourseItem("情報数学Ⅰ", "MSF002"),
      createMathematicalScienceCourseItem("情報数学Ⅱ", "MSF003"),
      createMathematicalScienceCourseItem("システム工学", "MSF004"),
      createMathematicalScienceCourseItem("情報数学特論I", "MSF005"),
      createMathematicalScienceCourseItem("情報数学特論Ⅱ", "MSF006")
    ];

    // 科目ステータスのモックデータを作成（4科目は単位取得済み）
    const courseStatuses: CourseStatusMap = {
      MSF001: "単位取得済み",
      MSF002: "単位取得済み",
      MSF003: "単位取得済み",
      MSF004: "単位取得済み",
      MSF005: "未履修",
      MSF006: "未履修"
    };

    // 要件チェック関数を実行
    const result = checkJabeeMathematicalScienceFullRequirement(
      mathematicalScienceCourses,
      courseStatuses
    );

    // 4科目以上履修しているので、要件を満たしているはず
    assertEquals(result.satisfied, true);
    assertEquals(result.details?.completed, 4);
  });

  it("3科目以下の数理科学系科目しか履修していない場合、要件を満たしていないと判定する", () => {
    // 数理科学系科目のモックデータを作成
    const mathematicalScienceCourses = [
      createMathematicalScienceCourseItem("数値解析", "MSF001"),
      createMathematicalScienceCourseItem("情報数学Ⅰ", "MSF002"),
      createMathematicalScienceCourseItem("情報数学Ⅱ", "MSF003"),
      createMathematicalScienceCourseItem("システム工学", "MSF004"),
      createMathematicalScienceCourseItem("情報数学特論I", "MSF005"),
      createMathematicalScienceCourseItem("情報数学特論Ⅱ", "MSF006")
    ];

    // 科目ステータスのモックデータを作成（3科目のみ単位取得済み）
    const courseStatuses: CourseStatusMap = {
      MSF001: "単位取得済み",
      MSF002: "単位取得済み",
      MSF003: "単位取得済み",
      MSF004: "未履修",
      MSF005: "未履修",
      MSF006: "未履修"
    };

    // 要件チェック関数を実行
    const result = checkJabeeMathematicalScienceFullRequirement(
      mathematicalScienceCourses,
      courseStatuses
    );

    // 3科目以下の履修なので、要件を満たしていないはず
    assertEquals(result.satisfied, false);
    assertEquals(result.details?.completed, 3);
  });

  it("「履修予定」の科目も含めて4科目以上あれば要件を満たしていると判定する", () => {
    // 数理科学系科目のモックデータを作成
    const mathematicalScienceCourses = [
      createMathematicalScienceCourseItem("数値解析", "MSF001"),
      createMathematicalScienceCourseItem("情報数学Ⅰ", "MSF002"),
      createMathematicalScienceCourseItem("情報数学Ⅱ", "MSF003"),
      createMathematicalScienceCourseItem("システム工学", "MSF004"),
      createMathematicalScienceCourseItem("情報数学特論I", "MSF005"),
      createMathematicalScienceCourseItem("情報数学特論Ⅱ", "MSF006")
    ];

    // 科目ステータスのモックデータを作成（3科目は単位取得済み、1科目は履修予定）
    const courseStatuses: CourseStatusMap = {
      MSF001: "単位取得済み",
      MSF002: "単位取得済み",
      MSF003: "単位取得済み",
      MSF004: "履修予定",
      MSF005: "未履修",
      MSF006: "未履修"
    };

    // 要件チェック関数を実行
    const result = checkJabeeMathematicalScienceFullRequirement(
      mathematicalScienceCourses,
      courseStatuses
    );

    // 履修予定も含めて4科目あるので、要件を満たしているはず
    assertEquals(result.satisfied, true);
    assertEquals(result.details?.completed, 4);
  });

  it("全科目すべての単位を修得している場合、要件を満たしていると判定する", () => {
    // 数理科学系科目のモックデータを作成
    const mathematicalScienceCourses = [
      createMathematicalScienceCourseItem("数値解析", "MSF001"),
      createMathematicalScienceCourseItem("情報数学Ⅰ", "MSF002"),
      createMathematicalScienceCourseItem("情報数学Ⅱ", "MSF003"),
      createMathematicalScienceCourseItem("システム工学", "MSF004"),
      createMathematicalScienceCourseItem("情報数学特論I", "MSF005"),
      createMathematicalScienceCourseItem("情報数学特論Ⅱ", "MSF006")
    ];

    // 科目ステータスのモックデータを作成（全科目単位取得済み）
    const courseStatuses: CourseStatusMap = {
      MSF001: "単位取得済み",
      MSF002: "単位取得済み",
      MSF003: "単位取得済み",
      MSF004: "単位取得済み",
      MSF005: "単位取得済み",
      MSF006: "単位取得済み"
    };

    // 要件チェック関数を実行
    const result = checkJabeeMathematicalScienceFullRequirement(
      mathematicalScienceCourses,
      courseStatuses
    );

    // 全科目履修しているので、要件を満たしているはず
    assertEquals(result.satisfied, true);
    assertEquals(result.details?.completed, 6);
  });
});

// 実験・実習系科目のテスト用関数
const createExperimentPracticeCourseItem = (
  courseName: string,
  courseNumber: string,
  credits: string = "2"
): SyllabusItem => ({
  本科または専攻科: "本科",
  科目区分1: "専門",
  科目区分2: "必修",
  科における科目種: "専門科目",
  授業科目: courseName,
  科目番号: courseNumber,
  単位種別: "学修単位",
  単位数: credits,
  学科: "情報科学専攻",
  学年: "4",
  学期: "通年",
  担当教員: "教員L",
  履修上の区分: "必修"
});

describe("checkJabeeExperimentPracticeRequirement", () => {
  it("すべての実験・実習系必修科目を修得している場合、要件を満たしていると判定する", () => {
    // 実験・実習系必修科目のモックデータを作成
    const experimentPracticeCourses = [
      createExperimentPracticeCourseItem("エンジニアリングデザインⅡ", "EP001"),
      createExperimentPracticeCourseItem("情報工学ゼミⅡ", "EP002"),
      createExperimentPracticeCourseItem("情報科学実験", "EP003"),
      createExperimentPracticeCourseItem("卒業研究", "EP004"),
      createExperimentPracticeCourseItem("特別研究Ⅰ", "EP005"),
      createExperimentPracticeCourseItem("特別研究Ⅱ", "EP006")
    ];

    // 科目ステータスのモックデータを作成（すべて単位取得済み）
    const courseStatuses: CourseStatusMap = {
      EP001: "単位取得済み",
      EP002: "単位取得済み",
      EP003: "単位取得済み",
      EP004: "単位取得済み",
      EP005: "単位取得済み",
      EP006: "単位取得済み"
    };

    // 要件チェック関数を実行
    const result = checkJabeeExperimentPracticeRequirement(
      experimentPracticeCourses,
      courseStatuses
    );

    // すべての科目を修得しているので、要件を満たしているはず
    assertEquals(result.satisfied, true);
    assertEquals(result.details?.completed, 6);
  });

  it("一部の実験・実習系必修科目しか修得していない場合、要件を満たしていないと判定する", () => {
    // 実験・実習系必修科目のモックデータを作成
    const experimentPracticeCourses = [
      createExperimentPracticeCourseItem("エンジニアリングデザインⅡ", "EP001"),
      createExperimentPracticeCourseItem("情報工学ゼミⅡ", "EP002"),
      createExperimentPracticeCourseItem("情報科学実験", "EP003"),
      createExperimentPracticeCourseItem("卒業研究", "EP004"),
      createExperimentPracticeCourseItem("特別研究Ⅰ", "EP005"),
      createExperimentPracticeCourseItem("特別研究Ⅱ", "EP006")
    ];

    // 科目ステータスのモックデータを作成（一部のみ単位取得済み）
    const courseStatuses: CourseStatusMap = {
      EP001: "単位取得済み",
      EP002: "単位取得済み",
      EP003: "単位取得済み",
      EP004: "単位取得済み",
      EP005: "単位取得済み",
      EP006: "未履修"
    };

    // 要件チェック関数を実行
    const result = checkJabeeExperimentPracticeRequirement(
      experimentPracticeCourses,
      courseStatuses
    );

    // 一部の科目しか修得していないので、要件を満たしていないはず
    assertEquals(result.satisfied, false);
    assertEquals(result.details?.completed, 5);
  });

  it("「履修予定」の科目も含めてすべての科目があれば要件を満たしていると判定する", () => {
    // 実験・実習系必修科目のモックデータを作成
    const experimentPracticeCourses = [
      createExperimentPracticeCourseItem("エンジニアリングデザインⅡ", "EP001"),
      createExperimentPracticeCourseItem("情報工学ゼミⅡ", "EP002"),
      createExperimentPracticeCourseItem("情報科学実験", "EP003"),
      createExperimentPracticeCourseItem("卒業研究", "EP004"),
      createExperimentPracticeCourseItem("特別研究Ⅰ", "EP005"),
      createExperimentPracticeCourseItem("特別研究Ⅱ", "EP006")
    ];

    // 科目ステータスのモックデータを作成（一部は単位取得済み、一部は履修予定）
    const courseStatuses: CourseStatusMap = {
      EP001: "単位取得済み",
      EP002: "単位取得済み",
      EP003: "単位取得済み",
      EP004: "単位取得済み",
      EP005: "履修予定",
      EP006: "履修予定"
    };

    // 要件チェック関数を実行
    const result = checkJabeeExperimentPracticeRequirement(
      experimentPracticeCourses,
      courseStatuses
    );

    // 履修予定も含めてすべての科目があるので、要件を満たしているはず
    assertEquals(result.satisfied, true);
    assertEquals(result.details?.completed, 6);
  });

  it("シラバスに必修科目が不足している場合、要件を満たしていないと判定する", () => {
    // 一部の実験・実習系必修科目のみを含むモックデータを作成
    const experimentPracticeCourses = [
      createExperimentPracticeCourseItem("エンジニアリングデザインⅡ", "EP001"),
      createExperimentPracticeCourseItem("情報工学ゼミⅡ", "EP002"),
      createExperimentPracticeCourseItem("情報科学実験", "EP003"),
      // 卒業研究、特別研究Ⅰ、特別研究Ⅱが含まれていない
    ];

    // 科目ステータスのモックデータを作成（すべて単位取得済み）
    const courseStatuses: CourseStatusMap = {
      EP001: "単位取得済み",
      EP002: "単位取得済み",
      EP003: "単位取得済み"
    };

    // 要件チェック関数を実行
    const result = checkJabeeExperimentPracticeRequirement(
      experimentPracticeCourses,
      courseStatuses
    );

    // シラバスに必修科目が不足しているので、要件を満たしていないはず
    assertEquals(result.satisfied, false);
  });
});