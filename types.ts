export type StackType = 'trends' | 'keywords' | 'marketplaces' | 'content' | 'qna' | 'socials' | 'copy' | 'arbitrage' | 'scenarios';

export interface Source {
    title: string;
    uri: string;
}

export interface CardBase {
    id: string;
    title: string;
    description: string;
    stackType: StackType;
    sources?: Source[];
}

// --- Oracle Session ---
export interface OracleSessionState {
    niche: string;
    purpose: string; // e.g., 'Product', 'Blog Post', 'Advertisement'
    targetAudience: string; // New field for defining the audience
    brandVoice: string; // New field for user's writing style or selected tone
    isInitiated: boolean;
}

// --- Trend Analysis (Grand Strategy) ---
export interface Competitor {
  name: string;
  url: string;
  strengths: string[];
  weaknesses:string[];
}
export interface TrendData extends CardBase {
  stackType: 'trends';
  audience: {
    targetDemographics: string[];
    keyInterests: string[];
  };
  seoKeywords: string[];
  monetizationStrategies: {
    strategy: string;
    description: string;
  }[];
  competitorAnalysis: Competitor[];
}
export interface TrendsState {
  data: TrendData[];
  loading: boolean;
  error: string | null;
}

// --- Keyword Intelligence ---
export interface KeywordMetrics {
  keyword: string;
  volume: string;
  difficulty: number;
  cpc: string;
}
export interface KeywordData extends CardBase {
    stackType: 'keywords';
    metrics: KeywordMetrics;
    longTailKeywords: KeywordMetrics[];
}
export interface KeywordsState {
    data: KeywordData[];
    loading: boolean;
    error: string | null;
}

// --- Marketplace Finder ---
export interface MarketplaceData extends CardBase {
    stackType: 'marketplaces';
    opportunityScore: number;
    reasoning: string;
    pros: string[];
    cons: string[];
}
export interface MarketplacesState {
    data: MarketplaceData[];
    loading: boolean;
    error: string | null;
}

// --- Content Strategy ---
export interface ContentData extends CardBase {
    stackType: 'content';
    format: string; // e.g., 'Blog Post', 'YouTube Video'
    talkingPoints: string[];
    seoKeywords: string[];
}
export interface ContentState {
    data: ContentData[];
    loading: boolean;
    error: string | null;
}

// --- NEW: Socials Analysis ---
export interface SocialsPlatformAnalysis {
    id: string;
    platform: string;
    postType: string;
    content: string;
    hashtags: string[];
    rationale: string;
}
export interface SocialsData extends CardBase {
    stackType: 'socials';
    platformAnalysis: SocialsPlatformAnalysis[];
}
export interface SocialsState {
    data: SocialsData[];
    loading: boolean;
    error: string | null;
    regeneratingPostId: string | null;
}

// --- NEW: Marketing Copy ---
export interface CopyData extends CardBase {
    stackType: 'copy';
    copyType: string; // e.g. 'Facebook Ad', 'Product Description'
    headlines: string[];
    body: string;
    callToAction: string;
}
export interface CopyState {
    data: CopyData[];
    loading: boolean;
    error: string | null;
}


// --- Q&A Oracle ---
export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}
export interface QnaState {
    messages: ChatMessage[];
    loading: boolean;
    error: string | null;
}

// --- Media Generation ---
export type MediaJobStatus = 'queued' | 'processing' | 'completed' | 'failed';
export interface MediaAsset {
    id: string;
    type: 'image' | 'video';
    url: string;
    prompt: string;
}
export interface MediaJob {
    jobId: string;
    status: MediaJobStatus;
    progress: number;
    asset?: MediaAsset;
    error?: string;
    prompt?: string;
    originatingCardId?: string; // Now optional
    stackType?: StackType; // Now optional
}
export interface MediaState {
    jobs: Record<string, MediaJob>;
}

// --- New Ventures ---
export interface VentureVision {
    id: string;
    title: string;
    oneLinePitch: string;
    businessModel: string;
    evidenceTag: string;
}

export interface VentureBlueprint {
    prophecyTitle: string;
    summary: string;
    targetAudience: string;
    marketingPlan: {
        contentPillars: string[];
        promotionChannels: string[];
        uniqueSellingProposition: string;
    };
    sourcingAndOperations: string;
    firstThreeSteps: string[];
}

export interface VenturesState {
    visions: VentureVision[];
    selectedVision: VentureVision | null;
    blueprint: VentureBlueprint | null;
    visionsLoading: boolean;
    blueprintLoading: boolean;
    visionsError: string | null;
    blueprintError: string | null;
    progress: {
        message: string;
        percentage: number;
    } | null;
}

// --- Sales Arbitrage ---
export interface ArbitrageData extends CardBase {
    stackType: 'arbitrage';
    platform: string;
    productStory: string;
    pricingStrategy: {
        buyLow: string;
        sellHigh: string;
        reasoning: string;
    };
    marketingAngles: {
        headline: string;
        body: string;
        platform: string;
    }[];
    tagsAndKeywords: string[];
    dueDiligence: string[];
}
export interface ArbitrageState {
    data: ArbitrageData[];
    loading: boolean;
    error: string | null;
    productQuery: string;
}

// --- Scenario Planner ---
export interface ScenarioData extends CardBase {
    stackType: 'scenarios';
    actionPlan: {
        step: number;
        title: string;
        description: string;
    }[];
    potentialRisks: string[];
    opportunities: string[];
    kpis: string[]; // Key Performance Indicators
}
export interface ScenariosState {
    data: ScenarioData[];
    loading: boolean;
    error: string | null;
    goalQuery: string;
}

// --- Comparative Analysis ---
export interface ComparativeReport {
    title: string;
    summary: string;
    similarities: string[];
    differences: string[];
    strategicImplications: string[];
}

export interface ComparisonState {
    selectedCards: CardBase[];
    report: ComparativeReport | null;
    loading: boolean;
    error: string | null;
}


// --- Auth ---
export interface AuthState {
  isAuthenticated: boolean;
  user: { email: string } | null;
  loading: boolean;
  error: string | null;
}

// --- Blog ---
export interface BlogPost extends ContentData {
  publishedAt: string; // ISO String
}
export interface BlogState {
  posts: BlogPost[];
  loading: boolean;
  error: string | null;
}

// --- API Status ---
export interface ApiStatusState {
  isAvailable: boolean;
  outageMessage: string | null;
}

// --- Root State ---
export interface RootState {
  oracleSession: OracleSessionState;
  trends: TrendsState;
  keywords: KeywordsState;
  marketplaces: MarketplacesState;
  content: ContentState;
  socials: SocialsState;
  copy: CopyState;
  qna: QnaState;
  media: MediaState;
  ventures: VenturesState;
  arbitrage: ArbitrageState;
  scenarios: ScenariosState;
  comparison: ComparisonState;
  auth: AuthState;
  blog: BlogState;
  apiStatus: ApiStatusState;
}
