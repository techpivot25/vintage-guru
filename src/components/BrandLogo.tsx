import React, { useState } from 'react';

interface BrandLogoProps {
  logo?: string;
  name: string;
  className?: string;
}

// Iconify Simple Icons mapping for 100% reliable, unblocked brand logos
const BRAND_ICON_SLUGS: Record<string, string> = {
  'maruti suzuki': 'marutisuzuki',
  'tata': 'tata',
  'mahindra': 'mahindra',
  'hyundai': 'hyundai',
  'toyota': 'toyota',
  'kia': 'kia',
  'skoda': 'skoda',
  'bmw': 'bmw',
  'volkswagen': 'volkswagen',
  'mg': 'mg',
  'renault': 'renault',
  'mercedes-benz': 'mercedes',
  'honda': 'honda',
  'land rover': 'landrover',
  'nissan': 'nissan',
  'audi': 'audi',
  'citroen': 'citroen',
  'jeep': 'jeep',
  'byd': 'byd',
  'vinfast': 'vinfast',
  'volvo': 'volvo',
  'porsche': 'porsche',
  'lexus': 'lexus',
  'mini': 'mini',
  'force motors': 'forcemotors',
  'jaguar': 'jaguar',
  'lamborghini': 'lamborghini',
  'ferrari': 'ferrari',
  'rolls-royce': 'rollsroyce',
  'isuzu': 'isuzu',
  'maserati': 'maserati',
  'tesla': 'tesla',
  'aston martin': 'astonmartin',
  'mclaren': 'mclaren',
  'bentley': 'bentley',
  'lotus': 'lotus',
  'chevrolet': 'chevrolet',
  'ford': 'ford',
  'royal enfield': 'royalenfield',
  'vespa': 'vespa',
  'harley-davidson': 'harleydavidson',
  'triumph': 'triumph',
  'yamaha': 'yamaha',
  'kawasaki': 'kawasaki',
  'suzuki': 'suzuki',
  'ducati': 'ducati',
  'gmc': 'gmc',
  'dodge': 'dodge',
  'scania': 'scania',
  'ola': 'ola'
};

// Domain mapping for Google high-res favicon service as backup
const DOMAIN_MAP: Record<string, string> = {
  'maruti suzuki': 'marutisuzuki.com',
  'tata': 'tatamotors.com',
  'mahindra': 'mahindra.com',
  'hyundai': 'hyundai.com',
  'toyota': 'toyota.com',
  'kia': 'kia.com',
  'skoda': 'skoda-auto.com',
  'bmw': 'bmw.com',
  'volkswagen': 'vw.com',
  'mg': 'mgmotor.co.in',
  'renault': 'renault.co.in',
  'mercedes-benz': 'mercedes-benz.com',
  'honda': 'honda.com',
  'land rover': 'landrover.com',
  'nissan': 'nissan-global.com',
  'audi': 'audi.com',
  'citroen': 'citroen.com',
  'jeep': 'jeep.com',
  'byd': 'byd.com',
  'vinfast': 'vinfastauto.com',
  'volvo': 'volvocars.com',
  'porsche': 'porsche.com',
  'lexus': 'lexus.com',
  'mini': 'mini.com',
  'force motors': 'forcemotors.com',
  'jsw': 'jsw.in',
  'jaguar': 'jaguar.com',
  'lamborghini': 'lamborghini.com',
  'ferrari': 'ferrari.com',
  'rolls-royce': 'rolls-roycemotorcars.com',
  'isuzu': 'isuzu.co.jp',
  'maserati': 'maserati.com',
  'tesla': 'tesla.com',
  'aston martin': 'astonmartin.com',
  'mclaren': 'mclaren.com',
  'bentley': 'bentleymotors.com',
  'lotus': 'lotuscars.com',
  'royal enfield': 'royalenfield.com',
  'vespa': 'vespa.com',
  'harley-davidson': 'harley-davidson.com',
  'triumph': 'triumphmotorcycles.com',
  'yamaha': 'yamaha-motor.com',
  'kawasaki': 'kawasaki.com',
  'suzuki': 'suzuki.com',
  'ducati': 'ducati.com',
  'chevrolet': 'chevrolet.com',
  'ford': 'ford.com',
  'ashok leyland': 'ashokleyland.com',
  'scania': 'scania.com'
};

export default function BrandLogo({ logo, name, className = "h-10 w-auto" }: BrandLogoProps) {
  const [attempt, setAttempt] = useState(0);

  const key = name.toLowerCase().trim();
  const slug = BRAND_ICON_SLUGS[key];
  const domain = DOMAIN_MAP[key];

  // Candidates sequence:
  // Attempt 0: Iconify API (crisp SVG of official simple-icon)
  // Attempt 1: Simple Icons CDN
  // Attempt 2: Google Favicon (128px)
  // Attempt 3: Custom passed logo URL
  // Attempt 4+: Clean styled initials badge
  const getImageUrl = () => {
    if (attempt === 0 && slug) {
      return `https://api.iconify.design/simple-icons:${slug}.svg`;
    }
    if (attempt === 1 && slug) {
      return `https://cdn.simpleicons.org/${slug}`;
    }
    if (attempt === 2 && domain) {
      return `https://www.google.com/s2/favicons?sz=128&domain=${domain}`;
    }
    if (attempt === 3 && logo && !logo.includes('clearbit')) {
      return logo;
    }
    return null;
  };

  const currentUrl = getImageUrl();

  if (!currentUrl || attempt > 3) {
    const initials = name
      .split(' ')
      .map(p => p[0])
      .join('')
      .substring(0, 3)
      .toUpperCase();

    return (
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 text-white font-extrabold text-xs flex items-center justify-center border border-slate-700 shadow-xs mb-2 shrink-0 group-hover:scale-105 transition-transform">
        {initials}
      </div>
    );
  }

  return (
    <div className="w-10 h-10 flex items-center justify-center mb-2 shrink-0">
      <img
        src={currentUrl}
        alt={name}
        onError={() => setAttempt(prev => prev + 1)}
        className={`${className} object-contain max-h-10 max-w-full opacity-90 transition-transform duration-200 group-hover:scale-110 filter drop-shadow-xs`}
        referrerPolicy="no-referrer"
      />
    </div>
  );
}
