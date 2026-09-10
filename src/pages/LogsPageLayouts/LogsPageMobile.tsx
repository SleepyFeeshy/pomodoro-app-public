import { useState, useEffect, useMemo } from "react"
import { usePomodoroLogs } from "@/contexts/PomodoroLogsContext.js"
// import { deleteLog } from "../utils/databaseManagement.ts"
import { Fragment } from "react"
import PomodoroLogsTable from "@/features/pomodoro-logs/components/PomodoroLogsTable";

export default function LogsPageMobile() {
  const {renderLogs, deleteLog} = usePomodoroLogs();

  return (
    <div className="h-screen">
      <div className="h-full overflow-auto">
        <PomodoroLogsTable/>    
      </div>
    </div>
  )

  // return (
  //   <>
  //     {/* <MobileNavHeader text="Logs"> </MobileNavHeader> */}
  //     <div className="h-[calc(100vh-128px)] md:h-[calc(100vh-64px)] overflow-y-scroll pb-14">
  //       <div className="rounded-md mt-5 md:max-w-[65em] mx-auto">
  //         <table className="table-auto w-full text-sm text-gray-500 dark:text-gray-400">
  //           <thead className="text-left text-xs text-gray-700 uppercase bg-gray-100 dark:bg-zinc-700 dark:text-gray-400">
  //             <tr>
  //               <th className="px-6 py-3">Timestamp</th>
  //               <th className="px-6 py-3">Duration</th>
  //               <th className="px-6 py-3">Session Type</th>
  //               <th></th>
  //             </tr>
  //           </thead>
                        
  //           <tbody>
  //             {renderLogs.map((log, index) => {
  //               return (
  //                 <Fragment key={log.id}>              
  //                   {log.showDateHeader && (
  //                     <tr className="bg-white border-b-1 dark:bg-zinc-800 dark:border-zinc-700 border-zinc-200">
  //                       <td colSpan={4} className="px-6 pb-1 pt-3 text-black dark:text-zinc-200 font-semibold">{log.dt.toLocaleDateString(undefined, {
  //                         day: "numeric",
  //                         month: "short",
  //                         year: "numeric",
  //                       })}
  //                       </td>
  //                     </tr>
  //                   )}                  
  //                   <tr className="bg-white dark:text-zinc-50 dark:bg-zinc-800 dark:border-gray-700 border-gray-200">
  //                     <td className="px-6 py-1.5 text-gray-500 dark:text-zinc-300"><p className="text-right w-[80px]">{log.dt.toLocaleTimeString()}</p></td>
  //                     <td className="px-6 py-1.5 text-gray-500 dark:text-zinc-300">{log.duration}</td>
  //                     <td className="px-6 py-1.5 text-gray-500 dark:text-zinc-300">{log.session_type}</td>
  //                     <td><button className="w-5 h-5 bg-gray-100 hover:bg-gray-200 hover:cursor-pointer dark:bg-zinc-800 hover:dark:bg-zinc-600" onClick={() => {
  //                       deleteLog(log.id)
  //                     }}>x</button></td>
  //                   </tr>
  //                 </Fragment>
  //               )
  //             })
  //             }
  //           </tbody>
  //         </table>
  //       </div>
                
  //     </div>
  //   </>
  // )
}

