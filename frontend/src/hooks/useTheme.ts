// useTheme hook
import { useEffect, useState } from "react";

export function useTheme() {
  const [theme, setTheme] = useState<
    "dark" | "light"
  >("dark");

  useEffect(() => {
    document.documentElement.classList.remove(
      "light",
      "dark"
    );

    document.documentElement.classList.add(
      theme
    );
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) =>
      prev === "dark" ? "light" : "dark"
    );
  };

  return {
    theme,

    toggleTheme,
  };
}