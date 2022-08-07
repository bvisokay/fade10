import React, { createContext } from "react"
import { useImmerReducer } from "use-immer"
import { DataPointType } from "../lib/types"

type ManageActionTypes = { type: "removeItem"; value: string } | { type: "addItem"; value: DataPointType } | { type: "addMultipleItems"; value: DataPointType[] }

interface InitialStateType {
  spy: DataPointType[]
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
        draft.spy.unshift(action.value)
        return
      case "addMultipleItems":
        draft.spy.push(...action.value)
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
