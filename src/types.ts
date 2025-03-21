// 履修状態の定義
export type CourseStatus =
  | "未履修"
  | "単位取得済み"
  | "単位なし（F）"
  | "履修予定"
  | "履修かつF予定";

// 科目番号をキーとして、履修状態を保存するオブジェクト型
export type CourseStatusMap = { [key: string]: CourseStatus };

// シラバスアイテムの型定義
export type SyllabusItem = {
  本科または専攻科: string;
  科目区分1: string;
  科目区分2: string;
  授業科目: string;
  科目番号: string;
  単位種別: string;
  単位数: string;
  学科: string;
  学年: string;
  学期: string;
  担当教員: string;
  履修上の区分: string;
  科における科目種: string;
};

// 卒業要件チェック結果の型定義
export interface RequirementCheckResult {
  name: string; // 要件の名前
  satisfied: boolean; // 要件を満たしているかどうか
  message: string; // メッセージ（結果の説明）
  details?: { // 詳細情報（オプション）
    total?: number; // 必要な総数
    completed?: number; // 完了した数
    completedItems?: SyllabusItem[]; // 単位取得済みまたは履修予定の科目
    incompleteItems?: SyllabusItem[]; // 未履修の科目
  };
}

// 卒業要件チェック関数の型定義
export type RequirementCheckFn = (
  syllabusItems: SyllabusItem[],
  courseStatuses: CourseStatusMap,
) => RequirementCheckResult;
