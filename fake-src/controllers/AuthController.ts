import User from "../models/User";
import { Request, Response } from "express";
import RefreshToken from "../models/RefreshToken";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import { sendEmail } from "../utils/email";
import AccessTokenGenerator from "../models/AccessToken";

const jwtSecret = process.env.JWT_SECRET || 'dumb';

const AGT = new AccessTokenGenerator();

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { first_name, last_name, username, email, password, phone_number } = req.body;

    if (!first_name || !last_name || !username || !email || !password || !phone_number) {
      return res.status(400).json({ error: 'MISSING_USER_DATA' });
    }

    let oldUser = await User.getUserByIdentifier(email);

    if (oldUser) {
      return res.status(409).json({error: "DUPLICATE_USER_ENTRY"})
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const createdUser = await User.createAccount(first_name, last_name, username, email, hashedPassword, phone_number, false);

    if (createdUser && createdUser.id !== undefined) {
      const token = RefreshToken.createToken(createdUser.id);
      const accessToken = await AGT.generate(createdUser.id);
      res.status(201).json({ message: "Account created successfully! Please verify your email then go through the onboarding stages.", token: accessToken, isEmailVerified: false });
    } else {
      res.status(500).json({ error: 'INTERNAL_FUNCTION_ERROR' });
    }
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'INTERNAL_FUNCTION_ERROR' });
  }
};

export async function tokenVerification(req: Request, res: Response, next: Function) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'TOKEN_NOT_FOUND_IN_HEADER' });
  }

  try {
    const decodedToken = jwt.decode(token) as { exp: number; user: { id: number } };
    const expDate = decodedToken?.exp;
    const userId = decodedToken?.user.id;

    if (!expDate) {
      return res.status(401).json({ error: 'INVALID_TOKEN_EXPIRATION' });
    }

      if (expDate < Math.floor(Date.now() / 1000)) {
        const refreshToken = await RefreshToken.getTokenByUserId(userId);

        if (refreshToken) {
          const tokenIsValid = await refreshToken.checkTokenValidity();

          if (tokenIsValid) {
            const accessToken = await AGT.generate(userId);

              res.setHeader('Authorization', `Bearer ${accessToken}`);
              return next();
            } else {
              return res.status(404).json({ error: 'USER_NOT_FOUND' });
            }
        } else {
            return res.status(401).json({ error: 'INVALID_REFRESH_TOKEN' });
         }
      } else {
         return next();
      }
    }
  catch (error) {
    console.error('Error in tokenVerification:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }

}

export async function loginUser(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body;
  try {
    let user = await User.getUserByIdentifier(email);
    if (user) {
      if (await user.checkPassword(password)) {

        // Retrieve the user's ID
        const userId = user.id;


        const existingRefreshToken = await RefreshToken.findOne({
          where: {
            userId,
          },
        });

        // If there's an existing refresh token, delete it
        if (existingRefreshToken) {
          await existingRefreshToken.destroyToken();
        }
        if (userId) {
          const accessToken = await AGT.generate(userId);
          const refreshToken = RefreshToken.createToken(userId);
          res.status(200).json({ message: 'Login successful', accessToken });
        }
      } else {
        res.status(401).json({ error: 'Invalid password' });
      }
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
}

export async function startVerifyUserEmail(req: Request, res: Response): Promise<void> {
  const { userId, email } = req.body;
  const verifyToken = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
  const verifyLink = jwt.sign({ userId, verifyToken }, jwtSecret, { expiresIn: '12m' });
  const emailText = `<h1>Welcome to Routinr!</h1><p>To verify your email, click on the link below:</p><p><a href="http://relisted-labels-frontend.vercel.app/verifyEmail/?token=${verifyLink}">Verify Email</a></p>. This token expires in 10 minutes, btw. Goodluck!`;
  try {
    await sendEmail(email, 'Verify your email', emailText);
    res.status(200).json({ message: 'EMAIL_SENT' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'INTERNAL_SERVER_ERROR' });
  }
}

export async function endVerifyUserEmail(req: Request, res: Response): Promise<void> {
  const { verifyToken, userId } = req.body;
  try {
    const decodedToken = jwt.verify(verifyToken, jwtSecret) as { userId: number; verifyToken: string, exp: number };
    const now = Math.floor(Date.now() / 1000);

    if (decodedToken.userId === userId && decodedToken.verifyToken && decodedToken.exp > now) {
      const user = await User.getUserById(userId);
      if (user) {
        user.verifyUserEmail();
        res.status(200).json({ message: 'EMAIL_VERIFIED' });
      }
      console.log("Token Valid!")
    } else {
      console.log("Token Invalid.")
      res.status(400).json({ message: 'INVALID_EXPIRED_TOKEN' });
    }
  } catch (error) {
    console.error('Error verifying email:', error);
    res.status(500).json({ error: 'INVALID_EXPIRED_TOKEN' });
  }
}

export async function forgotPassword(req: Request, res: Response) {
  const { email } = req.body;
  const user = await User.findOne({ where: { email } });
  if (user) {
    const userId = user.getId()
    const resetToken = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
    const resetLink = jwt.sign({ userId, resetToken }, jwtSecret, { expiresIn: '12m' });

    const emailText = `Hi there! A little birdie from Routinr told me you forgot your password. No worries, we're here to help!

    To reset your password, click on the link below:<br><br>
    <a href="https://relisted-labels-frontend.vercel.app/resetPassword?token=${resetLink}">Reset Password</a><br><br>
    
    This link will expire in 10 minutes, so don't wait too long! If you didn't request this password reset, please ignore this email.
    
    Thanks,
    Alex from Routinr
    `;
    
    try {
      await sendEmail(email, 'Reset Password - Routinr', emailText);
      return res.status(200).json({ message: 'EMAIL_SENT' });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'ERROR_SENDING_EMAIL' });
    }
  } else{
  return res.status(404).json({ message: 'USER_NOT_FOUND' });
  }
}

export async function resetPassword(req: Request, res: Response) {
  let { token, password } = req.body;
  try {
    const decodedToken = jwt.verify(token, jwtSecret) as { userId: number; resetToken: string, exp: number };
    const now = Math.floor(Date.now() / 1000);

    if (decodedToken.userId && decodedToken.resetToken && decodedToken.exp > now) {
      const user = await User.getUserById(decodedToken.userId);
      if (user) {
        const userId = user.getId();
        if (!userId) {
          res.status(500).json({error: "User ID not found."})
        } else {
          const refreshToken = await RefreshToken.getTokenByUserId(userId);
          if (refreshToken) {
            await refreshToken.destroyToken();
          }
        }
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        user.updatePassword(hashedPassword);
        res.status(200).json({ message: 'Password reset successfully. Please log in again.' });
      }
    } else {
      res.status(400).json({ message: 'Invalid or expired token. Please try again.' });
    }
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ message: 'An error occurred' });
  };
}

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
