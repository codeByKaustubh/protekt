import React, { useState, useMemo } from 'react';

export default function SafetyGuidesView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedGuide, setExpandedGuide] = useState(null);

  const guides = useMemo(() => [
    {
      id: 'cpr-guide',
      title: 'Adult CPR',
      category: 'Life Saving',
      icon: 'heart_broken',
      iconFill: true,
      subtitle: 'Cardiopulmonary Resuscitation',
      steps: [
        'Ensure the scene is safe for you and the victim.',
        'Check for responsiveness: tap their shoulder and shout "Are you okay?".',
        'If unresponsive, call emergency services immediately and request an AED.',
        'Place hands in the center of their chest and perform chest compressions (100 to 120 beats per minute, 2 inches deep).',
        'Perform 30 compressions followed by 2 rescue breaths if trained, or do hands-only CPR.'
      ],
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDnwP3IW04x9RnSChxSl2s811_desZZlPL1mrbqksZ0XTL1qvGrMNcZj4w3l7uKN4ujbJfZs5ETb1o9L4_mpTLp3Kl0uN-ci6RRaEFljdbVUPVFzwkThKbulRTrEpCJNczk9P-HOptKxI7-_-Vp1V-6hAlG0K30pg-NiXW-D_BlTPiqF-5kz9D8_vtcXq42OLCdBSXNSWkGCxAT5cNEk51Y0rlqExcUwMyPRRO4sR4RyokJOwRH1yODcJ2Yo7oFLh7u7gGSSJsN5Mg'
    },
    {
      id: 'choking-guide',
      title: 'Choking Support',
      category: 'Airway',
      icon: 'air',
      subtitle: 'Heimlich Maneuver & Back Blows',
      steps: [
        'Confirm the person is choking (cannot speak or breathe).',
        'Give up to 5 sharp back blows between shoulder blades with the heel of your hand.',
        'If object is not dislodged, perform 5 abdominal thrusts (Heimlich maneuver).',
        'Alternate 5 back blows and 5 abdominal thrusts until the airway is clear.'
      ]
    },
    {
      id: 'bleeding-guide',
      title: 'Severe Bleeding',
      category: 'Trauma',
      icon: 'bloodtype',
      subtitle: 'Hemostasis & Pressure Application',
      steps: [
        'Apply direct pressure to the wound with a clean cloth or sterile bandage.',
        'Maintain constant pressure. If blood seeps through, place another cloth on top—do not remove the first.',
        'Elevate the injured limb above heart level to slow the blood flow.',
        'If bleeding does not stop with pressure, apply a tourniquet above the wound site if trained.'
      ]
    },
    {
      id: 'burns-guide',
      title: 'Burns & Scalds',
      category: 'Thermal',
      icon: 'local_fire_department',
      subtitle: 'Treating heat & chemical injuries',
      steps: [
        'Remove the person from the heat source immediately.',
        'Cool the burn under cool (not ice cold) running water for at least 20 minutes.',
        'Cover the burn loosely with a clean, non-stick plastic wrap or sterile dressing to prevent infection.'
      ],
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCa9-YiuDSWkmf1bhQr4kf7-Fc95c5k400h46hSSUJQ-jSq-j3xbFMqUYliVs5Ogmtk3o__Cz1-mXETHP8NyjNxscr7kKFOEMVWX2ApIobf_T1QQBiTIbnmzXPJ7Kv439RGSDDaGqj0B8rBIAPpsqArlsV8jejpMfgZeLf4MJiP5t8KxzpgMueYczdw9vlPJET232KNiMssB00g_KT5V5_F9k4NdXM8FlPb9bO227Zypbzg-Own8-Mj5veXSsfi5-HhEIJF003AWy8'
    },
    {
      id: 'seizure-guide',
      title: 'Seizures',
      category: 'Neurological',
      icon: 'bolt',
      subtitle: 'Helping during an active episode',
      steps: [
        'Gently roll the person onto their side to keep their airway clear and prevent choking on saliva.',
        'Place something soft (like a folded jacket or pillow) under their head.',
        'Loosen tight clothing around their neck (collars, ties).',
        'Do NOT hold the person down or place anything inside their mouth.'
      ]
    },
    {
      id: 'fracture-guide',
      title: 'Broken Bones',
      category: 'Orthopedic',
      icon: 'done',
      subtitle: 'Stabilizing suspected fractures',
      steps: [
        'Do not try to move or realign the broken bone.',
        'Support and splint the limb in the position it was found using rolled newspapers, cardboard, or pillows.',
        'Apply ice packs wrapped in a towel to reduce swelling and ease the pain.'
      ]
    }
  ], []);

  const filteredGuides = useMemo(() => {
    return guides.filter(guide => {
      const search = searchTerm.toLowerCase();
      return (
        guide.title.toLowerCase().includes(search) ||
        guide.subtitle.toLowerCase().includes(search) ||
        guide.steps.some(step => step.toLowerCase().includes(search))
      );
    });
  }, [searchTerm, guides]);

  const toggleGuide = (id) => {
    if (expandedGuide === id) {
      setExpandedGuide(null);
    } else {
      setExpandedGuide(id);
      // Smooth scroll to the expanded guide
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  };

  const selectCategoryGuide = (id) => {
    setSearchTerm('');
    setExpandedGuide(id);
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 150);
  };

  return (
    <div className="max-w-4xl mx-auto w-full fade-in pb-12">
      {/* Search Header */}
      <section className="bg-surface-container-low rounded-2xl p-lg mb-lg border border-outline-variant shadow-sm">
        <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface mb-md">Safety Guides</h2>
        <div className="relative flex items-center">
          <span className="material-symbols-outlined absolute left-md text-on-surface-variant">search</span>
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-touch-target pl-xl pr-md bg-white border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all font-body-md text-body-md text-on-surface"
            placeholder="Search first aid instructions..."
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="absolute right-md text-on-surface-variant hover:text-on-surface"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          )}
        </div>
      </section>

      {/* Categories Bento */}
      <section className="mb-xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-md">
          {/* Critical CPR Card */}
          <button 
            onClick={() => selectCategoryGuide('cpr-guide')}
            className="col-span-2 row-span-1 bg-primary text-on-primary p-lg rounded-xl flex flex-col justify-between items-start text-left shadow-lg hover:opacity-95 transition-all active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-[40px] text-white" style={{ fontVariationSettings: "'FILL' 1" }}>heart_broken</span>
            <div className="mt-4">
              <p className="font-label-bold text-label-md uppercase tracking-wider opacity-80 mb-xs text-neutral-200">Life Saving</p>
              <h3 className="font-headline-md text-headline-md text-white">Adult CPR</h3>
            </div>
          </button>
          
          {/* Choking Card */}
          <button 
            onClick={() => selectCategoryGuide('choking-guide')}
            className="bg-surface-container-highest p-md rounded-xl flex flex-col justify-center items-center gap-sm text-center border border-outline-variant hover:bg-surface-container transition-all active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-primary text-3xl">air</span>
            <span className="font-label-bold text-label-md text-on-surface">Choking</span>
          </button>
          
          {/* Bleeding Card */}
          <button 
            onClick={() => selectCategoryGuide('bleeding-guide')}
            className="bg-surface-container-highest p-md rounded-xl flex flex-col justify-center items-center gap-sm text-center border border-outline-variant hover:bg-surface-container transition-all active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>bloodtype</span>
            <span className="font-label-bold text-label-md text-on-surface">Bleeding</span>
          </button>
        </div>
      </section>

      {/* List of All Guides */}
      <section className="space-y-sm">
        <h4 className="font-label-bold text-label-md text-secondary px-xs mb-sm uppercase tracking-wider">
          {searchTerm ? `Search Results (${filteredGuides.length})` : 'Common Emergencies'}
        </h4>

        {filteredGuides.length === 0 ? (
          <div className="text-center py-xl bg-surface-container-lowest border border-outline-variant rounded-xl">
            <span className="material-symbols-outlined text-4xl text-on-surface-variant opacity-40">search_off</span>
            <p className="text-on-surface-variant font-body-md mt-sm">No safety guides found matching "{searchTerm}"</p>
          </div>
        ) : (
          filteredGuides.map((guide) => {
            const isExpanded = expandedGuide === guide.id;
            return (
              <div key={guide.id} className="bg-white border border-outline-variant rounded-xl overflow-hidden shadow-sm">
                <button 
                  onClick={() => toggleGuide(guide.id)}
                  className="w-full flex items-center justify-between p-md hover:bg-surface-container-low transition-colors"
                >
                  <div className="flex items-center gap-md">
                    <div className="w-12 h-12 rounded-lg bg-error-container/20 flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined text-primary text-2xl" style={{ fontVariationSettings: guide.iconFill ? "'FILL' 1" : "'FILL' 0" }}>
                        {guide.icon}
                      </span>
                    </div>
                    <div className="text-left">
                      <p className="font-headline-md text-body-lg text-on-surface leading-snug">{guide.title}</p>
                      <p className="font-body-md text-label-md text-secondary mt-0.5">{guide.subtitle}</p>
                    </div>
                  </div>
                  <span 
                    className="material-symbols-outlined text-on-surface-variant transition-transform duration-200"
                    style={{ transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }}
                  >
                    chevron_right
                  </span>
                </button>

                {/* Detail Pane */}
                {isExpanded && (
                  <div 
                    id={guide.id} 
                    className="px-md pb-md bg-surface-container-lowest border-t border-outline-variant animate-in fade-in duration-300"
                  >
                    <div className="py-md space-y-md">
                      {guide.steps.map((step, idx) => (
                        <div key={idx} className="flex gap-md items-start">
                          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-label-bold text-label-md">
                            {idx + 1}
                          </span>
                          <p className="font-body-md text-body-md text-on-surface pt-1">{step}</p>
                        </div>
                      ))}
                    </div>
                    {guide.image && (
                      <div className="w-full h-48 rounded-xl overflow-hidden mb-md border border-outline-variant">
                        <img 
                          className="w-full h-full object-cover" 
                          src={guide.image} 
                          alt={`${guide.title} instruction illustration`} 
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </section>

      {/* Visual Context Feature: Map to AED */}
      <section className="mt-xl">
        <div className="relative h-64 rounded-2xl overflow-hidden border border-outline-variant flex items-end p-lg shadow-sm">
          <div className="absolute inset-0 z-0">
            <img 
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDnwP3IW04x9RnSChxSl2s811_desZZlPL1mrbqksZ0XTL1qvGrMNcZj4w3l7uKN4ujbJfZs5ETb1o9L4_mpTLp3Kl0uN-ci6RRaEFljdbVUPVFzwkThKbulRTrEpCJNczk9P-HOptKxI7-_-Vp1V-6hAlG0K30pg-NiXW-D_BlTPiqF-5kz9D8_vtcXq42OLCdBSXNSWkGCxAT5cNEk51Y0rlqExcUwMyPRRO4sR4RyokJOwRH1yODcJ2Yo7oFLh7u7gGSSJsN5Mg" 
              alt="Paramedic training AED presentation"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
          </div>
          <div className="relative z-10 text-white w-full">
            <h3 className="font-headline-md text-headline-md mb-xs text-white">Find Nearest AED</h3>
            <p className="font-body-md text-body-md opacity-90 mb-md text-neutral-200">
              Locate automated external defibrillators in your current vicinity.
            </p>
            <a 
              href="https://www.google.com/maps/search/AED+defibrillator/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-on-surface hover:bg-surface px-md py-sm rounded-lg font-label-bold text-label-md active:scale-95 transition-all flex items-center gap-sm w-fit shadow-md"
            >
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
              <span>OPEN MAP</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
