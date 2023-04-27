import { Get, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

import * as bcrypt from 'bcrypt';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from './decorators/user.decorator';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  create(createUserDto: CreateUserDto) {
    return this.userRepository.save(createUserDto);
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find({
      select: { id: true, email: true },
      relations: { profile: true, videos: true },
    });
  }

  findByEmail(email: string) {
    return this.userRepository.findOneBy({ email });
  }

  findOne(id: string) {
    return this.userRepository.findOne({
      where: { id },
      select: { id: true, email: true },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const isSame = await this.findByEmail(updateUserDto.email);
    if (isSame && id !== isSame.id)
      throw new NotFoundException('Email is busy');

    const hashPassword = await bcrypt.hash(updateUserDto.password, 10);

    return this.userRepository.update(id, {
      ...updateUserDto,
      password: hashPassword,
    });
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async getMostPopular() {
    return await this.userRepository.find({
      relations: { profile: true },
      // loadRelationIds: true,
      take: 1,
      order: { profile: { subscribersCount: 'DESC' } },
    });
  }
}
