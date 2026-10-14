export interface ForumReply {
  id: string;
  author: string;
  authorBadge: 'Verified Owner' | 'Forum Veteran' | 'Senior Contributor' | 'Community Moderator';
  authorCity: string;
  avatar: string;
  content: string;
  createdAt: string;
  upvotes: number;
  isUpvoted?: boolean;
}

export interface ForumThread {
  id: string;
  title: string;
  category: 
    | 'Car Ownership Review'
    | 'Bike Ownership Review'
    | 'No-BS Trip Reports'
    | 'Real On-Road Prices'
    | 'What Car Next / Advice'
    | 'Technical & DIY'
    | 'Car Reviews & News'
    | 'Introductions & Garage';
  brand: string;
  model: string;
  author: string;
  authorBadge: 'Verified Owner' | 'Forum Veteran' | 'Senior Contributor' | 'Community Moderator';
  authorCity: string;
  avatar: string;
  createdAt: string;
  views: number;
  upvotes: number;
  isHot?: boolean;
  isUpvoted?: boolean;
  isBookmarked?: boolean;
  tags: string[];
  content: string;
  
  // Category-specific details (inspired by IndianAutoForum)
  ownershipDetails?: {
    kmDriven: number;
    mileage: string;
    rating: number; // out of 5
    fuelType: 'Petrol' | 'Diesel' | 'CNG' | 'Electric' | 'Hybrid';
    pros: string[];
    cons: string[];
    serviceCostYearly?: string;
  };

  tripDetails?: {
    route: string;
    distanceKm: number;
    durationDays: number;
    fuelCost: string;
    tollCost: string;
    roadCondition: 'Smooth 4-lane Highway' | 'Challenging Ghats & Offroad' | 'Mixed Country Roads';
    highlight: string;
  };

  priceReportDetails?: {
    city: string;
    variant: string;
    exShowroom: string;
    rtoTax: string;
    insurance: string;
    dealerDiscount: string;
    finalOnRoad: string;
    waitingPeriod: string;
  };

  replies: ForumReply[];
}

export const FORUM_CATEGORIES = [
  { id: 'all', name: 'All Discussions', icon: 'Layers' },
  { id: 'hot', name: '🔥 Hot in Forum', icon: 'Flame' },
  { id: 'car-ownership', name: 'Car Ownership Reviews', icon: 'Car' },
  { id: 'bike-ownership', name: 'Bike Ownership Reviews', icon: 'Bike' },
  { id: 'trip-reports', name: 'No-BS Trip Reports', icon: 'Navigation' },
  { id: 'price-reports', name: 'Real On-Road Prices', icon: 'DollarSign' },
  { id: 'advice', name: 'What Car Next / Advice', icon: 'Sparkles' },
  { id: 'technical', name: 'Technical & DIY', icon: 'Wrench' },
] as const;

export const POPULAR_BRANDS = [
  'All Brands',
  'Tata',
  'Mahindra',
  'Hyundai',
  'Maruti Suzuki',
  'Kia',
  'Toyota',
  'Honda',
  'Volkswagen',
  'Skoda',
  'Royal Enfield',
  'TVS',
  'Bajaj',
  'Ather'
];

