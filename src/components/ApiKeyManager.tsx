import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle2, Key, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { FirecrawlService } from '@/services/FirecrawlService';
import { AIService } from '@/services/AIService';

export const ApiKeyManager = () => {
  const { toast } = useToast();
  const [firecrawlKey, setFirecrawlKey] = useState('');
  const [openaiKey, setOpenaiKey] = useState('');
  const [perplexityKey, setPerplexityKey] = useState('');
  const [isTestingFirecrawl, setIsTestingFirecrawl] = useState(false);

  const hasFirecrawlKey = !!FirecrawlService.getApiKey();
  const hasOpenAIKey = !!AIService.getOpenAIKey();
  const hasPerplexityKey = !!AIService.getPerplexityKey();

  const handleSaveFirecrawl = async () => {
    if (!firecrawlKey.trim()) return;
    
    setIsTestingFirecrawl(true);
    const isValid = await FirecrawlService.testApiKey(firecrawlKey);
    
    if (isValid) {
      FirecrawlService.saveApiKey(firecrawlKey);
      setFirecrawlKey('');
      toast({
        title: "Success",
        description: "Firecrawl API key saved and verified",
      });
    } else {
      toast({
        title: "Invalid API Key",
        description: "Please check your Firecrawl API key",
        variant: "destructive",
      });
    }
    setIsTestingFirecrawl(false);
  };

  const handleSaveOpenAI = () => {
    if (!openaiKey.trim()) return;
    
    AIService.saveOpenAIKey(openaiKey);
    setOpenaiKey('');
    toast({
      title: "Success",
      description: "OpenAI API key saved",
    });
  };

  const handleSavePerplexity = () => {
    if (!perplexityKey.trim()) return;
    
    AIService.savePerplexityKey(perplexityKey);
    setPerplexityKey('');
    toast({
      title: "Success", 
      description: "Perplexity API key saved",
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto bg-card/50 backdrop-blur-sm border border-border/50">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Settings className="h-6 w-6 text-primary" />
          <CardTitle className="text-xl">API Configuration</CardTitle>
        </div>
        <CardDescription>
          Configure your API keys to enable web scraping and AI analysis features.
          <br />
          {/* <span className="text-xs text-muted-foreground mt-2 block">
            💡 For production apps, we recommend using Supabase for secure API key management
          </span> */}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Firecrawl API Key */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Key className="h-4 w-4 text-primary" />
              <Label htmlFor="firecrawl-key" className="font-medium">Firecrawl API Key</Label>
            </div>
            {hasFirecrawlKey && (
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Configured
              </Badge>
            )}
          </div>
          <div className="flex gap-2">
            <Input
              id="firecrawl-key"
              type="password"
              placeholder="Enter your Firecrawl API key"
              value={firecrawlKey}
              onChange={(e) => setFirecrawlKey(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={handleSaveFirecrawl}
              disabled={!firecrawlKey.trim() || isTestingFirecrawl}
              className="bg-primary hover:bg-primary/90"
            >
              {isTestingFirecrawl ? 'Testing...' : 'Save'}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Get your API key at <a href="https://firecrawl.dev" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">firecrawl.dev</a>
          </p>
        </div>

        {/* OpenAI API Key */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Key className="h-4 w-4 text-accent-blue" />
              <Label htmlFor="openai-key" className="font-medium">OpenAI API Key</Label>
            </div>
            {hasOpenAIKey && (
              <Badge variant="secondary" className="bg-accent-blue/10 text-accent-blue">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Configured
              </Badge>
            )}
          </div>
          <div className="flex gap-2">
            <Input
              id="openai-key"
              type="password"
              placeholder="Enter your OpenAI API key"
              value={openaiKey}
              onChange={(e) => setOpenaiKey(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={handleSaveOpenAI}
              disabled={!openaiKey.trim()}
              variant="outline"
              className="border-accent-blue/20 hover:bg-accent-blue/10"
            >
              Save
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Get your API key at <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-accent-blue hover:underline">platform.openai.com</a>
          </p>
        </div>

        {/* Perplexity API Key */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Key className="h-4 w-4 text-accent-purple" />
              <Label htmlFor="perplexity-key" className="font-medium">Perplexity API Key (Optional)</Label>
            </div>
            {hasPerplexityKey && (
              <Badge variant="secondary" className="bg-accent-purple/10 text-accent-purple">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Configured
              </Badge>
            )}
          </div>
          <div className="flex gap-2">
            <Input
              id="perplexity-key"
              type="password"
              placeholder="Enter your Perplexity API key"
              value={perplexityKey}
              onChange={(e) => setPerplexityKey(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={handleSavePerplexity}
              disabled={!perplexityKey.trim()}
              variant="outline"
              className="border-accent-purple/20 hover:bg-accent-purple/10"
            >
              Save
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Get your API key at <a href="https://perplexity.ai" target="_blank" rel="noopener noreferrer" className="text-accent-purple hover:underline">perplexity.ai</a>
          </p>
        </div>

        {!hasFirecrawlKey && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
            <AlertCircle className="h-4 w-4 text-destructive" />
            <p className="text-sm text-destructive">
              Firecrawl API key is required for web scraping functionality
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};