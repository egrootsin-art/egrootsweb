export const productCategories = [
  {
    id: '3d-printing',
    name: '3D Printing Kits',
    description: 'Complete 3D printing solutions for makers and educators'
  },
  {
    id: 'pcb-design',
    name: 'PCB Design Services', 
    description: 'Professional PCB design and prototyping services'
  },
  {
    id: 'educational-kits',
    name: 'Educational Electronics Kits',
    description: 'Learning kits for students and hobbyists'
  },
  {
    id: 'competition-robots',
    name: 'Competition Robots',
    description: 'Ready-to-compete robotics platforms'
  }
];

export const products = [
  // 3D Printing Kits
  {
    id: '3dp-001',
    name: 'E-Groots Starter 3D Printer',
    category: '3d-printing',
    price: 15999,
    originalPrice: 18999,
    image: '/api/placeholder/400/300',
    description: 'Perfect entry-level 3D printer with auto-leveling and easy setup.',
    rating: 4.5,
    reviews: 128,
    inStock: true,
    stock: 25,
    specs: {
      'Build Volume': '220 x 220 x 250mm',
      'Layer Resolution': '0.1-0.3mm',
      'Filament': '1.75mm PLA/ABS',
      'Connectivity': 'USB, SD Card, WiFi'
    }
  },
  {
    id: '3dp-002',
    name: 'Pro Max 3D Printer Kit',
    category: '3d-printing',
    price: 45999,
    originalPrice: 52999,
    image: '/api/placeholder/400/300',
    description: 'Advanced 3D printer with dual extruders and enclosed build chamber.',
    rating: 4.8,
    reviews: 89,
    inStock: true,
    stock: 12,
    specs: {
      'Build Volume': '300 x 300 x 400mm',
      'Layer Resolution': '0.05-0.4mm',
      'Filament': '1.75mm Multiple Materials',
      'Features': 'Dual Extruder, Heated Enclosure'
    }
  },

  // PCB Design Services
  {
    id: 'pcb-001',
    name: 'Custom PCB Design - Basic',
    category: 'pcb-design',
    price: 2999,
    originalPrice: 3999,
    image: '/api/placeholder/400/300',
    description: 'Professional PCB design service for simple circuits (up to 2 layers).',
    rating: 4.9,
    reviews: 56,
    inStock: true,
    stock: 0, // Service
    specs: {
      'Layers': 'Up to 2 layers',
      'Components': 'Up to 50 components',
      'Delivery': '5-7 business days',
      'Includes': 'Schematic, PCB layout, Gerber files'
    }
  },
  {
    id: 'pcb-002',
    name: 'Advanced PCB Design Package',
    category: 'pcb-design',
    price: 8999,
    originalPrice: 11999,
    image: '/api/placeholder/400/300',
    description: 'Complex multi-layer PCB design with signal integrity analysis.',
    rating: 4.7,
    reviews: 34,
    inStock: true,
    stock: 0, // Service
    specs: {
      'Layers': 'Up to 8 layers',
      'Components': 'Up to 200 components',
      'Delivery': '10-14 business days',
      'Includes': 'Full design package + testing'
    }
  },

  // Educational Electronics Kits
  {
    id: 'edu-001',
    name: 'Arduino Starter Kit Pro',
    category: 'educational-kits',
    price: 3499,
    originalPrice: 4299,
    image: '/api/placeholder/400/300',
    description: 'Complete Arduino learning kit with 30+ sensors and components.',
    rating: 4.6,
    reviews: 234,
    inStock: true,
    stock: 45,
    specs: {
      'Components': '30+ sensors and modules',
      'Board': 'Arduino Uno R3 compatible',
      'Projects': '25 guided projects',
      'Age Group': '12+ years'
    }
  },
  {
    id: 'edu-002',
    name: 'Raspberry Pi Learning Kit',
    category: 'educational-kits',
    price: 5999,
    originalPrice: 7499,
    image: '/api/placeholder/400/300',
    description: 'Comprehensive Raspberry Pi kit for programming and IoT projects.',
    rating: 4.4,
    reviews: 167,
    inStock: true,
    stock: 28,
    specs: {
      'Board': 'Raspberry Pi 4B 4GB',
      'Components': 'Camera, sensors, LCD, GPIO kit',
      'Storage': '32GB MicroSD card',
      'Book': 'Python programming guide'
    }
  },

  // Competition Robots
  {
    id: 'robot-001',
    name: 'RoboChamp Competition Bot',
    category: 'competition-robots',
    price: 25999,
    originalPrice: 29999,
    image: '/api/placeholder/400/300',
    description: 'Ready-to-compete robot for robotics competitions and hackathons.',
    rating: 4.8,
    reviews: 45,
    inStock: true,
    stock: 8,
    specs: {
      'Controller': 'Advanced ARM processor',
      'Sensors': 'Ultrasonic, gyro, color, touch',
      'Motors': '4x high-torque servo motors',
      'Programming': 'Scratch, Python, C++'
    }
  },
  {
    id: 'robot-002',
    name: 'AI Robot Development Platform',
    category: 'competition-robots',
    price: 89999,
    originalPrice: 109999,
    image: '/api/placeholder/400/300',
    description: 'Advanced AI-powered robot platform for research and competition.',
    rating: 4.9,
    reviews: 23,
    inStock: true,
    stock: 3,
    specs: {
      'AI Chip': 'NVIDIA Jetson Nano',
      'Camera': '4K stereo vision system',
      'Mobility': 'Omnidirectional wheels',
      'Connectivity': 'WiFi, Bluetooth, 4G'
    }
  }
];

export const featuredProducts = products.slice(0, 4);

export const getProductsByCategory = (categoryId) => {
  return products.filter(product => product.category === categoryId);
};

export const getProductById = (id) => {
  return products.find(product => product.id === id);
};