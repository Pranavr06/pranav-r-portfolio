"use client";

import { useState, useEffect } from "react";

export default function TypingEffect({ words = ["STUDENT", "TECH ENTHUSIAST", "WEB DEVELOPER"] }: { words?: string[] }) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState(words[0] || "");
  const [isDeleting, setIsDeleting] = useState(true);
  const [typingSpeed, setTypingSpeed] = useState(2000);

  useEffect(() => {
    const handleTyping = () => {
      const currentWord = words[currentWordIndex];
      
      if (!isDeleting) {
        setCurrentText(currentWord.substring(0, currentText.length + 1));
        
        if (currentText.length + 1 > currentWord.length) {
          setTypingSpeed(2000); // Wait before deleting
          setIsDeleting(true);
        } else {
          setTypingSpeed(150); // Slower typing speed
        }
      } else {
        setCurrentText(currentWord.substring(0, currentText.length - 1));
        setTypingSpeed(75); // Slower deleting speed
        
        if (currentText.length === 0) {
          setIsDeleting(false);
          setCurrentWordIndex((prev) => (prev + 1) % words.length);
          setTypingSpeed(500); // Wait before typing new word
        }
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentWordIndex, words, typingSpeed]);

  return <span className="typing">{currentText}</span>;
}
