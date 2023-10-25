import User from "../models/User";
import { Request, Response } from "express";
import TokenService from "../models/RefreshToken";
import bcrypt from "bcrypt";

const TokenGenerator = new TokenService();

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { first_name, last_name, email, password, phone_number } = req.body;

    if (!first_name || !last_name || !email || !password || !phone_number) {
      return res.status(400).json({ error: 'MISSING_USER_DATA' });
    }

    let oldUser = await User.getUserByEmail(email);

    if (oldUser) {
      return res.status(402).json({error: "DUPLICATE_USER_ENTRY"})
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const createdUser = await User.createNewUser(first_name, last_name, email, hashedPassword, phone_number);

    if (createdUser) {
      res.status(201).json(createdUser);
    } else {
      res.status(500).json({ error: 'INTERNAL_FUNCTION_ERROR' });
    }
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'INTERNAL_FUNCTION_ERROR' });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    let user = await User.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'USER_NOT_FOUND' });
    }
    else if (await bcrypt.compare(password, user.password!)) {
      return res.status(401).json({ error: 'INVALID_PASSWORD' });
    }

    await TokenService.replaceRefreshToken(user.id!);
    user = await User.getUserById(user.id!);
    res.status(200).json(user);
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ error: 'INTERNAL_SERVER_ERROR' });
  }
};

export const fetchUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.getUserById(parseInt(id, 10));
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user by id:', error);
    res.status(500).json({ error: 'INTERNAL_SERVER_ERROR' });
  }
}
