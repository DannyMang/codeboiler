import React from 'react'
import Sidebar from './Sidebar'
import Notepad from './Notepad'

export default function Editor() {
  return (
    <div className="flex flex-row w-full min-h-screen z-50 items-center justify-center">
        <div className=" flex flex-row w-1/2 h-full">
        <div className="flex flex-col w-1/2"><Sidebar/></div>
        <div className="flex flex-col w-full"><Notepad/></div>
        </div>
    </div>
  )
}
