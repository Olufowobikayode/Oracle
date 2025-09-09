// FIX: Import 'Type' from '@google/genai' to use in response schemas.
import { GoogleGenAI, Type } from "@google/genai";
// FIX: Import OracleSessionState from the central types file.
import type { TrendData, KeywordData, MarketplaceData, ContentData, SocialsData, CopyData, VentureVision, VentureBlueprint, Source, SocialsPlatformAnalysis, CardBase, ComparativeReport, ArbitrageData, ScenarioData, OracleSessionState } from '../types';
import type { GenerateContentResponse } from "@google/genai";

// New helper function to more reliably detect quota errors from the Gemini API.
const isQuotaError = (error: any): boolean => {
    // The genai SDK often wraps the actual error. A reliable way to check is the status code.
    const status = error?.cause?.status || error?.response?.status;
    if (status === 429) {
        return true;
    }
    
    // As a fallback, check the error message for common strings.
    if (error instanceof Error) {
        const message = error.message.toLowerCase();
        if (message.includes('429') || message.includes('quota') || message.includes('resource_exhausted')) {
            return true;
        }
    }
    
    return false;
};

// --- Secure API Key Handling ---
// The API key is now sourced from a secure environment variable.
// This prevents keys from being exposed in the source code.
const GEMINI_API_KEY = process.env.API_KEY;

if (!GEMINI_API_KEY) {
    console.error("FATAL: `process.env.API_KEY` is not set. Please provide a valid Gemini API key.");
}

let aiClient: GoogleGenAI | null = null;

const getAiClient = (): GoogleGenAI => {
    if (!GEMINI_API_KEY) {
        throw new Error("No Google AI API key available. Please set `process.env.API_KEY`.");
    }
    if (!aiClient) {
        aiClient = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
    }
    return aiClient;
};

export const getCurrentApiKey = (): string => {
    return GEMINI_API_KEY || "";
};

// Centralized request executor
async function executeGeminiRequest<T>(requestFn: (client: GoogleGenAI) => Promise<T>): Promise<T> {
    try {
        const client = getAiClient();
        return await requestFn(client);
    } catch (error: any) {
        // Since we now use a single, securely provided key, we don't rotate.
        // We simply pass the error along to be handled by the calling saga.
        console.error(`Gemini API request failed:`, error.message);
        throw error; // Re-throw the original error
    }
}

const handleApiError = (error: any, defaultMessage: string): Error => {
    console.error("Gemini API Error:", error);
    if (isQuotaError(error)) {
        // This specific message will be caught by sagas to trigger the global outage state.
        return new Error("The API key has exceeded its quota or is invalid. Please check your billing details or API key.");
    }
    if (error instanceof SyntaxError || (error instanceof Error && error.message.toLowerCase().includes('json'))) {
         return new Error("AI analysis failed. The AI returned an invalid data format.");
    }
    return new Error(defaultMessage);
};


// New function to check API health
export const checkApiHealth = async (): Promise<boolean> => {
    console.log("Checking Gemini API health...");
    try {
        await executeGeminiRequest(ai => ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: 'test',
            config: {
                thinkingConfig: { thinkingBudget: 0 } // Make it as fast and cheap as possible
            }
        }));
        console.log("Gemini API health check successful.");
        return true;
    } catch (error: any) {
        console.log("Health check failed. The API key may be invalid or quota exhausted.");
        return false;
    }
};

const getSystemInstruction = (session: OracleSessionState): string => {
    let instruction = "You are a world-class market analyst, business strategist, and content creator AI. Your analysis is sharp, data-driven, and actionable. You perform deep, step-by-step research before providing answers. You provide clear, concise, and professional advice to help users make informed business decisions.";
    
    if (session.targetAudience?.trim()) {
        instruction += `\n\nThe user's target audience is: "${session.targetAudience}". All your recommendations, content, and strategies should be tailored to this audience.`;
    }

    if (session.brandVoice?.trim()) {
        instruction += `\n\nCRITICAL: Adopt the user's brand voice. A description or sample of their writing style is provided here: """${session.brandVoice}"""`;
    }
    return instruction;
}

