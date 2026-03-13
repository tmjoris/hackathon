// Supabase Edge Function: Grade a ticket attempt using AI
// Triggered via HTTP POST.
// Expects JSON body:
//   {
//     "ticketId": "<uuid>",
//     "attemptId": "<uuid>"
//   }

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

import { gradeSubmission } from "../_shared/ai/llmClient.ts";
import type {
  GradingContext,
  GradingResult,
} from "../_shared/ai/types.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") {
      return new Response("Method not allowed", {
        status: 405,
        headers: corsHeaders,
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get(
      "SUPABASE_SERVICE_ROLE_KEY",
    );

    if (!supabaseUrl || !serviceRoleKey) {
      return new Response(
        JSON.stringify({
          error: {
            code: "CONFIG_ERROR",
            message:
              "SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not configured.",
          },
        }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        },
      );
    }

    const body = await req.json().catch(() => null);
    const ticketId = body?.ticketId as string | undefined;
    const attemptId = body?.attemptId as string | undefined;

    if (!ticketId || !attemptId) {
      return new Response(
        JSON.stringify({
          error: {
            code: "BAD_REQUEST",
            message:
              "ticketId and attemptId are required in the request body.",
          },
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        },
      );
    }

    const supabaseClient = createClient(
      supabaseUrl,
      serviceRoleKey,
    );

    // Load ticket
    const { data: ticket, error: ticketError } =
      await supabaseClient
        .from("tickets")
        .select("*")
        .eq("id", ticketId)
        .single();

    if (ticketError || !ticket) {
      return new Response(
        JSON.stringify({
          error: {
            code: "NOT_FOUND",
            message: "Ticket not found.",
            details: ticketError?.message,
          },
        }),
        {
          status: 404,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        },
      );
    }

    // Load scenario
    const { data: scenario, error: scenarioError } =
      await supabaseClient
        .from("ticket_scenarios")
        .select("*")
        .eq("ticket_id", ticketId)
        .single();

    if (scenarioError || !scenario) {
      return new Response(
        JSON.stringify({
          error: {
            code: "NOT_FOUND",
            message:
              "Ticket scenario not found for this ticket.",
            details: scenarioError?.message,
          },
        }),
        {
          status: 404,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        },
      );
    }

    // Load deliverables
    const { data: deliverables, error: deliverablesError } =
      await supabaseClient
        .from("ticket_deliverables")
        .select("*")
        .eq("ticket_id", ticketId)
        .order("order_index", { ascending: true });

    if (deliverablesError || !deliverables) {
      return new Response(
        JSON.stringify({
          error: {
            code: "DB_ERROR",
            message:
              "Failed to load ticket deliverables.",
            details: deliverablesError?.message,
          },
        }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        },
      );
    }

    // Load attempt
    const { data: attempt, error: attemptError } =
      await supabaseClient
        .from("ticket_attempts")
        .select("*")
        .eq("id", attemptId)
        .single();

    if (attemptError || !attempt) {
      return new Response(
        JSON.stringify({
          error: {
            code: "NOT_FOUND",
            message: "Ticket attempt not found.",
            details: attemptError?.message,
          },
        }),
        {
          status: 404,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        },
      );
    }

    // Load per-deliverable submissions
    const {
      data: deliverableSubmissions,
      error: submissionsError,
    } = await supabaseClient
      .from("deliverable_submissions")
      .select("*")
      .eq("attempt_id", attemptId)
      .order("created_at", { ascending: true });

    if (submissionsError) {
      return new Response(
        JSON.stringify({
          error: {
            code: "DB_ERROR",
            message:
              "Failed to load deliverable submissions.",
            details: submissionsError.message,
          },
        }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        },
      );
    }

    const gradingContext: GradingContext = {
      ticket: {
        id: ticket.id,
        title: ticket.title,
        description: ticket.description ?? null,
        type: ticket.type ?? null,
        challengeType: ticket.challenge_type,
      },
      scenario: {
        scenarioText: scenario.scenario_text,
        context: scenario.context ?? null,
        expectedOutcome: scenario.expected_outcome ?? null,
      },
      deliverables: deliverables.map((d) => ({
        id: d.id,
        description: d.description,
        orderIndex: d.order_index,
      })),
      submissions: (deliverableSubmissions ?? []).map(
        (s) => ({
          deliverableId: s.deliverable_id,
          content: s.content ?? "",
        }),
      ),
    };

    const gradingResult: GradingResult =
      await gradeSubmission(gradingContext);

    const now = new Date().toISOString();

    // Update attempt with overall grade
    const passedThreshold = 70;
    const attemptStatus =
      gradingResult.overallScore >= passedThreshold
        ? "passed"
        : "failed";

    const { error: updateAttemptError } =
      await supabaseClient
        .from("ticket_attempts")
        .update({
          ai_score: gradingResult.overallScore,
          ai_review_text: gradingResult.overallFeedback,
          status: attemptStatus,
          reviewed_at: now,
        })
        .eq("id", attemptId);

    if (updateAttemptError) {
      return new Response(
        JSON.stringify({
          error: {
            code: "DB_ERROR",
            message:
              "Failed to update ticket attempt with AI grade.",
            details: updateAttemptError.message,
          },
        }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        },
      );
    }

    // Update per-deliverable submissions
    for (const d of gradingResult.perDeliverable) {
      const { error: updateSubmissionError } =
        await supabaseClient
          .from("deliverable_submissions")
          .update({
            ai_score: d.score,
            ai_feedback: d.feedback,
          })
          .eq("attempt_id", attemptId)
          .eq("deliverable_id", d.deliverableId);

      if (updateSubmissionError) {
        return new Response(
          JSON.stringify({
            error: {
              code: "DB_ERROR",
              message:
                "Failed to update deliverable submission with AI grade.",
              details: updateSubmissionError.message,
            },
          }),
          {
            status: 500,
            headers: {
              ...corsHeaders,
              "Content-Type": "application/json",
            },
          },
        );
      }
    }

    return new Response(
      JSON.stringify({
        data: {
          ticketId,
          attemptId,
          ...gradingResult,
        },
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      },
    );
  } catch (err) {
    console.error("ai-grade-attempt error", err);
    return new Response(
      JSON.stringify({
        error: {
          code: "INTERNAL_ERROR",
          message: "Unexpected error grading attempt.",
        },
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      },
    );
  }
});

