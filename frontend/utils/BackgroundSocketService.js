import io from 'socket.io-client';
import { AppState } from 'react-native';

let socket = null;
let appStateSubscription = null;

export const startSocket = async (url) => {
  if (socket) {
    console.log('Socket already exists, using existing connection');
    return true;
  }

  try {
    socket = io(url, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 500,
      reconnectionDelayMax: 3000,
      reconnectionAttempts: Infinity,
      timeout: 10000,
      forceNew: true,
      autoConnect: true,
    });

    setupSocketListeners();
    
    setupAppStateMonitoring();
    
    return true;
    
  } catch (error) {
    console.error('Failed to start socket:', error);
    return false;
  }
};

export const stopSocket = async () => {
  try {
    if (appStateSubscription) {
      appStateSubscription.remove();
      appStateSubscription = null;
    }
    if (socket) {
      socket.removeAllListeners();
      socket.disconnect();
      socket = null;
    }
    
    console.log('Socket stopped and cleaned up');
    return true;
    
  } catch (error) {
    console.error('Failed to stop socket:', error);
    return false;
  }
};

export const getSocket = () => {
  return socket;
};

export const sendMessage = (event, data) => {
  if (socket && socket.connected) {
    socket.emit(event, data);
    console.log('Sent:', event, data);
    return true;
  }
  console.warn('Cannot send - socket not connected');
  return false;
};

export const isConnected = () => {
  return socket && socket.connected;
};
function setupSocketListeners() {
  if (!socket) return;

  // Connection successful
  socket.on('connect', () => {
    console.log('Socket connected!', socket.id);
  });

  // Disconnected
  socket.on('disconnect', (reason) => {
    console.log('Socket disconnected:', reason);
    
    // If server kicked us out, manually reconnect
    if (reason === 'io server disconnect') {
      console.log('Server disconnect - reconnecting manually...');
      socket.connect();
    }
  });

  socket.on('connect_error', (error) => {
    console.error('Connection error:', error.message);
  });

  socket.on('reconnect_attempt', (attemptNumber) => {
    console.log('Reconnection attempt #', attemptNumber);
  });

  socket.on('reconnect', (attemptNumber) => {
    console.log('Reconnected after', attemptNumber, 'attempts');
  });

  socket.on('reconnect_failed', () => {
    console.error('Reconnection failed - will keep trying...');
  });

  socket.io.on('open', () => {
    console.log('Transport opened');
  });

  socket.io.on('close', (reason) => {
    console.log('Transport closed:', reason);
  });
}

function setupAppStateMonitoring() {
  appStateSubscription = AppState.addEventListener('change', (nextAppState) => {
    console.log('App state changed to:', nextAppState);
    
    if (nextAppState === 'active') {
      // App came to foreground
      if (socket) {
        if (!socket.connected) {
          socket.connect();
        } else {
        }
      }
    } else if (nextAppState === 'background') {
      console.log('App is now in BACKGROUND');
    }
  });
}

let heartbeatInterval = null;

export const startHeartbeat = (intervalMs = 30000) => {
  if (heartbeatInterval) {
    console.log('Heartbeat already running');
    return;
  }

  console.log(`Starting heartbeat every ${intervalMs}ms`);
  
  heartbeatInterval = setInterval(() => {
    if (socket && socket.connected) {
      socket.emit('heartbeat', { 
        timestamp: Date.now(),
        status: 'alive'
      });
      console.log('Heartbeat sent');
    }
  }, intervalMs);
};

export const stopHeartbeat = () => {
  if (heartbeatInterval) {
    clearInterval(heartbeatInterval);
    heartbeatInterval = null;
    console.log('Heartbeat stopped');
  }
};
