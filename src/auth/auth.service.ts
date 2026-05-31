import { Injectable } from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import{UsersService} from '../users/users.service';
import * as bcryptjs from 'bcryptjs';

@Injectable()
export class AuthService {
    constructor (
        private usersService: UsersService,
        private jwtService: JwtService,
    ){}
}
