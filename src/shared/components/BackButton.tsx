import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  fallbackTo: string;
  label?: string;
  className?: string;
  onClick?: () => void;
}

export default function BackButton({ fallbackTo, label = "Back", className = "", onClick }: BackButtonProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    navigate(location.state?.from ?? fallbackTo);
  };

  return (
    <button
      onClick={onClick ?? handleBack}
      className={`flex items-center gap-2 px-4 py-2 bg-card text-secondary-foreground hover:text-foreground 
                  hover:bg-secondary rounded-lg transition-all group 
                  border border-border
                  outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background
                  ${className}`}
    >
      <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
      {label}
    </button>
  );
}