// Helper to parse JSON from markdown and attach sources
const parseJsonResponse = (response: GenerateContentResponse, defaultTitle: string) => {
    const rawText = response.text.trim();
    const jsonMatch = rawText.match(/```json\n([\s\S]*?)\n```/);
    if (!jsonMatch || !jsonMatch[1]) {
        // Fallback for when the model doesn't use a markdown block
        try {
            const parsed = JSON.parse(rawText);
            return parsed;
        } catch(e) {
            throw new Error("AI response was not valid JSON and could not be parsed.");
        }
    }
    const data = JSON.parse(jsonMatch[1]);
    
    const sources: Source[] = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
        title: chunk.web.title || "Untitled Source",
        uri: chunk.web.uri,
    })) || [];
    
    // If the data is an array, attach sources to each item. If it's an object, attach to the object.
    const assignSources = (item: any) => ({ ...item, sources });

    if (Array.isArray(data)) {
        return data.map(assignSources);
    } else {
        // Handle the case where the AI might forget the 'title' key for a single object response
        if (data && !data.title && defaultTitle) {
            data.title = defaultTitle;
        }
        return assignSources(data);
    }
};

// --- Market Analysis ---
export const analyzeNicheTrends = async (session: OracleSessionState): Promise<TrendData[]> => {
    const prompt = `Act as a world-class market researcher. Your task is to perform a deep research analysis for the niche "${session.niche}", with the user's goal being "${session.purpose}". Follow these steps meticulously:
1.  **Initial Brainstorm & Search**: Use Google Search to conduct a broad scan of the niche. Identify all potential sub-trends, consumer behaviors, emerging technologies, and market gaps.
2.  **Filter & Deep Dive**: From your initial findings, select **5 to 7** of the most promising and distinct sub-trends or opportunities. For each one, perform another targeted search to gather deep, specific data.
3.  **Detailed Analysis & JSON Output**: Format your entire response as an array of JSON objects within a single \`\`\`json markdown block. Each object represents one of the trends and MUST have the following keys: "id", "title" (unique, descriptive, SEO-friendly), "description" (concise and compelling summary of strategic value), "audience" (an object with "targetDemographics" and "keyInterests" arrays), "seoKeywords" (an array), "monetizationStrategies" (an array of objects with "strategy" and "description"), and "competitorAnalysis" (an array of objects with "name", "url", "strengths", and "weaknesses"). Ensure all fields are thoroughly populated based on your deep research.`;
    try {
        const response = await executeGeminiRequest(ai => ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction: getSystemInstruction(session),
                tools: [{googleSearch: {}}],
            },
        }));
        const parsedData = parseJsonResponse(response as GenerateContentResponse, "Market Trend");
        const dataArray = Array.isArray(parsedData) ? parsedData : [parsedData];
        return dataArray.map((item: any) => ({ ...item, stackType: 'trends' })) as TrendData[];
    } catch (error) {
        throw handleApiError(error, "The market analysis could not be completed at this time.");
    }
};

