import { Public } from './../common/decorators/public.decorator';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';

import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from '../common/guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async signIn(@Request() req) {
    return this.authService.login(req.user);
  }
  @Public()
  @Post('signup')
  async signUp(@Body() userDto: CreateUserDto) {
    return this.authService.signUp(userDto);
  }
  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  async refresh(@Body() token: { refresh_token: string }) {
    return this.authService.findRefreshTokenById(token.refresh_token);
  }
}
