// backend/controllers/aiController.js
import dotenv from 'dotenv';
dotenv.config();

import { GoogleGenerativeAI } from '@google/generative-ai';
import { z } from 'zod';

// ✅ Initialize Gemini AI with explicit v1 endpoint
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY, {
  apiEndpoint: 'https://generativelanguage.googleapis.com/v1'
});

// Validation schemas
const AtsScoreSchema = z.object({
  score: z.number().min(0).max(100),
  missingKeywords: z.array(z.string()),
  suggestions: z.array(z.string()),
  notes: z.string().optional()
});

const AutoStructureSchema = z.object({
  summary: z.string(),
  skills: z.array(z.string()),
  experience: z.array(z.string()),
  education: z.array(z.string()).optional(),
  projects: z.array(z.string()).optional()
});

// Helper to strip Markdown code blocks from Gemini response
function stripMarkdownJson(text) {
  return text.replace(/```(?:json)?\n?([\s\S]*?)```/g, '$1').trim();
}

// ===================== ATS Score =====================
export const atsScore = async (req, res) => {
  try {
    const { resumeData, jobDescription } = req.body;

    if (!resumeData || !jobDescription) {
      return res.status(400).json({ error: 'Resume data and job description are required' });
    }

    const model = genAI.getGenerativeModel({ model: 'models/gemini-2.5-flash' });

    const prompt = `
You are an ATS (Applicant Tracking System) expert. Analyze the resume data against the job description and provide an ATS compatibility score.

RESUME DATA:
${JSON.stringify(resumeData, null, 2)}

JOB DESCRIPTION:
${jobDescription}

Please analyze and return a JSON response with the following structure:
{
  "score": number (0-100, where 100 is perfect match),
  "missingKeywords": array of important keywords from job description that are missing from resume,
  "suggestions": array of specific suggestions to improve ATS compatibility,
  "notes": string with additional insights about the match
}

Focus on:
- Keyword matching between resume and job requirements
- Skills alignment
- Experience relevance
- Education requirements
- Format and structure compatibility

Return ONLY valid JSON, no additional text.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = await response.text();

    // Strip Markdown code blocks
    text = stripMarkdownJson(text);

    let parsedResponse;
    try {
      parsedResponse = JSON.parse(text);
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', text);
      return res.status(502).json({ error: 'Invalid response from AI service' });
    }

    const validatedResponse = AtsScoreSchema.parse(parsedResponse);

    res.json({
      atsScore: validatedResponse.score,
      missingKeywords: validatedResponse.missingKeywords,
      suggestions: validatedResponse.suggestions,
      notes: validatedResponse.notes || '',
      analysisComplete: true
    });

  } catch (error) {
    console.error('ATS Score error:', error);

    if (error.name === 'ZodError') {
      return res.status(502).json({ error: 'Invalid AI response format' });
    }

    res.status(500).json({ error: 'Server error during ATS analysis' });
  }
};

// ===================== Auto Structure =====================
export const autoStructure = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text input is required' });
    }

    const model = genAI.getGenerativeModel({ model: 'models/gemini-2.5-flash' });

    const prompt = `
You are a resume expert. Analyze the following career description text and extract structured information for a resume.

INPUT TEXT:
${text}

Please extract and return a JSON response with the following structure:
{
  "summary": string (professional summary/objective, 2-3 sentences),
  "skills": array of technical and soft skills mentioned,
  "experience": array of work experience bullet points (each as a separate string),
  "education": array of education entries (if mentioned),
  "projects": array of project descriptions (if mentioned)
}

Guidelines:
- Keep summary concise and professional
- Extract all relevant skills (technical, tools, soft skills)
- Convert work experience into action-oriented bullet points
- Include education if mentioned (degree, institution, year)
- Include projects if mentioned with descriptions
- Return empty arrays for fields not found in the text

Return ONLY valid JSON, no additional text.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let textResponse = await response.text();

    // Strip Markdown code blocks
    textResponse = stripMarkdownJson(textResponse);

    let parsedResponse;
    try {
      parsedResponse = JSON.parse(textResponse);
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', textResponse);
      return res.status(502).json({ error: 'Invalid response from AI service' });
    }

    const validatedResponse = AutoStructureSchema.parse(parsedResponse);

    res.json({
      structuredData: {
        summary: validatedResponse.summary,
        skills: validatedResponse.skills,
        experience: validatedResponse.experience,
        education: validatedResponse.education || [],
        projects: validatedResponse.projects || []
      },
      extractionComplete: true
    });

  } catch (error) {
    console.error('Auto Structure error:', error);

    if (error.name === 'ZodError') {
      return res.status(502).json({ error: 'Invalid AI response format' });
    }

    res.status(500).json({ error: 'Server error during text analysis' });
  }
};
