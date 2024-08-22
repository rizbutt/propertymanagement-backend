import UserRepository from '../repositories/auth_repository';;
import { isValidEmail } from '../utils/validation_util';
import bcrypt from 'bcrypt';
import User from '../models/user_model';
import { IUser } from '@/types/models_types/user_type';

class AuthService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

 
  async register(registerData:IUser): Promise<IUser> {
    
    if (!isValidEmail(registerData.email)) {
      throw new Error('Invalid email format');
    }

    const existingUser = await this.userRepository.findByEmail(registerData.email);
    if (existingUser) {
      throw new Error('Email already in use');
      
    }

    const hashedPassword = await bcrypt.hash(registerData.password, 10);
    const newUser = new User({ ...registerData, password: hashedPassword });
    await newUser.save();
    return newUser;
  }
  


  async login(loginDTO: { email: string; password: string }): Promise<IUser> {

    if (!isValidEmail(loginDTO.email)) {
      throw new Error('Invalid email format');
    }

    const user = await this.userRepository.findByEmail(loginDTO.email);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    
    const isMatch = await bcrypt.compare(loginDTO.password,user.password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    return user;
  }
}


export default AuthService;