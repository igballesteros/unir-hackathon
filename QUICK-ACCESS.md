# 🚀 Quick Access Guide - 10 Minutes

## Option 1: Enable Public Access with ngrok (RECOMMENDED - 3 steps)

### Step 1: Make sure ngrok is installed
```bash
which ngrok || echo "Install with: brew install ngrok"
```

### Step 2: Start everything with one command
```bash
chmod +x start-ngrok.sh
./start-ngrok.sh
```

### Step 3: Get your public URLs
- Open http://localhost:4040 in browser → Copy Backend URL
- Open http://localhost:4041 in browser → Copy Frontend URL

**Done! Share these URLs.**

---

## Option 2: Local Network Access (For same WiFi - 2 steps)

### Step 1: Start backend
```bash
cd backend
npm run dev
```

### Step 2: Start frontend (in new terminal)
```bash
cd frontend
npm run dev
```

**Vite will show:** `Local: http://localhost:5173` and `Network: http://YOUR-IP:5173`
**Share the Network URL with people on your WiFi.**

---

## Option 3: Manual ngrok (if script doesn't work - 4 steps)

### Step 1: Start backend
```bash
cd backend
npm run dev
```

### Step 2: Start frontend (in new terminal)
```bash
cd frontend
npm run dev
```

### Step 3: Start ngrok for frontend (in new terminal)
```bash
ngrok http 5173
```

### Step 4: Copy the ngrok URL
Look for: `Forwarding https://xxxx-xx-xx-xx-xx.ngrok-free.app -> http://localhost:5173`

**Done! Share that ngrok URL.**

---

## ⚡ FASTEST: Use the script
```bash
./start-ngrok.sh
```
Then check http://localhost:4040 and http://localhost:4041 for URLs!

