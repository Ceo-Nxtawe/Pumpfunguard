import { AdminHeader } from './admin-header';
import { useLocation } from '@/hooks/use-location';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TokenManagement } from '@/components/admin/token-management';
import { AISettings } from '@/components/admin/ai-settings';
import { BannedWallets } from '@/components/admin/banned-wallets';
import { ActivityLog } from '@/components/admin/activity-log';
import { BackgroundGradient } from '@/components/ui/background-gradient';

export function AdminLayout() {
  const { navigate } = useLocation();

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      <BackgroundGradient />
      <AdminHeader onNavigateBack={() => navigate('/')} />
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="tokens" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 h-12">
            <TabsTrigger value="tokens">Token Management</TabsTrigger>
            <TabsTrigger value="ai">AI Settings</TabsTrigger>
            <TabsTrigger value="wallets">Banned Wallets</TabsTrigger>
            <TabsTrigger value="logs">Activity Logs</TabsTrigger>
          </TabsList>
          <TabsContent value="tokens" className="space-y-4">
            <TokenManagement />
          </TabsContent>
          <TabsContent value="ai" className="space-y-4">
            <AISettings />
          </TabsContent>
          <TabsContent value="wallets" className="space-y-4">
            <BannedWallets />
          </TabsContent>
          <TabsContent value="logs" className="space-y-4">
            <ActivityLog />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}