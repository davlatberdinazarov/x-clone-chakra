import { AuthOptions } from "next-auth";
import User from "@/database/user.model";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase } from "./mongoose";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectToDatabase();

        const user = await User.findOne({
          email: credentials?.email,
        });

        if (!user) {
          throw new Error("User not found");
        }

        return user;
      },
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session }: any) {
      await connectToDatabase();

      // Check if the user exists in the database
      const isExistingUser = await User.findOne({ email: session.user.email });

      if (!isExistingUser) {
        // Create a new user if it doesn't exist
        const newUser = await User.create({
          id: session.user.id,
          email: session.user.email,
          name: session.user.name,
          profileImage: session.user.image,
        });

        // Add the new user with id as a string to the session
        session.currentUser = {
          ...newUser.toObject(),
          id: newUser._id.toString(), // Convert ObjectId to string here
        };
      } else {
        // If the user exists, assign it to session and convert id to string
        session.currentUser = {
          ...isExistingUser.toObject(),
          id: isExistingUser._id.toString(), // Convert ObjectId to string
        };
      }

      return session;
    },
  },
  session: { strategy: "jwt" },
  jwt: { secret: process.env.NEXTAUTH_JWT_SECRET! },
  secret: process.env.NEXTAUTH_SECRET!,
};
    