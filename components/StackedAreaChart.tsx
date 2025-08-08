'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface SeriesData {
  x: number;
  y: number;
}

const generateDayWiseTimeSeries = (
  baseval: number,
  count: number,
  yrange: { min: number; max: number }
): SeriesData[] => {
  const series: SeriesData[] = [];
  let y = Math.floor((yrange.min + yrange.max) / 2); // start from middle value

  for (let i = 0; i < count; i++) {
    const x = baseval;
    
    // Add small random delta for smooth change
    const delta = Math.floor(Math.random() * 10 - 5); // small ups and downs
    y += delta;

    // Clamp y to stay within min-max range
    y = Math.max(yrange.min, Math.min(yrange.max, y));

    series.push({ x, y });
    baseval += 86400000; // +1 day
  }

  return series;
};


const StackedAreaChart: React.FC = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  const options = {
  chart: {
          type: 'area',
          height: 350,
          stacked: true,
          events: {
            selection: function (chart, e) {
              console.log(new Date(e.xaxis.min))
            }
          },
    },
    colors: ['#144A6C', '#177606', '#EF2D2D'],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth',
    },
    fill: {
      type: 'gradient',
      gradient: {
        opacityFrom: 0.6,
        opacityTo: 0.8,
      },
    },
    legend: {
      position: 'top',
      horizontalAlign: 'left',
    },
    xaxis: {
      type: 'datetime',
    },
  };

  const series = [
  {
            name: 'South',
            data: generateDayWiseTimeSeries(new Date('11 Feb 2017 GMT').getTime(), 20, {
              min: 10,
              max: 60
            })
          },
          {
            name: 'North',
            data: generateDayWiseTimeSeries(new Date('11 Feb 2017 GMT').getTime(), 20, {
              min: 10,
              max: 20
            })
          },
          {
            name: 'Central',
            data: generateDayWiseTimeSeries(new Date('11 Feb 2017 GMT').getTime(), 20, {
              min: 10,
              max: 15
            })
          }
  ];

  return (
    <div className="w-full">
      <ReactApexChart options={options} series={series} type="area" height={350} />
    </div>
  );
};

export default StackedAreaChart;
