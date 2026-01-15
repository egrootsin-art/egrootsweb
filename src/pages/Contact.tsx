import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
      contact: "egroots.in@gmail.com",
      action: "mailto:egroots.in@gmail.com",
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Call Us",
      description: "Speak with our support team",
      contact: "+91 80152 21905",
      action: "tel:+918015221905",
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "Live Chat", 
      description: "Chat with us in real-time",
      contact: "Available 9 AM - 6 PM IST",
      action: "#",
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Visit Us",
      description: "Come to our headquarters",
      contact: "Door No. 1/144-1, Mahadhanapuram, Krishnarayapuram Taluk, Karur – 639102",
      action: "#",
    },
  ];

  const departments = [
    {
      icon: <HelpCircle className="w-8 h-8" />,
      title: "Technical Support",
      description: "Get help with products, troubleshooting, and technical questions",
      email: "info@egroots.in",
    },
    {
      icon: <Truck className="w-8 h-8" />,
      title: "Orders & Shipping", 
      description: "Track orders, shipping questions, and delivery issues",
      email: "egroots.in@gmail.com",
    },
  ];

  return (
    // ✅ Same base as About: white page, dark hero
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* ✅ Hero Section: black background like Products/About */}
      <section className="py-16 bg-[#202322]">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-[#22c55e] mb-6">
            Contact Us
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Have questions? Need support? We're here to help you succeed with your projects.
          </p>
        </div>
      </section>

      {/* Contact Methods – on white */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactMethods.map((method) => (
              <Card
                key={method.title}
                className="border border-emerald-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
              >
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mx-auto mb-4 text-emerald-600">
                    {method.icon}
                  </div>
                  <h3 className="font-semibold text-white-900 mb-2">{method.title}</h3>
                  <p className="text-sm text-white-600 mb-3">{method.description}</p>
                  <a 
                    href={method.action}
                    className="text-emerald-600 hover:text-emerald-700 font-medium text-sm"
                  >
                    {method.contact}
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Info – white with green accents */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto space-y-8">
            {/* Business Hours */}
            <Card className="border border-emerald-100 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center text-white-900">
                  <Clock className="w-5 h-5 mr-2 text-emerald-600" />
                  Business Hours
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-white-600">Monday - Saturday</span>
                  <span className="text-emerald-700 font-semibold">9:00 AM - 4:00 PM IST</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white-600">Sunday</span>
                  <span className="text-red-600 font-semibold">Closed</span>
                </div>
              </CardContent>
            </Card>

            {/* Departments */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-[#16a34a]">Department Contacts</h3>
              {departments.map((dept) => (
                <Card
                  key={dept.title}
                  className="border border-emerald-100 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className="text-emerald-600 mt-1">
                        {dept.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-white-900">{dept.title}</h4>
                        <p className="text-sm text-white-600 mb-2">{dept.description}</p>
                        <a 
                          href={`mailto:${dept.email}`}
                          className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
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
      </section>

      {/* FAQ Section – white, matching About style */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#16a34a] mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-700">
              Quick answers to common questions
            </p>
          </div>
         
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Card className="border border-emerald-100 shadow-sm hover:shadow-md transition-all duration-300">
              <CardContent className="p-6">
                <h4 className="font-semibold text-white-900 mb-2">What's your return policy?</h4>
                <p className="text-sm text-green-700">
                  We offer a 30-day return policy for unused items in original packaging. 
                  Educational institutions get extended 60-day returns.
                </p>
              </CardContent>
            </Card>
          
            <Card className="border border-emerald-100 shadow-sm hover:shadow-md transition-all duration-300">
              <CardContent className="p-6">
                <h4 className="font-semibold text-white-900 mb-2">Do you offer bulk discounts?</h4>
                <p className="text-sm text-green-700">
                  Yes! We provide special pricing for educational institutions, 
                  bulk orders over ₹15,000 and volume purchases. Contact our education team.
                </p>
              </CardContent>
            </Card>
          
            <Card className="border border-emerald-100 shadow-sm hover:shadow-md transition-all duration-300">
              <CardContent className="p-6">
                <h4 className="font-semibold text-white-900 mb-2">How fast is shipping?</h4>
                <p className="text-sm text-green-700">
                  Standard shipping takes 3-5 business days.
                </p>
              </CardContent>
            </Card>
          
            <Card className="border border-emerald-100 shadow-sm hover:shadow-md transition-all duration-300">
              <CardContent className="p-6">
                <h4 className="font-semibold text-white-900 mb-2">Do you provide technical support?</h4>
                <p className="text-sm text-green-700">
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
