import React, { useState } from 'react';

export default function MedicalIDView({ profile, setProfile }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({ ...profile });
  const [newAllergy, setNewAllergy] = useState({ name: '', severity: 'Moderate' });
  const [newMedication, setNewMedication] = useState({ name: '', info: '' });
  const [newCondition, setNewCondition] = useState('');

  const handleStartEdit = () => {
    setEditedProfile({ ...profile });
    setIsEditing(true);
  };

  const handleSave = () => {
    setProfile({ ...editedProfile });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleToggleLockScreen = (checked) => {
    setProfile({ ...profile, showOnLockScreen: checked });
  };

  // Allergy operations
  const addAllergy = () => {
    if (!newAllergy.name.trim()) return;
    setEditedProfile({
      ...editedProfile,
      allergies: [...editedProfile.allergies, { ...newAllergy }]
    });
    setNewAllergy({ name: '', severity: 'Moderate' });
  };

  const removeAllergy = (index) => {
    const updated = editedProfile.allergies.filter((_, i) => i !== index);
    setEditedProfile({ ...editedProfile, allergies: updated });
  };

  // Medication operations
  const addMedication = () => {
    if (!newMedication.name.trim()) return;
    setEditedProfile({
      ...editedProfile,
      medications: [...editedProfile.medications, { ...newMedication }]
    });
    setNewMedication({ name: '', info: '' });
  };

  const removeMedication = (index) => {
    const updated = editedProfile.medications.filter((_, i) => i !== index);
    setEditedProfile({ ...editedProfile, medications: updated });
  };

  // Condition operations
  const addCondition = () => {
    if (!newCondition.trim()) return;
    setEditedProfile({
      ...editedProfile,
      conditions: [...editedProfile.conditions, newCondition.trim()]
    });
    setNewCondition('');
  };

  const removeCondition = (index) => {
    const updated = editedProfile.conditions.filter((_, i) => i !== index);
    setEditedProfile({ ...editedProfile, conditions: updated });
  };

  return (
    <div className="max-w-2xl mx-auto w-full fade-in pb-12">
      {/* Profile Header */}
      <section className="mb-lg">
        <div className="flex items-center justify-between p-md bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm">
          <div className="flex items-center gap-md">
            <div className="relative">
              <img 
                className="w-20 h-20 rounded-full object-cover border-2 border-primary" 
                src={profile.avatar} 
                alt={profile.name} 
              />
              <div className="absolute -bottom-1 -right-1 bg-primary text-on-primary p-1 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
              </div>
            </div>
            {isEditing ? (
              <div className="space-y-sm">
                <input 
                  type="text" 
                  value={editedProfile.name} 
                  onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                  className="px-sm py-1 border border-outline-variant rounded font-headline-md text-headline-md text-on-surface bg-white w-full"
                />
                <input 
                  type="text" 
                  value={editedProfile.dob} 
                  onChange={(e) => setEditedProfile({ ...editedProfile, dob: e.target.value })}
                  className="px-sm py-0.5 border border-outline-variant rounded font-label-md text-label-md text-secondary bg-white w-full"
                  placeholder="DOB: DD/MM/YYYY"
                />
              </div>
            ) : (
              <div>
                <h1 className="font-headline-md text-headline-md text-on-surface">{profile.name}</h1>
                <p className="font-label-md text-label-md text-secondary">DOB: {profile.dob} ({profile.age} yrs)</p>
              </div>
            )}
          </div>
          <div>
            {isEditing ? (
              <div className="flex flex-col sm:flex-row gap-xs">
                <button 
                  onClick={handleSave}
                  className="bg-primary text-on-primary text-xs font-bold px-sm py-2 rounded-lg hover:bg-primary-container active:scale-95 transition-transform"
                >
                  Save
                </button>
                <button 
                  onClick={handleCancel}
                  className="bg-surface-container-high text-on-surface text-xs font-bold px-sm py-2 rounded-lg hover:bg-surface-variant active:scale-95 transition-transform"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button 
                onClick={handleStartEdit}
                className="text-primary hover:bg-primary/5 font-label-bold px-md py-sm rounded-lg border border-primary/20 active:scale-95 transition-transform flex items-center gap-xs"
              >
                <span className="material-symbols-outlined text-sm">edit</span>
                <span>Edit</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Critical Lock Screen Toggle */}
      <section className="mb-lg">
        <div className={`bg-primary-container text-on-primary-container p-md rounded-xl flex items-center justify-between shadow-sm border border-primary/20 transition-opacity duration-300 ${profile.showOnLockScreen ? 'opacity-100' : 'opacity-60'}`}>
          <div className="flex items-center gap-sm">
            <span className="material-symbols-outlined">screen_lock_portrait</span>
            <div>
              <p className="font-label-bold text-label-bold">Show on Lock Screen</p>
              <p className="text-xs opacity-90">Allow responders to view without passcode</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              checked={profile.showOnLockScreen} 
              onChange={(e) => handleToggleLockScreen(e.target.checked)}
              className="sr-only peer" 
            />
            <div className="w-11 h-6 bg-on-primary-container/30 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-on-primary"></div>
          </label>
        </div>
      </section>

      {/* Bento Grid Stats */}
      <div className="grid grid-cols-2 gap-md mb-lg">
        <div className="bg-surface-container-lowest border border-outline-variant p-md rounded-xl flex flex-col items-center justify-center text-center">
          <span className="material-symbols-outlined text-primary mb-xs" style={{ fontVariationSettings: "'FILL' 1" }}>bloodtype</span>
          <span className="text-xs font-label-bold text-secondary uppercase tracking-wider">Blood Type</span>
          {isEditing ? (
            <select 
              value={editedProfile.bloodType}
              onChange={(e) => setEditedProfile({ ...editedProfile, bloodType: e.target.value })}
              className="mt-xs bg-white border border-outline-variant rounded px-sm py-1 font-display-sos text-lg outline-none"
            >
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          ) : (
            <span className="font-display-sos text-[32px] text-on-surface">{profile.bloodType}</span>
          )}
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant p-md rounded-xl flex flex-col items-center justify-center text-center">
          <span className="material-symbols-outlined text-primary mb-xs">height</span>
          <span className="text-xs font-label-bold text-secondary uppercase tracking-wider">Height / Weight</span>
          {isEditing ? (
            <div className="flex gap-xs mt-xs max-w-full">
              <input 
                type="text" 
                value={editedProfile.height}
                onChange={(e) => setEditedProfile({ ...editedProfile, height: e.target.value })}
                className="w-16 px-sm py-1 border border-outline-variant rounded bg-white text-sm text-center"
                placeholder="Height"
              />
              <input 
                type="text" 
                value={editedProfile.weight}
                onChange={(e) => setEditedProfile({ ...editedProfile, weight: e.target.value })}
                className="w-16 px-sm py-1 border border-outline-variant rounded bg-white text-sm text-center"
                placeholder="Weight"
              />
            </div>
          ) : (
            <span className="font-headline-md text-headline-md text-on-surface">{profile.height} / {profile.weight}</span>
          )}
        </div>
      </div>

      {/* Detailed Medical Info */}
      <div className="space-y-md">
        {/* 1. Allergies Section */}
        <div className="bg-white border border-outline-variant rounded-xl overflow-hidden shadow-sm">
          <div className="bg-error-container/30 px-md py-sm flex items-center justify-between border-b border-outline-variant">
            <div className="flex items-center gap-sm">
              <span className="material-symbols-outlined text-error" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
              <h2 className="font-label-bold text-label-bold text-on-error-container uppercase tracking-wide">Known Allergies</h2>
            </div>
          </div>
          <div className="p-md space-y-sm">
            {(isEditing ? editedProfile.allergies : profile.allergies).map((allergy, index) => (
              <div key={index}>
                <div className="flex justify-between items-center py-1">
                  <span className="font-body-md text-on-surface font-semibold">{allergy.name}</span>
                  <div className="flex items-center gap-sm">
                    <span className={`px-sm py-xs text-[10px] font-bold rounded uppercase ${
                      allergy.severity === 'Severe' ? 'bg-error-container text-on-error-container' : 'bg-secondary-container text-on-secondary-container'
                    }`}>
                      {allergy.severity}
                    </span>
                    {isEditing && (
                      <button 
                        onClick={() => removeAllergy(index)} 
                        className="text-on-surface-variant hover:text-error"
                      >
                        <span className="material-symbols-outlined text-base">delete</span>
                      </button>
                    )}
                  </div>
                </div>
                {index < (isEditing ? editedProfile.allergies.length : profile.allergies.length) - 1 && (
                  <div className="h-[1px] bg-outline-variant"></div>
                )}
              </div>
            ))}
            
            {/* Add allergy inline if editing */}
            {isEditing && (
              <div className="flex flex-col sm:flex-row gap-sm pt-md border-t border-dashed border-outline-variant">
                <input 
                  type="text" 
                  placeholder="New Allergy Name..."
                  value={newAllergy.name}
                  onChange={(e) => setNewAllergy({ ...newAllergy, name: e.target.value })}
                  className="flex-1 px-sm py-1 border border-outline-variant rounded bg-white text-sm outline-none"
                />
                <select
                  value={newAllergy.severity}
                  onChange={(e) => setNewAllergy({ ...newAllergy, severity: e.target.value })}
                  className="bg-white border border-outline-variant rounded px-sm py-1 text-sm outline-none"
                >
                  <option value="Severe">Severe</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Mild">Mild</option>
                </select>
                <button 
                  onClick={addAllergy}
                  className="bg-secondary text-on-secondary text-xs px-md py-1.5 rounded-lg hover:bg-secondary/90 font-bold active:scale-95 transition-transform"
                >
                  Add
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 2. Medications Section */}
        <div className="bg-white border border-outline-variant rounded-xl overflow-hidden shadow-sm">
          <div className="bg-tertiary-fixed/30 px-md py-sm flex items-center justify-between border-b border-outline-variant">
            <div className="flex items-center gap-sm">
              <span className="material-symbols-outlined text-tertiary">pill</span>
              <h2 className="font-label-bold text-label-bold text-on-tertiary-fixed-variant uppercase tracking-wide">Current Medications</h2>
            </div>
          </div>
          <div className="p-md space-y-md">
            {(isEditing ? editedProfile.medications : profile.medications).map((med, index) => (
              <div key={index} className="flex gap-md justify-between items-start">
                <div className="flex gap-md">
                  <div className="w-10 h-10 bg-surface-container rounded flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-secondary">
                      {med.info.includes('Liquid') || med.info.includes('Inhaler') ? 'medication_liquid' : 'medication'}
                    </span>
                  </div>
                  <div>
                    <p className="font-label-bold text-on-surface">{med.name}</p>
                    <p className="text-xs text-secondary">{med.info}</p>
                  </div>
                </div>
                {isEditing && (
                  <button 
                    onClick={() => removeMedication(index)} 
                    className="text-on-surface-variant hover:text-error self-center"
                  >
                    <span className="material-symbols-outlined text-base">delete</span>
                  </button>
                )}
              </div>
            ))}

            {/* Add medication inline if editing */}
            {isEditing && (
              <div className="flex flex-col gap-xs pt-md border-t border-dashed border-outline-variant">
                <div className="flex flex-col sm:flex-row gap-sm">
                  <input 
                    type="text" 
                    placeholder="Medication Name..."
                    value={newMedication.name}
                    onChange={(e) => setNewMedication({ ...newMedication, name: e.target.value })}
                    className="flex-1 px-sm py-1 border border-outline-variant rounded bg-white text-sm outline-none"
                  />
                  <input 
                    type="text" 
                    placeholder="e.g. 10mg • Daily"
                    value={newMedication.info}
                    onChange={(e) => setNewMedication({ ...newMedication, info: e.target.value })}
                    className="flex-1 px-sm py-1 border border-outline-variant rounded bg-white text-sm outline-none"
                  />
                  <button 
                    onClick={addMedication}
                    className="bg-secondary text-on-secondary text-xs px-md py-1.5 rounded-lg hover:bg-secondary/90 font-bold active:scale-95 transition-transform"
                  >
                    Add
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 3. Medical Conditions Section */}
        <div className="bg-white border border-outline-variant rounded-xl overflow-hidden shadow-sm">
          <div className="bg-secondary-container/30 px-md py-sm flex items-center justify-between border-b border-outline-variant">
            <div className="flex items-center gap-sm">
              <span className="material-symbols-outlined text-secondary">clinical_notes</span>
              <h2 className="font-label-bold text-label-bold text-on-secondary-container uppercase tracking-wide">Conditions</h2>
            </div>
          </div>
          <div className="p-md">
            <ul className="space-y-sm text-on-surface-variant font-body-md">
              {(isEditing ? editedProfile.conditions : profile.conditions).map((cond, index) => (
                <li key={index} className="flex justify-between items-center pl-xs">
                  <div className="flex items-center gap-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                    <span>{cond}</span>
                  </div>
                  {isEditing && (
                    <button 
                      onClick={() => removeCondition(index)} 
                      className="text-on-surface-variant hover:text-error"
                    >
                      <span className="material-symbols-outlined text-base">delete</span>
                    </button>
                  )}
                </li>
              ))}
            </ul>

            {/* Add condition inline if editing */}
            {isEditing && (
              <div className="flex gap-sm pt-md border-t border-dashed border-outline-variant mt-md">
                <input 
                  type="text" 
                  placeholder="New Condition..."
                  value={newCondition}
                  onChange={(e) => setNewCondition(e.target.value)}
                  className="flex-1 px-sm py-1 border border-outline-variant rounded bg-white text-sm outline-none"
                />
                <button 
                  onClick={addCondition}
                  className="bg-secondary text-on-secondary text-xs px-md py-1.5 rounded-lg hover:bg-secondary/90 font-bold active:scale-95 transition-transform"
                >
                  Add
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 4. Organ Donor Section */}
        <div className="bg-surface-container-low p-md rounded-xl flex items-center justify-between border border-outline-variant shadow-sm">
          <div className="flex items-center gap-md">
            <div className="bg-primary-container p-sm rounded-full text-on-primary-container flex items-center justify-center">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
            </div>
            <div>
              <p className="font-label-bold text-on-surface">Organ Donor</p>
              <p className="text-xs text-secondary">Registered in New York State</p>
            </div>
          </div>
          {isEditing && (
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={editedProfile.donor} 
                onChange={(e) => setEditedProfile({ ...editedProfile, donor: e.target.checked })}
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-secondary/30 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          )}
        </div>
      </div>

      {/* Primary Contacts quick dials */}
      <section className="mt-xl">
        <h2 className="font-headline-md text-on-surface mb-md">Emergency Quick Dial</h2>
        <div className="space-y-sm">
          <div className="bg-white p-md rounded-xl border border-outline-variant flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-md">
              <div className="w-12 h-12 bg-secondary-fixed rounded-full flex items-center justify-center text-on-secondary-fixed">
                <span className="material-symbols-outlined">person</span>
              </div>
              <div>
                <p className="font-label-bold text-on-surface">Sarah Thorne</p>
                <p className="text-xs text-secondary">Spouse • {profile.spouseCall}</p>
              </div>
            </div>
            <a 
              href={`tel:${profile.spouseCall}`}
              className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center hover:bg-secondary-container/90"
            >
              <span className="material-symbols-outlined">call</span>
            </a>
          </div>
          <div className="bg-white p-md rounded-xl border border-outline-variant flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-md">
              <div className="w-12 h-12 bg-secondary-fixed rounded-full flex items-center justify-center text-on-secondary-fixed">
                <span className="material-symbols-outlined">person</span>
              </div>
              <div>
                <p className="font-label-bold text-on-surface">Dr. Elena Rodriguez</p>
                <p className="text-xs text-secondary">Primary Physician • {profile.doctorCall}</p>
              </div>
            </div>
            <a 
              href={`tel:${profile.doctorCall}`}
              className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center hover:bg-secondary-container/90"
            >
              <span className="material-symbols-outlined">call</span>
            </a>
          </div>
        </div>
      </section>

      {/* Footer Note */}
      <p className="mt-xl text-center text-xs text-on-surface-variant italic px-md">
        This information is stored locally on your device and is accessible to first responders from your lock screen when 'Show on Lock Screen' is enabled.
      </p>
    </div>
  );
}
