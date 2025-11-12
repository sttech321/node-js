import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  changePassword,adddummyRecord, usersList,userDelete, createUser, updateUserById
} from "../controllers/userController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

/* -----------------------------------------------
   🧩 1. Ensure upload folder exists
-------------------------------------------------*/
const uploadDir = "uploads/avatars";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

/* -----------------------------------------------
   🧩 2. Configure multer
-------------------------------------------------*/
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // use timestamp + original extension
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    // ✅ Optional: filter only image uploads
    const allowedTypes = /jpeg|jpg|png|gif/;
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.test(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

/* -----------------------------------------------
   🧩 3. Routes
-------------------------------------------------*/
router.post("/register", registerUser);

router.post("/login", loginUser);
router.get("/profile", protect, getUserProfile);
router.put("/changePassword", protect, changePassword);

// ✅ updateProfile route with multer and JWT protection
router.put("/updateProfile", protect, upload.single("profileImage"), updateUserProfile);


router.post("/createUser",  protect, createUser);
router.put("/updateUser/:id",  protect, updateUserById);



router.get("/add-dummy-users", adddummyRecord);
router.get("/usersList", protect,usersList);
router.delete("/deleteUser/:id", protect, userDelete);


export default router;
