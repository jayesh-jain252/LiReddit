
import { ObjectType, Field, Int } from "type-graphql";
import { Entity,Column,PrimaryGeneratedColumn,CreateDateColumn,UpdateDateColumn, BaseEntity, ManyToOne, OneToMany } from "typeorm"
import { Updoot } from "./Updoot";
import { User } from "./User";

@ObjectType()
@Entity()
export class Post extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  title!: string;
  
  @Field()
  @Column()
  text!: string;
  
  @Field()
  @Column({type:"int",default:0})
  points!: number;

  @Field(()=>Int,{nullable:true})
  voteStatus: number | null;

  @Field()
  @Column()
  creatorId: number;

  @OneToMany(() => Updoot, (updoot) => updoot.post)
  updoots: Updoot[]

  @Field()
  @ManyToOne(() => User, (user) => user.posts)
  creator: User

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

}
