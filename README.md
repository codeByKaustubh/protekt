# PROTEKT - Emergency SOS Hub (React PWA)

**PROTEKT** is a Progressive Web App (PWA) designed for emergency response, contacts management, and critical medical profile documentation. It runs directly in the browser, is fully installable on mobile devices (iOS & Android) and computers, and is optimized to function offline.

---

## 🌟 Key Features

1. **Panic SOS Trigger**: Smooth, hold-to-trigger 3-second SOS ring that prevents accidental activations and triggers regional emergency support.
2. **India Regional Emergency Services**: Custom-mapped quick dial links matching standard emergency services in India (Maharashtra/Mumbai/Palghar region):
   * **SOS Single emergency response**: Dial **`112`**
   * **Police Control**: Dial **`100`**
   * **State Medical Ambulance Service**: Dial **`108`**
   * **Fire Brigade**: Dial **`101`**
3. **PWA Standalone Execution**: Full Service Worker offline caching (`sw.js`) and web app manifest (`manifest.json`) configuration to allow launcher installation, custom splash colors, and browserless fullscreen execution.
4. **Live GPS Tracking & Interactive Map**: Automatically requests device location, translates coordinates into street addresses using Nominatim geocoding, and embeds a dynamic, borderless OpenStreetMap map.
5. **Emergency Contacts Management**: Supports adding, deleting, and editing emergency contacts. Allows designated **Primary** targets.
6. **Native Device Dialing & Messaging**:
   * Calling icon triggers the device's native calling app (`tel:`).
   * Texting icon triggers the device's built-in messages app (`sms:`) pre-drafted with a coordinates-aware SOS alert.
7. **Medical ID Profile**: Complete, editable card for blood type, metrics, medications, allergies, and conditions.
8. **Persistent Browser Cache**: All edits to contacts and medical profiles are instantly synchronized with `localStorage`, remaining intact after reloads or offline launches.

---

## 🚀 How to Run the Project

Follow these steps to launch the application on your computer:

### 1. Install Dependencies
Open your terminal (PowerShell or Command Prompt) in the project directory and run:
```bash
npm install
```
*(On Windows PowerShell, if blocked by execution policies, run `npm.cmd install` instead).*

### 2. Run the Development Server
To start the local Vite development server:
```bash
npm run dev
```
*(On Windows PowerShell, run `npm.cmd run dev`)*.

Once started, open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📱 How to Access the App on Your Phone

To test the application on your mobile device (and test native calling/texting triggers):

1. Ensure your **computer** and **phone** are connected to the **same Wi-Fi network**.
2. Run the Vite server with the `--host` flag:
   ```bash
   npm run dev -- --host
   ```
   *(On Windows PowerShell, run `npm.cmd run dev -- --host`)*.
3. Check the terminal output for the **Network** URL, for example:
   ```bash
   ➜  Local:   http://localhost:5173/
   ➜  Network:  http://192.168.1.15:5173/   <--- Open this URL on your phone
   ```
4. Enter that **Network** URL into your phone's browser (Safari for iOS, Chrome for Android).

### 📥 Installing as an App:
* **iOS (Safari)**: Tap the **Share** button, scroll down, and select **"Add to Home Screen"**.
* **Android (Chrome)**: Tap the **three-dots menu** and select **"Install App"** or **"Add to Home screen"**.

---

## 📦 Building for Production

To compile and bundle the static production-ready PWA assets (which can be deployed to platforms like Netlify, Vercel, or GitHub Pages):

1. Build the project:
   ```bash
   npm run build
   ```
2. This creates a **`dist/`** folder containing all HTML, CSS, JavaScript, and asset files.
3. You can test the production build locally before hosting it by running:
   ```bash
   npm run preview
   ```
