import { User } from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import sendEmail from '../utils/sendEmail.js';

export const register = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, password, role } = req.body;
    const file = req.file; // multer se aayega

    // console.log(fullname, email, phoneNumber, password, role, file?.filename);

    // Validation: koi bhi field missing ho to error return karo
    if (!fullname || !email || !phoneNumber || !password || !role) {
      return res.status(400).json({
        message: "Something is missing",
        success: false
      });
    }

    // Check if user already exists
    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists with this email",
        success: false
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with file path (if available)
    await User.create({
      fullname,
      email,
      phoneNumber,
      password: hashedPassword,
      role,
      profile: {
        resume: file ? file.path : "" // optional file handling
      }
    });

    return res.status(201).json({
      message: "Account created successfully",
      success: true
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false
    });
  }
};


// ---------------- LOGIN ----------------
// export const login = async (req, res) => {
//   try {
//     // console.log(req.body);
//     const { email, password, role } = req.body;

//     if (!email || !password || !role) {
//       return res.status(400).json({
//         message: "Something is missing",
//         success: false
//       });
//     }

//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({
//         message: "Incorrect email or password",
//         success: false
//       });
//     }

//     // Check password
//     const isPasswordMatch = await bcrypt.compare(password, user.password);
//     if (!isPasswordMatch) {
//       return res.status(400).json({
//         message: "Incorrect email or password",
//         success: false
//       });
//     }

//     // Check role
//     if (role !== user.role) {
//       return res.status(400).json({
//         message: "Account doesn't exist with current role",
//         success: false
//       });
//     }

//     // Create token
//     const tokenData = {
//       userId: user._id
//     };
//     const token = jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });

//     // Return user info (without password)
//     const userData = {
//       _id: user._id,
//       fullname: user.fullname,
//       email: user.email,
//       phoneNumber: user.phoneNumber,
//       role: user.role,
//       profile: user.profile
//     };

//     return res.status(200)
//       .cookie("token", token, {
//         maxAge: 1 * 24 * 60 * 60 * 1000,
//         httpOnly: true,
//         sameSite: 'strict'
//       })
//       .json({
//         message: `Welcome back ${user.fullname}`,
//         user: userData,
//         success: true
//       });

//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({
//       message: "Internal server error",
//       success: false
//     });
//   }
// };


export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({
        message: "Something is missing",
        success: false
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Incorrect email or password",
        success: false
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        message: "Incorrect email or password",
        success: false
      });
    }

    if (role !== user.role) {
      return res.status(400).json({
        message: "Account doesn't exist with current role",
        success: false
      });
    }

    const tokenData = {
      userId: user._id,
      role: user.role
    };

    const token = jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: "1d" });

    return res
      .status(200)
      .cookie("token", token, {
        // expiresIn:"2d", 
        httpOnly: true,
        secure: true,                     
        // sameSite: "none",                 
      })
      .json({
        message: `Welcome back ${user.fullname}`,
        user: {
          _id: user._id,
          fullname: user.fullname,
          email: user.email,
          phoneNumber: user.phoneNumber,
          role: user.role,
          profile: user.profile
        },
        success: true
      });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false
    });
  }
};

// ---------------- LOGOUT ----------------
export const logout = async (req, res) => {
  try {
    return res.status(200)
      .cookie("token", "", { maxAge: 0 })
      .json({
        message: "Logged out successfully",
        success: true
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false
    });
  }
};

// ---------------- UPDATE PROFILE ----------------
// export const updateProfile = async (req, res) => {
//   try {
//     const { fullname, email, phoneNumber, bio, skills } = req.body;
//     const file = req.file;

   
//     let skillsArray;
//     if(skills){
//   user.profile.skills = skills.split(",");

//     }
//     const userId = req.id; // middleware will set req.id
//     let user = await User.findById(userId);

//     if (!user) {
//       return res.status(404).json({
//         message: "User not found",
//         success: false
//       });
//     }

//     // Update user data

//     if(fullname) user.fullname = fullname;
//     if(email) user.email = email;
//     if(phoneNumber) user.phoneNumber = phoneNumber;
//     if(bio) user.profile.bio = bio;
//     if(skills) user.profile.skillsArray = skillsArray;
   

//     if (file) {
//       user.profile.resume = file.path; // if resume upload implemented
//     }

//     await user.save();

//     const updatedUser = {
//       _id: user._id,
//       fullname: user.fullname,
//       email: user.email,
//       phoneNumber: user.phoneNumber,
//       role: user.role,
//       profile: user.profile
//     };

//     return res.status(200).json({
//       message: "Profile updated successfully",
//       user: updatedUser,
//       success: true
//     });

//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({
//       message: "Internal server error",
//       success: false
//     });
//   }
// };


export const updateProfile = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, bio, skills } = req.body;
    const file = req.file; // multer se uploaded file milti hai

    // 🔹 Console me uploaded file details dikhana (debugging ke liye)
    if (file) {
      console.log("Uploaded Resume File Details:", file);
    }

    const userId = req.id; // middleware sets req.id
    let user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false
      });
    }

    // 🔹 Update user fields
    if (fullname) user.fullname = fullname;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (bio) user.profile.bio = bio;
    if (skills) user.profile.skills = skills.split(",");

    // 🔹 If new resume uploaded — update path in DB
    if (file) {
      user.profile.resume = file.path; // store file path (like uploads/1731350588843.pdf)
      user.profile.resumeOriginalName = file.originalname;

    }

    await user.save();

    // 🔹 Create response object for frontend
    const updatedUser = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: {
        bio: user.profile.bio,
        skills: user.profile.skills,
        resume: user.profile.resume,
        resumeName: user.profile.resumeName || null, // frontend ke liye readable file name
      },
    };

    return res.status(200).json({
      message: "Profile updated successfully ",
      user: updatedUser,
      success: true
    });

  } catch (error) {
    console.log("Update profile error:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false
    });
  }
};


// ---------------- FORGOT PASSWORD ----------------
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required", success: false });
    }

    //  Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found", success: false });
    }

    //  Generate secure reset token
    const resetToken = crypto.randomBytes(20).toString("hex");

    //  Store hashed token and expiry in DB
    user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes

    await user.save({ validateBeforeSave: false });

    //  Create reset URL (frontend route)
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    // Email content
    const message = `
      <h3>Hello ${user.fullname || "User"},</h3>
      <p>You requested a password reset.</p>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}" target="_blank">${resetUrl}</a>
      <p><b>Note:</b> This link will expire in 15 minutes.</p>
    `;

    //  Send email via NodeMailer
    await sendEmail({
      email: user.email,
      subject: "Password Reset Request",
      message
    });

    return res.status(200).json({
      message: "Reset link sent to your email!",
      success: true
    });

  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false
    });
  }
};


/// ---------------- RESET PASSWORD ----------------
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: "Password is required", success: false });
    }

    //  Hash the token again to match the one in DB
    const resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex");

    //  Find user with valid token and non-expired link
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset token", success: false });
    }

    //  Hash and update new password
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;

    //  Clear reset fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    return res.status(200).json({
      message: "Password reset successful! Please login again.",
      success: true
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false
    });
  }
};



