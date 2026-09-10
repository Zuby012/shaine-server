const express = require('express');
require('dotenv').config()
const app = express();
const http = require('http');
const {Server, Socket} = require('socket.io')
const cors = require('cors')

const PORT = (process.env.SERVER_PORT || 3001)

app.use(cors())

const server = http.createServer(app);

const now = new Date()

const io = new Server(server, {
    cors: {
        origin: (process.env.FRONTEND_URL || 'http://localhost:3000'),
        methods: ['GET', 'POST', 'PUT', 'DELETE']
    }
})

try {
    io.on("connect", (socket) =>{
        socket.on('send_message', (data)=>{
            data.deliveredAt = `${now.getHours()}:${now.getMinutes()}`
            io.to(data.roomId).emit("receive_message", data)
            //console.log(data)
        })

        socket.on('join_room', (data)=>{
            socket.join(data)
            //console.log(`user ${socket.id} joined room ${data}`)
        })
    })
} catch (error) {
    console.log(err)
}



server.listen(PORT, ()=>{
    console.log('Server is running!')
})