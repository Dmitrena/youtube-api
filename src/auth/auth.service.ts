import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { RefreshToken } from './entities/refresh-token.entity';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectRepository(RefreshToken)
    private refreshRepository: Repository<RefreshToken>,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    // const password = await argon2.verify(user.password, pass);
    const password = await bcrypt.compare(pass, user.password);
    if (user && password) {
      return user;
    }
    return null;
  }

  async createRefreshToken(userId: string): Promise<RefreshToken> {
    const refreshToken = await this.refreshRepository.save({
      createdAt: new Date(),
      userId: userId,
    });

    return refreshToken;
  }

  async findRefreshTokenById(tokenId: string): Promise<RefreshToken> {
    const token = await this.refreshRepository.findOneBy({ id: tokenId });

    return token;
  }

  async login(user: CreateUserDto) {
    const userData = await this.usersService.findByEmail(user.email);
    if (!userData) throw new BadRequestException('Uncorrected data');

    const payload = {
      userId: userData.id,
      email: userData.email,
    };
    const refreshToken = await this.createRefreshToken(userData.id);
    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: refreshToken.id,
    };
  }

  async refresh(token: string) {
    const refreshToken = await this.findRefreshTokenById(token);
    if (!refreshToken) {
      throw new BadRequestException('INVALID_REFRESH_TOKEN');
    }
    const user = await this.usersService.findOne(refreshToken.userId);

    return this.login({ email: user.email, password: user.password });
  }

  async signUp(createUserDto: CreateUserDto) {
    const existUser = await this.usersService.findByEmail(createUserDto.email);
    if (existUser) throw new BadRequestException('User already exists');
    // Hash Password
    const hashPass = await bcrypt.hash(createUserDto.password, 10);
    const newUser = await this.usersService.create({
      ...createUserDto,
      password: hashPass,
    });
    const payload = {
      userId: newUser.id,
      email: newUser.email,
    };
    const refreshToken = await this.createRefreshToken(newUser.id);
    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: refreshToken.id,
    };
  }
}
