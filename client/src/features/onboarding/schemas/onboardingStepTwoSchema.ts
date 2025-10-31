import { z } from 'zod';

export const onboardingStepTwoSchema = z.object({
  location: z
    .string()
    .min(1, 'Location is required')
    .min(2, 'Location must be at least 2 characters')
    .trim(),
  school: z
    .string()
    .min(1, 'School is required')
    .min(2, 'School must be at least 2 characters')
    .max(100, 'School must be less than 100 characters')
    .trim(),
  program: z
    .string()
    .min(1, 'Program/Track is required')
    .min(2, 'Program/Track must be at least 2 characters')
    .max(100, 'Program/Track must be less than 100 characters')
    .trim(),
  aboutMe: z
    .string()
    .max(30, 'About me must be 30 characters or less')
    .optional()
    .or(z.literal('')),
});

export type OnboardingStepTwoFormData = z.infer<typeof onboardingStepTwoSchema>;

// Philippine Locations Data
export const philippineLocations = [
  // Metro Manila
  { value: 'manila', label: 'Manila, Metro Manila' },
  { value: 'quezon-city', label: 'Quezon City, Metro Manila' },
  { value: 'makati', label: 'Makati, Metro Manila' },
  { value: 'taguig', label: 'Taguig, Metro Manila' },
  { value: 'pasig', label: 'Pasig, Metro Manila' },
  { value: 'mandaluyong', label: 'Mandaluyong, Metro Manila' },
  { value: 'pasay', label: 'Pasay, Metro Manila' },
  { value: 'paranaque', label: 'Parañaque, Metro Manila' },
  { value: 'las-pinas', label: 'Las Piñas, Metro Manila' },
  { value: 'muntinlupa', label: 'Muntinlupa, Metro Manila' },
  { value: 'caloocan', label: 'Caloocan, Metro Manila' },
  { value: 'malabon', label: 'Malabon, Metro Manila' },
  { value: 'navotas', label: 'Navotas, Metro Manila' },
  { value: 'valenzuela', label: 'Valenzuela, Metro Manila' },
  { value: 'marikina', label: 'Marikina, Metro Manila' },
  { value: 'san-juan', label: 'San Juan, Metro Manila' },
  { value: 'pateros', label: 'Pateros, Metro Manila' },
  // Luzon
  { value: 'baguio', label: 'Baguio City, Benguet' },
  { value: 'dagupan', label: 'Dagupan City, Pangasinan' },
  { value: 'san-fernando-la-union', label: 'San Fernando, La Union' },
  { value: 'laoag', label: 'Laoag City, Ilocos Norte' },
  { value: 'vigan', label: 'Vigan City, Ilocos Sur' },
  { value: 'tuguegarao', label: 'Tuguegarao City, Cagayan' },
  { value: 'santiago', label: 'Santiago City, Isabela' },
  { value: 'cabanatuan', label: 'Cabanatuan City, Nueva Ecija' },
  { value: 'olongapo', label: 'Olongapo City, Zambales' },
  { value: 'angeles', label: 'Angeles City, Pampanga' },
  { value: 'san-fernando-pampanga', label: 'San Fernando, Pampanga' },
  { value: 'malolos', label: 'Malolos City, Bulacan' },
  { value: 'antipolo', label: 'Antipolo City, Rizal' },
  { value: 'batangas-city', label: 'Batangas City, Batangas' },
  { value: 'lipa', label: 'Lipa City, Batangas' },
  { value: 'lucena', label: 'Lucena City, Quezon' },
  { value: 'santa-rosa', label: 'Santa Rosa City, Laguna' },
  { value: 'calamba', label: 'Calamba City, Laguna' },
  { value: 'binan', label: 'Biñan City, Laguna' },
  { value: 'bacoor', label: 'Bacoor City, Cavite' },
  { value: 'imus', label: 'Imus City, Cavite' },
  { value: 'dasmarinas', label: 'Dasmariñas City, Cavite' },
  { value: 'tagaytay', label: 'Tagaytay City, Cavite' },
  { value: 'naga', label: 'Naga City, Camarines Sur' },
  { value: 'legazpi', label: 'Legazpi City, Albay' },
  // Visayas
  { value: 'cebu-city', label: 'Cebu City, Cebu' },
  { value: 'mandaue', label: 'Mandaue City, Cebu' },
  { value: 'lapu-lapu', label: 'Lapu-Lapu City, Cebu' },
  { value: 'iloilo-city', label: 'Iloilo City, Iloilo' },
  { value: 'bacolod', label: 'Bacolod City, Negros Occidental' },
  { value: 'dumaguete', label: 'Dumaguete City, Negros Oriental' },
  { value: 'tacloban', label: 'Tacloban City, Leyte' },
  { value: 'roxas', label: 'Roxas City, Capiz' },
  { value: 'tagbilaran', label: 'Tagbilaran City, Bohol' },
  // Mindanao
  { value: 'davao-city', label: 'Davao City, Davao del Sur' },
  { value: 'cagayan-de-oro', label: 'Cagayan de Oro City, Misamis Oriental' },
  { value: 'zamboanga-city', label: 'Zamboanga City, Zamboanga del Sur' },
  { value: 'general-santos', label: 'General Santos City, South Cotabato' },
  { value: 'butuan', label: 'Butuan City, Agusan del Norte' },
  { value: 'iligan', label: 'Iligan City, Lanao del Norte' },
];

