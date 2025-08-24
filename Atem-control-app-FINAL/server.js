const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');
const { Atem } = require('atem-connection');
const qrcode = require('qrcode-terminal');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// ATEM connection
let atem = null;
let isConnected = false;

// App state
let appState = {
  cameras: {},
  preview: null,
  live: null,
  liveStartTime: null,
  numCameras: 16,
  atemIP: '',
  serverIP: '',
  activeCameras: [],
  cameraNames: {} // Add camera names storage
};

// Initialize default camera states
function initializeCameras() {
  appState.cameras = {};
  for (let i = 1; i <= appState.numCameras; i++) {
    appState.cameras[i] = 'idle'; // 'idle', 'preview', 'live'
  }
  // Set default active cameras (all cameras active by default)
  appState.activeCameras = Array.from({length: appState.numCameras}, (_, i) => i + 1);
}

initializeCameras();

// ATEM connection functions
function connectToATEM(ip) {
  if (atem) {
    atem.destroy();
  }
  
  atem = new Atem();
  
  atem.on('connected', () => {
    console.log('Connected to ATEM');
    isConnected = true;
    io.emit('atemStatus', { connected: true });
  });
  
  atem.on('disconnected', () => {
    console.log('Disconnected from ATEM');
    isConnected = false;
    io.emit('atemStatus', { connected: false });
  });
  
  atem.on('error', (error) => {
    console.error('ATEM Error:', error);
    isConnected = false;
    io.emit('atemStatus', { connected: false });
  });
  
  if (ip) {
    atem.connect(ip);
  }
}

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/editor', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'editor.html'));
});

app.get('/operator', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'operator.html'));
});

app.get('/settings', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'settings.html'));
});

// API endpoints
app.get('/api/state', (req, res) => {
  res.json({
    ...appState,
    atemConnected: isConnected
  });
});

app.post('/api/settings', (req, res) => {
  const { atemIP, serverIP, numCameras, activeCameras, cameraNames } = req.body;
  
  if (atemIP !== undefined) appState.atemIP = atemIP;
  if (serverIP !== undefined) appState.serverIP = serverIP;
  if (numCameras !== undefined) {
    appState.numCameras = parseInt(numCameras);
    initializeCameras();
  }
  if (activeCameras !== undefined) appState.activeCameras = activeCameras;
  if (cameraNames !== undefined) appState.cameraNames = cameraNames;
  
  // Reconnect to ATEM if IP changed
  if (atemIP) {
    connectToATEM(atemIP);
  }
  
  // Broadcast state update
  io.emit('stateUpdate', appState);
  
  res.json({ success: true });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  // Send current state to new client
  socket.emit('stateUpdate', appState);
  socket.emit('atemStatus', { connected: isConnected });
  
  // Handle camera state changes from editor
  socket.on('cameraAction', (data) => {
    const { camera, action } = data;
    const cameraNum = parseInt(camera);
    
    if (action === 'preview') {
      // Clear previous preview
      if (appState.preview) {
        appState.cameras[appState.preview] = 'idle';
      }
      
      // Set new preview
      appState.cameras[cameraNum] = 'preview';
      appState.preview = cameraNum;
      
      // Send preview command to ATEM
      if (atem && isConnected) {
        try {
          atem.changePreviewInput(cameraNum);
        } catch (error) {
          console.error('Error sending preview command to ATEM:', error);
        }
      }
      
    } else if (action === 'live') {
      // Can only go live if camera is currently in preview
      if (appState.cameras[cameraNum] === 'preview') {
        // Clear previous live camera
        if (appState.live) {
          appState.cameras[appState.live] = 'idle';
        }
        
        // Set new live camera
        appState.cameras[cameraNum] = 'live';
        appState.live = cameraNum;
        appState.liveStartTime = Date.now();
        appState.preview = null; // Clear preview after going live
        
        // Send cut command to ATEM
        if (atem && isConnected) {
          try {
            atem.cut();
          } catch (error) {
            console.error('Error sending cut command to ATEM:', error);
          }
        }
      }
    }
    
    // Broadcast state update to all clients
    io.emit('stateUpdate', appState);
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Get local IP address
function getLocalIP() {
  const { networkInterfaces } = require('os');
  const nets = networkInterfaces();
  
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  return 'localhost';
}

const PORT = process.env.PORT || 3000;
const localIP = getLocalIP();

server.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🎬 ATEM Control Web App is running!`);
  console.log(`📡 Server: http://localhost:${PORT}`);
  console.log(`🌐 Network: http://${localIP}:${PORT}`);
  console.log(`\n📱 For operators: Share this URL: http://${localIP}:${PORT}\n`);
  
  // Generate and display QR code for easy mobile access
  console.log('📱 QR Code for mobile access:');
  qrcode.generate(`http://${localIP}:${PORT}`, {small: true}, function (qrcode) {
    console.log(qrcode);
  });
  
  console.log(`\n💡 Scan the QR code above with your phone to connect instantly!\n`);
  
  // Set default server IP
  appState.serverIP = localIP;
});