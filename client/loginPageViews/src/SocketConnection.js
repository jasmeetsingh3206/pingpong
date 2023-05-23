import io from 'socket.io-client';
//s://airhockey.onrender.com
const socket = io('http://localhost:3001/', {
    transports: ['websocket'],
    extraHeaders: {
      'Access-Control-Allow-Origin': 'http://localhost:5173' 
    }
  });

export default socket;