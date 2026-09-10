import type { ReactNode } from "react";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { NewLog } from "../api/logs";
import { deleteLog as b, getDataForLogs } from "../api/logs";
import { syncDatabasesLocalToRemote, syncDatabasesRemoteToLocal } from "../utils/databaseManagement";
type Session = {
    id: string,
    finished_at: string,
    duration: number,
    session_type: string
}

type SessionLog = {
    id: string,
    finished_at: string, 
    duration: number,
    session_type: string
}

type RenderLog = {
    dt: Date;
    dateKey: string;
    showDateHeader: boolean;
    id: string;
    finished_at: string;
    duration: number;
    session_type: string;}

type LogsState = {
    renderLogs: RenderLog[],
    logsData: SessionLog[],
    addLog: (new_log: NewLog) => void,
    deleteLog: (logId: string) => void,
    setLogsData: React.Dispatch<React.SetStateAction<Session[]>>,
    numWorkLogsToday: number,
    logsSyncState: number
}

export const PomodoroLogsContext = createContext<LogsState>({
  renderLogs: [],
  logsData: [],
  setLogsData: () => {},
  addLog: () => {},
  deleteLog: () => {},
  numWorkLogsToday: 0,
  logsSyncState: 0
});

type PomodoroLogsProviderProps = {
  children?: ReactNode
}
export const PomodoroLogsProvider =  ({children}: PomodoroLogsProviderProps) => {
  const [logsData, setLogsData] = useState<Session[]>([])
  const [isLogsDataLoading, setIsLogsDataLoading] = useState(true)
  const [logsSyncState, setLogsSyncState] = useState(1)

  useEffect(() => {
    let cancelled = false;

    async function loadLogs() {
      // Load logs from local database
      try {
        const localLogs = await getDataForLogs();
        if (!cancelled) {
          setLogsData(localLogs);
          setIsLogsDataLoading(false); // UI can render now
        }
      } catch (err) {
        console.error("Failed to load local logs:", err);
        if (!cancelled) setIsLogsDataLoading(false);
      }

      // // Sync remote to local
      // try {
      //   await syncDatabasesRemoteToLocal();

      //   // Re-read local database
      //   const refreshedLogs = await getDataForLogs();
      //   if (!cancelled) {
      //     setLogsData(refreshedLogs);
      //     setLogsSyncState(1)
      //   }
      // } catch (err) {
      //   console.error("Failed to sync remote -> local:", err);
      // }

      // // Sync local database to remote
      // syncDatabasesLocalToRemote().catch((err) => {
      //   console.error("Failed to sync local -> remote:", err);
      // });
    }

    loadLogs();

    return () => { cancelled = true; };
  }, []);

  // useEffect(() => {
  //     const numWorkLogsToday = logsData.filter((log) => {
  //         if (log.session_type.toLowerCase() != "work")
  //             return false
            
  //         const dt = new Date(log.finished_at)
            
  //         const logDate = dt.toLocaleDateString("en-CA")
  //         const dateToday = new Date().toLocaleDateString("en-CA")
            
  //         if (logDate != dateToday) {
  //             return false
  //         }

  //         return true
  //     }).length
  //     setNumWorkLogsToday(numWorkLogsToday)
  // }, [logsData])

  const numWorkLogsToday = logsData.filter((log) => {
    if (log.session_type.toLowerCase() != "work")
      return false
        
    const dt = new Date(log.finished_at)
        
    const logDate = dt.toLocaleDateString("en-CA")
    const dateToday = new Date().toLocaleDateString("en-CA")
        
    if (logDate != dateToday) {
      return false
    }

    return true
  }).length
    
  const renderLogs = useMemo(() => {
    let lastDate: string | null = null
    return logsData.map(log => {
      const dt = new Date(log.finished_at)
      const dateKey = dt.toLocaleDateString("en-CA")

      const showDateHeader = dateKey !== lastDate

      lastDate = dateKey

      return {
        ...log,
        dt,
        dateKey,
        showDateHeader,
      }
    })
  }, [logsData])

  const addLog = useCallback((new_log: Session) => {
    setLogsData((prevLogs) => [new_log, ...prevLogs]);
  }, []);

  const deleteLog = useCallback((logId: string) => {
    b(logId)
    setLogsData(prevLogs => prevLogs.filter(log => log.id !== logId));
  }, []);

  const value = useMemo(
    () => ({ renderLogs, isLogsDataLoading, logsData, setLogsData, addLog, deleteLog, numWorkLogsToday, logsSyncState}),
    [renderLogs, logsData, numWorkLogsToday, logsSyncState] // Only trigger consumers if these change
  )    

  return <PomodoroLogsContext.Provider value={value}>{children} </PomodoroLogsContext.Provider>
}

export const usePomodoroLogs = () => {
  const context = useContext(PomodoroLogsContext)
  return context
}