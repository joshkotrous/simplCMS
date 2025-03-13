import NextAuth, { Account, Session } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { getUserByEmail, updateUser, userHasAccess } from "@/user";
import { JWT } from "next-auth/jwt";

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

async function updateUserInformation({
  session,
  token,
}: {
  session?: Session;
  token?: JWT;
}): Promise<void> {
  try {
    const email = session
      ? session.user.email
      : token
      ? token.email
      : (() => {
          throw new Error("No email found in session or token");
        })();

    const name = session
      ? session.user.name
      : token
      ? token.name
      : (() => {
          throw new Error("No name found in session or token");
        })();
    const image = session
      ? session.user.image
      : token
      ? token.picture
      : undefined;

    if (!email) {
      throw new Error("Email was not provided via OAuth.");
    }
    const user = await getUserByEmail(email);
    if (!user) {
      throw new Error("User could not be found.");
    }
    await updateUser({
      _id: user._id,
      name: name ?? undefined,
      imageUrl: image ?? undefined,
    });
  } catch (error) {
    console.error(error);
  }
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
      clientId: process.env.GOOGLE_OAUTH_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET ?? "",
    }),
  ],
  pages: {
    error: "/login",
  },
  callbacks: {
    async jwt({ token, account }) {
      token = await validateToken(token, account);
      await updateUserInformation({ token });
      return token;
    },
    async session({ session, token }) {
      session = await validateSession(session, token);
      console.log("Updating user information...");
      await updateUserInformation({ session });
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
