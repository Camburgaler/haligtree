import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" },
            },
            authorize: async (credentials) => {
                // Replace with your actual user validation logic
                if (
                    credentials?.username === "test" &&
                    credentials?.password === "password"
                ) {
                    return { id: "1", name: "John Doe" }; // Example user
                }
                return null;
            },
        }),
        // Google({
        //     clientId: process.env.AUTH_GOOGLE_ID!,
        //     clientSecret: process.env.AUTH_GOOGLE_SECRET!,
        // }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    // database: process.env.DATABASE_URL, // Optional: Database for user persistence
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
