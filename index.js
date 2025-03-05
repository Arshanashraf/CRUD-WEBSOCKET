import mongoose from "mongoose";
import express from "express"
import http from "http"
import User from "./models/user.model.js";
import {WebSocket,WebSocketServer} from "ws";

const app = express()
const server = http.createServer(app);
const wss = new WebSocketServer({server});

wss.on('connection', async (ws) => {
    console.log("Client connected");
    
    const users = await User.find();
    ws.send(JSON.stringify({type: "INIT", data: users}))
    
    ws.on("message", async (message) => {
        const {type, data} = JSON.parse(message);

        switch (type) {
            case "CREATE":
                const user = User.create(data);
                broadcast({type: "CREATE", data: user});
                break;
            
            case "READ":
                const users = await User.find();
                ws.send(JSON.stringify({type: "READ", data: users}));
                break;
            
            case "UPDATE":
                await User.findByIdAndUpdate(data.id, data, {new: true});
                broadcast({type: "UPDATE", data})
                break;

            case "DELETE":
                await User.findByIdAndDelete(data.id);
                broadcast({type: "DELETE", data})
                break;
            
            default:
                console.log("Unknown message type");
                
        }
    });

    ws.on("close", ()=> console.log("Client Disconnected"))
})

//function broadcast
function broadcast(message){
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN){
            client.send(JSON.stringify(message))
        }
    })
}



mongoose.connect("mongodb+srv://arshanashraf2002:p3Z5wOaQrBqGYjfi@cluster0.nc3cz.mongodb.net/Websocket-CRUD?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB Connection Failed", err));

server.listen(4000, ()=> console.log("Webscoket server running at ws:localhost:4000")
)