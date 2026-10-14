export interface HeritageVehicleSpec {
  label: string;
  value: string;
}

export interface HeritageVehicle {
  id: string;
  numericId: number;
  name: string;
  make: string;
  model: string;
  variant: string;
  vin: string;
  year: number;
  price: number;
  location: string;
  type: string; // "Car", "Two-Wheeler", "Truck"
  lat: number;
  lng: number;
  image: string;
  gallery: string[];
  odometer: string;
  engine: string;
  power: string;
  torque: string;
  transmission: string;
  fuelType: string;
  exteriorColor: string;
  interiorColor: string;
  condition: string;
  sellerName: string;
  sellerType: string;
  sellerEmail: string;
  sellerPhone: string;
  description: string;
  highlights: string[];
  specs: HeritageVehicleSpec[];
}

export const HERITAGE_VEHICLES: HeritageVehicle[] = [
  {
    id: "aston-martin-db5",
    numericId: 1,
    name: "1964 Aston Martin DB5",
    make: "Aston Martin",
    model: "DB5",
    variant: "Vantage",
    vin: "AMDB51964XYZ",
    year: 1964,
    price: 120000000,
    location: "London, UK",
    type: "Car",
    lat: 51.5074,
    lng: -0.1278,
    image: "https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=1200&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop"
    ],
    odometer: "38,450 miles",
    engine: "4.0L DOHC Straight-6 (Triple Weber Carburetors)",
    power: "325 bhp @ 5,500 rpm",
    torque: "390 Nm @ 4,500 rpm",
    transmission: "5-Speed ZF Manual",
    fuelType: "Petrol",
    exteriorColor: "Silver Birch",
    interiorColor: "Black Connolly Leather",
    condition: "Concours Class - Fully Restored",
    sellerName: "Royal Heritage Motors",
    sellerType: "Verified Collector & Dealer",
    sellerEmail: "concierge@royalheritagemotors.com",
    sellerPhone: "+44 20 7946 0912",
    description: "An icon of British automotive history and movie royalty. This 1964 Aston Martin DB5 Vantage is finished in original Silver Birch over immaculate Black Connolly leather upholstery. Powered by its factory matching-numbers 4.0-liter straight-six upgraded to Vantage specification with triple Weber 45 DCOE carburetors. Comes with British Motor Industry Heritage Trust Certificate, complete restoration binder with 300+ photos, and original fitted luggage.",
    highlights: [
      "Matching-numbers engine and chassis verified by BMIHT",
      "Complete nut-and-bolt restoration by Aston Martin specialist",
      "Factory 5-speed ZF manual transmission",
      "Chrome Borrani wire wheels with period Avon tires",
      "Includes original handbook and tool roll"
    ],
    specs: [
      { label: "Top Speed", value: "145 mph (233 km/h)" },
      { label: "0-60 mph", value: "8.0 seconds" },
      { label: "Curb Weight", value: "1,502 kg (3,311 lbs)" },
      { label: "Chassis Type", value: "Superleggera Tubular Frame" },
      { label: "Brakes", value: "Girling 4-Wheel Power Disc Brakes" }
    ]
  },
  {
    id: "vespa-150-vl1",
    numericId: 2,
    name: "1955 Vespa 150 VL1",
    make: "Vespa",
    model: "150 VL1",
    variant: "Standard Struzzo",
    vin: "VVL1T1955ABC",
    year: 1955,
    price: 1200000,
    location: "Rome, Italy",
    type: "Two-Wheeler",
    lat: 41.9028,
    lng: 12.4964,
    image: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=1200&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1525160354320-d8e92641c563?q=80&w=1200&auto=format&fit=crop"
    ],
    odometer: "12,100 km",
    engine: "145.6cc 2-Stroke Single Cylinder",
    power: "5.4 bhp @ 5,000 rpm",
    torque: "8.5 Nm @ 3,500 rpm",
    transmission: "3-Speed Manual Hand-Shift",
    fuelType: "Petrol (2-Stroke Mix)",
    exteriorColor: "Metallic Gray-Green",
    interiorColor: "Dark Brown Leather Saddle",
    condition: "Museum Quality - Original Preservation",
    sellerName: "Scuderia Classica Roma",
    sellerType: "Italian Vintage Specialist",
    sellerEmail: "roma@scuderiaclassica.it",
    sellerPhone: "+39 06 6987 1234",
    description: "The famous VL1 'Struzzo' introduced the handlebar-mounted headlight to the Vespa lineup. This pristine 1955 model was stored in a dry Tuscan estate for four decades before a sympathetic mechanical refresh. Retains original Piaggio emblems, split leather saddles, dual chrome rims, and Lazio period license plates.",
    highlights: [
      "First-generation handlebar headlight Struzzo model",
      "Italian ASI Gold Certificate of Authenticity",
      "Original sheet metal bodywork with zero corrosion",
      "Period accessories including rear spare wheel holder and luggage rack",
      "Matching frame and engine stampings (VVL1T)"
    ],
    specs: [
      { label: "Top Speed", value: "75 km/h (47 mph)" },
      { label: "Fuel Economy", value: "35 km/L" },
      { label: "Weight", value: "85 kg (187 lbs)" },
      { label: "Electrical System", value: "6V Flywheel Magneto" }
    ]
  },
  {
    id: "chevrolet-c10-1972",
    numericId: 3,
    name: "1972 Chevrolet C10",
    make: "Chevrolet",
    model: "C10",
    variant: "Custom Deluxe Short Bed",
    vin: "CCE142S123456",
    year: 1972,
    price: 3500000,
    location: "Texas, USA",
    type: "Truck",
    lat: 31.9686,
    lng: -99.9018,
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1200&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=1200&auto=format&fit=crop"
    ],
    odometer: "54,200 miles",
    engine: "350 cu in (5.7L) Small Block V8",
    power: "250 bhp @ 4,400 rpm",
    torque: "475 Nm @ 2,400 rpm",
    transmission: "TH350 3-Speed Automatic",
    fuelType: "Petrol",
    exteriorColor: "Medium Blue / White Two-Tone",
    interiorColor: "Blue Houndstooth Bench",
    condition: "Resto-Mod / Driver Quality",
    sellerName: "Lone Star Classics",
    sellerType: "Vintage Truck Dealer",
    sellerEmail: "sales@lonestarclassics.com",
    sellerPhone: "+1 512 555 0192",
    description: "The highly desirable 1972 final year of the Action-Line Chevrolet trucks. Features factory power disc brakes, power steering, and upgraded Vintage Air conditioning. The 350 V8 runs smoothly with Edelbrock intake and quadrajet carburetor. Finished in crisp two-tone Blue and White over a fresh houndstooth interior with genuine polished oak bed floor.",
    highlights: [
      "1972 final year model with factory front disc brakes",
      "Real Oak wood bed floor with stainless steel runners",
      "Vintage Air conditioning blowing ice cold",
      "Original SPID glovebox option sticker intact",
      "Flowmaster dual exhaust system with aggressive V8 rumble"
    ],
    specs: [
      { label: "Drivetrain", value: "Rear-Wheel Drive (2WD)" },
      { label: "Suspension", value: "Front Independent Coil / Rear Coil Springs" },
      { label: "Brakes", value: "Power Front Disc / Rear Drum" },
      { label: "Wheelbase", value: "115 inches (Short Bed)" }
    ]
  },
  {
    id: "jaguar-etype-1969",
    numericId: 4,
    name: "1969 Jaguar E-Type",
    make: "Jaguar",
    model: "E-Type",
    variant: "Series 2 Roadster",
    vin: "1R12345",
    year: 1969,
    price: 15500000,
    location: "New York, USA",
    type: "Car",
    lat: 40.7128,
    lng: -74.0060,
    image: "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?q=80&w=1200&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop"
    ],
    odometer: "29,800 miles",
    engine: "4.2L XK DOHC Inline 6-Cylinder",
    power: "246 bhp @ 5,500 rpm",
    torque: "356 Nm @ 3,000 rpm",
    transmission: "4-Speed Synchromesh Manual",
    fuelType: "Petrol",
    exteriorColor: "British Racing Green",
    interiorColor: "Biscuit Tan Leather",
    condition: "Excellent Survivor - Fully Certified",
    sellerName: "Gotham Classic Autos",
    sellerType: "Certified Vintage Dealer",
    sellerEmail: "info@gothamclassics.com",
    sellerPhone: "+1 212 555 0144",
    description: "An undeniable automotive masterpiece. This 1969 Jaguar E-Type Series 2 Roadster combines British Racing Green paintwork with a luxurious Biscuit Tan leather cabin. Features the potent 4.2L engine, upgraded high-capacity radiator, power-assisted brakes, and factory detachable hardtop. Fully documented with Jaguar Heritage Trust Certificate.",
    highlights: [
      "Jaguar Heritage Trust Certificate verifying matching frame and body",
      "Chrome 72-spoke wire wheels with knock-off center caps",
      "Includes both soft top canvas canopy and rare hardtop shell",
      "Freshly serviced cooling and braking systems",
      "Original Smiths instruments and wooden steering wheel"
    ],
    specs: [
      { label: "Top Speed", value: "150 mph (241 km/h)" },
      { label: "0-60 mph", value: "6.8 seconds" },
      { label: "Weight", value: "1,315 kg (2,899 lbs)" },
      { label: "Chassis", value: "Monocoque with Tubular Front Frame" }
    ]
  },
  {
    id: "mercedes-300sl-1957",
    numericId: 5,
    name: "1957 Mercedes-Benz 300 SL",
    make: "Mercedes-Benz",
    model: "300 SL",
    variant: "Gullwing Coupe",
    vin: "1980401957M",
    year: 1957,
    price: 185000000,
    location: "Stuttgart, Germany",
    type: "Car",
    lat: 48.7758,
    lng: 9.1829,
    image: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=1200&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=1200&auto=format&fit=crop"
    ],
    odometer: "24,100 km",
    engine: "3.0L M198 SOHC Inline-6 (Direct Injection)",
    power: "240 bhp @ 6,100 rpm",
    torque: "294 Nm @ 4,800 rpm",
    transmission: "4-Speed Manual",
    fuelType: "Petrol",
    exteriorColor: "Silver Grey Metallic (DB180)",
    interiorColor: "Red Tartan Leather",
    condition: "Concours Masterpiece - Mercedes Classic Certified",
    sellerName: "Heritage Stars Stuttgart",
    sellerType: "Museum & Collector Concierge",
    sellerEmail: "classic@heritagestars.de",
    sellerPhone: "+49 711 555 0188",
    description: "The ultimate 1950s supercar. The 300 SL Gullwing introduced direct fuel injection and tubular spaceframe construction. Inspected and certified by Mercedes-Benz Classic in Fellbach, Germany. Features original Rudge knock-off wheels, sports camshaft, original Becker radio, and custom fitted red leather luggage.",
    highlights: [
      "Mercedes-Benz Classic Data Card & Provenance Inspection",
      "Factory original roof-hinged Gullwing doors",
      "Bosch mechanical direct fuel injection",
      "Rudge knock-off wheels with continental whitewall tires",
      "Matching numbers engine, transmission, and differential"
    ],
    specs: [
      { label: "Top Speed", value: "260 km/h (161 mph)" },
      { label: "0-100 km/h", value: "8.8 seconds" },
      { label: "Weight", value: "1,295 kg (2,855 lbs)" },
      { label: "Frame", value: "Tubular Spaceframe (Steel)" }
    ]
  },
  {
    id: "ford-shelby-gt500-1967",
    numericId: 6,
    name: "1967 Ford Mustang GT500",
    make: "Ford",
    model: "Mustang Shelby",
    variant: "GT500 Fastback",
    vin: "7R02Q12345",
    year: 1967,
    price: 22000000,
    location: "California, USA",
    type: "Car",
    lat: 34.0522,
    lng: -118.2437,
    image: "https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?q=80&w=1200&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=1200&auto=format&fit=crop"
    ],
    odometer: "41,200 miles",
    engine: "428 cu in (7.0L) Cobra Le Mans V8",
    power: "355 bhp @ 5,400 rpm",
    torque: "569 Nm @ 3,200 rpm",
    transmission: "4-Speed Toploader Manual",
    fuelType: "Petrol",
    exteriorColor: "Wimbledon White / Guardsman Blue",
    interiorColor: "Black Deluxe Vinyl",
    condition: "Pristine Restoration - Marti Verified",
    sellerName: "Pacific Muscle & Classics",
    sellerType: "Shelby & Muscle Specialist",
    sellerEmail: "info@pacificmuscle.com",
    sellerPhone: "+1 310 555 0199",
    description: "Carroll Shelby's high-performance legend. The 1967 GT500 introduced the twin-carb 428 Cobra V8, aggressive fiberglass front nose cone, hood scoops, and functional side brake ducts. Documented in the Official Shelby World Registry and backed by Elite Marti Report.",
    highlights: [
      "Documented in the Official Shelby World Registry",
      "Elite Marti Report included confirming factory options",
      "Dual 600 CFM Holley 4-barrel carburetors",
      "10-spoke Shelby aluminum wheels with Goodyear Speedway tires",
      "Integrated roll bar with inertia-reel shoulder harnesses"
    ],
    specs: [
      { label: "Top Speed", value: "132 mph (212 km/h)" },
      { label: "0-60 mph", value: "6.2 seconds" },
      { label: "Differential", value: "3.50:1 Traction-Lok Rear Axle" },
      { label: "Brakes", value: "Front Power Disc / Rear Drum" }
    ]
  },
  {
    id: "hyundai-elite-i20-2017",
    numericId: 7,
    name: "2017 Hyundai Elite i20 Asta 1.2",
    make: "Hyundai",
    model: "Elite i20",
    variant: "Asta 1.2 Petrol",
    vin: "MALC1234567890NOIDA",
    year: 2017,
    price: 525000,
    location: "Noida, Uttar Pradesh, India",
    type: "Car",
    lat: 28.5355,
    lng: 77.3910,
    image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c46f?q=80&w=1200&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1541899481282-d53bffe3c46f?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=1200&auto=format&fit=crop"
    ],
    odometer: "42,500 km",
    engine: "1.2L Kappa VTVT Petrol",
    power: "82 bhp @ 6,000 rpm",
    torque: "115 Nm @ 4,000 rpm",
    transmission: "5-Speed Manual",
    fuelType: "Petrol",
    exteriorColor: "Star Dust Gray",
    interiorColor: "Dual-Tone Beige & Black",
    condition: "CARS24 Certified 140-Point Pass",
    sellerName: "CARS24 Hub Noida Sec 63",
    sellerType: "Verified Certified Dealer",
    sellerEmail: "noida.hub@cars24.com",
    sellerPhone: "1800 258 5656",
    description: "Single owner, non-accidental 2017 Hyundai Elite i20 Asta 1.2 Petrol in pristine condition. Passes 140-point CARS24 Quality Inspection with zero mechanical or electrical faults. Equipped with touchscreen infotainment, reverse parking camera, push-button start, alloy wheels, and dual airbags. Includes 1-year warranty and 7-day money back guarantee.",
    highlights: [
      "140-Point CARS24 Quality Certificate (Rating 4.9/5)",
      "1st Owner, non-accidental with original factory paint",
      "1-Year Warranty & 7-Day Money Back Guarantee included",
      "Zero Down Payment EMI options starting at ₹8,500/month",
      "Complete service history recorded at Hyundai authorized center"
    ],
    specs: [
      { label: "Registration State", value: "UP-16 (Noida RTO)" },
      { label: "Ownership", value: "1st Owner" },
      { label: "Insurance", value: "Zero-Depreciation valid till Nov 2026" },
      { label: "Spare Keys", value: "2 Keys Available" },
      { label: "Mileage / Economy", value: "18.6 kmpl" }
    ]
  },
  {
    id: "maruti-suzuki-brezza-2024",
    numericId: 8,
    name: "2024 Maruti Suzuki Brezza ZXi",
    make: "Maruti Suzuki",
    model: "Brezza",
    variant: "ZXi 1.5 Smart Hybrid",
    vin: "MA3F1234567890NEW",
    year: 2024,
    price: 1125000,
    location: "New Delhi, India",
    type: "Car",
    lat: 28.6139,
    lng: 77.2090,
    image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=1200&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=1200&auto=format&fit=crop"
    ],
    odometer: "0 km (Brand New)",
    engine: "1.5L K15C Smart Hybrid Petrol",
    power: "102 bhp @ 6,000 rpm",
    torque: "136.8 Nm @ 4,400 rpm",
    transmission: "6-Speed Automatic Torque Converter",
    fuelType: "Petrol",
    exteriorColor: "Sizzling Red with Midnight Black Roof",
    interiorColor: "Dual-Tone Black & Brown",
    condition: "Brand New Factory Direct",
    sellerName: "NEXA / Arena Authorized Dealer",
    sellerType: "New Car Official Partner",
    sellerEmail: "sales@marutisuzuki.com",
    sellerPhone: "1800 102 1800",
    description: "India's favorite compact SUV. The 2024 Maruti Suzuki Brezza ZXi comes equipped with an electric sunroof, 9-inch SmartPlay Pro+ touchscreen, 360-degree camera, wireless Apple CarPlay/Android Auto, paddle shifters, and 6 airbags. High fuel efficiency backed by Maruti's unmatched reliability and country-wide service network.",
    highlights: [
      "Electric Sunroof with Tilt & Anti-Pinch",
      "Head-Up Display (HUD) & 360 View HD Camera",
      "ARAI Certified Mileage: 19.80 kmpl",
      "ESP with Hill Hold Assist & 6 Airbags",
      "0 Down Payment & On-Road Price Financing Available"
    ],
    specs: [
      { label: "Seating Capacity", value: "5 Seater" },
      { label: "Fuel Tank", value: "48 Litres" },
      { label: "Boot Space", value: "328 Litres" },
      { label: "Ground Clearance", value: "198 mm" },
      { label: "Warranty", value: "3 Years / 100,000 km Factory Warranty" }
    ]
  },
  {
    id: "maruti-suzuki-swift-2024",
    numericId: 9,
    name: "2024 Maruti Suzuki Swift ZXi+",
    make: "Maruti Suzuki",
    model: "Swift",
    variant: "ZXi Plus Dual Tone",
    vin: "MA3S9876543210NEW",
    year: 2024,
    price: 895000,
    location: "Gurugram, Haryana, India",
    type: "Car",
    lat: 28.4595,
    lng: 77.0266,
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?q=80&w=1200&auto=format&fit=crop"
    ],
    odometer: "0 km (Brand New)",
    engine: "1.2L Z-Series 3-Cylinder Petrol",
    power: "80.4 bhp @ 5,700 rpm",
    torque: "111.7 Nm @ 4,300 rpm",
    transmission: "5-Speed AMT / Manual",
    fuelType: "Petrol",
    exteriorColor: "Luster Blue with Black Roof",
    interiorColor: "Sporty All-Black",
    condition: "Brand New Factory Direct",
    sellerName: "Maruti Suzuki Arena Hub",
    sellerType: "New Car Official Partner",
    sellerEmail: "swift@marutisuzuki.com",
    sellerPhone: "1800 102 1800",
    description: "All-New 4th Generation Maruti Suzuki Swift. Features brand new Z-Series ultra-efficient engine delivering exceptional mileage of 25.75 kmpl. Includes 9-inch SmartPlay Pro+ display, LED projector headlamps with DRLs, wireless phone charger, Suzuki Connect telemetry, and 6 standard airbags across all variants.",
    highlights: [
      "All-New Z12E 1.2L Engine with 25.75 kmpl Mileage",
      "Standard 6 Airbags, ABS with EBD & Hill Hold Control",
      "9-inch HD Touchscreen with Wireless Android Auto / Apple CarPlay",
      "Rear AC Vents & Fast Type-C USB Charging Ports",
      "Special Festival Cashback & Exchange Bonus Eligible"
    ],
    specs: [
      { label: "Seating Capacity", value: "5 Seater" },
      { label: "Mileage", value: "25.75 kmpl (ARAI)" },
      { label: "Boot Space", value: "265 Litres" },
      { label: "Turning Radius", value: "4.8 metres" },
      { label: "Warranty", value: "3 Years / 100,000 km Standard Warranty" }
    ]
  },
  {
    id: "maruti-suzuki-grand-vitara-2024",
    numericId: 10,
    name: "2024 Maruti Suzuki Grand Vitara Alpha+",
    make: "Maruti Suzuki",
    model: "Grand Vitara",
    variant: "Alpha+ Strong Hybrid",
    vin: "MA3G5554443322NEW",
    year: 2024,
    price: 1980000,
    location: "Mumbai, Maharashtra, India",
    type: "Car",
    lat: 19.0760,
    lng: 72.8777,
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=1200&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=1200&auto=format&fit=crop"
    ],
    odometer: "0 km (Brand New)",
    engine: "1.5L Intelligent Electric Hybrid",
    power: "114.4 bhp Combined",
    torque: "141 Nm @ 4,000 rpm",
    transmission: "e-CVT Automatic",
    fuelType: "Hybrid",
    exteriorColor: "Arctic White with Black Roof",
    interiorColor: "Bordeaux & Black Leatherette",
    condition: "Brand New Factory Direct",
    sellerName: "NEXA Premium Pavilion",
    sellerType: "New Car Official Partner",
    sellerEmail: "nexa@marutisuzuki.com",
    sellerPhone: "1800 102 6392",
    description: "Flagship hybrid SUV from Maruti Suzuki NEXA. Features Toyota-sourced Intelligent Electric Hybrid technology giving 27.97 kmpl fuel efficiency. Panoramic sunroof, ventilated front seats, digital driver display, head-up display, wireless charging, and ALLGRIP AWD option.",
    highlights: [
      "Intelligent Electric Hybrid with 27.97 kmpl Segment Best Mileage",
      "Panoramic Sunroof & Ventilated Leatherette Front Seats",
      "Fully Digital 7-inch TFT Instrument Cluster",
      "EV Driving Mode for silent zero-emission city commuting",
      "NEXA Safety Shield with 6 Airbags, ESP & Hill Descent Control"
    ],
    specs: [
      { label: "Seating Capacity", value: "5 Seater" },
      { label: "Mileage", value: "27.97 kmpl (ARAI)" },
      { label: "Drive System", value: "Front-Wheel Drive / ALLGRIP 4WD" },
      { label: "Battery", value: "Lithium-ion Self-Charging Battery" },
      { label: "Warranty", value: "8 Years / 160,000 km Hybrid Battery Warranty" }
    ]
  },
  {
    id: "tata-nexon-2024",
    numericId: 11,
    name: "2024 Tata Nexon Fearless+",
    make: "Tata",
    model: "Nexon",
    variant: "Fearless+ S 1.2 Turbo Petrol",
    vin: "MATT1122334455NEW",
    year: 2024,
    price: 1350000,
    location: "Bengaluru, Karnataka, India",
    type: "Car",
    lat: 12.9716,
    lng: 77.5946,
    image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c46f?q=80&w=1200&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1541899481282-d53bffe3c46f?q=80&w=1200&auto=format&fit=crop"
    ],
    odometer: "0 km (Brand New)",
    engine: "1.2L Revotron Turbocharged Petrol",
    power: "118.2 bhp @ 5,500 rpm",
    torque: "170 Nm @ 1,750 rpm",
    transmission: "7-Speed DCA Dual-Clutch Automatic",
    fuelType: "Petrol",
    exteriorColor: "Fearless Purple",
    interiorColor: "Purplish Black Premium Leatherette",
    condition: "Brand New Factory Direct",
    sellerName: "Tata Motors Authorized Hub",
    sellerType: "New Car Official Partner",
    sellerEmail: "sales@tatamotors.com",
    sellerPhone: "1800 209 8282",
    description: "5-Star Global NCAP safety rated SUV. The 2024 Tata Nexon Fearless+ features a Futuristic 10.25-inch Cinematic Touchscreen by HARMAN, 10.25-inch Digital Instrument Cluster with full Navigation map mirroring, JBL 9-Speaker Audio system with Subwoofer, Ventilated Seats, and Voice-Assisted Sunroof.",
    highlights: [
      "5-Star Global NCAP Safety Rating & 6 Airbags Standard",
      "10.25-inch Floating HD Touchscreen & JBL 9-Speaker System",
      "7-Speed Wet Clutch DCA Automatic Transmission",
      "Sequential LED DRLs & Animated Tail Lamps",
      "On-Road Price Finance with 100% Ex-Showroom Funding"
    ],
    specs: [
      { label: "Seating Capacity", value: "5 Seater" },
      { label: "Boot Space", value: "350 Litres" },
      { label: "Ground Clearance", value: "208 mm" },
      { label: "Audio System", value: "JBL Premium 9 Speakers with Subwoofer" },
      { label: "Warranty", value: "3 Years / 100,000 km Warranty" }
    ]
  },
  {
    id: "mahindra-thar-2024",
    numericId: 12,
    name: "2024 Mahindra Thar LX 4WD",
    make: "Mahindra",
    model: "Thar",
    variant: "LX Hard Top Diesel 4x4",
    vin: "MAHM4455667788NEW",
    year: 2024,
    price: 1680000,
    location: "Chandigarh, India",
    type: "Car",
    lat: 30.7333,
    lng: 76.7794,
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1200&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1200&auto=format&fit=crop"
    ],
    odometer: "0 km (Brand New)",
    engine: "2.2L mHawk 130 Turbo Diesel",
    power: "130 bhp @ 3,750 rpm",
    torque: "300 Nm @ 1,600 rpm",
    transmission: "6-Speed Torque Converter Automatic",
    fuelType: "Diesel",
    exteriorColor: "Napoli Black",
    interiorColor: "Durable All-Black Off-Road Spec",
    condition: "Brand New Factory Direct",
    sellerName: "Mahindra Auto Pavilion",
    sellerType: "New Car Official Partner",
    sellerEmail: "customercare@mahindra.com",
    sellerPhone: "1800 209 6006",
    description: "The ultimate off-road icon. Mahindra Thar LX Hard Top Diesel 4x4 comes equipped with mechanical locking differential, low-range transfer case, 18-inch alloy wheels, touchscreen infotainment with Adventure Statistics, roll cage, and removable doors. Built for extreme terrain and urban presence.",
    highlights: [
      "Authentic 4x4 Shift-On-Fly Transfer Case & Mechanical Locking Rear Diff",
      "18-inch Deep Silver Alloy Wheels with All-Terrain Tires",
      "Touchscreen Infotainment with Off-Road Telemetry Gauges",
      "IP54 Washable Interior & Roof-Mounted Weatherproof Speakers",
      "4-Star Global NCAP Safety Rating"
    ],
    specs: [
      { label: "Water Wading", value: "650 mm Capacity" },
      { label: "Approach Angle", value: "41.2 Degrees" },
      { label: "Departure Angle", value: "36.0 Degrees" },
      { label: "Ground Clearance", value: "226 mm" },
      { label: "Warranty", value: "3 Years / Unlimited Km Factory Warranty" }
    ]
  },
  {
    id: "toyota-fortuner-2024",
    numericId: 13,
    name: "2024 Toyota Fortuner Legender 4x4",
    make: "Toyota",
    model: "Fortuner",
    variant: "Legender 2.8 Diesel 4x4 AT",
    vin: "TOYF9988776655NEW",
    year: 2024,
    price: 4950000,
    location: "Noida / NCR, India",
    type: "Car",
    lat: 28.5355,
    lng: 77.3910,
    image: "https://images.unsplash.com/photo-1549416518-e3db9abded7b?q=80&w=1200&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1549416518-e3db9abded7b?q=80&w=1200&auto=format&fit=crop"
    ],
    odometer: "0 km (Brand New)",
    engine: "2.8L 4-Cylinder Turbocharged Diesel",
    power: "201.15 bhp @ 3,000 rpm",
    torque: "500 Nm @ 1,600 rpm",
    transmission: "6-Speed Automatic with Sequential Shift & Paddle Shifters",
    fuelType: "Diesel",
    exteriorColor: "Dual Tone White Pearl Crystal Shine with Black Roof",
    interiorColor: "Dual-Tone Black & Maroon Leather",
    condition: "Brand New Factory Direct",
    sellerName: "Toyota Bharat Dealer Network",
    sellerType: "New Car Official Partner",
    sellerEmail: "voc@toyota-kirloskar.co.in",
    sellerPhone: "1800 425 0001",
    description: "The undisputed king of full-size SUVs in India. Toyota Fortuner Legender features a sharp aggressive front bumper, Catamaran-style quad-LED headlights, sequential turn indicators, kick-sensor powered tailgate, 11-speaker JBL sound system, wireless charging, ventilated front seats, and bulletproof Toyota durability.",
    highlights: [
      "Massive 500 Nm Torque with 201 bhp 2.8L Turbo Diesel",
      "Aggressive Legender Styling with Quad-LED Headlamps",
      "JBL Premium 11-Speaker Audio System with Subwoofer",
      "Electronic Drive Control 4x4 with High/Low Range",
      "Unmatched Resale Value & Toyota QDR Reliability"
    ],
    specs: [
      { label: "Seating Capacity", value: "7 Seater" },
      { label: "Wheelbase", value: "2,745 mm" },
      { label: "Ground Clearance", value: "225 mm" },
      { label: "Towing Capacity", value: "3,100 kg" },
      { label: "Warranty", value: "3 Years / 100,000 km Extendable to 5 Years" }
    ]
  }
];

