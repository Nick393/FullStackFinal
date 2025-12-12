require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3001;
const cors = require("cors");  

// Middleware
app.use(cors(
  {origin:process.env.CLIENT_ORIGIN}
));  
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((error) => console.error("❌ Error:", error));

// Import models
const Message = require("./models/Message");
const User = require("./models/User");

// Import middleware
const auth = require("./middleware/auth");

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "Message Board API",
    status: "Running",
    endpoints: {
      messages: "/api/messages",
      auth: {
        signup: "/api/auth/signup",
        login: "/api/auth/login"
      }
    },
  });
});

// Auth routes
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({
        error: 'User already exists',
        message: 'A user with this email or username already exists'
      });
    }

    // Create new user
    const user = new User({ username, email, password });
    await user.save();

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      },
      token
    });

  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        error: 'Validation error',
        message: err.message
      });
    }
    res.status(500).json({
      error: 'Server error',
      message: err.message
    });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        error: 'Invalid credentials',
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Invalid credentials',
        message: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'Login successful',
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      },
      token
    });

  } catch (err) {
    res.status(500).json({
      error: 'Server error',
      message: err.message
    });
  }
});

// Get current user info
app.get('/api/auth/me', auth, async (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      username: req.user.username,
      email: req.user.email
    }
  });
});


// Post a new message
app.post('/api/messages', auth, async (req, res) => {
  try {
    const { content } = req.body;

    // Check if content exists
    if (!content || content.trim() === '') {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Message content is required'
      });
    }

    // Create new message
    const newMessage = new Message({
      content: content.trim(),
      user: req.user._id
    });

    // Save to database
    const savedMessage = await newMessage.save();

    // Populate user info
    await savedMessage.populate('user', 'username');

    // Return created message with 201 status
    res.status(201).json(savedMessage);

  } catch (err) {
    // Handle validation errors from Mongoose
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        error: 'Validation error',
        message: err.message
      });
    }

    res.status(500).json({
      error: 'Server error',
      message: err.message
    });
  }
});

// Get all messages
app.get('/api/messages', async (req, res) => {
  try {
    // Retrieve all messages from database, sorted by most recent first
    const messages = await Message.find()
      .populate('user', 'username')
      .sort({ createdAt: -1 });

    // Return messages array
    res.status(200).json(messages);

  } catch (err) {
    res.status(500).json({
      error: 'Server error',
      message: err.message
    });
  }
});

// Get a specific message
app.get('/api/messages/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        error: 'Message not found',
        message: 'Invalid message ID format'
      });
    }

    // Find message by ID
    const message = await Message.findById(id);

    // Check if message exists
    if (!message) {
      return res.status(404).json({
        error: 'Message not found',
        message: `Message with ID ${id} not found`
      });
    }

    // Return the message
    res.status(200).json(message);

  } catch (err) {
    res.status(500).json({
      error: 'Server error',
      message: err.message
    });
  }
});

// Delete a message
app.delete('/api/messages/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        error: 'Message not found',
        message: 'Invalid message ID format'
      });
    }

    // Find message by ID
    const message = await Message.findById(id);

    // Check if message exists
    if (!message) {
      return res.status(404).json({
        error: 'Message not found',
        message: `Message with ID ${id} not found`
      });
    }

    // Check if user owns the message
    if (message.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You can only delete your own messages'
      });
    }

    // Delete message
    await Message.findByIdAndDelete(id);

    // Return success message
    res.status(200).json({
      message: 'Message deleted successfully'
    });

  } catch (err) {
    res.status(500).json({
      error: 'Server error',
      message: err.message
    });
  }
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
