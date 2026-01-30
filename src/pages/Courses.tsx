import Navigation from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Bot, 
  Cpu, 
  Printer, 
  GraduationCap, 
  Zap, 
  Code, 
  Microchip,
  Rocket,
  BookOpen,
  Clock,
  Users,
  Award,
  ArrowRight
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

interface Course {
  id: string;
  title: string;
  description: string;
  detailedDescription: string;
  duration: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  icon: React.ComponentType<{ className?: string }>;
  features: string[];
  category: string;
  image: string;
  youtubeLink: string;
}

export const courses: Course[] = [
  {
    id: "1",
    title: "Robotics & Automation",
    description: "Learn to build and program robots using Arduino, sensors, and motors. Master automation concepts through hands-on projects.",
    detailedDescription: "This comprehensive course covers the fundamentals of robotics and automation, starting with Arduino programming basics. You'll learn to integrate various sensors (ultrasonic, IR, temperature, etc.) and control different types of motors (DC, servo, stepper). The course includes hands-on projects like line-following robots, obstacle avoidance systems, and automated control systems. By the end, you'll be able to design, build, and program your own robotic systems for real-world applications.",
    duration: "40 Hours",
    level: "Beginner",
    icon: Bot,
    features: [
      "Arduino Programming",
      "Sensor Integration",
      "Motor Control",
      "Line Following Robots",
      "Obstacle Avoidance",
      "Project-Based Learning"
    ],
    category: "Robotics",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=600&fit=crop",
    youtubeLink: "https://www.youtube.com/@E-GROOTS"
  },
  {
    id: "2",
    title: "Artificial Intelligence & Machine Learning",
    description: "Introduction to AI concepts, machine learning algorithms, and practical applications using Python and TensorFlow.",
    detailedDescription: "Dive deep into the world of Artificial Intelligence and Machine Learning. This course starts with Python fundamentals and progresses to advanced ML concepts including neural networks, deep learning, computer vision, and natural language processing. You'll work with industry-standard tools like TensorFlow, Keras, and OpenCV to build real-world AI applications. Projects include image classification, sentiment analysis, and predictive models.",
    duration: "50 Hours",
    level: "Intermediate",
    icon: Cpu,
    features: [
      "Python Programming",
      "Neural Networks",
      "Computer Vision",
      "Natural Language Processing",
      "Real-World Projects",
      "Industry Tools"
    ],
    category: "AI & ML",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop",
    youtubeLink: "https://www.youtube.com/@E-GROOTS"
  },
  {
    id: "3",
    title: "Internet of Things (IoT)",
    description: "Build connected devices and smart systems. Learn to integrate sensors, microcontrollers, and cloud platforms.",
    detailedDescription: "Master the Internet of Things by building smart, connected devices. Learn to work with ESP32 and ESP8266 microcontrollers, integrate various sensors, and connect devices to cloud platforms. The course covers MQTT protocols, REST APIs, mobile app development for IoT, and real-world applications like home automation and smart agriculture systems.",
    duration: "45 Hours",
    level: "Intermediate",
    icon: Microchip,
    features: [
      "ESP32/ESP8266",
      "Sensor Networks",
      "Cloud Integration",
      "Mobile App Development",
      "Home Automation",
      "Smart Agriculture"
    ],
    category: "IoT",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop",
    youtubeLink: "https://www.youtube.com/@E-GROOTS"
  },
  {
    id: "4",
    title: "3D Design & Printing",
    description: "Master 3D modeling, design principles, and 3D printing technology. Create prototypes and functional objects.",
    detailedDescription: "Learn professional 3D design and printing from scratch. This course covers CAD software (Fusion 360), 3D modeling techniques, material science, and various printing technologies. You'll design and print functional prototypes, learn about different materials (PLA, ABS, PETG), and understand post-processing techniques. Perfect for product designers, engineers, and makers.",
    duration: "35 Hours",
    level: "Beginner",
    icon: Printer,
    features: [
      "CAD Software (Fusion 360)",
      "3D Modeling",
      "Printing Techniques",
      "Material Science",
      "Prototyping",
      "Product Design"
    ],
    category: "3D Technology",
    image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&h=600&fit=crop",
    youtubeLink: "https://www.youtube.com/@E-GROOTS"
  },
  {
    id: "5",
    title: "Arduino & Embedded Systems",
    description: "Comprehensive course on embedded systems development using Arduino. Build real-world electronic projects.",
    detailedDescription: "A complete guide to embedded systems using Arduino. Learn digital and analog I/O, sensor interfacing, display systems (LCD, OLED), wireless communication (WiFi, Bluetooth), and advanced programming techniques. Build projects like weather stations, home automation systems, and IoT devices. This course provides a solid foundation for embedded systems development.",
    duration: "40 Hours",
    level: "Beginner",
    icon: Microchip,
    features: [
      "Arduino Basics",
      "Digital & Analog I/O",
      "Interfacing Sensors",
      "Display Systems",
      "Wireless Communication",
      "Project Development"
    ],
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop",
    youtubeLink: "https://www.youtube.com/@E-GROOTS"
  },
  {
    id: "6",
    title: "Python Programming for STEM",
    description: "Learn Python programming with focus on STEM applications including data analysis, automation, and scientific computing.",
    detailedDescription: "Python is the language of choice for STEM professionals. This course teaches Python from basics to advanced topics, focusing on STEM applications. Learn data analysis with NumPy and Pandas, data visualization with Matplotlib, automation scripting, and scientific computing. Perfect for students and professionals in science, technology, engineering, and mathematics fields.",
    duration: "45 Hours",
    level: "Beginner",
    icon: Code,
    features: [
      "Python Fundamentals",
      "Data Structures",
      "Libraries (NumPy, Pandas)",
      "Data Visualization",
      "Automation Scripts",
      "STEM Applications"
    ],
    category: "Programming",
    image: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&h=600&fit=crop",
    youtubeLink: "https://www.youtube.com/@E-GROOTS"
  },
  {
    id: "7",
    title: "Drone Technology & Programming",
    description: "Design, build, and program drones. Learn flight dynamics, control systems, and autonomous navigation.",
    detailedDescription: "Master drone technology from assembly to autonomous flight. Learn flight dynamics, control systems, GPS navigation, and programming for autonomous operations. The course covers drone assembly, calibration, flight control algorithms, aerial photography techniques, and safety regulations. Build and program your own drone for various applications.",
    duration: "50 Hours",
    level: "Advanced",
    icon: Rocket,
    features: [
      "Drone Assembly",
      "Flight Control",
      "GPS Navigation",
      "Aerial Photography",
      "Autonomous Flight",
      "Safety & Regulations"
    ],
    category: "Aerospace",
    image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&h=600&fit=crop",
    youtubeLink: "https://www.youtube.com/@E-GROOTS"
  },
  {
    id: "8",
    title: "STEM Lab Setup & Management",
    description: "Complete guide to setting up and managing STEM labs in schools and colleges. Includes curriculum design and equipment selection.",
    detailedDescription: "Comprehensive training for educators and administrators on setting up and managing effective STEM laboratories. Learn lab planning, equipment selection, curriculum design, safety protocols, and project management. This course covers budget planning, vendor selection, maintenance schedules, and best practices for creating engaging STEM learning environments.",
    duration: "30 Hours",
    level: "Intermediate",
    icon: GraduationCap,
    features: [
      "Lab Planning",
      "Equipment Selection",
      "Curriculum Design",
      "Safety Protocols",
      "Project Management",
      "Best Practices"
    ],
    category: "Education",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=600&fit=crop",
    youtubeLink: "https://www.youtube.com/@E-GROOTS"
  }
];

