const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser
} = require('../controllers/userController');

// Middleware for user authentication
function authenticateUser(req, res, next) {
  // Extract the token from the request headers or other location
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Verify the token and decode the user information
    const decodedToken = jwt.verify(token, 'your-secret-key');
    req.user = decodedToken.userId; // Store the user ID in the request object
    next(); // Proceed to the next middleware/route handler
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// User Register
router.post('/register', async (req, res) => {
  const { Name, Email, Password, Role } = req.body;

  try {
    // Check if the user with the given email already exists
    const existingUser = await User.findOne({ Email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const userCount = await User.countDocuments(); // Count the number of existing users
    const userId = `US_${(userCount + 1).toString().padStart(3, '0')}`; // Generate the unique ID

    // Hash the password
    const hashedPassword = await bcrypt.hash(Password, 10);

    // Create the new user
    const newUser = await User.create({ ID: userId, Name, Email, Password: hashedPassword, Role });


    // Generate JWT token for the user
    const token = jwt.sign({ userId: newUser._id }, 'your-secret-key', { expiresIn: '1h' });

    // Send the user and token in the response
    res.status(201).json({ user: newUser, token });
  } catch (error) {
    res.status(500).json({ error: error.message  });
  }
});

// User Login
router.post('/login', async (req, res) => {
  const { Email, Password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ Email });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Compare the provided password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(Password, user.Password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token for the user
    const token = jwt.sign({ userId: user._id }, 'your-secret-key', { expiresIn: '1h' });

    // Set the token as a cookie in the response
    res.cookie('token', token, { path: '/', secure: true, sameSite: 'none', httpOnly: true });

    // Send the user in the response (without the token)
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message  });
    return;
  }
});

// User Logout
router.post('/logout', (req, res) => {
  // Clear the token cookie after 3 seconds
  setTimeout(() => {
    res.clearCookie('token', { path: '/', secure: true, sameSite: 'none', httpOnly: true });
    res.status(200).json({ message: 'Logout successful' });
  }, 1500); // Delay of 1500 milliseconds (1.5 seconds)
});

// User Routes
router.get('/all', getUsers);
router.get('/users/:userId', getUserById);
router.put('/users/:userId', updateUser);
router.delete('/users/:userId', deleteUser);

module.exports = router;