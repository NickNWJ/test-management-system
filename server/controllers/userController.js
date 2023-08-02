const userModel = require('../models/user');

// Controller for creating a new user
async function createUser(req, res) {
  try {
    const { Name, Email, Password, Role } = req.body;

    const userCount = await userModel.countDocuments(); // Count the number of existing users
    const userId = `US_${(userCount + 1).toString().padStart(3, '0')}`; // Generate the unique ID

    const newUser = await userModel.create({ ID: userId, Name, Email, Password, Role });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user' });
  }
}


// Controller for getting all users
async function getUsers(req, res) {
  try {
    const users = await userModel.find({});
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
}

// Controller for getting a specific user by ID
async function getUserById(req, res) {
  try {
    const { userId } = req.params;
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
}

// Controller for updating a user by ID
async function updateUser(req, res) {
  try {
    const { userId } = req.params;
    const { Name, Email, Password, Role } = req.body;

    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { Name, Email, Password, Role },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user' });
  }
}

// Controller for deleting a user by ID
async function deleteUser(req, res) {
  try {
    const { userId } = req.params;
    const deletedUser = await userModel.findByIdAndRemove(userId);
    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
}

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser
};