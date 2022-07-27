// do not override a built in default route (see docs...)

import NextAuth from "next-auth"
import { connectToDatabase } from "../../../lib/db"
import { verifyPassword } from "../../../lib/auth"
import CredentialsProvider from "next-auth/providers/credentials"

export default NextAuth({
  session: {
    jwt: true
  },
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        // error handling for connection to database
        try {
          const client = await connectToDatabase()
          const usersCollection = client.db().collection("users")
          const user = await usersCollection.findOne({ username: credentials.username })
          if (!user) {
            // when you throw an error inside of authorize
            // authorize will reject the promise it generates
            void client.close()
            throw new Error("No user found")
          }
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          const isValid = await verifyPassword(credentials.password, user.password)
          if (!isValid) {
            void client.close()
            throw new Error("Incorrect username/password")
          }
          //
          // returning object inside of authorize let NextAuth know auth succeeded
          //
          // this is what gets encoded in the token
          //
          // don't send entire user obj to avoid sending pw
          //
          // close db before return
          //
          void client.close()
          return { name: user.username, email: user.email }
        } catch (err) {
          console.log("error: ", err)
          throw { message: "Error attempting auth", errors: err }
        }
      } // end authorize
    }) // end CredentialsProvider
  ] // end providers key
}) // end NextAuth()
