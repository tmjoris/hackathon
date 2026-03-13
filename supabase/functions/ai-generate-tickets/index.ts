// Supabase Edge Function: Generate AI tickets for a course
// Triggered via HTTP POST.
// Expected query params:
//   - courseId (required): UUID of the course
//   - mode (optional): "initial" | "regenerate_all" | "append"
//   - targetTicketCount (optional): number

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

import { generateTicketsForCourse } from "../_shared/ai/llmClient.ts";
import type {
  CourseContext,
  CourseMaterialContext,
  GeneratedTicket,
  TicketGenerationContext,
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
    const url = new URL(req.url);
    const courseId = url.searchParams.get("courseId");
    const mode =
      url.searchParams.get("mode") ?? "initial";
    const targetTicketCountParam =
      url.searchParams.get("targetTicketCount");
    const targetTicketCount = targetTicketCountParam
      ? Number(targetTicketCountParam)
      : undefined;

    if (!courseId) {
      return new Response(
        JSON.stringify({
          error: { code: "BAD_REQUEST", message: "Missing courseId query parameter." },
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

    const supabaseClient = createClient(
      supabaseUrl,
      serviceRoleKey,
    );

    // Fetch course
    const { data: course, error: courseError } =
      await supabaseClient
        .from("courses")
        .select("*")
        .eq("id", courseId)
        .single();

    if (courseError || !course) {
      return new Response(
        JSON.stringify({
          error: {
            code: "NOT_FOUND",
            message: "Course not found.",
            details: courseError?.message,
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

    // Fetch course materials
    const { data: materials, error: materialsError } =
      await supabaseClient
        .from("course_materials")
        .select("*")
        .eq("course_id", courseId)
        .order("order_index", { ascending: true });

    if (materialsError) {
      return new Response(
        JSON.stringify({
          error: {
            code: "DB_ERROR",
            message: "Failed to load course materials.",
            details: materialsError.message,
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

    if (!materials || materials.length === 0) {
      return new Response(
        JSON.stringify({
          error: {
            code: "NO_MATERIALS",
            message:
              "No course materials found for this course. Upload materials before generating tickets.",
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

    const courseContext: CourseContext = {
      id: course.id,
      title: course.title,
      description: course.description ?? null,
      category: course.category ?? null,
      difficulty: course.difficulty ?? null,
    };

    const materialContext: CourseMaterialContext[] =
      (materials ?? []).map((m) => ({
        id: m.id,
        title: m.title,
        description: m.description ?? null,
        fileUrl: m.file_url ?? null,
        fileType: m.file_type ?? null,
      }));

    const generationContext: TicketGenerationContext = {
      course: courseContext,
      materials: materialContext,
      targetTicketCount,
    };

    // If mode is initial and tickets already generated, return early
    if (mode === "initial" && course.ai_generated_tickets) {
      return new Response(
        JSON.stringify({
          error: {
            code: "ALREADY_GENERATED",
            message:
              "AI tickets have already been generated for this course.",
          },
        }),
        {
          status: 409,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        },
      );
    }

    const generatedTickets: GeneratedTicket[] =
      await generateTicketsForCourse(
        generationContext,
      );

    if (!generatedTickets.length) {
      return new Response(
        JSON.stringify({
          error: {
            code: "AI_EMPTY",
            message:
              "AI did not return any tickets for this course.",
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

    // Optionally clear existing AI-generated tickets when regenerating.
    if (mode === "regenerate_all") {
      const { error: deleteError } =
        await supabaseClient
          .from("tickets")
          .delete()
          .eq("course_id", courseId)
          .eq("ai_generated", true);

      if (deleteError) {
        return new Response(
          JSON.stringify({
            error: {
              code: "DB_ERROR",
              message:
                "Failed to remove existing AI-generated tickets.",
              details: deleteError.message,
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

    // Group by sprint and insert sprints first
    const sprintKey = (t: GeneratedTicket) =>
      `${t.sprintOrderIndex}::${t.sprintTitle}`;

    const uniqueSprintsMap = new Map<
      string,
      {
        title: string;
        description?: string;
        order_index: number;
      }
    >();

    for (const t of generatedTickets) {
      const key = sprintKey(t);
      if (!uniqueSprintsMap.has(key)) {
        uniqueSprintsMap.set(key, {
          title: t.sprintTitle,
          description: t.sprintDescription,
          order_index: t.sprintOrderIndex,
        });
      }
    }

    const sprintPayload = Array.from(
      uniqueSprintsMap.values(),
    ).map((s) => ({
      course_id: courseId,
      title: s.title,
      description: s.description ?? null,
      order_index: s.order_index,
    }));

    const { data: insertedSprints, error: sprintsError } =
      await supabaseClient
        .from("sprints")
        .insert(sprintPayload)
        .select("*");

    if (sprintsError || !insertedSprints) {
      return new Response(
        JSON.stringify({
          error: {
            code: "DB_ERROR",
            message: "Failed to insert sprints.",
            details: sprintsError?.message,
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

    const sprintIdByKey = new Map<string, string>();
    for (const sprint of insertedSprints) {
      const key = `${sprint.order_index}::${sprint.title}`;
      sprintIdByKey.set(key, sprint.id);
    }

    // Insert tickets
    const ticketPayload = generatedTickets.map(
      (t, index) => {
        const key = sprintKey(t);
        const sprintId = sprintIdByKey.get(key);
        if (!sprintId) {
          throw new Error(
            `Missing sprint mapping for key ${key}`,
          );
        }

        return {
          sprint_id: sprintId,
          course_id: courseId,
          title: t.title,
          description: t.description,
          type: t.type,
          challenge_type: t.challengeType,
          duration_estimate_minutes:
            t.durationEstimateMinutes,
          is_urgent: t.isUrgent,
          order_index: index,
          ai_generated: true,
        };
      },
    );

    const { data: insertedTickets, error: ticketsError } =
      await supabaseClient
        .from("tickets")
        .insert(ticketPayload)
        .select("*");

    if (ticketsError || !insertedTickets) {
      return new Response(
        JSON.stringify({
          error: {
            code: "DB_ERROR",
            message: "Failed to insert tickets.",
            details: ticketsError?.message,
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

    const scenarioPayload = [];
    const deliverablePayload = [];

    for (let i = 0; i < generatedTickets.length; i++) {
      const t = generatedTickets[i];
      const ticket = insertedTickets[i];
      if (!ticket) continue;

      scenarioPayload.push({
        ticket_id: ticket.id,
        scenario_text: t.scenarioText,
        context: t.context ?? null,
        expected_outcome: t.expectedOutcome,
      });

      for (const d of t.deliverables) {
        deliverablePayload.push({
          ticket_id: ticket.id,
          description: d.description,
          order_index: d.orderIndex,
        });
      }
    }

    if (scenarioPayload.length > 0) {
      const { error: scenariosError } =
        await supabaseClient
          .from("ticket_scenarios")
          .insert(scenarioPayload);

      if (scenariosError) {
        return new Response(
          JSON.stringify({
            error: {
              code: "DB_ERROR",
              message:
                "Failed to insert ticket scenarios.",
              details: scenariosError.message,
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

    if (deliverablePayload.length > 0) {
      const { error: deliverablesError } =
        await supabaseClient
          .from("ticket_deliverables")
          .insert(deliverablePayload);

      if (deliverablesError) {
        return new Response(
          JSON.stringify({
            error: {
              code: "DB_ERROR",
              message:
                "Failed to insert ticket deliverables.",
              details: deliverablesError.message,
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

    const totalSprints = sprintPayload.length;
    const totalTickets = generatedTickets.length;

    const { error: updateCourseError } =
      await supabaseClient
        .from("courses")
        .update({
          ai_generated_tickets: true,
          total_sprints: (course.total_sprints ?? 0) +
            totalSprints,
          total_tickets: (course.total_tickets ?? 0) +
            totalTickets,
        })
        .eq("id", courseId);

    if (updateCourseError) {
      return new Response(
        JSON.stringify({
          error: {
            code: "DB_ERROR",
            message:
              "Failed to update course ticket counts.",
            details: updateCourseError.message,
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

    return new Response(
      JSON.stringify({
        data: {
          courseId,
          mode,
          totalSprints,
          totalTickets,
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
    console.error("ai-generate-tickets error", err);
    return new Response(
      JSON.stringify({
        error: {
          code: "INTERNAL_ERROR",
          message: "Unexpected error generating tickets.",
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

