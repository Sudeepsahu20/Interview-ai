import dotenv from 'dotenv'
dotenv.config();
import { GoogleGenAI } from "@google/genai";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

const ai = new GoogleGenAI({});

const interviewReportSchema = z.object({
  matchScore: z.number(),

  technicalQuestions: z.array(
    z.object({
      question: z.string(),
      intent: z.string(),
      answer: z.string()
    })
  ),

  behavioralQuestions: z.array(
    z.object({
      question: z.string(),
      intent: z.string(),
      answer: z.string()
    })
  ),

  skillGaps: z.array(
    z.object({
      skill: z.string(),
      severity: z.enum(["low", "medium", "high"])
    })
  ),

  preparationPlan: z.array(
    z.object({
      day: z.number(),
      focus: z.string(),
      tasks: z.array(z.string())
    })
  )
});

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
const prompt = `
You are an AI interview assistant.

Analyze the candidate and generate interview preparation data.

Return ONLY valid JSON.

IMPORTANT:
- Arrays must contain OBJECTS not strings
- Do not return field names only
- Generate real content
- Follow the exact structure

Example Output:

{
 "matchScore": 85,

 "technicalQuestions":[
   {
    "question":"Explain Node.js event loop",
    "intent":"Check understanding of async model",
    "answer":"Node.js uses an event loop to handle asynchronous operations..."
   },
   {
    "question":"How do you secure REST APIs using JWT?",
    "intent":"Evaluate backend authentication knowledge",
    "answer":"JWT authentication works by generating a signed token..."
   }
 ],

 "behavioralQuestions":[
   {
    "question":"Tell me about a challenging backend bug you solved",
    "intent":"Evaluate problem solving",
    "answer":"In one project I encountered..."
   }
 ],

 "skillGaps":[
   {
    "skill":"System Design",
    "severity":"medium"
   }
 ],

 "preparationPlan":[
   {
    "day":1,
    "focus":"Node.js fundamentals",
    "tasks":[
      "Study event loop",
      "Practice building REST APIs"
    ]
   }
 ]
}

Now generate a similar JSON response.

Resume:
${resume}

Self Description:
${selfDescription}

Job Description:
${jobDescription}

Return ONLY JSON.
`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      temperature: 0.2,
      responseMimeType: "application/json",
      responseSchema: zodToJsonSchema(interviewReportSchema)
    }
  });

  // Step 1: Clean code fences if any
  const clean = response.text.replace(/```json/g, "").replace(/```/g, "");

  // Step 2: Parse JSON
  const data = JSON.parse(clean);
console.log(data);
}

export default generateInterviewReport;