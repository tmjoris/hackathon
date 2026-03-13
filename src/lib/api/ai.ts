import { useMutation } from "@tanstack/react-query";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as
  | string
  | undefined;

if (!API_BASE_URL) {
  // eslint-disable-next-line no-console
  console.warn(
    "[ai-api] VITE_API_BASE_URL is not set. AI endpoints will not work until configured.",
  );
}

interface GenerateTicketsResponse {
  data?: {
    courseId: string;
    mode: string;
    totalSprints: number;
    totalTickets: number;
  };
  error?: {
    code: string;
    message: string;
  };
}

export type GenerateTicketsMode =
  | "initial"
  | "regenerate_all"
  | "append";

export async function generateTicketsForCourseApi(
  courseId: string,
  options?: {
    mode?: GenerateTicketsMode;
    targetTicketCount?: number;
  },
): Promise<GenerateTicketsResponse> {
  if (!API_BASE_URL) {
    throw new Error(
      "VITE_API_BASE_URL is not configured.",
    );
  }

  const params = new URLSearchParams();
  params.set("courseId", courseId);
  if (options?.mode) params.set("mode", options.mode);
  if (options?.targetTicketCount != null) {
    params.set(
      "targetTicketCount",
      String(options.targetTicketCount),
    );
  }

  const res = await fetch(
    `${API_BASE_URL}/api/tickets/generate?${params.toString()}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  const json =
    (await res.json()) as GenerateTicketsResponse;
  if (!res.ok && json.error) {
    throw new Error(json.error.message);
  }

  return json;
}

interface GradeAttemptResponse {
  data?: {
    ticketId: string;
    attemptId: string;
    overallScore: number;
    overallFeedback: string;
    perDeliverable: {
      deliverableId: string;
      score: number;
      feedback: string;
    }[];
  };
  error?: {
    code: string;
    message: string;
  };
}

export async function gradeAttemptApi(
  ticketId: string,
  attemptId: string,
): Promise<GradeAttemptResponse> {
  if (!API_BASE_URL) {
    throw new Error(
      "VITE_API_BASE_URL is not configured.",
    );
  }

  const res = await fetch(`${API_BASE_URL}/api/tickets/grade`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ticketId, attemptId }),
  });

  const json =
    (await res.json()) as GradeAttemptResponse;
  if (!res.ok && json.error) {
    throw new Error(json.error.message);
  }

  return json;
}

export function useGenerateTickets(courseId: string) {
  return useMutation({
    mutationKey: ["ai-generate-tickets", courseId],
    mutationFn: (options?: {
      mode?: GenerateTicketsMode;
      targetTicketCount?: number;
    }) => generateTicketsForCourseApi(courseId, options),
  });
}

export function useGradeAttempt(
  ticketId: string,
  attemptId: string,
) {
  return useMutation({
    mutationKey: [
      "ai-grade-attempt",
      ticketId,
      attemptId,
    ],
    mutationFn: () => gradeAttemptApi(ticketId, attemptId),
  });
}

