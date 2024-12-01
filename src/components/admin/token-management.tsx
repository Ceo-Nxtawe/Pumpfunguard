import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTokens } from '@/context/token-context';
import { formatCurrency } from '@/lib/utils';
import { Shield, AlertTriangle, AlertCircle, Plus } from 'lucide-react';
import { useState } from 'react';
import { analyzeToken } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

export function TokenManagement() {
  const { tokens } = useTokens();
  const [newTokenAddress, setNewTokenAddress] = useState('');
  const { toast } = useToast();

  const getRiskBadge = (score: number) => {
    if (score >= 70) {
      return <Badge variant="destructive"><AlertCircle className="w-3 h-3 mr-1" /> High Risk</Badge>;
    }
    if (score >= 30) {
      return <Badge variant="warning"><AlertTriangle className="w-3 h-3 mr-1" /> Medium Risk</Badge>;
    }
    return <Badge variant="success"><Shield className="w-3 h-3 mr-1" /> Low Risk</Badge>;
  };

  const handleAnalyzeToken = async () => {
    if (!newTokenAddress) return;

    try {
      const result = await analyzeToken(newTokenAddress);
      toast({
        title: 'Success',
        description: `Token analyzed with risk score: ${result.risk_score}`,
      });
      setNewTokenAddress('');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to analyze token',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Token Analysis</CardTitle>
        <CardDescription>
          Analyze and monitor tokens with AI-powered risk assessment
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex space-x-2">
          <Input
            placeholder="Enter token address to analyze..."
            value={newTokenAddress}
            onChange={(e) => setNewTokenAddress(e.target.value)}
          />
          <Button onClick={handleAnalyzeToken}>
            <Plus className="w-4 h-4 mr-2" />
            Analyze Token
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Token Name</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Market Cap</TableHead>
              <TableHead>Risk Assessment</TableHead>
              <TableHead>Last Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tokens.map((token) => (
              <TableRow key={token.id}>
                <TableCell className="font-medium">{token.name}</TableCell>
                <TableCell className="font-mono text-sm">
                  {token.address.slice(0, 6)}...{token.address.slice(-4)}
                </TableCell>
                <TableCell>{formatCurrency(token.marketCap)}</TableCell>
                <TableCell>{getRiskBadge(token.riskScore)}</TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(token.lastUpdated).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}