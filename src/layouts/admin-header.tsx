import { Button } from '@/components/ui/button';
import { Shield } from 'lucide-react';

interface AdminHeaderProps {
  onNavigateBack: () => void;
}

export function AdminHeader({ onNavigateBack }: AdminHeaderProps) {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Shield className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        </div>
        <Button variant="outline" onClick={onNavigateBack}>
          Back to Public View
        </Button>
      </div>
    </header>
  );
}