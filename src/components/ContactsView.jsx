import React, { useState } from 'react';

export default function ContactsView({ contacts, setContacts, location, profile }) {
  const [showModal, setShowModal] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [contactForm, setContactForm] = useState({ name: '', relationship: '', phone: '', isPrimary: false });

  const initiateDeviceCall = (phone) => {
    const cleanPhone = phone.replace(/[^\d+]/g, '');
    window.location.href = `tel:${cleanPhone}`;
  };

  const sendDeviceSMS = (contact) => {
    const cleanPhone = contact.phone.replace(/[^\d+]/g, '');
    const defaultText = `[EMERGENCY WARNING] ${profile?.name || 'User'} has triggered an SOS alert! Location: ${location.address} (${location.coords.lat}, ${location.coords.lng})`;
    window.open(`sms:${cleanPhone}?body=${encodeURIComponent(defaultText)}`);
  };

  const handleOpenAddModal = () => {
    setEditingContact(null);
    setContactForm({ name: '', relationship: '', phone: '', isPrimary: false });
    setShowModal(true);
  };

  const handleOpenEditModal = (contact) => {
    setEditingContact(contact);
    setContactForm({
      name: contact.name,
      relationship: contact.relationship,
      phone: contact.phone,
      isPrimary: contact.isPrimary
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingContact(null);
    setContactForm({ name: '', relationship: '', phone: '', isPrimary: false });
  };

  const handleSaveContact = (e) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.relationship) return;

    let updatedContacts = [...contacts];
    if (contactForm.isPrimary) {
      // Demote existing primary contacts if this one is designated as primary
      updatedContacts = updatedContacts.map(c => ({ ...c, isPrimary: false }));
    }

    if (editingContact) {
      // Update existing contact
      updatedContacts = updatedContacts.map(c => 
        c.id === editingContact.id 
          ? { 
              ...c, 
              name: contactForm.name, 
              relationship: contactForm.relationship, 
              phone: contactForm.phone || '+91 98200 12345', 
              isPrimary: contactForm.isPrimary 
            }
          : c
      );
      setContacts(updatedContacts);
    } else {
      // Create new contact
      const newEntry = {
        id: Date.now().toString(),
        name: contactForm.name,
        relationship: contactForm.relationship,
        phone: contactForm.phone || '+91 98200 12345',
        isPrimary: contactForm.isPrimary,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150'
      };
      setContacts([newEntry, ...updatedContacts]);
    }

    handleCloseModal();
  };

  const handleDeleteContact = (id) => {
    setContacts(contacts.filter(c => c.id !== id));
  };

  return (
    <div className="max-w-2xl mx-auto w-full fade-in pb-12">
      <div className="flex items-center justify-between mb-lg">
        <div>
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">Emergency Contacts</h1>
          <p className="font-body-md text-on-surface-variant text-sm">Manage people to alert in case of SOS.</p>
        </div>
        <button 
          onClick={handleOpenAddModal}
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
            <div className="relative flex-shrink-0">
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
            <div className="flex items-center gap-xs sm:gap-sm flex-shrink-0">
              {/* Native Message Trigger */}
              <button 
                onClick={() => sendDeviceSMS(contact)}
                className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center hover:opacity-90 active:scale-90 transition-all shadow-sm"
                title="Send Device Message"
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>chat</span>
              </button>
              {/* Native Call Trigger */}
              <button 
                onClick={() => initiateDeviceCall(contact.phone)}
                className="w-10 h-10 rounded-full bg-tertiary-container text-on-tertiary-container flex items-center justify-center hover:opacity-90 active:scale-90 transition-all shadow-sm"
                title="Call Device"
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>call</span>
              </button>
              {/* Edit Button */}
              <button 
                onClick={() => handleOpenEditModal(contact)}
                className="w-8 h-8 rounded-full text-on-surface-variant hover:text-primary flex items-center justify-center active:scale-95 transition-colors"
                title="Edit Contact"
              >
                <span className="material-symbols-outlined text-[20px]">edit</span>
              </button>
              {/* Delete Button */}
              {contacts.length > 1 && (
                <button 
                  onClick={() => handleDeleteContact(contact.id)}
                  className="w-8 h-8 rounded-full text-on-surface-variant hover:text-error flex items-center justify-center active:scale-95 transition-colors"
                  title="Delete Contact"
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

      {/* CONTACT MODAL (ADD & EDIT) */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-surface border border-outline-variant rounded-2xl w-full max-w-md p-lg shadow-xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-md border-b border-outline-variant pb-sm">
              <h2 className="font-headline-md text-headline-md text-on-surface">
                {editingContact ? 'Edit Emergency Contact' : 'Add Emergency Contact'}
              </h2>
              <button onClick={handleCloseModal} className="text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleSaveContact} className="space-y-md">
              <div>
                <label className="block text-sm font-label-bold text-on-surface mb-1">Full Name</label>
                <input 
                  type="text" 
                  value={contactForm.name}
                  onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                  className="w-full h-11 px-md border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white text-on-surface"
                  placeholder="e.g. Sarah Jenkins"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-label-bold text-on-surface mb-1">Relationship</label>
                <input 
                  type="text" 
                  value={contactForm.relationship}
                  onChange={(e) => setContactForm({...contactForm, relationship: e.target.value})}
                  className="w-full h-11 px-md border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white text-on-surface"
                  placeholder="e.g. Mother, Spouse, Friend"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-label-bold text-on-surface mb-1">Phone Number</label>
                <input 
                  type="tel" 
                  value={contactForm.phone}
                  onChange={(e) => setContactForm({...contactForm, phone: e.target.value})}
                  className="w-full h-11 px-md border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white text-on-surface"
                  placeholder="e.g. +91 98200 12345"
                />
              </div>
              <div className="flex items-center gap-sm py-xs">
                <input 
                  id="primary-toggle"
                  type="checkbox"
                  checked={contactForm.isPrimary}
                  onChange={(e) => setContactForm({...contactForm, isPrimary: e.target.checked})}
                  className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary/20 cursor-pointer"
                />
                <label htmlFor="primary-toggle" className="text-sm font-label-bold text-on-surface cursor-pointer select-none">
                  Designate as Primary Contact
                </label>
              </div>
              <div className="flex gap-sm justify-end pt-sm border-t border-outline-variant">
                <button 
                  type="button" 
                  onClick={handleCloseModal}
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
    </div>
  );
}
