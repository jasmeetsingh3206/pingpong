<template>
  <div>
    <div class="flex flex-col items-center justify-center h-screen bg-green-100">
      <h1 class="wave-animation font-black text-3xl">Ping Pong</h1>
      <img class="rounded-xl md:mt-2 sm:m-5 h-80 sm:h-[55dvh]" src="../images/pong.png" alt="" />
    
      <div class="mt-2 md:mt-0">
        <form class="flex items-center justify-center space-x-4 flex-wrap mr-4 flex-col">
          <label for="room-name" class="sr-only">Room Name:</label>
          <span v-if="myStoreStore.msg==true"   class=" mb-3 font-extrabold text-red-600" >Player Disconnected{{ restartMessage() }}</span>
          <div>
            <div
              class="flex mt-2 text-sm text-red-800 dark:bg-gray-800 dark:text-red-400 dark:border-red-800"
              v-if="this.invalid"
              role="alert"
            >

              <span class="sr-only">Info</span>
              <div>
                <span v-if="this.invalid === 1" class="font-medium">Invalid Room Id and Name</span>
                <span v-if="this.invalid === 2" class="font-medium">Invalid Name</span>
                <span v-if="this.invalid === 3" class="font-medium">Invalid Room Id</span>
               
               
              </div>
            
            </div>
            <div class="flex justify-items-center">
              <input
                id="my-name"
                type="text"
          
                placeholder="Enter your name"
                v-model="myStoreStore.myName"
                class="border border-gray-300 rounded-md px-4 py-2 w-40 mr-2 sm:w-40 mb-4 shadow-lg"
              />
  
              <input
                id="room-name"
                type="text"
                placeholder="Enter Code"
                v-model="haveCode"
                class="border border-gray-300 rounded-md px-4 py-2 w-40 sm:w-40 mb-4 shadow-lg"
              />
            </div>
            </div>
            <div class="flex justify-items-center">
              <button
                type="submit"
                @click.prevent="joinGame"
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mr-3 rounded-md shadow-lg "
              >
                Join Room
              </button>
              <button
              :disabled="haveCode!=''"
              v-if="haveCode==''"

                type="submit"
                @click.prevent="maingame"
                class="bg-slate-800 hover:bg-green-700 text-white font-bold py-2 px-2 rounded-md ml- shadow-lg"
              >
                
                Create Room
              </button>
            </div>
        </form>
        <div v-if="myStoreStore.restart == true">{{ restartMessage() }}</div>
        
      </div>
    </div>
   
  </div>
</template>

<script>
import { gsap } from 'gsap'
import { mapStores } from 'pinia'
import { useMyStore } from '../store/havecode'

export default {
  data() {
    return {
      haveCode: '',
      invalid: 0
    }
  },
  mounted() {
    this.animateBackground()
  
  },
  computed: {
    ...mapStores(useMyStore)
  },
  methods: {
    joinGame() {
      this.haveCode=this.haveCode.trim()

      this.myStoreStore.havecode = this.haveCode
      console.log( this.myStoreStore.havecode)

      if ((this.haveCode !==''||this.haveCode !==null) && this.haveCode.length == 6 && (this.myStoreStore.myName !== '' && this.myStoreStore.myName !==null)) {
        this.$router.replace('/game')
      } else {
        if ((this.haveCode ===''||this.haveCode ===null)&&(this.myStoreStore.myName === ''||this.myStoreStore.myName ===null)){
          this.invalid = 1
        } else if ((this.haveCode !==''||this.haveCode !==null)&&(this.myStoreStore.myName === ''||this.myStoreStore.myName ===null)) {
          this.invalid = 2
          
        } else if((this.haveCode ===''||this.haveCode ===null)&&(this.myStoreStore.myName !== ''||this.myStoreStore.myName !==null)){
          this.invalid = 3
        }
        console.log(this.invalid)
      }
      
    },
    maingame() {
      console.log(this.myStoreStore.myName)
      if (this.myStoreStore.myName!==''&&this.myStoreStore.myName!==null) {
        this.$router.replace('/game')
      } else {
      this.invalid=2;
      }
    },

    animateBackground() {
      gsap.to('.bg-green-100', {
        duration: 2,
        backgroundColor: 'bg-green-400', // dark violet color
        ease: 'power2.inOut',
        yoyo: true,
        repeat: -1
      })
    },

    restartMessage() {
   
      window.location.reload()
    }
  }
}
</script>
<style scoped>
h1 {
  font-size: xx-large;
  margin-bottom: 20px;

  text-shadow: 2px 2px #31a19c;
}
.wave-animation {
  position: relative;
  display: inline-block;
  animation: wave 2s ease-in-out infinite;
  font-size: 45px;
}

@keyframes wave {
  0% {
    transform: rotate(0deg);
  }
  10% {
    transform: rotate(2deg);
  }
  20% {
    transform: rotate(-2deg);
  }
  30% {
    transform: rotate(4deg);
  }
  40% {
    transform: rotate(-4deg);
  }
  50% {
    transform: rotate(6deg);
  }
  60% {
    transform: rotate(-6deg);
  }
  70% {
    transform: rotate(2deg);
  }
  80% {
    transform: rotate(-2deg);
  }
  90% {
    transform: rotate(1deg);
  }
  100% {
    transform: rotate(0deg);
  }
}
.ball {
  position: relative;
  bottom: 50px;
  left: calc(100% - 20px);
  width: 50px;
  height: 50px;
  background: #fff;
  border-radius: 50%;
  animation: ball-move8234 3s ease-in-out 1s infinite alternate;
}

.ball::after {
  position: absolute;
  content: '';
  top: 25px;
  right: 5px;
  width: 5px;
  height: 5px;
  background: #000;
  border-radius: 50%;
}

.bar {
  width: 200px;
  height: 12.5px;
  background: #FFDAAF;
  border-radius: 30px;
  transform: rotate(-15deg);
  animation: up-down6123 3s ease-in-out 1s infinite alternate;
}

@keyframes up-down6123 {
  from {
    transform: rotate(-15deg);
  }

  to {
    transform: rotate(15deg);
  }
}

@keyframes ball-move8234 {
  from {
    left: calc(100% - 40px);
    transform: rotate(360deg);
  }

  to {
    left: calc(0% - 20px);
    transform: rotate(0deg);
  }
}
</style>
