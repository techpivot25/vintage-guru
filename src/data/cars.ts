export interface CarVariant {
  name: string;
  price: string;
  specs: string;
}

export interface CarColor {
  name: string;
  hex: string;
}

export interface CarReview {
  id: number;
  user: string;
  rating: number;
  comment: string;
  date: string;
}

export interface CarNews {
  headline: string;
  date: string;
}

export interface SimilarCar {
  id: string;
  name: string;
  price: string;
  image: string;
}

export interface CityPriceInfo {
  city: string;
  price: string;
}

export interface CarData {
  id: string;
  name: string;
  make: string;
  priceRange: string;
  minPrice: number; // in Lakh
  maxPrice: number; // in Lakh
  exShowroom: string;
  image: string;
  description: string;
  fuelType: string;
  transmission: string;
  seatingCapacity: string;
  mileage: string;
  engine: string;
  power: string;
  torque: string;
  thingsToKnow: {
    title: string;
    text: string;
    image: string;
  }[];
  variants: CarVariant[];
  colors: CarColor[];
  news: CarNews[];
  reviews: CarReview[];
  similar: SimilarCar[];
  cityPrices: CityPriceInfo[];
}

export const INDIAN_POPULAR_CARS: CarData[] = [
  {
    id: "tata-punch",
    name: "Tata Punch",
    make: "Tata",
    priceRange: "₹ 6.13 - 10.20 Lakh",
    minPrice: 6.13,
    maxPrice: 10.20,
    exShowroom: "Rs. 6.13 Lakh onwards",
    image: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?q=80&w=800&auto=format&fit=crop", // Micro SUV style
    description: "The Tata Punch is a 5-seater micro SUV available in a price range of Rs. 6.13 Lakh - 10.20 Lakh. It is available in 29 variants, with an engine of 1199 cc, a choice of Manual & Automatic transmission, and CNG & Petrol options. The Punch has a ground clearance of 187 mm and has achieved a 5-star Global NCAP safety rating.",
    fuelType: "Petrol & CNG",
    transmission: "Manual & Automatic (AMT)",
    seatingCapacity: "5 Seater",
    mileage: "18.8 - 26.99 km/l",
    engine: "1199 cc, 3 Cylinders Inline",
    power: "87 bhp @ 6000 rpm",
    torque: "115 Nm @ 3250 rpm",
    thingsToKnow: [
      {
        title: "5-Star GNCAP Safety",
        text: "The Tata Punch has been awarded a full 5-star adult safety rating by Global NCAP, making it one of the safest compact cars in India.",
        image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=600&auto=format&fit=crop"
      },
      {
        title: "Micro SUV Ground Clearance",
        text: "Boasting 187mm of high ground clearance, the Punch negotiates Indian speed breakers and rough roads with utter ease.",
        image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=600&auto=format&fit=crop"
      },
      {
        title: "Dyna-Glide Suspension",
        text: "Equipped with advanced dual-path suspension that absorbs bumps beautifully, offering a stable and mature ride quality.",
        image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=600&auto=format&fit=crop"
      }
    ],
    variants: [
      { name: "Punch Pure MT", price: "₹ 6.13 Lakh", specs: "87 bhp, Petrol, Manual, 18.97 kmpl" },
      { name: "Punch Adventure MT", price: "₹ 7.00 Lakh", specs: "87 bhp, Petrol, Manual, 18.97 kmpl" },
      { name: "Punch Accomplished AMT", price: "₹ 8.35 Lakh", specs: "87 bhp, Petrol, Automatic, 18.82 kmpl" },
      { name: "Punch Creative Flagship AMT", price: "₹ 10.20 Lakh", specs: "87 bhp, Petrol, Automatic, 18.82 kmpl" }
    ],
    colors: [
      { name: "Tornado Blue", hex: "#1d3a5a" },
      { name: "Calypso Red", hex: "#a82020" },
      { name: "Atomic Orange", hex: "#d1641d" },
      { name: "Orcus White", hex: "#f0f2f5" },
      { name: "Meteor Bronze", hex: "#726555" }
    ],
    news: [
      { headline: "Tata Punch becomes India's best-selling car in first quarter of 2026", date: "22 May 2026" },
      { headline: "Tata Punch Accomplished Dazzle variant launched with sun-roof", date: "10 Apr 2026" },
      { headline: "Punch gets updated feature list with wireless charging and rear AC vents", date: "15 Jan 2026" }
    ],
    reviews: [
      { id: 1, user: "Rohan Sharma", rating: 5, comment: "Superb safety and solid build quality. Road presence is like a big SUV. Highly recommended for daily city drives and weekend getaways.", date: "12 May 2026" },
      { id: 2, user: "Meera Nair", rating: 4, comment: "Very spacious cabin with ample headroom. The engine could have been a bit more refined but fuel economy and comfort are top class.", date: "18 May 2026" }
    ],
    similar: [
      { id: "hyundai-exter", name: "Hyundai Exter", price: "₹ 6.13 Lakh onwards", image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=600&auto=format&fit=crop" },
      { id: "maruti-swift", name: "Maruti Swift", price: "₹ 6.49 Lakh onwards", image: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=600&auto=format&fit=crop" }
    ],
    cityPrices: [
      { city: "Delhi", price: "₹ 6.78 Lakh onwards" },
      { city: "Mumbai", price: "₹ 6.95 Lakh onwards" },
      { city: "Bangalore", price: "₹ 7.25 Lakh onwards" },
      { city: "Hyderabad", price: "₹ 7.12 Lakh onwards" }
    ]
  },
  {
    id: "maruti-swift",
    name: "Maruti Suzuki Swift",
    make: "Maruti Suzuki",
    priceRange: "₹ 6.49 - 9.64 Lakh",
    minPrice: 6.49,
    maxPrice: 9.64,
    exShowroom: "Rs. 6.49 Lakh onwards",
    image: "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?q=80&w=800&auto=format&fit=crop", // Swift style hatch
    description: "The Maruti Suzuki Swift is a highly popular 5-seater hatchback. It gets a brand-new Z-Series 1.2L 3-cylinder engine, designed to give ultra-high mileage and excellent city drivability. Known for its sporty handling, premium styling, and robust resale value across India.",
    fuelType: "Petrol & CNG",
    transmission: "Manual & Automatic (AMT)",
    seatingCapacity: "5 Seater",
    mileage: "24.8 - 25.75 km/l",
    engine: "1197 cc, 3 Cylinders (Z12E)",
    power: "80 bhp @ 5700 rpm",
    torque: "112 Nm @ 4300 rpm",
    thingsToKnow: [
      {
        title: "All-New Z-Series Engine",
        text: "The new 3-cylinder Z12E engine is optimized for outstanding low-end torque, perfect for seamless stop-and-go Indian traffic.",
        image: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?q=80&w=600&auto=format&fit=crop"
      },
      {
        title: "Phenomenal 25.75 kmpl Mileage",
        text: "The Swift remains the undisputed mileage king, delivering up to 25.75 km/l under standard test conditions, keeping your fuel bills ultra-low.",
        image: "https://images.unsplash.com/photo-1562591176-65be797bb1f0?q=80&w=600&auto=format&fit=crop"
      },
      {
        title: "Sporty Floating Cabin Design",
        text: "Includes a sleek, driver-oriented cockpit, a 9-inch SmartPlay Pro+ infotainment unit, and stylish contrast dual-tone colors.",
        image: "https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=600&auto=format&fit=crop"
      }
    ],
    variants: [
      { name: "Swift LXi MT", price: "₹ 6.49 Lakh", specs: "80 bhp, Petrol, Manual, 24.80 kmpl" },
      { name: "Swift VXi MT", price: "₹ 7.29 Lakh", specs: "80 bhp, Petrol, Manual, 24.80 kmpl" },
      { name: "Swift ZXi AMT", price: "₹ 8.79 Lakh", specs: "80 bhp, Petrol, Automatic, 25.75 kmpl" },
      { name: "Swift ZXi+ AMT Dual Tone", price: "₹ 9.64 Lakh", specs: "80 bhp, Petrol, Automatic, 25.75 kmpl" }
    ],
    colors: [
      { name: "Luster Blue", hex: "#1e5fa0" },
      { name: "Sizzling Red", hex: "#bd1825" },
      { name: "Splendid Silver", hex: "#c0c5cc" },
      { name: "Pearl Arctic White", hex: "#f5f6f8" },
      { name: "Novel Orange", hex: "#ea7c15" }
    ],
    news: [
      { headline: "New-generation Swift sweeps 5 major Car of the Year awards", date: "15 Jun 2026" },
      { headline: "Maruti Swift CNG launched starting at Rs. 8.19 lakh with 32.8 km/kg efficiency", date: "02 May 2026" },
      { headline: "Maruti rolls out discount of Rs. 25,000 on Swift accessory packages", date: "20 Mar 2026" }
    ],
    reviews: [
      { id: 1, user: "Anil Kapoor", rating: 5, comment: "I am getting 21 kmpl in heavy city traffic with my new Swift! The engine is incredibly quiet and the suspension is highly improved. Great build.", date: "14 May 2026" },
      { id: 2, user: "Shweta Tiwari", rating: 4, comment: "Very fun to drive and fits in tiny parking spots easily. The AMT is much smoother now. Highly recommend for city usage.", date: "09 May 2026" }
    ],
    similar: [
      { id: "tata-punch", name: "Tata Punch", price: "₹ 6.13 Lakh onwards", image: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?q=80&w=600&auto=format&fit=crop" },
      { id: "hyundai-exter", name: "Hyundai Exter", price: "₹ 6.13 Lakh onwards", image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=600&auto=format&fit=crop" }
    ],
    cityPrices: [
      { city: "Delhi", price: "₹ 7.20 Lakh onwards" },
      { city: "Mumbai", price: "₹ 7.35 Lakh onwards" },
      { city: "Bangalore", price: "₹ 7.68 Lakh onwards" },
      { city: "Hyderabad", price: "₹ 7.55 Lakh onwards" }
    ]
  },
  {
    id: "maruti-alto",
    name: "Maruti Suzuki Alto K10",
    make: "Maruti Suzuki",
    priceRange: "₹ 3.99 - 5.96 Lakh",
    minPrice: 3.99,
    maxPrice: 5.96,
    exShowroom: "Rs. 3.99 Lakh onwards",
    image: "https://images.unsplash.com/photo-1525609004556-c46c7d6cf0a3?q=80&w=800&auto=format&fit=crop", // Small hatchback placeholder
    description: "The Maruti Suzuki Alto K10 is the quintessential entry-level hatchback of India, powering millions of families. Driven by a punchy 1.0L Next-Gen K-Series engine, it is incredibly cheap to maintain, fits into any space, and boasts legendary fuel efficiency.",
    fuelType: "Petrol & CNG",
    transmission: "Manual & Automatic (AMT)",
    seatingCapacity: "5 Seater",
    mileage: "24.39 - 33.85 km/kg",
    engine: "998 cc, 3 Cylinders K10C",
    power: "66 bhp @ 5500 rpm",
    torque: "89 Nm @ 3500 rpm",
    thingsToKnow: [
      {
        title: "Punchy K10C Engine",
        text: "Features Dual Jet technology and idle start-stop system for effortless city overtaking and fuel preservation.",
        image: "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?q=80&w=600&auto=format&fit=crop"
      },
      {
        title: "Pocket-Friendly Maintenance",
        text: "With Maruti's extensive service network, maintaining an Alto K10 costs next to nothing, with spare parts available everywhere.",
        image: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=600&auto=format&fit=crop"
      }
    ],
    variants: [
      { name: "Alto K10 Std MT", price: "₹ 3.99 Lakh", specs: "66 bhp, Petrol, Manual, 24.39 kmpl" },
      { name: "Alto K10 VXi MT", price: "₹ 5.06 Lakh", specs: "66 bhp, Petrol, Manual, 24.39 kmpl" },
      { name: "Alto K10 VXi+ AMT", price: "₹ 5.85 Lakh", specs: "66 bhp, Petrol, Automatic, 24.90 kmpl" },
      { name: "Alto K10 LXi CNG", price: "₹ 5.96 Lakh", specs: "56 bhp, CNG, Manual, 33.85 km/kg" }
    ],
    colors: [
      { name: "Solid White", hex: "#fbfcfc" },
      { name: "Silky Silver", hex: "#d8dadc" },
      { name: "Sizzling Red", hex: "#b51b1b" },
      { name: "Speedy Blue", hex: "#1e62a2" }
    ],
    news: [
      { headline: "Alto K10 Dream Series Special Edition launched at Rs 4.99 Lakh", date: "10 Jun 2026" },
      { headline: "Maruti Suzuki celebrates 45 lakh Alto sales milestone in India", date: "24 Apr 2026" }
    ],
    reviews: [
      { id: 1, user: "Suresh Patil", rating: 5, comment: "Best budget car! Easy to drive in congested Mumbai streets. Excellent mileage and very low servicing cost.", date: "05 Jun 2026" },
      { id: 2, user: "Karan Johar", rating: 4, comment: "Extremely cost effective. AC is powerful. The suspension is a bit soft but perfectly fine for normal driving.", date: "18 May 2026" }
    ],
    similar: [
      { id: "renault-kwid", name: "Renault Kwid", price: "₹ 4.70 Lakh onwards", image: "https://images.unsplash.com/photo-1549416518-e3db9abded7b?q=80&w=600&auto=format&fit=crop" }
    ],
    cityPrices: [
      { city: "Delhi", price: "₹ 4.40 Lakh onwards" },
      { city: "Mumbai", price: "₹ 4.45 Lakh onwards" }
    ]
  },
  {
    id: "renault-kwid",
    name: "Renault Kwid",
    make: "Renault",
    priceRange: "₹ 4.70 - 6.45 Lakh",
    minPrice: 4.70,
    maxPrice: 6.45,
    exShowroom: "Rs. 4.70 Lakh onwards",
    image: "https://images.unsplash.com/photo-1532581699920-80ba4c95f0c7?q=80&w=800&auto=format&fit=crop", // Hatchback
    description: "The Renault Kwid is a stylish, SUV-inspired hatchback that redefined the entry-segment with its high-riding stance, robust body cladding, and large touchscreen infotainment system. Driven by an efficient 1.0L engine.",
    fuelType: "Petrol",
    transmission: "Manual & Automatic (AMT)",
    seatingCapacity: "5 Seater",
    mileage: "21.46 - 22.3 km/l",
    engine: "999 cc, 3 Cylinders SCe",
    power: "67 bhp @ 5500 rpm",
    torque: "91 Nm @ 4250 rpm",
    thingsToKnow: [
      {
        title: "SUV-inspired Design",
        text: "Features muscular front grille, skid plates, and robust side cladding that gives it an impressive road stance resembling a micro-SUV.",
        image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=600&auto=format&fit=crop"
      },
      {
        title: "Class-Leading Boot Space",
        text: "Comes with an incredible 279-litre boot, extendable up to 620 litres, allowing you to load large luggage comfortably.",
        image: "https://images.unsplash.com/photo-1562591176-65be797bb1f0?q=80&w=600&auto=format&fit=crop"
      }
    ],
    variants: [
      { name: "Kwid RXE 1.0L MT", price: "₹ 4.70 Lakh", specs: "67 bhp, Petrol, Manual, 21.46 kmpl" },
      { name: "Kwid RXL(O) 1.0L MT", price: "₹ 5.00 Lakh", specs: "67 bhp, Petrol, Manual, 21.46 kmpl" },
      { name: "Kwid RXT 1.0L AMT", price: "₹ 6.12 Lakh", specs: "67 bhp, Petrol, Automatic, 22.30 kmpl" },
      { name: "Kwid Climber 1.0L AMT", price: "₹ 6.45 Lakh", specs: "67 bhp, Petrol, Automatic, 22.30 kmpl" }
    ],
    colors: [
      { name: "Zanskar Blue", hex: "#1a4a75" },
      { name: "Fiery Red", hex: "#bc1f2c" },
      { name: "Metal Mustard", hex: "#dcb028" },
      { name: "Moonlight Silver", hex: "#cbced1" }
    ],
    news: [
      { headline: "Renault Kwid gets a brand new 8-inch digital cockpit upgrade", date: "12 May 2026" },
      { headline: "Renault rolls out heavy benefits up to Rs. 45,000 on Kwid lineup", date: "08 Apr 2026" }
    ],
    reviews: [
      { id: 1, user: "Vikram G", rating: 4, comment: "I love the aggressive design! Feels like driving a mini-SUV. The ground clearance is very useful for waterlogged roads.", date: "22 May 2026" },
      { id: 2, user: "Ridhi Sen", rating: 5, comment: "Superb value for money. Android Auto works flawlessly. Ride comfort is quite mature for this budget.", date: "11 May 2026" }
    ],
    similar: [
      { id: "maruti-alto", name: "Alto K10", price: "₹ 3.99 Lakh onwards", image: "https://images.unsplash.com/photo-1525609004556-c46c7d6cf0a3?q=80&w=600&auto=format&fit=crop" }
    ],
    cityPrices: [
      { city: "Delhi", price: "₹ 5.15 Lakh onwards" },
      { city: "Mumbai", price: "₹ 5.22 Lakh onwards" }
    ]
  },
  {
    id: "tata-nexon",
    name: "Tata Nexon",
    make: "Tata",
    priceRange: "₹ 8.00 - 15.80 Lakh",
    minPrice: 8.00,
    maxPrice: 15.80,
    exShowroom: "Rs. 8.00 Lakh onwards",
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=800&auto=format&fit=crop", // Compact SUV style
    description: "The Tata Nexon is one of India's top-selling compact SUVs. It features futuristic styling inspired by Land Rover elements, a high-tech cabin with a massive 10.25-inch screen, a full digital console, and class-defining Turbo Petrol and Diesel engines with DCT automatic transmissions.",
    fuelType: "Petrol, Diesel & Electric",
    transmission: "Manual, AMT, & DCA (Dual Clutch)",
    seatingCapacity: "5 Seater",
    mileage: "17.01 - 24.08 km/l",
    engine: "1199 cc Turbo Petrol / 1497 cc Turbo Diesel",
    power: "118 bhp @ 5500 rpm",
    torque: "170 Nm @ 1750-4000 rpm",
    thingsToKnow: [
      {
        title: "Futuristic 10.25-inch Curvv Cabin",
        text: "Comes with a brilliant touch dashboard, full-width LED lightbars with welcome/goodbye animation, and premium voice-assisted sunroof.",
        image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=600&auto=format&fit=crop"
      },
      {
        title: "5-Star Safety with 6 Airbags",
        text: "Built on rigid high-strength steel structure, offering six standard airbags, Electronic Stability Program, and ISOFIX child mounts.",
        image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=600&auto=format&fit=crop"
      }
    ],
    variants: [
      { name: "Nexon Smart 1.2L Petrol MT", price: "₹ 8.00 Lakh", specs: "118 bhp, Turbo Petrol, Manual, 17.44 kmpl" },
      { name: "Nexon Pure S 1.2L Petrol MT", price: "₹ 10.30 Lakh", specs: "118 bhp, Turbo Petrol, Manual, 17.44 kmpl" },
      { name: "Nexon Creative+ Petrol DCA", price: "₹ 12.30 Lakh", specs: "118 bhp, Turbo Petrol, Automatic (DCT), 17.01 kmpl" },
      { name: "Nexon Fearless+ S Diesel AMT", price: "₹ 14.70 Lakh", specs: "113 bhp, Turbo Diesel, Automatic, 24.08 kmpl" }
    ],
    colors: [
      { name: "Fearless Purple", hex: "#4b2f67" },
      { name: "Creative Ocean", hex: "#1e6d78" },
      { name: "Flame Red", hex: "#c11e22" },
      { name: "Pure Grey", hex: "#6c7277" },
      { name: "Calgary White", hex: "#f3f5f6" }
    ],
    news: [
      { headline: "Tata Nexon CNG launched with industry-first panoramic sunroof", date: "12 May 2026" },
      { headline: "Tata Nexon achieves 5-star GNCAP rating under new strict testing protocols", date: "22 Mar 2026" }
    ],
    reviews: [
      { id: 1, user: "Manish Malhotra", rating: 5, comment: "Absolutely brilliant car! The DCA (Dual Clutch) gearbox is super fast and smooth. Safety, styling and comfort are exceptional.", date: "20 May 2026" },
      { id: 2, user: "Anjali Gupta", rating: 4, comment: "Awesome ride quality. Ground clearance of 208mm means we don't have to worry about anything. Features are best-in-class.", date: "15 May 2026" }
    ],
    similar: [
      { id: "maruti-brezza", name: "Maruti Brezza", price: "₹ 8.34 Lakh onwards", image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=600&auto=format&fit=crop" },
      { id: "hyundai-creta", name: "Hyundai Creta", price: "₹ 11.00 Lakh onwards", image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=600&auto=format&fit=crop" }
    ],
    cityPrices: [
      { city: "Delhi", price: "₹ 9.10 Lakh onwards" },
      { city: "Mumbai", price: "₹ 9.25 Lakh onwards" },
      { city: "Bangalore", price: "₹ 9.75 Lakh onwards" }
    ]
  },
  {
    id: "hyundai-creta",
    name: "Hyundai Creta",
    make: "Hyundai",
    priceRange: "₹ 11.00 - 20.15 Lakh",
    minPrice: 11.00,
    maxPrice: 20.15,
    exShowroom: "Rs. 11.00 Lakh onwards",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=800&auto=format&fit=crop", // Midsize SUV
    description: "The undisputed king of mid-size SUVs in India, the Hyundai Creta is a benchmark of premium comfort, high-end technology, and sophisticated styling. It boasts Level 2 ADAS safety tech, a massive panoramic sunroof, dual 10.25-inch integrated screen displays, and phenomenal engine performance.",
    fuelType: "Petrol & Diesel",
    transmission: "Manual, IVT, Torque Converter & DCT",
    seatingCapacity: "5 Seater",
    mileage: "17.4 - 21.8 km/l",
    engine: "1497 cc Petrol / 1493 cc Turbo Diesel / 1482 cc Turbo Petrol",
    power: "158 bhp @ 5500 rpm",
    torque: "253 Nm @ 1500-3500 rpm",
    thingsToKnow: [
      {
        title: "Hyundai SmartSense Level 2 ADAS",
        text: "Equipped with 19 safety features including Smart Cruise Control, Forward Collision Warning, and Lane Keeping Assist.",
        image: "https://images.unsplash.com/photo-1562591176-65be797bb1f0?q=80&w=600&auto=format&fit=crop"
      },
      {
        title: "Sensuous Sportiness Design",
        text: "Features parametric jewel front grille, Horizon LED lightbars, and majestic sequential indicators that command heavy road attention.",
        image: "https://images.unsplash.com/photo-1549416518-e3db9abded7b?q=80&w=600&auto=format&fit=crop"
      }
    ],
    variants: [
      { name: "Creta E 1.5L Petrol MT", price: "₹ 11.00 Lakh", specs: "113 bhp, Petrol, Manual, 17.40 kmpl" },
      { name: "Creta EX 1.5L Petrol MT", price: "₹ 12.20 Lakh", specs: "113 bhp, Petrol, Manual, 17.40 kmpl" },
      { name: "Creta SX Tech 1.5L Diesel AT", price: "₹ 18.60 Lakh", specs: "113 bhp, Turbo Diesel, Automatic, 19.10 kmpl" },
      { name: "Creta SX(O) 1.5L Turbo Petrol DCT", price: "₹ 20.15 Lakh", specs: "158 bhp, Turbo Petrol, Automatic (DCT), 18.40 kmpl" }
    ],
    colors: [
      { name: "Emerald Marine", hex: "#114643" },
      { name: "Fiery Red", hex: "#ae171e" },
      { name: "Ranger Khaki", hex: "#606253" },
      { name: "Abyss Black", hex: "#111111" },
      { name: "Atlas White", hex: "#ededee" }
    ],
    news: [
      { headline: "Hyundai Creta bookings cross 1.5 lakh mark within 4 months of launch", date: "28 May 2026" },
      { headline: "Hyundai Creta EV spotted testing in Bangalore, launch expected in late 2026", date: "14 Apr 2026" }
    ],
    reviews: [
      { id: 1, user: "Devashish Sen", rating: 5, comment: "Unbelievable ride comfort and premium cabin! The Level 2 ADAS works extremely well on highways. Highly impressed by the fuel economy of the Diesel AT.", date: "24 May 2026" },
      { id: 2, user: "Sneha Reddy", rating: 5, comment: "Best family SUV in India, period. The panoramic sunroof is massive, sound system from Bose is fantastic, and seats are ventilated.", date: "15 May 2026" }
    ],
    similar: [
      { id: "kia-seltos", name: "Kia Seltos", price: "₹ 10.90 Lakh onwards", image: "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?q=80&w=600&auto=format&fit=crop" },
      { id: "mahindra-scorpio-n", name: "Mahindra Scorpio-N", price: "₹ 13.85 Lakh onwards", image: "https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=600&auto=format&fit=crop" }
    ],
    cityPrices: [
      { city: "Delhi", price: "₹ 12.80 Lakh onwards" },
      { city: "Mumbai", price: "₹ 12.95 Lakh onwards" },
      { city: "Bangalore", price: "₹ 13.60 Lakh onwards" }
    ]
  },
  {
    id: "mahindra-xuv700",
    name: "Mahindra XUV700",
    make: "Mahindra",
    priceRange: "₹ 13.99 - 26.99 Lakh",
    minPrice: 13.99,
    maxPrice: 26.99,
    exShowroom: "Rs. 13.99 Lakh onwards",
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=800&auto=format&fit=crop", // Majestic large SUV
    description: "The Mahindra XUV700 is a powerhouse 5 & 7-seater SUV that took the Indian market by storm. Packing class-leading mStallion Turbo Petrol and mHawk Diesel engines with up to 197bhp, an integrated dual HD superscreen panel, Alexa voice commands, and advanced ADAS.",
    fuelType: "Petrol & Diesel",
    transmission: "Manual & Automatic (Torque Converter) with AWD option",
    seatingCapacity: "5 & 7 Seater",
    mileage: "13.0 - 17.0 km/l",
    engine: "1999 cc Turbo Petrol / 2198 cc mHawk Turbo Diesel",
    power: "197 bhp @ 5000 rpm (Petrol)",
    torque: "380 Nm @ 1750-3000 rpm",
    thingsToKnow: [
      {
        title: "Unmatched 197bhp Performance",
        text: "The mStallion Turbo Petrol engine produces a mind-boggling 197bhp and 380Nm of torque, making it the most powerful vehicle in its segment.",
        image: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?q=80&w=600&auto=format&fit=crop"
      },
      {
        title: "Dual 10.25-inch HD Screens",
        text: "Comes with an absolute premium cockpit layout housing an integrated center screen and digital instrument binnacle side-by-side.",
        image: "https://images.unsplash.com/photo-1562591176-65be797bb1f0?q=80&w=600&auto=format&fit=crop"
      }
    ],
    variants: [
      { name: "XUV700 MX 5-Str Petrol MT", price: "₹ 13.99 Lakh", specs: "197 bhp, Petrol, Manual, 15.00 kmpl" },
      { name: "XUV700 AX5 7-Str Petrol MT", price: "₹ 17.69 Lakh", specs: "197 bhp, Petrol, Manual, 14.50 kmpl" },
      { name: "XUV700 AX7 7-Str Diesel AT", price: "₹ 23.09 Lakh", specs: "182 bhp, Diesel, Automatic, 16.57 kmpl" },
      { name: "XUV700 AX7 Luxury AWD Diesel AT", price: "₹ 26.99 Lakh", specs: "182 bhp, Diesel, Automatic, AWD, 16.57 kmpl" }
    ],
    colors: [
      { name: "Midnight Black", hex: "#0c0e15" },
      { name: "Everest White", hex: "#eff0f2" },
      { name: "Electric Blue", hex: "#164478" },
      { name: "Dazzling Silver", hex: "#bcc1c7" },
      { name: "Red Rage", hex: "#c41c22" }
    ],
    news: [
      { headline: "Mahindra launches updated XUV700 with ventilated front seats and memory mirrors", date: "18 May 2026" },
      { headline: "XUV700 completes 2 lakh unit production milestone in record time", date: "02 Apr 2026" }
    ],
    reviews: [
      { id: 1, user: "Abhay Deol", rating: 5, comment: "It drives like a luxury European car. Power delivery is absolutely explosive! The safety, ride stability, and comfort are outstanding.", date: "15 May 2026" },
      { id: 2, user: "Vicky Kushal", rating: 5, comment: "Mahindra has created a masterpiece. Incredible cabin space, gorgeous screens, and the AWD diesel is a beast on off-road terrain.", date: "10 May 2026" }
    ],
    similar: [
      { id: "tata-safari", name: "Tata Safari", price: "₹ 16.19 Lakh onwards", image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=600&auto=format&fit=crop" }
    ],
    cityPrices: [
      { city: "Delhi", price: "₹ 16.30 Lakh onwards" },
      { city: "Mumbai", price: "₹ 16.55 Lakh onwards" },
      { city: "Bangalore", price: "₹ 17.40 Lakh onwards" }
    ]
  },
  {
    id: "toyota-fortuner",
    name: "Toyota Fortuner",
    make: "Toyota",
    priceRange: "₹ 33.43 - 51.44 Lakh",
    minPrice: 33.43,
    maxPrice: 51.44,
    exShowroom: "Rs. 33.43 Lakh onwards",
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=800&auto=format&fit=crop", // Rugged giant SUV
    description: "The Toyota Fortuner is a legendary 7-seater full-size SUV. Renowned for its bulletproof reliability, brute force off-road capability, and massive street presence, it is the absolute status symbol SUV of India. It features a high-torque 2.8L diesel engine with an active 4x4 low range gearbox.",
    fuelType: "Petrol & Diesel",
    transmission: "Manual & Automatic (Torque Converter) with 4x2 & 4x4",
    seatingCapacity: "7 Seater",
    mileage: "10.0 - 14.4 km/l",
    engine: "2755 cc Diesel / 2694 cc Petrol",
    power: "201 bhp @ 3400 rpm (Diesel)",
    torque: "500 Nm @ 1600-2800 rpm (Automatic)",
    thingsToKnow: [
      {
        title: "Monstrous 500Nm Torque",
        text: "The 2.8L Toyota D-4D diesel motor puts down an incredible 500Nm of torque, allowing towing and recovery over extreme off-road terrain.",
        image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=600&auto=format&fit=crop"
      },
      {
        title: "Legendary 4x4 Low-Range Transfer Case",
        text: "Features electronic shift-on-the-fly 4WD, rear differential lock, and DAC (Downhill Assist Control) to negotiate rocks and deep mud.",
        image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=600&auto=format&fit=crop"
      }
    ],
    variants: [
      { name: "Fortuner 2.7L Petrol 4x2 MT", price: "₹ 33.43 Lakh", specs: "164 bhp, Petrol, Manual, 10.00 kmpl" },
      { name: "Fortuner 2.8L Diesel 4x2 AT", price: "₹ 38.21 Lakh", specs: "201 bhp, Diesel, Automatic, 14.40 kmpl" },
      { name: "Fortuner 2.8L Diesel 4x4 AT", price: "₹ 42.15 Lakh", specs: "201 bhp, Diesel, Automatic, 4x4, 14.22 kmpl" },
      { name: "Fortuner GR-Sport 4x4 AT", price: "₹ 51.44 Lakh", specs: "201 bhp, Diesel, Automatic, GR Suspension, 14.22 kmpl" }
    ],
    colors: [
      { name: "Phantom Brown", hex: "#433a35" },
      { name: "Attitude Black", hex: "#0a0a0b" },
      { name: "Grey Metallic", hex: "#7b7e80" },
      { name: "Super White", hex: "#fcfdfe" }
    ],
    news: [
      { headline: "Toyota Fortuner Mild-Hybrid Electric Vehicle (MHEV) launched in India", date: "15 May 2026" },
      { headline: "Toyota announces 3-month reduction in Fortuner wait times owing to expanded capacity", date: "29 Mar 2026" }
    ],
    reviews: [
      { id: 1, user: "Sanjay Dutt", rating: 5, comment: "Ultimate road presence. Absolutely nothing compares to a Fortuner on Indian roads. Servicing is hassle-free and resale value is literally 90% after years.", date: "10 May 2026" },
      { id: 2, user: "Yash Gowda", rating: 5, comment: "An absolute beast! Extremely reliable, we drove it across Ladakh without a single hiccup. Best rugged SUV ever made.", date: "05 May 2026" }
    ],
    similar: [
      { id: "mahindra-xuv700", name: "Mahindra XUV700", price: "₹ 13.99 Lakh onwards", image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=600&auto=format&fit=crop" }
    ],
    cityPrices: [
      { city: "Delhi", price: "₹ 38.60 Lakh onwards" },
      { city: "Mumbai", price: "₹ 39.10 Lakh onwards" },
      { city: "Bangalore", price: "₹ 41.50 Lakh onwards" }
    ]
  }
];
