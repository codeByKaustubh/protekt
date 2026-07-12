import React, { useState } from 'react';

export default function ContactsView({ contacts, setContacts, location }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', relationship: '', phone: '', isPrimary: false });
  const [activeCall, setActiveCall] = useState(null); // Contact currently calling
  const [activeChat, setActiveChat] = useState(null); // Contact currently chatting
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState({
    'Sarah Jenkins': [
      { sender: 'them', text: 'Hey Marcus, are you okay?' },
      { sender: 'me', text: 'Yes, just testing this safety app!' }
    ]
  });

  const initiateDeviceCall = (phone) => {
    const cleanPhone = phone.replace(/[^\d+]/g, '');
    window.location.href = `tel:${cleanPhone}`;
  };

  const sendDeviceSMS = (contact, messageText) => {
    const cleanPhone = contact.phone.replace(/[^\d+]/g, '');
    const defaultText = messageText || `[EMERGENCY WARNING] Marcus Thorne has triggered an SOS alert! Location: ${location.address} (${location.coords.lat}, ${location.coords.lng})`;
    window.open(`sms:${cleanPhone}?body=${encodeURIComponent(defaultText)}`);
  };

  const handleAddContact = (e) => {
    e.preventDefault();
    if (!newContact.name || !newContact.relationship) return;

    let updatedContacts = [...contacts];
    if (newContact.isPrimary) {
      // Demote existing primary contact if new contact is primary
      updatedContacts = updatedContacts.map(c => ({ ...c, isPrimary: false }));
    }

    const newEntry = {
      id: Date.now().toString(),
      name: newContact.name,
      relationship: newContact.relationship,
      phone: newContact.phone || '(555) 000-0000',
      isPrimary: newContact.isPrimary,
      // Default fallback avatar placeholder
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150'
    };

    setContacts([newEntry, ...updatedContacts]);
    setNewContact({ name: '', relationship: '', phone: '', isPrimary: false });
    setShowAddModal(false);
  };

  const handleDeleteContact = (id) => {
    setContacts(contacts.filter(c => c.id !== id));
  };

  const handleSendChatMessage = (e) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const contactName = activeChat.name;
    const currentMessages = chatHistory[contactName] || [];
    const updatedMessages = [
      ...currentMessages,
      { sender: 'me', text: chatMessage }
    ];

    setChatHistory({
      ...chatHistory,
      [contactName]: updatedMessages
    });
    setChatMessage('');

    // Simulate reply after 1.5s
    setTimeout(() => {
      setChatHistory(prev => {
        const prevMsg = prev[contactName] || [];
        return {
          ...prev,
          [contactName]: [
            ...prevMsg,
            { sender: 'them', text: `Understood, Marcus. I'm monitoring your status.` }
          ]
        };
      });
    }, 1500);
  };

  const sendSOSPreset = () => {
    const contactName = activeChat.name;
    const currentMessages = chatHistory[contactName] || [];
    const textMsg = `[EMERGENCY WARNING] Marcus Thorne has triggered an SOS alert! Location: ${location.address} (${location.coords.lat}, ${location.coords.lng})`;
    const updatedMessages = [
      ...currentMessages,
      { sender: 'me', text: textMsg }
    ];

    setChatHistory({
      ...chatHistory,
      [contactName]: updatedMessages
    });
  };

  return (
    <div className="max-w-2xl mx-auto w-full fade-in pb-12">
      <div className="flex items-center justify-between mb-lg">
        <div>
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">Emergency Contacts</h1>
          <p className="font-body-md text-on-surface-variant text-sm">Manage people to alert in case of SOS.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-primary text-on-primary hover:bg-primary-container h-touch-target px-md rounded-xl flex items-center gap-xs font-label-bold text-label-md shadow-sm active:scale-95 transition-transform"
        >
          <span className="material-symbols-outlined">person_add</span>
          <span>Add New</span>
        </button>
      </div>

      {/* Contacts List */}
      <div className="space-y-md">
        {contacts.map((contact) => (
          <div key={contact.id} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md flex items-center gap-md hover:shadow-sm transition-shadow">
            <div className="relative">
              <img 
                className={`w-16 h-16 rounded-full object-cover border-2 ${contact.isPrimary ? 'border-primary' : 'border-outline-variant'}`} 
                src={contact.avatar} 
                alt={contact.name}
              />
              {contact.isPrimary && (
                <span className="absolute -bottom-1 -right-1 bg-primary text-on-primary text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-tighter shadow-sm">
                  Primary
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-headline-md text-headline-md text-on-surface truncate">{contact.name}</h3>
              <p className="font-body-md text-on-surface-variant text-sm">{contact.relationship} • {contact.phone}</p>
            </div>
            <div className="flex items-center gap-xs sm:gap-sm">
              <button 
                onClick={() => setActiveChat(contact)}
                className="w-touch-target h-touch-target rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center hover:opacity-90 active:scale-90 transition-all shadow-sm"
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>chat</span>
              </button>
              <button 
                onClick={() => setActiveCall(contact)}
                className="w-touch-target h-touch-target rounded-full bg-tertiary-container text-on-tertiary-container flex items-center justify-center hover:opacity-90 active:scale-90 transition-all shadow-sm"
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>call</span>
              </button>
              {contacts.length > 1 && (
                <button 
                  onClick={() => handleDeleteContact(contact.id)}
                  className="w-8 h-8 rounded-full text-on-surface-variant hover:text-error flex items-center justify-center active:scale-95 transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">delete</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Privacy Notice Card */}
      <div className="mt-xl p-lg bg-surface-container-low rounded-xl border border-outline-variant flex items-start gap-md">
        <span className="material-symbols-outlined text-tertiary mt-1" style={{ fontVariationSettings: "'FILL' 1" }}>info</span>
        <div className="space-y-xs">
          <p className="font-label-bold text-label-md text-on-surface">Privacy First</p>
          <p className="font-body-md text-on-surface-variant text-sm">
            Emergency contacts will only be notified when you trigger a manual SOS or if our automated sensors detect a critical incident. All network traffic is encrypted.
          </p>
        </div>
      </div>

      {/* 1. ADD CONTACT MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-surface border border-outline-variant rounded-2xl w-full max-w-md p-lg shadow-xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-md border-b border-outline-variant pb-sm">
              <h2 className="font-headline-md text-headline-md text-on-surface">Add Emergency Contact</h2>
              <button onClick={() => setShowAddModal(false)} className="text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleAddContact} className="space-y-md">
              <div>
                <label className="block text-sm font-label-bold text-on-surface mb-1">Full Name</label>
                <input 
                  type="text" 
                  value={newContact.name}
                  onChange={(e) => setNewContact({...newContact, name: e.target.value})}
                  className="w-full h-11 px-md border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  placeholder="e.g. John Jenkins"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-label-bold text-on-surface mb-1">Relationship</label>
                <input 
                  type="text" 
                  value={newContact.relationship}
                  onChange={(e) => setNewContact({...newContact, relationship: e.target.value})}
                  className="w-full h-11 px-md border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  placeholder="e.g. Father, Spouse, Doctor"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-label-bold text-on-surface mb-1">Phone Number</label>
                <input 
                  type="tel" 
                  value={newContact.phone}
                  onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
                  className="w-full h-11 px-md border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  placeholder="e.g. (555) 012-3456"
                />
              </div>
              <div className="flex items-center gap-sm py-xs">
                <input 
                  id="primary-toggle"
                  type="checkbox"
                  checked={newContact.isPrimary}
                  onChange={(e) => setNewContact({...newContact, isPrimary: e.target.checked})}
                  className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary/20"
                />
                <label htmlFor="primary-toggle" className="text-sm font-label-bold text-on-surface cursor-pointer select-none">
                  Designate as Primary Contact
                </label>
              </div>
              <div className="flex gap-sm justify-end pt-sm border-t border-outline-variant">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  className="px-md py-sm bg-surface-container-high text-on-surface rounded-lg hover:bg-surface-variant"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-md py-sm bg-primary text-on-primary rounded-lg hover:bg-primary-container font-label-bold"
                >
                  Save Contact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. SIMULATED DIALER MODAL */}
      {activeCall && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-sm flex flex-col items-center justify-between text-white py-xl h-[500px]">
            <div className="flex flex-col items-center gap-md text-center mt-lg">
              <div className="relative">
                <img className="w-24 h-24 rounded-full object-cover border-4 border-white/20" src={activeCall.avatar} alt={activeCall.name} />
                <div className="absolute inset-0 rounded-full border-4 border-tertiary animate-ping opacity-75"></div>
              </div>
              <div>
                <h2 className="font-headline-lg text-headline-lg">{activeCall.name}</h2>
                <p className="text-neutral-400 text-sm mt-1">{activeCall.relationship}</p>
                <p className="text-tertiary-fixed-dim text-lg mt-md font-bold animate-pulse">CALLING...</p>
              </div>
            </div>
            
            <div className="flex flex-col gap-lg w-full px-lg">
              <div className="flex justify-around items-center text-sm text-neutral-300">
                <button className="flex flex-col items-center gap-xs hover:text-white transition-colors">
                  <span className="material-symbols-outlined p-md bg-white/10 rounded-full text-2xl">mic_off</span>
                  <span>Mute</span>
                </button>
                <button 
                  onClick={() => initiateDeviceCall(activeCall.phone)}
                  className="flex flex-col items-center gap-xs text-primary dark:text-primary-fixed-dim hover:text-white transition-colors font-bold"
                >
                  <span className="material-symbols-outlined p-md bg-primary/20 rounded-full text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>call</span>
                  <span>Real Call</span>
                </button>
                <button className="flex flex-col items-center gap-xs hover:text-white transition-colors">
                  <span className="material-symbols-outlined p-md bg-white/10 rounded-full text-2xl">volume_up</span>
                  <span>Speaker</span>
                </button>
              </div>
              
              <button 
                onClick={() => setActiveCall(null)}
                className="w-16 h-16 bg-error hover:bg-error/95 rounded-full flex items-center justify-center mx-auto shadow-lg active:scale-95 transition-transform mt-md"
              >
                <span className="material-symbols-outlined text-[32px]">call_end</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. SIMULATED CHAT INTERFACE */}
      {activeChat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-surface border border-outline-variant rounded-2xl w-full max-w-md h-[550px] flex flex-col shadow-xl animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex justify-between items-center px-md py-sm border-b border-outline-variant bg-surface-container">
              <div className="flex items-center gap-sm">
                <img className="w-10 h-10 rounded-full object-cover border border-outline-variant" src={activeChat.avatar} alt={activeChat.name} />
                <div>
                  <h3 className="font-label-bold text-on-surface text-base">{activeChat.name}</h3>
                  <p className="text-xs text-secondary">{activeChat.relationship} • Online</p>
                </div>
              </div>
              <button onClick={() => setActiveChat(null)} className="text-on-surface-variant hover:text-on-surface p-1 rounded-full">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Message Body */}
            <div className="flex-1 overflow-y-auto p-md space-y-md bg-surface-container-lowest">
              {(chatHistory[activeChat.name] || []).map((msg, i) => (
                <div key={i} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] rounded-2xl px-md py-sm text-sm ${
                    msg.sender === 'me' 
                      ? 'bg-tertiary text-white rounded-tr-none' 
                      : 'bg-surface-container text-on-surface rounded-tl-none border border-outline-variant'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Presets and Inputs */}
            <div className="p-sm border-t border-outline-variant bg-surface-container flex flex-col gap-sm">
              <div className="flex gap-xs overflow-x-auto no-scrollbar py-1">
                <button 
                  onClick={sendSOSPreset}
                  className="flex-shrink-0 bg-primary/10 border border-primary/20 text-primary text-xs font-bold px-sm py-1.5 rounded-full hover:bg-primary/20"
                >
                  ⚠️ Send SOS Coordinates
                </button>
                <button 
                  onClick={() => sendDeviceSMS(activeChat)}
                  className="flex-shrink-0 bg-primary/20 border border-primary/45 text-primary text-xs font-bold px-sm py-1.5 rounded-full hover:bg-primary/30"
                >
                  📱 Real SMS
                </button>
                <button 
                  onClick={() => setChatMessage("I'm safe now. Disregard last alert.")}
                  className="flex-shrink-0 bg-secondary-container/80 border border-outline-variant text-on-secondary-container text-xs px-sm py-1.5 rounded-full hover:bg-secondary-container"
                >
                  I'm safe now
                </button>
                <button 
                  onClick={() => setChatMessage("Can you call me immediately?")}
                  className="flex-shrink-0 bg-secondary-container/80 border border-outline-variant text-on-secondary-container text-xs px-sm py-1.5 rounded-full hover:bg-secondary-container"
                >
                  Call me ASAP
                </button>
              </div>
              
              <form onSubmit={handleSendChatMessage} className="flex gap-sm">
                <input 
                  type="text" 
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  className="flex-1 h-11 px-md border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm bg-white"
                  placeholder="Type a message..."
                />
                <button 
                  type="submit"
                  className="w-11 h-11 rounded-xl bg-tertiary text-white flex items-center justify-center hover:bg-tertiary-container shadow-sm active:scale-95 transition-transform"
                >
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>send</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
