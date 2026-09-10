import type { ReactHTMLElement } from "react"
import type { ReactNode } from 'react';

type StatisticsCardProps = {
    className?: string
    children?: ReactNode
}


export default function StatisticsCard(props: StatisticsCardProps ){
  return (
    <div className={`grow bg-surface text-gray-700 dark:text-white shadow-xs dark:shadow-none flex flex-col gap-1 px-3 py-5 rounded-xl ${props.className}`}>
      {props.children}
    </div>
  )
}