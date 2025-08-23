# ATEM Control Web App

A professional Node.js-based web application for controlling Blackmagic ATEM video switchers with real-time operator feedback.

## 🌟 Features

- **Editor Mode**: Control up to 32 cameras with preview/live states
- **Operator Mode**: Real-time status updates for individual camera operators
- **ATEM Integration**: Direct control of Blackmagic ATEM switchers
- **Mobile Responsive**: Works on desktop, tablet, and mobile devices
- **Real-time Sync**: Instant updates across all connected devices
- **Live Timer**: Automatic timing with 5-minute warning
- **Network Accessible**: Share with operators on your local network

## 📋 Requirements

- **Node.js** (version 14 or higher)
- **Blackmagic ATEM Switcher** (connected to same network)
- **Modern web browser** (Chrome, Firefox, Safari, Edge)

## 🚀 Quick Setup Instructions

### 1. Download and Install Node.js

1. Go to [nodejs.org](https://nodejs.org/)
2. Download the **LTS version** (recommended for most users)
3. Run the installer and follow the setup wizard
4. Verify installation by opening Terminal/Command Prompt and typing:
   ```
   node --version
   npm --version
   ```

### 2. Create Your Project Folder

1. Create a new folder called `atem-control-app` on your desktop
2. Copy all the provided files into this folder with the following structure:
   ```
   atem-control-app/
   ├── package.json
   ├── server.js
   ├── README.md
   └── public/
       ├── index.html
       ├── editor.html
       ├── operator.html
       └── settings.html
   ```

### 3. Install Dependencies

1. Open Terminal (Mac) or Command Prompt (Windows)
2. Navigate to your project folder:
   ```
   cd Desktop/atem-control-app
   ```
3. Install required packages:
   ```
   npm install
   ```

### 4. Run the Application

1. In Terminal/Command Prompt, type:
   ```
   npm start
   ```
2. You should see output like:
   ```
   🎬 ATEM Control Web App is running!
   📡 Server: http://localhost:3000
   🌐 Network: http://192.168.1.100:3000
   
   📱 For operators: Share this URL: http://192.168.1.100:3000
   ```

### 5. Access the Application

1. **On the same computer**: Open browser and go to `http://localhost:3000`
2. **On other devices**: Use the network IP shown (e.g., `http://192.168.1.100:3000`)

## 🎛️ Usage Guide

### Initial Setup

1. Click **Settings** from the home page
2. Enter your **ATEM Switcher IP address**
3. Configure **number of cameras** and **active cameras**
4. Click **Save Settings**

### For Editors

1. Click **Editor** from the home page
2. Tap camera buttons to cycle through states:
   - **Gray** = Idle
   - **Green** = Preview (ready to go live)
   - **Red** = Live (on air)
3. Must preview a camera before it can go live
4. Timer appears when a camera goes live (turns red after 5 minutes)

### For Operators

1. Click **Operator** from the home page
2. Select your camera number
3. Your screen will change color based on your status:
   - **Dark** = Idle
   - **Green** = Preview (you're next!)
   - **Red** = Live (you're on air!)

## 🔧 Configuration Options

### ATEM Connection
- Enter your ATEM switcher's IP address in Settings
- The app will automatically connect and control preview/cut functions

### Camera Setup
- Set total number of cameras (1-32)
- Enable/disable specific camera numbers
- Inactive cameras are hidden from the interface

### Network Access
- The app automatically detects your local IP address
- Share the network URL with camera operators
- All devices must be on the same network

## 🌐 Network Requirements

- **Same WiFi Network**: All devices must be connected to the same network
- **Port 3000**: The app runs on port 3000 by default
- **Firewall**: Ensure your firewall allows connections on port 3000

## 📱 Device Compatibility

### Supported Browsers
- Chrome (recommended)
- Firefox
- Safari
- Microsoft Edge

### Supported Devices
- Desktop computers
- Laptops
- Tablets (iPad, Android tablets)
- Smartphones (iPhone, Android)

## 🛠️ Troubleshooting

### "Cannot connect to ATEM"
- Verify ATEM switcher IP address
- Ensure ATEM is on the same network
- Check that no other software is controlling the ATEM

### "Cannot access from other devices"
- Confirm all devices are on the same WiFi network
- Try using the IP address instead of localhost
- Check firewall settings

### "App won't start"
- Verify Node.js is installed: `node --version`
- Ensure you're in the correct folder
- Try: `npm install` then `npm start`

### "Port already in use"
- Another app is using port 3000
- Close other applications or restart your computer

## 🔒 Security Notes

- This app is designed for local network use only
- Do not expose to the internet without proper security measures
- The ATEM connection requires network access to your switcher

## 📞 Support

If you encounter issues:

1. Check that all files are in the correct locations
2. Verify Node.js installation
3. Ensure all devices are on the same network
4. Check the Terminal/Command Prompt for error messages

## 📄 File Structure Reference

```
atem-control-app/
├── package.json          # Project configuration and dependencies
├── server.js             # Main server application
├── README.md            # This instruction file
└── public/              # Web interface files
    ├── index.html       # Landing page
    ├── editor.html      # Editor control interface
    ├── operator.html    # Operator view interface
    └── settings.html    # Configuration page
```

## 🎯 Quick Start Checklist

- [ ] Node.js installed
- [ ] Files copied to project folder
- [ ] Dependencies installed (`npm install`)
- [ ] App started (`npm start`)
- [ ] ATEM IP configured in Settings
- [ ] Tested on local browser
- [ ] Network URL shared with operators
- [ ] All devices connected to same WiFi

---

**🎬 Ready to start your professional video production!**