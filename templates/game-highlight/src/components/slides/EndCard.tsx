import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';

interface EndCardProps {
  headline?: string;
  subheadline?: string;
}

export const EndCard: React.FC<EndCardProps> = ({
  headline = 'Thanks for Watching',
  subheadline,
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#0a0a0a',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        opacity,
      }}
    >
      <h1
        style={{
          color: 'white',
          fontSize: 56,
          fontFamily: 'Microsoft JhengHei, sans-serif',
          fontWeight: 600,
          margin: 0,
        }}
      >
        {headline}
      </h1>
      {subheadline && (
        <p
          style={{
            color: '#666',
            fontSize: 28,
            fontFamily: 'Inter, sans-serif',
            marginTop: 12,
          }}
        >
          {subheadline}
        </p>
      )}
    </AbsoluteFill>
  );
};
