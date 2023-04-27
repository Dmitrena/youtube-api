import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'user_profile' })
export class Profile {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column()
  name: string;

  @Column()
  isVerified: boolean;

  @Column()
  subscribersCount?: number;

  @Column()
  description: string;

  @Column()
  location: string;

  @Column()
  bannerPath: string;

  @Column()
  avatarPath: string;
}
