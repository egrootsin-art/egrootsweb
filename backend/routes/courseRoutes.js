const express = require("express");
const CourseEnrollment = require("../models/CourseEnrollment");
const nodemailer = require("nodemailer");

const router = express.Router();

// POST /api/courses/enroll
// Uses profile data from request body
router.post("/courses/enroll", async (req, res) => {
  try {
    const { courseId, courseName, userEmail, userName, userId } = req.body;

    if (!courseId || !courseName) {
      return res.status(400).json({ error: "Missing required fields: courseId and courseName" });
    }

    if (!userEmail) {
      return res.status(400).json({ error: "Missing required field: userEmail" });
    }

    // Use userId if provided, otherwise use email as identifier
    const userIdentifier = userId || userEmail;

    // Check if already enrolled
    const existingEnrollment = await CourseEnrollment.findOne({
      $or: [
        { userId: userIdentifier },
        { userEmail: userEmail }
      ],
      courseId: courseId,
    });

    if (existingEnrollment) {
      return res.status(400).json({ error: "Already enrolled in this course" });
    }

    // Create enrollment
    const enrollment = await CourseEnrollment.create({
      userId: userIdentifier,
      userEmail: userEmail,
      userName: userName || userEmail.split("@")[0],
      courseId: courseId,
      courseName: courseName,
    });

    // Send confirmation email
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: req.user.email,
        subject: `Course Enrollment Confirmation - ${courseName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #26A044;">Course Enrollment Confirmed!</h2>
            <p>Dear ${req.user.username || "Student"},</p>
            <p>You have successfully enrolled in the course: <strong>${courseName}</strong></p>
            <p>Our team will contact you shortly with further details about the course schedule and materials.</p>
            <p>If you have any questions, please don't hesitate to contact us.</p>
            <br>
            <p>Best regards,<br>E-Groots Team</p>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);
    } catch (emailError) {
      console.error("Email sending error:", emailError);
      // Don't fail enrollment if email fails
    }

    return res.status(201).json({
      success: true,
      enrollmentId: enrollment._id,
      message: "Successfully enrolled in course",
    });
  } catch (err) {
    console.error("Course enrollment error:", err);
    if (err.code === 11000) {
      return res.status(400).json({ error: "Already enrolled in this course" });
    }
    return res.status(500).json({ error: "Failed to enroll in course" });
  }
});

// GET /api/courses/check-enrollment/:courseId
// Check if user is enrolled in a course (uses query params for userEmail or userId)
router.get("/courses/check-enrollment/:courseId", async (req, res) => {
  try {
    const { courseId } = req.params;
    const { userEmail, userId } = req.query;

    if (!userEmail && !userId) {
      return res.json({
        isEnrolled: false,
        enrollment: null,
      });
    }

    const userIdentifier = userId || userEmail;

    const enrollment = await CourseEnrollment.findOne({
      $or: [
        { userId: userIdentifier },
        { userEmail: userEmail }
      ],
      courseId: courseId,
    });

    return res.json({
      isEnrolled: !!enrollment,
      enrollment: enrollment || null,
    });
  } catch (err) {
    console.error("Check enrollment error:", err);
    return res.status(500).json({ error: "Failed to check enrollment" });
  }
});

// GET /api/courses/my-enrollments
// Get all courses user is enrolled in (uses query params for userEmail or userId)
router.get("/courses/my-enrollments", async (req, res) => {
  try {
    const { userEmail, userId } = req.query;

    if (!userEmail && !userId) {
      return res.status(400).json({ error: "Missing required field: userEmail or userId" });
    }

    const userIdentifier = userId || userEmail;

    const enrollments = await CourseEnrollment.find({
      $or: [
        { userId: userIdentifier },
        { userEmail: userEmail }
      ],
    }).sort({ enrolledAt: -1 });

    return res.json({
      success: true,
      enrollments: enrollments,
    });
  } catch (err) {
    console.error("Get enrollments error:", err);
    return res.status(500).json({ error: "Failed to get enrollments" });
  }
});

module.exports = router;
