
const socket=io('/')
const videoGrid = document.getElementById('video-grid')
const peer = new Peer(undefined,{
  path:'/peerjs',
  host:'/',
  port:'8080'
});
const myVideo = document.createElement('video')

myVideo.muted=true
const peers={}

navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(stream => {
  //myVideoStream = stream;
  addVideoStream(myVideo, stream)

  peer.on('call',call=>{
    call.answer(stream)
    const video=document.createElement('video')
    call.on('stream',userVideoStream=>{
      addVideoStream(video,userVideoStream)
    })
  })


  socket.on('user-connected',userId=>{
    connecToNewUser(userId,stream)
  })

 

  
})

socket.on('user-disconnected',userId=>{
  if(peers[userId]) peers[userId].close()
})

peer.on('open',id=>{
  socket.emit('join-room',ROOM_ID,id)
})



// let myVideoStream




// peer.on('open',id=>{
//   socket.emit('join-room',ROOM_ID,id)
// })



const connecToNewUser=(userId,stream)=>{
  const call=peer.call(userId,stream)
  const video=document.createElement('video')
  call.on('stream',userVideoStream=>{
    addVideoStream(video,userVideoStream)
  })

  call.on('close',()=>{
    video.remove()
  })
  
  peers[userId]=call
}

const addVideoStream=(video,stream)=>{
   video.srcObject=stream
   video.addEventListener('loadedmetadata',()=>{
       video.play()
   })
   videoGrid.append(video)
}