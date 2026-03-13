import {
  buildGradingSystemPrompt,
  buildGradingUserPrompt,
  buildTicketGenerationSystemPrompt,
  buildTicketGenerationUserPrompt,
} from "./prompts.js";
import type {
  GradingContext,
  GradingResult,
  GeneratedTicket,
  TicketGenerationContext,
} from "./types.js";

interface ChatMessage {
  role: "system" | "user";
  content: string;
}

interface OpenRouterChatRequest {
  model: string;
  messages: ChatMessage[];
  response_format?: { type: "json_object" };
  max_tokens?: number;
  temperature?: number;
}

interface OpenRouterChatResponse {
  choices: {
    message: {
      content: string | null;
    };
  }[];
}

function getEnv(name: string): string | undefined {
  if (typeof process !== "undefined" && process.env[name]) {
    return process.env[name];
  }
  return undefined;
}

async function callOpenRouter<T>(
  body: OpenRouterChatRequest,
): Promise<T> {
  const apiKey = getEnv("OPENROUTER_API_KEY");
  const baseUrl =
    getEnv("OPENROUTER_BASE_URL") ??
    "https://openrouter.ai/api/v1/chat/completions";

  if (!apiKey) {
    throw new Error(
      "OPENROUTER_API_KEY is not set in the environment.",
    );
  }

  const res = await fetch(baseUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `OpenRouter request failed (${res.status}): ${text}`,
    );
  }

  const json = (await res.json()) as OpenRouterChatResponse;
  const content = json.choices[0]?.message?.content;
  if (!content) {
    throw new Error("OpenRouter response had no content.");
  }

  try {
    return JSON.parse(content) as T;
  } catch (err) {
    throw new Error(
      `Failed to parse OpenRouter JSON response: ${(err as Error).message}\nRaw content:\n${content}`,
    );
  }
}

export async function generateTicketsForCourse(
  context: TicketGenerationContext,
): Promise<GeneratedTicket[]> {
  const systemPrompt = buildTicketGenerationSystemPrompt();
  const userPrompt = buildTicketGenerationUserPrompt(context);

  const model =
    getEnv("OPENROUTER_MODEL_TICKETS") ??
    getEnv("OPENROUTER_MODEL") ??
    "openrouter/free";

  type TicketArrayResponse = {
    tickets: GeneratedTicket[];
  };

  const result = await callOpenRouter<TicketArrayResponse>({
    model,
    response_format: { type: "json_object" },
    max_tokens: 2_000,
    temperature: 0.5,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
  });

  return Array.isArray(result.tickets) ? result.tickets : [];
}

export async function gradeSubmission(
  context: GradingContext,
): Promise<GradingResult> {
  const systemPrompt = buildGradingSystemPrompt();
  const userPrompt = buildGradingUserPrompt(context);

  const model =
    getEnv("OPENROUTER_MODEL_GRADING") ??
    getEnv("OPENROUTER_MODEL") ??
    "openrouter/free";

  type GradingResponse = GradingResult;

  const result = await callOpenRouter<GradingResponse>({
    model,
    response_format: { type: "json_object" },
    max_tokens: 1_500,
    temperature: 0.3,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
  });

  return result;
}

