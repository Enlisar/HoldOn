import type { BreakdownPoint, SustainableAlternative, TrueCostAnalysis, VerdictType } from './types';

export interface CategoryBenchmark {
  categoryKey: string;
  matchedKeywords: string[];
  displayName: string;
  avgLifespanMonths: number;
  lifespanDisplay: string;
  repairabilityScore: number; // 1 - 10
  repairabilityRating: 'Poor' | 'Fair' | 'Moderate' | 'Good' | 'Exceptional';
  resaleDepreciationRate: number; // 0.35 = keeps 35%
  co2FootprintKg: number;
  verdict: string;
  verdictType: VerdictType;
  summary: string;
  breakdown: BreakdownPoint[];
  alternatives: SustainableAlternative[];
}

export const CATEGORY_BENCHMARKS: CategoryBenchmark[] = [
  {
    categoryKey: 'earbuds',
    matchedKeywords: ['earbuds', 'airpods', 'tws', 'earphones', 'in-ear', 'buds', 'anc buds'],
    displayName: 'True Wireless Earbuds',
    avgLifespanMonths: 18,
    lifespanDisplay: '1.5 - 2 Years',
    repairabilityScore: 2,
    repairabilityRating: 'Poor',
    resaleDepreciationRate: 0.25,
    co2FootprintKg: 18.5,
    verdict: 'Glued enclosure • Non-replaceable micro-batteries • Premature obsolescence',
    verdictType: 'warning',
    summary: 'TWS earbuds are chemically sealed with strong industrial adhesive. Once the lithium-ion coin cell degrades after 400-500 charge cycles, the entire unit becomes unserviceable e-waste.',
    breakdown: [
      { label: 'Battery Replaceability', score: 1, status: 'poor', detail: 'Soldered and glued tight; cannot be replaced without destroying shell' },
      { label: 'Enclosure Access', score: 2, status: 'poor', detail: 'Requires heat gun and destructive prying' },
      { label: 'Spare Parts Availability', score: 3, status: 'poor', detail: 'OEMs do not sell individual replacement cells to consumers' },
      { label: 'Driver Durability', score: 6, status: 'average', detail: 'Drivers last long if acoustic mesh remains clean' },
    ],
    alternatives: [
      { name: 'Fairbuds Modular Wireless', brand: 'Fairphone', highlight: 'Tool-free replaceable battery in both earbuds and charging case', estPrice: 12999, repairScore: 9 },
      { name: 'Sony WH-1000XM4 (Over-Ear)', brand: 'Sony', highlight: 'Over-ear headphones last 5-7+ years with easily replaceable ear cushions and batteries', estPrice: 19990, repairScore: 7 },
    ],
  },
  {
    categoryKey: 'fast_fashion',
    matchedKeywords: ['hoodie', 'jacket', 't-shirt', 'tshirt', 'dress', 'jeans', 'sweater', 'sweatshirt', 'cardigan', 'coat', 'blazer', 'trousers', 'puffer'],
    displayName: 'Fast Fashion & Apparel',
    avgLifespanMonths: 10,
    lifespanDisplay: '8 - 14 Months',
    repairabilityScore: 4,
    repairabilityRating: 'Fair',
    resaleDepreciationRate: 0.15,
    co2FootprintKg: 24.0,
    verdict: 'Synthetic blend • Microplastic shedding • Rapid trend churn',
    verdictType: 'caution',
    summary: 'Mass-market apparel often blends virgin polyester and elastane, making textile recycling near-impossible. Seams frequently unravel after 15-20 wash cycles.',
    breakdown: [
      { label: 'Fabric Composition', score: 3, status: 'poor', detail: 'High synthetic content shedding microplastics' },
      { label: 'Seam & Stitch Integrity', score: 4, status: 'poor', detail: 'Single lockstitch prone to seam burst under tension' },
      { label: 'Mendability', score: 7, status: 'good', detail: 'Can be easily hand-darned, patched, or taken to a local tailor' },
      { label: 'Circular Recyclability', score: 2, status: 'poor', detail: 'Blended fibers cannot be separated mechanically' },
    ],
    alternatives: [
      { name: '100% GOTS Organic Cotton Heavyweight', brand: 'Local Khadi / Upcycled', highlight: 'Single-fiber pure cotton, zero microplastics, biodegrades naturally', estPrice: 1899, repairScore: 9 },
      { name: 'Pre-loved Vintage Denim / Outerwear', brand: 'Thrift Curators', highlight: 'Heavyweight heritage denim that actually looks better with age', estPrice: 999, repairScore: 8 },
    ],
  },
  {
    categoryKey: 'smartphone',
    matchedKeywords: ['phone', 'smartphone', 'iphone', 'galaxy', 'redmi', 'oneplus', 'pixel', 'realme', 'motorola', 'iqoo'],
    displayName: 'Smartphone',
    avgLifespanMonths: 36,
    lifespanDisplay: '3 - 4 Years',
    repairabilityScore: 5,
    repairabilityRating: 'Moderate',
    resaleDepreciationRate: 0.45,
    co2FootprintKg: 78.0,
    verdict: 'High embodied energy • Battery degrades in 2.5 yrs • Moderate repair network',
    verdictType: 'caution',
    summary: 'Over 80% of a smartphone\'s lifetime carbon emissions occur during manufacturing and rare-earth mining. Extending its life by just 1 year cuts lifecycle emissions by 30%.',
    breakdown: [
      { label: 'Screen Replaceability', score: 6, status: 'average', detail: 'Widely supported at independent shops, though OEM display locks exist' },
      { label: 'Battery Swappability', score: 5, status: 'average', detail: 'Requires pull tabs and disassembly; 1-hour job' },
      { label: 'Software Support', score: 7, status: 'good', detail: 'Current models guarantee 4 to 7 years of OS & security patches' },
      { label: 'Component Modularity', score: 4, status: 'poor', detail: 'Sub-boards and cameras often serial-paired to motherboard' },
    ],
    alternatives: [
      { name: 'Certified Refurbished Flagship', brand: 'Cashify / ReNew', highlight: 'Includes 1-year warranty, saves ~60kg CO2, 40-50% cheaper', estPrice: 28999, repairScore: 6 },
      { name: 'Fairphone 5 (5G)', brand: 'Fairphone', highlight: '10/10 iFixit score, 10 modular parts swappable with a Phillips screwdriver', estPrice: 54999, repairScore: 10 },
    ],
  },
  {
    categoryKey: 'laptop',
    matchedKeywords: ['laptop', 'notebook', 'macbook', 'thinkpad', 'zenbook', 'chromebook', 'ideapad', 'vivobook', 'pavilion'],
    displayName: 'Personal Laptop / Notebook',
    avgLifespanMonths: 48,
    lifespanDisplay: '4 - 6 Years',
    repairabilityScore: 6,
    repairabilityRating: 'Good',
    resaleDepreciationRate: 0.40,
    co2FootprintKg: 280.0,
    verdict: 'High resource intensity • Upgrade RAM/SSD to prolong life • Clean fans yearly',
    verdictType: 'neutral',
    summary: 'Laptops have a significant embodied manufacturing footprint. Modern slim ultrabooks increasingly solder RAM and SSDs, limiting future upgrades.',
    breakdown: [
      { label: 'RAM / Storage Upgrade', score: 5, status: 'average', detail: 'Depends on model: NVMe M.2 slots are often upgradable, RAM sometimes soldered' },
      { label: 'Battery Replacement', score: 7, status: 'good', detail: 'Internal screw-in battery pack easily swappable with basic screwdriver' },
      { label: 'Chassis & Hinge Durability', score: 6, status: 'average', detail: 'Check hinge anchors into metal rather than brittle plastic bosses' },
      { label: 'Thermal Maintenance', score: 8, status: 'good', detail: 'Repasting thermal compound every 2 years revives original speeds' },
    ],
    alternatives: [
      { name: 'Framework Laptop 13 / 16', brand: 'Framework', highlight: '100% user-repairable with modular swappable expansion cards', estPrice: 79999, repairScore: 10 },
      { name: 'Refurbished ThinkPad T-Series', brand: 'Lenovo / Enterprise Refurb', highlight: 'Legendary keyboard, MIL-STD durability, modular parts everywhere', estPrice: 26999, repairScore: 9 },
    ],
  },
  {
    categoryKey: 'power_tools',
    matchedKeywords: ['drill', 'power tool', 'saw', 'grinder', 'sander', 'screwdriver kit', 'wrench set', 'rotary tool', 'bosch drill'],
    displayName: 'Power Tools & Hardware',
    avgLifespanMonths: 120,
    lifespanDisplay: '8 - 12 Years',
    repairabilityScore: 8,
    repairabilityRating: 'Exceptional',
    resaleDepreciationRate: 0.55,
    co2FootprintKg: 42.0,
    verdict: 'High longevity • Average household uses drills < 15 mins total • Consider borrowing!',
    verdictType: 'caution',
    summary: 'Power tools are mechanically robust and easily repaired with replaceable brushes. However, the average drill is used for less than 13 minutes in its entire lifespan! Renting or borrowing from a local tool library is often the most economical choice.',
    breakdown: [
      { label: 'Motor & Carbon Brushes', score: 9, status: 'good', detail: 'Standard carbon brushes cost ₹150 and extend motor life by a decade' },
      { label: 'Gearbox Durability', score: 8, status: 'good', detail: 'All-metal planetary gears withstand high torque' },
      { label: 'Battery Compatibility', score: 6, status: 'average', detail: 'Check for standardized 18V tool battery platforms' },
      { label: 'Utilization Index', score: 2, status: 'poor', detail: 'Extremely low active usage in typical residential settings' },
    ],
    alternatives: [
      { name: 'Local Tool Library / Maker Space Rental', brand: 'Maker’s Collective', highlight: 'Rent industrial-grade hammer drills for ₹200/day without storage clutter', estPrice: 200, repairScore: 10 },
      { name: 'Bosch Professional Corded Hammer Drill', brand: 'Bosch', highlight: 'Corded models have no lithium pack to degrade, lasting 20+ years', estPrice: 3899, repairScore: 9 },
    ],
  },
  {
    categoryKey: 'kitchen_appliance',
    matchedKeywords: ['blender', 'mixer', 'juicer', 'grinder', 'toaster', 'air fryer', 'microwave', 'kettle', 'coffee machine', 'espresso'],
    displayName: 'Small Kitchen Appliance',
    avgLifespanMonths: 48,
    lifespanDisplay: '3 - 6 Years',
    repairabilityScore: 7,
    repairabilityRating: 'Good',
    resaleDepreciationRate: 0.30,
    co2FootprintKg: 35.0,
    verdict: 'Repairable coupler & blades • Readily available spare jars • Low resale demand',
    verdictType: 'neutral',
    summary: 'Mixer grinders and blenders generally fail at consumable points: nylon drive couplers, carbon brushes, and rubber lid gaskets. These cost ₹50-₹200 to fix at local hardware shops.',
    breakdown: [
      { label: 'Drive Coupler Serviceability', score: 9, status: 'good', detail: 'Rubber/nylon couplers are designed as sacrificial wear items' },
      { label: 'Motor Copper Winding', score: 7, status: 'good', detail: 'Heavy duty pure copper motors can be rewound locally' },
      { label: 'Jar & Blade Bush Replacement', score: 8, status: 'good', detail: 'Standard brass bushes are swappable at any neighbourhood repair shop' },
      { label: 'Electronic Control Board', score: 5, status: 'average', detail: 'Analog rotary knobs outlast touchscreens by 5x' },
    ],
    alternatives: [
      { name: 'Traditional Heavy Duty Copper Motor Mixer', brand: 'Preethi / Sujata', highlight: 'Overload protection fuse and widely available brass bush spares', estPrice: 4299, repairScore: 8 },
      { name: 'Manual French Press / AeroPress', brand: 'Hario / AeroPress', highlight: 'Zero electronic failure points; brew barista quality coffee forever', estPrice: 1999, repairScore: 10 },
    ],
  },
  {
    categoryKey: 'shoes',
    matchedKeywords: ['shoes', 'sneakers', 'running shoes', 'boots', 'sandals', 'loafers', 'crocs', 'slippers'],
    displayName: 'Footwear & Athletic Shoes',
    avgLifespanMonths: 18,
    lifespanDisplay: '1 - 2.5 Years',
    repairabilityScore: 4,
    repairabilityRating: 'Fair',
    resaleDepreciationRate: 0.20,
    co2FootprintKg: 14.0,
    verdict: 'EVA foam compression • Molded cemented sole • Cobbler can resole leather',
    verdictType: 'caution',
    summary: 'Modern running shoes rely on injected EVA or supercritical PEBA foam midsoles that lose their cushioning bounce after 500-800 km of running.',
    breakdown: [
      { label: 'Midsole Longevity', score: 4, status: 'poor', detail: 'Foam permanently compresses and loses shock absorption' },
      { label: 'Upper Durability', score: 6, status: 'average', detail: 'Knit mesh can develop toe-box holes' },
      { label: 'Sole Resolability', score: 3, status: 'poor', detail: 'Cemented unit sole cannot be replaced without custom molds' },
      { label: 'Cobbler Repairability', score: 6, status: 'average', detail: 'Heel counter and seam stitching easily repaired by cobblers' },
    ],
    alternatives: [
      { name: 'Goodyear Welted Leather Boots / Shoes', brand: 'Red Wing / Local Artisan', highlight: 'Stitched welt allows infinite sole replacements over decades', estPrice: 6999, repairScore: 9 },
      { name: 'Recycled Wool / Natural Rubber Walkers', brand: 'Allbirds / Wildcraft', highlight: 'Bio-based materials with machine-washable insoles', estPrice: 4499, repairScore: 7 },
    ],
  },
  {
    categoryKey: 'furniture',
    matchedKeywords: ['chair', 'desk', 'table', 'sofa', 'shelf', 'wardrobe', 'bed', 'cabinet', 'bookshelf', 'ergonomic chair'],
    displayName: 'Furniture & Ergonomics',
    avgLifespanMonths: 96,
    lifespanDisplay: '7 - 12 Years',
    repairabilityScore: 8,
    repairabilityRating: 'Exceptional',
    resaleDepreciationRate: 0.50,
    co2FootprintKg: 95.0,
    verdict: 'Solid mechanical build • Replaceable gas cylinders & casters • Excellent resale',
    verdictType: 'recommended',
    summary: 'Quality office and home furniture has stellar durability. Gas lift cylinders, tilt mechanisms, and casters use universal fittings that can be swapped in 10 minutes.',
    breakdown: [
      { label: 'Structural Frame', score: 9, status: 'good', detail: 'Reinforced nylon or aluminum base lasts decades' },
      { label: 'Gas Lift Cylinder', score: 8, status: 'good', detail: 'Class 4 gas lift is universally replaceable for ₹800' },
      { label: 'Casters & Wheels', score: 9, status: 'good', detail: 'Standard 11mm friction ring stem fits all replacement rollerblade wheels' },
      { label: 'Mesh / Cushion Reupholstery', score: 7, status: 'good', detail: 'Can be re-cushioned or recovered by local upholsterers' },
    ],
    alternatives: [
      { name: 'Refurbished Commercial Ergonomic Chair', brand: 'Steelcase / Herman Miller', highlight: 'Built for 24/7 call center abuse; 12-year structural warranty', estPrice: 24999, repairScore: 10 },
      { name: 'Featherlite / Godrej Mesh Task Chair', brand: 'Featherlite', highlight: 'Made in India with full nationwide spare parts network', estPrice: 8999, repairScore: 8 },
    ],
  },
  {
    categoryKey: 'smartwatch',
    matchedKeywords: ['smartwatch', 'apple watch', 'fitbit', 'galaxy watch', 'fitness tracker', 'smart band', 'noise watch', 'fireboltt', 'boat watch'],
    displayName: 'Smartwatch & Fitness Wearable',
    avgLifespanMonths: 24,
    lifespanDisplay: '2 - 3 Years',
    repairabilityScore: 3,
    repairabilityRating: 'Poor',
    resaleDepreciationRate: 0.25,
    co2FootprintKg: 16.0,
    verdict: 'Waterproof ultrasonic glue • Tiny non-replaceable battery • Fast software decay',
    verdictType: 'warning',
    summary: 'Waterproof ratings (5ATM/IP68) require sealed gaskets and UV adhesives. When the internal 200mAh pouch battery swells or loses capacity, replacing it usually shatters the OLED screen.',
    breakdown: [
      { label: 'Battery Replaceability', score: 2, status: 'poor', detail: 'Screen heat-lifting required; 80% breakage risk during service' },
      { label: 'Strap Replaceability', score: 9, status: 'good', detail: 'Standard 20mm/22mm quick-release pin straps are widely available' },
      { label: 'Software Updates', score: 4, status: 'poor', detail: 'Budget fitness bands stop receiving companion app updates in 18 months' },
      { label: 'Water Seal Recertification', score: 2, status: 'poor', detail: 'Water resistance cannot be guaranteed after opening' },
    ],
    alternatives: [
      { name: 'Solar Mechanical / Hybrid Watch', brand: 'Casio G-Shock Tough Solar / Citizen', highlight: 'Powers indefinitely via sunlight; battery lasts 15-20 years with zero e-waste', estPrice: 6999, repairScore: 9 },
      { name: 'Garmin Forerunner / Fenix', brand: 'Garmin', highlight: 'Transflective MIP display, 5+ years of endurance firmware, factory battery service', estPrice: 19990, repairScore: 7 },
    ],
  },
];

