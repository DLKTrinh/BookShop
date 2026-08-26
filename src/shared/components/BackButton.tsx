import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  /** Where to go if there's no "from" location in router state (e.g. direct link/refresh) */
  fallbackTo: string;
  label?: string;
  className?: string;
}

export default function BackButton({ fallbackTo, label = "Back", className = "" }: BackButtonProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    navigate(location.state?.from ?? fallbackTo);
  };

  return (
    <button
      onClick={handleBack}
      className={`flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-white 
                  hover:bg-gray-800 rounded-lg transition-all group 
                  border border-gray-700
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900
                  ${className}`}
    >
      <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
      {label}
    </button>
  );
}