const getLevelColor = (level: string) => {
  switch (level) {
    case "Beginner":
      return "bg-green-100 text-green-700";
    case "Intermediate":
      return "bg-blue-100 text-blue-700";
    case "Advanced":
      return "bg-purple-100 text-purple-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const Courses = () => {
  const navigate = useNavigate();

  const handleEnrollClick = (courseId: string) => {
    navigate(`/course/${courseId}`);
  };

  return (
    <div className="min-h-screen w-full bg-background flex flex-col">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#15315B] to-[#26A044] text-white py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
              <BookOpen className="w-4 h-4" />
              <span>Our Courses</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Professional STEM Courses
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Comprehensive, hands-on training programs designed to build practical skills in robotics, AI, IoT, and emerging technologies.
            </p>
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-16 bg-[#F1FFF7]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => {
              const Icon = course.icon;
              return (
                <Card
                  key={course.id}
                  className="bg-white border-2 border-slate-200 hover:border-[#26A044] transition-all shadow-lg hover:shadow-xl overflow-hidden"
                >
                  {/* Course Image */}
                  <div className="w-full h-48 overflow-hidden">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop";
                      }}
                    />
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-14 h-14 bg-[#26A044]/10 rounded-lg flex items-center justify-center">
                        <Icon className="w-7 h-7 text-[#26A044]" />
                      </div>
                      <Badge className={getLevelColor(course.level)}>
                        {course.level}
                      </Badge>
                    </div>

                    <h3 className="text-xl font-bold text-[#15315B] mb-2">
                      {course.title}
                    </h3>
                    <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                      {course.description}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>Small Groups</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-[#15315B] mb-2">
                        What You'll Learn:
                      </h4>
                      <ul className="space-y-1">
                        {course.features.slice(0, 4).map((feature, index) => (
                          <li key={index} className="text-xs text-slate-600 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-[#26A044] rounded-full"></div>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button
                      onClick={() => handleEnrollClick(course.id)}
                      className="w-full bg-[#26A044] hover:bg-[#1e7d34] text-white"
                    >
                      <span className="flex items-center justify-center gap-2">
                        Enroll Now
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Our Courses */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#15315B] mb-4">
              Why Choose Our <span className="text-[#26A044]">Courses?</span>
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Industry-relevant curriculum, expert instructors, and hands-on project experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center border-2 border-slate-100">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-[#26A044]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-[#26A044]" />
                </div>
                <h3 className="font-bold text-[#15315B] mb-2">Industry Experts</h3>
                <p className="text-sm text-slate-600">
                  Learn from experienced professionals with real-world industry experience.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-2 border-slate-100">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-[#26A044]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-[#26A044]" />
                </div>
                <h3 className="font-bold text-[#15315B] mb-2">Hands-On Projects</h3>
                <p className="text-sm text-slate-600">
                  Build real projects and portfolios that demonstrate your skills to employers.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-2 border-slate-100">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-[#26A044]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <GraduationCap className="w-8 h-8 text-[#26A044]" />
                </div>
                <h3 className="font-bold text-[#15315B] mb-2">Certification</h3>
                <p className="text-sm text-slate-600">
                  Receive industry-recognized certificates upon course completion.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-[#15315B] to-[#26A044] text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Your STEM Journey?
          </h2>
          <p className="text-lg text-white/90 mb-8">
            Contact us today to learn more about our courses and enrollment options.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-white text-[#26A044] hover:bg-gray-100"
          >
            <Link to="/contact">
              <span className="flex items-center gap-2">
                Get Started
                <ArrowRight className="w-5 h-5" />
              </span>
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Courses;
