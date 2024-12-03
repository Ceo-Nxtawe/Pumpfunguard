import { useTokens } from '@/context/token-context';
import { TokenCard } from './token-card';

export function TokenList() {
  const { tokens, loading } = useTokens();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {tokens.map((token) => (
        <TokenCard key={token.id} token={token} />
      ))}
    </div>
  );
}