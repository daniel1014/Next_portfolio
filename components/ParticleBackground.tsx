"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  alpha: number;
}

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    let mouseX = 0;
    let mouseY = 0;
    let isMouseMoving = false;
    let mouseTimeout: NodeJS.Timeout;

    // Set canvas to full screen
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      // Recreate particles when canvas is resized
      initParticles();
    };

    // Create particles
    const initParticles = () => {
      particles = [];
      const numberOfParticles = Math.min(window.innerWidth, window.innerHeight) * 0.5;  // adjust the number of particles

      for (let i = 0; i < numberOfParticles; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 0.5,
          speedX: (Math.random() - 0.5) * 0.3,
          speedY: (Math.random() - 0.5) * 0.3,
          color: getRandomColor(),
          alpha: Math.random() * 0.5 + 0.1,
        });
      }
    };

    const getRandomColor = () => {
      const colors = [
        "rgba(6, 182, 212, 0.7)",   // cyan-500
        "rgba(168, 85, 247, 0.7)",  // purple-500
        "rgba(236, 72, 153, 0.7)",  // pink-500
        "rgba(59, 130, 246, 0.7)",  // blue-500
      ];
      return colors[Math.floor(Math.random() * colors.length)];
    };

    // Update particles
    const updateParticles = () => {
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Move particles
        p.x += p.speedX;
        p.y += p.speedY;

        // Wrap around edges
        if (p.x > canvas.width) p.x = 0;
        if (p.x < 0) p.x = canvas.width;
        if (p.y > canvas.height) p.y = 0;
        if (p.y < 0) p.y = canvas.height;

        // Mouse interaction
        if (isMouseMoving) {
          const dx = p.x - mouseX;
          const dy = p.y - mouseY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const maxDistance = 150;

          if (distance < maxDistance) {
            const force = (maxDistance - distance) / maxDistance;
            p.speedX += dx * force * 0.01;
            p.speedY += dy * force * 0.01;

            const maxSpeed = 2;
            const currentSpeed = Math.sqrt(p.speedX * p.speedX + p.speedY * p.speedY);
            if (currentSpeed > maxSpeed) {
              p.speedX = (p.speedX / currentSpeed) * maxSpeed;
              p.speedY = (p.speedY / currentSpeed) * maxSpeed;
            }
          }
        }

        // Gradually slow down
        p.speedX *= 0.99;
        p.speedY *= 0.99;
      }
    };

    // Draw particles
    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw lines between particles
      ctx.globalAlpha = 0.2;
      ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
      ctx.lineWidth = 0.3;

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i];
          const p2 = particles[j];

          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.globalAlpha = 0.5 * (1 - distance / 100);
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }
    };

    // Animate particles
    const animate = () => {
      updateParticles();
      drawParticles();
      animationFrameId = requestAnimationFrame(animate);
    };

    // Handle mouse movement
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      isMouseMoving = true;

      clearTimeout(mouseTimeout);
      mouseTimeout = setTimeout(() => {
        isMouseMoving = false;
      }, 100);
    };

    // Initialize canvas and start animation
    resizeCanvas();
    animate();

    // Add event listeners
    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("mousemove", handleMouseMove);

    // Cleanup
    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none -z-0"
    />
  );
}


