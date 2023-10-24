import User from "../models/User";
import { Request, Response } from "express";
import TokenService from "../models/RefreshToken";
import bcrypt from "bcrypt";

const TokenGenerator = new TokenService();

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { first_name, last_name, email, password, phone_number } = req.body;
    // Hash the user's password before saving it to the database
    const hashedPassword = await bcrypt.hash( password, 10);

    const createdUser = await User.createNewUser(first_name, last_name, email, hashedPassword, phone_number);

    if (createdUser) {
      // User registration successful
      res.status(201).json(createdUser);
    } else {
      // Error occurred during registration
      res.status(500).json({ error: 'User registration failed. Please try again.' });
    }
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    let user = await User.getUserByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password!))) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    await TokenService.replaceRefreshToken(user.id!);
    user = await User.getUserById(user.id!);
    res.status(200).json(user);
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const fetchUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.getUserById(parseInt(id, 10));
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user by id:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
