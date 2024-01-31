import express from 'express'
import ViteExpress from 'vite-express'
import morgan from 'morgan'
import session from 'express-session'
import cors from 'cors'
import {Server} from 'socket.io'

const app = express()
const PORT = '8000'

app.use(morgan('dev'))
app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(session({ secret: 'This is a secret', saveUninitialized: true, resave: false }))
app.use(cors())


ViteExpress.config({ printViteDevServerHost: true })


const server = ViteExpress.listen(app,PORT,() => console.log(`Server running on http://localhost:${PORT}`))

const io = new Server(server,{
    cors: {
        origin: "http://localhost:8000",
        methods: ["GET","POST"]
    }
})
io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`)

    socket.on("sendMessage", (data) => {
        socket.broadcast.emit("receiveMessage", data)
    })
})