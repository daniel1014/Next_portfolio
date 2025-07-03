import React from 'react';
import { Radar } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

interface RadarChartProps {
  skills: { name: string; level: number }[];
}

const RadarChart: React.FC<RadarChartProps> = ({ skills }) => {
  const data = {
    labels: skills.map(skill => skill.name),
    datasets: [
      {
        label: 'Skill Level',
        data: skills.map(skill => skill.level),
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(59, 130, 246, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(59, 130, 246, 1)',
      },
    ],
  };

  const options = {
    scales: {
      r: {
        angleLines: {
          display: true,
          color: 'rgba(255, 255, 255, 0.1)',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        pointLabels: {
          font: {
            size: 12,
            family: 'Arial',
          },
          color: 'rgba(255, 255, 255, 0.7)',
        },
        ticks: {
          beginAtZero: true,
          max: 100,
          stepSize: 20,
          font: {
            size: 10,
          },
          color: 'rgba(255, 255, 255, 0.5)',
        },
        suggestedMin: 0,
        suggestedMax: 100,
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        titleFont: {
          size: 14,
        },
        bodyFont: {
          size: 12,
        },
        callbacks: {
          label: function(context: any) {
            return `Level: ${context.raw}%`;
          }
        }
      }
    },
    maintainAspectRatio: false,
  };

  return <Radar data={data} options={options} />;
};

export default RadarChart;