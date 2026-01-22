import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";
import { testimonials } from "@/data/products";

const Testimonials = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Title and Description */}
          <div>
            <div className="inline-flex items-center gap-2 bg-[#E8F5E9] text-[#26A044] px-3 py-1 rounded-full text-sm font-medium mb-4">
              <span>%</span>
              <span>Testimonials</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#15315B] mb-2">
              What Our Clients <span className="text-[#26A044]">Say About Us</span>
            </h2>
            <p className="text-base text-slate-700 leading-relaxed">
              Hear from schools, teachers, and students across Tamil Nadu who experienced hands-on STEM learning with E-Groots.
            </p>
          </div>

          {/* Right: Testimonial Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.slice(0, 2).map((testimonial, index) => (
              <Card
                key={testimonial.id}
                className="bg-white border-2 border-slate-100 shadow-lg hover:shadow-xl transition-shadow relative overflow-hidden"
              >
                <div className="absolute top-4 right-4 w-10 h-10 bg-[#26A044] rounded-full flex items-center justify-center">
                  <Quote className="w-5 h-5 text-white" />
                </div>
                <CardContent className="p-6 pt-12">
                  {/* Content */}
                  <p className="text-slate-700 mb-6 italic text-sm leading-relaxed">
                    "{testimonial.content}"
                  </p>

                  {/* Author */}
                  <div className="mb-4">
                    <h4 className="font-bold text-[#15315B] mb-1">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-[#26A044]">
                      {testimonial.role}
                    </p>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
