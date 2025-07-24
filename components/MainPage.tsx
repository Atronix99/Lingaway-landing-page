import React, { useState, useRef, useEffect } from "react";
import { ChevronRight } from "lucide-react";
import { prisma } from "../lib/prisma";
import BottomNavigation from "./ui/BottomNavigation";

console.log(prisma);

const MainPage = () => {
  const [activeNavItem, setActiveNavItem] = useState(0);
  const carouselRef = useRef(null);

  // Center carousel on mount
  useEffect(() => {
    if (carouselRef.current) {
      const carousel = carouselRef.current;
      const containerWidth = carousel.offsetWidth;
      const scrollWidth = carousel.scrollWidth;
      const centerPosition = (scrollWidth - containerWidth) / 2;

      carousel.scrollTo({
        left: centerPosition,
        behavior: "smooth",
      });
    }
  }, []);

  const handleContinueLesson = (language) => {
    console.log(`Continuing ${language} lesson...`);
  };

  const handleProfileClick = () => {
    console.log("Navigate to profile...");
  };

  const handleOnboardingClick = () => {
    console.log("Navigate to onboarding...");
  };

  // Course data
  const courses = [
    {
      id: 1,
      language: "Francuski",
      flag: (
        <svg viewBox="0 0 128 128" className="w-full h-full">
          <rect x="0" y="0" width="42.67" height="128" fill="#0052B4" />
          <rect x="42.67" y="0" width="42.67" height="128" fill="#FFFFFF" />
          <rect x="85.33" y="0" width="42.67" height="128" fill="#D80027" />
        </svg>
      ),
      progress: 28,
      phrases: 235,
    },
    {
      id: 2,
      language: "Angielski",
      flag: (
        <div className="w-full h-full bg-gradient-to-br from-blue-600 via-white to-red-600 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-blue-800 font-bold text-sm">UK</div>
          </div>
        </div>
      ),
      progress: 45,
      phrases: 412,
    },
    {
      id: 3,
      language: "Niemiecki",
      flag: (
        <svg viewBox="0 0 128 128" className="w-full h-full">
          <rect x="0" y="0" width="128" height="42.67" fill="#000000" />
          <rect x="0" y="42.67" width="128" height="42.67" fill="#D80027" />
          <rect x="0" y="85.33" width="128" height="42.67" fill="#FFDA44" />
        </svg>
      ),
      progress: 62,
      phrases: 318,
    },
  ];

  return (
    <div className="min-h-screen font-sans relative overflow-hidden">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600"></div>

      <div className="relative z-10 w-full mx-auto min-h-screen">
        {/* Active Courses Section */}
        <div className="mb-8 pt-8">
          <h2 className="text-white text-lg font-semibold px-6 mb-6 opacity-90">
            Twoje aktywne kursy
          </h2>

          {/* Horizontal Carousel */}
          <div
            ref={carouselRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory"
          >
            {/* Left padding for centering */}
            <div className="flex-shrink-0 w-16"></div>

            {courses.map((course, index) => (
              <div
                key={course.id}
                className="flex-shrink-0 w-64 bg-gray-50 rounded-2xl shadow-lg animate-fadeIn snap-center transform transition-transform hover:scale-105"
                style={{
                  animationDelay: `${index * 0.1}s`,
                  opacity: 0,
                  animation: `fadeIn 0.6s ease-out forwards ${index * 0.1}s`,
                }}
              >
                <div className="p-6">
                  {/* Flag */}
                  <div className="flex justify-center mb-4">
                    <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 shadow-md">
                      {course.flag}
                    </div>
                  </div>

                  {/* Language Info */}
                  <div className="text-center mb-6">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <span className="text-gray-900 font-semibold text-lg">
                        {course.language}
                      </span>
                      <ChevronRight className="w-3 h-3 text-gray-400" />
                      <span className="text-gray-500 text-sm font-semibold">
                        Polski
                      </span>
                    </div>
                  </div>

                  {/* Progress Info */}
                  <div className="mb-6">
                    <p className="text-gray-500 text-sm mb-2">
                      {course.phrases} Zwrotów
                    </p>
                    <div className="w-full h-3.5 bg-white rounded-full shadow-inner">
                      <div
                        className="h-3.5 bg-emerald-500 rounded-full transition-all duration-500 ease-out shadow-sm"
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Continue Button */}
                  <button
                    onClick={() => handleContinueLesson(course.language)}
                    className="w-full bg-emerald-500 text-white font-bold text-sm py-3 rounded-2xl shadow-lg transition-all duration-200 hover:scale-105 hover:bg-emerald-600 active:scale-95"
                  >
                    Kontynuuj
                  </button>
                </div>
              </div>
            ))}

            {/* Right padding for centering */}
            <div className="flex-shrink-0 w-16"></div>
          </div>
        </div>

        {/* Recent Courses Section */}
        <div className="px-6 mb-32">
          <h2 className="text-white text-lg font-semibold mb-6 opacity-90">
            Twoje ostatnie kursy
          </h2>

          {/* Grid changed to be responsive */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-2xl h-36 shadow-lg flex items-center justify-center">
              <div className="text-gray-400 text-center">
                <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-2"></div>
                <p className="text-sm">Kurs wkrótce</p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-2xl h-36 shadow-lg flex items-center justify-center">
              <div className="text-gray-400 text-center">
                <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-2"></div>
                <p className="text-sm">Kurs wkrótce</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <BottomNavigation
          activeItem={activeNavItem}
          setActiveItem={setActiveNavItem}
        />
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default MainPage;
