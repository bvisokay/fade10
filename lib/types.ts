export interface ClientReadyItemType {
  date: string
  displayDate: string
  rangeHigh: number | string
  rangeLow: number | string
  dirSignal: string | number
  signalTime: string
  tgtHit: string
  tgtHitTime: string
  notes: string
}

export interface FetchAllDataResultType {
  message: string
  data?: DataPointType[]
  errors?: unknown | string
}

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

export type DataPointType = {
  date: string
  displayDate: string
  rangeHigh: number
  rangeLow: number
  dirSignal: string
  signalTime: string
  tgtHit: string | number
  tgtHitTime: string
  notes: string
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

export type TradingDay2Type = {
  date: string
  formattedDate?: Date
  stringDate: string
  rangeHigh: number | string
  rangeLow: number | string
  dirSignal: string | null
  signalTime: string | null
  tgtHit: number | null
  tgtHitTime: string | null
  notes: string | null
}

export type TradingDay3Type = {
  date: string
  formattedDate: Date
  rangeHigh: number | string
  rangeLow: number | string
  dirSignal: string | null
  signalTime: string | null
  tgtHit: string | number | null
  tgtHitTime: string | null
  notes: string | null
}

export type EditedTradingDayType = {
  date: string
  formattedDate?: Date
  rangeHigh: number | string
  rangeLow: number | string
  dirSignal: string | null
  signalTime: string | null
  tgtHit: string | number | null
  tgtHitTime: string | null
  notes: string | null
}

export type ExistingTradingDayType = {
  date: string
  formattedDate?: Date
  rangeHigh: number | string
  rangeLow: number | string
  dirSignal: string | null
  signalTime: string | null
  tgtHit: string | number | null
  tgtHitTime: string | null
  notes: string | null
}

export type DataRowType = {
  date: string
  rangehigh: number
  rangelow: number
  dirsignal: string | null
  signaltime: string | null
  tgthit: string | null
  tgthittime: string | null
  notes: string | null
  imagepath: null
}

export type DataPointFormType = {
  date: string
  rangeHigh: number | string
  rangeLow: number | string
  dirSignal: string
  signalTime: string
  tgtHit: string
  tgtHitTime: string
  notes: string
}
