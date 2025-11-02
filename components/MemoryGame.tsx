import React, { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';

// Card Icons
const icons = [
  'apple', 'heart', 'star', 'plane', 'sun', 'moon', 'car', 'bell'
];

// Icon data remains the same, as it's a map of SVG components.
const IconComponent = ({ name, className }: { name: string, className?: string }) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      apple: <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-12 w-12 text-white"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 11c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 11c-2.38 0-4.47.88-6 2.34a1 1 0 00-.33 1.4l.01.01c.2.27.53.38.85.25A9.94 9.94 0 0112 14c2.2 0 4.2.7 5.88 1.86.32.13.65.02.85-.25l.01-.01a1 1 0 00-.33-1.4C16.47 11.88 14.38 11 12 11z" /><path strokeLinecap="round" strokeLinejoin="round" d="M4 9a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V9z" /></svg>,
      heart: <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-12 w-12 text-white"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z" /></svg>,
      star: <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-12 w-12 text-white"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.175 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>,
      plane: <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-12 w-12 text-white"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>,
      sun: <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-12 w-12 text-white"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
      moon: <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-12 w-12 text-white"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>,
      car: <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-12 w-12 text-white"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-8H3l4 8h10zm-6 4a2 2 0 100-4 2 2 0 000 4zM5 20a2 2 0 100-4 2 2 0 000 4z" /></svg>,
      bell: <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-12 w-12 text-white"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>,
    };
    return iconMap[name];
}

interface Card {
  id: number;
  icon: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const Container = styled.div`
  padding: 1.5rem;
  text-align: center;
`;

const GameHeader = styled.div`
  background-color: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  margin-bottom: 1.5rem;
`;

const GameTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
`;

const GameDescription = styled.p`
  color: #4b5563;
  margin-top: 0.5rem;
`;

const Controls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding: 0 0.5rem;
`;

const Moves = styled.span`
  font-size: 1.125rem;
  font-weight: 500;
  color: #374151;
`;

const NewGameButton = styled.button`
  padding: 0.5rem 1.5rem;
  background-color: #2563eb;
  color: white;
  font-weight: 600;
  border-radius: 0.375rem;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #1d4ed8;
  }
`;

const GameGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
`;

const CardContainer = styled.div`
  aspect-ratio: 1 / 1;
  perspective: 1000px;
`;

const CardInner = styled.div<{
  isFlipped: boolean
}>`
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.6s;
  transform-style: preserve-3d;
  cursor: pointer;
  ${({ isFlipped }) => isFlipped && `transform: rotateY(180deg);`}
`;

const CardFace = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const CardBack = styled(CardFace)`
  background-color: #3b82f6;
`;

const CardFront = styled(CardFace)<{
  isMatched: boolean
}>`
  background-color: ${({ isMatched }) => (isMatched ? '#10b981' : '#1d4ed8')};
  transform: rotateY(180deg);
`;

const WinScreen = styled.div`
    background-color: #dcfce7;
    border-left: 4px solid #22c55e;
    color: #166534;
    padding: 1.5rem;
    border-radius: 0.5rem;
    text-align: center;
`;

const WinTitle = styled.h3`
    font-size: 1.75rem;
    font-weight: bold;
`;

const WinMessage = styled.p`
    margin-top: 0.5rem;
    font-size: 1.125rem;
`;

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
        setCards(currentCards => currentCards.map(c => c.id === clickedCardId ? { ...c, isFlipped: true } : c));

        if (newFlippedCards.length === 2) {
            setIsChecking(true);
            setMoves(moves + 1);
            const [firstCardId, secondCardId] = newFlippedCards;
            const firstCard = cards[firstCardId];
            const secondCard = cards[secondCardId];

            if (firstCard.icon === secondCard.icon) {
                setCards(prevCards => prevCards.map(card =>
                    card.id === firstCardId || card.id === secondCardId ? { ...card, isMatched: true } : card
                ));
                setIsChecking(false);
            } else {
                setTimeout(() => {
                    setCards(prevCards => prevCards.map(card =>
                        card.id === firstCardId || card.id === secondCardId ? { ...card, isFlipped: false } : card
                    ));
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
        <Container>
            <GameHeader>
                <GameTitle>Memory Game</GameTitle>
                <GameDescription>Find all the matching pairs!</GameDescription>
            </GameHeader>

            <Controls>
                <Moves>Moves: {moves}</Moves>
                <NewGameButton onClick={startNewGame}>New Game</NewGameButton>
            </Controls>

            {isWon ? (
                <WinScreen>
                    <WinTitle>Congratulations!</WinTitle>
                    <WinMessage>You found all the matches in {moves} moves.</WinMessage>
                </WinScreen>
            ) : (
                <GameGrid>
                    {cards.map(card => (
                        <CardContainer key={card.id} onClick={() => handleCardClick(card.id)}>
                            <CardInner isFlipped={card.isFlipped}>
                                <CardBack>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-100" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.546-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                </CardBack>
                                <CardFront isMatched={card.isMatched}>
                                    <IconComponent name={card.icon} />
                                </CardFront>
                            </CardInner>
                        </CardContainer>
                    ))}
                </GameGrid>
            )}
        </Container>
    );
};

export default MemoryGame;
