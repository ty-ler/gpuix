/// Verification only. Run with NAPI_RS_NATIVE_LIBRARY_PATH pointing at the
/// addon built from scratch/custom-element-check.

import fs from "fs"
import path from "path"
import React from "react"
import { describe, expect, it } from "vitest"
import { createTestRoot } from "../testing.js"
import { SHOTS_DIR } from "./test-utils.js"

declare module "../../jsx-runtime" {
  namespace JSX {
    interface IntrinsicElements {
      "my-greeting": import("../types/host.js").Props & { name?: string }
    }
  }
}

describe.skipIf(!process.env.NAPI_RS_NATIVE_LIBRARY_PATH)("registered element", () => {
  it("draws, updates props, and gets clicks", () => {
    fs.mkdirSync(SHOTS_DIR, { recursive: true })
    let clicks = 0
    const { render, renderer } = createTestRoot({ width: 300, height: 120 })
    render(
      <div style={{ padding: 16 }}>
        <my-greeting testId="greeting" name="Ada" onClick={() => (clicks += 1)} />
      </div>
    )
    expect(renderer.getPaintedText()).toContain("Hello, Ada")
    renderer.captureScreenshot(path.join(SHOTS_DIR, "registered-element-ada.png"))

    render(
      <div style={{ padding: 16 }}>
        <my-greeting testId="greeting" name="Grace" onClick={() => (clicks += 1)} />
      </div>
    )
    expect(renderer.getPaintedText()).toContain("Hello, Grace")
    expect(renderer.getPaintedText()).not.toContain("Hello, Ada")

    const node = renderer.findByTestId("greeting")!
    const bounds = renderer.getElementBounds(node.id)!
    expect(bounds.width).toBeGreaterThan(0)
    renderer.nativeSimulateClick(bounds.x + 5, bounds.y + 5)
    expect(clicks).toBe(1)
    renderer.captureScreenshot(path.join(SHOTS_DIR, "registered-element-grace.png"))
  })
})
