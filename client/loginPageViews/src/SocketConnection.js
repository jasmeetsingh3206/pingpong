import io from 'socket.io-client';
//s://airhockey.onrender.com
const socket = io('https://iisext.sonartechnologies.com:3261/', {
    transports: ['websocket'],
    extraHeaders: {
      'Access-Conrol-Allow-Origin': 'http://localhost:5173' 
    }
  });

export default socket;