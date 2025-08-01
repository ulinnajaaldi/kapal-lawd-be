import { createId } from '@paralleldrive/cuid2';
import { Article } from 'src/articles/entities/article.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
  Unique,
  Index,
} from 'typeorm';

@Entity('likes')
@Unique(['userId', 'articleId']) // Prevent duplicate likes
@Index(['userId'])
@Index(['articleId'])
export class Like {
  @PrimaryColumn('varchar')
  id: string;

  @Column('varchar')
  userId: string;

  @Column('varchar')
  articleId: string;

  @CreateDateColumn()
  createdAt: Date;

  @BeforeInsert()
  generateId() {
    if (!this.id) {
      this.id = createId();
    }
  }

  @ManyToOne(() => User, (user) => user.likes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Article, (article) => article.likes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'articleId' })
  article: Article;
}
