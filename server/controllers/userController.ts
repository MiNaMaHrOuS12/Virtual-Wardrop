import { Request, Response } from "express";
import { storage } from "../storage";
import { insertUserSchema } from "../../shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import bcrypt from "bcrypt";

export const registerUser = async (req: Request, res: Response) => {
  try {
    // Validate the request body
    const userData = insertUserSchema.parse(req.body);
    
    // Check if username already exists
    const existingUser = await storage.getUserByUsername(userData.username);
    if (existingUser) {
      return res.status(409).json({ message: "Username already exists" });
    }
    
    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
    
    // Create the user with hashed password
    const newUser = await storage.createUser({
      username: userData.username,
      password: hashedPassword,
    });
    
    // Return the user without the password
    const { password, ...userWithoutPassword } = newUser;
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    if (error instanceof ZodError) {
      const validationError = fromZodError(error);
      return res.status(400).json({ message: validationError.message });
    }
    
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Error registering user" });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    
    // Check if user exists
    const user = await storage.getUserByUsername(username);
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
    
    // Check password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
    
    // Set session
    if (req.session) {
      req.session.userId = user.id;
    }
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Error during login" });
  }
};

export const getUserProfile = async (req: Request, res: Response) => {
  try {
    // Check if user is authenticated
    if (!req.session || !req.session.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    // Get user from storage
    const user = await storage.getUser(req.session.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Return user without password
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Error fetching user profile" });
  }
};

export const logoutUser = (req: Request, res: Response) => {
  // Destroy the session
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Error logging out" });
      }
      
      res.json({ message: "Logged out successfully" });
    });
  } else {
    res.json({ message: "Logged out successfully" });
  }
};
