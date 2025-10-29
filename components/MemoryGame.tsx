
import React, { useState, useEffect } from 'react';

// Card Icons
const icons = [
  'apple', 'heart', 'star', 'plane', 'sun', 'moon', 'car', 'bell'
];

const IconComponent = ({ name, className }: { name: string, className?: string }) => {
  const iconMap: { [key: string]: React.ReactNode } = {
    apple: <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-12 w-12 text-white"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 11c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 11c-2.38 0-4.47.88-6 2.34a1 1 0 00-.33 1.4l.01.01c.2.27.53.38.85.25A9.94 9.94 0 0112 14c2.2 0 4.2.7 5.88 1.86.32.13.65.02.85-.25l.01-.01a1 1 0 00-.33-1.4C16.47 11.88 14.38 11 12 11z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 9a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V9z" />
    </svg>,
    heart: <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-12 w-12 text-white"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z" />
    </svg>,
    star: <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-12 w-12 text-white"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.175 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>,
    plane: <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-12 w-12 text-white"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>,
    sun: <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-12 w-12 text-white"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>,
    moon: <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-12 w-12 text-white"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>,
    car: <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-12 w-12 text-white"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-8H3l4 8h10zm-6 4a2 2 0 100-4 2 2 0 000 4zM5 20a2 2 0 100-4 2 2 0 000 4z" />
    </svg>,
    bell: <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-12 w-12 text-white"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>,
  };
  return iconMap[name];
}

interface Card {
  id: number;
  icon: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const generateCards = (): Card[] => {
  const cardIcons = [...icons, ...icons];
  const shuffledIcons = cardIcons.sort(() => Math.random() - 0.5);
  return shuffledIcons.map((icon, index) => ({
    id: index,
    icon: icon,
    isFlipped: false,
    isMatched: false,
  }));
};

const MemoryGame: React.FC = () => {
  const [cards, setCards] = useState<Card[]>(generateCards());
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [isWon, setIsWon] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    const allMatched = cards.every(card => card.isMatched);
    if (allMatched && cards.length > 0) {
        setTimeout(() => setIsWon(true), 500);
    }
  }, [cards]);
  
  const handleCardClick = (clickedCardId: number) => {
    if (isChecking || flippedCards.includes(clickedCardId) || cards[clickedCardId].isMatched) return;

    const newFlippedCards = [...flippedCards, clickedCardId];
    
    // Flip the card immediately
    setCards(currentCards => currentCards.map(c => c.id === clickedCardId ? {...c, isFlipped: true} : c));

    if (newFlippedCards.length === 2) {
      setIsChecking(true);
      setMoves(moves + 1);
      const [firstCardId, secondCardId] = newFlippedCards;
      const firstCard = cards[firstCardId];
      const secondCard = cards[secondCardId];

      if (firstCard.icon === secondCard.icon) {
        // Match
        setCards(prevCards =>
          prevCards.map(card =>
            card.id === firstCardId || card.id === secondCardId ? { ...card, isMatched: true } : card
          )
        );
        setIsChecking(false);
      } else {
        // No match
        setTimeout(() => {
          setCards(prevCards =>
            prevCards.map(card =>
              card.id === firstCardId || card.id === secondCardId ? { ...card, isFlipped: false } : card
            )
          );
          setIsChecking(false);
        }, 1200);
      }
      setFlippedCards([]);
    } else {
      setFlippedCards(newFlippedCards);
    }
  };

  const startNewGame = () => {
    setCards(generateCards());
    setFlippedCards([]);
    setMoves(0);
    setIsWon(false);
    setIsChecking(false);
  };

  return (
    <div className="p-4 md:p-6 text-center">
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Memory Game</h2>
        <p className="text-gray-600 mt-2">Find all the matching pairs!</p>
      </div>

      <div className="flex justify-between items-center mb-6 px-2">
        <span className="text-lg font-medium text-gray-700">Moves: {moves}</span>
        <button
          onClick={startNewGame}
          className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          New Game
        </button>
      </div>
      
      {isWon ? (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-6 rounded-lg shadow-md text-center">
            <h3 className="text-2xl font-bold">Congratulations!</h3>
            <p className="mt-2 text-lg">You found all the matches in {moves} moves.</p>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-4">
            {cards.map(card => (
            <div key={card.id} className="aspect-square [perspective:1000px]" onClick={() => handleCardClick(card.id)}>
                <div className={`w-full h-full rounded-lg shadow-md transform transition-transform duration-500 cursor-pointer [transform-style:preserve-3d] ${card.isFlipped ? '[transform:rotateY(180deg)]' : ''}`}>
                    {/* Card Back */}
                    <div className="absolute w-full h-full bg-blue-500 rounded-lg flex items-center justify-center [backface-visibility:hidden]">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-100" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.546-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    {/* Card Front */}
                    <div className={`absolute w-full h-full rounded-lg flex items-center justify-center [transform:rotateY(180deg)] [backface-visibility:hidden] ${card.isMatched ? 'bg-green-500' : 'bg-blue-700'}`}>
                        <IconComponent name={card.icon} />
                    </div>
                </div>
            </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default MemoryGame;
