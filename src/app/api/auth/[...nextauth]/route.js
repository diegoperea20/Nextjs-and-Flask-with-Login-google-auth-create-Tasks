import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";


const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        user: { label: "User", type: "text", placeholder: "write user" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        // Conection to backend flask
        const API_URL = process.env.BACKEND;
        const response = await fetch(`${API_URL}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user: credentials.user,
            password: credentials.password,
          }),
        });
        const user = await response.json();
        if (user.error) throw user;
        return user;
      }
    }), 
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      
    })
  ],
  
  callbacks: {
    async signIn({ user, account, profile}) {
      const isAllowedToSignIn = true;
      if (isAllowedToSignIn) {
        if (account.provider === "google") {
          // Código para manejar el inicio de sesión con Google
          // ...
          const API_URL = process.env.BACKEND;
          const response = await fetch(`${API_URL}/logingoogle`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ token: account.id_token }),
          });
          const data = await response.json();
          if (response.ok) {
            user.username = data.username;
            user.user_id = data.user_id;
            user.token = data.token;
            return user;
          } else {
            console.log("ERROR EN ENVIAR ");
            throw new Error(data.error);
          }
        } else {
          // Código para manejar el inicio de sesión con Credentials
          return user;
        }
      } else {
        // Si el usuario no está autorizado para iniciar sesión
        return "/";
      }
    },
    
    async jwt({ token, user }) {
      return { ...token, ...user };
    },
    async session({ session, token }) {
      if (token.user) {
        session.user = {
          username: token.user.username,
          user_id: token.user.user_id,
          token: token.user.token,
          // Agrega cualquier otra propiedad que necesites
        };
        return session;
      }
      else {
        session.user = token;
        return session;
      }
      
    }
  },
  pages: {
    signIn: "/",
    
  }
});

export { handler as GET, handler as POST };
