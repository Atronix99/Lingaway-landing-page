import React, { useState, useEffect } from 'react';

// Typy danych
interface WordInfo {
  word: string;
  original: string;
  index: number;
  position: number;
}

interface QuizQuestion {
  phrase_id: number;
  sentence: string;
  original_sentence: string;
  translation: string;
  language_code: string;
  context: string;
  topic_label: string;
  correct_answer: string;
  options: string[];
  word_info: WordInfo;
}

interface QuizProgress {
  current: number;
  total: number;
}

interface ApiResponse {
  success: boolean;
  message?: string;
  question?: QuizQuestion;
  progress?: QuizProgress;
  correct?: boolean;
  correct_answer?: string;
  translation?: string;
}

// Symulacja danych - w rzeczywistej aplikacji zastąp API calls
const mockQuestions: QuizQuestion[] = [
  {
    phrase_id: 1,
    sentence: "I am going to the ___ today",
    original_sentence: "I am going to the store today",
    translation: "Idę dziś do sklepu",
    language_code: "en",
    context: "shopping",
    topic_label: "daily activities",
    correct_answer: "store",
    options: ["store", "park", "school", "office"],
    word_info: { word: "store", original: "store", index: 5, position: 18 }
  },
  {
    phrase_id: 2,
    sentence: "She likes to ___ books in the evening",
    original_sentence: "She likes to read books in the evening",
    translation: "Ona lubi czytać książki wieczorem",
    language_code: "en",
    context: "hobbies",
    topic_label: "reading",
    correct_answer: "read",
    options: ["read", "buy", "write", "sell"],
    word_info: { word: "read", original: "read", index: 3, position: 13 }
  }
];

