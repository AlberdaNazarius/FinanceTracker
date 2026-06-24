"use client";

import { useCallback, useSyncExternalStore } from "react";

export type ThemeMode = "light" | "dark" | "system";

const THEME_EVENT = "themechange";

function prefersDark() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function subscribe(callback: () => void) {
  const mq = window.matchMedia("(prefers-color-scheme: dark)");

  const onSystemChange = () => {
    if (getMode() === "system") {
      document.documentElement.classList.toggle("dark", mq.matches);
    }
    callback();
  };

  window.addEventListener(THEME_EVENT, callback);
  mq.addEventListener("change", onSystemChange);

  return () => {
    window.removeEventListener(THEME_EVENT, callback);
    mq.removeEventListener("change", onSystemChange);
  };
}

function getMode(): ThemeMode {
  const stored = localStorage.getItem("theme");
  return stored === "dark" || stored === "light" ? stored : "system";
}

function applyMode(mode: ThemeMode) {
  if (mode === "system") {
    localStorage.removeItem("theme");
    document.documentElement.classList.toggle("dark", prefersDark());
  } else {
    localStorage.setItem("theme", mode);
    document.documentElement.classList.toggle("dark", mode === "dark");
  }

  window.dispatchEvent(new Event(THEME_EVENT));
}

export function useTheme() {
  const mode = useSyncExternalStore(
    subscribe,
    getMode,
    () => "system" as ThemeMode
  );

  const setMode = useCallback((next: ThemeMode) => applyMode(next), []);

  return { mode, setMode };
}
