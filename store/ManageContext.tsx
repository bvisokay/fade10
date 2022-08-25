import React, { createContext } from "react"
import { useImmerReducer } from "use-immer"
import { DataPointType, UpdatedDataPointType } from "../lib/types"

type ManageActionTypes = { type: "removeItem"; value: string } | { type: "addItem"; value: DataPointType } | { type: "addMultipleItems"; value: DataPointType[] } | { type: "removeAllItems" } | { type: "updateItem"; value: UpdatedDataPointType }

interface InitialStateType {
  spy: DataPointType[] | UpdatedDataPointType[]
}

const initialState = {
  spy: [] as DataPointType[]
}

export const ManageDispatchContext = createContext({} as React.Dispatch<ManageActionTypes>)
export const ManageStateContext = createContext<InitialStateType>(initialState)

type ManageCTXProps = {
  children?: React.ReactNode
}

export const ManageContextProvider: React.FC<ManageCTXProps> = props => {
  function ourReducer(draft: typeof initialState, action: ManageActionTypes): void {
    switch (action.type) {
      case "removeItem":
        draft.spy = draft.spy.filter((item: DataPointType) => {
          if (item?.date !== action.value) {
            return item
          }
        })
        return
      case "addItem":
        draft.spy.push(action.value)
        draft.spy.sort((a, b) => {
          if (a.date < b.date) return 1
          else if (a.date > b.date) return -1
          else return 0
        })
        return
      case "addMultipleItems":
        draft.spy.push(...action.value)
        draft.spy.sort((a, b) => {
          if (a.date < b.date) return 1
          else if (a.date > b.date) return -1
          else return 0
        })
        return
      case "removeAllItems":
        draft.spy = []
        return
      case "updateItem":
        for (const obj of draft.spy) {
          if (action.value.originalDate === obj.date) {
            ;(obj.date = action.value.date), //
              (obj.displayDate = action.value.displayDate),
              (obj.rangeHigh = +action.value.rangeHigh),
              (obj.rangeLow = +action.value.rangeLow),
              (obj.dirSignal = action.value.dirSignal),
              (obj.signalTime = action.value.signalTime),
              (obj.tgtHit = action.value.tgtHit),
              (obj.tgtHitTime = action.value.tgtHitTime),
              (obj.notes = action.value.notes)
          }
          break
        }
        draft.spy.sort((a, b) => {
          if (a.date < b.date) return 1
          else if (a.date > b.date) return -1
          else return 0
        })
        return
      default:
        throw new Error("Bad action of some sort")
    }
  }

  const [state, dispatch] = useImmerReducer(ourReducer, initialState)
  return (
    <ManageStateContext.Provider value={state}>
      <ManageDispatchContext.Provider value={dispatch}>{props.children}</ManageDispatchContext.Provider>
    </ManageStateContext.Provider>
  )
}
