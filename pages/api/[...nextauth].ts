import NextAuth from "next-auth/next";
import Credentials from "next-auth/providers/credentials";
import {compare} from 'bcrypt';


import prismadb from '@/lib/prismadb';



export default NextAuth({
  providers: [
    Credentials({
      id: 'credentials',
      name: 'Credentials',
      credentials:{
        email:{
          label:'Email',
          type: 'text',
        },
        password:{
          label:'Password',
          type: 'password',
        }
      },
      async authorize(credentials) {
          if  (!credentials?.email || !credentials?.password){
            throw new Error('Email and password required');
          }
      }
    const user = await prismadb.user.findUnique({
      where: {
        email : credentials.email
      }
    });

    if (!user || !user.hashedPassword){
      throw new Error("El email no existe");
      
    }

    const isCorrectPassword = await compare(
      credentials.password, 
      user.hashedPassword 
      );

    if (!isCorrectPassword){
      throw new Error("Contraseña incorrecta");
      
    }

    return user;

    })
  ],

  pages:{
    signIn: '/auth',
  },
  debug: proccess.env.NODE_ENV === 'development',
})