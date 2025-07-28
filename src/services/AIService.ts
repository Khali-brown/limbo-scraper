interface AIResponse {
  success: boolean;
  data?: {
    summary?: string;
    keywords?: string[];
    classification?: string;
    sentiment?: string;
  };
  error?: string;
}

export class AIService {
  private static OPENAI_API_KEY_STORAGE_KEY = 'openai_api_key';
  private static PERPLEXITY_API_KEY_STORAGE_KEY = 'perplexity_api_key';

  static saveOpenAIKey(apiKey: string): void {
    localStorage.setItem(this.OPENAI_API_KEY_STORAGE_KEY, apiKey);
    console.log('OpenAI API key saved successfully');
  }

  static savePerplexityKey(apiKey: string): void {
    localStorage.setItem(this.PERPLEXITY_API_KEY_STORAGE_KEY, apiKey);
    console.log('Perplexity API key saved successfully');
  }

  static getOpenAIKey(): string | null {
    return localStorage.getItem(this.OPENAI_API_KEY_STORAGE_KEY);
  }

  static getPerplexityKey(): string | null {
    return localStorage.getItem(this.PERPLEXITY_API_KEY_STORAGE_KEY);
  }

  static async analyzeContent(content: string, provider: 'openai' | 'perplexity' = 'openai'): Promise<AIResponse> {
    if (provider === 'openai') {
      return this.analyzeWithOpenAI(content);
    } else {
      return this.analyzeWithPerplexity(content);
    }
  }

  private static async analyzeWithOpenAI(content: string): Promise<AIResponse> {
    const apiKey = this.getOpenAIKey();
    if (!apiKey) {
      return { success: false, error: 'OpenAI API key not found' };
    }

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "tngtech/deepseek-r1t2-chimera:free",
          messages: [
            {
              role: 'system',
              content: `You are an expert content analyzer. Analyze the provided content and return a JSON response with:
              - summary: A concise 2-3 sentence summary
              - keywords: Array of 5-8 relevant keywords
              - classification: Content category (news, blog, product, service, educational, etc.)
              - sentiment: Overall sentiment (positive, negative, neutral)
              
              Return only valid JSON, with no markdown, no code blocks, and no explanation.`
            },
            {
              role: 'user',
              content: `Analyze this content:\n\n${content.substring(0, 4000)}`
            }
          ],
          temperature: 0.3,
          max_tokens: 500,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      const result = await response.json();
      const llmOutput = result.choices[0].message.content;
      console.log('LLM output:', llmOutput);
    
      const analysis = JSON.parse(llmOutput);

      return {
        success: true,
        data: analysis
      };
    } catch (error) {
      console.error('Error analyzing content with OpenAI:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to analyze content'
      };
    }
  }

  private static async analyzeWithPerplexity(content: string): Promise<AIResponse> {
    const apiKey = this.getPerplexityKey();
    if (!apiKey) {
      return { success: false, error: 'Perplexity API key not found' };
    }

    try {
      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-sonar-small-128k-online',
          messages: [
            {
              role: 'system',
              content: `You are an expert content analyzer. Analyze the provided content and return a JSON response with:
              - summary: A concise 2-3 sentence summary
              - keywords: Array of 5-8 relevant keywords  
              - classification: Content category (news, blog, product, service, educational, etc.)
              - sentiment: Overall sentiment (positive, negative, neutral)
              
              Return only valid JSON without any markdown formatting.`
            },
            {
              role: 'user',
              content: `Analyze this content:\n\n${content.substring(0, 4000)}`
            }
          ],
          temperature: 0.2,
          max_tokens: 500,
        }),
      });

      if (!response.ok) {
        throw new Error(`Perplexity API error: ${response.statusText}`);
      }

      const result = await response.json();
      const analysis = JSON.parse(result.choices[0].message.content);

      return {
        success: true,
        data: analysis
      };
    } catch (error) {
      console.error('Error analyzing content with Perplexity:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to analyze content'
      };
    }
  }
}