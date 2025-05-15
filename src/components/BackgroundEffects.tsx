
import { useState, useEffect } from 'react';

export const BackgroundEffects = () => {
  const [showStars, setShowStars] = useState(false);

  useEffect(() => {
    const heartContainer = document.getElementById("heartContainer");
    if (!heartContainer) return;

    // Create hearts
    const createHearts = () => {
      for (let i = 0; i < 5; i++) {
        const heart = document.createElement("div");
        heart.innerHTML = "❤";
        heart.style.position = "fixed";
        heart.style.color = "rgba(236, 72, 153, 0.5)"; // Pink with opacity
        heart.style.fontSize = `${Math.random() * 10 + 10}px`;
        heart.style.left = `${Math.random() * 100}vw`;
        heart.style.bottom = "-10px";
        heart.style.zIndex = "-1";
        heart.style.animationDuration = `${Math.random() * 3 + 5}s`;
        heart.style.animationFillMode = "forwards";
        heart.style.animationTimingFunction = "linear";
        heart.style.animationName = "floatUp";
        heartContainer.appendChild(heart);

        setTimeout(() => {
          heart.remove();
        }, 8000);
      }
    };

    // Create stars
    const createStars = () => {
      if (!showStars) return;
      
      const starsContainer = document.getElementById("starsContainer");
      if (!starsContainer) return;
      
      for (let i = 0; i < 3; i++) {
        const star = document.createElement("div");
        star.innerHTML = "⋆";
        star.style.position = "fixed";
        star.style.color = "rgba(255, 255, 255, 0.7)"; 
        star.style.fontSize = `${Math.random() * 15 + 5}px`;
        star.style.left = `${Math.random() * 100}vw`;
        star.style.bottom = "-10px";
        star.style.zIndex = "-1";
        star.style.animationDuration = `${Math.random() * 3 + 3}s`;
        star.style.animationFillMode = "forwards";
        star.style.animationTimingFunction = "ease-out";
        star.style.animationName = "twinkle";
        starsContainer.appendChild(star);

        setTimeout(() => {
          star.remove();
        }, 6000);
      }
    };

    // Check if it's dark mode to show stars
    const checkTheme = () => {
      const isDark = document.documentElement.classList.contains('dark');
      setShowStars(isDark);
    };

    // Initialize effects
    const heartInterval = setInterval(createHearts, 2000);
    const starInterval = setInterval(createStars, 1500);
    
    // Check theme initially and on change
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => {
      clearInterval(heartInterval);
      clearInterval(starInterval);
      observer.disconnect();
    };
  }, [showStars]);

  return (
    <>
      <style>
        {`
          @keyframes floatUp {
            0% {
              transform: translateY(0) rotate(0);
              opacity: 0.5;
            }
            100% {
              transform: translateY(-100vh) rotate(360deg);
              opacity: 0;
            }
          }
          
          @keyframes twinkle {
            0% {
              transform: translateY(0) scale(1);
              opacity: 0.7;
            }
            50% {
              transform: translateY(-50vh) scale(1.5);
              opacity: 1;
            }
            100% {
              transform: translateY(-100vh) scale(0.5);
              opacity: 0;
            }
          }
        `}
      </style>
      <div id="heartContainer" className="pointer-events-none overflow-hidden" />
      <div id="starsContainer" className="pointer-events-none overflow-hidden" />
    </>
  );
};