export function findCategoryBenchmark(title: string, categoryBreadcrumb: string = ''): CategoryBenchmark {
  const combined = (title + ' ' + categoryBreadcrumb).toLowerCase();

  for (const b of CATEGORY_BENCHMARKS) {
    if (b.matchedKeywords.some((kw) => combined.includes(kw))) {
      return b;
    }
  }

  // Generic fallback if unknown
  return {
    categoryKey: 'general_consumer_good',
    matchedKeywords: [],
    displayName: 'Consumer Product',
    avgLifespanMonths: 24,
    lifespanDisplay: '2 - 3 Years',
    repairabilityScore: 5,
    repairabilityRating: 'Moderate',
    resaleDepreciationRate: 0.35,
    co2FootprintKg: 25.0,
    verdict: 'Moderate durability • Review warranty & spare availability before buying',
    verdictType: 'neutral',
    summary: 'This product has average consumer durability. Consider checking whether replacement components and repair manuals are offered before purchasing.',
    breakdown: [
      { label: 'Component Serviceability', score: 5, status: 'average', detail: 'Standard fasteners; moderate disassembly complexity' },
      { label: 'Build & Material Quality', score: 5, status: 'average', detail: 'Standard consumer-grade casing and materials' },
      { label: 'Spare Parts Network', score: 5, status: 'average', detail: 'Check manufacturer service center availability' },
      { label: 'Lifespan Potential', score: 6, status: 'average', detail: 'Can last longer with mindful care and timely cleaning' },
    ],
    alternatives: [
      { name: 'Refurbished or Certified Pre-Owned Version', brand: 'Certified Resellers', highlight: 'Saves 30-50% on cost and avoids fresh manufacturing emissions', estPrice: 2499, repairScore: 7 },
    ],
  };
}

