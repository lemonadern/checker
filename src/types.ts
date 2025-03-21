// 履修状態の定義
export type CourseStatus = '未履修' | '単位取得済み' | '単位なし（F）' | '履修予定' | '履修かつF予定';

// 科目番号をキーとして、履修状態を保存するオブジェクト型
export type CourseStatusMap = {[key: string]: CourseStatus};

// シラバスアイテムの型定義
export type SyllabusItem = {
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
} 