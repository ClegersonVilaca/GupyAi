
import React from 'react';

interface ScoreGaugeProps {
    score: number;
}

const ScoreGauge: React.FC<ScoreGaugeProps> = ({ score }) => {
    const radius = 80;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;

    return (
        <div className="relative size-48 flex items-center justify-center shrink-0">
            <svg className="transform -rotate-90 w-full h-full">
                <circle
                    className="text-gray-100"
                    cx="96" cy="96"
                    fill="transparent"
                    r={radius}
                    stroke="currentColor"
                    strokeWidth="12"
                />
                <circle
                    className="text-accent-warning drop-shadow-md transition-all duration-1000"
                    cx="96" cy="96"
                    fill="transparent"
                    r={radius}
                    stroke="currentColor"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    strokeWidth="12"
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-text-main">{score}%</span>
                <span className="text-xs font-medium text-text-muted uppercase tracking-wide mt-1">Score Gupy</span>
            </div>
        </div>
    );
};

export default ScoreGauge;
