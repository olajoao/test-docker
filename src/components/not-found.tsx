import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NotFoundProps {
  title?: string;
  description?: string;
  showHomeButton?: boolean;
  homeButtonText?: string;
  onHomeClick?: () => void;
}

export const NotFound = ({
  title = "404",
  description = "Oops! Esta página não existe",
  showHomeButton = false,
  homeButtonText = "Voltar para Home",
  onHomeClick,
}: NotFoundProps) => {
  const handleHomeClick = () => {
    if (onHomeClick) {
      onHomeClick();
    } else {
      window.location.href = "/";
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center overflow-hidden px-4 bg-white dark:bg-gray-900">
      {/* Floating Elements */}
      <div className="absolute top-20 left-1/4 h-64 w-64 rounded-full bg-purple-200/30 dark:bg-purple-900/20 blur-3xl animate-float" />
      <div className="absolute bottom-20 right-1/4 h-80 w-80 rounded-full bg-blue-200/30 dark:bg-blue-900/20 blur-3xl animate-float" style={{ animationDelay: "1s" }} />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center animate-fade-in">
        {/* 404 Title */}
        <h1
          className="mb-4 text-8xl font-extrabold tracking-tighter bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent md:text-9xl animate-fade-in"
          style={{ animationDelay: "0.1s" }}
        >
          {title}
        </h1>

        {/* Description */}
        <p
          className="mb-2 max-w-md text-xl font-medium text-gray-900 dark:text-white md:text-2xl animate-fade-in"
          style={{ animationDelay: "0.2s" }}
        >
          {description}
        </p>

        <p
          className="mb-8 max-w-lg text-sm text-gray-600 dark:text-gray-400 md:text-base animate-fade-in"
          style={{ animationDelay: "0.3s" }}
        >
          A página que você está procurando não foi encontrada ou não existe
        </p>

        {/* Home Button */}
        {showHomeButton && (
          <Button
            onClick={handleHomeClick}
            size="lg"
            className="group relative overflow-hidden bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 dark:from-purple-500 dark:to-blue-500 dark:hover:from-purple-600 dark:hover:to-blue-600 text-white shadow-lg hover:shadow-xl transition-all hover:scale-105 animate-fade-in"
            style={{ animationDelay: "0.4s" }}
          >
            <span className="relative z-10 flex items-center gap-2">
              <Home className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
              {homeButtonText}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
          </Button>
        )}
      </div>
    </div>
  );
};

