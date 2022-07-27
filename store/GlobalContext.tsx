import React, { createContext } from "react"
import { useImmerReducer } from "use-immer"

type GlobalActionTypes = { type: "flashMessage"; value: string } | { type: "setLightTheme" } | { type: "setDarkTheme" }

interface InitialStateType {
  flashMessages: string[]
  theme: string
}

const initialState = {
  flashMessages: [] as string[],
  theme: "dark"
}

export const GlobalDispatchContext = createContext({} as React.Dispatch<GlobalActionTypes>)
export const GlobalStateContext = createContext<InitialStateType>(initialState)

type GlobalCTXProps = {
  children?: React.ReactNode
}

export const GlobalContextProvider: React.FC<GlobalCTXProps> = props => {
  function ourReducer(draft: typeof initialState, action: GlobalActionTypes): void {
    switch (action.type) {
      case "flashMessage":
        /* draft.flashMessages.push(action.value) */
        draft.flashMessages.push(action.value)
        return
      case "setLightTheme":
        draft.theme = "light"
        return
      case "setDarkTheme":
        draft.theme = "dark"
        return
      default:
        throw new Error("Bad action of some sort")
    }
  }

  const [state, dispatch] = useImmerReducer(ourReducer, initialState)
  return (
    <GlobalStateContext.Provider value={state}>
      <GlobalDispatchContext.Provider value={dispatch}>{props.children}</GlobalDispatchContext.Provider>
    </GlobalStateContext.Provider>
  )
}
