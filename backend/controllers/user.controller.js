import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

// Register a new user
export const register = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, password, role, bio, skills } =
      req.body;

    // Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists with this email" });
    }

    // Encrypt password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Prepare user profile
    const profile = {
      bio: bio || "",
      skills: skills ? skills.split(",") : [],
    };

    // Handle resume upload
    if (req.files && req.files.resume) {
      const resumeFile = req.files.resume[0];
      const dataUri = getDataUri(resumeFile);
      const cloudinaryResponse = await cloudinary.uploader.upload(
        dataUri.content,
        {
          resource_type: "raw", // For PDF/Doc files
          folder: "resumes",
        }
      );

      profile.resume = cloudinaryResponse.secure_url;
      profile.resumeOriginalName = resumeFile.originalname;
    }

    // Handle profile photo upload
    if (req.files && req.files.profilePhoto) {
      const profilePhotoFile = req.files.profilePhoto[0];
      const dataUri = getDataUri(profilePhotoFile);
      const cloudinaryResponse = await cloudinary.uploader.upload(
        dataUri.content,
        {
          folder: "profile_photos",
        }
      );

      profile.profilePhoto = cloudinaryResponse.secure_url;
    }

    // Create new user
    const newUser = new User({
      fullname,
      email,
      phoneNumber,
      password: hashedPassword,
      role,
      profile,
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Log in a user
export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({
        message: "All fields are required.",
        success: false,
      });
    }

    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Incorrect email or password.",
        success: false,
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        message: "Incorrect email or password.",
        success: false,
      });
    }

    if (role !== user.role) {
      return res.status(400).json({
        message: "Account doesn't exist with the specified role.",
        success: false,
      });
    }

    const tokenData = { userId: user._id };
    const token = await jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    user = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
      })
      .json({
        message: `Welcome back, ${user.fullname}!`,
        user,
        success: true,
      });
  } catch (error) {
    console.log(error);
  }
};

// Log out a user
export const logout = async (req, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "Logged out successfully.",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

// Get user profile
export const getProfile = async (req, res) => {
  try {
    const userId = req.id;

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({
        message: "User not found.",
        success: false,
      });
    }

    const userData = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };

    return res.status(200).json({
      message: "Profile fetched successfully.",
      user: userData,
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An error occurred while fetching the profile.",
      error: error.message,
      success: false,
    });
  }
};

// Update user profile
export const updateProfile = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, bio, skills } = req.body;

    const userId = req.id;
    let user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
        success: false,
      });
    }

    // Handle file uploads
    let uploadedResume = req.files?.resume?.[0];
    let uploadedPhoto = req.files?.profilePhoto?.[0];

    if (uploadedResume) {
      const fileUri = getDataUri(uploadedResume);
      const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
      user.profile.resume = cloudResponse.secure_url;
      user.profile.resumeOriginalName = uploadedResume.originalname;
    }

    if (uploadedPhoto) {
      const photoUri = getDataUri(uploadedPhoto);
      const photoResponse = await cloudinary.uploader.upload(photoUri.content);
      user.profile.profilePhoto = photoResponse.secure_url;
    }

    // Dynamically update fields
    const updates = { fullname, email, phoneNumber };
    const profileUpdates = { bio };

    if (skills) {
      profileUpdates.skills = skills.split(",").map((skill) => skill.trim());
    }

    // Apply updates to user fields
    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) {
        user[key] = value;
      }
    }

    // Apply updates to profile fields
    for (const [key, value] of Object.entries(profileUpdates)) {
      if (value !== undefined) {
        user.profile[key] = value;
      }
    }

    await user.save();

    const updatedUser = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };

    return res.status(200).json({
      message: "Profile updated successfully.",
      user: updatedUser,
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An error occurred while updating the profile.",
      error: error.message,
      success: false,
    });
  }
};
