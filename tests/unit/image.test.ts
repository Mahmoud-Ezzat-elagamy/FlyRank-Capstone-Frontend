import { describe, it, expect } from "vitest";
import { downscaleImage } from "@/lib/image";

describe("downscaleImage validation", () => {
  it("rejects unsupported MIME types", async () => {
    const invalidFile = new File(["dummy content"], "doc.pdf", {
      type: "application/pdf",
    });

    await expect(downscaleImage(invalidFile)).rejects.toThrow(
      /Unsupported file type/
    );
  });

  it("rejects files exceeding 10 MB limit", async () => {
    const hugeFile = new File(["dummy content"], "photo.jpg", {
      type: "image/jpeg",
    });
    Object.defineProperty(hugeFile, "size", { value: 12 * 1024 * 1024 });

    await expect(downscaleImage(hugeFile)).rejects.toThrow(
      /exceeds the maximum allowed 10 MB/
    );
  });
});
