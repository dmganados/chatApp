// Import the required modules and dependencies
    const express = require('express');
    const mongoose = require('mongoose');
    const dotenv = require('dotenv');
    const cors = require('cors'); 
    const userRoutes = require('./routes/user');
    const messageRoutes = require('./routes/messages');
    const conversationRoutes = require('./routes/conversations');
    const { Server } = require("socket.io");

// Environment Variable Setup
    dotenv.config();
    const port = process.env.PORT;
    const url = process.env.MONGO_URL;

// Server Setup
    const app = express();
    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({extended: true}));
    

// Database Connect
    mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => {
        console.log(`Connected to Atlas`);
    }).catch((err) => {
        console.log(err.message);
    });

// Server Routes
    app.use("/user", userRoutes);
    app.use("/message", messageRoutes);
    app.use("/conversations", conversationRoutes);

// Server Responses
    app.get('/', (req, res) => {
        res.set('Access-Control-Allow-Origin', 'http://localhost:4000/');
        res.send({"msg": "CORS is enabled"})
    })

    const server = app.listen(port, () => {
        console.log(`API is now online on port ${port}`)
    })

    const io = new Server(server, {
        cors: {
            origin: "http://localhost:3000",
            methods: ["GET", "PUT", "POST", "DELETE"]
        },
    });
    
    function connectToSocket() {
        // Connect to the socket
        const socket = io(server)
      
        // Assign the socket ID to a variable
        const socketId = socket.id;
      
        // Return the socket ID
        return socketId;
      }


    let users = [];

    const pushUser = (userId, socketId) => {
        !users.some((user) => user.userId === userId) && users.push({ userId, socketId });
    }

    const removeUser = (socketId) => {
        users = users.filter((user) => user.socketId !== socketId)
    } 

    const receiver = (userId) => {
        return users.find((user) => user.userId === userId);
    }

    io.on("connection", (socket) => {
        console.log("A user is connected:", socket.id)

        let socketId = socket.id;
        
        socket.on("addUser", userId => {
            if (userId === null) {
                return false
            } else {
                pushUser(userId, socket.id);
            }
            io.emit("getUsers", users)
        })

        socket.on("joinRoom", (roomId) => {
            socket.join(roomId);
            console.log(`${socket.id} is connected to the room ${roomId}`);
        })
 
        socket.on("sendMessage", ({senderId, receiverId, message}) => {
            const rcv = receiver(receiverId)
            if (rcv) {
                io.to(rcv.socketId).emit("messageReceive", { receiverId, message })
            } 
        });

        socket.on("deleteMessage", (id) => {
            io.emit('deleted', id)
        })

        socket.on("disconnect", ()=> {
            console.log("A user diconnected:", socket.id);
            removeUser(socket.id);
            io.emit("getUsers", users)
        })
    })

    


    