import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import axios from "@/api/axiosConfig";
import {
  Bot,
  Cpu,
  Printer,
  GraduationCap,
  Code,
  Microchip,
  Rocket,
  Clock,
  Users,
  Youtube,
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  Lock
} from "lucide-react";
import { courses } from "./Courses";

const CourseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);

  const course = courses.find((c) => c.id === id);

  // Get user data from localStorage (profile data)
  const getProfileData = () => {
    try {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        return JSON.parse(savedUser);
      }
    } catch (e) {
      // Ignore parse errors
    }
    return user || null; // Fallback to context user
  };

  useEffect(() => {
    if (course) {
      checkEnrollment();
    } else {
      setIsEnrolled(false);
    }
  }, [course, id, user]);

  const checkEnrollment = async () => {
    const profileData = getProfileData();
    
    if (!profileData || !profileData.email) {
      setIsEnrolled(false);
      return;
    }
    
    try {
      const response = await axios.get(`/api/courses/check-enrollment/${id}`, {
        params: {
          userEmail: profileData.email,
          userId: profileData.id || profileData._id || null,
        },
      });
      setIsEnrolled(response.data.isEnrolled);
    } catch (error: any) {
      // Silently handle errors - just set enrolled to false
      setIsEnrolled(false);
    }
  };

  const handleEnroll = async () => {
    if (!course) return;

    const profileData = getProfileData();
    
    if (!profileData || !profileData.email) {
      toast({
        title: "Profile Information Required",
        description: "Please provide your email to enroll in this course.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post("/api/courses/enroll", {
        courseId: course.id,
        courseName: course.title,
        userEmail: profileData.email,
        userName: profileData.name || profileData.username || profileData.email.split("@")[0],
        userId: profileData.id || profileData._id || null,
      });

      if (response.data.success) {
        setIsEnrolled(true);
        toast({
          title: "Enrollment Successful!",
          description: `You have successfully enrolled in ${course.title}`,
        });
      }
    } catch (error: any) {
      console.error("Enrollment error:", error);
      toast({
        title: "Enrollment Failed",
        description: error.response?.data?.error || "Failed to enroll in course. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!course) {
    return (
      <div className="min-h-screen w-full bg-background flex flex-col">
        <Navigation />
        <div className="flex-1 flex items-center justify-center">
          <Card className="p-8">
            <CardContent className="text-center">
              <h2 className="text-2xl font-bold mb-4">Course Not Found</h2>
              <Button onClick={() => navigate("/courses")}>
                <ArrowLeft className="mr-2 w-4 h-4" />
                Back to Courses
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const Icon = course.icon;

  return (
    <div className="min-h-screen w-full bg-background flex flex-col">
      <Navigation />

      <div className="flex-1">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => navigate("/courses")}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 w-4 h-4" />
            Back to Courses
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Course Image */}
              <div className="w-full h-96 rounded-lg overflow-hidden">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop";
                  }}
                />
              </div>

              {/* Course Title and Info */}
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h1 className="text-3xl md:text-4xl font-bold text-[#15315B] mb-2">
                      {course.title}
                    </h1>
                    <div className="flex items-center gap-4 text-sm text-slate-600 mb-4">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>Small Groups</span>
                      </div>
                      <Badge className={getLevelColor(course.level)}>
                        {course.level}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-lg text-slate-700 leading-relaxed mb-6">
                  {course.description}
                </p>

                {/* Detailed Description */}
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-[#15315B] mb-4">
                    Course Overview
                  </h2>
                  <p className="text-slate-700 leading-relaxed">
                    {course.detailedDescription}
                  </p>
                </div>

                {/* What You'll Learn */}
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-[#15315B] mb-4">
                    What You'll Learn
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {course.features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 bg-[#F1FFF7] rounded-lg"
                      >
                        <CheckCircle2 className="w-5 h-5 text-[#26A044] flex-shrink-0" />
                        <span className="text-slate-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* YouTube Videos Section – only show link when enrolled */}
                {course.youtubeLink && (
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-[#15315B] mb-4">
                      Course Videos
                    </h2>
                    <Card className="border-2 border-slate-200">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                          {isEnrolled ? (
                            <>
                              <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
                                <Youtube className="w-7 h-7 text-white" />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-semibold text-[#15315B] mb-1">
                                  Watch Course Videos
                                </h3>
                                <p className="text-sm text-slate-600 mb-3">
                                  Access all course videos and tutorials on our YouTube channel
                                </p>
                                <a
                                  href={course.youtubeLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                                >
                                  <Youtube className="w-5 h-5" />
                                  Watch on YouTube
                                  <ExternalLink className="w-4 h-4" />
                                </a>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="w-12 h-12 bg-slate-300 rounded-lg flex items-center justify-center">
                                <Lock className="w-7 h-7 text-slate-600" />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-semibold text-[#15315B] mb-1">
                                  Course Videos
                                </h3>
                                <p className="text-sm text-slate-600">
                                  Enroll in this course to access video tutorials on our YouTube channel.
                                </p>
                              </div>
                            </>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Enrollment Card */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24 border-2 border-slate-200">
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-[#26A044]/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-8 h-8 text-[#26A044]" />
                    </div>
                    <h3 className="text-xl font-bold text-[#15315B] mb-2">
                      {course.title}
                    </h3>
                    <p className="text-sm text-slate-600 mb-4">
                      {course.category}
                    </p>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="flex items-center justify-between p-3 bg-[#F1FFF7] rounded-lg">
                      <span className="text-sm text-slate-700">Duration</span>
                      <span className="font-semibold text-[#15315B]">
                        {course.duration}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-[#F1FFF7] rounded-lg">
                      <span className="text-sm text-slate-700">Level</span>
                      <Badge className={getLevelColor(course.level)}>
                        {course.level}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-[#F1FFF7] rounded-lg">
                      <span className="text-sm text-slate-700">Format</span>
                      <span className="font-semibold text-[#15315B]">
                        Small Groups
                      </span>
                    </div>
                  </div>

                  {isEnrolled ? (
                    <div className="space-y-3">
                      <div className="p-4 bg-green-50 border-2 border-green-200 rounded-lg text-center">
                        <CheckCircle2 className="w-8 h-8 text-green-600 mx-auto mb-2" />
                        <p className="font-semibold text-green-800 mb-1">
                          You're Enrolled!
                        </p>
                        <p className="text-sm text-green-700">
                          Check your email for course details
                        </p>
                      </div>
                      {course.youtubeLink && (
                        <Button
                          asChild
                          className="w-full bg-red-600 hover:bg-red-700 text-white"
                        >
                          <a
                            href={course.youtubeLink}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Youtube className="mr-2 w-5 h-5" />
                            Watch Course Videos
                          </a>
                        </Button>
                      )}
                    </div>
                  ) : (
                    <Button
                      onClick={handleEnroll}
                      disabled={loading}
                      className="w-full bg-[#26A044] hover:bg-[#1e7d34] text-white"
                      size="lg"
                    >
                      {loading ? "Enrolling..." : "Enroll Now"}
                    </Button>
                  )}

                  <Button
                    asChild
                    variant="outline"
                    className="w-full mt-3"
                  >
                    <a href="/contact">
                      Contact Us
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

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

export default CourseDetail;
