import http from "http"
import SocketService from "./services/socket"


const init = async() => {
    const httpServer = http.createServer()
    const PORT = process.env.PORT || 5001
    const socketServer = new SocketService()

    socketServer.io.attach(httpServer)

    socketServer.initListeners()

    httpServer.listen(PORT,()=>{
        console.log(`Server started on port ${PORT}`)
    })
}


init()