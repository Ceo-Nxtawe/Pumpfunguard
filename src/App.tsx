import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { PublicLayout } from '@/layouts/public-layout';
import { AdminLayout } from '@/layouts/admin-layout';
import { TokenProvider } from '@/context/token-context';
import { useLocation } from '@/hooks/use-location';
import { WebSocketProvider } from '@/context/websocket-context';

function App() {
  const { isAdmin } = useLocation();

  return (
    <ThemeProvider defaultTheme="dark" storageKey="pumpfun-theme">
      <TokenProvider>
        <WebSocketProvider>
          <div className="min-h-screen bg-background">
            {isAdmin ? <AdminLayout /> : <PublicLayout />}
            <Toaster position="top-right" />
          </div>
        </WebSocketProvider>
      </TokenProvider>
    </ThemeProvider>
  );
}

export default App;