
import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  opacity: number;
  shape: 'circle' | 'square' | 'triangle' | 'star';
}

export function BackgroundParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number>(0);
  
  const colors = ['#9b87f5', '#D6BCFA', '#E5DEFF', '#7E69AB', '#6E59A5'];
  const shapes = ['circle', 'square', 'triangle', 'star'];
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Make canvas full screen
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      // Regenerate particles when resized
      initParticles();
    };
    
    // Initial canvas size
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Generate particles
    function initParticles() {
      particlesRef.current = [];
      const particleCount = Math.floor(window.innerWidth / 20); // Adjust particle count based on screen width
      
      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 4 + 1,
          speedX: (Math.random() - 0.5) * 0.5,
          speedY: (Math.random() - 0.5) * 0.5,
          color: colors[Math.floor(Math.random() * colors.length)],
          opacity: Math.random() * 0.5 + 0.1,
          shape: shapes[Math.floor(Math.random() * shapes.length)] as 'circle' | 'square' | 'triangle' | 'star'
        });
      }
    }
    
    // Draw a particle based on its shape
    function drawParticle(ctx: CanvasRenderingContext2D, particle: Particle) {
      ctx.fillStyle = particle.color;
      ctx.globalAlpha = particle.opacity;
      
      switch(particle.shape) {
        case 'circle':
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fill();
          break;
        
        case 'square':
          ctx.fillRect(
            particle.x - particle.size, 
            particle.y - particle.size, 
            particle.size * 2, 
            particle.size * 2
          );
          break;
        
        case 'triangle':
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y - particle.size);
          ctx.lineTo(particle.x + particle.size, particle.y + particle.size);
          ctx.lineTo(particle.x - particle.size, particle.y + particle.size);
          ctx.closePath();
          ctx.fill();
          break;
        
        case 'star':
          const spikes = 5;
          const outerRadius = particle.size;
          const innerRadius = particle.size / 2;
          
          ctx.beginPath();
          for (let i = 0; i < spikes * 2; i++) {
            const radius = i % 2 === 0 ? outerRadius : innerRadius;
            const angle = (Math.PI * i) / spikes;
            const x = particle.x + radius * Math.cos(angle);
            const y = particle.y + radius * Math.sin(angle);
            
            if (i === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
          }
          ctx.closePath();
          ctx.fill();
          break;
      }
    }
    
    // Animation loop
    function animate() {
      // Clear canvas with slightly transparent background for trail effect
      ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      for (const particle of particlesRef.current) {
        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;
        
        // Draw particle
        drawParticle(ctx, particle);
      }
      
      // Connect particles that are close to each other
      for (let i = 0; i < particlesRef.current.length; i++) {
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const p1 = particlesRef.current[i];
          const p2 = particlesRef.current[j];
          
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          const maxDistance = 100; // Maximum distance for connection
          
          if (distance < maxDistance) {
            ctx.beginPath();
            ctx.strokeStyle = p1.color;
            ctx.globalAlpha = (1 - distance / maxDistance) * 0.2; // Fade based on distance
            ctx.lineWidth = 0.5;
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }
      
      animationFrameRef.current = requestAnimationFrame(animate);
    }
    
    // Start animation
    initParticles();
    animate();
    
    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameRef.current);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);
  
  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[-1] opacity-30"
    />
  );
}
