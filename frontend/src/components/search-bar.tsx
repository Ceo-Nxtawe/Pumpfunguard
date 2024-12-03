import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useTokens } from '@/context/token-context';
import { useState, useCallback, useEffect } from 'react';
import { debounce } from '@/lib/utils';

export function SearchBar() {
  const { searchTokens } = useTokens();
  const [query, setQuery] = useState('');

  const debouncedSearch = useCallback(
    debounce((value: string) => searchTokens(value), 300),
    [searchTokens]
  );

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel?.();
    };
  }, [debouncedSearch]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value);
  };

  return (
    <div className="relative max-w-2xl mx-auto">
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-violet-500 to-blue-500 opacity-30 blur-xl" />
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by token name or address..."
          value={query}
          onChange={handleSearch}
          className="pl-10 bg-background/80 backdrop-blur-sm transition-shadow focus:shadow-[0_0_0_1px] focus:shadow-violet-500"
        />
      </div>
    </div>
  );
}