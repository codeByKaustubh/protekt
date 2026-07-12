import React, { useState, useEffect } from 'react';
import SOSDashboard from './components/SOSDashboard';
import ContactsView from './components/ContactsView';
import MedicalIDView from './components/MedicalIDView';
import SafetyGuidesView from './components/SafetyGuidesView';

export default function App() {
  const [activeTab, setActiveTab] = useState('sos');
  const [sosTriggered, setSosTriggered] = useState(false);
  const [activeService, setActiveService] = useState(null); // specific service triggered
  const [darkMode, setDarkMode] = useState(false);

  // Geolocation state
  const [location, setLocation] = useState({
    coords: { lat: '51.5238° N', lng: '0.1585° W' },
    address: '221B Baker St, London',
    accuracy: 'Default Coordinates'
  });

  // Fetch geolocation once at startup and fetch reverse street address
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          setLocation({
            coords: {
              lat: `${latitude.toFixed(4)}° ${latitude >= 0 ? 'N' : 'S'}`,
              lng: `${longitude.toFixed(4)}° ${longitude >= 0 ? 'E' : 'W'}`
            },
            address: 'GPS Signals Active',
            accuracy: `Accurate to ${Math.round(accuracy)}m`
          });

          // OpenStreetMap Nominatim reverse geocoding
          fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
            .then(res => res.json())
            .then(data => {
              if (data && data.display_name) {
                const parts = data.display_name.split(',');
                const shortAddress = parts.slice(0, 3).join(',').trim();
                setLocation(prev => ({
                  ...prev,
                  address: shortAddress
                }));
              }
            })
            .catch(err => console.warn('Reverse geocoding failed:', err));
        },
        (error) => {
          console.warn("Geolocation access denied or unavailable: using default coordinates.");
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }
  }, []);

  // Default contacts
  const [contacts, setContacts] = useState([
    {
      id: '1',
      name: 'Sarah Jenkins',
      relationship: 'Mother',
      phone: '+91 98200 12345',
      isPrimary: true,
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBua-1Oe35cRdz-tDvGne_YdSC6BhohrEaeb6LiVA0s-Y3sgSEp8dTcWrgTdnmxJfv5EiY0PcT5uQ4ng8Hcz_i9Be5bBlmfqz4MCTOrxPiRh7cQ940NoJ1wEXAz86wNshrmgo6_W198KJ52exa93tQqxvtZ4HWoVwLVhpIcKBEXC51yPlATZ4HQevzyFbGU4Js57J8B2h2OzrJ9sgKT3-u_dT2VTkvjG0hF8cOlicHXl1HvV0GDlnhKxLOreovmcR3LwQi2UrRrNlc'
    },
    {
      id: '2',
      name: 'David Miller',
      relationship: 'Partner',
      phone: '+91 98199 87654',
      isPrimary: false,
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDazQU2sGBMCh8qVd0MgrJaZC5NQm3-EXeizrOVd1IOzQ7vnbpBGn9_kr2MZE_fr-2lFmwsptzrl0-I_JJCymfPj3zGDBpzJ0rh0BkwBKz-ON9D3GY6kD3k0SgxuLkuZHFA1WFgAeFR-jPmEZ5qzU4-Rhot8ORZnYtyyTbq4UJe8bYU2wZiTlB0_PQOQ3pLmMqp3CdiZx9sfwAZj-v1vl1HTbpVpt87Er1S04xIlCT0hEeXB_oqaaxDqTDt9fdU8OvRdyHcl3d64yQ'
    },
    {
      id: '3',
      name: 'Robert Chen',
      relationship: 'Brother',
      phone: '+91 98211 22334',
      isPrimary: false,
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBvNuGp1EoBUzOov-xKUoLhDGkHyGDvKyibITVfxPnjsbg9Nvq9LcJlB-RBQyj8Xyhv2IUjTEui5-JrhdpZiayIJEIFZCZc9NCUcMfjBAcwSXWfVqAYHmj1TvRfA5AxU6U3COoLirYLPJzbLNzwOSfesOW9-yKux4IWFYsuqiBT1nySGFBm95fnD3DrUDpegy3jLDQMj5qDxy37VqYAFotaYF_ov36kosNNak15tN3Byx7qHkIzTDz0K4U4kRXtn777rKUiZmPWOkY'
    }
  ]);

  // Default Medical ID profile
  const [profile, setProfile] = useState({
    name: 'Marcus Thorne',
    dob: '12/05/1982',
    age: 41,
    bloodType: 'O+',
    height: '182cm',
    weight: '84kg',
    showOnLockScreen: true,
    donor: true,
    spouseCall: '+91 98199 87654',
    doctorCall: '+91 98199 54321',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAMv2hgwgUkHK_e7mVwtfeoxbtGYIgwDBA45laYpkQkjW-PkLlkobQzbYnpjTBe9ode1jiQ2LSjLYC9g2UznIcoWTMZ3qAfjSXuGaCk8D4qgyX0NcjN7kVWRaiOW-DM6FWASQiozTf26cPsWQ98C8ct060qJMRKa0tr3716BqmLJYR-BakydM4H8mockIJgDJ5P532fqCak8ytPz9WTb2W2-d-ZTuwrPFZElqS15lQ3tuukxpTYSn8-QwW15WYcXyQ1kz2kNL6iFH8',
    allergies: [
      { name: 'Penicillin', severity: 'Severe' },
      { name: 'Latex', severity: 'Moderate' }
    ],
    medications: [
      { name: 'Lisinopril', info: '10mg Oral Tablet • Once Daily' },
      { name: 'Ventolin HFA', info: '90mcg Inhaler • As needed for SOB' }
    ],
    conditions: [
      'Hypertension (diagnosed 2019)',
      'Exercise-induced asthma',
      'Type 2 Diabetes (controlled)'
    ]
  });

  // Sync dark mode class on html tag
  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [darkMode]);

  // Header background states
  const headerBgClass = sosTriggered 
    ? 'bg-error dark:bg-error text-white' 
    : 'bg-surface dark:bg-on-surface text-on-surface dark:text-surface';
  
  const headerTextClass = sosTriggered
    ? 'text-white'
    : 'text-primary dark:text-primary-fixed';

  return (
    <div className={`min-h-screen pb-32 transition-colors duration-300 ${
      sosTriggered ? 'bg-error/5 dark:bg-error/10' : 'bg-background'
    }`}>
      {/* TopAppBar */}
      <header className={`fixed top-0 w-full z-50 border-b transition-colors duration-300 flex items-center justify-between px-safe-margin h-touch-target shadow-sm ${headerBgClass} ${
        sosTriggered ? 'border-error' : 'border-outline-variant dark:border-outline'
      }`}>
        <div className="flex items-center gap-sm">
          <span className={`material-symbols-outlined ${sosTriggered ? 'text-white' : 'text-primary dark:text-primary-fixed'}`} style={{ fontVariationSettings: "'FILL' 1" }}>
            security
          </span>
          <h1 className={`font-display-sos text-headline-md tracking-tighter ${headerTextClass}`}>
            PROTEKT
          </h1>
        </div>
        <div className="flex items-center gap-sm">
          {/* Dark Mode toggle */}
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/10 active:scale-95 transition-transform"
            aria-label="Toggle Theme"
          >
            <span className="material-symbols-outlined">
              {darkMode ? 'light_mode' : 'dark_mode'}
            </span>
          </button>
          {/* Quick SOS status toggle */}
          <button 
            onClick={() => setSosTriggered(!sosTriggered)}
            className={`w-10 h-10 rounded-full flex items-center justify-center active:scale-95 transition-all duration-300 ${
              sosTriggered 
                ? 'bg-white text-error border-2 border-error font-bold' 
                : 'hover:bg-surface-container dark:hover:bg-inverse-surface text-primary dark:text-primary-fixed'
            }`}
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>sos</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="pt-20 px-safe-margin max-w-xl mx-auto w-full">
        {activeTab === 'sos' && (
          <SOSDashboard 
            sosTriggered={sosTriggered} 
            setSosTriggered={setSosTriggered}
            activeService={activeService}
            setActiveService={setActiveService}
            location={location}
          />
        )}
        {activeTab === 'contacts' && (
          <ContactsView 
            contacts={contacts} 
            setContacts={setContacts} 
            location={location}
          />
        )}
        {activeTab === 'medical' && (
          <MedicalIDView 
            profile={profile} 
            setProfile={setProfile} 
          />
        )}
        {activeTab === 'guides' && (
          <SafetyGuidesView />
        )}
      </main>

      {/* BottomNavBar */}
      <nav className="fixed bottom-0 left-0 w-full z-50 rounded-t-xl bg-surface dark:bg-on-surface shadow-[0_-2px_10px_rgba(0,0,0,0.05)] border-t border-outline-variant/30 dark:border-outline/30 flex justify-around items-center h-20 pb-safe px-sm">
        <button 
          onClick={() => setActiveTab('sos')}
          className={`flex flex-col items-center justify-center px-md py-xs rounded-full active:scale-90 transition-transform duration-200 ${
            activeTab === 'sos' 
              ? 'bg-primary-container dark:bg-primary text-on-primary-container dark:text-on-primary font-bold' 
              : 'text-secondary dark:text-secondary-fixed-dim hover:opacity-85'
          }`}
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: activeTab === 'sos' ? "'FILL' 1" : "'FILL' 0" }}>
            emergency
          </span>
          <span className="font-label-bold text-label-md">SOS</span>
        </button>
        
        <button 
          onClick={() => setActiveTab('contacts')}
          className={`flex flex-col items-center justify-center px-md py-xs rounded-full active:scale-90 transition-transform duration-200 ${
            activeTab === 'contacts' 
              ? 'bg-primary-container dark:bg-primary text-on-primary-container dark:text-on-primary font-bold' 
              : 'text-secondary dark:text-secondary-fixed-dim hover:opacity-85'
          }`}
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: activeTab === 'contacts' ? "'FILL' 1" : "'FILL' 0" }}>
            group
          </span>
          <span className="font-label-bold text-label-md">Contacts</span>
        </button>

        <button 
          onClick={() => setActiveTab('medical')}
          className={`flex flex-col items-center justify-center px-md py-xs rounded-full active:scale-90 transition-transform duration-200 ${
            activeTab === 'medical' 
              ? 'bg-primary-container dark:bg-primary text-on-primary-container dark:text-on-primary font-bold' 
              : 'text-secondary dark:text-secondary-fixed-dim hover:opacity-85'
          }`}
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: activeTab === 'medical' ? "'FILL' 1" : "'FILL' 0" }}>
            medical_information
          </span>
          <span className="font-label-bold text-label-md">Medical ID</span>
        </button>

        <button 
          onClick={() => setActiveTab('guides')}
          className={`flex flex-col items-center justify-center px-md py-xs rounded-full active:scale-90 transition-transform duration-200 ${
            activeTab === 'guides' 
              ? 'bg-primary-container dark:bg-primary text-on-primary-container dark:text-on-primary font-bold' 
              : 'text-secondary dark:text-secondary-fixed-dim hover:opacity-85'
          }`}
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: activeTab === 'guides' ? "'FILL' 1" : "'FILL' 0" }}>
            menu_book
          </span>
          <span className="font-label-bold text-label-md">Guides</span>
        </button>
      </nav>
    </div>
  );
}
