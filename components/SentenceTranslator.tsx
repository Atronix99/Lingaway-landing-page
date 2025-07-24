import React, { useState, useEffect } from "react";

// Typy danych
interface PhraseData {
  phrase_id: number;
  phrase_text: string;
  translated_text: string;
  phonetic_transcription?: string;
  context: string;
  topic_label: string;
  words: string[];
}

interface GameResult {
  user_id: number;
  phrase_id: number;
  correct: boolean;
  game_type: string;
  user_answer?: string;
}

interface ApiResponse {
  success: boolean;
  message?: string;
  error?: string;
  data?: any;
}

interface OfflineResult extends GameResult {
  timestamp: number;
}

// Symulacja offline managera
class OfflineManager {
  private offlineResults: OfflineResult[] = [];

  saveOfflineResult(result: GameResult) {
    const offlineResult: OfflineResult = {
      ...result,
      timestamp: Date.now(),
    };

    this.offlineResults.push(offlineResult);
    // W rzeczywistej aplikacji użyj localStorage
    console.log("Result saved offline:", offlineResult);

    window.dispatchEvent(
      new CustomEvent("offline-save", {
        detail: offlineResult,
      })
    );
  }

  async syncOfflineData() {
    if (this.offlineResults.length === 0) return;

    try {
      // Symulacja synchronizacji
      await new Promise((resolve) => setTimeout(resolve, 1000));
      this.offlineResults = [];

      window.dispatchEvent(
        new CustomEvent("sync-success", {
          detail: { synced: true },
        })
      );
    } catch (error) {
      window.dispatchEvent(
        new CustomEvent("sync-failed", {
          detail: { error },
        })
      );
    }
  }
}

// Mockowe dane - w rzeczywistej aplikacji zastąp API calls
const mockPhraseData: PhraseData = {
  phrase_id: 1,
  phrase_text: "I wrote this book",
  translated_text: "Przetłumacz to zdanie",
  context: "Writing",
  topic_label: "Literature",
  words: ["I", "wrote", "this", "book"],
};

