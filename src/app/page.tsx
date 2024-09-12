"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { toast } from "react-toastify";

export default function Home() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("http://65.2.168.94:8000/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "An error occurred while shortening the URL."
        );
      }

      setMessage(data.message);
      setShortUrl(data.shortUrl);
      toast.success("URL shortened successfully!");
    } catch (error) {
      if (error instanceof Error) {
        setMessage(error.message);
        toast.error(error.message);
      } else {
        setMessage("An unexpected error occurred. Please try again.");
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setUrl("");
    setShortUrl("");
    setMessage("");
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 transition-colors duration-300 ease-in-out bg-secondary-100 dark:bg-secondary-900">
      <button
        onClick={toggleTheme}
        className="absolute top-4 right-4 p-2 rounded-full bg-secondary-200 dark:bg-secondary-800 text-secondary-800 dark:text-secondary-200 transition-colors duration-300 ease-in-out hover:bg-secondary-300 dark:hover:bg-secondary-700"
        aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      >
        {theme === "dark" ? (
          <Sun className="w-6 h-6" />
        ) : (
          <Moon className="w-6 h-6" />
        )}
      </button>

      <main className="w-full max-w-md">
        <h1 className="text-4xl font-bold mb-8 text-center text-secondary-900 dark:text-secondary-100 transition-colors duration-300 ease-in-out">
          URL Shortener
        </h1>

        {!shortUrl ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="url-input" className="sr-only">
                Enter your URL
              </label>
              <input
                id="url-input"
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter your URL"
                required
                className="w-full px-4 py-3 rounded-lg border border-secondary-300 dark:border-secondary-700 bg-white dark:bg-secondary-800 text-secondary-900 dark:text-secondary-100 transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-3 rounded-lg bg-primary-600 text-white font-semibold transition-colors duration-300 ease-in-out hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {isLoading ? "Shortening..." : "Shorten URL"}
            </button>
          </form>
        ) : (
          <div className="space-y-4 animate-fade-in">
            <p className="text-center text-secondary-800 dark:text-secondary-200 transition-colors duration-300 ease-in-out">
              {message}
            </p>
            <a
              href={shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full px-4 py-3 rounded-lg bg-primary-500 text-white font-semibold text-center transition-colors duration-300 ease-in-out hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              {shortUrl}
            </a>
            <button
              onClick={resetForm}
              className="w-full px-4 py-3 rounded-lg bg-secondary-300 dark:bg-secondary-700 text-secondary-800 dark:text-secondary-200 font-semibold transition-colors duration-300 ease-in-out hover:bg-secondary-400 dark:hover:bg-secondary-600 focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:ring-offset-2"
            >
              Shorten New URL
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
