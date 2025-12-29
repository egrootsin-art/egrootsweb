import { useState } from "react";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import ProductCard from "@/components/ProductCard";
import Newsletter from "@/components/Newsletter";
import Testimonials from "@/components/Testimonials";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { featuredProducts } from "@/data/products";
import { ArrowRight, Package, Users, Award, Zap, Instagram, MessageCircle, Linkedin, Youtube } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const [openItem, setOpenItem] = useState<"STEM" | "STEAM" | "STREAM" | null>("STEM");

  const toggleItem = (item: "STEM" | "STEAM" | "STREAM") => {
    setOpenItem(prev => (prev === item ? null : item));
  };

  // Social media links - update with your actual links
  const socialLinks = [
    {
      name: "Instagram",
      href: "https://www.instagram.com/egroots.in?igsh=MXJla2V2NXA2NHRuZA%3D%3D&utm_source=qr",
      icon: Instagram,
      color: "bg-gradient-to-r from-pink-500 to-purple-500"
    },
    {
      name: "WhatsApp",
      href: "https://wa.me/918015221905",
      icon: MessageCircle,
      color: "bg-green-500"
    },
    {
      name: "LinkedIn",
      href: "https://www.linkedin.com/company/e-groots/",
      icon: Linkedin,
      color: "bg-blue-700"
    },
    {
      name: "YouTube",
      href: "https://www.youtube.com/@E-GROOTS",
      icon: Youtube,
      color: "bg-red-500"
    }
  ];

  return (
    <div className="min-h-screen w-full bg-background flex flex-col">
      <Navigation />
      <HeroSection />

      {/* STREAM SECTION – dropdown + empty blue boxes */}
      <section className="bg-[#F1FFF7] pt-16 pb-20">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left narrative */}
          <div>
            <h3 className="text-sm md:text-base font-semibold tracking-[0.18em] uppercase text-[#26A044] mb-3">
              We can't perform a day‑to‑day activity without STREAM
            </h3>
            <p className="text-sm md:text-base text-slate-700 leading-relaxed">
              The limitation with classic STEM education is that it follows the
              same learn–demonstrate–forget model. It does not reflect the
              intelligence of the learner, but the engagement model and the
              outcome.
            </p>
            <p className="mt-4 text-sm md:text-base text-slate-700 leading-relaxed">
              At E‑Groots, STREAM brings in key differentiators such as{" "}
              <span className="font-semibold text-slate-900">PLAY</span> with
              science and art,{" "}
              <span className="font-semibold text-slate-900">PRACTICE</span> with
              engineering and technology, and{" "}
              <span className="font-semibold text-slate-900">PROGRESS</span>{" "}
              through research and innovation.
            </p>
          </div>

          {/* Right: STEM / STEAM / STREAM accordion */}
          <div className="space-y-3">
            {/* STEM */}
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <button
                type="button"
                onClick={() => toggleItem("STEM")}
                className="w-full flex items-center justify-between px-4 py-3 text-left"
              >
                <div className="flex items-center gap-3">
                  {/* Empty blue box */}
                  <div className="w-10 h-10 rounded-md bg-[#15315B]" />
                  <span className="font-semibold text-slate-900 text-sm md:text-base">
                    STEM
                  </span>
                </div>
                <span className="text-xl leading-none text-slate-400">
                  {openItem === "STEM" ? "−" : "+"}
                </span>
              </button>
              {openItem === "STEM" && (
                <div className="border-t border-slate-100 px-4 py-3 text-sm text-slate-700">
                  Science, Technology, Engineering, Math – a strong technical
                  foundation but often limited in creativity, research and
                  application.
                </div>
              )}
            </div>

            {/* STEAM */}
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <button
                type="button"
                onClick={() => toggleItem("STEAM")}
                className="w-full flex items-center justify-between px-4 py-3 text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-md bg-[#15315B]" />
                  <span className="font-semibold text-slate-900 text-sm md:text-base">
                    STEAM
                  </span>
                </div>
                <span className="text-xl leading-none text-slate-400">
                  {openItem === "STEAM" ? "−" : "+"}
                </span>
              </button>
              {openItem === "STEAM" && (
                <div className="border-t border-slate-100 px-4 py-3 text-sm text-slate-700">
                  Adds Arts to STEM, encouraging creative expression and
                  design‑thinking alongside technical skills.
                </div>
              )}
            </div>

            {/* STREAM */}
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <button
                type="button"
                onClick={() => toggleItem("STREAM")}
                className="w-full flex items-center justify-between px-4 py-3 text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-md bg-[#15315B]" />
                  <span className="font-semibold text-slate-900 text-sm md:text-base">
                    STREAM
                  </span>
                </div>
                <span className="text-xl leading-none text-slate-400">
                  {openItem === "STREAM" ? "−" : "+"}
                </span>
              </button>
              {openItem === "STREAM" && (
                <div className="border-t border-slate-100 px-4 py-3 text-sm text-slate-700">
                  Science, Technology, Research, Engineering, Arts and Math –
                  emphasising experimentation, data and innovation‑driven
                  projects.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* STREAM formula heading */}
        <div className="max-w-6xl mx-auto px-4 mt-16 text-center">
          <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#26A044] mb-3 uppercase">
            STREAM: beyond STEM and STEAM education
          </h3>
          <p className="text-sm md:text-base font-medium text-slate-800">
            Science + Technology + Research + Engineering + Arts + Math
          </p>
        </div>
      </section>

      {/* Featured Products – same background */}
      <section className="py-16 bg-[#F1FFF7]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
                Featured <span className="text-primary">products</span>
              </h2>
              <p className="text-base md:text-lg text-slate-600 max-w-xl">
                Classroom‑ready electronics, robotics and fabrication tools
                selected for reliability, documentation and long‑term use.
              </p>
            </div>
            <Button
              asChild
              className="rounded-full px-6 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Link to="/products">
                <span className="flex items-center">
                  View all products
                  <ArrowRight className="w-4 h-4 ml-2" />
                </span>
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.slice(0, 6).map((product, index) => (
              <div
                key={product.id}
                className="animate-slide-up h-full"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="rounded-2xl border border-slate-100 bg-white shadow-sm hover:shadow-md transition-shadow h-full">
                  <ProductCard product={product} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose E‑Groots – same background */}
      <section className="py-16 bg-[#F1FFF7]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
              Why choose <span className="text-primary">E‑Groots?</span>
            </h2>
            <p className="text-base md:text-lg text-slate-600 max-w-2xl mx-auto">
              A focused catalog, engineering‑first support and infrastructure
              designed for schools, labs and high‑performance student teams.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow bg-white">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Package className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">
                  Quality hardware
                </h3>
                <p className="text-sm text-slate-600">
                  Components and kits sourced from trusted partners and
                  validated in real projects.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow bg-white">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-accent" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">
                  Student‑centric design
                </h3>
                <p className="text-sm text-slate-600">
                  Kits, pricing and content tailored for classrooms, clubs and
                  hackathons.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow bg-white">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-secondary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-secondary" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">
                  Engineering support
                </h3>
                <p className="text-sm text-slate-600">
                  Guidance from engineers experienced in embedded systems,
                  robotics and power electronics.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow bg-white">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-tech-orange" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">
                  Reliable logistics
                </h3>
                <p className="text-sm text-slate-600">
                  Predictable dispatch and tracking so project timelines stay
                  under control.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Testimonials />
      <Newsletter />

      {/* Footer */}
      <footer className="gradient-card border-t border-border/50 py-12 mt-auto">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">EG</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">E‑Groots</h3>
                  <p className="text-xs text-muted-foreground">
                    Empowering future innovators
                  </p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Door No. 1/144-1, Mahadhanapuram, Krishnarayapuram Taluk, Karur –
                639102.
              </p>
              <p className="text-sm text-muted-foreground">
                GST.No : 33ICSPP2555M1ZS
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">Products</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link to="/products?category=Events" className="hover:text-primary transition-colors">
                    Events
                  </Link>
                </li>
                <li>
                  <Link to="/products?category=Educational Kits" className="hover:text-primary transition-colors">
                    Educational kits
                  </Link>
                </li>
                <li>
                  <Link to="/products?category=Competition Robots" className="hover:text-primary transition-colors">
                    Competition robots
                  </Link>
                </li>
                <li>
                  <Link to="/products?category=PCB Design Services" className="hover:text-primary transition-colors">
                    PCB design
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link to="/terms" className="hover:text-primary transition-colors">
                    Documentation
                  </Link>
                </li>
                <li>
                  <a 
                    href="https://www.youtube.com/@E-GROOTS" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors"
                  >
                    Tutorials
                  </a>
                </li>
                <li>
                  <a 
                    href="https://www.instagram.com/egroots.in?igsh=MXJla2V2NXA2NHRuZA%3D%3D&utm_source=qr" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors"
                  >
                    Community forum
                  </a>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-primary transition-colors">
                    Contact us
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link to="/about" className="hover:text-primary transition-colors">
                    About us
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="hover:text-primary transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="hover:text-primary transition-colors">
                    Privacy policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="hover:text-primary transition-colors">
                    Terms of service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Social Media Section */}
          <div className="border-t border-border/50 pt-8">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-6">
              <div className="text-center sm:text-left">
                <p className="text-sm text-muted-foreground">
                  © {new Date().getFullYear()} E‑Groots. All rights reserved. Built
                  for the next generation of engineers and makers.
                </p>
              </div>
              
              {/* Social Media Icons */}
              <div className="flex items-center gap-2">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group"
                      aria-label={social.name}
                    >
                      <div className={`w-10 h-10 ${social.color} rounded-lg flex items-center justify-center shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 group-hover:-translate-y-0.5`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