// Philippine Schools Data
export const philippineSchools = [
  // Metro Manila - Top Universities
  { value: 'up-diliman', label: 'University of the Philippines Diliman' },
  { value: 'ateneo', label: 'Ateneo de Manila University' },
  { value: 'dlsu', label: 'De La Salle University' },
  { value: 'ust', label: 'University of Santo Tomas' },
  { value: 'adamson', label: 'Adamson University' },
  { value: 'feu', label: 'Far Eastern University' },
  { value: 'mapua', label: 'Mapua University' },
  { value: 'plm', label: 'Pamantasan ng Lungsod ng Maynila' },
  { value: 'pup', label: 'Polytechnic University of the Philippines' },
  { value: 'tup', label: 'Technological University of the Philippines' },
  { value: 'miriam', label: 'Miriam College' },
  { value: 'ceu', label: 'Centro Escolar University' },
  { value: 'ua&p', label: 'University of Asia and the Pacific' },
  { value: 'enderun', label: 'Enderun Colleges' },
  { value: 'benilde', label: 'De La Salle-College of Saint Benilde' },
  { value: 'assumption', label: 'Assumption College' },
  { value: 'sfc', label: 'San Francisco College' },
  { value: 'slu-manila', label: 'Saint Louis University - Manila' },
  { value: 'national-u', label: 'National University' },
  { value: 'ue', label: 'University of the East' },
  { value: 'nu-manila', label: 'National University Manila' },
  { value: 'pwu', label: 'Philippine Women\'s University' },
  { value: 'arellano', label: 'Arellano University' },
  { value: 'letran', label: 'Colegio de San Juan de Letran' },
  { value: 'san-beda', label: 'San Beda University' },
  { value: 'ama', label: 'AMA University' },
  { value: 'sti', label: 'STI College' },
  // Luzon
  { value: 'slu-baguio', label: 'Saint Louis University - Baguio' },
  { value: 'up-baguio', label: 'University of the Philippines Baguio' },
  { value: 'psu', label: 'Pangasinan State University' },
  { value: 'mmsu', label: 'Mariano Marcos State University' },
  { value: 'isu', label: 'Isabela State University' },
  { value: 'clsu', label: 'Central Luzon State University' },
  { value: 'holy-angel', label: 'Holy Angel University' },
  { value: 'bulacan-state', label: 'Bulacan State University' },
  { value: 'up-los-banos', label: 'University of the Philippines Los Baños' },
  { value: 'batangas-state', label: 'Batangas State University' },
  { value: 'bicol-u', label: 'Bicol University' },
  { value: 'ateneo-naga', label: 'Ateneo de Naga University' },
  // Visayas
  { value: 'usc', label: 'University of San Carlos' },
  { value: 'up-cebu', label: 'University of the Philippines Cebu' },
  { value: 'uv', label: 'University of the Visayas' },
  { value: 'cit-u', label: 'Cebu Institute of Technology - University' },
  { value: 'up-visayas', label: 'University of the Philippines Visayas' },
  { value: 'wvsu', label: 'West Visayas State University' },
  { value: 'cpu', label: 'Central Philippine University' },
  { value: 'siliman', label: 'Silliman University' },
  { value: 'vsu', label: 'Visayas State University' },
  // Mindanao
  { value: 'up-mindanao', label: 'University of the Philippines Mindanao' },
  { value: 'ateneo-davao', label: 'Ateneo de Davao University' },
  { value: 'usep', label: 'University of Southeastern Philippines' },
  { value: 'xavier', label: 'Xavier University - Ateneo de Cagayan' },
  { value: 'msu-iit', label: 'Mindanao State University - Iligan Institute of Technology' },
  { value: 'wmsu', label: 'Western Mindanao State University' },
  { value: 'ndmu', label: 'Notre Dame of Marbel University' },
];

