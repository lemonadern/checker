/// <reference lib="deno.ns" />
import { beforeAll, describe, it } from "@std/testing/bdd";
import { parse } from "@std/csv/parse";
import { CSV_COLUMNS } from "../src/constants.ts";
import { SyllabusItem } from "../src/types.ts";
import { assertEquals } from "@std/assert";

// 学則 p.50
// https://www.toyota-ct.ac.jp/wp/wp-content/uploads/2024/05/4345fce60604665e3b6d210ddb19ef59.pdf
describe("専攻科要件のテスト", () => {
  let syllabusJData: SyllabusItem[];

  beforeAll(async () => {
    const syllabusJ = await Deno.readTextFile("./public/data/syllabus_j.csv");
    syllabusJData = parse(syllabusJ, {
      header: true,
      columns: CSV_COLUMNS,
    }) as SyllabusItem[];
  });

  describe("「科における科目種」", () => {
    it("一般科目の科目数が8で、単位数総計が16であること", () => {
      const generalCourses = syllabusJData.filter((item) =>
        item.科における科目種 === "一般科目"
      );
      assertEquals(generalCourses.length, 8);

      const totalUnits = generalCourses.reduce(
        (sum, item) => sum + Number(item.単位数),
        0,
      );
      assertEquals(totalUnits, 16);
    });

    it("一般科目はすべて専攻共通であること", () => {
      const generalCourses = syllabusJData.filter((item) =>
        item.科における科目種 === "一般科目"
      );
      for (const course of generalCourses) {
        assertEquals(course.学科, "専攻共通");
      }
    });

    it("専門関連科目の科目数が10で、単位数総計が20であること", () => {
      const relatedCourses = syllabusJData.filter((item) =>
        item.科における科目種 === "専門関連科目"
      );
      assertEquals(relatedCourses.length, 10);

      const totalUnits = relatedCourses.reduce(
        (sum, item) => sum + Number(item.単位数),
        0,
      );
      assertEquals(totalUnits, 20);
    });

    it("専門関連科目はすべて専攻共通であること", () => {
      const relatedCourses = syllabusJData.filter((item) =>
        item.科における科目種 === "専門関連科目"
      );
      for (const course of relatedCourses) {
        assertEquals(course.学科, "専攻共通");
      }
    });

    it("専攻共通の専門科目数は7で、単位数総計は16であること", () => {
      const courses = syllabusJData.filter((item) =>
        item.学科 === "専攻共通" &&
        item.科における科目種 === "専門科目"
      );
      assertEquals(courses.length, 7);

      const totalUnits = courses.reduce(
        (sum, item) => sum + Number(item.単位数),
        0,
      );
      assertEquals(totalUnits, 16);
    });

    it("情報科学専攻の専門科目数は14であること", () => {
      const specialCourses = syllabusJData.filter((item) =>
        item.学科 === "情報科学専攻" &&
        item.科における科目種 === "専門科目"
      );
      assertEquals(specialCourses.length, 14);
    });

    it("情報科学専攻の専門科目の単位数総計は38であること", () => {
      const specialCourses = syllabusJData.filter((item) =>
        item.学科 === "情報科学専攻" &&
        item.科における科目種 === "専門科目"
      );
      const totalUnits = specialCourses.reduce(
        (sum, item) => sum + Number(item.単位数),
        0,
      );
      assertEquals(totalUnits, 38);
    });
  });
});
