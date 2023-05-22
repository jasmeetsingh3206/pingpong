import { defineStore } from 'pinia'

export const useMyStore = defineStore('myStore', {
  state: () => ({
    havecode: '5iztui',
    clientcount: 0,
    socketid: '',
    restart: false,
    myName: 'your name',
    opponentName: 'Waiting for opponent',
    selectedEmoji:null,
    opponentEmoji: null,
    showEmojiPicker:false,
    bobMessage: '',
    youMessage: '',
    messages: [
    
    ],
    inputMessage:""
  }),
  actions: {
    setVariable(value1,value2) {
      this.bobMessage = value1
      this.youMessage=value2
    }
  }
})
