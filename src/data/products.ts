import { Product } from "@/components/ProductCard";
import learnovateBasic from "@/assets/mini.jpeg";
import learnovateInter from "@/assets/INTERMEDIATE.jpeg";
import linefollower from "@/assets/linefollower.jpeg";
import mazesolver from "@/assets/mazesolver.jpeg";
import event from "@/assets/codinground.jpeg";
import minibanner from "@/assets/mini_flag.jpeg";
import interbanner from "@/assets/inter_flag.jpeg";
import protoblocks from "@/assets/ProtoBlocks.jpeg";
import mini1 from "@/assets/mini_basic1.jpeg";
import mini2 from "@/assets/mini_basic2.jpeg";
import cobot from "@/assets/cobot.jpeg";
import cobot1 from "@/assets/cobot1.jpeg";
import smarskit from "@/assets/Smarskit.jpeg";
import smarskit1 from "@/assets/Smarskit1.jpeg";  
import smarskit2 from "@/assets/Smarskit2.jpeg";

export const featuredProducts: Product[] = [
  {
    id: "7",
    name: "Coding Challenge Event",
    price: 199,
    image: event,
    category: "Events",
    description:"This coding contest is a structured, multi-round challenge designed to assess participants’ problem-solving ability, coding accuracy, and time efficiency, allowing solutions to be written and tested in C++, Python, Java, and JavaScript with support for custom input execution before final submission; submissions are evaluated based on test case success and submission time, with Round 1 solutions manually reviewed by the admin to shortlist eligible participants for Round 2, ensuring a fair, competitive, and transparent assessment process throughout the contest.", 
    inStock: false,
    isNew: false,
    isFeatured: false,
  },
  {
    id: "1",
    name: "LEARNOVATE KIT BASIC",
    price: 3499,
    originalPrice: 5000,
    image: minibanner,
    images: [
      learnovateBasic,
      mini1,
      mini2
    ],
    category: "Educational Kits",
    description:
      "The E-Groots Intermediate Kit is a powerful step up for learners ready to move beyond the basics and build real, functional electronic systems. Designed with advanced sensors, wireless modules, motor control components, and a spacious prototyping area, it enables students to create smart automation, IoT, and robotics projects with ease. Equipped with modules such as Ultrasonic Sensor, DHT22, PIR Motion Sensor, Bluetooth, I2C LCD Display, Touch Sensor, Gas Sensor, NeoPixel RGB Strip, and a robust Motor Driver, the kit offers a complete environment for hands-on experimentation. Its logical, modular layout helps learners clearly understand circuit flow, component behavior, and coding concepts while reducing wiring errors. Built on E-Groots' commitment to clarity, creativity, and practical exploration, the Intermediate Kit gives students the confidence to design, innovate, and bring their ideas to life—making it perfect for STEM labs, mini-project builders, and enthusiasts aiming to level up their skills.",
    inStock: true,
  },
  {
    id: "2",
    name: "LEARNOVATE KIT INTERMEDIATE",
    price: 5499,
    originalPrice: 7000,
    image: interbanner,
    images: [
      learnovateInter,
    ],
    category: "Educational Kits",
    description:
      "The E-Groots Mini Kit is a compact, all-in-one electronics learning board designed to make robotics, IoT, and sensor-based projects simple and exciting. Powered by an Arduino Nano, it brings together essential modules like PIR motion detection, ultrasonic sensing, DHT22 temperature and humidity monitoring, MPU6050 IMU, gas and touch sensors, a 4-digit display, relay control, and a motor driver—all neatly arranged for easy access without messy wiring. With a built-in breadboard area, switch-controlled power lines, and an ESP expansion slot, the kit is perfect for students, makers, trainers, and STEM programs looking for fast prototyping and practical learning. By eliminating wiring errors and organizing modules intuitively, the E-Groots Mini Kit helps learners focus on creativity, logic-building, and innovation, making it an ideal tool for modern STEM education.",
    inStock: true,
    isNew: false,
    isFeatured: false,
  },
  {
    id: "3",
    name: "MAZE GROVER KIT",
    price: 4999,
    image: mazesolver,
    images: [
      mazesolver,
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1553406830-ef2513450d76?w=800&h=600&fit=crop",
    ],
    category: "Competition Robots",
    description:
      "The E-Groots Maze Solver Kit is a high-performance robotics platform built for serious maze-solving and competition-level precision. Powered by an ESP32 for fast processing, it features three VL6180X ToF sensors that deliver millimeter-level wall detection and 600 RPM encoder motors for smooth, accurate movement through complex paths. The MX1508 motor driver ensures stable dual-motor control even during sharp turns, rapid acceleration, and long straight runs. Lightweight, responsive, and fully ready for PID tuning, mapping, and autonomous navigation algorithms, this kit provides everything needed to master advanced robotics concepts. With its compact, competition-ready design, it's an ideal choice for students and enthusiasts aiming for reliable, high-speed maze-solving performance.",
    inStock: true,
    isNew: false,
    isFeatured: false,
  },
  {
    id: "4",
    name: "NANO GLIDER LFR KIT",
    price: 4599,
    image: linefollower,
    images: [
      linefollower,
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1553406830-ef2513450d76?w=800&h=600&fit=crop",
    ],
    category: "Competition Robots",
    description:
      "The E-Groots Line Follower Kit is a fast, classroom-friendly robotics platform designed to teach real-time sensor processing, motor control, and practical automation. Built with a reliable microcontroller, high-speed DC motors, and a high-precision IR sensor array, it can detect and follow black or white tracks with impressive stability and accuracy. Its lightweight chassis, efficient motor driver, and beginner-friendly architecture make it perfect for students starting their robotics journey as well as those preparing for competitions. From simple line following to advanced PID tuning, the kit supports a wide range of algorithms and encourages hands-on experimentation. Compact, customizable, and easy to assemble, it transforms coding logic into smooth, real-world movement.",
    inStock: true,
  },
  {
    id: "5",
    name: "Custom PCB Design Service",
    price: null,
    image:
      "https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?w=400&h=400&fit=crop",
    category: "PCB Design Services",
    description: "Contact for customization",
    inStock: true,
    isFeatured: true,
  },
  {
    id: "6",
    name: "ProtoBlocks",
    price: 2999,
    originalPrice: 3999,
    image: protoblocks,
    images: [
      protoblocks,
      
    ],
    category: "Educational Kits",
    description:
      "ProtoBlocks is a modular, plug-and-play electronics learning system that revolutionizes how students learn electronics. Each block contains a real electronic component on a labeled PCB, removing messy wiring and common beginner errors. Connections are simple, safe, and microcontroller-friendly, making concepts visible, measurable, and easy to understand. This system enables rapid experimentation and prototyping, suitable for beginners to advanced learners. Ideal for STEM labs, classrooms, and workshops. Advantages include clean connections with no breadboard confusion, reusable durable blocks that are classroom-ready, protected components for safe learning, faster prototyping with plug-test-repeat workflow, and industry-relevant real-world electronics experience.",
    inStock: false,
    isNew: true,
    isFeatured: true,
  },
  {
    id: "8",
    name: "SMARS Kit (Smart Modular Autonomous Robotic System)",
    price: 3999,
    originalPrice: 4999,
    image:
      smarskit,
    images: [
      smarskit,
      smarskit1,
      smarskit2
    ],
    category: "Competition Robots",
    description:
      "The SMARS kit is a compact, modular robotics platform inspired by Mars rovers, built to make hands-on learning irresistible. It combines mechanics, electronics, and coding into a single build-and-learn experience. Designed around 3D-printed parts, it encourages students to assemble, modify, and experiment freely. Motors, sensors, and a microcontroller come together to create real autonomous behaviors. Every module is swappable, so curiosity always has somewhere to go. It's small on the desk, but big on engineering concepts. Perfect for classrooms, labs, and home tinkering alike. Learning happens by building, breaking, and rebuilding smarter machines.",
    inStock: false,
    isNew: true,
    isFeatured: true,
  },
  {
    id: "9",
    name: "COBOT – 4-Servo Collaborative Robot",
    price: 4499,
    originalPrice: 5499,
    image:
      cobot,
    images: [
      cobot1
    ],
    category: "Competition Robots",
    description:
      "COBOT is a compact, table-top collaborative robot built using four precision servo motors for smooth and controlled motion. It demonstrates the fundamentals of robotic arms—rotation, lifting, and positioning—using a simple, understandable mechanism. Designed for learning, it bridges the gap between theory and real robotic kinematics. Students can program coordinated movements, angles, and sequences with ease. The lightweight structure makes it safe for classroom and lab interaction. COBOT encourages experimentation with automation, pick-and-place logic, and motion control. It's an ideal starting point for understanding how industrial robots think and move. Small in size, but serious about robotics fundamentals.",
    inStock: false,
    isNew: true,
    isFeatured: true,
  },
];

