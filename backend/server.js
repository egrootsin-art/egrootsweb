const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const orderRoutes = require('./routes/orderRoutes');


const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// app.use(cors({ origin: "http://localhost:8080" }));
// app.use(express.json());
app.use(express.json());
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
}));
app.options("*", cors());



// MongoDB Connection
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  
})
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.error("MongoDB Connection Error:", err));

// Base Route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Auth Routes
app.use('/api/auth', authRoutes);

// Payment Routes
app.use('/api', paymentRoutes);

// Order Routes
app.use('/api/orders', orderRoutes);



// Order Email Route
app.post('/api/send-order-email', async (req, res) => {
  try {
    const { customerInfo, items, total, paymentMethod } = req.body;

    if (!customerInfo?.email || !items || !total || !paymentMethod) {
      return res.status(400).json({ message: 'Missing order details' });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const itemsList = items
      .map((item) =>
        `${item.name} - Qty: ${item.quantity} - ₹${(
          item.price * item.quantity
        ).toFixed(2)}`
      )
      .join('\n');

    const mailOptions = {
      from: `"Your Shop" <${process.env.EMAIL_USER}>`,
      to: customerInfo.email,
      subject: "Order Confirmation - Your Purchase Details",
      text: `
Hello ${customerInfo.name},

Thank you for shopping with us!

🧾 Order Summary:
---------------------------------
${itemsList}

Total: ₹${total.toFixed(2)}
Payment Method: ${paymentMethod}

Best Regards,
Egroots Innovate
      `,
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: 'Order confirmation sent successfully' });
  } catch (err) {
    console.error('Email Sending Error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Unknown Route Handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Server Start
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
