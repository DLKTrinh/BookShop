import { useState } from "react";

interface DualRangeSliderProps {
  min: number;
  max: number;
  fromValue: number;
  toValue: number;
  onChange: (from: number, to: number) => void;
}

export default function DualRangeSlider({ min, max, fromValue, toValue, onChange }: DualRangeSliderProps) {
  const [activeThumb, setActiveThumb] = useState<"from" | "to" | null>(null);

  const percent = (value: number) => ((value - min) / (max - min || 1)) * 100;

  const fromPercent = percent(fromValue);
  const toPercent = percent(toValue);

  const thumbInputClass =
    "absolute inset-0 w-full appearance-none bg-transparent pointer-events-none " +
    "[&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none " +
    "[&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full " +
    "[&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-background " +
    "[&::-webkit-slider-thumb]:cursor-pointer " +
    "[&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none " +
    "[&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full " +
    "[&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-background " +
    "[&::-moz-range-thumb]:cursor-pointer";

  return (
    <div className="relative h-4 flex items-center">
      {/* Background track */}
      <div className="absolute inset-x-0 h-1.5 rounded-full bg-muted" />

      {/* Filled track between the two thumbs — makes the selected range visible at a glance */}
      <div
        className="absolute h-1.5 rounded-full bg-primary"
        style={{ left: `${fromPercent}%`, right: `${100 - toPercent}%` }}
      />

      <input
        type="range"
        min={min}
        max={max}
        value={fromValue}
        onMouseDown={() => setActiveThumb("from")}
        onTouchStart={() => setActiveThumb("from")}
        onChange={(e) => {
          const value = Math.min(Number(e.target.value), toValue);
          onChange(value, toValue);
        }}
        className={thumbInputClass}
        style={{ zIndex: activeThumb === "from" ? 30 : 20 }}
      />

      <input
        type="range"
        min={min}
        max={max}
        value={toValue}
        onMouseDown={() => setActiveThumb("to")}
        onTouchStart={() => setActiveThumb("to")}
        onChange={(e) => {
          const value = Math.max(Number(e.target.value), fromValue);
          onChange(fromValue, value);
        }}
        className={thumbInputClass}
        style={{ zIndex: activeThumb === "to" ? 30 : 20 }}
      />
    </div>
  );
}