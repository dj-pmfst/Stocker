import { Controller, Get, Put, Body, Req, Param,ParseIntPipe  } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

 @Get()  
  findAll() {
    return this.userService.findAll();
  }

  @Get('me') 
  getProfile(@Req() req) {
    return this.userService.findOne(req.user.id);
  }

  @Get(':id') 
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }
  
  @Put('me')  
  updateProfile(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(req.user.id, updateUserDto);
  }
}
