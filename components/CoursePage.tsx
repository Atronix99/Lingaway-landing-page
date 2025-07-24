import React, { useState, useEffect, useCallback } from "react";

interface Phrase {
  phrase_id: number;
  phrase_text: string;
  translated_text: string;
  phonetic_transcription?: string;
  context?: string;
  topic_label?: string;
  practiced?: boolean;
  correct?: boolean;
  last_practiced_at?: string;
}

interface CoursePageProps {
  courseName?: string;
  courseTitle?: string;
  progress?: number;
  phrases?: Phrase[];
  onGoBack?: () => void;
  onOpenFlashcards?: () => void;
  onOpenImageCaptionGame?: () => void;
  onMarkAsPracticed?: (phraseId: number, correct?: boolean) => void;
  onPlayAudio?: (text: string, language?: string) => void;
}

// Stałe dla lepszej czytelności
const AUDIO_LANGUAGES = {
  ENGLISH: "en-US",
  POLISH: "pl-PL",
} as const;

const PROGRESS_INDICATORS = {
  CORRECT: "✓",
  PARTIAL: "?",
} as const;

const MODAL_ANIMATION_DURATION = 300;

// Komponent nagłówka kursu
const CourseHeader: React.FC<{
  courseName: string;
  courseTitle: string;
  progress: number;
  onGoBack?: () => void;
}> = ({ courseName, courseTitle, progress, onGoBack }) => (
  <header className="px-4 pb-4">
    {/* Przycisk powrotu */}
    <nav className="flex items-center mb-3">
      <button
        className="text-white flex items-center hover:opacity-80 transition-opacity"
        onClick={onGoBack}
        aria-label="Powrót"
      >
        <svg
          className="w-5 h-5 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        <span className="text-lg font-normal">{courseTitle}</span>
      </button>
    </nav>

    {/* Pasek postępu */}
    {/* Tytuł kursu z flagą */}
    <div className="flex items-center mb-4 pt-4">
      <div className="flex items-center text-white">
        <div className="w-7 h-7 rounded-full overflow-hidden mr-3 bg-white/50 flex items-center justify-center">
          <img
            src="/images/united states.svg"
            alt="Flaga kraju"
            className="w-6 h-6 object-cover"
            onError={(e) => {
              const target = e.currentTarget;
              const fallback = target.nextElementSibling as HTMLElement;
              target.style.display = "none";
              if (fallback) fallback.style.display = "block";
            }}
          />
          <span className="text-sm font-bold text-gray-700 hidden">US</span>
        </div>
        <h1 className="text-2xl font-normal">{courseName}</h1>
      </div>
    </div>

    <div
      className="bg-white bg-opacity-35 rounded-full h-2 mb-6"
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Postęp kursu: ${progress}%`}
    >
      <div
        className="bg-white h-2 rounded-full transition-all duration-300"
        style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
      />
    </div>
  </header>
);

// Komponent pojedynczej karty nawigacyjnej
const NavigationCard: React.FC<{
  icon: string;
  label: string;
  onClick?: () => void;
  "aria-label"?: string;
}> = ({ icon, label, onClick, "aria-label": ariaLabel }) => (
  <div className="bg-white rounded-lg shadow-md flex-shrink-0 w-[151px] h-[102px]">
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center h-full p-3 w-full hover:bg-gray-50 transition-colors rounded-lg"
      aria-label={ariaLabel || label}
    >
      <img src={icon} alt="" aria-hidden="true" className="mb-1" />
      <span className="text-sm font-normal text-gray-700 text-center leading-tight">
        {label}
      </span>
    </button>
  </div>
);

// Komponent sekcji nawigacji
const NavigationSection: React.FC<{
  onOpenFlashcards?: () => void;
  onOpenModal: () => void;
}> = ({ onOpenFlashcards, onOpenModal }) => (
  <section className="mb-2" aria-label="Akcje kursu">
    <div className="flex flex-wrap gap-4 pb-2">
      <NavigationCard
        icon="/images/file-text.svg"
        label="Otwórz fiszki"
        onClick={onOpenFlashcards}
      />
      <NavigationCard
        icon="/images/book-open-check.svg"
        label="Sprawdź się!"
        onClick={onOpenModal}
      />
      <NavigationCard icon="/images/square-pen.svg" label="Edytuj fiszki" />
      <NavigationCard icon="/images/bookmark-check.svg" label="Oznaczone" />
    </div>
  </section>
);

// Komponent pojedynczego zwrotu
const PhraseItem: React.FC<{
  phrase: Phrase;
  isExpanded: boolean;
  onToggle: () => void;
  onPlayAudio: (text: string, language: string) => void;
  onMarkAsPracticed: (phraseId: number) => void;
}> = ({ phrase, isExpanded, onToggle, onPlayAudio, onMarkAsPracticed }) => {
  const handleAudioClick = useCallback(
    (e: React.MouseEvent, text: string, language: string) => {
      e.stopPropagation();
      onPlayAudio(text, language);
    },
    [onPlayAudio]
  );

  const handleMarkClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onMarkAsPracticed(phrase.phrase_id);
    },
    [onMarkAsPracticed, phrase.phrase_id]
  );

  return (
    <article
      className={`bg-white rounded-lg transition-all duration-200 hover:shadow-md${
        phrase.practiced ? " border-l-4 border-green-500" : ""
      }`}
      role="listitem"
    >
      <div
        className="flex items-center justify-between p-4 cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex items-center flex-1">
          <button
            className="mr-3 text-gray-500 hover:text-gray-700 transition-colors"
            aria-label={`Odtwórz wymowę: ${phrase.phrase_text}`}
            onClick={(e) =>
              handleAudioClick(e, phrase.phrase_text, AUDIO_LANGUAGES.ENGLISH)
            }
          >
            <img
              src="/images/volume-2.svg"
              alt=""
              aria-hidden="true"
              className="w-5 h-5"
            />
          </button>

          <span
            className="text-gray-700 text-sm font-normal flex-1"
            style={{ lineHeight: "41px" }}
          >
            {phrase.phrase_text}
          </span>

          {phrase.practiced && (
            <span
              className={`ml-2 text-xs px-2 py-1 rounded-full ${
                phrase.correct
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
              aria-label={
                phrase.correct ? "Poprawnie przećwiczone" : "Wymaga powtórzenia"
              }
            >
              {phrase.correct
                ? PROGRESS_INDICATORS.CORRECT
                : PROGRESS_INDICATORS.PARTIAL}
            </span>
          )}
        </div>

        <div className="flex items-center">
          <button
            className="mr-2 text-gray-400 hover:text-gray-600 transition-colors"
            onClick={handleMarkClick}
            aria-label="Oznacz jako przećwiczone"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </button>

          <svg
            className={`w-4 h-4 text-gray-400 transform transition-transform duration-200 ${
              isExpanded ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      {isExpanded && (
        <div className="px-4 pb-4">
          <hr className="mb-4" />
          <div className="text-sm text-gray-600 flex items-start">
            <button
              className="mr-3 text-gray-500 hover:text-gray-700 transition-colors mt-1"
              aria-label={`Odtwórz wymowę tłumaczenia: ${phrase.translated_text}`}
              onClick={() =>
                onPlayAudio(phrase.translated_text, AUDIO_LANGUAGES.POLISH)
              }
            >
              <img
                src="/images/volume-2.svg"
                alt=""
                aria-hidden="true"
                className="w-5 h-5"
              />
            </button>

            <div className="flex-1">
              <p className="mb-2">{phrase.translated_text}</p>

              {phrase.phonetic_transcription && (
                <p className="text-xs text-blue-600 mb-2">
                  [{phrase.phonetic_transcription}]
                </p>
              )}

              {phrase.context && (
                <p className="text-xs text-gray-400 mb-2">{phrase.context}</p>
              )}

              {phrase.topic_label && (
                <span className="inline-block text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full mb-2">
                  {phrase.topic_label}
                </span>
              )}

              {phrase.last_practiced_at && (
                <p className="text-xs text-gray-400">
                  Ostatnio ćwiczono:{" "}
                  {new Date(phrase.last_practiced_at).toLocaleString("pl-PL")}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </article>
  );
};

// Komponent modalu z opcjami quizu
const QuizModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onOpenImageCaptionGame?: () => void;
}> = ({ isOpen, onClose, onOpenImageCaptionGame }) => {
  const handleImageCaptionClick = useCallback(() => {
    onOpenImageCaptionGame?.();
    onClose();
  }, [onOpenImageCaptionGame, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
        onClick={onClose}
        aria-label="Zamknij modal"
      />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-2xl p-6 w-full max-w-sm mx-auto pb-12 transform transition-all duration-300 animate-modal-enter"
          role="dialog"
          aria-labelledby="modal-title"
          aria-modal="true"
        >
          <div className="flex items-center mb-6">
            <button
              onClick={onClose}
              className="text-gray-600 flex items-center hover:text-gray-800 transition-colors"
              aria-label="Zamknij modal"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              <span className="text-lg">Powrót</span>
            </button>
          </div>

          <div className="flex items-center justify-center mb-8">
            <img
              src="/images/book-open-check.svg"
              alt=""
              aria-hidden="true"
              className="w-12 h-12 mr-3"
            />
            <h2 id="modal-title" className="text-xl font-medium text-gray-800">
              Sprawdź się!
            </h2>
          </div>

          <div className="space-y-3" role="list">
            {[
              "Przetłumacz słowo",
              "Wypełnij lukę",
              "Dopasuj słowo",
              "Podpisz obrazek",
            ].map((option, index) => (
              <button
                key={option}
                className="w-full text-white font-normal py-4 px-4 rounded-lg transition-all hover:opacity-90 hover:shadow-lg text-center"
                style={{ backgroundColor: "#4eb59b" }}
                onClick={index === 3 ? handleImageCaptionClick : undefined}
                role="listitem"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Główny komponent
const CoursePage: React.FC<CoursePageProps> = ({
  courseName = "Nazwa Kursu - Język",
  courseTitle = "Powrót",
  progress = 65,
  phrases = [],
  onGoBack,
  onOpenFlashcards,
  onOpenImageCaptionGame,
  onMarkAsPracticed,
  onPlayAudio,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedPhrases, setExpandedPhrases] = useState<Set<number>>(
    new Set()
  );

  // Memoizowane funkcje callback
  const openModal = useCallback(() => setIsModalOpen(true), []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);

  const toggleTranslation = useCallback((phraseId: number) => {
    setExpandedPhrases((prev) => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(phraseId)) {
        newExpanded.delete(phraseId);
      } else {
        newExpanded.add(phraseId);
      }
      return newExpanded;
    });
  }, []);

  const handlePlayAudio = useCallback(
    (text: string, language: string = AUDIO_LANGUAGES.ENGLISH) => {
      if (onPlayAudio) {
        onPlayAudio(text, language);
      } else if ("speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = language;
        speechSynthesis.speak(utterance);
      }
    },
    [onPlayAudio]
  );

  const handleMarkAsPracticed = useCallback(
    (phraseId: number) => {
      onMarkAsPracticed?.(phraseId);
    },
    [onMarkAsPracticed]
  );

  // Obsługa klawisza Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isModalOpen) {
        closeModal();
      }
    };

    if (isModalOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isModalOpen, closeModal]);

  return (
    <div
      className="min-h-screen"
      style={{
        fontFamily: "Poppins, sans-serif",
        backgroundImage: 'url("/images/bg.png")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <CourseHeader
        courseName={courseName}
        courseTitle={courseTitle}
        progress={progress}
        onGoBack={onGoBack}
      />

      <main className="px-4 pb-8">
        <NavigationSection
          onOpenFlashcards={onOpenFlashcards}
          onOpenModal={openModal}
        />

        <div
          className="text-white text-sm font-normal mb-1"
          style={{ lineHeight: "41px" }}
        >
          <span>{phrases.length} zwrotów</span>
        </div>

        <section className="mb-4">
          <h2 className="text-white text-sm font-medium mb-3">Kategoria</h2>

          <div className="space-y-3" role="list">
            {phrases.length === 0 ? (
              <div className="bg-white rounded-lg p-4 text-center text-gray-500">
                <p>Brak dostępnych zwrotów</p>
              </div>
            ) : (
              phrases.map((phrase) => (
                <PhraseItem
                  key={phrase.phrase_id}
                  phrase={phrase}
                  isExpanded={expandedPhrases.has(phrase.phrase_id)}
                  onToggle={() => toggleTranslation(phrase.phrase_id)}
                  onPlayAudio={handlePlayAudio}
                  onMarkAsPracticed={handleMarkAsPracticed}
                />
              ))
            )}
          </div>
        </section>
      </main>

      <QuizModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onOpenImageCaptionGame={onOpenImageCaptionGame}
      />

      <style jsx>{`
        @keyframes modalEnter {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-modal-enter {
          animation: modalEnter 0.3s ease;
        }
      `}</style>
    </div>
  );
};

export default CoursePage;