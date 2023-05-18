<template>
  <div>
    <div class="flex flex-col items-center justify-center h-screen bg-green-100">
      <h1 class="wave-animation font-black text-3xl">Ping Pong</h1>
      <img class="rounded-xl md:mt-2 sm:m-5 h-80 sm:h-[55dvh]" src="../images/pong.png" alt="" />
      
      <div class="mt-6">
        <form class="flex items-center justify-center space-x-4 flex-wrap mr-4 flex-col">
          <label for="room-name" class="sr-only">Room Name:</label>
          <div>
            <div
              class="flex mt-2 text-sm text-red-800 dark:bg-gray-800 dark:text-red-400 dark:border-red-800"
              v-if="invalid !==null&& invalid!==''"
              role="alert"
            >
              <svg
                aria-hidden="true"
                class="flex-shrink-0 inline w-5 h-5 mr-3"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clip-rule="evenodd"
                ></path>
              </svg>
              <span class="sr-only">Info</span>
              <div>
                <span v-if="this.invalid === 1" class="font-medium">Invalid Room Id and Name</span>
                <span v-if="this.invalid === 2" class="font-medium">Invalid Name</span>
                <span v-if="this.invalid === 3" class="font-medium">Invalid Room Id</span>
              </div>
            </div>
            <input
              id="my-name"
              type="text"
        
              placeholder="Enter your name here"
              v-model="myStoreStore.myName"
              class="border border-gray-300 rounded-md px-4 py-2 w-full sm:w-64 mb-4 shadow-lg"
            />

            <input
              id="room-name"
              type="text"
              placeholder="Enter Code"
              v-model="haveCode"
              class="border border-gray-300 rounded-md px-4 py-2 w-full sm:w-64 mb-4 shadow-lg"
            />
          </div>
          <div class="flex justify-items-center">
            <button
              type="submit"
              @click.prevent="joinGame"
              class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md shadow-lg "
            >
              Join Room
            </button>
            <button
              type="submit"
              @click.prevent="maingame"
              class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md ml-3 shadow-lg"
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
      this.myStoreStore.havecode = this.haveCode

      if ((this.haveCode !==''||this.haveCode !==null) && this.haveCode.length == 6 && (this.myStoreStore.myName !== ''||this.myStoreStore.myName !==null)) {
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
</style>
