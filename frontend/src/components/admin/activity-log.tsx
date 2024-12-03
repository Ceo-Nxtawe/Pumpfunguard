import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Shield, AlertTriangle, Ban, Brain } from 'lucide-react';

const mockLogs = [
  { id: 1, type: 'risk', message: 'High risk token detected: SafeMoon V2', timestamp: '2024-03-20T10:30:00Z' },
  { id: 2, type: 'wallet', message: 'Wallet banned for suspicious activity', timestamp: '2024-03-20T10:15:00Z' },
  { id: 3, type: 'ai', message: 'AI model retrained with new data', timestamp: '2024-03-20T09:45:00Z' },
  { id: 4, type: 'risk', message: 'New token analysis completed', timestamp: '2024-03-20T09:30:00Z' },
];

const getIcon = (type: string) => {
  switch (type) {
    case 'risk':
      return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    case 'wallet':
      return <Ban className="w-4 h-4 text-red-500" />;
    case 'ai':
      return <Brain className="w-4 h-4 text-blue-500" />;
    default:
      return <Shield className="w-4 h-4 text-green-500" />;
  }
};

export function ActivityLog() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Log</CardTitle>
        <CardDescription>
          Recent system activity and AI decisions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {mockLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50"
              >
                <div className="mt-1">{getIcon(log.type)}</div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm">{log.message}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(log.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}