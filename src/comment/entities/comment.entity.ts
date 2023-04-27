import { User } from 'src/users/entities/user.entity';
import { Video } from 'src/video/entities/video.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @ManyToOne(() => User, (user) => user.comments)
  user: User;
  @ManyToOne(() => Video, (video) => video.comments)
  video: Video;

  @Column()
  message: string;
}
