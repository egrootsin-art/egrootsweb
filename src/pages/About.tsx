import Navigation from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Target, Award, Lightbulb, Heart, Rocket } from "lucide-react";

const About = () => {
  const teamMembers = [
    {
      name: "Dr. Sarah Chen",
      role: "Founder & CEO",
      image: "/placeholder.svg",
      bio: "Former MIT researcher with 15+ years in educational technology and robotics."
    },
    {
      name: "Alex Rodriguez",
      role: "CTO",
      image: "/placeholder.svg", 
      bio: "Ex-Google engineer passionate about making technology accessible to students."
    },
    {
      name: "Maya Patel",
      role: "Head of Education",
      image: "/placeholder.svg",
      bio: "Curriculum designer with expertise in STEM education and hands-on learning."
    }
  ];

  const values = [
    {
      icon: <Lightbulb className="w-8 h-8" />,
      title: "Innovation",
      description: "We believe in the power of creative problem-solving and cutting-edge technology to transform education."
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Accessibility",
      description: "Quality education tools should be available to every student, regardless of their background."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Community",
      description: "We build supportive communities where learners can collaborate and grow together."
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Excellence",
      description: "We maintain the highest standards in product quality and customer service."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-primary/10 to-accent/10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            About <span className="text-primary">E-Groots</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We're on a mission to empower the next generation of innovators through 
            accessible, high-quality electronics and educational technology.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Our Story
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                Founded in 2020 by a group of passionate educators and engineers, E-Groots began 
                with a simple observation: students were eager to learn about technology, but 
                accessing quality components and educational resources was often difficult and expensive.
              </p>
              <p className="text-lg text-muted-foreground mb-6">
                We started in a small workshop, carefully curating kits and components that would 
                make learning electronics, 3D printing, and robotics both affordable and engaging. 
                Today, we serve thousands of students, educators, and hobbyists worldwide.
              </p>
              <div className="flex flex-wrap gap-4">
                <Badge variant="secondary" className="text-sm">500+ Products</Badge>
                <Badge variant="secondary" className="text-sm">10,000+ Students</Badge>
                <Badge variant="secondary" className="text-sm">50+ Countries</Badge>
              </div>
            </div>
            <div className="relative">
              <img 
                src="/placeholder.svg" 
                alt="E-Groots workshop"
                className="rounded-lg shadow-lg w-full h-96 object-cover"
              />
              <div className="absolute -bottom-6 -left-6 bg-primary text-primary-foreground p-4 rounded-lg">
                <Rocket className="w-8 h-8" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="gradient-card border-border/50">
              <CardContent className="p-8">
                <Target className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-2xl font-bold text-foreground mb-4">Our Mission</h3>
                <p className="text-muted-foreground">
                  To democratize access to cutting-edge technology education by providing 
                  affordable, high-quality components and comprehensive learning resources 
                  that inspire creativity and innovation in students of all ages.
                </p>
              </CardContent>
            </Card>
            
            <Card className="gradient-card border-border/50">
              <CardContent className="p-8">
                <Lightbulb className="w-12 h-12 text-accent mb-4" />
                <h3 className="text-2xl font-bold text-foreground mb-4">Our Vision</h3>
                <p className="text-muted-foreground">
                  A world where every student has the tools and knowledge to become 
                  a technology creator, not just a consumer, fostering a generation 
                  of problem-solvers who will tackle tomorrow's greatest challenges.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Values
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              These core principles guide everything we do at E-Groots.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={value.title} className="gradient-card border-border/50 text-center tech-hover">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-4 text-primary">
                    {value.icon}
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Meet Our Team
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Passionate educators, engineers, and innovators dedicated to your success.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member) => (
              <Card key={member.name} className="gradient-card border-border/50 tech-hover">
                <CardContent className="p-6 text-center">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="font-semibold text-foreground mb-1">{member.name}</h3>
                  <p className="text-primary font-medium mb-3">{member.role}</p>
                  <p className="text-sm text-muted-foreground">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;