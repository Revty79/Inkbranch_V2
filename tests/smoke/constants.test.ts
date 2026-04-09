import { describe, expect, it } from "vitest";

import { APP_TITLE, CORE_LOOP } from "@/lib/constants";

describe("foundation smoke checks", () => {
  it("exposes the project title constant", () => {
    expect(APP_TITLE).toBe("Inkbranch v2");
  });

  it("exposes the planner-first core flow stages", () => {
    expect(CORE_LOOP.length).toBeGreaterThan(0);
    expect(CORE_LOOP[0]).toBe("book bible");
  });
});
