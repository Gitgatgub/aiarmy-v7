import React, { useRef, useEffect, useState } from 'react';

const AudioVisualizer = ({ volumeLevel = 0 }) => {
  console.log('AudioVisualizer - volumeLevel prop:', volumeLevel);
  const canvasRef = useRef(null);
  const animationRef = useRef();
  const [bars, setBars] = useState(Array(15).fill(0.1));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const barWidth = width / 15;

    const animate = () => {
      console.log('Drawing bars - bar heights:', bars);
      ctx.clearRect(0, 0, width, height);

      bars.forEach((barHeight, index) => {
        const x = index * barWidth + barWidth * 0.1;
        const actualBarWidth = barWidth * 0.8;
        const y = height - (barHeight * height * 0.95);
        const actualHeight = barHeight * height * 0.95;

        const gradient = ctx.createLinearGradient(0, y, 0, y + actualHeight);
        gradient.addColorStop(0, '#00FFA3');
        gradient.addColorStop(1, '#00CC82');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, actualBarWidth, actualHeight);
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [bars]);

  useEffect(() => {
    if (volumeLevel === 0) return; // Don't animate when silent
    
    console.log('Updating bars array with volumeLevel:', volumeLevel);
    console.log('Current bars state:', bars);
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    setBars(prevBars => 
      prevBars.map((currentHeight, index) => {
        // Create wave pattern with varying heights
        let targetMultiplier;
        const wavePosition = index % 5;
        if (wavePosition < 2) {
          targetMultiplier = 0.8; // Tall bars (80% height)
        } else if (wavePosition < 4) {
          targetMultiplier = 0.5; // Medium bars (50% height)
        } else {
          targetMultiplier = 0.3; // Short bars (30% height)
        }
        
        const barHeight = Math.random() * canvas.height * targetMultiplier;
        const normalizedHeight = barHeight / canvas.height;
        
        // Use faster smoothing for real volume data
        const smoothingFactor = volumeLevel > 0.05 ? 0.6 : 0.4;
        return currentHeight + (normalizedHeight - currentHeight) * smoothingFactor;
      })
    );
  }, [volumeLevel]);

  // Direct canvas update useEffect for immediate response
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const barWidth = width / 15;

    // Explicitly clear and redraw
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    bars.forEach((barHeight, index) => {
      const x = index * barWidth + barWidth * 0.1;
      const actualBarWidth = barWidth * 0.8;
      const y = height - (barHeight * height * 0.95);
      const actualHeight = barHeight * height * 0.95;

      const gradient = ctx.createLinearGradient(0, y, 0, y + actualHeight);
      gradient.addColorStop(0, '#00FFA3');
      gradient.addColorStop(1, '#00CC82');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(x, y, actualBarWidth, actualHeight);
    });
  }, [volumeLevel, bars]);

  return (
    <div className="audio-visualizer">
      <canvas 
        ref={canvasRef}
        width={300}
        height={150}
        style={{ width: '100%', height: '150px' }}
      />
    </div>
  );
};

export default AudioVisualizer;