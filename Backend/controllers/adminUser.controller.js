// controllers/admin.controller.js
import { User } from "../models/user.model.js";

export const getAllUsers = async (req, res) => {
  const users = await User.find().select("-password");

  res.status(200).json({
    success: true,
    users
  });
};

export const deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);

  res.json({
    success: true,
    message: "User deleted"
  });
};
export const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.role === 'admin') {
        return res.status(400).json({ message: "Admin cannot be blocked" });
    }

    user.isBlocked = !user.isBlocked; // Toggle: true ko false, false ko true
    await user.save();

    res.status(200).json({
      success: true,
      message: `User ${user.isBlocked ? "Blocked" : "Unblocked"} successfully`,
      isBlocked: user.isBlocked
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};