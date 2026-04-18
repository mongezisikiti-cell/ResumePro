import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export async function suggestSummary(data: any) {
  const prompt = `Based on the following professional experience and skills, generate a compelling 3-line professional summary for a resume. 
  Experience: ${JSON.stringify(data.experience)}
  Skills: ${JSON.stringify(data.skills)}
  Current Title: ${data.personalInfo.title}`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      systemInstruction: "You are an expert resume writer and career coach. Your goal is to write high-impact, keyword-rich summaries that catch the eye of recruiters. Focus on quantifiable achievements and key strengths.",
    }
  });

  return response.text;
}

export async function optimizeBullets(bullets: string[], profession: string) {
  const prompt = `Optimize the following resume bullet points for a ${profession} role. Make them more impactful, use action verbs, and ensure they are scannable.
  Bullets:
  ${bullets.join('\n')}
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      systemInstruction: "You are a recruiter specializing in keyword optimization. Rewrite the bullet points to be more professional and result-oriented.",
    }
  });

  return response.text?.split('\n').filter(line => line.trim().length > 0);
}

export async function suggestSkills(experience: any[]) {
  const prompt = `Based on the following work experience, suggest 5-8 relevant technical and soft skills for a resume.
  Experience: ${JSON.stringify(experience)}
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      systemInstruction: "Return only a comma-separated list of skills.",
    }
  });

  return response.text?.split(',').map(s => s.trim());
}

export async function optimizeForKeywords(resumeData: any, jobDescription: string) {
  const prompt = `Analyze this resume against the following job description. Suggest 5 high-impact keywords to add and rewrite one work experience bullet to better align with the role.
  Resume Summary: ${resumeData.personalInfo.summary}
  Experience: ${JSON.stringify(resumeData.experience)}
  
  Job Description:
  ${jobDescription}`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      systemInstruction: "You are an ATS (Applicant Tracking System) expert. Focus on keyword density and semantic relevance. Return your answer in a concise, friendly tone.",
    }
  });

  return response.text;
}
