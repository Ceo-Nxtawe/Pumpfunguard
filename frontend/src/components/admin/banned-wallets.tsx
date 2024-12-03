import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Ban, Plus, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { banWallet, unbanWallet, getBannedWallets } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface BannedWallet {
  wallet: string;
  banned_at: string;
}

export function BannedWallets() {
  const [newWallet, setNewWallet] = useState('');
  const [wallets, setWallets] = useState<BannedWallet[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadWallets();
  }, []);

  const loadWallets = async () => {
    try {
      const data = await getBannedWallets();
      setWallets(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load banned wallets',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddWallet = async () => {
    if (!newWallet) return;

    try {
      await banWallet(newWallet);
      toast({
        title: 'Success',
        description: 'Wallet has been banned',
      });
      loadWallets();
      setNewWallet('');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to ban wallet',
        variant: 'destructive',
      });
    }
  };

  const handleRemoveWallet = async (wallet: string) => {
    try {
      await unbanWallet(wallet);
      toast({
        title: 'Success',
        description: 'Wallet has been unbanned',
      });
      loadWallets();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to unban wallet',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Banned Wallets</CardTitle>
        <CardDescription>
          Manage wallets that have been flagged for suspicious activity
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-2">
          <Input
            placeholder="Enter wallet address..."
            value={newWallet}
            onChange={(e) => setNewWallet(e.target.value)}
          />
          <Button onClick={handleAddWallet}>
            <Plus className="w-4 h-4 mr-2" />
            Add Wallet
          </Button>
        </div>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Wallet Address</TableHead>
              <TableHead>Ban Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {wallets.map((wallet) => (
              <TableRow key={wallet.wallet}>
                <TableCell className="font-mono">{wallet.wallet}</TableCell>
                <TableCell>{new Date(wallet.banned_at).toLocaleString()}</TableCell>
                <TableCell>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-destructive"
                    onClick={() => handleRemoveWallet(wallet.wallet)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}