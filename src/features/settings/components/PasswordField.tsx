import React from "react";

interface PasswordFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showPassword?: boolean;
  autoComplete?: string;
  error?: string;
}

export const PasswordField: React.FC<PasswordFieldProps> = ({
  id,
  label,
  value,
  onChange,
  showPassword = false,
  autoComplete = "off",
  error,
}) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm text-gray-300 mb-2">
        {label}
      </label>
      <input
        id={id}
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        className={`w-full bg-gray-900 border rounded-lg px-4 py-2.5 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-500 ${
          error ? "border-red-600" : "border-gray-600"
        }`}
      />
      {error && <p className="mt-1.5 text-sm text-red-400">{error}</p>}
    </div>
  );
};