export const categories = [
  {
    name: "Events",
    description: "Custom circuit board design and manufacturing services",
    image:
      "https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?w=300&h=200&fit=crop",
    productCount: 1,
  },
  {
    name: "PCB Design Services",
    description: "Custom circuit board design and manufacturing services",
    image:
      "https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?w=300&h=200&fit=crop",
   
  },
  {
    name: "Educational Kits",
    description:
      "Learning kits and development boards for students and educators",
    image:
      "https://images.unsplash.com/photo-1553406830-ef2513450d76?w=300&h=200&fit=crop",
    productCount: 3,
  },
  {
    name: "Competition Robots",
    description:
      "High-performance robotics kits for competitions and advanced projects",
    image:
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=300&h=200&fit=crop",
    productCount: 4,
  },
];

export const testimonials: {
  id: string;
  name: string;
  role: string;
  avatar: string;
  content: string;
  rating: number;
}[] = [
  {
    id: "1",
    name: "S. Priya",
    role: "Assistant Professor, Namakkal",
    avatar: "https://ui-avatars.com/api/?name=S+Priya&background=26A044&color=fff",
    content: "The robotics and AI workshop was very useful for our college students. They learned Arduino programming and real-time project implementation.",
    rating: 5,
  },
  {
    id: "2",
    name: "M. Senthil Kumar",
    role: "Parent, Tiruchengode",
    avatar: "https://ui-avatars.com/api/?name=M+Senthil+Kumar&background=15315B&color=fff",
    content: "My child enjoyed the 3D designing and printing sessions. The trainers explained concepts in a simple and practical way that students could easily understand.",
    rating: 5,
  },
  {
    id: "3",
    name: "R. Karthik",
    role: "Principal, Erode",
    avatar: "https://ui-avatars.com/api/?name=R+Karthik&background=26A044&color=fff",
    content: "E-Groots has transformed our school's STEM lab with comprehensive training and quality equipment. Our students are now building innovative projects.",
    rating: 5,
  },
];
