import "server-only";

import type { GeneratorFailureReason } from "../contracts";

import type {
  AdapterGenerateSceneInput,
  AdapterGenerateSceneResult,
  SceneGenerationAdapter
} from "./base";

type FetchLike = typeof fetch;

export interface OpenAiSceneGenerationAdapterOptions {
  readonly apiKey: string;
  readonly model: string;
  readonly baseUrl?: string;
  readonly fetchImpl?: FetchLike;
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  return value as Record<string, unknown>;
}

function tryParseJson(value: string): unknown | null {
  try {
    return JSON.parse(value) as unknown;
  } catch {
    return null;
  }
}

function normalizeBaseUrl(baseUrl: string | undefined): string {
  if (!baseUrl) {
    return "https://api.openai.com/v1";
  }

  return baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
}

function extractOutputText(payload: Record<string, unknown>): string | null {
  const outputText = payload.output_text;
  if (typeof outputText === "string" && outputText.trim().length > 0) {
    return outputText;
  }

  return null;
}

function extractFromOutputArray(
  payload: Record<string, unknown>
): unknown | null {
  const output = payload.output;
  if (!Array.isArray(output)) {
    return null;
  }

  for (const item of output) {
    const outputItem = asRecord(item);
    if (!outputItem) {
      continue;
    }

    const content = outputItem.content;
    if (!Array.isArray(content)) {
      continue;
    }

    for (const entry of content) {
      const contentItem = asRecord(entry);
      if (!contentItem) {
        continue;
      }

      if (contentItem.parsed) {
        return contentItem.parsed;
      }

      const textValue =
        typeof contentItem.text === "string"
          ? contentItem.text
          : typeof contentItem.output_text === "string"
            ? contentItem.output_text
            : null;

      if (textValue && textValue.trim().length > 0) {
        const parsed = tryParseJson(textValue);
        if (parsed) {
          return parsed;
        }
      }
    }
  }

  return null;
}

function extractStructuredOutput(payload: unknown): unknown | null {
  const payloadRecord = asRecord(payload);
  if (!payloadRecord) {
    return null;
  }

  const outputText = extractOutputText(payloadRecord);
  if (outputText) {
    const parsed = tryParseJson(outputText);
    if (parsed) {
      return parsed;
    }
  }

  const fromOutputArray = extractFromOutputArray(payloadRecord);
  if (fromOutputArray) {
    return fromOutputArray;
  }

  if (
    typeof payloadRecord.prose === "string" &&
    Array.isArray(payloadRecord.choices)
  ) {
    return payloadRecord;
  }

  return null;
}

function createSchema() {
  return {
    type: "object",
    additionalProperties: false,
    required: ["prose", "choices"],
    properties: {
      prose: {
        type: "string"
      },
      summary: {
        type: "string"
      },
      choices: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          required: ["choiceKey", "label"],
          properties: {
            choiceKey: {
              type: "string"
            },
            label: {
              type: "string"
            },
            body: {
              type: "string"
            }
          }
        }
      },
      presentationNotes: {
        type: "array",
        items: {
          type: "string"
        }
      }
    }
  };
}

function toFailureResult(
  reason: GeneratorFailureReason,
  message: string,
  metadata?: Record<string, unknown>
): AdapterGenerateSceneResult {
  return {
    status: "failure",
    reason,
    message,
    metadata
  };
}

function toAbortSignal(timeoutMs: number): {
  readonly signal: AbortSignal;
  readonly abortTimeout: ReturnType<typeof setTimeout>;
} {
  const controller = new AbortController();
  const abortTimeout = setTimeout(() => {
    controller.abort();
  }, timeoutMs);

  return {
    signal: controller.signal,
    abortTimeout
  };
}

export class OpenAiSceneGenerationAdapter implements SceneGenerationAdapter {
  readonly adapterId = "openai-scene-generator";
  private readonly fetchImpl: FetchLike;
  private readonly baseUrl: string;

  constructor(private readonly options: OpenAiSceneGenerationAdapterOptions) {
    this.fetchImpl = options.fetchImpl ?? fetch;
    this.baseUrl = normalizeBaseUrl(options.baseUrl);
  }

  async generateScene(
    input: AdapterGenerateSceneInput
  ): Promise<AdapterGenerateSceneResult> {
    const timeoutMs = input.request.options?.timeoutMs ?? 12_000;
    const { signal, abortTimeout } = toAbortSignal(timeoutMs);

    try {
      const response = await this.fetchImpl(`${this.baseUrl}/responses`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.options.apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: this.options.model,
          input: [
            {
              role: "system",
              content: [{ type: "text", text: input.prompt.systemPrompt }]
            },
            {
              role: "user",
              content: [{ type: "text", text: input.prompt.userPrompt }]
            }
          ],
          text: {
            format: {
              type: "json_schema",
              name: input.prompt.responseContract.schemaName,
              schema: createSchema()
            }
          }
        }),
        signal
      });
      clearTimeout(abortTimeout);

      if (!response.ok) {
        const bodyText = await response.text();
        const reason: GeneratorFailureReason =
          response.status === 401 || response.status === 403
            ? "provider-unavailable"
            : "adapter-failure";

        return toFailureResult(
          reason,
          `OpenAI request failed with status ${response.status}.`,
          {
            adapterId: this.adapterId,
            status: response.status,
            body: bodyText.slice(0, 500)
          }
        );
      }

      const rawPayload = (await response.json()) as unknown;
      const structuredOutput = extractStructuredOutput(rawPayload);

      if (!structuredOutput) {
        return toFailureResult(
          "adapter-failure",
          "OpenAI response did not contain structured output in the expected shape.",
          {
            adapterId: this.adapterId
          }
        );
      }

      const responseRecord = asRecord(rawPayload);

      return {
        status: "success",
        output: structuredOutput,
        metadata: {
          adapterId: this.adapterId,
          provider: "openai",
          responseId:
            responseRecord && typeof responseRecord.id === "string"
              ? responseRecord.id
              : undefined,
          model:
            responseRecord && typeof responseRecord.model === "string"
              ? responseRecord.model
              : this.options.model
        }
      };
    } catch (error) {
      clearTimeout(abortTimeout);

      if (error instanceof Error && error.name === "AbortError") {
        return toFailureResult(
          "timeout",
          "OpenAI scene generation timed out before completion.",
          {
            adapterId: this.adapterId,
            timeoutMs
          }
        );
      }

      return toFailureResult(
        "adapter-failure",
        error instanceof Error
          ? error.message
          : "Unexpected OpenAI adapter failure.",
        {
          adapterId: this.adapterId
        }
      );
    }
  }
}

export function createOpenAiSceneGenerationAdapter(
  options: OpenAiSceneGenerationAdapterOptions
): SceneGenerationAdapter {
  return new OpenAiSceneGenerationAdapter(options);
}
