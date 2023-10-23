import jwt from 'jsonwebtoken'
import User from './User';

const jwtSecret = process.env.JWT_SECRET || 'secret';

class TokenService {

    public  static async replaceRefreshToken(id: number): Promise<void> {
        try {
            const token = jwt.sign({ id }, jwtSecret, { expiresIn: '7d' });
            await User.updateRefreshToken(id, token);
        } catch (error) {
            console.error('Error deleting token:', error);
        }
    }

    public static async createRefreshToken(userId: number): Promise<void> {

        try {
            const token = jwt.sign({ userId }, jwtSecret, { expiresIn: '7d' });
            const newToken = await User.updateRefreshToken(userId, token);
        } catch (error) {
           console.log("Error creating token:", error)
           return;
        }
    
    }

    public static async getRefreshToken(userId: number): Promise<string> {
        const token = jwt.sign({ userId }, jwtSecret, { expiresIn: '7d' });
        return token;
    }

    public async checkTokenValidity(token: string): Promise<boolean> {
        try {
            const decoded = jwt.verify(token, jwtSecret);
            return true
        } catch (error) {
            console.error('Error checking token expiry:', error);
            return false;
        }    
    
    }

    static async getRefreshTokenByUserId(userId: number): Promise<string | null> {
        try {
            const token = await User.getRefreshToken(userId);
            return token;
        } catch (error) {
            console.error('Error fetching token:', error);
            return null;
        }
    }


    // public  static async replaceAccessToken(id: number): Promise<void> {
    //     try {
    //         const token = jwt.sign({ id }, jwtSecret, { expiresIn: '1d' });
    //         await User.updateRefreshToken(id, token);
    //     } catch (error) {
    //         console.error('Error deleting token:', error);
    //     }
    // }

    // public static async createAccessToken(userId: number): Promise<void> {

    //     try {
    //         const token = jwt.sign({ userId }, jwtSecret, { expiresIn: '1d' });
    //         const newToken = await User.updateRefreshToken(userId, token);
    //     } catch (error) {
    //        console.log("Error creating token:", error)
    //        return;
    //     }
    
    // }

    // public static async getAccessToken(userId: number): Promise<string> {
    //     const token = jwt.sign({ userId }, jwtSecret, { expiresIn: '1d' });
    //     return token;
    // }

    // static async getAccessTokenByUserId(userId: number): Promise<string | null> {
    //     try {
    //         const token = await User.getRefreshToken(userId);
    //         return token;
    //     } catch (error) {
    //         console.error('Error fetching token:', error);
    //         return null;
    //     }
    // }

}

export default TokenService;