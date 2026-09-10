import { usePomodoroLogs } from "@/contexts/PomodoroLogsContext"
import { Fragment } from "react/jsx-runtime";
import SessionTypeChip from "./SessionTypeChip";

export default function PomodoroLogsTable() {
  const {renderLogs, deleteLog} = usePomodoroLogs();

  return (
    <div className="rounded-md md:h-full md:overflow-y-auto bg-surface">
      <table className="table-auto text-sm overflow-auto text-gray-500 dark:text-gray-400">
        <thead className="text-left text-xs text-gray-700 uppercase bg-gray-100 dark:bg-zinc-700 dark:text-gray-400">
          <tr className="h-10">
            <th className="px-6">Timestamp</th>
            <th className="px-6">Duration</th>
            <th className="px-6">Session Type</th>
            <th></th>
          </tr>
        </thead>
                    
        <tbody className="overflow-y-auto">
          {renderLogs.map((log, index) => {
            return (
              <Fragment key={log.id}>              
                {log.showDateHeader && (
                  <tr className="bg-white border-b-1 dark:bg-zinc-800 dark:border-zinc-700 border-zinc-200">
                    <td colSpan={4} className="px-6 pb-1 pt-3 text-black dark:text-zinc-200 font-semibold">{log.dt.toLocaleDateString(undefined, {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                    </td>
                  </tr>
                )}                  
                <tr className="odd:bg-zinc-50 even:bg-white dark:text-zinc-50 h-8 dark:bg-zinc-800 dark:border-gray-700 border-gray-200">
                  <td className="px-6 font-mono text-gray-500 dark:text-zinc-300"><p className="text-right w-24">{log.dt.toLocaleTimeString()}</p></td>
                  <td className="px-6 font-mono text-gray-500 dark:text-zinc-300">{log.duration}</td>
                  <td className="px-6 text-gray-500 dark:text-zinc-300"><SessionTypeChip session_type={log.session_type}/></td>
                  <td><button className="w-5 h-5 bg-gray-100 hover:bg-gray-200 hover:cursor-pointer dark:bg-zinc-800 hover:dark:bg-zinc-600" onClick={() => {
                    deleteLog(log.id)
                  }}>x</button></td>
                </tr>
              </Fragment>
            )
          })
          }
        </tbody>
      </table>
    </div>
  )
}