import { DataTypes, Model } from 'sequelize';
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

  static associate(models: any) {
    User.hasMany(models.Routine, {
      foreignKey: 'user_id',
      as: 'routines'
    })
    User.hasMany(models.Task, {
      foreignKey: 'user_id',
      as: 'tasks'
    })
    User.hasMany(models.Category, {
      foreignKey: 'user_id',
      as: 'categories'
    })
  }

  getId(): number | null {
    return this.id ? this.id : null;
  }

  getFirstName(): string {
    return this.first_name? this.first_name : '';
  }

  /**
   * Creates a new user account.
   *
   * @param {string} first_name - The first name of the user.
   * @param {string} last_name - The last name of the user.
   * @param {string} username - The username of the user.
   * @param {string} email - The email address of the user.
   * @param {string} password - The password of the user.
   * @param {number} phone_number - The phone number of the user.
   * @param {boolean} is_email_verified - Indicates whether the user's email is verified or not.
   * @return {Promise<User | null>} The newly created user account or null if an error occurred.
   */
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

  /**
   * Returns the email associated with the object.
   *
   * @return {string} The email value, or an empty string if it is null or undefined.
   */
  getEmail(): string {
    return this.email? this.email : '';
  }

    /**
     * Retrieves a user by their ID.
     *
     * @param {number} id - The ID of the user to retrieve.
     * @returns {Promise<User | null>} A promise that resolves with the user object if found, or null if not found.
     */
    static async getUserById(id: number): Promise<User | null> {
      try {
        const user = await User.findByPk(id);
        return user;
      } catch (error) {
        console.error('Error fetching user by id:', error);
        return null;
      }
    }

    /**
     * Verifies the user's email address.
     *
     * @return {Promise<boolean>} A boolean indicating whether the email was successfully verified.
     */
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


  /**
   * Updates the email address for the user.
   *
   * @param {string} newEmail - The new email address.
   * @return {Promise<boolean>} A promise that resolves to true if the email is updated successfully, or false otherwise.
   */
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

  /**
   * Updates the password of the user.
   *
   * @param {string} newPassword - The new password to be set.
   * @return {Promise<boolean>} - A Promise that resolves to true if the password is updated successfully, 
   * false otherwise.
   */
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

  /**
   * Deletes the account.
   *
   * @return {Promise<boolean>} - Returns a promise that resolves to a boolean value indicating whether the account was successfully deleted or not.
   */
  async deleteAccount(): Promise<boolean> {
    try {
      await this.destroy();
      return true;
    } catch (error) {
      console.error('Error deleting account:', error);
      return false;
    }
  }

  /**
   * Checks if the provided password matches the stored password.
   *
   * @param {string} password - The plaintext password to check.
   * @return {Promise<boolean>} Returns a promise that resolves to a boolean value indicating whether the password matches or not.
   */
  async checkPassword(password: string): Promise<boolean> {
    try {
      return await bcrypt.compare(password, this.dataValues.password);
    } catch (error) {
      console.error('Error comparing passwords:', error);
      return false;
    }
  }


  /**
   * Retrieves a user by their identifier.
   *
   * @param {string} identifier - The email or username of the user.
   * @return {Promise<User | null>} The user object if found, otherwise null.
   */
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