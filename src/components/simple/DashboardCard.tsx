import type { ReactNode } from "react"

type DashboardCardProps = {
    children: ReactNode,
    className: string
}
export default function DashboardCard({className, children}: DashboardCardProps) {
  return (
    <div className={`${className} rounded-lg shadow-xs`}>
      {children}
    </div>
  )
}