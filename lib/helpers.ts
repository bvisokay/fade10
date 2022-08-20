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

/*
 * function really works for any period just pass in the data and dates
 * Example date format is 2022-08-15
 * logic is greater than or equal startDate and less than endDate
 */
export const getMonthlySummary = (sourceArr: DataPointType[], startDate: string, endDate: string) => {
  const startDateObj = new Date(startDate)
  const endDateObj = new Date(endDate)

  const tgtPeriodArr = sourceArr.filter(item => {
    const itemDateObj = new Date(item.date)
    if (itemDateObj >= startDateObj && itemDateObj < endDateObj) return item
  })

  // OVERALL STATS

  const overallHit = tgtPeriodArr.reduce((acc, item) => {
    if (typeof item.tgtHit === "number" && item.tgtHit === 1) {
      return 1 + acc
    } else {
      return acc
    }
  }, 0)

  const signalsActivated = tgtPeriodArr.reduce((acc, item) => {
    if (item.dirSignal === "Long" || item.dirSignal === "Short") {
      return 1 + acc
    } else {
      return acc
    }
  }, 0)

  const overallHitRate = Math.round((overallHit / signalsActivated) * 100)

  // LONG ONLY STATS

  const numLongDays = tgtPeriodArr.reduce((acc, item) => {
    if (item.dirSignal === "Long") {
      return 1 + acc
    } else {
      return acc
    }
  }, 0)

  const numLongHit = tgtPeriodArr.reduce((acc, item) => {
    if (typeof item.tgtHit === "number" && item.tgtHit === 1 && item.dirSignal === "Long") {
      return 1 + acc
    } else {
      return acc
    }
  }, 0)

  const longHitRate = Math.round((numLongHit / numLongDays) * 100)

  // SHORT ONLY STATS

  const numShortDays = tgtPeriodArr.reduce((acc, item) => {
    if (item.dirSignal === "Short") {
      return 1 + acc
    } else {
      return acc
    }
  }, 0)

  const numShortHit = tgtPeriodArr.reduce((acc, item) => {
    if (typeof item.tgtHit === "number" && item.tgtHit === 1 && item.dirSignal === "Short") {
      return 1 + acc
    } else {
      return acc
    }
  }, 0)

  const shortHitRate = Math.round((numShortHit / numShortDays) * 100)

  // UNACTIVATED STATS (RARE)

  const numOtherDays = tgtPeriodArr.reduce((acc, item) => {
    if (item.dirSignal !== "Short" && item.dirSignal !== "Long") {
      return 1 + acc
    } else {
      return acc
    }
  }, 0)

  return {
    data: tgtPeriodArr,
    tradingDays: tgtPeriodArr.length,
    overallHit,
    overallHitRate: Number.isNaN(overallHitRate) ? 0 : overallHitRate,
    numLongDays,
    numLongHit,
    longHitRate: Number.isNaN(longHitRate) ? 0 : longHitRate,
    numShortDays,
    numShortHit,
    shortHitRate: Number.isNaN(shortHitRate) ? 0 : shortHitRate,
    numOtherDays
  }
}
