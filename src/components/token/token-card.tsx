import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Token } from '@/types/token';
import { formatDistanceToNow } from 'date-fns';
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';
import { formatCurrency } from '@/lib/utils';
import { ExternalLink, TrendingUp, TrendingDown } from 'lucide-react';

interface TokenCardProps {
  token: Token;
}

export function TokenCard({ token }: TokenCardProps) {
  const getRiskColor = (score: number) => {
    if (score >= 70) return 'destructive';
    if (score >= 30) return 'warning';
    return 'success';
  };

  const data = token.priceHistory.map((price, index) => ({
    name: `Day ${index + 1}`,
    value: price,
  }));

  const priceChange = token.priceHistory[token.priceHistory.length - 1] - token.priceHistory[0];
  const priceChangePercent = (priceChange / token.priceHistory[0]) * 100;

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg hover:ring-2 hover:ring-violet-500/20 group">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <h3 className="font-semibold leading-none tracking-tight">{token.name}</h3>
            <a
              href={`https://solscan.io/token/${token.address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
          <p className="text-sm text-muted-foreground font-mono">
            {token.address.slice(0, 6)}...{token.address.slice(-4)}
          </p>
        </div>
        <Badge variant={getRiskColor(token.riskScore)} className="transition-transform group-hover:scale-110">
          Risk Score: {token.riskScore}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Market Cap</p>
              <p className="text-2xl font-bold">{formatCurrency(token.marketCap)}</p>
            </div>
            <div className="flex items-center space-x-1">
              {priceChange >= 0 ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
              <span className={priceChange >= 0 ? 'text-green-500' : 'text-red-500'}>
                {priceChangePercent.toFixed(2)}%
              </span>
            </div>
          </div>
          <div className="h-[100px] transition-transform group-hover:scale-105">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={false}
                />
                <Tooltip 
                  contentStyle={{ 
                    background: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '0.5rem'
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-muted-foreground">
            Last updated {formatDistanceToNow(new Date(token.lastUpdated))} ago
          </p>
        </div>
      </CardContent>
    </Card>
  );
}