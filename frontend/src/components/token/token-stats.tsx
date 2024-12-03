import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockAnalytics } from '@/lib/mock-data';
import { Shield, AlertTriangle, AlertCircle } from 'lucide-react';
import { StatCard } from './stat-card';

export function TokenStats() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <StatCard
        title="Low Risk Tokens"
        value={mockAnalytics.lowRiskCount}
        total={mockAnalytics.totalScanned}
        icon={<Shield className="h-4 w-4 text-green-500" />}
      />
      <StatCard
        title="Medium Risk Tokens"
        value={mockAnalytics.mediumRiskCount}
        total={mockAnalytics.totalScanned}
        icon={<AlertTriangle className="h-4 w-4 text-yellow-500" />}
      />
      <StatCard
        title="High Risk Tokens"
        value={mockAnalytics.highRiskCount}
        total={mockAnalytics.totalScanned}
        icon={<AlertCircle className="h-4 w-4 text-red-500" />}
      />
    </div>
  );
}