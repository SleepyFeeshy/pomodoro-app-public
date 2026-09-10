import { useEffect, useState } from 'react';
import { useTasks } from '../../contexts/TasksContext';
import type { MouseEventHandler } from 'react';

type SyncIndicatorProps = {
    onClick: MouseEventHandler
};

export default function TaskSyncIndicator({onClick}: SyncIndicatorProps) {
  const {isTaskDataLoading} = useTasks();
  const [isVisible, setIsVisible] = useState(true);

  // useEffect(() => {
  //     if (isTaskDataLoading) {
  //         setIsVisible(true);
  //     } else {
  //         // Wait 3 seconds after sync finishes, then hide
  //         const timer = setTimeout(() => {
  //             setIsVisible(false);
  //         }, 2000);

  //         return () => clearTimeout(timer);
  //     }
  // }, [isTaskDataLoading]);

  return (
    <div 
      className={`transition-all duration-500 ease-in-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1 pointer-events-none"
      }`}
    >
      <p className="text-zinc-400 text-xs font-semibold hover:cursor-default">
        {isTaskDataLoading 
          ? "Currently syncing..." 
          : <button className="hover:cursor-pointer hover:underline"onClick={onClick}>Synced</button>}
      </p>
    </div>
  );
}