import Navigation from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Target, Award, Lightbulb, Heart, Rocket } from "lucide-react";
import aniVideo from "@/assets/ani.mp4";

const About = () => {
  const values = [
    {
      icon: <Lightbulb className="w-8 h-8" />,
      title: "Innovation",
      description:
        "We believe in the power of creative problem-solving and cutting-edge technology to transform education.",
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Accessibility",
      description:
        "Quality education tools should be available to every student, regardless of their background.",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Community",
      description:
        "We build supportive communities where learners can collaborate and grow together.",
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Excellence",
      description:
        "We maintain the highest standards in product quality and customer service.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="py-12 sm:py-16 bg-gradient-to-br from-primary/10 to-accent/10">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 sm:mb-6 leading-tight">
            About <span className="text-primary">E-Groots</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed px-2">
            We're on a mission to empower the next generation of innovators
            through accessible, high-quality electronics and educational
            technology.
          </p>
        </div>
      </section>

      {/* Our Story + Video */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4 sm:mb-6">
                Our Story
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground mb-4 sm:mb-6 leading-relaxed">
                Founded in 2020 by a group of passionate educators and
                engineers, E-Groots began with a simple observation: students
                were eager to learn about technology, but accessing quality
                components and educational resources was often difficult and
                expensive.
              </p>
              <p className="text-base sm:text-lg text-muted-foreground mb-4 sm:mb-6 leading-relaxed">
                We started in a small workshop, carefully curating kits and
                components that would make learning electronics, 3D printing,
                and robotics both affordable and engaging. Today, we serve
                thousands of students, educators, and hobbyists worldwide.
              </p>
            </div>

            {/* Video in loop */}
            <div className="relative order-1 lg:order-2">
              <video
                src={aniVideo}
                autoPlay
                loop
                muted
                playsInline
                className="rounded-lg shadow-lg w-full h-64 sm:h-80 md:h-96 object-cover"
              />
              <div className="absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6 bg-primary text-primary-foreground p-3 sm:p-4 rounded-lg shadow-lg">
                <Rocket className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-12 sm:py-16 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <Card className="gradient-card border-border/50">
              <CardContent className="p-6 sm:p-8">
                <Target className="w-10 h-10 sm:w-12 sm:h-12 text-primary mb-3 sm:mb-4" />
                <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-3 sm:mb-4">
                  Our Mission
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  To democratize access to cutting-edge technology education by
                  providing affordable, high-quality components and
                  comprehensive learning resources that inspire creativity and
                  innovation in students of all ages.
                </p>
              </CardContent>
            </Card>

            <Card className="gradient-card border-border/50">
              <CardContent className="p-6 sm:p-8">
                <Lightbulb className="w-10 h-10 sm:w-12 sm:h-12 text-accent mb-3 sm:mb-4" />
                <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-3 sm:mb-4">
                  Our Vision
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  A world where every student has the tools and knowledge to
                  become a technology creator, not just a consumer, fostering a
                  generation of problem-solvers who will tackle tomorrow's
                  greatest challenges.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">
              Our Values
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
              These core principles guide everything we do at E-Groots.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {values.map((value) => (
              <Card
                key={value.title}
                className="gradient-card border-border/50 text-center tech-hover"
              >
                <CardContent className="p-5 sm:p-6">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4 text-primary">
                    {value.icon}
                  </div>
                  <h3 className="font-semibold text-base sm:text-lg text-foreground mb-2">
                    {value.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
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
