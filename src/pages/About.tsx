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
    // ✅ Whole page base is white
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* ✅ Top hero: black like Products */}
      <section className="py-12 sm:py-16 bg-[#202322]">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#22c55e] mb-4 sm:mb-6 leading-tight">
            About E-Groots
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed px-2">
            We're on a mission to empower the next generation of innovators
            through accessible, high-quality electronics and educational
            technology.
          </p>
        </div>
      </section>

      {/* Our Story + Video – on white */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#16a34a] mb-4 sm:mb-6">
                Our Story
              </h2>
              <p className="text-base sm:text-lg text-gray-800 mb-4 sm:mb-6 leading-relaxed">
                Founded in 2020 by a group of passionate educators and
                engineers, E-Groots began with a simple observation: students
                were eager to learn about technology, but accessing quality
                components and educational resources was often difficult and
                expensive.
              </p>
              <p className="text-base sm:text-lg text-gray-800 mb-4 sm:mb-6 leading-relaxed">
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
                className="rounded-lg shadow-lg w-full h-64 sm:h-80 md:h-96 object-cover border-4 border-[#16a34a]"
              />
              <div className="absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6 bg-[#22c55e] text-white p-3 sm:p-4 rounded-lg shadow-lg">
                <Rocket className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision – white cards on light green tint if you want, or keep white */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <Card className="border border-emerald-100 shadow-sm hover:shadow-md transition-all duration-300">
              <CardContent className="p-6 sm:p-8">
                <Target className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-50 text-emerald-600 p-3 rounded-xl mb-3 sm:mb-4" />
                <h3 className="text-xl sm:text-2xl font-bold text-white-900 mb-3 sm:mb-4">
                  Our Mission
                </h3>
                <p className="text-sm sm:text-base text-green-700 leading-relaxed">
                  To democratize access to cutting-edge technology education by
                  providing affordable, high-quality components and
                  comprehensive learning resources that inspire creativity and
                  innovation in students of all ages.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-emerald-100 shadow-sm hover:shadow-md transition-all duration-300">
              <CardContent className="p-6 sm:p-8">
                <Lightbulb className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-50 text-emerald-600 p-3 rounded-xl mb-3 sm:mb-4" />
                <h3 className="text-xl sm:text-2xl font-bold text-white-900 mb-3 sm:mb-4">
                  Our Vision
                </h3>
                <p className="text-sm sm:text-base text-green-700 leading-relaxed">
                  A world where every student has the tools and knowledge to
                  become a technology creator, not just a consumer, fostering a
                  generation of problem-solvers who will tackle tomorrow&apos;s
                  greatest challenges.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Values – still on white, with green accents */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#16a34a] mb-3 sm:mb-4">
              Our Values
            </h2>
            <p className="text-base sm:text-lg text-gray-700 max-w-2xl mx-auto px-2">
              These core principles guide everything we do at E-Groots.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {values.map((value) => (
              <Card
                key={value.title}
                className="border border-emerald-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 text-center"
              >
                <CardContent className="p-5 sm:p-6">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-emerald-50 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <span className="text-emerald-600">{value.icon}</span>
                  </div>
                  <h3 className="font-semibold text-base sm:text-lg text-white-900 mb-2">
                    {value.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-green-700 leading-relaxed">
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
