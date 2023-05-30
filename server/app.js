// app.js file
const express = require("express");
const socketio = require("socket.io");
const cors = require("cors");
const app = express();
const EventEmitter = require("events");

const emitter = new EventEmitter();

app.use(cors());
app.get("/", (req, res) => {
  res.send("Hello,World");
});
const server = app.listen(3001, () => {
  console.log("Server listening on port 3000");
});

const io = socketio(server);

const roomdata = {};
let numClients = 0;
let key = "";

const myArray = [];
io.on("connection", (socket) => {
  emitter.setMaxListeners(20);
  let check = false;
  console.log("A user connected");
  console.log(io.engine.clientsCount);

  socket.on("join", (data) => {
    let room = Math.random().toString(36).substr(2, 6);
    let socketid = socket.id;

    if (data.havecode != "") {
      myArray.forEach((element) => {
        if (data.havecode === element) {
          room = data.havecode;
          key = room;
          check = true;
          console.log(data.havecode + "ok i understood");
        }
      });
    }
    if (check == false) {
      myArray.push(room);
      key = room;

      roomdata[key] = {
        x_1: 0,
        y_1: 0,
        dx_1: 0,
        dy_1: 0,
        radius_1: 0,
        goals_1: 0,
        gameover: true,
        greyX_1: 210,
        check1_1: false,
        secondgreyX_1: 210,
        heighttemp_1: 500,
        widthtemp_1: 500,
        check_1: false,
        countP1: 0,
        countP2: 0,
        socketid: "",
        direction: "",
        angle_of_incidence: 1,
        player1name: "",
        player2name: "",
        emojyid: null,
        print: false,
        checkrestart: false,
        pause:true,
        Message:''
      };
    }
    console.log(myArray);
    console.log(roomdata);
    data.room = room;

    socket.emit("info", {
      socketid: socketid,
    });

    socket.emit("room-created", {
      roomId: data.room,
    });

    socket.join(data.room);

    if (roomdata[data.room].player1name == "") {
      roomdata[data.room].player1name = data.name;
    } else {
      roomdata[data.room].player2name = data.name;
    }
    socket.on("emojy", (data) => {
      roomdata[room].emojyid = data.selectedEmoji;
      socket.broadcast.to(room).emit("emojies", {
        SelectedEmoji: roomdata[room].emojyid,
      });
    });
    socket.on("sendRecordedSound", (soundData) => {
      socket.broadcast.to(room).emit("playRecordedSound", soundData);
    });
    socket.on('recording',(val)=>{
      socket.broadcast.to(room).emit("recording",val); })
      socket.on('space',()=>{
       if(roomdata[room].pause)roomdata[room].pause=false;
       else roomdata[room].pause=true;
      })

      socket.on('messagePlayer',(data)=>{
        roomdata[room].Message=data.message
        socket.broadcast.to(room).emit('oppmessage',{
          Message:roomdata[room].Message
        })
      })

     

    const rooms = io.sockets.adapter.rooms.get(data.room);

    numClients = rooms.size;

    if (numClients == 2) {
      for (let i = myArray.length - 1; i >= 0; i--) {
        if (myArray[i] === data.room) {
          myArray.splice(i, 1);
        }
      }
    }
    console.log(myArray);
    io.to(data.room).emit("clientcount", {
      clientcount: numClients,
    });

    const clients = Array.from(rooms);
    const client1Id = clients[0];
    const client2Id = clients[1];
    console.log(client1Id, client2Id + "we are the two clients");
    socket.on("movePaddle", (data) => {
      
      if (numClients == 2) {
        let speed =30;
        let count1 = 0;
        let count2 = 0;
        let count3 = 0;
        let count4 = 0;
        if (data.direction === "left") {
          roomdata[room].socketid = socket.id;
          roomdata[room].direction = data.direction;
        
          if (client1Id === socket.id && roomdata[room].greyX_1 > 0) {
            count1 = count1 + 1;
            count3 = 0;

            roomdata[room].greyX_1 = roomdata[room].greyX_1 - count1-speed;
          } else if (
            client2Id === socket.id &&
            roomdata[room].secondgreyX_1 < 420
          ) {
            count2 = count2 + 1;
            count4 = 0;
            roomdata[room].secondgreyX_1 =
              roomdata[room].secondgreyX_1 + speed ;
          }
        }

        if (data.direction === "right") {
          roomdata[room].socketid = socket.id;
          roomdata[room].direction = data.direction;
          if (client1Id === socket.id && roomdata[room].greyX_1 < 420) {
            count1 = 0;
            count3 = count3 + 1
            roomdata[room].greyX_1 = roomdata[room].greyX_1 + speed + count3;
          } else if (
            client2Id === socket.id &&
            roomdata[room].secondgreyX_1 > 0
          ) {
            count4 = count4 + 1;
            count2 = 0;
            roomdata[room].secondgreyX_1 =
              roomdata[room].secondgreyX_1 - speed - count2;
          }
        }

        io.to(room).emit("message", {
          position: roomdata[room].greyX_1,
          secondpostion: roomdata[room].secondgreyX_1,
        });
      }
    });
    socket.on("life", (data) => {
      console.log(data.key);
      if (numClients == 2) {
        io.to(room).emit("playernames", {
          player1name: roomdata[data.key].player1name,
          player2name: roomdata[data.key].player2name,
        });

        roomdata[data.key].x_1 = data.x_1;
        roomdata[data.key].y_1 = data.y_1;
        roomdata[data.key].dx_1 = data.dx_1;
        roomdata[data.key].dy_1 = data.dy_1;
        roomdata[data.key].radius_1 = data.radius_1;
        roomdata[data.key].goals_1 = data.goals_1;
        roomdata[data.key].gameover = data.gameover;
        roomdata[data.key].check1_1 = data.check1_1;
        roomdata[data.key].heighttemp_1 = data.heighttemp_1;
        roomdata[data.key].widthtemp_1 = data.widthtemp_1;
        roomdata[data.key].check_1 = data.check_1;
        roomdata[data.key].countP1 = data.countP1;
        roomdata[data.key].countP2 = data.countP2;
        

        setInterval(() => {
          if(roomdata[data.key].pause){
          if (roomdata[data.key].check1_1 == false) {
            if (
              (roomdata[data.key].y_1 == 440 ||
                roomdata[data.key].y_1 == 64 ||
                (roomdata[data.key].y_1 == 44 &&
                  roomdata[data.key].dy_1 < 0)) &&
              ((roomdata[data.key].x_1 >= roomdata[data.key].greyX_1 - 11 &&
                roomdata[data.key].y_1 == 440) ||
                (roomdata[data.key].x_1 >=
                  roomdata[data.key].secondgreyX_1 - 11 &&
                  roomdata[data.key].y_1 == 64)) &&
              ((roomdata[data.key].x_1 <= roomdata[data.key].greyX_1 + 91 &&
                roomdata[data.key].y_1 == 440) ||
                (roomdata[data.key].x_1 <=
                  roomdata[data.key].secondgreyX_1 + 91 &&
                  roomdata[data.key].y_1 == 64))
            ) {
              io.to(room).emit("collision", {
                collision: true,
              });
              if (roomdata[data.key].check_1 == true) {
                roomdata[data.key].x_1 =
                  roomdata[data.key].x_1 + roomdata[data.key].dx_1;

                roomdata[data.key].y_1 =
                  roomdata[data.key].y_1 - roomdata[data.key].dy_1;

                roomdata[data.key].check_1 = false;
              } else {
                roomdata[data.key].dy_1 = -roomdata[data.key].dy_1;

                roomdata[data.key].y_1 =
                  roomdata[data.key].y_1 - roomdata[data.key].dy_1;

                roomdata[data.key].angle_of_incidence = Math.atan2(
                  roomdata[data.key].y_1,
                  roomdata[data.key].x_1
                );

                if (roomdata[data.key].direction == "left") {
                  if (roomdata[data.key].socketid == client1Id) {
                    if (roomdata[data.key].dx_1 > 0) {
                      roomdata[data.key].dx_1 =
                        roomdata[data.key].dx_1 -
                        1 -
                        Math.cos(roomdata[data.key].angle_of_incidence);
                    } else if (roomdata[data.key].dx_1 < 0) {
                      roomdata[data.key].dx_1 =
                        roomdata[data.key].dx_1 -
                        1 -
                        Math.cos(roomdata[data.key].angle_of_incidence);
                    }
                  } else if (roomdata[data.key].socketid == client2Id) {
                    if (roomdata[data.key].dx_1 > 0) {
                      roomdata[data.key].dx_1 =
                        roomdata[data.key].dx_1 -
                        1 -
                        Math.cos(roomdata[data.key].angle_of_incidence);
                    } else if (roomdata[data.key].dx_1 < 0) {
                      roomdata[data.key].dx_1 =
                        roomdata[data.key].dx_1 -
                        1 -
                        Math.cos(roomdata[data.key].angle_of_incidence);
                    }
                  }
                }

                if (roomdata[data.key].direction == "right") {
                  if (roomdata[data.key].socketid == client1Id) {
                    if (roomdata[data.key].dx_1 > 0) {
                      roomdata[data.key].dx_1 =
                        roomdata[data.key].dx_1 +
                        1 +
                        Math.cos(roomdata[data.key].angle_of_incidence);
                    } else if (roomdata[data.key].dx_1 < 0) {
                      roomdata[data.key].dx_1 =
                        roomdata[data.key].dx_1 +
                        1 +
                        Math.cos(roomdata[data.key].angle_of_incidence);
                    }
                  } else if (roomdata[data.key].socketid == client2Id) {
                    if (roomdata[data.key].dx_1 > 0) {
                      roomdata[data.key].dx_1 =
                        roomdata[data.key].dx_1 +
                        1 +
                        Math.cos(roomdata[data.key].angle_of_incidence);
                    } else if (roomdata[data.key].dx_1 < 0) {
                      roomdata[data.key].dx_1 =
                        roomdata[data.key].dx_1 +
                        1 +
                        Math.cos(roomdata[data.key].angle_of_incidence);
                    }
                  }
                }

                roomdata[data.key].x_1 =
                  roomdata[data.key].x_1 + roomdata[data.key].dx_1;
              }
            } else {
              if (
                roomdata[data.key].x_1 + roomdata[data.key].radius_1 >=
                  roomdata[data.key].widthtemp_1 ||
                roomdata[data.key].x_1 - roomdata[data.key].radius_1 <= 0
              ) {
                roomdata[data.key].dx_1 = -roomdata[data.key].dx_1;
              }

              if (
                roomdata[data.key].y_1 + roomdata[data.key].radius_1 >=
                  roomdata[data.key].heighttemp_1 ||
                roomdata[data.key].y_1 - roomdata[data.key].radius_1 <= 0
              ) {
                if (
                  roomdata[data.key].x_1 >= 185 &&
                  roomdata[data.key].x_1 <= 315
                ) {
                  io.to(room).emit("goalsound", {
                    goalsound: true,
                  });
                  if (
                    roomdata[data.key].y_1 > 100 &&
                    roomdata[data.key].countP1 != 5 &&
                    roomdata[data.key].countP2 != 5
                  ) {
                    roomdata[data.key].countP2++;
                    roomdata[data.key].dy_1 = -roomdata[data.key].dy_1;
                    io.to(room).emit("scoreUpdate", {
                      countPlayer1: roomdata[data.key].countP1,
                      countPlayer2: roomdata[data.key].countP2,
                    });
                  } else if (
                    roomdata[data.key].y_1 < 100 &&
                    roomdata[data.key].countP1 != 5 &&
                    roomdata[data.key].countP2 != 5
                  ) {
                    roomdata[data.key].countP1++;
                    roomdata[data.key].dy_1 = -roomdata[data.key].dy_1;
                    io.to(room).emit("scoreUpdate", {
                      countPlayer1: roomdata[data.key].countP1,
                      countPlayer2: roomdata[data.key].countP2,
                    });
                  }
                  if (
                    roomdata[data.key].countP1 == 5 ||
                    roomdata[data.key].countP2 == 5
                  ) {
                    let temp = "";

                    if (roomdata[data.key].y_1 > 100) 
                    temp = roomdata[data.key].player2name;
                    else 
                    temp = roomdata[data.key].player1name;

                    roomdata[data.key].checkrestart=true;
                    roomdata[data.key].print=true;
                    io.to(room).emit("gameover", 
                    {
                      gamestatus: "over",
                      winner: temp,
                      finalP1: roomdata[data.key].countP1,
                      finalP2: roomdata[data.key].countP2,
                      checkrestart:roomdata[data.key].checkrestart,
                      print:roomdata[data.key].checkrestart,
                    });
                    
                    return;
                  }
                } else
                {
                  roomdata[data.key].goals_1 = roomdata[data.key].goals_1 - 1;
                  roomdata[data.key].dy_1 = -roomdata[data.key].dy_1;
                }
              }
              roomdata[data.key].x_1 =
                roomdata[data.key].x_1 + roomdata[data.key].dx_1;
              roomdata[data.key].y_1 =
                roomdata[data.key].y_1 - roomdata[data.key].dy_1;
            }
          }

          io.to(room).emit("gameanimated", {
            x_cordinate_center: roomdata[data.key].x_1,
            y_cordinate_center: roomdata[data.key].y_1,
            xspeed: roomdata[data.key].dx_1,
            yspeed: roomdata[data.key].dy_1,
            radius_1: roomdata[data.key].radius_1,
            goals_1: roomdata[data.key].goals_1,
            gameover: roomdata[data.key].gameover,
            check_1: roomdata[data.key].check_1,
            check1_1: roomdata[data.key].check1_1,
          });
        console.log(numClients)
        }}, 20);
   
      
      }
        socket.on("replay", () => {
         console.log("jhijdefjldsjfids")
          roomdata[room].x_1 = 250; 
        
          roomdata[room].y_1 = 440;
          roomdata[room].dx_1=4;
          roomdata[room].dy_1=-4
        
          roomdata[room].countP1 = 0;
          roomdata[room].countP2 = 0;
          roomdata[room].secondgreyX_1 = 210;
          roomdata[room].greyX_1 = 210;
          roomdata[room].checkrestart=false;
          roomdata[room].print=false;
          
          io.to(room).emit('refresh',{
            checkrestart: roomdata[room].checkrestart,
            print:roomdata[room].print,
            countP1: roomdata[room].countP1,
            countP2: roomdata[room].countP2,
            greyX_1: roomdata[room].greyX_1 ,
            secondgreyX_1:roomdata[room].secondgreyX_1,
           
          })
        });

    });
  });
});
