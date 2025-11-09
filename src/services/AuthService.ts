import { User, IUser } from '../models/User';
import { getPasswordValidationError } from '../utils/passwordValidator';
import jwt, { JsonWebTokenError, TokenExpiredError, NotBeforeError } from 'jsonwebtoken';

/**
 * JWT payload interface
 */
export interface JWTPayload {
  userId: string;
  username: string;
}

/**
 * Authentication service class for managing user registration and login
 */
export class AuthService {
  private readonly jwtSecret: string;
  private readonly jwtExpiresIn: string;

  constructor() {
    this.jwtSecret = process.env.JWT_SECRET || '';
    this.jwtExpiresIn = process.env.JWT_EXPIRES_IN || '';
    if (!this.jwtSecret) {
      throw new Error('JWT_SECRET is not set');
    }
    if (!this.jwtExpiresIn) {
      throw new Error('JWT_EXPIRES_IN is not set');
    }
  }

  /**
   * Register a new user
   * @param username - The username for the new user
   * @param email - The email for the new user
   * @param password - The password for the new user
   * @returns Promise<IUser> - The newly created user
   * @throws Error if validation fails or user already exists
   */
  public async registerUser(username: string, email: string, password: string): Promise<IUser> {

    const passwordError = getPasswordValidationError(password);
    if (passwordError) {
      throw new Error(passwordError);
    }


    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      if (existingUser.username === username) {
        throw new Error(`User with username "${username}" already exists`);
      }
      if (existingUser.email === email) {
        throw new Error(`User with email "${email}" already exists`);
      }
    }


    try {
      const newUser = new User({
        username,
        email,
        password,
      });

      await newUser.save();
      return newUser;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Registration failed: ${error.message}`);
      }
      throw new Error('Registration failed: Unknown error');
    }
  }

  /**
   * Login a user with username/email and password
   * @param usernameOrEmail - The username or email to login with
   * @param password - The password to verify
   * @returns Promise<{ user: IUser; token: string }> - The authenticated user and JWT token
   * @throws Error if credentials are invalid
   */
  public async loginUser(
    usernameOrEmail: string,
    password: string
  ): Promise<{ user: IUser; token: string }> {

    const user = await User.findOne({
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
    }).select('+password');

    if (!user) {
      throw new Error('Invalid credentials');
    }


    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }


    const payload: JWTPayload = {
      userId: user._id.toString(),
      username: user.username,
    };

    const token = jwt.sign(payload, this.jwtSecret, {
      expiresIn: this.jwtExpiresIn,
    } as jwt.SignOptions);


    const userObject = user.toObject();
    delete userObject.password;

    return {
      user: user as IUser,
      token,
    };
  }

  /**
   * Verify JWT token and return payload
   * @param token - The JWT token to verify
   * @returns JWTPayload - The decoded token payload
   * @throws Error if token is invalid
   */
  public verifyToken(token: string): JWTPayload {
    try {
      const decoded = jwt.verify(token, this.jwtSecret) as JWTPayload;
      
      if (!decoded.userId || !decoded.username) {
        throw new Error('Invalid token payload');
      }
      
      return decoded;
    } catch (error) {
      if (error instanceof JsonWebTokenError) {
        throw new Error(`Token error: ${error.message}`);
      }
      if (error instanceof TokenExpiredError) {
        throw new Error('Token has expired');
      }
      if (error instanceof NotBeforeError) {
        throw new Error('Token not active yet');
      }
      if (error instanceof Error) {
        throw new Error(`Token verification failed: ${error.message}`);
      }
      throw new Error('Invalid or expired token');
    }
  }

  /**
   * Get user by ID
   * @param userId - The user ID
   * @returns Promise<IUser | null> - The user if found
   */
  public async getUserById(userId: string): Promise<IUser | null> {
    return User.findById(userId);
  }
}
