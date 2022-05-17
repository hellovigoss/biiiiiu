import {Server, Socket} from "socket.io"
const io = new Server(3000, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
})
let pairs = {}

io.on("connection", socket => {

    pairs[socket.id] = socket.id

    socket.on("pair", (socketid) => {
        pairs[socket.id] = socketid
        pairs[socketid] = socket.id
        console.log("pair " + socketid + " with " + socket.id)

        io.to(socket.id).emit("ready")
        io.to(socketid).emit("ready")
    })

    socket.on("message/offer", (data) => {
        console.log("send offer from " + socket.id + " to " + pairs[socket.id])
        io.to(pairs[socket.id]).emit("message/offer", data)
    })

    socket.on("message/candidate", (data) => {
        console.log("send candidate from " + socket.id + " to " + pairs[socket.id])
        io.to(pairs[socket.id]).emit("message/candidate", data)
    })

})
io.on("disconnect", socket => {
    delete pairs[pairs[socket.id]]
    delete pairs[socket.id]
    console.log("disconnect " + socket.id)
    console.log("unpair " + socket.id + " with " + pairs[socket.id])
})
