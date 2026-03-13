import type {
  GeneratedTicket,
  GradingResult,
} from "./types.ts";

// These \"tests\" are lightweight runtime checks that our
// parsing and mapping logic can handle LLM-style JSON
// responses and conform to the TypeScript shapes.

const sampleTicketResponseJson = `{
  "tickets": [
    {
      "title": "Load Balancer Routing Fix",
      "description": "Investigate and remediate 502 errors on the production ALB.",
      "type": "Build",
      "challengeType": "coding",
      "durationEstimateMinutes": 60,
      "isUrgent": true,
      "scenarioText": "Production traffic is failing to reach newly deployed microservices...",
      "context": "You are on-call for the Cloud Infrastructure squad.",
      "expectedOutcome": "ALB routes traffic correctly with healthy targets and zero 502 spikes.",
      "deliverables": [
        {
          "id": "identify-listener-port",
          "description": "Identify the misconfigured listener port causing 502s.",
          "orderIndex": 1
        },
        {
          "id": "update-health-check-path",
          "description": "Update the target group health check path to the correct endpoint.",
          "orderIndex": 2
        },
        {
          "id": "draft-post-mortem",
          "description": "Draft a short post-mortem explaining the failure, impact, and fix.",
          "orderIndex": 3
        }
      ],
      "sprintTitle": "Sprint 1: Core Load Balancing",
      "sprintDescription": "Foundational tickets around ALB configuration and observability.",
      "sprintOrderIndex": 1
    }
  ]
}`;

const sampleGradingResponseJson = `{
  "overallScore": 82,
  "overallFeedback": "Strong understanding of the ALB problem, with some gaps around rollback strategy.",
  "perDeliverable": [
    {
      "deliverableId": "identify-listener-port",
      "score": 90,
      "feedback": "Correctly identified the misconfigured port and linked it to the 502 spike window."
    },
    {
      "deliverableId": "update-health-check-path",
      "score": 75,
      "feedback": "Updated to a healthier path, but missed discussing status codes and latency thresholds."
    },
    {
      "deliverableId": "draft-post-mortem",
      "score": 80,
      "feedback": "Good narrative on impact and fix; next time, add clearer prevention steps."
    }
  ]
}`;

function assertGeneratedTicketsShape(
  tickets: GeneratedTicket[],
): void {
  if (!Array.isArray(tickets)) {
    throw new Error("tickets is not an array");
  }
  for (const t of tickets) {
    if (!t.title || !t.scenarioText) {
      throw new Error(
        "ticket is missing required fields (title or scenarioText)",
      );
    }
    if (!Array.isArray(t.deliverables)) {
      throw new Error(
        "ticket.deliverables must be an array",
      );
    }
  }
}

function assertGradingResultShape(
  result: GradingResult,
): void {
  if (typeof result.overallScore !== "number") {
    throw new Error(
      "overallScore must be a number",
    );
  }
  if (!Array.isArray(result.perDeliverable)) {
    throw new Error(
      "perDeliverable must be an array",
    );
  }
}

export function runAiSampleResponseTests() {
  const ticketParsed = JSON.parse(
    sampleTicketResponseJson,
  ) as { tickets: GeneratedTicket[] };
  assertGeneratedTicketsShape(ticketParsed.tickets);

  const gradingParsed = JSON.parse(
    sampleGradingResponseJson,
  ) as GradingResult;
  assertGradingResultShape(gradingParsed);
}

