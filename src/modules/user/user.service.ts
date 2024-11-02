import { Inject, Injectable, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UserDto } from './dto/user.dto';
import { CustomRequest } from 'src/common/interface/user.interface';
import { REQUEST } from '@nestjs/core';

@Injectable({ scope: Scope.REQUEST })
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @Inject(REQUEST) private request: CustomRequest,
  ) {}
  async create(userDto: UserDto) {
    const { firstName, lastName, mobile } = userDto;
    const { id } = this.request.user;
    const userMobile = this.findUserByMobile(mobile);
    const userId = this.userRepository.findOneBy({ id });
    if (userMobile && id === userId) {
      const user = this.userRepository.create({
        firstName,
        lastName,
        mobile,
      });
      await this.userRepository.save(user);
      return {
        message: 'info is created:)',
      };
    }
  }
  async findUserByMobile(mobile: string) {
    return this.userRepository.findOneBy({ mobile });
  }
  async findOneById(id: number) {
    return await this.userRepository.findOneBy({ id });
  }
}