export const INITIAL_THREADS: ForumThread[] = [
  {
    id: 'thread-1',
    title: 'Tata Safari Dark Edition - 28,000 km Long-Term Ownership Review & Service Costs',
    category: 'Car Ownership Review',
    brand: 'Tata',
    model: 'Safari Dark XZA+ (O)',
    author: 'Rajesh Nair',
    authorBadge: 'Verified Owner',
    authorCity: 'Bengaluru, KA',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    createdAt: '3 hours ago',
    views: 4820,
    upvotes: 142,
    isHot: true,
    tags: ['TataSafari', 'Ownership', 'DieselAT', 'BengaluruTraffic'],
    ownershipDetails: {
      kmDriven: 28400,
      mileage: '12.4 kmpl in city, 16.8 kmpl on highway',
      rating: 4.5,
      fuelType: 'Diesel',
      pros: [
        'Commanding road presence & sublime high-speed stability',
        'JBL 9-speaker audio system with subwoofer is best-in-class',
        '3rd row seating is actually usable for adults up to 5ft 8in',
        'Effortless 2.0L Kryotec diesel mated to smooth Hyundai 6-speed torque converter'
      ],
      cons: [
        'Infotainment software had occasional freezing before v18.2 update',
        'Turning radius in tight Bengaluru U-turns requires full 3-point turns',
        'DEF (AdBlue) consumption spikes slightly in bumper-to-bumper peak hour crawls'
      ],
      serviceCostYearly: '₹ 14,800 approx (including synthetic oil and fuel filters)'
    },
    content: `Completed 28,000 km across 18 months with our Tata Safari Dark Edition. We have taken it across Karnataka, Goa, and Tamil Nadu with family and full luggage. The highway cruising comfort is top tier. The steering feedback weighs up nicely at triple-digit speeds and rough monsoon patches on NH48 were handled with absolute composure. 

Dealer service experience at Prerana Motors Bengaluru has improved significantly compared to Tata's reputation from 5 years ago. Only minor gripes are the fit and finish on the centre armrest latch and the touch HVAC controls which take eyes off the road. Overall, would I buy it again? Absolutely yes.`,
    replies: [
      {
        id: 'rep-1',
        author: 'Karan Sharma',
        authorBadge: 'Forum Veteran',
        authorCity: 'Pune, MH',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
        content: 'Spot on about the 6-speed torque converter! How is your brake pad wear at 28k km? Mine on the Harrier needed replacement around 32k km.',
        createdAt: '2 hours ago',
        upvotes: 18
      },
      {
        id: 'rep-2',
        author: 'Arun Varma',
        authorBadge: 'Verified Owner',
        authorCity: 'Kochi, KL',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80',
        content: 'Great review! Did you opt for the extended warranty up to 5 years? Tata EW gave me total peace of mind for the electronic parking brake and sunroof motors.',
        createdAt: '45 mins ago',
        upvotes: 9
      }
    ]
  },
  {
    id: 'thread-2',
    title: 'What to buy after Honda Amaze? Creta Turbo Petrol vs Seltos vs Grand Vitara Hybrid',
    category: 'What Car Next / Advice',
    brand: 'Hyundai',
    model: 'Creta / Seltos / Grand Vitara',
    author: 'Vikas Kulkarni',
    authorBadge: 'Senior Contributor',
    authorCity: 'Mumbai, MH',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80',
    createdAt: '5 hours ago',
    views: 3150,
    upvotes: 89,
    isHot: true,
    tags: ['CarAdvice', 'Budget20Lakh', 'MumbaiCommute', 'Upgrade'],
    content: `I have driven a 2017 Honda Amaze 1.2 i-VTEC manual for 85,000 km. Rock-solid reliability and low maintenance, but my daily commute from Thane to BKC (approx 52 km round trip) in Mumbai gridlock is killing my left knee. 

Budget is strictly ₹ 20 - 23 Lakh on-road. Need an automatic SUV with good back support, high ground clearance for Mumbai monsoons, and decent fuel efficiency.

Dilemma:
1. Hyundai Creta 1.5 Turbo DCT: Loaded, fast, but is DCT reliable in bumper-to-bumper Mumbai traffic?
2. Kia Seltos 1.5 Turbo DCT or Diesel AT: Gorgeous cabin, but is the suspension too stiff on lunar potholes?
3. Maruti Suzuki Grand Vitara Strong Hybrid: Mind-boggling 24 kmpl city efficiency, e-CVT durability, but boot space is small due to the battery pack.

What do fellow IAF members recommend?`,
    replies: [
      {
        id: 'rep-3',
        author: 'Deepak Joshi',
        authorBadge: 'Forum Veteran',
        authorCity: 'Mumbai, MH',
        avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=120&auto=format&fit=crop&q=80',
        content: 'For Thane to BKC daily crawl, avoid the DCT unless you want clutch overheating warnings on EEH in summer. Get either the Seltos Diesel Torque Converter or Grand Vitara Strong Hybrid. The e-CVT in the hybrid is bulletproof in traffic.',
        createdAt: '3 hours ago',
        upvotes: 34
      },
      {
        id: 'rep-4',
        author: 'Siddharth Roy',
        authorBadge: 'Verified Owner',
        authorCity: 'Delhi, DL',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
        content: 'Coming from a Honda naturally aspirated engine, you will love the low-end electric torque of Grand Vitara. Go take a test drive during rush hour and see the EV mode glide.',
        createdAt: '1 hour ago',
        upvotes: 12
      }
    ]
  },
  {
    id: 'thread-3',
    title: 'Delhi to Spiti Valley in a Mahindra Thar 4x4 Petrol AT: Route, Fuel Cost & Puncture Report',
    category: 'No-BS Trip Reports',
    brand: 'Mahindra',
    model: 'Thar LX Hard Top Petrol AT 4x4',
    author: 'Capt. Samarjit Dhillon',
    authorBadge: 'Verified Owner',
    authorCity: 'Chandigarh, PB',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop&q=80',
    createdAt: '1 day ago',
    views: 6980,
    upvotes: 278,
    isHot: true,
    tags: ['SpitiValley', 'Thar4x4', 'RoadTrip', 'HighAltitude', 'Travelogue'],
    tripDetails: {
      route: 'Delhi -> Shimla -> Kalpa -> Nako -> Kaza -> Chandratal -> Manali -> Delhi',
      distanceKm: 1820,
      durationDays: 8,
      fuelCost: '₹ 22,400 (Petrol @ ₹ 96.7/L avg)',
      tollCost: '₹ 1,840 (Fastag)',
      roadCondition: 'Challenging Ghats & Offroad',
      highlight: 'Water crossings at Malling Nala & Chhatru tackled with 4-Low engaged'
    },
    content: `Just returned from an unforgettable 8-day expedition through the Spiti circuit. The 2.0L mStallion Turbo Petrol Thar is a torque monster at 14,000 ft where naturally aspirated diesels choke for oxygen. 

Real-world fuel economy figures:
- Delhi to Shimla expressway: 11.2 km/l
- Reckong Peo to Kaza rocky climbs: 7.8 km/l
- Overall trip average: 8.9 km/l

Key takeaways for community members:
1. Fuel up fully at Kaza HP pump, it is the highest in the world and gets stock regularly now.
2. Carry a 12V tyre inflator and puncture repair kit. We had two rim bead pinches over loose slate stones near Losar.
3. Don't rush Chandratal to Gramphoo. Keep 6 hours in hand for the 55 km stretch of boulders.`,
    replies: [
      {
        id: 'rep-5',
        author: 'Naveen Choudhary',
        authorBadge: 'Senior Contributor',
        authorCity: 'Gurugram, HR',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
        content: 'Phenomenal report Captain! Did you carry jerry cans for extra petrol or was the tank range adequate?',
        createdAt: '18 hours ago',
        upvotes: 21
      }
    ]
  },
  {
    id: 'thread-4',
    title: 'Mahindra Scorpio N Z8L 4WD On-Road Price in Delhi vs Haryana: Detailed Invoice Breakdown & Savings',
    category: 'Real On-Road Prices',
    brand: 'Mahindra',
    model: 'Scorpio N Z8L Diesel 4WD AT',
    author: 'Amanpreet Singh',
    authorBadge: 'Verified Owner',
    authorCity: 'Gurugram, HR',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=120&auto=format&fit=crop&q=80',
    createdAt: '1 day ago',
    views: 5210,
    upvotes: 167,
    isHot: false,
    tags: ['PriceTransparency', 'ScorpioN', 'RTOBreakdown', 'InsuranceHacks'],
    priceReportDetails: {
      city: 'Delhi NCR (Gurugram vs Delhi)',
      variant: 'Z8L Diesel 4WD 7-Seater Automatic',
      exShowroom: '₹ 24,54,000',
      rtoTax: '₹ 2,45,400 (HR 10% slab)',
      insurance: '₹ 72,000 (negotiated down from dealer ₹ 1,18,000 quote with Bumper to Bumper + Engine Protect)',
      dealerDiscount: '₹ 45,000 corporate + festive discount',
      finalOnRoad: '₹ 27,62,000 (Saved ₹ 78,000 total)',
      waitingPeriod: 'Delivered in 18 days (allocated against cancelled booking)'
    },
    content: `Sharing my final tax invoice to help buyers in Delhi NCR avoid paying inflated dealer quotes:

Dealers will try to sneak in:
1. Dealer Logistics / Handling Charges of ₹ 15,000 (Illegal per Supreme Court ruling - got it removed).
2. Dealer-bundled insurance at ₹ 1.18 Lakh. Got a matching quote with identical policy wordings (Tata AIG 1+3 year, zero dep, RTI, engine protect, consumable cover) for ₹ 72,000, and dealer price-matched it!
3. Essential Accessory kit forced at ₹ 42,000. Selected only the 7D floor mats and mud flaps for ₹ 8,500.

Hope this helps anyone negotiating deliveries this month!`,
    replies: [
      {
        id: 'rep-6',
        author: 'Rajat Aggarwal',
        authorBadge: 'Community Moderator',
        authorCity: 'Faridabad, HR',
        avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=120&auto=format&fit=crop&q=80',
        content: 'Pinned this to the On-Road Price board. Removing the bogus "Handling Charges" alone saves 15k for buyers.',
        createdAt: '22 hours ago',
        upvotes: 45
      }
    ]
  },
  {
    id: 'thread-5',
    title: 'Royal Enfield Himalayan 450 - 10,000 km Real Owner Review: Vibrations, Sherpa Engine & Tubeless Rims',
    category: 'Bike Ownership Review',
    brand: 'Royal Enfield',
    model: 'Himalayan 450 Kamet White',
    author: 'Praveen Pillai',
    authorBadge: 'Verified Owner',
    authorCity: 'Thrissur, KL',
    avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=120&auto=format&fit=crop&q=80',
    createdAt: '2 days ago',
    views: 4120,
    upvotes: 198,
    isHot: true,
    tags: ['Himalayan450', 'RoyalEnfield', 'BikeReview', 'Sherpa450', 'Touring'],
    ownershipDetails: {
      kmDriven: 10200,
      mileage: '28.5 kmpl highway, 23.2 kmpl city',
      rating: 4.8,
      fuelType: 'Petrol',
      pros: [
        'Liquid-cooled Sherpa 450 engine loves to rev past 5000 RPM',
        'Showa 43mm USD forks swallow speed breakers effortlessly',
        'Google Maps integrated TFT console works seamlessly',
        'Tubeless spoke wheels finally available officially from RE'
      ],
      cons: [
        'Slight handlebar buzz between 4200 - 4800 RPM in 4th/5th gears',
        'Heavy 196 kg kerb weight when reversing into tight parking slots',
        'Stock CEAT tyres grip well in dry but average on wet slush'
      ],
      serviceCostYearly: '₹ 4,200 for 1st & 2nd free services'
    },
    content: `From Kerala to Dhanushkodi and Wayanad ghats, the new Himalayan 450 is a massive generational leap over the old air-cooled 411. The chassis balance is magical. You can flick this big ADV into corners with incredible confidence. 

The Showa suspension is undoubtedly the star of the show. Potholes on NH66 expansion work were simply ironed out. If you are doing long-distance touring in India, this bike is unbeatable under ₹ 3.5 Lakh on-road.`,
    replies: [
      {
        id: 'rep-7',
        author: 'Gautam Menon',
        authorBadge: 'Senior Contributor',
        authorCity: 'Chennai, TN',
        avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=120&auto=format&fit=crop&q=80',
        content: 'Did the recent ECU update from RE service smooth out the throttle response in 1st gear Eco mode? Mine feels much crisper now.',
        createdAt: '1 day ago',
        upvotes: 14
      }
    ]
  },
  {
    id: 'thread-6',
    title: 'DIY Brake Caliper Pin Greasing & Eliminating Front Wheel Rattles in Maruti Swift / Baleno',
    category: 'Technical & DIY',
    brand: 'Maruti Suzuki',
    model: 'Swift / Baleno / Dzire',
    author: 'Sunil Rao',
    authorBadge: 'Forum Veteran',
    authorCity: 'Hyderabad, TS',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
    createdAt: '3 days ago',
    views: 3840,
    upvotes: 115,
    isHot: false,
    tags: ['DIY', 'Maintenance', 'MarutiSwift', 'BrakeNoiseFix'],
    content: `Many Maruti Suzuki owners (Swift, Baleno, Dzire, Ertiga) report a metallic rattling noise over cobblestones or uneven pavers that immediately stops when you lightly press the brake pedal.

The root cause is dry caliper slider pins or worn rubber boots allowing the caliper bracket to vibrate. 

Quick DIY Guide:
1. Jack up the car and remove the front wheel safely on axle stands.
2. Unbolt the two 14mm caliper guide bolts.
3. Clean the old gummy grease from the slide pins with brake cleaner spray.
4. Apply high-temperature silicone brake lubricant (Permatex Ceramic Extreme or Liqui Moly Brake Anti-Squeal Paste). NEVER use petroleum grease as it deteriorates rubber boots.
5. Reinsert pins, test smooth sliding action, and torque bolts to 32 Nm.

Total cost: ₹ 350 for the grease packet. Took 45 minutes in my parking lot and the rattle is 100% eliminated!`,
    replies: [
      {
        id: 'rep-8',
        author: 'Mahesh G',
        authorBadge: 'Verified Owner',
        authorCity: 'Bengaluru, KA',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
        content: 'Can confirm this works! Maruti service center wanted to replace the entire caliper assembly for ₹ 4,800. Did this grease fix last week and silence restored.',
        createdAt: '2 days ago',
        upvotes: 29
      }
    ]
  }
];

