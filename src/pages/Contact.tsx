import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  MessageSquare,
  HelpCircle,
  Users,
  Truck
} from "lucide-react";

const Contact = () => {
  const contactMethods = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email Us",
      description: "Get in touch for general inquiries",
      contact: "hello@e-groots.com",
      action: "mailto:hello@e-groots.com"
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Call Us",
      description: "Speak with our support team",
      contact: "+1 (555) 123-4567",
      action: "tel:+15551234567"
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "Live Chat", 
      description: "Chat with us in real-time",
      contact: "Available 9 AM - 6 PM EST",
      action: "#"
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Visit Us",
      description: "Come to our headquarters",
      contact: "123 Innovation Drive, Tech City, TC 12345",
      action: "#"
    }
  ];

  const departments = [
    {
      icon: <HelpCircle className="w-8 h-8" />,
      title: "Technical Support",
      description: "Get help with products, troubleshooting, and technical questions",
      email: "support@e-groots.com"
    },
    {
      icon: <Truck className="w-8 h-8" />,
      title: "Orders & Shipping", 
      description: "Track orders, shipping questions, and delivery issues",
      email: "orders@e-groots.com"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Educational Partnerships",
      description: "Bulk orders, institutional accounts, and educational programs",
      email: "education@e-groots.com"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-primary/10 to-accent/10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Contact <span className="text-primary">Us</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Have questions? Need support? We're here to help you succeed with your projects.
          </p>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactMethods.map((method) => (
              <Card key={method.title} className="gradient-card border-border/50 tech-hover">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-4 text-primary">
                    {method.icon}
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{method.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{method.description}</p>
                  <a 
                    href={method.action}
                    className="text-primary hover:text-primary/80 font-medium text-sm"
                  >
                    {method.contact}
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="gradient-card border-border/50">
              <CardHeader>
                <CardTitle className="text-2xl text-foreground">Send us a Message</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="John" />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Doe" />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="john@example.com" />
                </div>
                
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" placeholder="How can we help you?" />
                </div>
                
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea 
                    id="message" 
                    placeholder="Tell us more about your inquiry..."
                    rows={6}
                  />
                </div>
                
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                  Send Message
                </Button>
              </CardContent>
            </Card>

            {/* Additional Info */}
            <div className="space-y-8">
              {/* Business Hours */}
              <Card className="gradient-card border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center text-foreground">
                    <Clock className="w-5 h-5 mr-2 text-primary" />
                    Business Hours
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Monday - Friday</span>
                    <span className="text-foreground">9:00 AM - 6:00 PM EST</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Saturday</span>
                    <span className="text-foreground">10:00 AM - 4:00 PM EST</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sunday</span>
                    <span className="text-foreground">Closed</span>
                  </div>
                </CardContent>
              </Card>

              {/* Departments */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-foreground">Department Contacts</h3>
                {departments.map((dept) => (
                  <Card key={dept.title} className="gradient-card border-border/50">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <div className="text-primary mt-1">
                          {dept.icon}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground">{dept.title}</h4>
                          <p className="text-sm text-muted-foreground mb-2">{dept.description}</p>
                          <a 
                            href={`mailto:${dept.email}`}
                            className="text-primary hover:text-primary/80 text-sm font-medium"
                          >
                            {dept.email}
                          </a>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-muted-foreground">
              Quick answers to common questions
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Card className="gradient-card border-border/50">
              <CardContent className="p-6">
                <h4 className="font-semibold text-foreground mb-2">What's your return policy?</h4>
                <p className="text-sm text-muted-foreground">
                  We offer a 30-day return policy for unused items in original packaging. 
                  Educational institutions get extended 60-day returns.
                </p>
              </CardContent>
            </Card>
            
            <Card className="gradient-card border-border/50">
              <CardContent className="p-6">
                <h4 className="font-semibold text-foreground mb-2">Do you offer bulk discounts?</h4>
                <p className="text-sm text-muted-foreground">
                  Yes! We provide special pricing for educational institutions, 
                  bulk orders over $500, and volume purchases. Contact our education team.
                </p>
              </CardContent>
            </Card>
            
            <Card className="gradient-card border-border/50">
              <CardContent className="p-6">
                <h4 className="font-semibold text-foreground mb-2">How fast is shipping?</h4>
                <p className="text-sm text-muted-foreground">
                  Standard shipping takes 3-5 business days. Express shipping (1-2 days) 
                  is available. Free shipping on orders over $75.
                </p>
              </CardContent>
            </Card>
            
            <Card className="gradient-card border-border/50">
              <CardContent className="p-6">
                <h4 className="font-semibold text-foreground mb-2">Do you provide technical support?</h4>
                <p className="text-sm text-muted-foreground">
                  Absolutely! Our engineering team provides free technical support, 
                  documentation, tutorials, and project guidance for all customers.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;