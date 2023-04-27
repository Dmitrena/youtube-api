import { IsEmail, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;
  @Length(6, 16)
  @IsString()
  password: string;
}