// --- Keyword Research ---
export const analyzeKeywords = async (session: OracleSessionState): Promise<KeywordData[]> => {
    const prompt = `Act as an expert SEO strategist. Perform a deep keyword analysis for the niche "${session.niche}". Your research must be grounded in up-to-date search trend data. Follow these steps:
1.  **Initial Search & Topic Clustering**: Use Google Search to identify a wide range of topics, questions, and commercial terms related to the niche. Group these findings into logical clusters.
2.  **Selection & Analysis**: Select **5 to 7** distinct and valuable keyword clusters. For each cluster, identify a primary keyword and several long-tail variations.
3.  **Data Population & JSON Output**: For each of the clusters, create a unique, SEO-friendly "title" and a compelling one-sentence "description". Format the entire response as an array of JSON objects inside a \`\`\`json markdown block. Each object must contain: "id", "title", "description", "metrics" (for the primary keyword, including "keyword", "volume", "difficulty", "cpc"), and "longTailKeywords" (an array of objects with the same metrics structure).`;
    try {
        const response = await executeGeminiRequest(ai => ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction: getSystemInstruction(session),
                tools: [{googleSearch: {}}],
            },
        }));
        const parsedData = parseJsonResponse(response as GenerateContentResponse, "Keyword Analysis");
        const dataArray = Array.isArray(parsedData) ? parsedData : [parsedData];
        return dataArray.map((item: any) => ({ ...item, stackType: 'keywords' })) as KeywordData[];
    } catch (error) {
        throw handleApiError(error, "Keyword analysis failed to generate a response.");
    }
};

// --- Platform Finder ---
export const analyzeMarketplaces = async (session: OracleSessionState): Promise<MarketplaceData[]> => {
    const prompt = `Act as a specialist in e-commerce and platform strategy. Your task is to conduct deep research to find potential marketplaces for the niche "${session.niche}". Follow these steps:
1.  **Broad Search**: Use Google Search to identify a comprehensive list of all possible online marketplaces, social platforms, and niche communities where products or services in this niche are sold or discussed.
2.  **Filtering and Deep Analysis**: From your list, select **5 to 7** of the most viable platforms. For each one, conduct a deep-dive analysis to understand its audience, fee structure, competition level, and unique features.
3.  **Scoring and JSON Output**: For each of the platforms, generate a specific, SEO-friendly "title" and a concise "description". Assign a data-driven "opportunityScore" from 0-100. Provide clear "reasoning" for the score. List specific "pros" and "cons". Format your response as an array of analysis objects in a single \`\`\`json markdown block. Each object must have keys: "id", "title", "description", "opportunityScore", "reasoning", "pros", "cons".`;
    try {
        const response = await executeGeminiRequest(ai => ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction: getSystemInstruction(session),
                tools: [{googleSearch: {}}],
            },
        }));
        const parsedData = parseJsonResponse(response as GenerateContentResponse, "Platform Analysis");
        const dataArray = Array.isArray(parsedData) ? parsedData : [parsedData];
        return dataArray.map((item: any) => ({ ...item, stackType: 'marketplaces' })) as MarketplaceData[];
    } catch (error) {
        throw handleApiError(error, "The platform finder could not retrieve results.");
    }
}

// --- Content Strategy ---
export const generateContentIdeas = async (topic: string, session: OracleSessionState): Promise<ContentData[]> => {
    const prompt = `Act as a world-class content strategist AI. Your goal is to generate a comprehensive content plan based on deep research of the topic "${topic}". Follow these steps:
1.  **Trend & Question Analysis**: Use Google Search to find current trending topics, common questions (e.g., from People Also Ask, Reddit, Quora), and popular content formats related to "${topic}".
2.  **Idea Generation & Selection**: Brainstorm a wide variety of content angles based on your research. Select **5 to 7** diverse and high-potential content ideas from your brainstorm.
3.  **Detailed Structuring & JSON Output**: For each of the ideas, create a catchy, click-worthy "title" and a short, engaging "description". Determine the best "format" (e.g., 'Blog Post', 'YouTube Video', 'Podcast'). Outline several key "talkingPoints" and a list of relevant "seoKeywords". Format your entire response as an array of content idea objects in a single \`\`\`json markdown block. Each object must have the keys: "id", "title", "description", "format", "talkingPoints", "seoKeywords".`;
    try {
        const response = await executeGeminiRequest(ai => ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction: getSystemInstruction(session),
                tools: [{googleSearch: {}}],
            },
        }));
        const parsedData = parseJsonResponse(response as GenerateContentResponse, "Content Idea");
        const dataArray = Array.isArray(parsedData) ? parsedData : [parsedData];
        return dataArray.map((item: any) => ({ ...item, stackType: 'content' })) as ContentData[];
    } catch (error) {
        throw handleApiError(error, "Content ideas could not be generated.");
    }
};

