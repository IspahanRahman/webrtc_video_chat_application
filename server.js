const express=require('express')
const app=express()
const server =require('http').Server(app)
const io=require('socket.io')(server)
const { v4:uuidV4 }=require('uuid')
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
    debug: true
});



app.set('view engine','ejs')
app.set('views','views')

app.use(express.static('public'))
app.use('/peerjs',peerServer)

app.get('/',(req,res)=>{
   res.redirect(`/${uuidV4()}`)
})

app.get('/:room',(req,res)=>{
    res.render('room',{roomId:req.params.room})
})

io.on('connection',socket=>{
    socket.on('join-room',(roomId,userId)=>{
        socket.join(roomId);
        socket.to(roomId).emit('user-connected',userId);

        socket.on('disconnect',()=>{
            socket.to(roomId).emit('user-disconnected',userId)
        })
    })

})


server.listen(8080,()=>{
    console.log('Server is running on port 8080')
})