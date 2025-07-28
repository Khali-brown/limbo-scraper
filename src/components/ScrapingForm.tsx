import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Globe, Sparkles, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { FirecrawlService } from '@/services/FirecrawlService';
import { AIService } from '@/services/AIService';

interface ScrapingResult {
  url: string;
  metadata?: {
    title?: string;
    description?: string;
    language?: string;
  };
  content: string;
  analysis?: {
    summary?: string;
    keywords?: string[];
    classification?: string;
    sentiment?: string;
  };
}

interface ScrapingFormProps {
  onResult: (result: ScrapingResult) => void;
}

export const ScrapingForm = ({ onResult }: ScrapingFormProps) => {
  const { toast } = useToast();
  const [url, setUrl] = useState('');
  const [aiProvider, setAiProvider] = useState<'openai' | 'perplexity'>('openai');
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');

  const hasFirecrawlKey = !!FirecrawlService.getApiKey();
  const hasOpenAIKey = !!AIService.getOpenAIKey();
  const hasPerplexityKey = !!AIService.getPerplexityKey();
  const hasAIKey = aiProvider === 'openai' ? hasOpenAIKey : hasPerplexityKey;

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!hasFirecrawlKey) {
      toast({
        title: "API Key Required",
        description: "Please configure your Firecrawl API key first",
        variant: "destructive",
      });
      return;
    }

    if (!validateUrl(url)) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL including http:// or https://",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setProgress(0);
    setCurrentStep('Initializing...');

    try {
      // Step 1: Scrape the website
      setCurrentStep('Scraping website content...');
      setProgress(25);
      
      const scrapeResult = await FirecrawlService.scrapeUrl(url);
      
      console.log('scrapeResult:', scrapeResult);
      
      if (!scrapeResult.success) {
        throw new Error(scrapeResult.error || 'Failed to scrape website');
      }

      setProgress(50);
      setCurrentStep('Processing content...');

      const content = scrapeResult.data?.markdown || scrapeResult.data?.html || JSON.stringify(scrapeResult.data || {});
      
      if (!content.trim() || content === '{}') {
        console.log('Scrape result data:', scrapeResult.data);
        throw new Error('No content found on the webpage');
      }

      let analysis = undefined;

      // Step 2: AI Analysis (if API key available)
      if (hasAIKey && content.length > 50) {
        setCurrentStep(`Analyzing content with ${aiProvider === 'openai' ? 'OpenAI' : 'Perplexity'}...`);
        setProgress(75);

        const aiResult = await AIService.analyzeContent(content, aiProvider);
        
        if (aiResult.success && aiResult.data) {
          analysis = aiResult.data;
        } else {
          console.warn('AI analysis failed:', aiResult.error);
        }
      }

      setProgress(100);
      setCurrentStep('Complete!');

      const result: ScrapingResult = {
        url,
        metadata: scrapeResult.data?.metadata,
        content,
        analysis
      };

      onResult(result);

      toast({
        title: "Success!",
        description: `Successfully scraped and analyzed ${scrapeResult.data?.metadata?.title || url}`,
      });

      setUrl('');

    } catch (error) {
      console.error('Error during scraping/analysis:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setProgress(0);
      setCurrentStep('');
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto bg-card/50 backdrop-blur-sm border border-border/50">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Globe className="h-6 w-6 text-primary animate-float" />
          <CardTitle className="text-xl bg-gradient-primary bg-clip-text text-transparent">
            Web Content Analyzer
          </CardTitle>
        </div>
        <CardDescription>
          Enter a URL to scrape content and get AI-powered insights
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* URL Input */}
          <div className="space-y-2">
            <Label htmlFor="url" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Website URL
            </Label>
            <Input
              id="url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              required
            />
          </div>

          {/* AI Provider Selection */}
          <div className="space-y-2">
            <Label htmlFor="ai-provider" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              AI Analysis Provider
            </Label>
            <Select value={aiProvider} onValueChange={(value: 'openai' | 'perplexity') => setAiProvider(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="openai" disabled={!hasOpenAIKey}>
                  <div className="flex items-center gap-2">
                    <span>OpenAI</span>
                    {hasOpenAIKey ? (
                      <CheckCircle2 className="h-3 w-3 text-primary" />
                    ) : (
                      <AlertTriangle className="h-3 w-3 text-muted-foreground" />
                    )}
                  </div>
                </SelectItem>
                <SelectItem value="perplexity" disabled={!hasPerplexityKey}>
                  <div className="flex items-center gap-2">
                    <span>Perplexity</span>
                    {hasPerplexityKey ? (
                      <CheckCircle2 className="h-3 w-3 text-primary" />
                    ) : (
                      <AlertTriangle className="h-3 w-3 text-muted-foreground" />
                    )}
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            {!hasAIKey && (
              <p className="text-xs text-muted-foreground">
                AI analysis will be skipped without an API key
              </p>
            )}
          </div>

          {/* Progress Bar */}
          {isLoading && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-3 w-3 animate-spin" />
                <span>{currentStep}</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading || !hasFirecrawlKey}
            className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300"
          >
            {isLoading ? (
              <>
                <Clock className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Analyze Website
              </>
            )}
          </Button>

          {/* Status Badges */}
          <div className="flex flex-wrap gap-2 justify-center">
            <Badge variant={hasFirecrawlKey ? "default" : "destructive"} className="text-xs">
              {hasFirecrawlKey ? "✓ Scraping Ready" : "✗ Scraping Disabled"}
            </Badge>
            <Badge variant={hasAIKey ? "default" : "secondary"} className="text-xs">
              {hasAIKey ? "✓ AI Analysis Ready" : "○ AI Analysis Optional"}
            </Badge>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};