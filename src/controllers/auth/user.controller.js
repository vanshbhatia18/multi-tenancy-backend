import { User } from "../../models /user.model.js";
import { Tenant } from "../../models /tenant.model.js";

// Generate access and refresh tokens
const generatetoken= async (id) => {
  try {
    const user = await User.findById(id);
    const token = user.generateToken(user);
  
    return token ;
  } catch (error) {
    console.log(error);
  }
};

// Register User
export const registerUser = async (req, res) => {
  try {
    
    const {  email, password, tenantSlug,username } = req.body;
    const values = {  email, password, tenantSlug,username };
    
    // Validate input
    for (const [key, value] of Object.entries(values)) {
      if (!value || value?.trim() === "") {
        return res.status(400).json({
          success: false,
          message: `${key} is missing`,
        });
      }
    }
    
    // Check if user already exists
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: "User already exists", success: false });
    }

    // Find or create tenant
    let tenant = await Tenant.findOne({ slug: tenantSlug });
    if (!tenant) {
      tenant = await Tenant.create({
        name: tenantSlug.charAt(0).toUpperCase() + tenantSlug.slice(1),
        slug:tenantSlug,
        plan: "FREE",
      });
    }

    // Create user
    const user = await User.create({  email, password, tenantId: tenant._id ,username:username});

    const createdUser = await User.findById(user._id).select("-password").populate({
      path:"tenantId",
      select:"name"

    });
    if (!createdUser) {
      return res.status(500).json({
        message: "Something went wrong while creating user",
        success: false,
      });

    }

    // Generate tokens
    const token = await generatetoken(createdUser._id);

    

    return res
      .status(201).json({
       token:token,
        message: "User created successfully",
        success: true,
        data: createdUser,
      });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Some error occurred",
      success: false,
    });
  }
};

// Login User
export const loginUser = async (req, res) => {
  try {
    const { email, username, password } = req.body;

    // Validate input
    if (!(email || username)) {
      return res.status(400).json({
        message: "Email or username is required",
        success: false,
      });
    }

    const user = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Password is incorrect",
        success: false,
      });
    }

    const token = await generatetoken(user._id);

    const loggedInUser = await User.findById(user._id).select("-password").populate({
      path:"tenantId",
      select:"name"

    });;

    

  

    return res
      .status(200).json({
       token:token,
        data: loggedInUser,
        message: "User logged in successfully",
        success: true,
      });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Something went wrong",
      success: false,
    });
  }
};

// controllers/auth.controller.js
export const logoutUser = async (req, res) => {
  try {
    // On frontend, just remove token from storage
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

