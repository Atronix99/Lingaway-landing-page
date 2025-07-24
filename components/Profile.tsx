"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

// Types
type Screen = "main" | "settings" | "not-logged" | "subscription" | "theme";

interface MenuItemProps {
  iconSrc: string;
  text: string;
  onClick?: () => void;
  isDark?: boolean;
}

interface FeatureItemProps {
  text: string;
  isDark?: boolean;
}

interface NavItemProps {
  iconSrc: string;
  text: string;
  isActive?: boolean;
  onClick?: () => void;
  isDark?: boolean;
}

interface User {
  name: string;
  email: string;
}

type Theme = "light" | "dark";

// Reusable Components
const MenuItem: React.FC<MenuItemProps> = ({ iconSrc, text, onClick, isDark = false }) => (
  <div
    className={`${
      isDark 
        ? "bg-slate-800/90 border-slate-700/50 hover:bg-slate-700/95" 
        : "bg-white/90 border-white/20 hover:bg-white/95"
    } backdrop-blur-sm rounded-xl p-4 flex items-center justify-between cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg border`}
    onClick={onClick}
  >
    <div className="flex items-center gap-3">
      <Image
        src={iconSrc}
        alt={text}
        width={24}
        height={24}
        className="flex-shrink-0"
      />
      <span className={`${isDark ? "text-white" : "text-slate-800"} font-medium text-base`}>{text}</span>
    </div>
    <div className={`w-5 h-5 ${isDark ? "text-slate-400" : "text-slate-400"}`}>
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5l7 7-7 7"
        />
      </svg>
    </div>
  </div>
);

const FeatureItem: React.FC<FeatureItemProps> = ({ text, isDark = false }) => (
  <div className={`${
    isDark 
      ? "bg-slate-800/90 border-slate-700/50 hover:bg-slate-700/95" 
      : "bg-white/90 border-white/20 hover:bg-white/95"
  } backdrop-blur-sm rounded-xl p-4 flex items-center gap-3 border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg`}>
    <div className="w-6 h-6 bg-teal-400/10 rounded-full flex items-center justify-center flex-shrink-0">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path
          d="M20 6L9 17L4 12"
          stroke="#4ECDC4"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
    <span className={`${isDark ? "text-white" : "text-slate-800"} font-medium text-sm`}>{text}</span>
  </div>
);

const NavItem: React.FC<NavItemProps> = ({
  iconSrc,
  text,
  isActive = false,
  onClick,
  isDark = false,
}) => (
  <div
    className={`flex flex-col items-center gap-1 cursor-pointer transition-all duration-200 p-3 md:p-4 rounded-lg ${
      isActive ? "bg-teal-400/10" : ""
    }`}
    onClick={onClick}
  >
    <Image
      src={iconSrc}
      alt={text}
      width={24}
      height={24}
      className={`${isActive ? "opacity-100" : "opacity-60"}`}
    />
    <span
      className={`text-xs md:text-sm font-medium ${
        isActive 
          ? "text-teal-400" 
          : isDark 
            ? "text-slate-300" 
            : "text-slate-500"
      }`}
    >
      {text}
    </span>
  </div>
);

const BackButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button
    className="p-2 rounded-lg transition-colors hover:bg-white/10"
    onClick={onClick}
  >
    <div className="w-6 h-6 text-white">
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 19l-7-7 7-7"
        />
      </svg>
    </div>
  </button>
);

