const { Socket } = require("socket.io");

const app = require("express")();
const server = require("http").createServer(app)
const cors= require("cors")

const io = require("socket.io")(server,{
    cors:{
        origin:"*",
        methods: ["GET", "POST"]
    }
})

app.use(cors())

const PORT = process.env.PORT || 5001

app.get("/", (req,res)=>{
    res.send("Server is running")
})

io.on("connection",(socket)=>{
    socket.emit("me",socket.id);

    socket.on('disconnected',()=>{
        socket.broadcast.emit("callended")
    })

    socket.on("calluser",({userToCall,signalData,from,name})=>{
        io.to(userToCall).emit('calluser',{signal: signalData,from, name} )
    })
    socket.on("answerCall",(data)=>{
        io.to(data.to).emit("callaccepted", data.signal)
    })
})
server.listen(PORT, ()=>console.log(`Server is running on ${PORT}`))