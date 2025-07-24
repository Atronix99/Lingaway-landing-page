import React, { useState, useEffect } from 'react';

// Typy danych
interface PhraseData {
  phrase_id: number;
  phrase_text: string;
  translated_text: string;
  phonetic_transcription?: string;
  image_url?: string;
  context: string;
  topic_label: string;
}

interface GameResult {
  user_id: number;
  phrase_id: number;
  correct: boolean;
  game_type: string;
}

interface ApiResponse {
  success: boolean;
  message?: string;
  error?: string;
  image?: string;
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
      timestamp: Date.now()
    };
    
    this.offlineResults.push(offlineResult);
    localStorage.setItem('offlineResults', JSON.stringify(this.offlineResults));
    
    console.log('Result saved offline:', offlineResult);
    
    // Emit custom event
    window.dispatchEvent(new CustomEvent('offline-save', { 
      detail: offlineResult 
    }));
  }

  async syncOfflineData() {
    if (this.offlineResults.length === 0) return;

    try {
      const response = await fetch('?action=sync_offline_data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          offline_results: this.offlineResults
        })
      });

      if (response.ok) {
        this.offlineResults = [];
        localStorage.removeItem('offlineResults');
        
        window.dispatchEvent(new CustomEvent('sync-success', { 
          detail: { synced: true } 
        }));
      }
    } catch (error) {
      window.dispatchEvent(new CustomEvent('sync-failed', { 
        detail: { error } 
      }));
    }
  }

  loadOfflineResults() {
    const stored = localStorage.getItem('offlineResults');
    if (stored) {
      this.offlineResults = JSON.parse(stored);
    }
  }
}

// Mockowe dane - w rzeczywistej aplikacji zastąp API calls
const mockPhraseData: PhraseData = {
  phrase_id: 1,
  phrase_text: 'Hello',
  translated_text: 'Cześć',
  phonetic_transcription: 'həˈloʊ',
  context: 'Greeting',
  topic_label: 'Greetings'
};

const mockOptions = ['Hello', 'Goodbye', 'Thanks', 'Please'];

