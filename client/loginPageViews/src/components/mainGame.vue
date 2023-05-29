<!-- client side -->
<template>
  <div class="bg-green-100 h-screen flex flex-col items-center justify-evenly">
    <div class="flex justify-center">
      <span class="font-semibold lg:text-xl mt-2">Room Code : {{ code }}</span>
    </div>

    <div class="z-20">
      <button v-if="checkrestart === true" @click="replay" class="restart rounded-3xl mt-12">Restart</button>
      <button v-if="checkrestart === true" type="button" class="restart rounded-3xl" @click="restart">
        Home
      </button>
    </div>
    <div  v-if="print === true" class=" z-20 ola text-xl font-bold">
      <div class="z-20">{{ countP1 }} - {{ countP2 }}</div>
      <h1 class="z-20">{{ winner }} WINS!!</h1>

    </div>
    <div class="flex justify-center mt-3 h-fit">
      <div>
        <span class="bg-blue-100 shadow-sm text-blue-800 lg:text-xl h-fit font-medium mr-2 px-2.5 py-0.5 rounded">
          {{ Store.opponentName }}
        </span>
      </div>

      <div @click="Store.showEmojiPicker = !Store.showEmojiPicker"
        class="text-2xl hover:cursor-pointer  animate-bounce h-fit">
        {{ Store.opponentEmoji }}
      </div>
      <div v-if="trying">
        <img src="../images/output-onlinegiftools.gif" class="relative bottom-3 left-3 h-8 scale-[1.9]" />
      </div>
    </div>
    <hollow-dots-spinner v-if="Store.clientcount == 1" :animation-duration="1000" :dot-size="15" :dots-num="3"
      color="#3d8ab5" class="mt-2" />
    <canvas v-if="this.Store.havecode == '5iztui'" ref="canvas"
      class="rounded-xl bg-gradient-to-r from-teal-200 to-teal-300 m-auto mt-6 mb-4 border-black z-10 cust shadow-md h-[45dvh] lg:h-[63dvh]"
      height="500" width="500"></canvas>
    <canvas v-else-if="this.Store.havecode !== '5iztui'" ref="canvas"
      class="rounded--xl bg-gradient-to-r from-teal-200 to-teal-300 m-auto mt-6 mb-4 z-10 border-black cust shadow-md h-[45dvh] lg:h-[63dvh]"
      height="500" width="500" v-bind:style="canvasrotation">
    </canvas>

    <div class="flex mt-1">
      <div id="voiceButton" class="cursor-pointer relative py-2 scale-[1.3] mr-3">
        <img :class="{ hidden: recording }"  class="h-8 rounded-full mx-2" src="../images/podcast.png" />
        <img  :class="{ hidden: !recording }" class="h-8 rounded-full mx-2 scale-[1.3]" src="../images/podcast.gif" />
      </div>

      <button @click="Store.showEmojiPicker = !Store.showEmojiPicker"
        class="bg-blue-100 shadow-md text-blue-800 text-xl font-medium mr-2 px-2.5 py-0.5 rounded">
        {{ Store.myName }}
      </button>
      <EmojiPicker v-if="Store.showEmojiPicker" @select="showEmoji" class="fixed lg:right-40 z-50 bottom-10"
        disable-skin-tones="true" display-recent="true" native="true" hide-group-icons="true"
        disabled-groups="['animals_nature', 'objects', 'symbols', 'travel_places']" />
      <button @click="Store.showEmojiPicker = !Store.showEmojiPicker" class="text-2xl">
        {{ Store.selectedEmoji }}
      </button>
    </div>

    <div class="flex md:hidden w-full justify-between">
      <i class="fa fa-arrow-left h-14 mb-10 ml-9 text-5xl text-blue-900" @click="buttonLeft"></i>
      <i class="fa fa-arrow-right h-14 mb-10 mr-9 text-5xl text-blue-900" @click="buttonRight"></i>
    </div>
    <img src="../images/logo.png" class="h-20 lg:h-80 lg:m-5 m-1 mt-5 absolute top-0 left-2" />

    <Transition name="slide-fade">
      <chatBox @some-event="sendMessage" v-if="showChat"
        class="h-12 lg:h-25 m-5 absolute top-16 right-0  lg:right-2 z-50 " />
    </Transition>

    <div class="absolute flex gap-1 top-4 right-3 ">
      <img @click="soundToggle" :class="{ hidden: soundFlag }" src="../images/mute.gif" class="  h-10 lg:h-12 lg:m-2 " />
      <img :class="{ hidden: !soundFlag }" @click="soundToggle" src="../images/sound.gif" class="h-10 lg:h-12 lg:m-2" />
      
      
      <!-- <img :class="{ hidden: showChat }" @click="showNotification" src="../images/chat.png"
        class="h-10  lg:h-10 lg:m-3 lg:ml-0" /> -->
      <img :class="{ hidden: !showChat }" @click="showChat = !showChat" src="../images/chat.gif" class="h-12 lg:h-12 lg:m-2 lg:ml-0" />
      <div :class="{ hidden: showChat }">
        <img  @click="showNotification" src="../images/chat.png"
        class="h-10  lg:h-10 lg:m-3 lg:ml-0" />        
        <span
          v-if="notifaction" class="top-[-4px] lg:top-[3px] lg:right-2 right-[-2px] absolute  animate-[ping_1.2s_ease-in-out_infinite]  w-3 h-3 bg-orange-500  dark:border-gray-800 rounded-full"></span>
      </div>
       
      <!-- <img v-if="notifaction && !showChat" @click="showNotification" src="../images/nlogo.png"
        class="h-12 lg:h-12 lg:m-2 lg:ml-0" /> -->
    </div>
  </div>
