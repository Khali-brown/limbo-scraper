import { useState } from 'react';
import { ApiKeyManager } from './ApiKeyManager';
import { ScrapingForm } from './ScrapingForm';
import { ResultsDisplay } from './ResultsDisplay';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Globe, BarChart3 } from 'lucide-react';

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

export const WebScrapingApp = () => {
  const [results, setResults] = useState<ScrapingResult[]>([]);
  const [activeTab, setActiveTab] = useState('scraper');

  const handleNewResult = (result: ScrapingResult) => {
    setResults(prev => [result, ...prev]);
    setActiveTab('results');
  };

  const clearResults = () => {
    setResults([]);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center shadow-glow">
                <Globe className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  Limbo Scrape
                </h1>
                <p className="text-sm text-muted-foreground">
                  AI-powered web scraping and content analysis
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {results.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearResults}
                  className="text-xs"
                >
                  Clear Results
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="grid w-full max-w-md grid-cols-3 bg-card/50 backdrop-blur-sm">
              <TabsTrigger value="scraper" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <span className="hidden sm:inline">Scraper</span>
              </TabsTrigger>
              <TabsTrigger value="results" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Results</span>
                {results.length > 0 && (
                  <span className="ml-1 text-xs bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full">
                    {results.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Settings</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="scraper" className="space-y-6">
            <ScrapingForm onResult={handleNewResult} />
          </TabsContent>

          <TabsContent value="results" className="space-y-6">
            {results.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/50 flex items-center justify-center">
                  <BarChart3 className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">No results yet</h3>
                <p className="text-muted-foreground mb-4">
                  Scrape your first website to see results here
                </p>
                <Button
                  onClick={() => setActiveTab('scraper')}
                  className="bg-gradient-primary hover:shadow-glow"
                >
                  <Globe className="h-4 w-4 mr-2" />
                  Start Scraping
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {results.map((result, index) => (
                  <ResultsDisplay key={index} result={result} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <ApiKeyManager />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/30 backdrop-blur-sm mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <span>Built with Firecrawl + AI</span>
              <span>•</span>
              <span>Livingston Segbedzi</span>
              <span>•</span>
              <span>© 2025</span>
            </div>
            <div className="flex items-center gap-4">
              <a href="https://firecrawl.dev" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                Firecrawl
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};