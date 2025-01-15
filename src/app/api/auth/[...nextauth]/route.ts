import NextAuth, { Account, Session } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { getUserByEmail, userHasAccess } from "@/packages/core/src/user";
import { JWT } from "next-auth/jwt";

if (!process.env.GOOGLE_CLIENT_ID)
  throw new Error("GOOGLE_CLIENT_ID not configured");

if (!process.env.GOOGLE_CLIENT_SECRET)
  throw new Error("GOOGLE_CLIENT_SECRET not configured");

async function validateSession(session: Session, token: JWT): Promise<Session> {
  const email = session.user.email;
  if (!email) {
    throw new Error("Email was not provided via OAuth.");
  }
  const user = await getUserByEmail(email);
  if (!user) {
    throw new Error("User could not be found.");
  }
  const hasAccess = await userHasAccess(user);
  if (!hasAccess) {
    throw new Error("User does not have access");
  }
  session.accessToken = token.accessToken;
  return session;
}

async function validateToken(
  token: JWT,
  account: Account | null
): Promise<JWT> {
  const email = token.email;
  if (!email) {
    throw new Error("Email was not provided via OAuth.");
  }
  const user = await getUserByEmail(email);
  if (!user) {
    throw new Error("User could not be found.");
  }
  const hasAccess = await userHasAccess(user);
  if (!hasAccess) {
    throw new Error("User does not have access");
  }
  if (account) {
    token.accessToken = account.access_token;
  }
  token.userId = user._id.toString();
  return token;
}

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  pages: {
    error: "/login",
  },
  callbacks: {
    async jwt({ token, account }) {
      token = await validateToken(token, account);
      return token;
    },
    async session({ session, token }) {
      session = await validateSession(session, token);
      console.log("SESSION", session);
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url === baseUrl || url === baseUrl + "/login") {
        return baseUrl + "/admin";
      }

      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }

      if (new URL(url).origin === baseUrl) {
        return url;
      }

      return baseUrl + "/admin";
    },
  },
});

export { handler as GET, handler as POST };