const GapFillerQuiz: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [selectedOption, setSelectedOption] = useState<{ button: HTMLButtonElement | null; answer: string } | null>(null);
  const [answered, setAnswered] = useState<boolean>(false);
  const [quizProgress, setQuizProgress] = useState<QuizProgress>({ current: 0, total: 0 });
  const [questionIndex, setQuestionIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showCorrectAnswer, setShowCorrectAnswer] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);

  // Symulacja API calls
  const apiCall = async (action: string, data?: any): Promise<ApiResponse> => {
    // Symulacja opóźnienia sieciowego
    await new Promise(resolve => setTimeout(resolve, 300));

    switch (action) {
      case 'get_question':
        if (questionIndex < mockQuestions.length) {
          return {
            success: true,
            question: mockQuestions[questionIndex],
            progress: { current: questionIndex + 1, total: mockQuestions.length }
          };
        }
        return { success: false, message: 'Brak dostępnych fraz do quizu' };

      case 'check_answer':
        const question = mockQuestions[questionIndex];
        const correct = data.answer.toLowerCase() === question.correct_answer.toLowerCase();
        return {
          success: true,
          correct,
          correct_answer: question.correct_answer,
          translation: question.translation,
          progress: { current: questionIndex + 1, total: mockQuestions.length }
        };

      case 'next_question':
        const nextIndex = questionIndex + 1;
        if (nextIndex < mockQuestions.length) {
          return {
            success: true,
            question: mockQuestions[nextIndex],
            progress: { current: nextIndex + 1, total: mockQuestions.length }
          };
        }
        return { success: false, message: 'Koniec pytań' };

      default:
        return { success: false, message: 'Nieznana akcja' };
    }
  };

  // Rozpocznij quiz
  const startQuiz = async () => {
    try {
      const data = await apiCall('get_question');
      if (data.success && data.question && data.progress) {
        setQuizProgress(data.progress);
        displayQuestion(data.question);
      } else {
        alert(data.message || 'Błąd ładowania pytania');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Błąd połączenia z serwerem');
    }
  };

  // Wyświetl pytanie
  const displayQuestion = (question: QuizQuestion) => {
    setCurrentQuestion(question);
    setAnswered(false);
    setSelectedOption(null);
    setSelectedAnswer('');
    setShowCorrectAnswer(false);
    setIsCorrect(false);
  };

  // Wybierz odpowiedź
  const selectAnswer = (answer: string, buttonRef: HTMLButtonElement | null) => {
    if (answered) return;

    setSelectedOption({ button: buttonRef, answer });
    setSelectedAnswer(answer);
  };

  // Sprawdź odpowiedź
  const checkAnswer = async () => {
    if (!selectedOption || !currentQuestion) {
      alert('Wybierz odpowiedź!');
      return;
    }

    try {
      const data = await apiCall('check_answer', { answer: selectedOption.answer });
      if (data.success) {
        setAnswered(true);
        setShowCorrectAnswer(true);
        setIsCorrect(data.correct || false);
        
        if (data.progress) {
          setQuizProgress(data.progress);
        }
      } else {
        alert(data.message || 'Błąd sprawdzania odpowiedzi');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Błąd połączenia z serwerem');
    }
  };

  // Następne pytanie
  const nextQuestion = async () => {
    try {
      const data = await apiCall('next_question');
      if (data.success && data.question) {
        setQuestionIndex(prev => prev + 1);
        if (data.progress) {
          setQuizProgress(data.progress);
        }
        displayQuestion(data.question);
      } else {
        alert(data.message || 'Koniec pytań');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Błąd ładowania następnego pytania');
    }
  };

  // Aktualizuj progress bar
  const getProgressPercentage = (): number => {
    return quizProgress.total > 0 ? (quizProgress.current / quizProgress.total) * 100 : 0;
  };

  // Renderuj opcje odpowiedzi
  const renderOptions = () => {
    if (!currentQuestion) return null;

    return currentQuestion.options.map((option, index) => {
      let buttonClass = 'w-full max-w-sm h-[50px] bg-white text-[#4EB59B] font-bold text-[14px] rounded-2xl transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lg';
      
      if (answered) {
        if (option === selectedOption?.answer) {
          if (isCorrect) {
            buttonClass = 'w-full max-w-sm h-[50px] bg-green-500 text-white font-bold text-[14px] rounded-2xl ring-2 ring-green-300';
          } else {
            buttonClass = 'w-full max-w-sm h-[50px] bg-red-500 text-white font-bold text-[14px] rounded-2xl ring-2 ring-red-300';
          }
        } else if (option === currentQuestion.correct_answer && !isCorrect) {
          buttonClass = 'w-full max-w-sm h-[50px] bg-green-500 text-white font-bold text-[14px] rounded-2xl ring-2 ring-green-300';
        } else {
          buttonClass = 'w-full max-w-sm h-[50px] bg-white text-gray-600 font-bold text-[14px] rounded-2xl';
        }
      } else if (selectedOption?.answer === option) {
        buttonClass += ' ring-2 ring-emerald-300';
      }

      return (
        <button
          key={index}
          className={buttonClass}
          onClick={(e) => selectAnswer(option, e.currentTarget)}
          disabled={answered}
        >
          {option}
        </button>
      );
    });
  };

  // Renderuj przycisk sprawdź/dalej
  const renderCheckButton = () => {
    const hasSelectedAnswer = selectedOption !== null;
    const buttonText = answered ? 'Dalej' : 'Sprawdź';
    const handleClick = answered ? nextQuestion : checkAnswer;
    
    let buttonClass;
    if (!hasSelectedAnswer && !answered) {
      // Stan początkowy - opacity 70%
      buttonClass = 'w-full max-w-sm h-[50px] bg-white bg-opacity-70 text-[#4EB59B] text-opacity-70 font-bold text-[14px] rounded-2xl transition-all duration-200 ease-out disabled:cursor-not-allowed';
    } else {
      // Pełna opacity po wybraniu odpowiedzi lub po odpowiedzi
      buttonClass = 'w-full max-w-sm h-[50px] bg-white text-[#4EB59B] font-bold text-[14px] rounded-2xl transition-all duration-200 ease-out hover:bg-emerald-700 hover:-translate-y-px';
    }

    return (
      <button
        className={buttonClass}
        onClick={handleClick}
        disabled={!hasSelectedAnswer && !answered}
      >
        {buttonText}
      </button>
    );
  };

  // Renderuj tekst pytania z luką
  const renderQuestionText = () => {
    if (!currentQuestion) return 'Ładowanie pytania...';

    const sentenceWithGap = currentQuestion.sentence.replace('___', 
      `<span class="border-b-[0.5px] border-white border-solid min-w-[80px] inline-block text-center">
        <span class="${selectedAnswer ? 'text-white' : 'text-transparent'}">${selectedAnswer || '_____'}</span>
      </span>`
    );

    return <div dangerouslySetInnerHTML={{ __html: sentenceWithGap }} />;
  };

  // Rozpocznij quiz po załadowaniu komponentu
  useEffect(() => {
    startQuiz();
  }, []);

  return (
    <div className="min-h-screen flex flex-col" style={{
      backgroundImage: "url('../../../images/bg.png')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed'
    }}>
      {/* Header */}
      <div className="flex items-center justify-between text-white mt-14 px-8">
        <button className="hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors">
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </button>
        <div className="bg-white bg-opacity-30 rounded-xl h-2.5 w-52 overflow-hidden">
          <div 
            className="bg-white h-full rounded-xl transition-all duration-300 ease-out"
            style={{ width: `${getProgressPercentage()}%` }}
          ></div>
        </div>
        <div className="w-8"></div> {/* Spacer dla symetrii */}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col mt-16">
        {/* Question Container */}
        <div className="flex flex-col px-4 sm:px-6 max-w-sm mx-auto w-full">
          <h2 className="text-white text-2xl font-medium mb-4">Wypełnij lukę</h2>
          <div className="text-white text-sm leading-relaxed font-thin mb-4">
            {renderQuestionText()}
          </div>
        </div>

        {/* Options */}
        <div className="space-y-4 mb-8 mt-20 flex flex-col items-center px-4 sm:px-6">
          {renderOptions()}
        </div>

        {/* Check Button */}
        <div className="mt-auto pb-8 flex justify-center px-4 sm:px-6">
          {renderCheckButton()}
        </div>
      </div>
    </div>
  );
};

export default GapFillerQuiz;