// --- Social Media Strategy ---
export const analyzeSocials = async (session: OracleSessionState): Promise<SocialsData[]> => {
    const prompt = `
        Act as an expert social media strategist. Conduct a deep research analysis for the niche "${session.niche}" to create a comprehensive content plan. The user's goal is "${session.purpose}". Follow these steps:
        1.  **Platform & Trend Research**: Use Google Search to analyze which social media platforms are most relevant for this niche. Identify current trends, popular content formats, and key influencers or discussions.
        2.  **Content Ideation**: Based on your research, generate a diverse content plan with **5 to 7** individual posts. The posts should cover different platforms and post types (e.g., Educational, Promotional, Engaging Question).
        3.  **Detailed Post Creation & JSON Output**: Structure your response as a single JSON object inside a \`\`\`json markdown block. The object must have a unique, SEO-friendly "title" for the overall strategy, a concise "description", "id", and a "platformAnalysis" key. "platformAnalysis" must be an array of the post objects. Each post object must include keys: "id" (a unique UUID), "platform", "postType", "content", "hashtags" (an array of strings), and "rationale".
    `;
    try {
        const response = await executeGeminiRequest(ai => ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction: getSystemInstruction(session),
                tools: [{googleSearch: {}}],
            },
        }));
        const parsedData = parseJsonResponse(response as GenerateContentResponse, "Social Media Strategy");
        const dataArray = Array.isArray(parsedData) ? [parsedData] : [parsedData]; // Ensure it's always an array with one item
        return dataArray.map((item: any) => ({ ...item, stackType: 'socials' })) as SocialsData[];
    } catch (error) {
        throw handleApiError(error, "The social media analysis failed.");
    }
};

export const regenerateSocialPost = async (session: OracleSessionState, originalPost: SocialsPlatformAnalysis, newPostType: string): Promise<SocialsPlatformAnalysis> => {
    const prompt = `
        You are an expert social media strategist. Your task is to create a new social media post based on the following requirements.

        **New Post Requirements:**
        - **Platform:** ${originalPost.platform}
        - **Niche:** "${session.niche}"
        - **Post Type:** "${newPostType}" <-- THIS IS THE MOST IMPORTANT REQUIREMENT. The post MUST be this type.

        **Inspiration from a previous post (DO NOT COPY IT, REIMAGINE IT for the new post type):**
        - **Content Idea:** "${originalPost.content}"

        **Instructions:**
        1.  Write completely new content for a "${newPostType}" post.
        2.  The content should be inspired by the original post's idea but MUST fit the new post type. For example, if the new type is "Promotional", the content should be persuasive and have a strong call to action. If it's "Engaging Question", it must ask a question to the audience.
        3.  Your entire output MUST be a single JSON object that conforms to the provided schema.
        4.  The "postType" field in your JSON output MUST be exactly "${newPostType}".
        5.  The "id" field in your JSON output MUST be exactly "${originalPost.id}".
    `;
    const postSchema = {
        type: Type.OBJECT,
        properties: {
            id: { type: Type.STRING, description: `Must be exactly: ${originalPost.id}` },
            platform: { type: Type.STRING },
            postType: { 
                type: Type.STRING, 
                description: `The type for this regenerated post. The value MUST be exactly "${newPostType}". Possible values are: Educational, Engaging Question, Fun Fact, Promotional, Behind-the-Scenes.` 
            },
            content: { type: Type.STRING },
            hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
            rationale: { type: Type.STRING, description: `Explain why this new version is a good example of a '${newPostType}' post for the niche.` },
        },
        required: ["id", "platform", "postType", "content", "hashtags", "rationale"]
    };

    try {
        const response = await executeGeminiRequest(ai => ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction: getSystemInstruction(session),
                responseMimeType: 'application/json',
                responseSchema: postSchema,
            },
        }));
        const parsedData = JSON.parse((response as GenerateContentResponse).text.trim());
        // Failsafe: Ensure the original ID and selected type are preserved, even if the model makes a mistake.
        parsedData.id = originalPost.id;
        parsedData.postType = newPostType;
        return parsedData as SocialsPlatformAnalysis;
    } catch (error) {
        throw handleApiError(error, "Failed to regenerate the social media post.");
    }
};

