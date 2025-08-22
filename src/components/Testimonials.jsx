import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Arjun Patel',
    role: 'Computer Science Student, IIT Delhi',
    content: 'E-Groots helped me build my first competition robot. The quality of components and support is outstanding!',
    rating: 5,
    initials: 'AP'
  },
  {
    id: 2,
    name: 'Priya Sharma',
    role: 'Electronics Hobbyist',
    content: 'The Arduino starter kit is perfect for beginners. Great documentation and all components work flawlessly.',
    rating: 5,
    initials: 'PS'
  },
  {
    id: 3,
    name: 'Rahul Kumar',
    role: 'Startup Founder',
    content: 'Their PCB design service saved us months of development time. Professional quality at great prices.',
    rating: 5,
    initials: 'RK'
  },
  {
    id: 4,
    name: 'Sneha Gupta',
    role: 'Robotics Teacher',
    content: 'I use E-Groots educational kits in my classes. Students love the hands-on learning experience!',
    rating: 5,
    initials: 'SG'
  }
];

const Testimonials = () => {
  return (
    <section className="py-16 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            What Our Customers Say
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands of satisfied innovators who trust E-Groots for their electronics needs
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="relative overflow-hidden border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg">
              {/* Quote Icon */}
              <div className="absolute top-4 right-4 text-primary/20">
                <Quote className="w-8 h-8" />
              </div>

              <CardContent className="p-6">
                {/* Rating */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < testimonial.rating
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>

                {/* Testimonial Content */}
                <blockquote className="text-foreground mb-6 text-lg leading-relaxed">
                  "{testimonial.content}"
                </blockquote>

                {/* Customer Info */}
                <div className="flex items-center gap-4">
                  <Avatar className="w-12 h-12 bg-gradient-to-br from-primary to-secondary">
                    <AvatarFallback className="text-white font-semibold">
                      {testimonial.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-foreground">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-primary mb-2">10,000+</div>
            <div className="text-muted-foreground">Happy Customers</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-secondary mb-2">500+</div>
            <div className="text-muted-foreground">Products</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-accent mb-2">4.8/5</div>
            <div className="text-muted-foreground">Average Rating</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary mb-2">99%</div>
            <div className="text-muted-foreground">Customer Satisfaction</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;