import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Bookmark, Sparkles, Zap, Brain, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Bookmark className="h-8 w-8 text-primary" />
                <Sparkles className="h-4 w-4 text-primary-glow absolute -top-1 -right-1" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Smart Link Digest
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link to="/auth">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link to="/auth">
                <Button className="bg-gradient-primary hover:shadow-card-hover transition-all duration-300" size="sm">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="space-y-8">
            <div className="relative">
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-primary bg-clip-text text-transparent animate-float">
                Save. Summarize. 
                <br />
                <span className="text-foreground">Organize.</span>
              </h1>
              <div className="absolute -top-4 -right-4 text-primary-glow animate-pulse-glow">
                <Sparkles className="h-8 w-8" />
              </div>
            </div>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Your intelligent bookmark manager that automatically generates summaries using AI. 
              Never lose track of important links again.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/auth">
                <Button 
                  size="lg" 
                  className="bg-gradient-primary hover:shadow-floating transition-all duration-300 text-lg px-8 py-6"
                >
                  Start Saving Links
                  <Sparkles className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose Smart Link Digest?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powered by AI to make your bookmark collection smarter and more organized
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-gradient-card border-0 shadow-card hover:shadow-card-hover transition-all duration-300 group">
              <CardContent className="p-8 text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors">
                  <Brain className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">AI-Powered Summaries</h3>
                <p className="text-muted-foreground">
                  Automatically generate intelligent summaries for every link you save using advanced AI technology
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-card border-0 shadow-card hover:shadow-card-hover transition-all duration-300 group">
              <CardContent className="p-8 text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors">
                  <Zap className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Lightning Fast</h3>
                <p className="text-muted-foreground">
                  Save bookmarks instantly with automatic title extraction and favicon detection
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-card border-0 shadow-card hover:shadow-card-hover transition-all duration-300 group">
              <CardContent className="p-8 text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Secure & Private</h3>
                <p className="text-muted-foreground">
                  Your bookmarks are secured with authentication and remain completely private to you
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Bookmark className="h-6 w-6 text-primary" />
            <span className="text-lg font-semibold">Smart Link Digest</span>
          </div>
          <p className="text-muted-foreground">
            Built with AI to make your bookmarks smarter
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
