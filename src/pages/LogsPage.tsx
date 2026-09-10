import { useState, useEffect, useMemo } from "react"
import { usePomodoroLogs } from "../contexts/PomodoroLogsContext.js"
// import { deleteLog } from "../utils/databaseManagement.ts"
import { Fragment } from "react"
import LogsPageDesktop from "./LogsPageLayouts/LogsPageDesktop.js";
import LogsPageMobile from "./LogsPageLayouts/LogsPageMobile.js";

export default function LogsPage() {
  const {renderLogs, deleteLog} = usePomodoroLogs();

  // const settingsContext = useContext(SettingsContext);
  if (window.innerWidth > 430) {
    return <LogsPageDesktop/>
  } else {
    return <LogsPageMobile/>
  }
}

