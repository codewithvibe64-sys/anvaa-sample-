/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';

export default function ThreeDBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth || window.innerWidth);
    let height = (canvas.height = canvas.offsetHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth || window.innerWidth;
      height = canvas.height = canvas.offsetHeight || window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // 3D Particle definition
    interface Particle {
      x: number; // 3D X
      y: number; // 3D Y
      z: number; // 3D Z
      baseX: number;
      baseY: number;
      baseZ: number;
      size: number;
      color: string;
      speed: number;
    }

    const particleCount = 70;
    const particles: Particle[] = [];
    const maxDepth = 800;
    const focalLength = 350; // perspective depth factor

    // Gold, warm champagne, rose gold palette (light contrast version)
    const colors = [
      'rgba(170, 119, 28, 0.55)',  // Warm Amber/Gold
      'rgba(183, 110, 121, 0.45)', // Rose Gold
      'rgba(74, 21, 37, 0.35)',    // Deep Wine Accent
      'rgba(212, 175, 55, 0.5)'    // Bright Gold
    ];


    for (let i = 0; i < particleCount; i++) {
      // Random coordinates in a 3D box
      const x = (Math.random() - 0.5) * width * 1.6;
      const y = (Math.random() - 0.5) * height * 1.6;
      const z = Math.random() * maxDepth;
      
      particles.push({
        x,
        y,
        z,
        baseX: x,
        baseY: y,
        baseZ: z,
        size: Math.random() * 2 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        speed: Math.random() * 0.4 + 0.1
      });
    }

    // Mouse tracking for parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      // Normalize to -0.5 to 0.5
      targetMouseX = (e.clientX / window.innerWidth) - 0.5;
      targetMouseY = (e.clientY / window.innerHeight) - 0.5;
    };

    window.addEventListener('mousemove', handleMouseMove);

    let angleX = 0.0006; // subtle default rotations
    let angleY = 0.0008;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse interpolation
      mouseX += (targetMouseX - mouseX) * 0.04;
      mouseY += (targetMouseY - mouseY) * 0.04;

      // Adjust rotation speed based on mouse position
      const rotY = angleY + mouseX * 0.006;
      const rotX = angleX + mouseY * 0.006;

      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);

      const centerX = width / 2;
      const centerY = height / 2;

      const projected: { sx: number; sy: number; sz: number; color: string }[] = [];

      // Update and project particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // 3D rotation on Y-axis
        let x1 = p.x * cosY - p.z * sinY;
        let z1 = p.x * sinY + p.z * cosY;

        // 3D rotation on X-axis
        let y1 = p.y * cosX - z1 * sinX;
        let z2 = p.y * sinX + z1 * cosX;

        // Save back coordinates so the rotation is cumulative
        p.x = x1;
        p.y = y1;
        p.z = z2;

        // Drift slowly in Z space to create forward movement
        p.z -= p.speed;
        if (p.z <= -focalLength) {
          p.z = maxDepth; // reset to back
          p.x = (Math.random() - 0.5) * width * 1.6;
          p.y = (Math.random() - 0.5) * height * 1.6;
        }

        // Perspective Projection
        const scale = focalLength / (focalLength + p.z);
        const screenX = x1 * scale + centerX;
        const screenY = y1 * scale + centerY;

        // Only draw if within bounds
        if (screenX >= 0 && screenX <= width && screenY >= 0 && screenY <= height) {
          projected.push({ sx: screenX, sy: screenY, sz: p.z, color: p.color });

          // Render particle
          ctx.beginPath();
          const r = p.size * scale * 1.3;
          ctx.arc(screenX, screenY, r > 0 ? r : 0.1, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          // Add glow effect to stars
          ctx.shadowBlur = scale * 3;
          ctx.shadowColor = '#D4AF37';
          ctx.fill();
        }
      }

      // Draw constellation lines between nearby projected particles
      ctx.shadowBlur = 0; // reset shadow for lines
      ctx.lineWidth = 0.5;
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const dx = projected[i].sx - projected[j].sx;
          const dy = projected[i].sy - projected[j].sy;
          const dist = Math.sqrt(dx * dx + dy * dy);

          // Connect if close
          if (dist < 100) {
            const opacity = (1 - dist / 100) * 0.15;
            ctx.strokeStyle = `rgba(212, 175, 55, ${opacity})`;
            ctx.beginPath();
            ctx.moveTo(projected[i].sx, projected[i].sy);
            ctx.lineTo(projected[j].sx, projected[j].sy);
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
      style={{
        background: 'radial-gradient(circle at center, #FFFFFF 0%, #F5F4EF 100%)',
      }}
    />
  );
}
