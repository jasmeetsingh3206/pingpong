import io from 'socket.io-client';
//s://airhockey.onrender.com
const socket = io('https://paddleprodigybackend.onrender.com', {
    transports: ['websocket'],
    extraHeaders: {
      'Access-Control-Allow-Origin': 'http://localhost:5173' 
    }
  });

export default socket;