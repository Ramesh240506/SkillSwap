import React from "react";

interface DashboardCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode | string;
  trend?: {
    value: number;
    label: string;
  };
  variant?: "default" | "primary" | "accent" | "success" | "warning";
  className?: string;
}

export function DashboardCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  className,
}: DashboardCardProps) {
  return (
    <div className={`bg-gray-900 border border-yellow-500 rounded-lg p-6 ${className || ""}`}>
      <div className="flex items-start justify-between mb-4">
        {icon && (
          <div className="w-12 h-12 bg-yellow-500 bg-opacity-20 rounded-lg flex items-center justify-center">
            {typeof icon === "string" ? (
              <span className="text-2xl">{icon}</span>
            ) : (
              icon
            )}
          </div>
        )}
        {trend && (
          <span className={`text-xs font-semibold px-2 py-1 rounded ${trend.value >= 0 ? "bg-green-700 text-green-200" : "bg-red-700 text-red-200"}`}>
            {trend.value >= 0 ? "+" : ""}
            {trend.value}% {trend.label}
          </span>
        )}
      </div>

      <div>
        <p className="text-sm text-yellow-400 mb-1">{title}</p>
        <p className="text-3xl font-bold text-white mb-1">{value}</p>
        {subtitle && (
          <p className="text-sm text-gray-400">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
