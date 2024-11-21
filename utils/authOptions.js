import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          //this makes is so it won't use the last google account used
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  callbacks: {
    //Invoked on successful sign in
    async signIn({ profile }) {
      //1. connect to DB
      //2. check if user exists
      //3. if not, create user
      //4. return true to allow sign in
    },
    //Session callback function that modifies the session object
    async session({ session }) {
      //1. Get user from DB
      //2. assign user id from the session
      //3. return session
    },
  },
};
