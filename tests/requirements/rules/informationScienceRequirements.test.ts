import { describe, it } from "@std/testing/bdd";
import { assertEquals } from "@std/assert";
import { 
  checkInformationScienceRequiredCourses 
} from "../../../src/requirements/rules/index.ts";
import { 
  CourseStatusMap, 
  SyllabusItem 
} from "../../../src/types.ts";

// 「情報科学」教育プログラムの必修科目テスト用関数
const createInfoScienceCourseItem = (
  courseName: string,
  courseNumber: string,
  credits: string = "2"
): SyllabusItem => ({
  本科または専攻科: "専攻科",
  科目区分1: "専門",
  科目区分2: "必修",
  科における科目種: "専門科目",
  授業科目: courseName,
  科目番号: courseNumber,
  単位種別: "学修単位",
  単位数: credits,
  学科: "情報科学専攻",
  学年: "1",
  学期: "前期",
  担当教員: "教員Z",
  履修上の区分: "必修"
});

describe("checkInformationScienceRequiredCourses", () => {
  it("すべての必修科目を修得している場合、要件を満たしていると判定する", () => {
    // 必修科目のモックデータを作成
    const requiredCourses = [
      createInfoScienceCourseItem("コンピュータシステム設計", "IS001"),
      createInfoScienceCourseItem("システムプログラム", "IS002"),
      createInfoScienceCourseItem("情報ネットワーク論", "IS003"),
      createInfoScienceCourseItem("統計学", "IS004"),
      createInfoScienceCourseItem("エンジニアリングデザインⅡ", "IS005"),
      createInfoScienceCourseItem("情報工学ゼミⅡ", "IS006"),
      createInfoScienceCourseItem("卒業研究", "IS007"),
      createInfoScienceCourseItem("総合英語Ⅰ", "IS008"),
      createInfoScienceCourseItem("総合英語Ⅱ", "IS009"),
      createInfoScienceCourseItem("技術者倫理", "IS010"),
      createInfoScienceCourseItem("歴史学", "IS011"),
      createInfoScienceCourseItem("技術史", "IS012"),
      createInfoScienceCourseItem("組込みシステム特論", "IS013"),
      createInfoScienceCourseItem("ディジタル信号処理", "IS014"),
      createInfoScienceCourseItem("応用情報システム", "IS015"),
      createInfoScienceCourseItem("知識情報工学", "IS016"),
      createInfoScienceCourseItem("情報科学実験", "IS017"),
      createInfoScienceCourseItem("特別研究Ⅰ", "IS018"),
      createInfoScienceCourseItem("特別研究Ⅱ", "IS019")
    ];

    // 科目ステータスのモックデータを作成（すべて単位取得済み）
    const courseStatuses: CourseStatusMap = {
      IS001: "単位取得済み",
      IS002: "単位取得済み",
      IS003: "単位取得済み",
      IS004: "単位取得済み",
      IS005: "単位取得済み",
      IS006: "単位取得済み",
      IS007: "単位取得済み",
      IS008: "単位取得済み",
      IS009: "単位取得済み",
      IS010: "単位取得済み",
      IS011: "単位取得済み",
      IS012: "単位取得済み",
      IS013: "単位取得済み",
      IS014: "単位取得済み",
      IS015: "単位取得済み",
      IS016: "単位取得済み",
      IS017: "単位取得済み",
      IS018: "単位取得済み",
      IS019: "単位取得済み"
    };

    // 要件チェック関数を実行
    const result = checkInformationScienceRequiredCourses(
      requiredCourses,
      courseStatuses
    );

    // すべての科目を修得しているので、要件を満たしているはず
    assertEquals(result.satisfied, true);
    assertEquals(result.details?.completed, 19);
  });

  it("一部の必修科目しか修得していない場合、要件を満たしていないと判定する", () => {
    // 必修科目のモックデータを作成
    const requiredCourses = [
      createInfoScienceCourseItem("コンピュータシステム設計", "IS001"),
      createInfoScienceCourseItem("システムプログラム", "IS002"),
      createInfoScienceCourseItem("情報ネットワーク論", "IS003"),
      createInfoScienceCourseItem("統計学", "IS004"),
      createInfoScienceCourseItem("エンジニアリングデザインⅡ", "IS005"),
      createInfoScienceCourseItem("情報工学ゼミⅡ", "IS006"),
      createInfoScienceCourseItem("卒業研究", "IS007"),
      createInfoScienceCourseItem("総合英語Ⅰ", "IS008"),
      createInfoScienceCourseItem("総合英語Ⅱ", "IS009"),
      createInfoScienceCourseItem("技術者倫理", "IS010"),
      createInfoScienceCourseItem("歴史学", "IS011"),
      createInfoScienceCourseItem("技術史", "IS012"),
      createInfoScienceCourseItem("組込みシステム特論", "IS013"),
      createInfoScienceCourseItem("ディジタル信号処理", "IS014"),
      createInfoScienceCourseItem("応用情報システム", "IS015"),
      createInfoScienceCourseItem("知識情報工学", "IS016"),
      createInfoScienceCourseItem("情報科学実験", "IS017"),
      createInfoScienceCourseItem("特別研究Ⅰ", "IS018"),
      createInfoScienceCourseItem("特別研究Ⅱ", "IS019")
    ];

    // 科目ステータスのモックデータを作成（一部のみ単位取得済み）
    const courseStatuses: CourseStatusMap = {
      IS001: "単位取得済み",
      IS002: "単位取得済み",
      IS003: "単位取得済み",
      IS004: "単位取得済み",
      IS005: "単位取得済み",
      IS006: "単位取得済み",
      IS007: "単位取得済み",
      IS008: "単位取得済み",
      IS009: "単位取得済み",
      IS010: "単位取得済み",
      IS011: "未履修",
      IS012: "未履修",
      IS013: "単位取得済み",
      IS014: "単位取得済み",
      IS015: "単位取得済み",
      IS016: "未履修",
      IS017: "単位取得済み",
      IS018: "単位取得済み",
      IS019: "未履修"
    };

    // 要件チェック関数を実行
    const result = checkInformationScienceRequiredCourses(
      requiredCourses,
      courseStatuses
    );

    // 一部の科目しか修得していないので、要件を満たしていないはず
    assertEquals(result.satisfied, false);
    assertEquals(result.details?.completed, 15);
  });

  it("「履修予定」の科目も含めてすべての科目があれば要件を満たしていると判定する", () => {
    // 必修科目のモックデータを作成
    const requiredCourses = [
      createInfoScienceCourseItem("コンピュータシステム設計", "IS001"),
      createInfoScienceCourseItem("システムプログラム", "IS002"),
      createInfoScienceCourseItem("情報ネットワーク論", "IS003"),
      createInfoScienceCourseItem("統計学", "IS004"),
      createInfoScienceCourseItem("エンジニアリングデザインⅡ", "IS005"),
      createInfoScienceCourseItem("情報工学ゼミⅡ", "IS006"),
      createInfoScienceCourseItem("卒業研究", "IS007"),
      createInfoScienceCourseItem("総合英語Ⅰ", "IS008"),
      createInfoScienceCourseItem("総合英語Ⅱ", "IS009"),
      createInfoScienceCourseItem("技術者倫理", "IS010"),
      createInfoScienceCourseItem("歴史学", "IS011"),
      createInfoScienceCourseItem("技術史", "IS012"),
      createInfoScienceCourseItem("組込みシステム特論", "IS013"),
      createInfoScienceCourseItem("ディジタル信号処理", "IS014"),
      createInfoScienceCourseItem("応用情報システム", "IS015"),
      createInfoScienceCourseItem("知識情報工学", "IS016"),
      createInfoScienceCourseItem("情報科学実験", "IS017"),
      createInfoScienceCourseItem("特別研究Ⅰ", "IS018"),
      createInfoScienceCourseItem("特別研究Ⅱ", "IS019")
    ];

    // 科目ステータスのモックデータを作成（一部は単位取得済み、一部は履修予定）
    const courseStatuses: CourseStatusMap = {
      IS001: "単位取得済み",
      IS002: "単位取得済み",
      IS003: "単位取得済み",
      IS004: "単位取得済み",
      IS005: "単位取得済み",
      IS006: "単位取得済み",
      IS007: "単位取得済み",
      IS008: "単位取得済み",
      IS009: "単位取得済み",
      IS010: "単位取得済み",
      IS011: "履修予定",
      IS012: "履修予定",
      IS013: "単位取得済み",
      IS014: "単位取得済み",
      IS015: "単位取得済み",
      IS016: "履修予定",
      IS017: "単位取得済み",
      IS018: "単位取得済み",
      IS019: "履修予定"
    };

    // 要件チェック関数を実行
    const result = checkInformationScienceRequiredCourses(
      requiredCourses,
      courseStatuses
    );

    // 履修予定も含めてすべての科目があるので、要件を満たしているはず
    assertEquals(result.satisfied, true);
    assertEquals(result.details?.completed, 19);
  });

  it("シラバスに必修科目が不足している場合、要件を満たしていないと判定する", () => {
    // 一部の必修科目のみを含むモックデータを作成
    const requiredCourses = [
      createInfoScienceCourseItem("コンピュータシステム設計", "IS001"),
      createInfoScienceCourseItem("システムプログラム", "IS002"),
      createInfoScienceCourseItem("情報ネットワーク論", "IS003"),
      createInfoScienceCourseItem("統計学", "IS004"),
      createInfoScienceCourseItem("エンジニアリングデザインⅡ", "IS005"),
      // 他の必修科目が含まれていない
    ];

    // 科目ステータスのモックデータを作成（すべて単位取得済み）
    const courseStatuses: CourseStatusMap = {
      IS001: "単位取得済み",
      IS002: "単位取得済み",
      IS003: "単位取得済み",
      IS004: "単位取得済み",
      IS005: "単位取得済み"
    };

    // 要件チェック関数を実行
    const result = checkInformationScienceRequiredCourses(
      requiredCourses,
      courseStatuses
    );

    // シラバスに必修科目が不足しているので、要件を満たしていないはず
    assertEquals(result.satisfied, false);
  });
}); 