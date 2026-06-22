const Message = require("../models/Message");

exports.getMessages = async (req, res, next) => {
  try {
    const myId = req.user;
    console.log("req.user", req.user);
    
    const otherUserId = req.params.receiverId;

    console.log("in getmessages");
    

    const messages = await Message.find({
      $or: [
        {
          senderId: myId,
          receiverId: otherUserId,
        },
        {
          senderId: otherUserId,
          receiverId: myId,
        },
      ],
    }).sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    next(error);
  }
};
