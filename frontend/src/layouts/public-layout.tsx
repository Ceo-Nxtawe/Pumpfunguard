import { TokenList } from '@/components/token/token-list';
import { SearchBar } from '@/components/search-bar';
import { TokenStats } from '@/components/token/token-stats';
import { Button } from '@/components/ui/button';
import { useLocation } from '@/hooks/use-location';
import { Blocks, ArrowRight } from 'lucide-react';

export function PublicLayout() {
  const { navigate } = useLocation();

  const handleAdminClick = () => {
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-violet-600 to-blue-600 opacity-75 blur"></div>
                <Blocks className="relative h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-blue-500">
                  PumpFun Guard
                </h1>
                <p className="text-sm text-muted-foreground">AI-Powered Token Analysis</p>
              </div>
            </div>
            <Button 
              variant="secondary"
              className="relative group inline-flex items-center hover:text-primary transition-colors"
              onClick={handleAdminClick}
            >
              <span className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-violet-600 to-blue-600 opacity-0 group-hover:opacity-10 transition-opacity"></span>
              <span className="relative">Admin Dashboard</span>
              <ArrowRight className="relative ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <SearchBar />
          <TokenStats />
          <TokenList />
        </div>
      </main>
    </div>
  );
}