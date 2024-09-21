import React from 'react';

interface CircularProgressProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  trailColor?: string;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  percentage,
  size = 100,
  strokeWidth = 8,
  color = '#4dbd74',
  trailColor = '#d9d9d9',
}) => {
  const radius = size / 2 - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={trailColor}
        strokeWidth={strokeWidth}
        fill="none"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        style={{ transition: 'stroke-dashoffset 0.3s ease' }}
      />
      <text
        x="50%"
        y="50%"
        alignmentBaseline="middle"
        textAnchor="middle"
        fontSize={size / 5}
        fill={color}
        dominantBaseline="middle" /* Center the text vertically */
        style={{ fontWeight: 'bold' }} /* Make the percentage text bold */
      >
        {`${percentage.toFixed(2)}%`}
      </text>
    </svg>
  );
};

export default CircularProgress;
