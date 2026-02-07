import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  session: { strategy: "jwt" },
  pages: { signIn: "/" },
  callbacks: {
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const isOnChat = request.nextUrl.pathname.startsWith("/chat");
      const isOnJournal = request.nextUrl.pathname.startsWith("/journal");
      const isOnApi = request.nextUrl.pathname.startsWith("/api");
      const isAuthApi = request.nextUrl.pathname.startsWith("/api/auth");

      // Always allow auth API routes
      if (isAuthApi) return true;

      // Protect /chat, /journal, and /api routes
      if ((isOnChat || isOnJournal || isOnApi) && !isLoggedIn) {
        return false; // Redirects to pages.signIn ("/")
      }

      return true;
    },
    jwt({ token, profile }) {
      if (profile?.sub) {
        token.id = profile.sub;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});
