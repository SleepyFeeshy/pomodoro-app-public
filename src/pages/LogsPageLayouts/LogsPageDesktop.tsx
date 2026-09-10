import { useState, useEffect, useMemo } from "react"
import { usePomodoroLogs } from "@/contexts/PomodoroLogsContext.js"
// import { deleteLog } from "../utils/databaseManagement.ts"
import PomodoroLogsTable from "@/features/pomodoro-logs/components/PomodoroLogsTable";
import { Fragment } from "react"

export default function LogsPageDesktop() {
  const {renderLogs, deleteLog} = usePomodoroLogs();

  return (
    <div className="h-screen px-6">
      <div className="h-full px-6">
        <PomodoroLogsTable/>    
      </div>
    </div>
  )
}