const TranslationGame: React.FC = () => {
  const [phraseData] = useState<PhraseData>(mockPhraseData);
  const [options] = useState<string[]>(mockOptions);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [gameCompleted, setGameCompleted] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState<boolean>(true);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [offlineManager] = useState<OfflineManager>(new OfflineManager());

  const userId = 1; // W rzeczywistej aplikacji z kontekstu/sesji

  // Symulacja API calls
  const apiCall = async (action: string, data?: any): Promise<ApiResponse> => {
    await new Promise(resolve => setTimeout(resolve, 500));

    switch (action) {
      case 'ping':
        return {
          success: true,
          data: {
            status: 'ok',
            timestamp: Date.now(),
            server_time: new Date().toISOString()
          }
        };

      case 'save_result':
        if (Math.random() > 0.8) { // 20% szans na błąd
          throw new Error('Server error');
        }
        return {
          success: true,
          message: 'Game result saved successfully',
          data: data
        };

      case 'generate_image':
        // Symulacja generowania obrazka
        const mockImageBase64 = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNGViNTliIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj4nICsgZGF0YS50ZXh0ICsgJzwvdGV4dD48L3N2Zz4=';
        
        return {
          success: true,
          image: mockImageBase64
        };

      case 'sync_offline_data':
        return {
          success: true,
          message: 'Offline data synchronized successfully'
        };

      default:
        return { success: false, error: 'Unknown action' };
    }
  };

  // Obsługa stanu online/offline
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Automatyczna synchronizacja po powrocie online
      offlineManager.syncOfflineData();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Nasłuchuj eventów synchronizacji
    const handleSyncSuccess = (event: CustomEvent) => {
      console.log('Sync successful:', event.detail);
    };

    const handleSyncFailed = (event: CustomEvent) => {
      console.error('Sync failed:', event.detail);
    };

    window.addEventListener('sync-success', handleSyncSuccess as EventListener);
    window.addEventListener('sync-failed', handleSyncFailed as EventListener);

    // Załaduj offline results
    offlineManager.loadOfflineResults();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('sync-success', handleSyncSuccess as EventListener);
      window.removeEventListener('sync-failed', handleSyncFailed as EventListener);
    };
  }, [offlineManager]);

  // Generuj obrazek po załadowaniu komponentu
  useEffect(() => {
    generateImage();
  }, [phraseData.translated_text]);

  const generateImage = async () => {
    if (phraseData.image_url) {
      setGeneratedImage(phraseData.image_url);
      setImageLoading(false);
      return;
    }

    try {
      setImageLoading(true);
      const data = await apiCall('generate_image', { text: phraseData.translated_text });
      
      if (data.success && data.image) {
        setGeneratedImage(data.image);
      } else {
        console.error('Failed to generate image:', data.error);
      }
    } catch (error) {
      console.error('Error generating image:', error);
    } finally {
      setImageLoading(false);
    }
  };

  const selectOption = (option: string) => {
    if (gameCompleted) return;
    setSelectedOption(option);
  };

  const checkAnswer = async () => {
    if (!selectedOption) return;

    const correct = selectedOption === phraseData.phrase_text;
    setIsCorrect(correct);
    setGameCompleted(true);

    // Zapisz wynik
    const resultData: GameResult = {
      user_id: userId,
      phrase_id: phraseData.phrase_id,
      correct: correct,
      game_type: 'translation'
    };

    try {
      if (isOnline) {
        const response = await apiCall('save_result', resultData);
        if (!response.success) {
          throw new Error('Server error');
        }
        console.log('Result saved online');
      } else {
        throw new Error('Offline mode');
      }
    } catch (error) {
      // Zapisz offline
      offlineManager.saveOfflineResult(resultData);
      console.log('Result saved offline due to:', error);
    }
  };

  const nextQuestion = () => {
    // W rzeczywistej aplikacji - załaduj nowe pytanie lub przejdź do następnej strony
    window.location.reload();
  };

  const getOptionClassName = (option: string): string => {
    let baseClass = 'bg-white rounded-2xl py-8 px-4 text-[#4eb59b] text-lg font-normal transition-all hover:shadow-lg flex items-center justify-center min-h-[100px]';
    
    if (gameCompleted) {
      if (option === phraseData.phrase_text) {
        return baseClass.replace('bg-white text-[#4eb59b]', 'bg-green-500 text-white');
      } else if (option === selectedOption && !isCorrect) {
        return baseClass.replace('bg-white text-[#4eb59b]', 'bg-red-500 text-white');
      }
      return baseClass + ' pointer-events-none';
    }
    
    if (selectedOption === option) {
      return baseClass + ' ring-4 ring-white ring-opacity-50';
    }
    
    return baseClass;
  };

  const getSubmitButtonClassName = (): string => {
    const baseClass = 'bg-white text-[#4eb59b] font-normal py-4 px-8 rounded-2xl w-full transition-opacity text-lg';
    
    if (!selectedOption && !gameCompleted) {
      return baseClass + ' opacity-50';
    }
    
    return baseClass;
  };

  return (
    <div className="min-h-screen" style={{
      backgroundImage: "url('../../../images/bg.png')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
      {/* Wskaźnik trybu offline */}
      {!isOnline && (
        <div className="fixed top-4 left-4 z-50">
          <div className="bg-orange-500 text-white px-3 py-1 rounded-lg text-sm flex items-center space-x-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>Tryb offline</span>
          </div>
        </div>
      )}

      {/* Gra Tłumaczenia */}
      <div className="px-6 py-4 h-screen flex flex-col">
        {/* Header */}
        <header className="pt-12 pb-8">
          {/* Back Button and Progress Bar */}
          <div className="flex items-center space-x-4 mb-12">
            <button className="text-white flex items-center flex-shrink-0"
                    onClick={() => window.history.back()}
                    aria-label="Powrót">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M15 19l-7-7 7-7"></path>
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
                <div className="bg-white h-2 rounded-full transition-all duration-300" style={{width: '65%'}}></div>
              </div>
            </div>
          </div>
        </header>

        {/* Game Content */}
        <main className="flex-1 flex flex-col justify-center">
          {/* Image Container */}
          <div className="mb-8 flex justify-center">
            <div className="max-w-md w-full">
              {imageLoading ? (
                <div className="flex flex-col items-center justify-center h-48 bg-white rounded-xl shadow-lg">
                  <div className="w-10 h-10 border-4 border-gray-300 border-t-[#4eb59b] rounded-full animate-spin"></div>
                  <p className="text-[#4eb59b] mt-3 text-sm text-center">Generowanie obrazka...</p>
                </div>
              ) : generatedImage ? (
                <img 
                  src={generatedImage}
                  alt={phraseData.translated_text}
                  className="w-full h-48 object-cover rounded-xl shadow-lg"
                />
              ) : (
                <div className="flex items-center justify-center h-48 bg-gray-200 rounded-xl shadow-lg">
                  <span className="text-gray-500">Brak obrazka</span>
                </div>
              )}
            </div>
          </div>

          {/* Question Text */}
          <div className="mb-16">
            <h2 className="text-white text-xl font-normal leading-relaxed text-center">
              Wybierz odpowiednie<br/>tłumaczenie dla "<span className="font-medium">{phraseData.translated_text}</span>"
            </h2>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-2 gap-4 mb-16">
            {options.length > 0 ? (
              options.map((option, index) => (
                <button
                  key={index}
                  className={getOptionClassName(option)}
                  onClick={() => selectOption(option)}
                  disabled={gameCompleted}
                >
                  {option}
                </button>
              ))
            ) : (
              <div className="col-span-2 text-white text-center">
                <p>Brak dostępnych opcji. Skontaktuj się z administratorem.</p>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            className={getSubmitButtonClassName()}
            onClick={gameCompleted ? nextQuestion : checkAnswer}
            disabled={!selectedOption && !gameCompleted}
          >
            {gameCompleted ? 'Następne' : 'Sprawdź'}
          </button>
        </main>
      </div>
    </div>
  );
};

export default TranslationGame;