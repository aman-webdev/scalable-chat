'use client'

import { useState } from "react"
import { useSocket } from "../context/SocketProvider"

export default function Page()  {


  const {sendMessage,msgs} = useSocket()
  const [message,setMessage] = useState('')

  return <div className="px-4 py-4">
    <div>
      <h1>Messages</h1>
    </div>
    <div>
      <input value={message} onChange={(e)=>setMessage(e.target.value)} type="text" className="border border-black" />
      <button onClick={()=>sendMessage(message)} className="">Add Message</button>

      <div className="mt-12">
        {msgs.map(msg=><p className="my-3">{msg}</p>)}
      </div>
    </div>
  </div>
}