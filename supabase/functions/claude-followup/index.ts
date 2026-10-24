// Supabase Edge Function: claude-followup
// Follows strict safety rules: NEVER diagnoses or alters dosages; handles check-ins, reminders, and escalations.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY") || ""
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || ""
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

const SYSTEM_PROMPT = `You are Sankalp AI, a gentle, highly empathetic, and professional health follow-up companion.
Your primary role is to assist patients who have recently had a consultation and received a doctor's prescription.

STRICT MEDICAL SAFETY RULES:
1. You must NEVER diagnose conditions, alter prescribed dosages, or prescribe new medications.
2. You only remind, check in, provide general wellness guidance (hydration, rest, sleep, calm breathing), and answer general questions about the prescribed routine.
3. If the patient reports worsening health, severe symptoms (severity >= 7/10), or lack of improvement over consecutive days, calmly express concern and recommend booking a new appointment with a doctor. Include the tag [ESCALATE_DOCTOR].
4. EMERGENCY/SOS TRIGGER: If the patient mentions chest pain, severe breathlessness, sudden weakness/numbness, severe bleeding, or suicidal thoughts, immediately instruct them to seek emergency services and include the tag [TRIGGER_EMERGENCY].
5. Always maintain a warm, calming tone matching Sankalp's philosophy: "Your resolve to heal, with care beside you."`

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    const { patientId, userMessage, checkinData, prescriptionContext } = await req.json()

    let promptContent = `Patient ID: ${patientId}\n`
    if (prescriptionContext) {
      promptContent += `Current Diagnosis: ${prescriptionContext.diagnosis || 'Under care'}\nPrescribed Advice: ${prescriptionContext.advice || 'Follow medication'}\n`
    }
    if (checkinData) {
      promptContent += `Latest Check-in: Mood=${checkinData.mood}, Severity=${checkinData.severity}/10, Notes="${checkinData.notes || ''}"\n`
    }
    promptContent += `User says: "${userMessage}"`

    // Call Anthropic Claude Messages API
    let aiReply = ""
    let shouldEscalate = false
    let isEmergency = false

    if (ANTHROPIC_API_KEY) {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "x-api-key": ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-3-5-sonnet-20241022",
          max_tokens: 600,
          system: SYSTEM_PROMPT,
          messages: [{ role: "user", content: promptContent }],
        }),
      })

      const data = await response.json()
      aiReply = data.content?.[0]?.text || "Thank you for checking in. Please remember to stay hydrated and take your doses on time."
    } else {
      // Fallback local safe reasoning if API key is not yet set in environment
      if (checkinData && checkinData.severity >= 8) {
        aiReply = "I notice you are reporting severe symptoms (severity " + checkinData.severity + "/10). Your safety is our priority. I strongly recommend scheduling a follow-up consultation with your doctor right away so they can re-evaluate your condition. [ESCALATE_DOCTOR]"
      } else if (userMessage.toLowerCase().includes("chest pain") || userMessage.toLowerCase().includes("breath")) {
        aiReply = "Please stop what you are doing. Symptoms like chest tightness or breathing trouble require immediate emergency attention. Please call emergency services immediately or tap the Emergency SOS panel below. [TRIGGER_EMERGENCY]"
      } else {
        aiReply = "Thank you for keeping me updated. It is encouraging that you are being mindful of your recovery. Please continue your prescribed doses with meals as directed, keep yourself hydrated, and rest well."
      }
    }

    if (aiReply.includes("[ESCALATE_DOCTOR]")) {
      shouldEscalate = true
      aiReply = aiReply.replace("[ESCALATE_DOCTOR]", "").trim()
    }
    if (aiReply.includes("[TRIGGER_EMERGENCY]")) {
      isEmergency = true
      aiReply = aiReply.replace("[TRIGGER_EMERGENCY]", "").trim()
    }

    return new Response(
      JSON.stringify({
        reply: aiReply,
        shouldEscalate,
        isEmergency,
        disclaimer: "Sankalp AI provides general wellness support and does not replace doctor advice or emergency care."
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    )
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    })
  }
})