// --- Marketing Copy ---
export const generateMarketingCopy = async (session: OracleSessionState): Promise<CopyData[]> => {
    const prompt = `Act as an expert direct response copywriter. Perform deep research to generate a variety of marketing copy for the niche "${session.niche}" with the goal of "${session.purpose}". Follow these steps:
1.  **Angle Research**: Use Google Search to analyze competitor ads, customer reviews, and forum discussions for this niche. Identify key pain points, desires, and effective marketing angles.
2.  **Copy Variation**: Based on your research, create **5 to 7** distinct pieces of marketing copy. These should include a variety of copy types (e.g., 'Facebook Ad', 'Product Description', 'Landing Page Hero').
3.  **Detailed Copywriting & JSON Output**: For each of the pieces, create a unique "title" describing its specific angle (e.g., 'Urgency-Driven Facebook Ad Copy') and a concise "description". Write multiple compelling "headlines", a full "body" text, and a strong "callToAction". Format your entire response as an array of objects inside a \`\`\`json markdown block. Each object must have keys: "id", "title", "description", "copyType", "headlines", "body", "callToAction".`;
    try {
        const response = await executeGeminiRequest(ai => ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction: getSystemInstruction(session),
                tools: [{googleSearch: {}}],
            },
        }));
        const parsedData = parseJsonResponse(response as GenerateContentResponse, "Marketing Copy");
        const dataArray = Array.isArray(parsedData) ? parsedData : [parsedData];
        return dataArray.map((item: any) => ({ ...item, stackType: 'copy' })) as CopyData[];
    } catch (error) {
        throw handleApiError(error, "Failed to generate marketing copy.");
    }
};

// --- New Ventures ---
export const generateInitialVisions = async (session: OracleSessionState): Promise<VentureVision[]> => {
    const prompt = `Act as an innovative venture capitalist and market analyst. Conduct deep research on Google Search trends for "${session.niche}" to generate novel business ideas. Follow these steps:
1.  **Trend Synthesis**: Use Google Search to identify emerging technologies, shifting consumer behaviors, and underserved market segments related to the niche. Synthesize these findings to spot unique opportunities.
2.  **Idea Generation**: Brainstorm a wide range of potential ventures. Select **5 to 7** diverse and innovative business or venture ideas from your brainstorm.
3.  **Concept Detailing & JSON Output**: For each of the ideas, provide a catchy "title", a compelling "oneLinePitch", a clear "businessModel", and an "evidenceTag" indicating the trend it's based on. Return the response as an array of objects in a single \`\`\`json markdown block. Each object must have keys: "id", "title", "oneLinePitch", "businessModel", "evidenceTag".`;
    try {
        const response = await executeGeminiRequest(ai => ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction: getSystemInstruction(session),
                tools: [{googleSearch: {}}],
            },
        }));
        const parsedData = parseJsonResponse(response as GenerateContentResponse, "Venture Idea");
        const dataArray = Array.isArray(parsedData) ? parsedData : [parsedData];
        return dataArray as VentureVision[];
    } catch (error) {
        throw handleApiError(error, "Failed to generate venture visions.");
    }
};