// Main Component
const Profile: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>("main");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("theme") as Theme) || "light";
    }
    return "light";
  });
  const router = useRouter();

  React.useEffect(() => {
    // Apply theme to document body
    if (theme === "dark") {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Determine if dark mode is active
  const isDarkMode = theme === "dark";

  const user: User = {
    name: "Imię Nazwisko",
    email: "imienazwisko@example.com",
  };

  const handleNavigation = (screen: Screen) => {
    setCurrentScreen(screen);
  };

  const handleNavigationExternal = (route: string) => {
    router.push(route);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentScreen("not-logged");
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    setCurrentScreen("main");
  };

  const goBack = () => {
    setCurrentScreen("main");
  };

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  // Screen Components
  const MainScreen: React.FC = () => (
    <div className="flex flex-col flex-1 p-5 md:p-8 md:ml-32">
      <div className="text-center md:text-left md:flex md:items-center md:gap-10 mb-10 pt-10 md:pt-0">
        <div className="w-20 h-20 md:w-32 md:h-32 mx-auto md:mx-0 mb-8 md:mb-0 rounded-full bg-gradient-to-br from-orange-400 to-orange-600"></div>
        <div>
          <h1 className="text-white text-2xl md:text-4xl font-semibold mb-1">
            {user.name}
          </h1>
          <p className="text-white/80 text-sm md:text-lg">{user.email}</p>
        </div>
      </div>

      <div className="flex-1 space-y-3 md:grid md:grid-cols-2 md:gap-6 md:space-y-0 max-w-4xl">
        <MenuItem
          iconSrc="/images/sub.svg"
          text="Subskrypcja"
          onClick={() => handleNavigation("subscription")}
          isDark={isDarkMode}
        />
        <MenuItem
          iconSrc="/images/motive.svg"
          text="Motywy"
          onClick={() => handleNavigation("theme")}
          isDark={isDarkMode}
        />
        <MenuItem
          iconSrc="/images/settings.svg"
          text="Ustawienia"
          onClick={() => handleNavigation("settings")}
          isDark={isDarkMode}
        />
      </div>
    </div>
  );

  const SettingsScreen: React.FC = () => (
  <div className="flex flex-col flex-1 p-5 md:p-8 md:ml-32">
    <div className="flex items-center mb-8 pt-5 md:pt-0">
      <BackButton onClick={goBack} />
      <h2 className="text-white text-xl md:text-3xl font-semibold ml-3">
        Ustawienia
      </h2>
    </div>

    <div className="flex-1 max-w-4xl">
      <div className="mb-8">
        <h3 className="text-white text-lg md:text-xl font-semibold mb-4">
          Konto
        </h3>
        <div className="space-y-3 md:grid md:grid-cols-2 md:gap-6 md:space-y-0">
          <MenuItem 
            iconSrc="/images/profile.svg" 
            text="Profil i dane osobowe" 
            isDark={isDarkMode} 
          />
          <MenuItem 
            iconSrc="/images/security.svg" 
            text="Bezpieczeństwo i logowanie" 
            isDark={isDarkMode} 
          />
          <MenuItem 
            iconSrc="/images/language.svg" 
            text="Języki i cele nauki" 
            isDark={isDarkMode} 
          />
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-white text-lg md:text-xl font-semibold mb-4">
          Pomoc
        </h3>
        <div className="space-y-3 md:grid md:grid-cols-2 md:gap-6 md:space-y-0">
          <MenuItem 
            iconSrc="/images/help.svg" 
            text="Centrum pomocy / FAQ" 
            isDark={isDarkMode} 
          />
          <MenuItem 
            iconSrc="/images/contact.svg" 
            text="Zgłoś problem / Kontakt z nami" 
            isDark={isDarkMode} 
          />
        </div>
      </div>
    </div>

    <button
      className={`${
        isDarkMode 
          ? "bg-slate-800/90 hover:bg-slate-700/95 border-slate-700/50" 
          : "bg-white/90 hover:bg-white/95 border-white/20"
      } backdrop-blur-sm rounded-xl p-4 w-full md:w-auto md:max-w-sm text-red-500 font-medium transition-all duration-200 hover:-translate-y-0.5 mb-20 md:mb-8 border`}
      onClick={handleLogout}
    >
      Wyloguj się
    </button>
  </div>
);

  const NotLoggedScreen: React.FC = () => (
    <div className="flex flex-col justify-center items-center flex-1 text-center p-10 md:p-20">
      <p className="text-white text-lg md:text-2xl mb-8 font-medium">
        Nie jesteś zalogowany
      </p>
      <button
        className={`${
          isDarkMode 
            ? "bg-slate-800/90 hover:bg-slate-700/95 border-slate-700/50 text-white" 
            : "bg-white/90 hover:bg-white/95 border-white/20 text-slate-800"
        } backdrop-blur-sm rounded-xl px-10 py-4 font-medium transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg border`}
        onClick={handleLogin}
      >
        Załóż konto
      </button>
    </div>
  );

  const SubscriptionScreen: React.FC = () => (
    <div className="flex flex-col flex-1 p-5 md:p-8 md:ml-32">
      <div className="flex items-center mb-8 pt-5 md:pt-0">
        <BackButton onClick={goBack} />
        <h2 className="text-white text-xl md:text-3xl font-semibold ml-3">
          Subskrypcja Pro
        </h2>
      </div>

      {/* Desktop layout - two columns */}
      <div className="hidden md:flex flex-1 gap-12 max-w-6xl">
        {/* Left column - Features */}
        <div className="flex-1 max-w-lg">
          <div className="mb-8">
            <div className="inline-block bg-gradient-to-r from-yellow-400 to-orange-500 text-slate-800 px-4 py-1.5 rounded-full text-xs font-bold tracking-wider mb-4">
              PRO
            </div>
            <h3 className="text-white text-3xl lg:text-4xl font-bold mb-3">
              Odblokuj pełny potencjał
            </h3>
            <p className="text-white/80 text-lg">
              Dostęp do wszystkich funkcji premium
            </p>
          </div>

          <div className="mb-8">
            <h4 className="text-white text-xl font-semibold mb-6">
              Co otrzymasz:
            </h4>
            <div className="space-y-4">
              <FeatureItem text="Nieograniczona możliwość nauki" isDark={isDarkMode} />
              <FeatureItem text="Ulepszone modele językowe" isDark={isDarkMode} />
              <FeatureItem text="Pakiet Dzieci+" isDark={isDarkMode} />
              <FeatureItem text="Wsparcie priorytetowe" isDark={isDarkMode} />
              <FeatureItem text="Zaawansowane statystyki" isDark={isDarkMode} />
            </div>
          </div>
        </div>

        {/* Right column - Pricing and CTA */}
        <div className="flex-1 max-w-md flex flex-col items-center justify-center">
          <div className={`${
            isDarkMode 
              ? "bg-slate-800/20 border-slate-700/30" 
              : "bg-white/5 border-white/20"
          } backdrop-blur-sm rounded-3xl p-8 border w-full text-center mb-8`}>
            <div className={`${
              isDarkMode 
                ? "bg-slate-700/30 border-slate-600/30" 
                : "bg-white/10 border-white/20"
            } backdrop-blur-sm rounded-2xl p-6 inline-block border mb-6`}>
              <div className="text-white text-5xl lg:text-6xl font-bold">
                3$
              </div>
              <div className="text-white/70 text-lg mt-2">/ miesięcznie</div>
            </div>

            <button className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl px-8 py-4 w-full text-slate-800 font-semibold transition-all duration-200 hover:-translate-y-0.5 shadow-lg hover:shadow-xl mb-4 text-lg">
              Rozpocznij subskrypcję Pro
            </button>
            <p className="text-white/70 text-sm">Anuluj w dowolnym momencie</p>
          </div>

          {/* Additional benefits card */}
          <div className={`${
            isDarkMode 
              ? "bg-gradient-to-br from-teal-400/10 to-blue-400/10 border-slate-700/30" 
              : "bg-gradient-to-br from-teal-400/10 to-blue-400/10 border-white/20"
          } backdrop-blur-sm rounded-2xl p-6 border w-full text-center`}>
            <div className="text-white font-semibold mb-2">
              🎯 Gwarancja zwrotu
            </div>
            <p className="text-white/80 text-sm">
              30 dni na przetestowanie bez ryzyka
            </p>
          </div>
        </div>
      </div>

      {/* Mobile layout - single column */}
      <div className="md:hidden flex flex-col flex-1 gap-5 pb-25 max-w-md mx-auto">
        <div className="text-center mb-5">
          <div className="inline-block bg-gradient-to-r from-yellow-400 to-orange-500 text-slate-800 px-4 py-1.5 rounded-full text-xs font-bold tracking-wider mb-4">
            PRO
          </div>
          <h3 className="text-white text-2xl font-bold mb-2">
            Odblokuj pełny potencjał
          </h3>
          <p className="text-white/80 text-sm">
            Dostęp do wszystkich funkcji premium
          </p>
        </div>

        <div className="text-center mb-8">
          <div className={`${
            isDarkMode 
              ? "bg-slate-700/30 border-slate-600/30" 
              : "bg-white/10 border-white/20"
          } backdrop-blur-sm rounded-2xl p-5 inline-block border`}>
            <div className="text-white text-4xl font-bold">3$</div>
            <div className="text-white/70 text-sm mt-1">/ miesięcznie</div>
          </div>
        </div>

        <div className="flex-1">
          <h4 className="text-white text-lg font-semibold mb-4">
            Co otrzymasz:
          </h4>
          <div className="space-y-3">
            <FeatureItem text="Nieograniczona możliwość nauki" isDark={isDarkMode} />
            <FeatureItem text="Ulepszone modele językowe" isDark={isDarkMode} />
            <FeatureItem text="Pakiet Dzieci+" isDark={isDarkMode} />
            <FeatureItem text="Wsparcie priorytetowe" isDark={isDarkMode} />
            <FeatureItem text="Zaawansowane statystyki" isDark={isDarkMode} />
          </div>
        </div>

        <div className="text-center mt-auto">
          <button className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl px-10 py-4 w-full text-slate-800 font-semibold transition-all duration-200 hover:-translate-y-0.5 shadow-lg hover:shadow-xl mb-3">
            Rozpocznij subskrypcję Pro
          </button>
          <p className="text-white/70 text-xs">Anuluj w dowolnym momencie</p>
        </div>
      </div>
    </div>
  );

  // Theme selection screen
  const ThemeScreen: React.FC = () => (
    <div className="flex flex-col flex-1 p-5 md:p-8 md:ml-32">
      <div className="flex items-center mb-8 pt-5 md:pt-0">
        <BackButton onClick={goBack} />
        <h2 className="text-white text-xl md:text-3xl font-semibold ml-3">
          Motywy
        </h2>
      </div>
      <div className="flex flex-col gap-6 max-w-md mx-auto w-full">
        <button
          className={`rounded-xl p-5 text-lg font-semibold border transition-all duration-200 ${theme === "light" ? "bg-white text-slate-800 border-teal-400 shadow-lg" : "bg-white/80 text-slate-700 border-white/30 hover:bg-white/90"}`}
          onClick={() => handleThemeChange("light")}
        >
          Jasny (Biały)
          {theme === "light" && (
            <span className="ml-2 text-teal-400">(obecny)</span>
          )}
        </button>
        <button
          className={`rounded-xl p-5 text-lg font-semibold border transition-all duration-200 ${theme === "dark" ? "bg-slate-900 text-white border-teal-400 shadow-lg" : "bg-slate-900/80 text-white/80 border-white/30 hover:bg-slate-900/90"}`}
          onClick={() => handleThemeChange("dark")}
        >
          Ciemny (Czarny)
          {theme === "dark" && (
            <span className="ml-2 text-teal-400">(obecny)</span>
          )}
        </button>
      </div>
    </div>
  );

  const renderScreen = () => {
    if (!isLoggedIn) return <NotLoggedScreen />;
    switch (currentScreen) {
      case "settings":
        return <SettingsScreen />;
      case "subscription":
        return <SubscriptionScreen />;
      case "theme":
        return <ThemeScreen />;
      case "main":
      default:
        return <MainScreen />;
    }
  };

  return (
    <div className="fixed inset-0 h-screen w-screen overflow-hidden">
      {/* Background image */}
      <Image
        src="/images/bg.png"
        alt="Background"
        fill
        priority
        className="object-cover z-0"
      />

      {/* Background overlay */}
      <Image
        src="/images/background.svg"
        alt="Overlay"
        fill
        className="object-cover opacity-30 z-10"
      />

      {/* Main content */}
      <div className="relative z-20 h-full flex flex-col">{renderScreen()}</div>

      {/* Navigation - Only one navbar */}
      {isLoggedIn && (
        <>
          {/* Desktop Sidebar Navigation */}
          <div className={`hidden md:flex fixed top-0 left-0 w-28 h-full ${
            isDarkMode 
              ? "bg-slate-900/95 border-slate-700/50" 
              : "bg-white/95 border-white/20"
          } backdrop-blur-sm flex-col justify-start items-center pt-8 shadow-lg z-30 border-r`}>
            <div className="space-y-6">
              <NavItem
                iconSrc="/images/Vector.svg"
                text="Home"
                onClick={() => handleNavigation("/main-page")}
                isDark={isDarkMode}
              />
              <NavItem
                iconSrc="/images/add.svg"
                text="Add"
                onClick={() => handleNavigationExternal("/onboarding")}
                isDark={isDarkMode}
              />
              <NavItem
                iconSrc="/images/plus.svg"
                text="Cards"
                onClick={() => handleNavigationExternal("/course-page")}
                isDark={isDarkMode}
              />
              <NavItem
                iconSrc="/images/chat.svg"
                text="Chat"
                onClick={() => handleNavigationExternal("/chatpage")}
                isDark={isDarkMode}
              />
            </div>
          </div>

          {/* Mobile Bottom Navigation */}
          <div className={`md:hidden fixed bottom-0 left-0 right-0 ${
            isDarkMode 
              ? "bg-slate-900/95 border-slate-700/50" 
              : "bg-white/95 border-white/30"
          } backdrop-blur-sm p-3 rounded-t-3xl flex justify-around items-center border-t z-30`}>
            <NavItem
              iconSrc="/images/Vector.svg"
              text="Home"
              onClick={() => handleNavigation("/main-page")}
              isDark={isDarkMode}
            />
            <NavItem
              iconSrc="/images/add.svg"
              text="Add"
              onClick={() => handleNavigationExternal("/onboarding")}
              isDark={isDarkMode}
            />
            <NavItem
              iconSrc="/images/plus.svg"
              text="Cards"
              onClick={() => handleNavigationExternal("/course-page")}
              isDark={isDarkMode}
            />
            <NavItem
              iconSrc="/images/chat.svg"
              text="Chat"
              onClick={() => handleNavigationExternal("/chat")}
              isDark={isDarkMode}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;