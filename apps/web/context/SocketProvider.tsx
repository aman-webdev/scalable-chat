"use client";
import { Socket, io } from "socket.io-client";

interface ISocketContext {
    sendMessage : (message:string) => any;
    msgs:string[]
}


import React, { useCallback, useContext, useEffect, useState } from "react";
const SocketContext = React.createContext<ISocketContext | null>(null);

export const useSocket = () => {
  const state = useContext(SocketContext)
  if(!state) throw new Error("State is undefined")

  return state;
}

export const SocketProvider: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {

  const [socket,setSocket] = useState<null | Socket>(null)
  const  [msgs,setMsgs] = useState<string[]>([])

  const onMsg = useCallback((msg:string)=>{
    console.log('Server msg', msg)
    setMsgs((pref)=>[...pref,msg])
  },[msgs])

  console.log(msgs,'msgs')

  useEffect(()=>{
      const _socket = io('http://localhost:5001')
      _socket.on("event:message",onMsg)
      setSocket(_socket)
      return () => {
        _socket.disconnect()
        _socket.off("event:message",onMsg)
        setSocket(null)
      }
  },[])


  const sendMessage : ISocketContext['sendMessage'] = useCallback((msg:string)=>{
    console.log('Send Mesggg' , msg ,socket)
    if(!socket) return;
    socket.emit("event:message", {message:msg})
    console.log('emitted')
  },[socket])

  return (
    <SocketContext.Provider value={{sendMessage,msgs}}>{children}</SocketContext.Provider>
  );
};



export default SocketContext