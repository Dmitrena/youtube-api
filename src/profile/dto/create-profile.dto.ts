import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class CreateProfileDto {
  @IsString()
  name: string;

  @IsBoolean()
  isVerified: boolean;

  @IsNumber()
  subscribersCount: number;

  @IsString()
  description: string;

  @IsString()
  location: string;

  @IsString()
  bannerPath: string;

  @IsString()
  avatarPath: string;
}