const SentenceTranslator: React.FC = () => {
  const [phraseData] = useState<PhraseData>(mockPhraseData);
  const [availableWords, setAvailableWords] = useState<string[]>([]);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [gameCompleted, setGameCompleted] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [offlineManager] = useState<OfflineManager>(new OfflineManager());

  const userId = 1; // W rzeczywistej aplikacji z kontekstu/sesji

  // Symulacja API calls
  const apiCall = async (action: string, data?: any): Promise<ApiResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    switch (action) {
      case "save_result":
        if (Math.random() > 0.8) {
          // 20% szans na błąd
          throw new Error("Server error");
        }
        return {
          success: true,
          message: "Game result saved successfully",
          data: data,
        };

      default:
        return { success: false, error: "Unknown action" };
    }
  };

  // Obsługa stanu online/offline
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      offlineManager.syncOfflineData();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [offlineManager]);

  // Inicjalizacja gry
  useEffect(() => {
    // Wymieszaj słowa
    const shuffled = [...phraseData.words].sort(() => Math.random() - 0.5);
    setAvailableWords(shuffled);
  }, [phraseData.words]);

  const selectWord = (word: string, index: number) => {
    if (gameCompleted) return;

    // Dodaj słowo do wybranych
    setSelectedWords((prev) => [...prev, word]);

    // Usuń słowo z dostępnych
    setAvailableWords((prev) => prev.filter((_, i) => i !== index));
  };

  const removeWord = (index: number) => {
    if (gameCompleted) return;

    const word = selectedWords[index];

    // Usuń słowo z wybranych
    setSelectedWords((prev) => prev.filter((_, i) => i !== index));

    // Dodaj słowo z powrotem do dostępnych
    setAvailableWords((prev) => [...prev, word]);
  };

  const checkAnswer = async () => {
    if (selectedWords.length === 0) return;

    const userAnswer = selectedWords.join(" ");
    const correct = userAnswer === phraseData.phrase_text;
    setIsCorrect(correct);
    setGameCompleted(true);

    // Zapisz wynik
    const resultData: GameResult = {
      user_id: userId,
      phrase_id: phraseData.phrase_id,
      correct: correct,
      game_type: "sentence_translation",
      user_answer: userAnswer,
    };

    try {
      if (isOnline) {
        const response = await apiCall("save_result", resultData);
        if (!response.success) {
          throw new Error("Server error");
        }
        console.log("Result saved online");
      } else {
        throw new Error("Offline mode");
      }
    } catch (error) {
      offlineManager.saveOfflineResult(resultData);
      console.log("Result saved offline due to:", error);
    }
  };

  const nextQuestion = () => {
    // W rzeczywistej aplikacji - załaduj nowe pytanie lub przejdź do następnej strony
    window.location.reload();
  };

  const getWordButtonClassName = (isSelected: boolean = false): string => {
    let baseClass =
      "bg-white text-[#4eb59b] font-normal py-3 px-6 rounded-2xl transition-all hover:shadow-lg text-sm min-w-[60px]";

    if (gameCompleted) {
      return baseClass + " pointer-events-none";
    }

    if (isSelected) {
      return baseClass + " ring-2 ring-white ring-opacity-50";
    }

    return baseClass;
  };

  const getSubmitButtonClassName = (): string => {
    const baseClass =
      "bg-white text-[#4eb59b] font-normal py-4 px-8 rounded-2xl w-full transition-opacity text-lg";

    if (selectedWords.length === 0 && !gameCompleted) {
      return baseClass + " opacity-50";
    }

    return baseClass;
  };

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundImage: "url('../../../images/bg.png')",
        backgroundColor: "#4eb59b",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Wskaźnik trybu offline */}
      {!isOnline && (
        <div className="fixed top-4 left-4 z-50">
          <div className="bg-orange-500 text-white px-3 py-1 rounded-lg text-sm flex items-center space-x-2">
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
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <span>Tryb offline</span>
          </div>
        </div>
      )}

      {/* Gra Tłumaczenia Zdania */}
      <div className="px-6 py-4 h-screen flex flex-col">
        {/* Header */}
        <header className="pt-12 pb-8">
          {/* Back Button and Progress Bar */}
          <div className="flex items-center space-x-4 mb-12">
            <button
              className="text-white flex items-center flex-shrink-0"
              onClick={() => window.history.back()}
              aria-label="Powrót"
            >
              <svg
                className="w-6 h-6"
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
                ></path>
              </svg>
            </button>

            <div className="flex-1">
              <div
                className="bg-white bg-opacity-35 rounded-full h-2"
                role="progressbar"
                aria-valuenow={65}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Postęp kursu: 65%"
              >
                <div
                  className="bg-white h-2 rounded-full transition-all duration-300"
                  style={{ width: "65%" }}
                ></div>
              </div>
            </div>
          </div>
        </header>

        {/* Game Content */}
        <main className="flex-1 flex flex-col">
          {/* Title */}
          <div className="mb-8">
            <h2 className="text-white text-2xl font-normal leading-relaxed">
              {phraseData.translated_text}
            </h2>
            <p className="text-white text-sm opacity-75 mt-2">
              {phraseData.context}
            </p>
          </div>

          {/* Selected Words Area */}
          <div className="mb-8">
            <div className="min-h-[120px] bg-white bg-opacity-10 rounded-2xl p-4 border-2 border-white border-opacity-30">
              {selectedWords.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <span className="text-white opacity-50 text-lg">
                    Ułóż zdanie tutaj...
                  </span>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {selectedWords.map((word, index) => (
                    <button
                      key={`selected-${index}`}
                      className={getWordButtonClassName(true)}
                      onClick={() => removeWord(index)}
                      disabled={gameCompleted}
                    >
                      {word}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Available Words */}
          <div className="mb-8 flex-1">
            <div className="flex flex-wrap gap-3 justify-center">
              {availableWords.map((word, index) => (
                <button
                  key={`available-${index}`}
                  className={getWordButtonClassName()}
                  onClick={() => selectWord(word, index)}
                  disabled={gameCompleted}
                >
                  {word}
                </button>
              ))}
            </div>
          </div>

          {/* Feedback */}
          {gameCompleted && (
            <div className="mb-6 text-center">
              <div
                className={`text-lg font-medium ${
                  isCorrect ? "text-green-200" : "text-red-200"
                }`}
              >
                {isCorrect ? "✅ Świetnie!" : "❌ Spróbuj ponownie"}
              </div>
              {!isCorrect && (
                <div className="text-white text-sm mt-2 opacity-75">
                  Poprawna odpowiedź: "{phraseData.phrase_text}"
                </div>
              )}
            </div>
          )}

          {/* Submit Button */}
          <button
            className={getSubmitButtonClassName()}
            onClick={gameCompleted ? nextQuestion : checkAnswer}
            disabled={selectedWords.length === 0 && !gameCompleted}
          >
            {gameCompleted ? "Następne" : "Sprawdź"}
          </button>
        </main>
      </div>
    </div>
  );
};

export default SentenceTranslator;
