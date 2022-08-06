// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next"
import { getSession } from "next-auth/react"
import { QueryResponseType, TradingDayType } from "../../lib/types"
import executeQuery from "../../lib/db"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Not supported" })
  }
  if (req.method === "POST") {
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

    // Begin validation including swapping intentially empty fields to NULL
    const cleanedPayload = rawPayload.map((item: TradingDayType) => {
      if (item.date.toString() === "") {
        return res.status(422).json({ message: "error", errors: "Date cannot be left blank" })
      }
      if (item.rangeHigh === "") {
        return res.status(422).json({ message: "error", errors: "range high cannot be left blank" })
      }
      if (item.rangeLow === "") {
        return res.status(422).json({ message: "error", errors: "range low cannot be left blank" })
      }
      if (item.rangeLow > item.rangeHigh) {
        return res.status(422).json({ message: "error", errors: "range low cannot be greater than range high" })
      }
      if (item.dirSignal !== "" && item.signalTime === "") {
        return res.status(422).json({ message: "error", errors: "signal time cannot be left blank" })
      }
      if (item.dirSignal !== "" && item.tgtHit === "") {
        return res.status(422).json({ message: "error", errors: "signal time cannot be left blank" })
      }
      if (item.dirSignal !== "" && item.tgtHit === "Yes" && item.tgtHitTime === "") {
        return res.status(422).json({ message: "error", errors: "signal time cannot be left blank" })
      }
      if (item.dirSignal === "") {
        item.dirSignal = "NULL"
        item.signalTime = "NULL"
        item.tgtHit = "NULL"
        item.tgtHitTime = "NULL"
      }
      if (item.tgtHit === "No") {
        item.tgtHitTime = "NULL"
      }
      if (item.notes === "") {
        item.notes = "NULL"
      }

      return {
        date: item.date.toString(),
        rangehigh: item.rangeHigh,
        rangelow: item.rangeLow,
        dirsignal: item.dirSignal,
        signaltime: item.signalTime,
        tgthit: item.tgtHit,
        tgthittime: item.tgtHitTime,
        notes: item.notes,
        imagepath: "NULL"
      }
    })

    // Begin DB work
    try {
      const item = cleanedPayload[0]
      //eslint-disable-next-line
      const response = (await executeQuery(`INSERT INTO spy (date, rangehigh, rangelow, dirsignal, signaltime, tgthit, tgthittime, notes, imagepath) VALUES ("${item?.date}", "${item?.rangehigh}", "${item?.rangelow}", ${item?.dirsignal !== "NULL" ? `"${item?.dirsignal}"` : item?.dirsignal}, ${item?.signaltime !== "NULL" ? `"${item?.signaltime}"` : item?.signaltime}, ${item?.tgthit === "Yes" ? "1" : item?.tgthit === "No" ? "0" : item?.tgthit}, ${item?.tgthittime !== "NULL" ? `"${item?.tgthittime}"` : item?.tgthittime}, ${item?.notes !== "NULL" ? `"${item?.notes}"` : item?.notes}, ${item?.imagepath !== "NULL" ? `"${item?.imagepath}"` : item?.imagepath})`)) as QueryResponseType
      if (response.error) {
        //eslint-disable-next-line
        console.log(`Response from the DB Operation: ${response.error}`)
        throw { message: "error", errors: response.error }
      }
      res.status(200).json({ message: "success" })
    } catch (err) {
      res.status(422).json({ message: "error", errors: err })
    }
  } // End Post Request
}
