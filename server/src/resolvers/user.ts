import { User } from "../entity/User";
import { MyContext } from "src/types";

import {
  Resolver,
  Mutation,
  Arg,
  Field,
  Ctx,
  ObjectType,
  Query,
  FieldResolver,
  Root,
} from "type-graphql";
import { COOKIE_NAME, FORGET_PASSWORD_PREFIX } from "../constants";
import { UsernamePasswordInput } from "./UsernamePasswordInput";
import { validateRegister } from "../utils/validateRegister";
import { sendEmail } from "../utils/sendEmail";
const bcrypt = require("bcryptjs");
import { v4 } from "uuid";
import { AppDataSource } from "../data-source";

@ObjectType()
class FieldError {
  @Field()
  field: string;
  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver(User)
export class UserResolver {

  @FieldResolver(()=>String)
  email(@Root() user:User, @Ctx() {req}:MyContext){
    if (req.session.userId === user.id){
      return user.email
    }

    return ""
  }


  @Mutation(()=>UserResponse)
  async changePassword(
    @Arg("token") token:string,
    @Arg('newPassword') newPassword:string,
    @Ctx() {redis,req}: MyContext
  ): Promise<UserResponse>{
    if (newPassword.length <= 3){
      return {
        errors:[{
          field:"newPassword",
          message:"length must be greater than 3"
        }]
      }
    }
    const key = FORGET_PASSWORD_PREFIX + token
    const userId = await redis.get(key)
    if (!userId){
      return {
        errors:[
          {
            field:"token",
            message:"token expired",
          }
        ]
      }
    }

    const userIdNum = parseInt(userId)

    const user = await User.findOne({where:{id:userIdNum}})

    if (!user){
      return {
        errors:[
          {
            field:"token",
            message:"user no longer exixts",
          }
        ]
      }
    }

    const salt = await bcrypt.genSalt(10);
    await User.update(
      {id:userIdNum},
      {
        password:await bcrypt.hash(newPassword, salt)
      }
    )

    await redis.del(key)

    req.session!.userId = user.id
    
    return {user}

  }

  @Mutation(()=>Boolean)
  async forgotPassword(
    @Arg('email') email:string,
    @Ctx() {redis} : MyContext
  ){
    const user = await User.findOne({where:{email}})
    if(!user){
      // the email is not in database
      // For security dont tell user email not in database so just dont send them email.
      return true
    }

    const token = v4();
    await redis.set(FORGET_PASSWORD_PREFIX + token,user.id,'EX',1000*60*60*24*3) //3 days

    await sendEmail(
      email,
      `<a href="http://localhost:3000/change-password/${token}">Reset Password</a>`
      )
    return true
  }

  @Query(()=>User,{nullable:true})
  me(
    @Ctx() {req} : MyContext
  ){
    if (!req.session.userId){
      return null
    }

    return User.findOne({where:{id: req.session.userId}})
  
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    const errors = validateRegister(options)
    if (errors){
      return {errors}
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(options.password, salt);
    
    let user;
    try {
      // User.create({}).save()
      const result = await AppDataSource
        .createQueryBuilder()
        .insert()
        .into(User)
        .values([{
          username: options.username,
          email: options.email,
          password: hashedPassword,
        }])
        .returning('*')
        .execute();
      user = result.raw[0];
    } catch (err) {
      //|| err.detail.includes("already exists")) {
      // duplicate username error
      if (err.code === "23505") {
        return {
          errors: [
            {
              field: "username",
              message: "username already taken",
            },
          ],
        };
      }
    }

    req.session!.userId = user.id
    return { user };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("usernameOrEmail") usernameOrEmail: string,
    @Arg("password") password: string,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    const user = await User.findOne( usernameOrEmail.includes('@')
    ?{where:{email:usernameOrEmail}}
    :{where:{username:usernameOrEmail}} );

    if (!user) {
      return {
        errors: [
          {
            field: "usernameOrEmail",
            message: "username or email does not exists",
          },
        ],
      };
    }
    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return {
        errors: [
          {
            field: "password",
            message: "incorrect username or password",
          },
        ],
      };
    }

    req.session!.userId = user.id
    return { user };
  }

  @Mutation(()=>Boolean)
  logout(
    @Ctx() {req,res} : MyContext
  ){
    return new Promise((resolve) => 
      req.session.destroy((err)=>{
      res.clearCookie(COOKIE_NAME);
      if (err){
        console.log(err)
        resolve(false)
        return
      }
      resolve(true)
    }))
  }
}
