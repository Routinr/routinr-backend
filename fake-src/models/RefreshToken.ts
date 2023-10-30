// import jwt from 'jsonwebtoken'
// import User from './User';

// const jwtSecret = process.env.JWT_SECRET || 'secret';

// class TokenService {

//     public  static async replaceRefreshToken(id: number): Promise<void> {
//         try {
//             const token = jwt.sign({ id }, jwtSecret, { expiresIn: '7d' });
//             await User.updateRefreshToken(id, token);
//         } catch (error) {
//             console.error('Error deleting token:', error);
//         }
//     }

//     public static async createRefreshToken(userId: number): Promise<void> {

//         try {
//             const token = jwt.sign({ userId }, jwtSecret, { expiresIn: '7d' });
//             const newToken = await User.updateRefreshToken(userId, token);
//         } catch (error) {
//            console.log("Error creating token:", error)
//            return;
//         }
    
//     }

//     public static async getRefreshToken(userId: number): Promise<string> {
//         const token = jwt.sign({ userId }, jwtSecret, { expiresIn: '7d' });
//         return token;
//     }

//     public async checkTokenValidity(token: string): Promise<boolean> {
//         try {
//             const decoded = jwt.verify(token, jwtSecret);
//             return true
//         } catch (error) {
//             console.error('Error checking token expiry:', error);
//             return false;
//         }    
    
//     }

//     static async getRefreshTokenByUserId(userId: number): Promise<string | null> {
//         try {
//             const token = await User.getRefreshToken(userId);
//             return token;
//         } catch (error) {
//             console.error('Error fetching token:', error);
//             return null;
//         }
//     }


//     // public  static async replaceAccessToken(id: number): Promise<void> {
//     //     try {
//     //         const token = jwt.sign({ id }, jwtSecret, { expiresIn: '1d' });
//     //         await User.updateRefreshToken(id, token);
//     //     } catch (error) {
//     //         console.error('Error deleting token:', error);
//     //     }
//     // }

//     // public static async createAccessToken(userId: number): Promise<void> {

//     //     try {
//     //         const token = jwt.sign({ userId }, jwtSecret, { expiresIn: '1d' });
//     //         const newToken = await User.updateRefreshToken(userId, token);
//     //     } catch (error) {
//     //        console.log("Error creating token:", error)
//     //        return;
//     //     }
    
//     // }

//     // public static async getAccessToken(userId: number): Promise<string> {
//     //     const token = jwt.sign({ userId }, jwtSecret, { expiresIn: '1d' });
//     //     return token;
//     // }

//     // static async getAccessTokenByUserId(userId: number): Promise<string | null> {
//     //     try {
//     //         const token = await User.getRefreshToken(userId);
//     //         return token;
//     //     } catch (error) {
//     //         console.error('Error fetching token:', error);
//     //         return null;
//     //     }
//     // }

// }

// export default TokenService;


import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db';
import jwt from 'jsonwebtoken'

const jwtSecret = process.env.JWT_SECRET || 'secret';

class RefreshToken extends Model {
    public id!: number;
    public token!: string;
    private userId!: number;

    static associate(models: any) {
        RefreshToken.belongsTo(models.User, { foreignKey: 'userId' });
    }

    public async destroyToken(): Promise<void> {
        try {
            await this.destroy();
        } catch (error) {
            console.error('Error deleting token:', error);
        }
    }

    public static async createToken(userId: number): Promise<RefreshToken | null> {

        try {
            const token = jwt.sign({ userId }, jwtSecret, { expiresIn: '7d' });
            const newToken = await RefreshToken.create({
                userId,
                token
              });
            return newToken;    
        } catch (error) {
           console.log("Error creating token:", error)
           return null;
        }
    
    }

    public async checkTokenValidity(): Promise<boolean> {
        try {
            const decoded = jwt.verify(this.token, jwtSecret);
            return true;
        } catch (error) {
            console.error('Error checking token expiry:', error);
            return false;
        }    
    
    }

    static async getTokenByUserId(userId: number): Promise<RefreshToken | null> {
        try {
            const token = await RefreshToken.findOne({ where: { userId } });
            return token;
        } catch (error) {
            console.error('Error fetching token:', error);
            return null;
        }
    }

}

RefreshToken.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    token: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'RefreshToken',
    tableName: 'refresh_tokens',
    timestamps: false 
});

export default RefreshToken;