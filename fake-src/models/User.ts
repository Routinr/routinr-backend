import { Sequelize, DataTypes, Model } from 'sequelize';
import bcrypt from 'bcrypt';

import sequelize from '../config/db';

class User extends Model {
  id?: number | undefined;
  first_name: string | undefined;
  last_name: string | undefined;
  username: string | undefined;
  email: string | undefined;
  password: string | undefined;
  is_email_verified: boolean | undefined;
  phone_number: string | undefined;


  getId(): number | null {
    return this.id ? this.id : null;
  }

  getFirstName(): string {
    return this.first_name? this.first_name : '';
  }

  static async createAccount(first_name: string, last_name: string, username: string, email: string, password: string, phone_number: number, is_email_verified: boolean): Promise<User | null> {
    try {
      const newUser = await User.create({
        first_name,
        last_name,
        username,
        email,
        password,
        is_email_verified,
        phone_number
      });

      return newUser;
    } catch (error) {
      console.error('Error creating user account:', error);
      return null;
    }
  }

  getEmail(): string {
    return this.email? this.email : '';
  }

    static async getUserById(id: number): Promise<User | null> {
      try {
        const user = await User.findByPk(id);
        return user;
      } catch (error) {
        console.error('Error fetching user by id:', error);
        return null;
      }
    }

    async verifyUserEmail(): Promise<boolean> {
      try {
        this.is_email_verified = true;
        await this.save();
        return true;
      } catch (error) {
        console.error('Error verifying user email:', error);
        return false;
      }
    }


  async updateEmail(newEmail: string): Promise<boolean> {
    try {
      this.email = newEmail;
      await this.save();
      return true;
    } catch (error) {
      console.error('Error updating email:', error);
      return false;
    }
  }

  async updatePassword(newPassword: string): Promise<boolean> {
    try {
      this.password = newPassword;
      await this.save();
      return true;
    } catch (error) {
      console.error('Error updating password:', error);
      return false;
    }
  }

  async deleteAccount(): Promise<boolean> {
    try {
      await this.destroy();
      return true;
    } catch (error) {
      console.error('Error deleting account:', error);
      return false;
    }
  }

  async checkPassword(password: string): Promise<boolean> {
    try {
      return await bcrypt.compare(password, this.dataValues.password);
    } catch (error) {
      console.error('Error comparing passwords:', error);
      return false;
    }
  }


  static async getUserByIdentifier(identifier: string): Promise<User | null> {
    try {
      const condition = identifier.includes('@') ? { email: identifier } : { username: identifier };
      const user = await User.findOne({ where: condition });
  
      return user;
    } catch (error) {
      console.error('Error fetching user by identifier:', error);
      return null;
    }
  }
}

User.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  first_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  last_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  is_email_verified: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  phone_number: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  sequelize: sequelize,
  tableName: 'users',
  timestamps: false,
})

export default User;