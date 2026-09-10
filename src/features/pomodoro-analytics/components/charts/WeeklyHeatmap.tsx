import React, { useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { getWeeklyHeatmap } from '@/features/pomodoro-analytics/api/analytics';
import type { WeeklyHeatmapPoint } from '@/features/pomodoro-analytics/api/analytics';
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const HOURS = Array.from({ length: 24 }, (_, i) => i);

const WeeklyHeatmap = () => {
  const [data, setData] = useState<WeeklyHeatmapPoint[]>([]);
  const [maxCount, setMaxCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getWeeklyHeatmap();
        setData(result);
        console.log(result)
        // Find max value for color scaling
        const max = Math.max(...result.map(d => d.count), 1);
        setMaxCount(max);
      } catch (err) {
        console.error("Failed to fetch heatmap:", err);
      }
    };
    fetchData();
  }, []);

  // Helper to get count for a specific slot
  const getCount = (day: number, hour: number) => {
    const found = data.find(d => d.day_of_week === day && d.hour === hour);
    console.log(found)
    return found ? found.count : 0;
  };

  return (
    <div className="p-4 text-white rounded-xl">   
      <div className="grid grid-cols-[30px_repeat(24,1fr)] gap-1">
        {/* Header: Hours 0-23 */}
        <div /> 
        {HOURS.map(h => (
          <div key={h} className="text-[10px] text-gray-500 text-center">
            {h % 6 === 0 ? `${h}h` : ''}
          </div>
        ))}

        {/* Rows: Day Label + 24 Hour Blocks */}
        {DAYS.map((dayLabel, dayIdx) => (
          <React.Fragment key={dayLabel}>
            <div className="text-[10px] flex items-center text-gray-400">
              {dayLabel}
            </div>
            {HOURS.map(hour => {
              const count = getCount(dayIdx, hour);
              const opacity = count > 0 ? (count / maxCount) * 0.9 + 0.1 : 0.05;
              
              return (
                <div
                  key={`${dayIdx}-${hour}`}
                  title={`${dayLabel} ${hour}:00 - ${count} sessions`}
                  className="aspect-square rounded-sm transition-colors bg-zinc-100"
                  style={{
                    backgroundColor: count > 0 ? `rgba(34, 197, 94, ${opacity})` : 'theme(colors.zinc.200)',
                    border: '1px solid rgba(255,255,255,0.05)'
                  }}
                />
              );
            })}
          </React.Fragment>
        ))}
      </div>
      
      <div className="mt-2 flex justify-end items-center gap-2 text-[10px] text-gray-500">
        <span>Less</span>
        <div className="w-3 h-3 bg-[#2d2d2d] rounded-sm" />
        <div className="w-3 h-3 bg-green-900 rounded-sm" />
        <div className="w-3 h-3 bg-green-500 rounded-sm" />
        <span>More</span>
      </div>
    </div>
  );
};

export default WeeklyHeatmap;