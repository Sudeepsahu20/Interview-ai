import dotenv from 'dotenv'
dotenv.config();
import { GoogleGenAI } from "@google/genai";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

const ai = new GoogleGenAI({});

const interviewFunctions = [
{
  name: "analyzeInterview",
  description: "Analyze resume against job description",
  parameters: {
    type: "object",

    properties: {

      title: {
        type: "string",
        description: "Short title for the interview report"
      },

      matchScore: {
        type: "number"
      },

      technicalQuestions: {
        type: "array",
        items: {
          type: "object",
          properties: {
            question: { type: "string" },
            intention: { type: "string" },
            answer: { type: "string" }
          },
          required: ["question","intention","answer"]
        }
      },

      behavioralQuestions: {
        type: "array",
        items: {
          type: "object",
          properties: {
            question: { type: "string" },
            intention: { type: "string" },
            answer: { type: "string" }
          },
          required: ["question","intention","answer"]
        }
      },

      skillGaps: {
        type: "array",
        items: {
          type: "object",
          properties: {
            skill: { type: "string" },
            severity: { type: "string" }
          },
          required:["skill","severity"]
        }
      },

      preparationPlan: {
        type: "array",
        items: {
          type: "object",
          properties: {
            day: { type: "number" },
            focus: { type: "string" },
            tasks: {
              type: "array",
              items: { type: "string" }
            }
          },
          required:["day","focus","tasks"]
        }
      }

    },

    required: [
      "title",
      "matchScore",
      "technicalQuestions",
      "behavioralQuestions",
      "skillGaps",
      "preparationPlan"
    ]
  }
}
]

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {

const prompt = `
You are an AI interview assistant.

Generate interview preparation data for the candidate.

IMPORTANT RULES:

1. Return ONLY valid JSON.
2. Arrays MUST contain objects.
3. Do NOT return field names as strings.
4. Each object must contain real content.

Correct format example:

{
 "matchScore": 85,
  "title": "Node.js Backend Developer Interview Prep Report",
 "technicalQuestions": [
  {
   "question": "Explain Node.js event loop",
   "intention": "Check understanding of async programming",
   "answer": "Node.js uses an event loop to handle asynchronous operations"
  }
 ],

 "behavioralQuestions": [
  {
   "question": "Tell me about a challenging project",
   "intention": "Evaluate problem solving",
   "answer": "In one project I faced..."
  }
 ],

 "skillGaps": [
  {
   "skill": "System Design",
   "severity": "medium"
  }
 ],

 "preparationPlan": [
  {
   "day": 1,
   "focus": "Node.js fundamentals",
   "tasks": [
    "Study event loop",
    "Build REST APIs"
   ]
  }
 ]
}

Now generate REAL content using this structure.

Resume:
${resume}

Self Description:
${selfDescription}

Job Description:
${jobDescription}

Return ONLY JSON.
`;
  const response = await ai.models.generateContent({
  model: "gemini-2.5-flash-lite",
  contents: prompt,
  config:{
    tools:[
      {
        functionDeclarations: interviewFunctions
      }
    ],
     toolConfig:{
      functionCallingConfig:{
        mode:"ANY"
      }
    }
  }
})


const candidate = response?.candidates?.[0]

if(!candidate){
  throw new Error("No response from AI")
}

const parts = candidate?.content?.parts || []

for(const part of parts){

  if(part.functionCall){

    const args = part.functionCall.args

    return {
      title: args.title,
      matchScore: args.matchScore,
      technicalQuestions: args.technicalQuestions,
      behavioralQuestions: args.behavioralQuestions,
      skillGaps: args.skillGaps,
      preparationPlan: args.preparationPlan
    }

  }

}

throw new Error("AI did not return function call")
}

export default generateInterviewReport;