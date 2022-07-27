import type { NextApiRequest, NextApiResponse } from "next"
import { connectToDatabase } from "../../lib/db"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const { key, value } = req.body as { key: string; value: string }

      // doesUserValueExist: meant as aid for client-side checking if username/password/etc. exist
      const doesUserValueExist = async (key: string, value: string): Promise<boolean | object> => {
        if (typeof key !== "string" || typeof value !== "string") {
          return false
        }
        try {
          const client = await connectToDatabase()
          if (!client) {
            throw { message: "Error" }
          }
          const result = await client
            .db()
            .collection("users")
            .findOne({ [key]: value })
          if (result) {
            void client.close()
            return true
          } else {
            void client.close()
            return false
          }
        } catch (err) {
          return { errors: err }
        }
      } // end doesUserValue Exist

      const result = await doesUserValueExist(key, value)
      if (result) {
        //Send message as answer to doesUserValueExist
        res.json({ message: true })
      } else {
        //Send message as answer to doesUserValueExist
        res.json({ message: false })
      }
    } catch (err) {
      res.json({ message: "error", errors: err })
    }
  } else {
    res.json({ message: "There was an error" }) // not POST request
  }
}

export default handler
