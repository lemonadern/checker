import { describe, it } from "@std/testing/bdd";
import { assertEquals } from "@std/assert";
import { SyllabusItem, CourseStatusMap } from "../../../src/types.ts";
import { createAdvancedCourseCheck } from "../../../src/requirements/rules/creditRequirements.ts";

describe("createAdvancedCourseCheck", () => {
  // テスト用のシラバスアイテム
  const mockSyllabusItems: SyllabusItem[] = [
    {
      本科または専攻科: "専攻科",
      科目区分1: "専門",
      科目区分2: "必修",
      科における科目種: "テスト科目",
      授業科目: "テスト科目1",
      科目番号: "1001",
      単位種別: "学修単位",
      単位数: "2",
      学科: "情報科学専攻",
      学年: "1",
      学期: "前期",
      担当教員: "教員A",
      履修上の区分: "必履修"
    },
    {
      本科または専攻科: "専攻科",
      科目区分1: "専門",
      科目区分2: "選択",
      科における科目種: "テスト科目",
      授業科目: "テスト科目2",
      科目番号: "1002",
      単位種別: "学修単位",
      単位数: "3",
      学科: "情報科学専攻",
      学年: "1",
      学期: "後期",
      担当教員: "教員B",
      履修上の区分: "区分なし"
    },
    {
      本科または専攻科: "専攻科",
      科目区分1: "一般",
      科目区分2: "選択",
      科における科目種: "他の科目",
      授業科目: "他の科目1",
      科目番号: "2001",
      単位種別: "学修単位",
      単位数: "4",
      学科: "情報科学専攻",
      学年: "1",
      学期: "前期",
      担当教員: "教員C",
      履修上の区分: "区分なし"
    }
  ];

  // テスト用の科目状態マップ
  const mockCourseStatuses: CourseStatusMap = {
    "1001": "単位取得済み",
    "1002": "履修予定",
    "2001": "未履修"
  };

  it("パラメータに基づいて正しくフィルタリングし、単位要件を満たしているか判定する", () => {
    // テスト用のフィルター（「テスト科目」という科目種の科目だけを選択）
    const filterFn = (item: SyllabusItem) => item.科における科目種 === "テスト科目";
    const requiredCredits = 5;
    const checkFn = createAdvancedCourseCheck(
      "テスト要件",
      filterFn,
      requiredCredits,
      "テスト科目"
    );
    
    const result = checkFn(mockSyllabusItems, mockCourseStatuses);
    
    assertEquals(result.name, "テスト要件");
    assertEquals(result.satisfied, true); // 2 + 3 = 5単位で要件を満たす
    assertEquals(result.details?.total, 5);
    assertEquals(result.details?.completed, 5);
    assertEquals(result.details?.completedItems?.length, 2);
    assertEquals(result.details?.incompleteItems?.length, 0);
  });

  it("単位数が足りない場合は要件を満たさないと判定する", () => {
    const filterFn = (item: SyllabusItem) => item.科における科目種 === "テスト科目";
    const requiredCredits = 6; // 要求単位を増やす
    const checkFn = createAdvancedCourseCheck(
      "テスト要件",
      filterFn,
      requiredCredits,
      "テスト科目"
    );
    
    const result = checkFn(mockSyllabusItems, mockCourseStatuses);
    
    assertEquals(result.satisfied, false); // 2 + 3 = 5単位で、6単位の要件を満たさない
    assertEquals(result.details?.total, 6);
    assertEquals(result.details?.completed, 5);
  });

  it("条件に合致する科目がない場合は0単位として計算する", () => {
    const filterFn = (item: SyllabusItem) => item.科における科目種 === "存在しない科目種";
    const requiredCredits = 1;
    const checkFn = createAdvancedCourseCheck(
      "テスト要件",
      filterFn,
      requiredCredits,
      "存在しない科目"
    );
    
    const result = checkFn(mockSyllabusItems, mockCourseStatuses);
    
    assertEquals(result.satisfied, false);
    assertEquals(result.details?.total, 1);
    assertEquals(result.details?.completed, 0);
    assertEquals(result.details?.completedItems?.length, 0);
    assertEquals(result.details?.incompleteItems?.length, 0);
  });

  it("単位取得済みと履修予定の科目だけをカウントし、未履修科目はカウントしない", () => {
    // テスト用のステータスを変更
    const modifiedStatuses: CourseStatusMap = {
      "1001": "未履修",
      "1002": "単位取得済み",
      "2001": "未履修"
    };
    
    const filterFn = (item: SyllabusItem) => item.科における科目種 === "テスト科目";
    const requiredCredits = 5;
    const checkFn = createAdvancedCourseCheck(
      "テスト要件",
      filterFn,
      requiredCredits,
      "テスト科目"
    );
    
    const result = checkFn(mockSyllabusItems, modifiedStatuses);
    
    assertEquals(result.satisfied, false); // 3単位だけなので5単位要件を満たさない
    assertEquals(result.details?.completed, 3);
    assertEquals(result.details?.completedItems?.length, 1);
    assertEquals(result.details?.incompleteItems?.length, 1);
  });
});
