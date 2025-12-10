import { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MEME_QUOTES } from '@/types/finance';

export function MemeHeader() {
  const [quote, setQuote] = useState('');
  const [isWiggling, setIsWiggling] = useState(false);

  const getRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * MEME_QUOTES.length);
    return MEME_QUOTES[randomIndex];
  };

  useEffect(() => {
    setQuote(getRandomQuote());
  }, []);

  const refreshQuote = () => {
    setIsWiggling(true);
    setQuote(getRandomQuote());
    setTimeout(() => setIsWiggling(false), 500);
  };

  return (
    <div className="text-center space-y-4">
      {/* Stonks Guy */}
      <div className="relative inline-block">
        <div className={`text-8xl ${isWiggling ? 'wiggle' : ''}`}>📈</div>
        <div className="absolute -bottom-2 -right-2 text-4xl animate-bounce">💰</div>
      </div>

      {/* Title */}
      <h1 className="stonks-text text-5xl sm:text-6xl text-primary">
        BUDGET BUSTER
      </h1>

      {/* Subtitle */}
      <p className="text-lg text-muted-foreground font-bold">
        Your Personal Finance Minister 🏛️
      </p>

      {/* Random Quote */}
      <div className="flex items-center justify-center gap-2">
        <p className="text-sm sm:text-base italic text-muted-foreground bg-muted/50 px-4 py-2 rounded-full max-w-md">
          "{quote}"
        </p>
        <Button
          variant="ghost"
          size="icon"
          onClick={refreshQuote}
          className="h-8 w-8 hover:rotate-180 transition-transform duration-300"
        >
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
