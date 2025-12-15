import { Product } from "@/components/ProductCard";
import learnovateInter from "@/assets/BASIC.jpeg";
import learnovateBasic from "@/assets/INTERMEDIATE.jpeg";
import linefollower from "@/assets/linefollower.jpeg";
import mazesolver from "@/assets/mazesolver.jpeg";

export const featuredProducts: Product[] = [
  {
    id: "7",
    name: "Coding Challenge Event",
    price: 1,
    originalPrice: 119.99,
    image: learnovateBasic,
    category: "Events",
    description:
      "The E-Groots Mini Kit is a compact, all-in-one electronics learning board designed to make robotics, IoT, and sensor-based projects simple and exciting. Powered by an Arduino Nano, it brings together essential modules like PIR motion detection, ultrasonic sensing, DHT22 temperature and humidity monitoring, MPU6050 IMU, gas and touch sensors, a 4-digit display, relay control, and a motor driver—all neatly arranged for easy access without messy wiring. With a built-in breadboard area, switch-controlled power lines, and an ESP expansion slot, the kit is perfect for students, makers, trainers, and STEM programs looking for fast prototyping and practical learning. By eliminating wiring errors and organizing modules intuitively, the E-Groots Mini Kit helps learners focus on creativity, logic-building, and innovation, making it an ideal tool for modern STEM education.",
    inStock: true,
    isNew: false,
    isFeatured: false,
  },
  {
    id: "1",
    name: "LEARNOVATE KIT INTERMEDIATE",
    price: 1,
    originalPrice: 119.99,
    image: learnovateBasic,
    category: "Educational Kits",
    description:
      "The E-Groots Mini Kit is a compact, all-in-one electronics learning board designed to make robotics, IoT, and sensor-based projects simple and exciting. Powered by an Arduino Nano, it brings together essential modules like PIR motion detection, ultrasonic sensing, DHT22 temperature and humidity monitoring, MPU6050 IMU, gas and touch sensors, a 4-digit display, relay control, and a motor driver—all neatly arranged for easy access without messy wiring. With a built-in breadboard area, switch-controlled power lines, and an ESP expansion slot, the kit is perfect for students, makers, trainers, and STEM programs looking for fast prototyping and practical learning. By eliminating wiring errors and organizing modules intuitively, the E-Groots Mini Kit helps learners focus on creativity, logic-building, and innovation, making it an ideal tool for modern STEM education.",
    inStock: true,
    isNew: false,
    isFeatured: false,
  },
  {
    id: "2",
    name: "LEARNOVATE KIT BASIC",
    price: 1,
    originalPrice: 49.99,
    image: learnovateInter,
    category: "Educational Kits",
    description:
      "The E-Groots Intermediate Kit is a powerful step up for learners ready to move beyond the basics and build real, functional electronic systems. Designed with advanced sensors, wireless modules, motor control components, and a spacious prototyping area, it enables students to create smart automation, IoT, and robotics projects with ease. Equipped with modules such as Ultrasonic Sensor, DHT22, PIR Motion Sensor, Bluetooth, I2C LCD Display, Touch Sensor, Gas Sensor, NeoPixel RGB Strip, and a robust Motor Driver, the kit offers a complete environment for hands-on experimentation. Its logical, modular layout helps learners clearly understand circuit flow, component behavior, and coding concepts while reducing wiring errors. Built on E-Groots’ commitment to clarity, creativity, and practical exploration, the Intermediate Kit gives students the confidence to design, innovate, and bring their ideas to life—making it perfect for STEM labs, mini-project builders, and enthusiasts aiming to level up their skills.",
    inStock: true,
  },
  {
    id: "3",
    name: "MAZE GROVER KIT",
    price: 1,
    image: mazesolver,
    category: "Competition Robots",
    description:
      "The E-Groots Maze Solver Kit is a high-performance robotics platform built for serious maze-solving and competition-level precision. Powered by an ESP32 for fast processing, it features three VL6180X ToF sensors that deliver millimeter-level wall detection and 600 RPM encoder motors for smooth, accurate movement through complex paths. The MX1508 motor driver ensures stable dual-motor control even during sharp turns, rapid acceleration, and long straight runs. Lightweight, responsive, and fully ready for PID tuning, mapping, and autonomous navigation algorithms, this kit provides everything needed to master advanced robotics concepts. With its compact, competition-ready design, it’s an ideal choice for students and enthusiasts aiming for reliable, high-speed maze-solving performance.",
    inStock: true,
    isNew: false,
    isFeatured: false,
  },
  {
    id: "4",
    name: "NANO GLIDER LFR KIT",
    price: 1,
    image: linefollower,
    category: "Competition Robots",
    description:
      "The E-Groots Line Follower Kit is a fast, classroom-friendly robotics platform designed to teach real-time sensor processing, motor control, and practical automation. Built with a reliable microcontroller, high-speed DC motors, and a high-precision IR sensor array, it can detect and follow black or white tracks with impressive stability and accuracy. Its lightweight chassis, efficient motor driver, and beginner-friendly architecture make it perfect for students starting their robotics journey as well as those preparing for competitions. From simple line following to advanced PID tuning, the kit supports a wide range of algorithms and encourages hands-on experimentation. Compact, customizable, and easy to assemble, it transforms coding logic into smooth, real-world movement.",
    inStock: true,
  },
  {
    id: "5",
    name: "Custom PCB Design Service",
    price: 1,
    image:
      "https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?w=400&h=400&fit=crop",
    category: "PCB Design Services",
    description: "Currently not Available.",
    inStock: false,
    isFeatured: true,
  },
];

export const categories = [
  {
    name: "Events",
    description: "Custom circuit board design and manufacturing services",
    image:
      "https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?w=300&h=200&fit=crop",
    productCount: 12,
  },
  {
    name: "PCB Design Services",
    description: "Custom circuit board design and manufacturing services",
    image:
      "https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?w=300&h=200&fit=crop",
    productCount: 12,
  },
  {
    name: "Educational Kits",
    description:
      "Learning kits and development boards for students and educators",
    image:
      "https://images.unsplash.com/photo-1553406830-ef2513450d76?w=300&h=200&fit=crop",
    productCount: 45,
  },
  {
    name: "Competition Robots",
    description:
      "High-performance robotics kits for competitions and advanced projects",
    image:
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=300&h=200&fit=crop",
    productCount: 18,
  },
];

export const testimonials: {
  id: string;
  name: string;
  role: string;
  avatar: string;
  content: string;
  rating: number;
}[] = [];
