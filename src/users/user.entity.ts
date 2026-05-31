import {Entity , Column, PrimaryGeneratedColumn, BeforeInsert} from 'typeorm';
import * as bcryptjs from 'bcryptjs';
@Entity()
export class User{
    @PrimaryGeneratedColumn()
    id: number;
@Column({ unique: true})
email: string;

@Column()
password: string;
@BeforeInsert()
async hashPassword(){
   this.password = await bcrypt.hash(this.password, 10)
    
}
}