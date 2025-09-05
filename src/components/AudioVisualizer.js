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
        const y = height - (barHeight * height * 0.8);
        const actualHeight = barHeight * height * 0.8;

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
    console.log('Updating bars array with volumeLevel:', volumeLevel);
    console.log('Current bars state:', bars);
    const targetHeight = Math.max(0.1, Math.min(1, volumeLevel));
    
    setBars(prevBars => 
      prevBars.map((currentHeight, index) => {
        // Add variation to make bars look more natural
        const randomVariation = (Math.random() - 0.5) * 0.2 * targetHeight;
        const baseHeight = targetHeight + randomVariation;
        const maxHeight = Math.max(0.1, Math.min(1, baseHeight));
        
        // Use faster smoothing for real volume data (higher values indicate more responsive movement)
        const smoothingFactor = volumeLevel > 0.05 ? 0.4 : 0.3;
        return currentHeight + (maxHeight - currentHeight) * smoothingFactor;
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
      const y = height - (barHeight * height * 0.8);
      const actualHeight = barHeight * height * 0.8;

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
        height={100}
        style={{ width: '100%', height: '100px' }}
      />
    </div>
  );
};

export default AudioVisualizer;