import { useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import type { RenderedTask } from '../utils/todoist';
import type { MouseEventHandler } from 'react';

import { completeTaskInLocalDatabase } from "../api/tasks";
import { completeTaskInTodoist } from "../api/tasks";

import { CompleteTaskButton, renderTime } from './TaskEntry';
import { deleteTask } from '../api/tasks';

type ModalProps = {
    taskData: RenderedTask,
    children: ReactNode,
    setTasks: any
}

type ModalContentProps = {
    taskData: RenderedTask,
    setTasks: any,
    onClose: MouseEventHandler<HTMLButtonElement | HTMLDivElement>
}
export default function TaskModal({taskData, setTasks, children}: ModalProps) {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <button className="hover:cursor-pointer w-full" onClick={() => setShowModal(true)}>
        {children}
      </button>
      {showModal && createPortal(
        <TaskModalContent taskData={taskData} setTasks={setTasks} onClose={() => setShowModal(false)}/>,
        document.body
      )}
    </>
  );
}

export function TaskModalContent({taskData: task, setTasks, onClose}: ModalContentProps) {
  return (
    <div onClick={onClose} className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white flex flex-col h-150 w-200 rounded-lg pt-2" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-end">
          <button className="justify-end bg-component hover:bg-component-hover hover:cursor-pointer h-8 w-8 rounded-md text-center" onClick={onClose}>X</button>
        </div>
        <div className='flex flex-row h-full'>
          <div className="flex gap-4 w-350">
            <div className="pl-2 py-0.5 text-gray-500">
              <CompleteTaskButton onClick={() => {
                completeTaskInLocalDatabase(task.id)
                completeTaskInTodoist(task.id)
                setTasks()
              }}/>
            </div>
            <div className="w-full">
              <p className="text-left text-neutral-800 dark:text-white">{task.content}</p>
              { task.due && 
                        <p className="text-left text-neutral-400 text-xs">{renderTime(task.due, task.duration)}
                        </p>}
            </div>
          </div>
          <div className="flex flex-col bg-stone-50 w-full h-full rounded-br-md">
            <button className="hover:cursor-pointer w-20 text-red-700 font-semibold" onClick={() => {
              setTasks()
              deleteTask(task.id)}}>Delete</button>
          </div>
        </div>
      </div>
    </div>
  );
}