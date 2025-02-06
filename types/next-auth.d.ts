// types/next-auth.d.ts
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    currentUser?: {
      _id: string;
      email: string;
      name: string;
      profileImage?: string;
      // boshqa kerakli maydonlarni qo'shishingiz mumkin
    };
  }
}
