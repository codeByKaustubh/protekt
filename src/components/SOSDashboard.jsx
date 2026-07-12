import React, { useState, useEffect, useRef } from 'react';

export default function SOSDashboard({ sosTriggered, setSosTriggered, activeService, setActiveService, location }) {
  const { coords, address, accuracy } = location;
  const [holdProgress, setHoldProgress] = useState(289); // SVG strokeDashoffset: starts at 289 (empty) -> 0 (full)
  const [isHolding, setIsHolding] = useState(false);
  const holdStartRef = useRef(null);

  // Dynamic quick dials state
  const [quickDials, setQuickDials] = useState(() => {
    const saved = localStorage.getItem('protekt_quick_dials');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.warn("Failed to parse quick dials:", e);
      }
    }
    return [
      { id: '1', name: 'Police', phone: '100', icon: 'local_police' },
      { id: '2', name: 'Ambulance', phone: '108', icon: 'medical_services' },
      { id: '3', name: 'Fire', phone: '101', icon: 'fire_truck' }
    ];
  });

  // Modal configuration states
  const [isEditingDials, setIsEditingDials] = useState(false);
  const [showDialModal, setShowDialModal] = useState(false);
  const [editingDial, setEditingDial] = useState(null); // dial being edited, or null for new
  const [dialForm, setDialForm] = useState({ name: '', phone: '', icon: 'shield' });

  const AVAILABLE_ICONS = [
    { name: 'Police / Security', value: 'local_police' },
    { name: 'Medical / Health', value: 'medical_services' },
    { name: 'Fire Services', value: 'fire_truck' },
    { name: 'General Safety', value: 'shield' },
    { name: 'Home / Family', value: 'home' },
    { name: 'Work / Office', value: 'work' },
    { name: 'Contact Group', value: 'group' }
  ];

  // Sync quick dials to localStorage
  useEffect(() => {
    localStorage.setItem('protekt_quick_dials', JSON.stringify(quickDials));
  }, [quickDials]);

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

  const triggerServiceSOS = (serviceName, phoneNumber) => {
    setActiveService(serviceName);
    setSosTriggered(true);
    if (navigator.vibrate) {
      navigator.vibrate(200);
    }
    setTimeout(() => {
      window.location.href = `tel:${phoneNumber.replace(/[^\d+]/g, '')}`;
    }, 500);
  };

  const handleResetSOS = () => {
    setSosTriggered(false);
    setActiveService(null);
    setHoldProgress(289);
  };

  const handleOpenAddDial = () => {
    setEditingDial(null);
    setDialForm({ name: '', phone: '', icon: 'shield' });
    setShowDialModal(true);
  };

  const handleOpenEditDial = (dial) => {
    setEditingDial(dial);
    setDialForm({
      name: dial.name,
      phone: dial.phone,
      icon: dial.icon
    });
    setShowDialModal(true);
  };

  const handleCloseDialModal = () => {
    setShowDialModal(false);
    setEditingDial(null);
    setDialForm({ name: '', phone: '', icon: 'shield' });
  };

  const handleSaveDial = (e) => {
    e.preventDefault();
    if (!dialForm.name || !dialForm.phone) return;

    if (editingDial) {
      // Update existing dial
      setQuickDials(quickDials.map(d => 
        d.id === editingDial.id 
          ? { ...d, name: dialForm.name, phone: dialForm.phone, icon: dialForm.icon }
          : d
      ));
    } else {
      // Create new dial
      const newDial = {
        id: Date.now().toString(),
        name: dialForm.name,
        phone: dialForm.phone,
        icon: dialForm.icon
      };
      setQuickDials([...quickDials, newDial]);
    }

    handleCloseDialModal();
  };

  const handleDeleteDial = (id) => {
    setQuickDials(quickDials.filter(d => d.id !== id));
  };

  // Map calculations
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
          <div className={`absolute inset-0 rounded-full bg-primary/10 ${isHolding || sosTriggered ? 'sos-pulse' : ''}`}></div>
          
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

      {/* Quick Links Section Header */}
      <section className="flex items-center justify-between mt-sm border-t border-outline-variant/30 pt-md">
        <div className="font-label-bold text-label-md text-on-surface-variant flex items-center gap-xs">
          <span className="material-symbols-outlined text-primary">contact_phone</span>
          EMERGENCY QUICK DIAL
        </div>
        <button 
          onClick={() => setIsEditingDials(!isEditingDials)}
          className={`text-sm font-label-bold flex items-center gap-xs px-sm py-1 rounded-lg active:scale-95 transition-all ${
            isEditingDials 
              ? 'bg-primary text-on-primary shadow-sm' 
              : 'text-primary hover:bg-black/5 dark:hover:bg-white/5'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">settings</span>
          <span>{isEditingDials ? 'Done' : 'Configure'}</span>
        </button>
      </section>

      {/* Quick Links Grid */}
      <section className="grid grid-cols-3 gap-md">
        {quickDials.map((dial) => (
          <div key={dial.id} className="relative">
            <button 
              onClick={() => {
                if (isEditingDials) {
                  handleOpenEditDial(dial);
                } else {
                  triggerServiceSOS(dial.name, dial.phone);
                }
              }}
              className={`w-full bg-surface-container-lowest border border-outline-variant p-md rounded-xl flex flex-col items-center gap-sm active:scale-95 transition-all duration-200 hover:bg-surface-container hover:shadow-sm h-28 justify-center ${
                sosTriggered && activeService === dial.name ? 'ring-2 ring-primary border-transparent' : ''
              } ${isEditingDials ? 'border-dashed border-primary/50' : ''}`}
            >
              <div className="w-11 h-11 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>{dial.icon}</span>
              </div>
              <span className="font-label-bold text-label-md text-on-surface truncate w-full text-center">{dial.name}</span>
            </button>
            
            {/* Delete button (Edit mode only) */}
            {isEditingDials && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteDial(dial.id);
                }}
                className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-error text-white flex items-center justify-center shadow-md active:scale-90 transition-transform z-10 hover:bg-error/90"
              >
                <span className="material-symbols-outlined text-[14px] font-bold">close</span>
              </button>
            )}
          </div>
        ))}
        
        {/* Add Dial Card (Edit mode only) */}
        {isEditingDials && (
          <button 
            onClick={handleOpenAddDial}
            className="bg-surface-container/30 border-2 border-dashed border-outline-variant rounded-xl p-md flex flex-col items-center justify-center gap-xs active:scale-95 transition-all hover:bg-surface-container h-28"
          >
            <div className="w-10 h-10 rounded-full border border-dashed border-outline flex items-center justify-center text-on-surface-variant">
              <span className="material-symbols-outlined">add</span>
            </div>
            <span className="font-label-bold text-xs text-on-surface-variant">Add Dial</span>
          </button>
        )}
      </section>

      {/* Safety Checklist / Tips */}
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

      {/* QUICK DIAL CONFIG MODAL */}
      {showDialModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-surface border border-outline-variant rounded-2xl w-full max-w-md p-lg shadow-xl animate-in fade-in zoom-in-95 duration-200 text-on-surface">
            <div className="flex justify-between items-center mb-md border-b border-outline-variant pb-sm">
              <h2 className="font-headline-md text-headline-md">
                {editingDial ? 'Edit Quick Dial' : 'Add Quick Dial'}
              </h2>
              <button onClick={handleCloseDialModal} className="text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleSaveDial} className="space-y-md">
              <div>
                <label className="block text-sm font-label-bold mb-1">Service Label / Name</label>
                <input 
                  type="text" 
                  value={dialForm.name}
                  onChange={(e) => setDialForm({...dialForm, name: e.target.value})}
                  className="w-full h-11 px-md border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white text-on-surface"
                  placeholder="e.g. Security, Hospital, Police"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-label-bold mb-1">Phone Number</label>
                <input 
                  type="tel" 
                  value={dialForm.phone}
                  onChange={(e) => setDialForm({...dialForm, phone: e.target.value})}
                  className="w-full h-11 px-md border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white text-on-surface"
                  placeholder="e.g. 100, 108, 98200XXXXX"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-label-bold mb-2">Select Icon</label>
                <div className="grid grid-cols-4 gap-sm">
                  {AVAILABLE_ICONS.map((iconOption) => (
                    <button
                      key={iconOption.value}
                      type="button"
                      onClick={() => setDialForm({...dialForm, icon: iconOption.value})}
                      className={`p-sm border rounded-xl flex flex-col items-center gap-xs transition-all active:scale-95 ${
                        dialForm.icon === iconOption.value
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-outline-variant hover:bg-surface-container'
                      }`}
                      title={iconOption.name}
                    >
                      <span className="material-symbols-outlined text-2xl">{iconOption.value}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-sm justify-end pt-sm border-t border-outline-variant">
                <button 
                  type="button" 
                  onClick={handleCloseDialModal}
                  className="px-md py-sm bg-surface-container-high text-on-surface rounded-lg hover:bg-surface-variant"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-md py-sm bg-primary text-on-primary rounded-lg hover:bg-primary-container font-label-bold"
                >
                  Save Dial
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
