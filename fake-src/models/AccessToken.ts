import jwt from 'jsonwebtoken';
import User from './User';

class AccessTokenGenerator {
  private readonly secret: string = process.env.JWT_SECRET || 'hack_winner';
  private readonly expiresIn: string = '1h';

  public async generate(userId: number): Promise<string | null> {
    try {
        const user = await User.getUserById(userId);
        if (user) {
            const userWithoutPassword = { ...user.toJSON() };
            delete userWithoutPassword.password;
            const accessToken = jwt.sign({ user: userWithoutPassword }, this.secret, { expiresIn: this.expiresIn });
            return accessToken;
        }
        return null;
    } catch (error) {
        console.log('error:', error)
        return null;
    }
}
}

export default AccessTokenGenerator;