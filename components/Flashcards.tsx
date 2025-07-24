import React, { useState, useRef } from 'react';

interface FlashcardData {
  id: number;
  question: string;
  answer: string;
  cardNumber: number;
  totalCards: number;
}

interface FlashcardsProps {
  initialData?: FlashcardData;
  onGoBack?: () => void;
  onMarkCorrect?: (cardId: number) => void;
  onMarkWrong?: (cardId: number) => void;
  onNextCard?: () => void;
  onPreviousCard?: () => void;
  onSpeak?: (text: string) => void;
}

const Flashcards: React.FC<FlashcardsProps> = ({
  initialData = {
    id: 1,
    question: "CZEŚĆ!!!",
    answer: "HELLO!",
    cardNumber: 2,
    totalCards: 43
  },
  onGoBack,
  onMarkCorrect,
  onMarkWrong,
  onNextCard,
  onPreviousCard,
  onSpeak
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [currentCard] = useState(initialData);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleGoBack = () => {
    if (onGoBack) {
      onGoBack();
    }
  };

  const handlePreviousCard = () => {
    setIsFlipped(false);
    if (onPreviousCard) {
      onPreviousCard();
    }
  };

  const handleNextCard = () => {
    setIsFlipped(false);
    if (onNextCard) {
      onNextCard();
    }
  };

  const handleMarkWrong = () => {
    if (onMarkWrong) {
      onMarkWrong(currentCard.id);
    }
  };

  const handleMarkCorrect = () => {
    if (onMarkCorrect) {
      onMarkCorrect(currentCard.id);
    }
  };

  const handleSpeak = () => {
    const textToSpeak = isFlipped ? currentCard.answer : currentCard.question;
    if (onSpeak) {
      onSpeak(textToSpeak);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col font-poppins"
      style={{
        backgroundColor: '#4EB59B', // Changed from backgroundImage to backgroundColor
        // Removed backgroundSize, backgroundPosition, backgroundRepeat, backgroundAttachment
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between text-white mt-12 mr-72">
        <button
          onClick={handleGoBack}
          className="flex items-center text-white text-sm font-normal"
        >
          <img
            src="./images/arrow-left.svg"
            alt="Powrót"
            width="24"
            height="24"
            className="mr-2 ml-6"
          />
          Powrót
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="relative" style={{ transform: 'translateX(-11px)' }}>
          {/* Card Stack Effect */}
          <div
            className="absolute bg-white rounded-2xl shadow-lg w-76 h-108"
            style={{
              transform: 'translate(22px, 22px)',
              opacity: 0.3,
              zIndex: -2,
              width: '304px',
              height: '431px'
            }}
          />
          <div
            className="absolute bg-white rounded-2xl shadow-lg w-76 h-108"
            style={{
              transform: 'translate(11px, 11px)',
              opacity: 0.6,
              zIndex: -1,
              width: '304px',
              height: '431px'
            }}
          />

          {/* Main Card */}
          <div
            className={`flip-card relative bg-white rounded-2xl shadow-xl cursor-pointer ${isFlipped ? 'flipped' : ''}`}
            onClick={handleFlip}
            style={{
              width: '304px',
              height: '431px',
              backgroundColor: 'transparent',
              perspective: '1000px'
            }}
          >
            <div
              className="flip-card-inner"
              style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                textAlign: 'center',
                transition: 'transform 0.6s',
                transformStyle: 'preserve-3d',
                transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
              }}
            >
              {/* Front Side */}
              <div
                className="flip-card-front rounded-2xl flex flex-col justify-between bg-white"
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  WebkitBackfaceVisibility: 'hidden',
                  backfaceVisibility: 'hidden'
                }}
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-sm font-bold text-gray-800 mt-11 ml-12">
                    Pytanie
                  </h2>
                  <span
                    className="text-sm font-light mt-11 mr-10"
                    style={{ color: '#A4A4A4' }}
                  >
                    {currentCard.cardNumber}/{currentCard.totalCards}
                  </span>
                </div>

                <div className="text-center flex-1 flex items-center justify-center">
                  <h1 className="text-lg font-medium text-gray-800 mx-auto">
                    {currentCard.question}
                  </h1>
                </div>

                <div className="text-center">
                  <p
                    className="text-sm font-normal mb-9 text-center"
                    style={{ color: '#4EB59B' }}
                  >
                    Kliknij, aby odwrócić
                  </p>
                </div>
              </div>

              {/* Back Side */}
              <div
                className="flip-card-back rounded-2xl flex flex-col justify-between bg-emerald-50"
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  WebkitBackfaceVisibility: 'hidden',
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)'
                }}
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-sm font-bold text-gray-800 mt-11 ml-12">
                    Odpowiedź
                  </h2>
                  <span
                    className="text-sm font-light mt-11 mr-10"
                    style={{ color: '#A4A4A4' }}
                  >
                    {currentCard.cardNumber}/{currentCard.totalCards}
                  </span>
                </div>

                <div className="text-center flex-1 flex items-center justify-center">
                  <h1
                    className="text-lg font-semibold mx-auto"
                    style={{ color: '#4EB59B' }}
                  >
                    {currentCard.answer}
                  </h1>
                </div>

                <div className="text-center">
                  <p
                    className="text-sm font-normal mb-9 text-center"
                    style={{ color: '#4EB59B' }}
                  >
                    Kliknij, aby odwrócić
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="flex justify-center items-center space-x-8 pb-8">
        <button
          onClick={handlePreviousCard}
          className="w-12 h-12 flex items-center justify-center"
        >
          <img
            src="./images/chevron-left.svg"
            alt="Poprzednia"
            width="24"
            height="24"
            className="text-gray-600"
          />
        </button>

        <button
          onClick={handleMarkWrong}
          className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg"
        >
          <img
            src="./images/x.svg"
            alt="Źle"
            width="24"
            height="24"
            className="text-red-500"
          />
        </button>

        <button
          onClick={handleSpeak}
          className="w-12 h-12 rounded-full flex items-center justify-center"
        >
          <img
            src="./images/volume-2.svg"
            alt="Odczytaj"
            width="24"
            height="24"
            className="text-gray-600"
          />
        </button>

        <button
          onClick={handleMarkCorrect}
          className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg"
        >
          <img
            src="./images/check_green.svg"
            alt="Poprawnie"
            width="24"
            height="24"
            className="text-green-500"
          />
        </button>

        <button
          onClick={handleNextCard}
          className="w-12 h-12 flex items-center justify-center"
        >
          <img
            src="./images/arrow-right.svg"
            alt="Następna"
            width="24"
            height="24"
            className="text-gray-600"
          />
        </button>
      </div>
    </div>
  );
};

export default Flashcards;