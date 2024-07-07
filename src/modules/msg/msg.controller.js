import { userModel } from "../../../db/models/user.model.js";
import { msgModel } from './../../../db/models/msg.model.js';



//~ auth User Profile 
export const getUserProfile = async (req, res, next) => {
  try {
    const { user } = req;
    const userProfile = await userModel.findById(user._id).populate('receivedMessages');

    if (!userProfile) {
      return res.status(404).json({ message: 'User profile not found' });
    }
    res.status(200).json({ message: 'User profile retrieved successfully', userProfile });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

//~ Create a new message
export const createMessage = async (req, res, next) => {
  const { content, receiverId } = req.body;
  try {
    const receiver = await userModel.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ message: 'Receiver not found' });
    }
    const message = await msgModel.create({ content, receiverId });
    await userModel.findByIdAndUpdate(receiverId, { $push: { receivedMessages: message._id } });

    res.status(201).json({ message: 'Message created successfully', message });
  } catch (error) {
    console.error('Error creating message:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

//~ get all auth user messages 
export const getAllMessages = async (req, res, next) => {
  try {
    const { user } = req;
    const userMessages = await msgModel.find({ receiverId: user._id });
    console.log('Messages found:', userMessages);
    res.status(200).json({ message: 'Messages retrieved successfully', messages: userMessages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

//~ Delete messages for only auth users


export const deleteMessage = async (req, res, next) => {
  const messageId = req.params.id;
  try {
    const message = await msgModel.findOneAndDelete({ _id: messageId, receiverId: req.user._id });
    if (!message) {
      return res.status(404).json({ message: 'Message not found or not authorized to delete' });
    }
    res.status(200).json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};