export const generateDetailedBlueprint = async (vision: VentureVision, session: OracleSessionState): Promise<VentureBlueprint> => {
    const prompt = `Act as a seasoned business consultant. Create a detailed and actionable business blueprint for the following venture idea: Title: "${vision.title}", Pitch: "${vision.oneLinePitch}".
    **Instructions**:
    1.  **Deep Research**: Use Google Search to find data that can inform the marketing plan, sourcing, and operational details. Look for competitor strategies, potential suppliers, and relevant marketing channels.
    2.  **Strategic Formulation**: Based on your research, develop a comprehensive summary, define a specific target audience, create a detailed marketing plan (content pillars, promotion channels, USP), outline sourcing/operations, and list the first three actionable steps.
    3.  **JSON Output**: Format your entire response as a single, detailed JSON object within a \`\`\`json markdown block. The object must have the following keys: "prophecyTitle", "summary", "targetAudience", "marketingPlan" (object with "contentPillars", "promotionChannels", "uniqueSellingProposition"), "sourcingAndOperations", and "firstThreeSteps".`;
    try {
        const response = await executeGeminiRequest(ai => ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction: getSystemInstruction(session),
                tools: [{googleSearch: {}}],
            },
        }));
        return parseJsonResponse(response as GenerateContentResponse, vision.title) as VentureBlueprint;
    } catch (error) {
        throw handleApiError(error, "Failed to generate the business blueprint.");
    }
};


// --- Q&A ---
export const answerQuestionWithContext = async (session: OracleSessionState, context: string, question: string): Promise<string> => {
    const prompt = `
        Based on the following JSON data context, please answer the user's question. Provide a concise, insightful answer.
        
        Context:
        \`\`\`json
        ${context}
        \`\`\`
        
        Question: "${question}"
    `;
    try {
        const response = await executeGeminiRequest(ai => ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction: getSystemInstruction(session),
            },
        }));
        return (response as GenerateContentResponse).text.trim();
    } catch (error) {
        throw handleApiError(error, "The Oracle could not answer at this time.");
    }
};

// --- Media Generation ---
export const generateImageFromPrompt = async (prompt: string, aspectRatio: string): Promise<string> => {
    try {
        const response = await executeGeminiRequest(ai => ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt,
            config: {
              numberOfImages: 1,
              outputMimeType: 'image/jpeg',
              aspectRatio: aspectRatio as any,
            },
        }));
        const base64ImageBytes: string = (response as any).generatedImages[0].image.imageBytes;
        return `data:image/jpeg;base64,${base64ImageBytes}`;
    } catch (error) {
        throw handleApiError(error, "Image generation failed.");
    }
};

export const generateVideoFromPrompt = async (prompt: string): Promise<any> => {
    try {
        const operation = await executeGeminiRequest(ai => ai.models.generateVideos({
            model: 'veo-2.0-generate-001',
            prompt,
            config: { numberOfVideos: 1 }
        }));
        return operation;
    } catch (error) {
        throw handleApiError(error, "Video generation failed to start.");
    }
};

export const checkVideoOperationStatus = async (operation: any): Promise<any> => {
    try {
        const updatedOperation = await executeGeminiRequest(ai => ai.operations.getVideosOperation({ operation }));
        return updatedOperation;
    } catch (error) {
        throw handleApiError(error, "Failed to check video generation status.");
    }
};

