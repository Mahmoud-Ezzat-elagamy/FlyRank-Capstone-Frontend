import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "@/app/api/generate/route";
import { resetRateLimits } from "@/lib/rateLimit";
import { NextRequest } from "next/server";

// Mock @google/genai SDK
const mockGenerateContent = vi.fn();

vi.mock("@google/genai", () => {
  return {
    GoogleGenAI: vi.fn().mockImplementation(() => ({
      models: {
        generateContent: mockGenerateContent,
      },
    })),
  };
});

function createRequest(body: any, ip = "127.0.0.1"): NextRequest {
  return new NextRequest("http://localhost:3000/api/generate", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-forwarded-for": ip,
    },
    body: JSON.stringify(body),
  });
}

const VALID_MOCK_RESPONSE = {
  title: "Cell Division Biology",
  summary: "Mitosis and Meiosis overview",
  sections: [
    {
      heading: "1. Mitosis Overview",
      paragraphs: ["Mitosis produces two genetically identical diploid cells."],
      bullets: ["Prophase", "Metaphase", "Anaphase", "Telophase"],
      table: {
        caption: "Stages Comparison",
        headers: ["Stage", "Event"],
        rows: [["Metaphase", "Chromosomes align at the equator"]],
      },
      diagram: {
        type: "flowchart",
        title: "Cell Cycle",
        description: "Stages of cell cycle",
        nodes: [
          { id: "g1", label: "G1 Phase" },
          { id: "s", label: "S Phase" },
        ],
        edges: [{ from: "g1", to: "s" }],
      },
    },
  ],
  uncertain: [],
};

describe("POST /api/generate", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetRateLimits();
    process.env.GEMINI_API_KEY = "test_mock_key";
    process.env.GEMINI_MODEL = "gemini-2.5-flash";
    process.env.RATE_LIMIT_PER_MINUTE = "6";
  });

  it("returns 200 and formatted document on valid text input", async () => {
    mockGenerateContent.mockResolvedValueOnce({
      text: () => JSON.stringify(VALID_MOCK_RESPONSE),
    });

    const req = createRequest({
      mode: "study_guide",
      text: "Notes about mitosis and cell division...",
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.doc.title).toBe("Cell Division Biology");
    expect(json.doc.sections.length).toBe(1);
  });

  it("returns 400 for invalid mode", async () => {
    const req = createRequest({
      mode: "invalid_mode",
      text: "Some notes",
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error.code).toBe("BAD_INPUT");
  });

  it("returns 400 when neither text nor image is provided", async () => {
    const req = createRequest({
      mode: "study_guide",
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error.code).toBe("BAD_INPUT");
  });

  it("returns 413 TOO_LARGE when text exceeds character limit", async () => {
    const req = createRequest({
      mode: "study_guide",
      text: "A".repeat(30005),
    });

    const res = await POST(req);
    expect(res.status).toBe(413);
    const json = await res.json();
    expect(json.error.code).toBe("TOO_LARGE");
  });

  it("handles Gemini 429 quota exhaustion and returns 429", async () => {
    mockGenerateContent.mockRejectedValue({
      status: 429,
      message: "Resource has been exhausted (e.g. check quota).",
    });

    const req = createRequest({
      mode: "study_guide",
      text: "Some notes...",
    });

    const res = await POST(req);
    expect(res.status).toBe(429);
    const json = await res.json();
    expect(json.error.code).toBe("QUOTA_EXCEEDED");
  });

  it("repairs malformed JSON on the first retry successfully", async () => {
    // First attempt returns broken JSON
    mockGenerateContent
      .mockResolvedValueOnce({
        text: () => "INVALID JSON { title: ...",
      })
      // Second repair attempt returns valid JSON
      .mockResolvedValueOnce({
        text: () => JSON.stringify(VALID_MOCK_RESPONSE),
      });

    const req = createRequest({
      mode: "study_guide",
      text: "Notes to repair...",
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.doc.title).toBe("Cell Division Biology");
    expect(mockGenerateContent).toHaveBeenCalledTimes(2);
  });

  it("returns 422 MODEL_INVALID_OUTPUT if malformed JSON fails after retry", async () => {
    mockGenerateContent.mockResolvedValue({
      text: () => "STILL BROKEN NOT JSON",
    });

    const req = createRequest({
      mode: "study_guide",
      text: "Notes to fail...",
    });

    const res = await POST(req);
    expect(res.status).toBe(422);
    const json = await res.json();
    expect(json.error.code).toBe("MODEL_INVALID_OUTPUT");
  });

  it("returns 504 TIMEOUT when call aborts due to timeout", async () => {
    const abortErr = new Error("This operation was aborted");
    abortErr.name = "AbortError";
    mockGenerateContent.mockRejectedValue(abortErr);

    const req = createRequest({
      mode: "study_guide",
      text: "Notes timing out...",
    });

    const res = await POST(req);
    expect(res.status).toBe(504);
    const json = await res.json();
    expect(json.error.code).toBe("TIMEOUT");
  });

  it("enforces in-memory rate limiting and returns 429 RATE_LIMITED", async () => {
    mockGenerateContent.mockResolvedValue({
      text: () => JSON.stringify(VALID_MOCK_RESPONSE),
    });

    const ip = "192.168.10.50";

    // Exhaust 6 allowed requests
    for (let i = 0; i < 6; i++) {
      const res = await POST(
        createRequest({ mode: "study_guide", text: `Note ${i}` }, ip)
      );
      expect(res.status).toBe(200);
    }

    // 7th request must be blocked
    const blockedRes = await POST(
      createRequest({ mode: "study_guide", text: "Note 7" }, ip)
    );
    expect(blockedRes.status).toBe(429);
    const json = await blockedRes.json();
    expect(json.error.code).toBe("RATE_LIMITED");
    expect(json.error.retryAfter).toBeGreaterThan(0);
  });
});
