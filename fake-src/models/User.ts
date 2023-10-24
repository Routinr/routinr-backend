import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class User {
  id: number | undefined;
  first_name: string | undefined;
  last_name: string | undefined;
  email: string | undefined;
  password: string | undefined;
  is_email_verified: boolean | undefined;
  phone_number: string | undefined;
  refresh_token: string | null = null;

  constructor(data: any) {
    this.id = data.id;
    this.first_name = data.first_name;
    this.last_name = data.last_name;
    this.email = data.email;
    this.password = data.password;
    this.is_email_verified = data.is_email_verified;
    this.phone_number = data.phone_number;
    this.refresh_token = data.refresh_token;
  }

/**
   * createNewUser: Creates a new user
   * @param userData Object containing user data
   * @returns Promise<User | null> A promise that resolves to the created user or null if an error occurs
   */
public static async createNewUser(first_name: string, last_name: string, email: string, password: string, phone_number: string): Promise<User | null> {
    try {
      const createdUser = await prisma.user.create({
        data: {
          first_name: first_name,
          last_name: last_name,
          email: email,
          password: password,
          is_email_verified: false,
          phone_number: phone_number,
          refresh_token: null
        },
      });
      return new User(createdUser);
    } catch (error) {
      console.error('Error creating user:', error);
      return null;
    }
  }

  public static async updateRefreshToken(id: number, refreshToken: string): Promise<boolean> {
    try {
      await prisma.user.update({
        where: { id },
        data: { refresh_token: refreshToken },
      });
      return true;
    } catch (error) {
      console.error('Error updating refresh token:', error);
      return false;
    }
  }

  public static async getRefreshToken(id: number): Promise<string | null> {
    try {
      const refreshToken = await prisma.user.findUnique({
        where: { id },
        select: {
          refresh_token: true,
        },
      });
      return refreshToken ? refreshToken.refresh_token : null;
    } catch (error) {
      console.error('Error fetching refresh token:', error);
      return null;
    }
  }

  public static async getUserById(id: number): Promise<User | null> {
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: id,
        },
      });
      return user ? new User(user) : null;
    } catch (error) {
      console.error('Error fetching user by id:', error);
      return null;
    }
  }

  public async verifyUserEmail(): Promise<boolean> {
    try {
      await prisma.user.update({
        where: {
          id: this.id,
        },
        data: {
          is_email_verified: true,
        },
      });
      this.is_email_verified = true;
      return true;
    } catch (error) {
      console.error('Error verifying user email:', error);
      return false;
    }
  }

  public async updateEmail(newEmail: string): Promise<boolean> {
    try {
      await prisma.user.update({
        where: {
          id: this.id,
        },
        data: {
          email: newEmail,
        },
      });
      this.email = newEmail;
      return true;
    } catch (error) {
      console.error('Error updating email:', error);
      return false;
    }
  }

  public async updatePassword(newPassword: string): Promise<boolean> {
    try {
      await prisma.user.update({
        where: {
          id: this.id,
        },
        data: {
          password: newPassword,
        },
      });
      this.password = newPassword;
      return true;
    } catch (error) {
      console.error('Error updating password:', error);
      return false;
    }
  }

  public static async getUserByEmail(email: string): Promise<User | null> {
    try {
      const user = await prisma.user.findUnique({
        where: {
          email: email,
        },
      });
      return user ? new User(user) : null;
    } catch (error) {
      console.error('Error fetching user by email:', error);
      return null;
    }
  }

  public async deleteAccount(): Promise<boolean> {
    try {
      await prisma.user.delete({
        where: {
          id: this.id,
        },
      });
      return true;
    } catch (error) {
      console.error('Error deleting account:', error);
      return false;
    }
  }

  public async checkPassword(password: string): Promise<boolean> {
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: this.id,
        },
      });
      if (user) {
        return user.password === password;
      }
      return false;
    } catch (error) {
      console.error('Error comparing passwords:', error);
      return false;
    }
  }

  public static async getUserByIdentifier(identifier: string): Promise<User | null> {
    try {
      const user = await prisma.user.findFirst({
        where: {
          OR: [
            {
              email: identifier,
            },
            {
              first_name: identifier,
            },
            {
              last_name: identifier,
            },
          ],
        },
      });
      return user ? new User(user) : null;
    } catch (error) {
      console.error('Error fetching user by identifier:', error);
      return null;
    }
  }

}


export default User;