import executeQuery from "./db"
import { QueryResponseType, DataRowType, DataPointType } from "./types"

export const fetchAllData = async (dir = 1) => {
  try {
    const response = (await executeQuery(`SELECT * FROM spy`)) as QueryResponseType

    if (response.error) {
      //eslint-disable-next-line
      console.log(`Error from DB operation: ${response.error}`)
      throw { message: "error", errors: response.error }
    }

    let cleanedResponse: DataPointType[] = []

    if (Array.isArray(response)) {
      cleanedResponse = response.map((item: DataRowType) => {
        const dateObj = new Date(item.date)

        return {
          date: dateObj.toLocaleDateString("en-CA"), // YYYY-MM-DD
          displayDate: dateObj.toLocaleDateString("en-US", {
            timeZone: "UTC",
            year: "2-digit",
            month: "2-digit",
            day: "2-digit"
          }), // YYYY-MM-DD
          rangeHigh: item.rangehigh,
          rangeLow: item.rangelow,
          dirSignal: typeof item.dirsignal === "object" || item.dirsignal === "NULL" ? "" : item.dirsignal === "" ? "" : item.dirsignal,
          signalTime: typeof item.signaltime === "object" || item.signaltime === "NULL" ? "" : item.signaltime,
          tgtHit: typeof item.tgthit === "object" || item.tgthit === "NULL" ? "" : item.tgthit,
          tgtHitTime: typeof item.tgthittime === "object" || item.tgthittime === "NULL" ? "" : item.tgthittime,
          notes: typeof item.notes === "object" || item.notes === "NULL" ? "" : item.notes
        }
      })
    }

    let cleanedAndSorted: DataPointType[] = []

    if (cleanedResponse.length) {
      cleanedAndSorted = cleanedResponse.sort((a, b) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        if (a.date > b.date) return -1 * dir
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        if (a.date < b.date) return dir
        else return 0
      })
    }

    return { message: "success", data: cleanedAndSorted }
  } catch (err) {
    //eslint-disable-next-line
    return { message: "error", errors: err }
  }
}

/* 
const getLongSignalRate = (period: number) => {
  const results = spy.slice(period * -1).reduce((currentTotal, item) => {
    if (item.dirSignal !== "object" && item.dirSignal === "Long") {
      return 1 + currentTotal
    } else return currentTotal
  }, 0)
  return results
} */