</template>

<script>
// import io from 'socket.io-client';
import socket from '@/SocketConnection.js'
// import gameStarting from '@/components/gameStarting.vue'
import { mapStores } from 'pinia'
import { useMyStore } from '../store/havecode'
// import { PulseLoader } from 'vue-spinner/dist/vue-spinner.min.js'
import { HollowDotsSpinner } from 'epic-spinners'
import EmojiPicker from 'vue3-emoji-picker'
// stylesheet
import chatBox from '../components/chatBox.vue'
import '../../node_modules/vue3-emoji-picker/dist/style.css'

export default {
  name: 'helloWorld',
  components: {
    HollowDotsSpinner,
    EmojiPicker: EmojiPicker,
    chatBox
  },
  watch: {
    // 'Store.clientcount'(newVal) {
    //   if (newVal === 2 && this.audio.paused) this.audio.play()
    // }
  },

  data() {
    return {
      Store: useMyStore(),
      widthtemp_1: 500,
      heighttemp_1: 500,
      x_1: 250,
      dx_1: 4,
      y_1: 440,
      dy_1: 4,
      radius_1: 10,
      greyX_1: 210,
      greyY_1: 450,
      secondgreyX_1: 210,
      secondgreyY_1: 50,
      check_1: true,
      check1_1: false,
      socket: null,
      room: '',
      code: '...',
      socketid: '',
      gameover: '',
      countP1: 0,
      countP2: 0,
      paddel1Velocity: 0,
      paddel2Velocity: 0,
      checkrestart: false,
      print: false,
      // audio: null, //audio
      bounce_sound: null, //audio
      goalSound: null, //audio
      mediaRecorder: null,
      recording: false,
      voiceButton: null,
      trying: null,
      showChat: false,
      soundFlag: true,
      audioBlob: null,
      audioElement: null,
      winner: '',
      notifaction:false,
      pv:0
    }
  },
  computed: {
    ...mapStores(useMyStore),

    canvasrotation() {
      return {
        transform: 'rotate(180deg)'
      }
    }
  },

  mounted() {
    const canvas = this.$refs.canvas

    if (canvas.getContext != null) {
      const context_1 = canvas.getContext('2d')
      // to create rectangle
      context_1.beginPath()
      context_1.arc(250, 500, 95, 0, 2 * Math.PI)
      context_1.strokeStyle = 'black'
      context_1.stroke()

      context_1.beginPath()
      context_1.arc(250, 0, 95, 0, 2 * Math.PI)
      context_1.strokeStyle = 'black'
      context_1.stroke()

      context_1.beginPath()
      context_1.moveTo(0, 250)
      context_1.lineTo(500, 250)
      context_1.stroke()

      context_1.beginPath()
      context_1.arc(250, 250, 60, 0, 2 * Math.PI)
      context_1.strokeStyle = 'black'
      context_1.stroke()

      context_1.beginPath()
      context_1.fillStyle = '#32756c'
      context_1.fillRect(185, 490, 130, 10)
      context_1.strokeStyle = 'red'
      context_1.stroke()

      context_1.fillStyle = '#32756c'
      context_1.fillRect(185, 0, 130, 10)
      context_1.strokeStyle = 'red'
      context_1.stroke()

      context_1.beginPath()
      context_1.fillStyle = 'black'
      context_1.fillRect(this.greyX_1, this.greyY_1, 80, 5)
      context_1.stroke()

      context_1.beginPath()
      context_1.fillStyle = 'black'
      context_1.fillRect(this.secondgreyX_1, this.secondgreyY_1, 80, 5)
      context_1.stroke()

      context_1.beginPath()
      context_1.arc(250, 250, this.radius_1, 0, 2 * Math.PI)
      context_1.fillStyle = '#fe4f32'
      context_1.fill()

      // this.audio = new Audio(
      //   'https://docs.google.com/uc?export=download&id=17diq43t5Rc8Z9ppvQG5d6PRFx9-KxemO'
      // )
      // this.audio.volume = 0.1
      this.bounce_sound = new Audio(
        'https://docs.google.com/uc?export=download&id=1ULvJnA8QyCnyRfcDLla7TFdVo2Kufymc'
      )
      this.goalSound = new Audio(
        'https://docs.google.com/uc?export=download&id=1X2ls1jko9rdX0Ukm6ON7WVpNsfPtXVfB'
      )
      this.connectToSocket()
      navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
        this.mediaRecorder = new MediaRecorder(stream)
        let chunks = []
        this.mediaRecorder.addEventListener('dataavailable', (event) => {
          chunks.push(event.data)
        })
        this.mediaRecorder.addEventListener('stop', () => {
          const recordedSound = new Blob(chunks, { type: 'audio/webm' })
          socket.emit('sendRecordedSound', recordedSound)
          chunks = []
        })
      })

      this.voiceButton = document.getElementById('voiceButton')
      this.voiceButton.addEventListener('click', () => {
        if (this.mediaRecorder.state === 'inactive') {
          this.mediaRecorder.start()
          this.recording = true
          this.socket.emit('recording', true)

          // this.voiceButton.src = 'C:/Users/jasmeet/Downloads/pingpong (1)/pingpong/client/loginPageViews/src/images/podcast.gif';
        } else {
          this.mediaRecorder.stop()
          this.recording = false
          this.socket.emit('recording', false)
          // this.voiceButton.textContent = 'Record Voice';
        }
      })
      document.addEventListener('keydown', (event) => {
        if (this.pv < 7) this.pv = this.pv + 3;
        if (event.code === 'Space' && !this.showChat) this.socket.emit('space')
        if (event.code === 'ArrowLeft') {
          this.socket.emit('movePaddle', {
            direction: 'left',
            pv:this.pv
            
          })
        } else if (event.code === 'ArrowRight') {
          this.socket.emit('movePaddle', {
            direction: 'right',
            pv:this.pv
          
          })
        }
      })
      document.addEventListener('keyup', () => {
        this.pv=2;
      })
    }
  },
  methods: {
    showNotification() {
      this.showChat = !this.showChat
      this.notifaction = false

    },
    soundToggle() {
      this.soundFlag = !this.soundFlag
      // this.audio.muted = !this.soundFlag
      this.goalSound.muted = !this.soundFlag
      this.bounce_sound.muted = !this.soundFlag
      this.audioElement.muted = !this.soundFlags
    },

    sendMessage() {
      console.log("helloji");
      console.log(this.Store.inputMessage)
      if (this.Store.inputMessage) {
        socket.emit("messagePlayer", {
          message: this.Store.inputMessage
        })
        this.Store.messages.push({
          body: this.Store.inputMessage,
          author: "you"
        })
      }
      this.Store.inputMessage = "";
    },

    showEmoji(e) {
      this.Store.selectedEmoji = e.i

      this.Store.showEmojiPicker = false
      this.socket.emit('emojy', {
        selectedEmoji: this.Store.selectedEmoji
      })
    },
    restart() {
      this.Store.restart = true
      this.$router.replace('/')
    },
    buttonLeft(e) {
      e.target.style.opacity = '0'
      this.socket.emit('movePaddle', {
        direction: 'left',
            pv:this.pv
      })
      // debugger
      setTimeout(() => {
        e.target.style.opacity = '.8'
      }, 100)
    },
    buttonRight(e) {
      e.target.style.opacity = '0'
      this.socket.emit('movePaddle', { direction: 'right',
            pv:this.pv
          
      })
      setTimeout(() => {
        e.target.style.opacity = '.8'
      }, 80)
    },

    connectToSocket() {
      this.socket = socket

      this.socket.emit('join', {
        roomId: this.room,
        havecode: this.Store.havecode,
        name: this.Store.myName
      })
      let data = {
        x_1: this.x_1,
        y_1: this.y_1,
        radius_1: this.radius_1,
        dx_1: this.dx_1,
        dy_1: this.dy_1,
        goals_1: this.goals_1,
        code: this.code,
        greyX_1: this.greyX_1,
        check1_1: this.check1_1,
        check_1: this.check_1,
        secondgreyX_1: this.secondgreyX_1,
        widthtemp_1: 500,
        heighttemp_1: 500,
        key: this.Store.havecode,

        countP1: this.countP1,
        countP2: this.countP2,
        paddel1Velocity: this.paddel1Velocity,
        paddel2Velocity: this.paddel1Velocity
      }
      this.socket.emit('life', data)

      this.socket.on('emojies', (data) => {
        this.Store.opponentEmoji = data.SelectedEmoji
      })

      this.socket.on('room-created', (data) => {
        this.code = data.roomId
      })
      this.socket.on('info', (data) => {
        this.socketid = data.socketid
      })

      this.socket.on('message', (data) => {
        this.greyX_1 = data.position
        this.secondgreyX_1 = data.secondpostion
      })
      this.socket.on('collision', () => {
        this.bounce_sound.play()
      })
      this.socket.on('goalsound', () => {
        if (this.gameover !== 'over') this.goalSound.play()
      })
      this.socket.on('gameanimated', (data) => {
        this.x_1 = data.x_cordinate_center
        this.y_1 = data.y_cordinate_center
        this.dx_1 = data.xspeed
        this.dy_1 = data.yspeed
          ; (this.radius_1 = data.radius_1),
            (this.goals_1 = data.goals_1),
            (this.gameover = data.gameover),
            (this.check1_1 = data.check1_1),
            (this.check_1 = data.check_1)

        this.canvasupdate()
      })
      this.socket.on('clientcount', (data) => {
        this.Store.clientcount = data.clientcount
      })
      this.socket.on('gameover', (data) => {
        this.gameover = data.gamestatus
        this.winner = data.winner
        console.log(data)
        console.log(this.winner)
        this.checkrestart = data.checkrestart
        this.print = data.print
        // this.audio.pause()
        this.goalSound.pause()
        this.bounce_sound.pause()

        this.updatewinnerstatus()
      })
      this.socket.on('scoreUpdate', (data) => {
        this.countP1 = data.countPlayer1
        this.countP2 = data.countPlayer2
      })
      this.socket.on('playernames', (data) => {
        if (this.Store.havecode === '5iztui') this.Store.opponentName = data.player2name
        else this.Store.opponentName = data.player1name
      })

      this.socket.on('playRecordedSound', (soundData) => {
        if (this.soundFlag) {
          this.audioBlob = new Blob([soundData], { type: 'audio/*' })
          this.audioElement = new Audio()
          this.audioElement.src = URL.createObjectURL(this.audioBlob)
          document.body.appendChild(this.audioElement)
          this.audioElement.play()
        }
      })
      this.socket.on('refresh', (data) => {
        this.checkrestart = data.checkrestart
        this.print = data.print
        this.countP1 = data.countP1
        this.countP2 = data.countP2
        this.greyX_1 = data.greyX_1
        this.secondgreyX_1 = data.secondgreyX_1
        this.dx_1 = data.dx_1
        this.dy_1 = data.dy_1
      })
      this.socket.on('recording', (data) => {
        if (data) this.trying = true
        else this.trying = false
      })
      this.socket.on('oppmessage', (data) => {
        console.log(data.Message)
        if (!this.showChat) this.notifaction = true;
        this.Store.messages.push({
          body: data.Message,
          author: "bob"
        })
      })
    },

    canvasupdate() {
      const canvas = this.$refs.canvas

      if (canvas.getContext('2d') != null) {
        const context_1 = canvas.getContext('2d')
        context_1.clearRect(0, 0, 500, 500)
        context_1.beginPath()
        context_1.arc(250, 500, 95, 0, 2 * Math.PI)
        context_1.strokeStyle = 'black'
        context_1.stroke()

        context_1.beginPath()
        context_1.arc(250, 0, 95, 0, 2 * Math.PI)
        context_1.strokeStyle = 'black'
        context_1.stroke()

        context_1.beginPath()
        context_1.moveTo(0, 250)
        context_1.lineTo(500, 250)
        context_1.stroke()

        context_1.beginPath()
        context_1.arc(250, 250, 60, 0, 2 * Math.PI)
        context_1.strokeStyle = 'black'
        context_1.stroke()

        context_1.beginPath()
        context_1.fillStyle = '#32756c' //pinkkkk
        context_1.fillRect(185, 490, 130, 10)
        context_1.strokeStyle = '#ffaa47'
        context_1.stroke()

        context_1.fillStyle = '#32756c'
        context_1.fillRect(185, 0, 130, 10)
        context_1.strokeStyle = '#ffaa47'
        context_1.stroke()

        context_1.beginPath()
        context_1.fillStyle = '#ef476f'
        context_1.fillRect(this.greyX_1 + 1, this.greyY_1, 80, 5)
        context_1.stroke()

        context_1.beginPath()
        context_1.fillStyle = '#ef476f'
        context_1.fillRect(this.secondgreyX_1, this.secondgreyY_1, 80, 5)
        context_1.stroke()

        context_1.beginPath()
        context_1.arc(this.x_1, this.y_1, this.radius_1, 0, 2 * Math.PI)
        context_1.fillStyle = '#fe4f32'
        context_1.fill()

        if (this.Store.havecode == '5iztui') {
          context_1.font = 'italic bold 60px cursive'
          context_1.fillStyle = 'green'
          context_1.fillText(this.countP2, 50, 230)

          context_1.font = 'italic bold 60px cursive'
          context_1.fillStyle = 'mint'
          context_1.fillText(this.countP1, 50, 310)
        } else {
          context_1.save()

          context_1.translate(200, 200)
          context_1.rotate(Math.PI)

          context_1.font = 'italic bold 60px cursive'
          context_1.fillStyle = 'skyblue'
          context_1.fillText(this.countP2, -250, 10)

          context_1.font = 'italic bold 60px cursive'
          context_1.fillStyle = 'skyblue'
          context_1.fillText(this.countP1, -245, -80)

          context_1.restore()
        }
      }
    },
    updatewinnerstatus() {
      const canvas = this.$refs.canvas
      const ctx = canvas.getContext('2d')
      ctx.clearRect(0, 0, 500, 500)
    },
    replay() {
      this.socket.emit('replay')
    }
  },
  beforeUnmount() {
    this.socket.close()
  }
}
</script>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.2s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-40px);
  opacity: 0;
}

.flipimage {
  -webkit-transform: scaleX(-1);
  transform: scaleX(-1);
}

.restart {
  width: 150px;
  height: 40px;
  border: 1px solid rgb(37, 1, 1);

  border-radius: 3cm;
  background-color: rgb(219, 90, 90);
  font-size: medium;
  color: rgb(252, 251, 251);

  position: absolute;
  top: 55%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 999;
}

.cus {
  margin-left: 400px;
}

.cust {
  border: 4px solid rgba(58, 46, 46, 0.973);
  margin-top: 16px;
}

.customclass {
  height: 100vh;
}

.ola {
  display: flex;
  justify-content: center;
  position: relative;
  top: 29%;
  flex-direction: column;
  flex-wrap: wrap;
  align-items: center;
}
</style>
