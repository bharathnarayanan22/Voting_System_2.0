const User = require('../model/user');

const storeUser = async (userData) => {
  try {
    const user = new User(userData);
    await user.save();
  } catch (error) {
    console.error('Error storing user:', error);
    throw new Error('Unable to store user');
  }
};

const updateUserCredential = async (credential) => {
  try {
    const { userId, credentialData } = credential; 
    await User.updateOne(
      { _id: userId },
      { $push: { credentials: credentialData } } 
    );
  } catch (error) {
    console.error('Error updating user credential:', error);
    throw new Error('Unable to update user credential');
  }
};


const getUserById = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw new Error('Unable to fetch user');
  }
};

module.exports = { storeUser, updateUserCredential, getUserById };
