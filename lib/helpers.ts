import { DataPointType, GetSignalRatesReponse } from "./types"

export const getSignalRates = (period: number, sampleArr: DataPointType[]): GetSignalRatesReponse => {
  let result: GetSignalRatesReponse

  if (period <= sampleArr.length) {
    const longOccurrences = sampleArr.slice(period * -1).reduce((currentTotal, item) => {
      if (item.dirSignal !== "object" && item.dirSignal === "Long") {
        return 1 + currentTotal
      } else return currentTotal
    }, 0)
    const shortOccurrences = sampleArr.slice(period * -1).reduce((currentTotal, item) => {
      if (item.dirSignal !== "object" && item.dirSignal === "Short") {
        return 1 + currentTotal
      } else return currentTotal
    }, 0)
    const otherOccurrences = sampleArr.slice(period * -1).reduce((currentTotal, item) => {
      if (item.dirSignal !== "object" && item.dirSignal !== "Long" && item.dirSignal !== "Short") {
        return 1 + currentTotal
      } else return currentTotal
    }, 0)

    // handle NaN
    const longPerc = Math.round((longOccurrences / period) * 100)
    const shortPerc = Math.round((shortOccurrences / period) * 100)
    const otherPerc = Math.round((otherOccurrences / period) * 100)

    result = {
      message: "success",
      longOccurrences,
      longPercentage: Number.isNaN(longPerc) ? 0 : longPerc,
      shortOccurrences,
      shortPercentage: Number.isNaN(shortPerc) ? 0 : shortPerc,
      otherOccurrences,
      otherPercentage: Number.isNaN(otherPerc) ? 0 : otherPerc
    }

    return result
  } else {
    result = {
      message: "error"
    }
  }
  return result
}

interface GetWinRateBySignalReponse {
  message: string
  signal: string
  occurrences?: number
  hit?: number
  percentage?: number
}

export const getWinRateBySignal = (period: number, sampleArr: DataPointType[], signal = "all") => {
  let result: GetWinRateBySignalReponse

  //console.log("signal value: ", signal)

  if (sampleArr.length) {
    const signalOccurrences = sampleArr.slice(period * -1).reduce((currentTotal, item) => {
      if (signal === "all") {
        return period
      } else if (item.dirSignal === signal) {
        return 1 + currentTotal
      } else return currentTotal
    }, 0)

    const signalOccurrencesHit = sampleArr.slice(period * -1).reduce((currentTotal, item) => {
      if (typeof item.tgtHit === "number" && item.tgtHit === 1 && signal === "all") {
        return item.tgtHit + currentTotal
      }
      if (typeof item.tgtHit === "number" && item.tgtHit === 1 && signal !== "all" && item.dirSignal === signal) {
        return item.tgtHit + currentTotal
      } else return currentTotal
    }, 0)

    result = {
      message: "success",
      signal,
      occurrences: signalOccurrences,
      hit: signalOccurrencesHit,
      percentage: Math.round((signalOccurrencesHit / signalOccurrences) * 100)
    }

    return result
  } else {
    result = {
      message: "error",
      signal
    }
  }

  return result
}