// --- Sales Arbitrage ---
export const analyzeProductArbitrage = async (productQuery: string, session: OracleSessionState): Promise<ArbitrageData[]> => {
    const prompt = `Act as a master sales arbitrage expert. For the product query "${productQuery}", conduct a deep-dive analysis using Google Search. Follow these steps:
1.  **Platform Research**: Use Google Search extensively to identify a wide range of "buy low" platforms (e.g., auctions, wholesale, clearance sites) and "sell high" platforms (e.g., niche marketplaces, collector forums).
2.  **Strategy Formulation**: Develop **5 to 7** distinct and creative arbitrage strategies based on your research. Each strategy should target different platforms or customer angles.
3.  **Package Creation & JSON Output**: For each of the strategies, generate a complete sales package. This includes a descriptive "title", a summary "description", the target "platform", a compelling "productStory", a detailed "pricingStrategy" (object with "buyLow", "sellHigh", "reasoning"), multiple "marketingAngles" (array of objects with "headline", "body", "platform"), "tagsAndKeywords" (array), and a "dueDiligence" checklist (array). Return the response as an array of objects inside a single \`\`\`json markdown block.`;
    try {
        const response = await executeGeminiRequest(ai => ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction: getSystemInstruction(session),
                tools: [{ googleSearch: {} }],
            },
        }));
        const parsedData = parseJsonResponse(response as GenerateContentResponse, `Arbitrage plan for ${productQuery}`);
        const dataArray = Array.isArray(parsedData) ? parsedData : [parsedData];
        return dataArray.map((item: any) => ({ ...item, stackType: 'arbitrage' })) as ArbitrageData[];
    } catch (error) {
        throw handleApiError(error, "The arbitrage analysis could not be completed.");
    }
};


// --- Scenario Planner ---
export const runStrategicSimulation = async (goalQuery: string, session: OracleSessionState): Promise<ScenarioData[]> => {
    const prompt = `Act as an expert strategic planner. For the business goal "${goalQuery}" in the niche "${session.niche}", conduct a deep simulation. Follow these steps:
1.  **Research & Variable Identification**: Use Google Search to identify all potential challenges, opportunities, market forces, and competitor actions relevant to the goal.
2.  **Scenario Development**: Based on the variables, develop **5 to 7** different and plausible strategic scenarios to achieve this goal. Scenarios should explore different approaches (e.g., aggressive, defensive, niche-focused).
3.  **Plan Detailing & JSON Output**: For each of the scenarios, create a highly descriptive "title" and a concise "description". Provide a clear, step-by-step "actionPlan" (array of objects with "step", "title", "description"), a list of "potentialRisks", a list of "opportunities", and relevant "kpis" (Key Performance Indicators). Return the response as an array of objects inside a single \`\`\`json markdown block.`;
    try {
        const response = await executeGeminiRequest(ai => ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction: getSystemInstruction(session),
                tools: [{ googleSearch: {} }],
            },
        }));
        const parsedData = parseJsonResponse(response as GenerateContentResponse, `Scenario for ${goalQuery}`);
        const dataArray = Array.isArray(parsedData) ? parsedData : [parsedData];
        return dataArray.map((item: any) => ({ ...item, stackType: 'scenarios' })) as ScenarioData[];
    } catch (error) {
        throw handleApiError(error, "The strategic simulation could not be completed.");
    }
};

// --- Comparative Analysis ---
export const generateComparativeAnalysis = async (cards: CardBase[], session: OracleSessionState): Promise<ComparativeReport> => {
    const prompt = `Act as a senior business intelligence analyst. Your task is to perform a deep comparative analysis of the following reports.
    
    **Reports to Compare:**
    \`\`\`json
    ${JSON.stringify(cards, null, 2)}
    \`\`\`

    **Instructions:**
    1.  **Synthesize and Research**: Read and understand all the provided reports. Use Google Search to find external data or trends that can validate, contradict, or add nuance to the points made in the reports.
    2.  **Identify Core Themes**: Analyze the synthesized information to identify overarching themes.
    3.  **Structure Report & JSON Output**: Create a final analysis report. It must include a "title", a "summary", **5** key "similarities", **5** key "differences", and **5** critical "strategicImplications". Format your entire response as a single JSON object inside a \`\`\`json markdown block.`;
    try {
        const response = await executeGeminiRequest(ai => ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction: getSystemInstruction(session),
                tools: [{googleSearch: {}}],
            },
        }));
        return parseJsonResponse(response as GenerateContentResponse, "Comparative Analysis") as ComparativeReport;
    } catch (error) {
        throw handleApiError(error, "Failed to generate the comparative report.");
    }
};