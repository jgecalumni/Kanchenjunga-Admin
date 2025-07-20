"use client";

import * as React from "react";

interface ThemeProviderProps {
  children: React.ReactNode;
  attribute?: "class" | "data-theme";
  defaultTheme?: string;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  return <>{children}</>;
}
