import React, { useState, useEffect, useRef } from 'react';

export default function SOSDashboard({ sosTriggered, setSosTriggered, activeService, setActiveService, location }) {
  const { coords, address, accuracy } = location;
  const [holdProgress, setHoldProgress] = useState(289); // SVG strokeDashoffset: starts at 289 (empty) -> 0 (full)
  const [isHolding, setIsHolding] = useState(false);
  const holdTimerRef = useRef(null);
  const holdStartRef = useRef(null);

  // Hold-to-trigger logic using requestAnimationFrame for smooth animation
  useEffect(() => {
    let animFrame;
    if (isHolding && !sosTriggered) {
      const holdDuration = 3000; // 3 seconds
      const startTime = performance.now();
      holdStartRef.current = startTime;

      const tick = () => {
        const elapsed = performance.now() - holdStartRef.current;
        const progressPercent = Math.min(elapsed / holdDuration, 1);
        // Map 0-1 to 289-0 offset
        const newOffset = 289 - progressPercent * 289;
        setHoldProgress(newOffset);

        if (progressPercent < 1) {
          animFrame = requestAnimationFrame(tick);
        } else {
          // Trigger SOS!
          setSosTriggered(true);
          setIsHolding(false);
          setHoldProgress(0);
          if (navigator.vibrate) {
            navigator.vibrate([200, 100, 200, 100, 500]); // Emergency vibration pattern
          }
          setTimeout(() => {
            window.location.href = 'tel:112'; // India's Single Emergency Response number
          }, 500);
        }
      };
      animFrame = requestAnimationFrame(tick);
    } else {
      // Reset progress when not holding (unless SOS is already triggered)
      if (!sosTriggered) {
        setHoldProgress(289);
      }
    }

    return () => {
      if (animFrame) cancelAnimationFrame(animFrame);
    };
  }, [isHolding, sosTriggered, setSosTriggered]);

  const handleStartHold = (e) => {
    e.preventDefault();
    if (sosTriggered) return;
    setIsHolding(true);
  };

  const handleCancelHold = () => {
    setIsHolding(false);
  };

  const triggerServiceSOS = (serviceName) => {
    setActiveService(serviceName);
    setSosTriggered(true);
    if (navigator.vibrate) {
      navigator.vibrate(200);
    }
    
    // Emergency numbers for India (Mumbai/Palghar/Maharashtra region)
    let phoneNumber = '112'; 
    if (serviceName === 'Police') {
      phoneNumber = '100';
    } else if (serviceName === 'Ambulance') {
      phoneNumber = '108'; // Maharashtra State Free Ambulance Service
    } else if (serviceName === 'Fire') {
      phoneNumber = '101';
    }

    setTimeout(() => {
      window.location.href = `tel:${phoneNumber}`;
    }, 500);
  };

  const handleResetSOS = () => {
    setSosTriggered(false);
    setActiveService(null);
    setHoldProgress(289);
  };

  const lat = location.rawCoords?.latitude || 51.5238;
  const lon = location.rawCoords?.longitude || -0.1585;
  const delta = 0.003;
  const bbox = `${lon - delta}%2C${lat - delta}%2C${lon + delta}%2C${lat + delta}`;
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lon}`;

  return (
    <div className="flex flex-col gap-xl max-w-lg mx-auto w-full fade-in">
      {/* Location Card */}
      <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg flex flex-col gap-sm shadow-sm transition-all duration-300 hover:shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-xs text-primary dark:text-primary-fixed font-label-bold text-label-md">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
            CURRENT LOCATION
          </div>
          <span className="bg-primary/10 text-primary dark:text-primary-fixed-dim px-sm py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            {accuracy}
          </span>
        </div>
        <div>
          <p className="font-headline-md text-headline-md leading-tight text-on-surface">{address}</p>
          <p className="text-on-surface-variant font-body-md opacity-70 mt-1">{coords.lat}, {coords.lng}</p>
        </div>
        {/* Live Interactive Map with bottom attribution cropped for clean app UI */}
        <div className="mt-md h-40 rounded-lg overflow-hidden relative border border-outline-variant bg-surface-container">
          <iframe 
            title="Live GPS Location Map"
            src={mapUrl}
            className="absolute top-0 left-0 w-full border-none"
            style={{ 
              filter: 'grayscale(0.1)',
              height: 'calc(100% + 32px)' // Push bottom attribution down out of bounds
            }}
          ></iframe>
        </div>
      </section>

      {/* SOS Trigger Center */}
      <section className="flex flex-col items-center justify-center py-xl relative">
        <div className="relative flex items-center justify-center w-64 h-64">
          {/* Ring Animation (Pulsing when SOS is triggered or holding) */}
          <div className={`absolute inset-0 rounded-full bg-primary/10 ${isHolding || sosTriggered ? 'sos-pulse' : ''}`}></div>
          
          {/* Progress Circle SVG */}
          <svg className="absolute inset-0 transform -rotate-90 w-full h-full" viewBox="0 0 100 100">
            <circle className="text-outline-variant" cx="50" cy="50" fill="transparent" r="46" stroke="currentColor" strokeWidth="4"></circle>
            <circle 
              className="text-primary hold-progress" 
              cx="50" 
              cy="50" 
              fill="transparent" 
              r="46" 
              stroke="currentColor" 
              strokeDasharray="289" 
              strokeDashoffset={holdProgress} 
              strokeWidth="4"
              strokeLinecap="round"
            ></circle>
          </svg>

          {/* SOS Button */}
          {!sosTriggered ? (
            <button 
              className={`relative z-10 w-52 h-52 bg-primary hover:bg-primary-container active:scale-95 transition-all duration-300 rounded-full flex flex-col items-center justify-center text-white select-none ${
                isHolding ? 'scale-90 shadow-[0_4px_8px_rgba(183,0,17,0.5)]' : 'shadow-[0_12px_24px_rgba(183,0,17,0.3)]'
              }`}
              onMouseDown={handleStartHold}
              onTouchStart={handleStartHold}
              onMouseUp={handleCancelHold}
              onMouseLeave={handleCancelHold}
              onTouchEnd={handleCancelHold}
              onContextMenu={(e) => e.preventDefault()}
            >
              <span className="font-display-sos text-[56px] leading-none mb-1">SOS</span>
              <span className="font-label-bold text-label-md uppercase tracking-widest opacity-80">
                {isHolding ? 'RELEASE TO CANCEL' : 'HOLD 3S'}
              </span>
            </button>
          ) : (
            <button 
              className="relative z-10 w-52 h-52 bg-white text-error border-4 border-error hover:bg-surface-container-low active:scale-95 transition-all duration-300 rounded-full flex flex-col items-center justify-center shadow-lg select-none pulse-red"
              onClick={handleResetSOS}
            >
              <span className="material-symbols-outlined text-[64px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              <span className="font-label-bold text-label-md uppercase mt-1">ALERT ACTIVE</span>
              <span className="text-[10px] uppercase font-bold tracking-wider opacity-60 mt-1">Tap to Cancel</span>
            </button>
          )}
        </div>
        
        {sosTriggered ? (
          <div className="mt-xl text-center px-lg bg-error-container/20 border border-error-container/40 p-md rounded-xl max-w-sm">
            <h4 className="text-error font-label-bold text-label-bold uppercase mb-1">
              {activeService ? `${activeService} Dispatch Active` : 'Emergency SOS Sent'}
            </h4>
            <p className="text-on-surface-variant text-sm font-body-md">
              Responders have been notified of your location. GPS tracking is live. Keep this page open.
            </p>
          </div>
        ) : (
          <p className="mt-xl text-on-surface-variant text-center font-body-md px-lg">
            Holding the button for 3 seconds will instantly notify emergency services and your designated contacts.
          </p>
        )}
      </section>

      {/* Quick Links Grid */}
      <section className="grid grid-cols-3 gap-md">
        <button 
          onClick={() => triggerServiceSOS('Police')}
          className={`bg-surface-container-lowest border border-outline-variant p-md rounded-xl flex flex-col items-center gap-sm active:scale-95 transition-all duration-200 hover:bg-surface-container hover:shadow-sm ${
            sosTriggered && activeService === 'Police' ? 'ring-2 ring-primary border-transparent' : ''
          }`}
        >
          <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>local_police</span>
          </div>
          <span className="font-label-bold text-label-md text-on-surface">Police</span>
        </button>
        <button 
          onClick={() => triggerServiceSOS('Ambulance')}
          className={`bg-surface-container-lowest border border-outline-variant p-md rounded-xl flex flex-col items-center gap-sm active:scale-95 transition-all duration-200 hover:bg-surface-container hover:shadow-sm ${
            sosTriggered && activeService === 'Ambulance' ? 'ring-2 ring-primary border-transparent' : ''
          }`}
        >
          <div className="w-12 h-12 rounded-full bg-error-container flex items-center justify-center text-on-error-container">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>medical_services</span>
          </div>
          <span className="font-label-bold text-label-md text-on-surface">Ambulance</span>
        </button>
        <button 
          onClick={() => triggerServiceSOS('Fire')}
          className={`bg-surface-container-lowest border border-outline-variant p-md rounded-xl flex flex-col items-center gap-sm active:scale-95 transition-all duration-200 hover:bg-surface-container hover:shadow-sm ${
            sosTriggered && activeService === 'Fire' ? 'ring-2 ring-primary border-transparent' : ''
          }`}
        >
          <div className="w-12 h-12 rounded-full bg-tertiary-container/20 flex items-center justify-center text-tertiary">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>fire_truck</span>
          </div>
          <span className="font-label-bold text-label-md text-on-surface">Fire</span>
        </button>
      </section>

      {/* Safety Checklist / Tips (Asymmetric/Modern Layout) */}
      <section className="bg-inverse-surface text-inverse-on-surface p-lg rounded-xl flex items-center gap-lg shadow-sm hover:shadow-md transition-shadow">
        <div className="flex-1">
          <h3 className="font-headline-md text-headline-md mb-xs text-white">Stay Calm</h3>
          <p className="opacity-80 text-body-md leading-tight text-neutral-200">
            Find a secure location, seek cover if necessary, and prepare to answer questions from the emergency dispatcher.
          </p>
        </div>
        <div className="w-16 h-16 bg-surface/10 rounded-lg flex items-center justify-center backdrop-blur-sm flex-shrink-0">
          <span className="material-symbols-outlined text-4xl text-white">info</span>
        </div>
      </section>
    </div>
  );
}
