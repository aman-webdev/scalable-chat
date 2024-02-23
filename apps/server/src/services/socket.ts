import { Server } from "socket.io"
import Redis from "ioredis"
import {config} from 'dotenv'

config()

const pub = new Redis({
    host:process.env.REDIS_HOST || '',
    port:parseInt(process.env.REDIS_PORT || '') || 0,
    username: process.env.REDIS_USERNAME,
    password:process.env.REDIS_PASSWORD
}
)
const sub = new Redis({
    host:process.env.REDIS_HOST || '',
    port:parseInt(process.env.REDIS_PORT || '') || 0,
    username: process.env.REDIS_USERNAME,
    password:process.env.REDIS_PASSWORD
} )

class SocketService {
    private _io : Server;

    constructor() {
        this._io = new Server({
            cors: {
                allowedHeaders:['*'],
                origin:'*'
            }
        });

        sub.subscribe('MESSAGES')

        sub.on('message',(channel,message)=>{
            if(channel==='MESSAGES') {
                console.log(message)
                this._io.emit("event:message" , JSON.parse(message))
            }
        })
    }

    public initListeners() {
        console.log('Init Socket listeners')
        const io = this.io
        io.on("connect",(socket)=>{
            console.log('New User Connected : ', socket.id)

            socket.on('event:message',async({message}:{message:string})=>{
                console.log('Received new message' , message)
                await pub.publish('MESSAGES',JSON.stringify(message))
            })
        })

        
    }

    get io() {
        return this._io;
    }
}

export default SocketService