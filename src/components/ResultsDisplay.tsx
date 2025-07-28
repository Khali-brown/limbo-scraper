import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  FileText, 
  Sparkles, 
  Tags, 
  BarChart3, 
  Globe, 
  Copy, 
  ChevronDown, 
  ChevronUp,
  Eye,
  Calendar,
  User
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ScrapingResult {
  url: string;
  metadata?: {
    title?: string;
    description?: string;
    language?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    sourceURL?: string;
  };
  content: string;
  analysis?: {
    summary?: string;
    keywords?: string[];
    classification?: string;
    sentiment?: string;
  };
}

interface ResultsDisplayProps {
  result: ScrapingResult;
}

export const ResultsDisplay = ({ result }: ResultsDisplayProps) => {
  const { toast } = useToast();
  const [isExpanded, setIsExpanded] = useState(false);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${type} copied to clipboard`,
    });
  };

  const getSentimentColor = (sentiment?: string) => {
    switch (sentiment?.toLowerCase()) {
      case 'positive': return 'text-green-500';
      case 'negative': return 'text-red-500';
      default: return 'text-yellow-500';
    }
  };

  const getSentimentIcon = (sentiment?: string) => {
    switch (sentiment?.toLowerCase()) {
      case 'positive': return '😊';
      case 'negative': return '😟';
      default: return '😐';
    }
  };

  const formatUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname;
    } catch {
      return url;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header Card */}
      <Card className="bg-gradient-subtle border border-border/50">
        <CardHeader>
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Globe className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-xl mb-2 line-clamp-2">
                {result.metadata?.title || result.metadata?.ogTitle || 'Untitled Page'}
              </CardTitle>
              <CardDescription className="text-sm mb-3 line-clamp-2">
                {result.metadata?.description || result.metadata?.ogDescription || 'No description available'}
              </CardDescription>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Globe className="h-3 w-3" />
                  <span className="truncate max-w-xs">{formatUrl(result.url)}</span>
                </div>
                {result.metadata?.language && (
                  <div className="flex items-center gap-1">
                    <span>🌐</span>
                    <span>{result.metadata.language.toUpperCase()}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(result.url, 'URL')}
              className="flex-shrink-0"
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* AI Analysis Card */}
      {result.analysis && (
        <Card className="bg-card/50 backdrop-blur-sm border border-border/50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary animate-glow" />
              <CardTitle className="text-lg">AI Analysis</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Summary */}
            {result.analysis.summary && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Summary
                  </h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(result.analysis.summary!, 'Summary')}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
                <p className="text-sm leading-relaxed bg-muted/50 p-4 rounded-lg">
                  {result.analysis.summary}
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Keywords */}
              {result.analysis.keywords && result.analysis.keywords.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium flex items-center gap-2">
                    <Tags className="h-4 w-4" />
                    Keywords
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {result.analysis.keywords.map((keyword, index) => (
                      <Badge 
                        key={index} 
                        variant="secondary" 
                        className="text-xs bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer"
                        onClick={() => copyToClipboard(keyword, 'Keyword')}
                      >
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Classification */}
              {result.analysis.classification && (
                <div className="space-y-3">
                  <h4 className="font-medium flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Category
                  </h4>
                  <Badge variant="outline" className="bg-accent-blue/10 text-accent-blue border-accent-blue/20">
                    {result.analysis.classification}
                  </Badge>
                </div>
              )}

              {/* Sentiment */}
              {result.analysis.sentiment && (
                <div className="space-y-3">
                  <h4 className="font-medium flex items-center gap-2">
                    <span>😊</span>
                    Sentiment
                  </h4>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getSentimentIcon(result.analysis.sentiment)}</span>
                    <Badge 
                      variant="outline" 
                      className={`${getSentimentColor(result.analysis.sentiment)} border-current/20`}
                    >
                      {result.analysis.sentiment}
                    </Badge>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Content Card */}
      <Card className="bg-card/50 backdrop-blur-sm border border-border/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Scraped Content</CardTitle>
              <Badge variant="secondary" className="text-xs">
                {Math.round(result.content.length / 1000)}k chars
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(result.content, 'Content')}
              >
                <Copy className="h-3 w-3 mr-1" />
                Copy
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? (
                  <>
                    <ChevronUp className="h-3 w-3 mr-1" />
                    Collapse
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-3 w-3 mr-1" />
                    Expand
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className={`w-full rounded-lg bg-muted/50 p-4 ${isExpanded ? 'h-96' : 'h-48'}`}>
            <pre className="text-sm leading-relaxed whitespace-pre-wrap font-mono">
              {result.content}
            </pre>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};