import React, { useState, useEffect } from "react";

interface PhraseData {
  phrase_id: number;
  phrase_text: string;
  translated_text: string;
  phonetic_transcription?: string;
  context?: string;
  topic_label?: string;
}

interface ImageCaptionGameProps {
  phraseData?: PhraseData;
  userId?: number;
  onGoBack?: () => void;
  onSaveResult?: (
    userId: number,
    phraseId: number,
    correct: boolean,
    gameType: string
  ) => Promise<void>;
  onGenerateImage?: (text: string) => Promise<string>;
}

const ImageCaptionGame: React.FC<ImageCaptionGameProps> = ({
  phraseData = {
    phrase_id: 1,
    phrase_text: "Hello",
    translated_text: "Cześć",
    phonetic_transcription: "həˈloʊ",
    context: "Greeting",
    topic_label: "Greetings",
  },
  userId = 1,
  onGoBack,
  onSaveResult,
  onGenerateImage,
}) => {
  const [userInput, setUserInput] = useState("");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [buttonText, setButtonText] = useState("Sprawdź");

  const generateImage = async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");

      if (onGenerateImage) {
        const imageData = await onGenerateImage(phraseData.phrase_text);
        setGeneratedImage(imageData);
      } else {
        // Fallback for demo - use a placeholder with simulated delay
        setTimeout(() => {
          setGeneratedImage(
            "https://via.placeholder.com/300x200/4eb59b/white?text=" +
              encodeURIComponent(phraseData.phrase_text)
          );
          setIsLoading(false);
        }, 2000);
      }
    } catch (error) {
      setErrorMessage("Nie udało się wygenerować obrazka. Spróbuj ponownie.");
      console.error("Error generating image:", error);
    } finally {
      if (onGenerateImage) {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    generateImage();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUserInput(value);

    // Reset feedback when user starts typing again
    if (showFeedback && value.trim().length > 0) {
      resetForNewAttempt();
    }
  };

  const resetForNewAttempt = () => {
    setShowFeedback(false);
    setIsInputDisabled(false);
    setButtonText("Sprawdź");
  };

  const checkAnswer = async () => {
    const userAnswer = userInput.trim().toLowerCase();
    const correctAnswer = phraseData.phrase_text.toLowerCase();
    const correct = userAnswer === correctAnswer;

    setIsCorrect(correct);
    setShowFeedback(true);
    setIsInputDisabled(true);

    // Save result to database
    if (onSaveResult) {
      try {
        await onSaveResult(
          userId,
          phraseData.phrase_id,
          correct,
          "image_caption_ai"
        );
      } catch (error) {
        console.error("Error saving result:", error);
      }
    }

    // Change button to "Next"
    setButtonText("Następne");
  };

  const handleSubmit = () => {
    if (buttonText === "Sprawdź") {
      checkAnswer();
    } else {
      // Reset for next round or navigate
      window.location.reload();
    }
  };

  const handleGoBack = () => {
    if (onGoBack) {
      onGoBack();
    }
  };

  const retryImageGeneration = () => {
    generateImage();
  };

  const isSubmitDisabled =
    userInput.trim().length === 0 && buttonText === "Sprawdź";

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
      <div className="p-4 h-screen flex flex-col">
        {/* Header */}
        <header className="px-4 pb-4">
          {/* Back Button and Progress Bar */}
          <nav className="flex items-center space-x-3 mb-6 pt-16">
            <button
              className="text-white flex items-center flex-shrink-0"
              onClick={handleGoBack}
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

            <div className="flex-1 ml-4">
              <div
                className="bg-white bg-opacity-30 rounded-full h-2"
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
          </nav>
        </header>

        {/* Game Content */}
        <main className="flex-1 flex flex-col justify-center items-center px-6">
          {/* Title */}
          <div className="w-full max-w-sm">
            <h1 className="text-white text-2xl font-normal mb-12 text-left leading-tight">
              Podpisz wyświetlony
              <br />
              obrazek
            </h1>
          </div>

          {/* Image Container */}
          <div className="w-full max-w-sm mb-8">
            <div className="bg-white rounded-2xl p-3 shadow-lg min-h-[200px] flex items-center justify-center">
              {isLoading && (
                <div className="flex flex-col items-center">
                  <div
                    className="spinner"
                    style={{
                      border: "4px solid #f3f3f3",
                      borderTop: "4px solid #4eb59b",
                      borderRadius: "50%",
                      width: "40px",
                      height: "40px",
                      animation: "spin 1s linear infinite",
                    }}
                  ></div>
                  <p className="text-[#4eb59b] mt-3 text-sm text-center">
                    Generowanie obrazka AI...
                  </p>
                </div>
              )}

              {errorMessage && !isLoading && (
                <div className="text-center text-red-600 p-4">
                  <p className="mb-3">{errorMessage}</p>
                  <button
                    onClick={retryImageGeneration}
                    className="mt-3 bg-white text-[#4eb59b] px-4 py-2 rounded-lg text-sm border border-[#4eb59b] hover:bg-[#4eb59b] hover:text-white transition-colors"
                  >
                    Spróbuj ponownie
                  </button>
                </div>
              )}

              {generatedImage && !isLoading && !errorMessage && (
                <div className="w-full">
                  <img
                    src={generatedImage}
                    className="w-full h-48 object-cover rounded-xl"
                    alt={`Illustration of ${phraseData.phrase_text}`}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Input Field */}
          <div
            className={`relative w-full max-w-sm mb-6 bg-white rounded-xl border-2 transition-colors ${
              showFeedback
                ? isCorrect
                  ? "border-green-500"
                  : "border-red-500"
                : "border-[#4eb59b]"
            }`}
          >
            {/* 1. The actual (but invisible) input field for user text */}
            <input
              type="text"
              className="relative z-10 w-full h-full px-4 py-4 text-lg text-center bg-transparent border-0 rounded-xl focus:outline-none focus:ring-0"
              value={userInput}
              onChange={handleInputChange}
              disabled={isInputDisabled}
            />

            {/* 2. The placeholder line, shown only when input is empty */}
            {!userInput && (
              <div className="absolute bottom-2 left-0 right-0 z-0 text-center text-[#4eb59b] pointer-events-none">
                ────────────────────────
              </div>
            )}
          </div>

          {/* Feedback message (remains the same) */}
          {showFeedback && (
            <p
              className={`mt-3 text-center font-medium text-sm ${
                isCorrect ? "text-green-600" : "text-red-600"
              }`}
            >
              {isCorrect
                ? "Świetnie! Poprawna odpowiedź!"
                : `Niestety nie. Poprawna odpowiedź to: "${phraseData.phrase_text}"`}
            </p>
          )}

          {/* Submit Button */}
          <div className="w-full max-w-sm">
            <button
              className={`bg-white text-[#4eb59b] font-normal py-4 px-8 rounded-xl w-full transition-all duration-200 text-lg ${
                isSubmitDisabled ? "opacity-50" : "opacity-100"
              }`}
              onClick={handleSubmit}
              disabled={isSubmitDisabled}
            >
              {buttonText}
            </button>
          </div>

          {/* Hint Section */}
          <div className="w-full max-w-sm mt-6">
            <details className="text-center">
              <summary className="text-white text-sm opacity-75 cursor-pointer hover:opacity-100 transition-opacity">
                💡 Podpowiedź
              </summary>
              <p className="text-white text-xs mt-2 opacity-75">
                Kontekst: {phraseData.context || "Brak kontekstu"}
                {phraseData.phonetic_transcription && (
                  <>
                    <br />
                    Wymowa: [{phraseData.phonetic_transcription}]
                  </>
                )}
              </p>
            </details>
          </div>
        </main>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default ImageCaptionGame;
