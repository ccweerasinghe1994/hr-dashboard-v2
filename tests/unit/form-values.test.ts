import { describe, expect, test } from "bun:test";
import { formValue } from "@/app/action-state";

describe("form values", () => {
  test("returns string values unchanged", () => {
    const formData = new FormData();
    formData.set("name", "  Analytical Engines  ");
    formData.set("blank", "");

    expect(formValue(formData, "name")).toBe("  Analytical Engines  ");
    expect(formValue(formData, "blank")).toBe("");
  });

  test("returns an empty string for a missing entry", () => {
    expect(formValue(new FormData(), "missing")).toBe("");
  });

  test("returns an empty string for a file entry", () => {
    const formData = new FormData();
    formData.set("attachment", new File(["content"], "contract.txt"));

    expect(formValue(formData, "attachment")).toBe("");
  });
});