export const REAL_PRICE_TICKER = [
  { model: 'Hyundai Creta SX (O) Turbo', city: 'Delhi', exShowroom: '₹ 20.0 Lakh', discount: '₹ 35,000', onRoad: '₹ 23.1 Lakh' },
  { model: 'Tata Nexon Fearless+ PR', city: 'Mumbai', exShowroom: '₹ 14.2 Lakh', discount: '₹ 50,000', onRoad: '₹ 16.4 Lakh' },
  { model: 'Mahindra XUV700 AX7L D AT', city: 'Bengaluru', exShowroom: '₹ 26.9 Lakh', discount: '₹ 70,000', onRoad: '₹ 33.2 Lakh' },
  { model: 'Maruti Grand Vitara Alpha Hybrid', city: 'Pune', exShowroom: '₹ 19.9 Lakh', discount: '₹ 60,000', onRoad: '₹ 22.8 Lakh' },
  { model: 'Royal Enfield Classic 350', city: 'Chennai', exShowroom: '₹ 2.2 Lakh', discount: '₹ 8,000', onRoad: '₹ 2.54 Lakh' }
];

export const COMMUNITY_STATS = {
  activeMembers: '45,280+',
  totalDiscussions: '18,450+',
  totalReplies: '96,200+',
  statesRepresented: '28 States & UTs',
};
