"use client";

import { formatCurrency } from "@/lib/utils/calculations";

interface TooltipPayload {
  value: number;
  dataKey: string;
  payload: Record<string, unknown>;
}

interface ChartTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
  labelFormatter?: (label: string, payload: Record<string, unknown>) => string;
  valueFormatter?: (value: number) => string;
  valueLabel?: string;
  accentColor?: string | ((payload: Record<string, unknown>) => string);
}

export function ChartTooltip({
  active,
  payload,
  label,
  labelFormatter,
  valueFormatter = formatCurrency,
  valueLabel,
  accentColor = "#32D74B",
}: ChartTooltipProps) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const data = payload[0];
  const displayLabel = labelFormatter
    ? labelFormatter(label || "", data.payload)
    : label;

  const color = typeof accentColor === "function"
    ? accentColor(data.payload)
    : accentColor;

  return (
    <div className="bg-[#1C1C1E]/95 border border-[#3A3A3C] rounded-2xl p-4 shadow-2xl backdrop-blur-md min-w-[120px]">
      {displayLabel && (
        <p className="text-[11px] text-[#8E8E93] uppercase tracking-wider font-medium mb-2">
          {displayLabel}
        </p>
      )}
      <div className="flex items-center gap-2.5">
        <div
          className="w-3 h-3 rounded-full shadow-lg"
          style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}40` }}
        />
        <span className="text-white font-bold text-xl tracking-tight">
          {valueFormatter(data.value)}
        </span>
      </div>
      {valueLabel && (
        <p className="text-[11px] text-[#636366] mt-1.5">{valueLabel}</p>
      )}
    </div>
  );
}

interface MultiValueTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    dataKey: string;
    name: string;
    color: string;
  }>;
  label?: string;
  labelFormatter?: (label: string) => string;
  valueFormatter?: (value: number) => string;
}

export function MultiValueTooltip({
  active,
  payload,
  label,
  labelFormatter,
  valueFormatter = formatCurrency,
}: MultiValueTooltipProps) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const displayLabel = labelFormatter ? labelFormatter(label || "") : label;

  return (
    <div className="bg-[#1C1C1E]/95 border border-[#3A3A3C] rounded-2xl p-4 shadow-2xl backdrop-blur-md min-w-[160px]">
      {displayLabel && (
        <p className="text-[11px] text-[#8E8E93] uppercase tracking-wider font-medium mb-3 pb-2 border-b border-[#3A3A3C]">
          {displayLabel}
        </p>
      )}
      <div className="space-y-2">
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: entry.color, boxShadow: `0 0 6px ${entry.color}40` }}
              />
              <span className="text-xs text-[#8E8E93]">{entry.name}</span>
            </div>
            <span className="text-white font-semibold text-sm">
              {valueFormatter(entry.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
