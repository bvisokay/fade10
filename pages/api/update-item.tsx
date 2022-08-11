// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next"
import { getSession } from "next-auth/react"
import { QueryResponseType, EditedTradingDayType, EditedTradingDayTypeForDb } from "../../lib/types"
import executeQuery from "../../lib/db"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PATCH") {
    res.status(405).json({ message: "Not supported" })
  }
  if (req.method === "PATCH") {
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

    // need to make sure something has changed and the propoerties that have changed made sense

    const cleanedPayload = rawPayload.map((item: EditedTradingDayType | EditedTradingDayTypeForDb) => {
      if (item.newDate.toString() === "") {
        return res.status(422).json({ message: "error", errors: "Date cannot be left blank" })
      }
      if (item.rangeHigh === "") {
        return res.status(422).json({ message: "error", errors: "Range high cannot be left blank" })
      }
      if (item.rangeLow === "") {
        return res.status(422).json({ message: "error", errors: "Range low cannot be left blank" })
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
        item.dirSignal = null
        item.signalTime = null
        item.tgtHit = null
        item.tgtHitTime = null
      }
      if (item.tgtHit === "No") {
        item.tgtHitTime = null
      }
      if (item.notes === "") {
        item.notes = null
      }

      return {
        originaldate: item.originalDate,
        newdate: item.newDate,
        rangehigh: typeof item.rangeHigh === "string" ? (Math.round(parseFloat(item.rangeHigh) * 100) / 100).toFixed(2) : (Math.round(item.rangeHigh * 100) / 100).toFixed(2),
        rangelow: typeof item.rangeLow === "string" ? (Math.round(parseFloat(item.rangeLow) * 100) / 100).toFixed(2) : (Math.round(item.rangeLow * 100) / 100).toFixed(2),
        dirsignal: item.dirSignal,
        signaltime: item.signalTime,
        tgthit: item.tgtHit,
        tgthittime: item.tgtHitTime,
        notes: item.notes,
        imagepath: null
      }
    })

    // Begin DB work
    try {
      const item = cleanedPayload[0]
      if (!item) throw { message: "error" }

      //eslint-disable-next-line
      const response = (await executeQuery("UPDATE spy SET date = ?, rangehigh = ?, rangelow = ?, dirsignal = ?, signaltime = ?, tgthit = ?, tgthittime = ?, notes = ?, imagepath = ? WHERE date = ?", [item.newdate, item.rangehigh, item.rangelow, item.dirsignal, item.signaltime, item.tgthit, item.tgthittime, item.notes, item.imagepath, item.originaldate])) as QueryResponseType

      //eslint-disable-next-line
      /* const response = (await executeQuery(`INSERT INTO spy (date, rangehigh, rangelow, dirsignal, signaltime, tgthit, tgthittime, notes, imagepath) VALUES ("${item?.date}", "${item?.rangehigh}", "${item?.rangelow}", "${item?.dirsignal}", ${item?.signaltime !== "NULL" ? `"${item?.signaltime}"` : item?.signaltime}, ${item?.tgthit === "Yes" ? "1" : item?.tgthit === "No" ? "0" : item?.tgthit}, ${item?.tgthittime !== "NULL" ? `"${item?.tgthittime}"` : item?.tgthittime}, ${item?.notes !== "NULL" ? `"${item?.notes}"` : item?.notes}, ${item?.imagepath !== "NULL" ? `"${item?.imagepath}"` : item?.imagepath})`)) as QueryResponseType */
      if (response.error) {
        //eslint-disable-next-line
        console.log(`Response from the DB Operation: ${response.error}`)
        throw { message: "error", errors: response.error }
      }

      // Format Data Payload to Send Back to the Client

      const dateObj = new Date(item.newdate)
      const ClientReadyEditedAndSavedItem = {
        originalDate: item.originaldate, // YYYY-MM-DD
        date: dateObj.toLocaleDateString("en-CA", {
          timeZone: "UTC"
        }), // YYYY-MM-DD
        displayDate: dateObj.toLocaleDateString("en-US", {
          timeZone: "UTC",
          year: "2-digit",
          month: "2-digit",
          day: "2-digit"
        }), // YYYY-MM-DD
        rangeHigh: item.rangehigh === "" || item.rangehigh === "NULL" ? "" : typeof item.rangehigh === "string" ? (Math.round(parseFloat(item.rangehigh) * 100) / 100).toFixed(2) : "",
        rangeLow: item.rangelow === "" || item.rangelow === "NULL" ? "" : typeof item.rangelow === "string" ? (Math.round(parseFloat(item.rangelow) * 100) / 100).toFixed(2) : "",
        dirSignal: typeof item.dirsignal === "object" ? "" : item.dirsignal === "" ? "" : item.dirsignal,
        signalTime: typeof item.signaltime === "object" ? "" : item.signaltime,
        tgtHit: typeof item.tgthit === "object" ? "" : item.tgthit,
        tgtHitTime: typeof item.tgthittime === "object" ? "" : item.tgthittime,
        notes: typeof item.notes === "object" ? "" : item.notes
      }

      res.status(200).json({ message: "success", data: ClientReadyEditedAndSavedItem })
    } catch (err) {
      res.status(422).json({ message: "error", errors: err })
    }
  } // End Post Request
}
