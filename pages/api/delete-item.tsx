// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next"
import { getSession } from "next-auth/react"
import { QueryResponseType } from "../../lib/types"
import executeQuery from "../../lib/db"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "DELETE") {
    res.status(405).json({ message: "Not supported" })
  }
  if (req.method === "DELETE") {
    const session = await getSession({ req: req })
    if (!session) {
      res.status(401).json({ message: "Not authenticated" })
      return
    }
    if (session?.user?.name !== process.env.SCRIBE) {
      res.status(401).json({ message: "Not authorized" })
      return
    }

    if (!req.body) {
      res.status(422).json({ message: "error", errors: "data error" })
      return { message: "error", errors: "data error" }
    }

    if (!(req.body instanceof Array) || !req.body.length) {
      res.status(422).json({ message: "error", errors: "error: data" })
      return { message: "error", errors: "data error" }
    }

    const rawPayload = req.body

    const cleanedPayload = rawPayload.map((item: string) => {
      if (typeof item !== "string" && typeof item !== undefined) {
        return res.status(422).json({ message: "error", errors: "Problem with the data" })
      }
      if (item.length > 10) {
        console.log("length", item.length)
        return res.status(422).json({ message: "error", errors: "Problem with the data, err 808" })
      }
      if (item.length < 6) {
        return res.status(422).json({ message: "error", errors: "Problem with the data, err 809" })
      }
      return item
    })

    console.log(cleanedPayload[0])

    // Begin DB work
    try {
      const item = cleanedPayload[0]
      const response = (await executeQuery(`DELETE FROM spy WHERE date = ?`, item ? item : "")) as QueryResponseType
      console.log(response)
      if (response.error) {
        //eslint-disable-next-line
        console.log(`Response from the DB Operation: ${response.error}`)
        throw { message: "error", errors: response.error }
      }
      if (!response.error) {
        //eslint-disable-next-line
        console.log(`Response from the DB Operation: ${response.results}`)
        res.status(200).json({ message: "success" })
      }
    } catch (err) {
      res.status(422).json({ message: "error", errors: err })
    }
  } // End Post Request
}
