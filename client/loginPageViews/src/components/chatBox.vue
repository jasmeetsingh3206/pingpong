<template>
  <div>
    <main id="app">
      <section ref="chatArea" class="chat-area rounded-xl flex flex-col justify-end align-top shadow-xl relative">
        <div class="overflow-y-auto scroll-smooth " id="chat-window">
          <p
            v-for="(message, index) in messages"
            class="message"
            :class="{
              'message-out': message.author === 'you',
              'message-in': message.author !== 'you'
            }"
            :key="index"
          >
            {{ message.body }}
          </p>
        </div>
        <div class="m-2">
          <form
            autocomplete="off"
            v-if="this.Store.haveCode == '5iztui'"
            @submit.prevent="sendMessage('in')"
            id="person1-form "
          >
            <input
              v-model="bobMessage"
              id="person1-input"
              type="text"
              placeholder="Type your message"
            />
            <button id="sendbutton" type="submit">
              <img  class="h-7 ml-5" src="../images/email.png" />
            </button>
          </form>
          <form
            autocomplete="off"
            v-else
            @submit.prevent="sendMessage('out')"
            id="person2-form"
            class="flex"
          >
            <input
              v-model="youMessage"
              id="person2-input"
              type="text"
              placeholder="Type your message"
            />
            <button id="sendbutton" type="submit">
              <img  class="h-7 ml-5" src="../images/email.png" />
            </button>
          </form>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
import { mapStores } from 'pinia'
import { useMyStore } from '../store/havecode'

export default {
  name: "chatBox",
  computed: {
    ...mapStores(useMyStore)
  },
  data() {
    return {
      Store: useMyStore(),
      bobMessage: '',
      youMessage: '',
      messages: [
        {
          body: "Welcome to the chat, I'm Bob!",
          author: 'bob'
        },
        {
          body: 'Thank you, Bob',
          author: 'you'
        },
        {
          body: "You're most welcome",
          author: 'bob'
        }
      ]
    }
  },
  methods: {
    scrollup() {
     
      let chatWindow = document.getElementById('chat-window')
      chatWindow.scrollTop = chatWindow.scrollHeight+700;
    },
    sendMessage(direction) {
      document.getElementById('sendbutton').style.opacity = '0'

      if (!this.youMessage && !this.bobMessage) {
        setTimeout(() => {
          document.getElementById('sendbutton').style.opacity = '1'
        }, 80)
        return
      }

      if (direction === 'out') {
        this.messages.push({ body: this.youMessage, author: 'you' })
        this.youMessage = ''
      } else if (direction === 'in') {
        this.messages.push({ body: this.bobMessage, author: 'bob' })
        this.bobMessage = ''
      } else {
        alert('Something went wrong')
      }
      setTimeout(() => {
        document.getElementById('sendbutton').style.opacity = '1'
      }, 80)
      setTimeout(() => {
        this.scrollup();
      }, 0)
      
    }
  },
  mounted() {
    this.$nextTick(() => {
      let messageDisplay = this.$refs.chatArea
      messageDisplay.scrollTop = messageDisplay.scrollHeight
    })
  }
}
</script>

<style scoped >
body,
html {
  font-family: sans-serif;
  font-weight: 100;
  background: #7b4397; /* fallback for old browsers */
  background: -webkit-linear-gradient(to right, #dc2430, #7b4397); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(
    to right,
    #dc2430,
    #7b4397
  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
}

::-webkit-scrollbar{
  width: 8px;
  
}
::-webkit-scrollbar :hover{
  width: 20px;
}
::-webkit-scrollbar-track {
  background-color: darkgrey;
}
::-webkit-scrollbar-thumb {
  box-shadow: inset 0 0 6px rgb(124, 124, 124);
  background: rgb(255, 0, 0);
  border-radius: 5px;
}
.headline {
  text-align: center;
  font-weight: 100;
  color: white;
}
#chatWindow{
    scroll-margin: 30px!important;
}
.chat-area {
  /*   border: 1px solid #ccc; */
  background: white;
  height: 50vh;

  overflow: hidden;
  padding:0 4px 0 6px;
  max-width: 350px;
  margin: 0 auto 2em auto;
}
.message {
  width: 45%;
  border-radius: 5px;
  padding: 0.5em;
  /*   margin-bottom: .5em; */
  font-size: 0.8em;
}
.message-out {
  background: #407fff;
  color: white;
  margin-left: 50%;
  margin-top: 3px;
}
.message-in {
  background: #f1f0f0;
  color: black;
  margin-top: 3px;
}
.chat-inputs {
  margin-top: 13px;
  display: flex;
  justify-content: space-between;

  position: relative;
  vertical-align: bottom;
}
#person1-input {
  padding: 0.5em;
  border-style: solid;
  border-width: 1px;
  border-color: #407fff;
  border-radius: 11px;

  width: 80%;
  height: 6vh;
}
#person2-input {
  padding: 0.5em;
  border-style: solid;
  border-width: 1px;
  border-color: #407fff;
  border-radius: 11px;

  width: 80%;
  height: 6vh;
}
</style>
