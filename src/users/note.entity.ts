import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('Todo') // Explicitly use "Todo" table name
export class Todo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text', name: 'description' }) // Use "description" instead of content
  description: string;

  @Column({ default: false })
  completed: boolean;

  @Column({ nullable: true })
  priority: string;

  @Column({ type: 'timestamp', nullable: true, name: 'dueDate' })
  dueDate: Date;

  // Keep optional color and isPinned for backward compatibility with frontend
  @Column({ default: false })
  isPinned: boolean;

  @Column({ nullable: true })
  color: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Virtual getter/setter for backward compatibility with frontend
  get content(): string {
    return this.description;
  }

  set content(value: string) {
    this.description = value;
  }
}