export function calculateTrueCost(
  title: string,
  price: number,
  currency: string = '₹',
  categoryBreadcrumb: string = ''
): TrueCostAnalysis {
  const benchmark = findCategoryBenchmark(title, categoryBreadcrumb);

  const cleanPrice = Math.max(1, price);
  const resaleValue1Yr = Math.round(cleanPrice * benchmark.resaleDepreciationRate);
  const resalePercentage = Math.round(benchmark.resaleDepreciationRate * 100);
  const costPerMonth = Math.round((cleanPrice / Math.max(1, benchmark.avgLifespanMonths)) * 10) / 10;
  
  // Estimate ~20 uses per month on average
  const estimatedTotalUses = Math.max(1, benchmark.avgLifespanMonths * 20);
  const costPerUse = Math.round((cleanPrice / estimatedTotalUses) * 10) / 10;

  return {
    productTitle: title,
    category: benchmark.displayName,
    originalPrice: cleanPrice,
    currency,
    estimatedLifespan: benchmark.lifespanDisplay,
    lifespanMonths: benchmark.avgLifespanMonths,
    repairabilityScore: benchmark.repairabilityScore,
    repairabilityRating: benchmark.repairabilityRating,
    resaleValue1Yr,
    resalePercentage,
    costPerMonth,
    costPerUse,
    co2FootprintKg: benchmark.co2FootprintKg,
    verdict: benchmark.verdict,
    verdictType: benchmark.verdictType,
    summary: benchmark.summary,
    breakdown: benchmark.breakdown,
    alternatives: benchmark.alternatives,
    source: 'intelligent-engine',
  };
}
