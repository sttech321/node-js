import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { faker } from "@faker-js/faker";




// Register
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  console.log("📩 Register endpoint hit");

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      console.log("⚠️ User already exists");
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });

    console.log("✅ User created:", user._id);

    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
    });
    
  } catch (error) {
    console.error("Register error:", error.message);
    res.status(500).json({ message: error.message });
  }
}

// Login
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "10m" });
    res.status(200).json({
      message: "Login successful",
      success:true,
      token,
      user: user,
    });
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get User Profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// User Profile update 
// Update Profile
export const updateUserProfile = async (req, res) => {
  try {

    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    // ✅ Handle text fields
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    // ✅ Handle file upload
    if (req.file) {
      user.avatar = `/uploads/avatars/${req.file.filename}`;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server error while updating profile" });
  }
};



export const changePassword = async (req, res) => {
   

  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    // ✅ Validate input
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "New passwords do not match" });
    }

    // ✅ Find user
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // ✅ Compare old password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Old password is incorrect" });
    }

    // ✅ Hash and update new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ message: "Server error while changing password" });
  }
};



export const adddummyRecord = async(req, res) => {

 try {
    const dummyUsers = [];

    for (let i = 0; i < 1000; i++) {
      dummyUsers.push({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password({ length: 8 }),
        phone: faker.phone.number(),
        avatar:faker.image.avatar(),
      });
    }

    await User.insertMany(dummyUsers);
    res.json({ success: true, message: "Dummy users added successfully", total: dummyUsers.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};




 

export const userDelete = async (req, res) => {
  try {
    const { id } = req.params; // get user ID from URL

    //  Check if user exists
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 🗑️ Delete the user
    await User.findByIdAndDelete(id);

    return res.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while deleting the user",
    });
  }
};



// Register
export const createUser = async (req, res) => {
  const { id, name, email, password, phone } = req.body;
  console.log("📩 update user endpoint hit");

  try {
    const userExists = await User.findOne({ id });
    if (userExists) {
      console.log("⚠️ User already exists");
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword, phone });

    console.log("✅ User created:", user._id);

    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
    });
    
  } catch (error) {
    console.error("Register error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const updateUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    // if (!mongoose.Types.ObjectId.isValid(userId)) {
    //   return res.status(400).json({ success: false, message: "Invalid user id." });
    // }

    const { name, email, password, phone } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found." });

    // If email provided and different, check uniqueness
    if (email && email !== user.email) {
      const existing = await User.findOne({ email });
      if (existing) return res.status(400).json({ success: false, message: "Email already in use." });
      user.email = email;
    }

    // Update other fields if provided
    if (typeof name !== "undefined") user.name = name;
    if (typeof phone !== "undefined") user.phone = phone;

    // Hash password only if provided (and non-empty)
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    // If you accept avatar uploads via multipart/form-data and middleware (e.g., multer)
    // if (req.file) user.avatar = `/uploads/${req.file.filename}`;

    const updated = await user.save();

    return res.json({
      success: true,
      message: "User updated successfully.",
      user: {
        id: updated._id,
        name: updated.name,
        email: updated.email,
        phone: updated.phone,
        avatar: updated.avatar,
        updatedAt: updated.updatedAt,
      },
    });
  } catch (err) {
    console.error("Update user error:", err);
    return res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};



export const usersList = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || ""; // get search keyword from query string

    // 🧠 Build search condition (caseinsensitive)
    const searchCondition = search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
            { phone: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const options = {
      page,
      limit,
      sort: { createdAt: -1 },
      select: "name email phone avatar createdAt",
    };

    const result = await User.paginate(searchCondition, options);

    res.json({
      success: true,
      data: result.docs,
      pagination: {
        totalDocs: result.totalDocs,
        totalPages: result.totalPages,
        page: result.page,
        hasNextPage: result.hasNextPage,
        hasPrevPage: result.hasPrevPage,
      },
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ success: false, message: "Failed to fetch users" });
  }
};