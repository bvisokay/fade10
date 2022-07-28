export interface RegAttemptTypes {
  username: string
  email: string
  password: string
}

export interface ResponseType {
  message: string
  data?: string
  errors?: string
}

// from execute query
export type QueryResponseType = {
  results: unknown
  error: unknown
}

export type TradingDayType = {
  date: string
  formattedDate?: Date
  rangeHigh: number | string
  rangeLow: number | string
  dirSignal: string | null
  signalTime: string | null
  tgtHit: string | null
  tgtHitTime: string | null
  notes: string | null
}

export type DataRowType = {
  date: string
  rangehigh: number | string
  rangelow: number | string
  dirsignal: string | null
  signaltime: string | null
  tgthit: string | null
  tgthittime: string | null
  notes: string | null
  imagepath: null
}