// Education Programs Data
export const educationPrograms = [
  // K-12 Tracks
  { value: 'stem', label: 'STEM (Science, Technology, Engineering, Mathematics)' },
  { value: 'abm', label: 'ABM (Accountancy, Business and Management)' },
  { value: 'humss', label: 'HUMSS (Humanities and Social Sciences)' },
  { value: 'gas', label: 'GAS (General Academic Strand)' },
  { value: 'tvl-ict', label: 'TVL - ICT (Information and Communications Technology)' },
  { value: 'tvl-he', label: 'TVL - Home Economics' },
  { value: 'tvl-ia', label: 'TVL - Industrial Arts' },
  { value: 'tvl-agri', label: 'TVL - Agri-Fishery Arts' },
  { value: 'arts-design', label: 'Arts and Design Track' },
  { value: 'sports', label: 'Sports Track' },
  // Engineering
  { value: 'bs-ce', label: 'BS Civil Engineering' },
  { value: 'bs-ee', label: 'BS Electrical Engineering' },
  { value: 'bs-ece', label: 'BS Electronics and Communications Engineering' },
  { value: 'bs-me', label: 'BS Mechanical Engineering' },
  { value: 'bs-ie', label: 'BS Industrial Engineering' },
  { value: 'bs-cpe', label: 'BS Computer Engineering' },
  { value: 'bs-che', label: 'BS Chemical Engineering' },
  // Computer Science & IT
  { value: 'bs-cs', label: 'BS Computer Science' },
  { value: 'bs-it', label: 'BS Information Technology' },
  { value: 'bs-is', label: 'BS Information Systems' },
  // Business & Management
  { value: 'bs-accountancy', label: 'BS Accountancy' },
  { value: 'bs-ba', label: 'BS Business Administration' },
  { value: 'bs-entrep', label: 'BS Entrepreneurship' },
  { value: 'bs-management', label: 'BS Management' },
  { value: 'bs-marketing', label: 'BS Marketing' },
  { value: 'bs-hrm', label: 'BS Human Resource Management' },
  { value: 'bs-hospitality', label: 'BS Hospitality Management' },
  { value: 'bs-tourism', label: 'BS Tourism Management' },
  // Health Sciences
  { value: 'bs-nursing', label: 'BS Nursing' },
  { value: 'bs-pharmacy', label: 'BS Pharmacy' },
  { value: 'bs-pt', label: 'BS Physical Therapy' },
  { value: 'bs-medtech', label: 'BS Medical Technology' },
  { value: 'bs-nutrition', label: 'BS Nutrition and Dietetics' },
  { value: 'bs-psychology', label: 'BS Psychology' },
  // Education
  { value: 'bsed', label: 'BS Secondary Education' },
  { value: 'beed', label: 'BS Elementary Education' },
  { value: 'bpe', label: 'BS Physical Education' },
  // Arts & Sciences
  { value: 'ba-comm', label: 'BA Communication' },
  { value: 'ba-polsci', label: 'BA Political Science' },
  { value: 'ba-psych', label: 'BA Psychology' },
  { value: 'ba-english', label: 'BA English' },
  { value: 'ba-history', label: 'BA History' },
  { value: 'bs-bio', label: 'BS Biology' },
  { value: 'bs-chem', label: 'BS Chemistry' },
  { value: 'bs-physics', label: 'BS Physics' },
  { value: 'bs-math', label: 'BS Mathematics' },
  // Architecture & Design
  { value: 'bs-arch', label: 'BS Architecture' },
  { value: 'bs-id', label: 'BS Interior Design' },
  { value: 'fine-arts', label: 'Bachelor of Fine Arts' },
  { value: 'multimedia-arts', label: 'BS Multimedia Arts' },
];
