import type { NextApiRequest, NextApiResponse } from "next"
import { connectToDatabase } from "../../../lib/db"
import { hashPassword } from "../../../lib/auth"
import { RegAttemptTypes } from "../../../lib/types"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "error", value: "Not supported" })
  }

  const data = req.body as RegAttemptTypes

  const { username, email, password } = data

  // need to bulk up the SS validation and error handling
  if (!username || username.trim().length > 20 || !email || !email.includes("@") || !password || password.trim().length < 6) {
    res.status(422).json({ message: "Invalid input" })
    return
  }

  let client
  //error handling for connection to database
  try {
    client = await connectToDatabase()
  } catch (error) {
    res.status(500).json({ message: "There was an error connecting to the data." })
    return
  }

  //error handling for actually signing up
  try {
    const db = client.db()

    // check if user email already exists
    const existingUser = await db.collection("users").findOne({ email: email })
    if (existingUser) {
      res.status(422).json({ message: "A user with that email already exists." })
      void client.close()
      return
    }

    // hash password only if unique user
    const hashedPassword = await hashPassword(password)

    // store new unique user in the database
    await db.collection("users").insertOne({
      username,
      email,
      password: hashedPassword
    })
    return res.status(201).json({ message: "success" })
  } catch (error) {
    void client.close()
    return res.status(500).json({ message: "failure", errors: "There was an error creating the user." })
  }
}
export default handler
