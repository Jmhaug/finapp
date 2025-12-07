"use client";

import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "orange" | "blue" | "yellow" | "green";
  onClick?: () => void;
}

const variantStyles = {
  default: "bg-card",
  orange: "bg-gradient-to-br from-accent-orange/20 to-accent-orange/5 border border-accent-orange/20",
  blue: "bg-gradient-to-br from-accent-blue/20 to-accent-blue/5 border border-accent-blue/20",
  yellow: "bg-gradient-to-br from-accent-yellow/20 to-accent-yellow/5 border border-accent-yellow/20",
  green: "bg-gradient-to-br from-accent-green/20 to-accent-green/5 border border-accent-green/20",
};

export function Card({ children, className = "", variant = "default", onClick }: CardProps) {
  return (
    <div
      className={`rounded-2xl p-4 ${variantStyles[variant]} ${onClick ? "cursor-pointer hover:bg-card-hover transition-colors" : ""} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

export function CardHeader({ children, className = "" }: CardHeaderProps) {
  return (
    <div className={`flex items-center justify-between mb-3 ${className}`}>
      {children}
    </div>
  );
}

interface CardTitleProps {
  children: ReactNode;
  className?: string;
}

export function CardTitle({ children, className = "" }: CardTitleProps) {
  return (
    <h3 className={`text-sm font-medium text-secondary ${className}`}>
      {children}
    </h3>
  );
}

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export function CardContent({ children, className = "" }: CardContentProps) {
  return <div className={className}>{children}</div>;
}

interface CardValueProps {
  children: ReactNode;
  className?: string;
}

export function CardValue({ children, className = "" }: CardValueProps) {
  return (
    <p className={`text-2xl font-bold text-primary ${className}`}>
      {children}
    </p>
  );
}
