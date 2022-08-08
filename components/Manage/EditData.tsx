import { useImmerReducer } from "use-immer"
import { useEffect, useRef, useContext } from "react"
import { EditedTradingDayType, DataPointType, ResponseType } from "../../lib/types"
import { ManageDispatchContext } from "../../store/ManageContext"

// mui
import Button from "@mui/material/Button"
import TextField from "@mui/material/TextField"
import MenuItem from "@mui/material/MenuItem"

type AddDataActionTypes = { type: "dateCheck"; value: string } | { type: "rangeHighCheck"; value: string | number } | { type: "rangeLowCheck"; value: string | number } | { type: "dirSignalCheck"; value: string } | { type: "signalTimeCheck"; value: string } | { type: "tgtHitCheck"; value: string | number } | { type: "tgtHitTimeCheck"; value: string } | { type: "notesCheck"; value: string } | { type: "submitCount"; value: number } | { type: "isSaving"; value: boolean } | { type: "submitForm" }

/* type AddDataActionTypes = { type: "dateCheck"; value: string } | { type: "rangeHighCheck"; value: string } | { type: "rangeLowCheck"; value: string } | { type: "dirSignalCheck"; value: string } | { type: "signalTimeCheck"; value: string } | { type: "tgtHitCheck"; value: string | number } | { type: "tgtHitTimeCheck"; value: string } | { type: "notesCheck"; value: string } | { type: "submitCount"; value: number } | { type: "isSaving"; value: boolean } | { type: "submitForm" } | { type: "clearFields" } */

type InitialStateTypes = {
  date: {
    value: string
    hasErrors: boolean
    message: string
  }
  rangeHigh: {
    value: string | number
    hasErrors: boolean
    message: string
  }
  rangeLow: {
    value: string | number
    hasErrors: boolean
    message: string
  }
  dirSignal: {
    value: string
    hasErrors: boolean
    message: string
  }
  signalTime: {
    value: string
    hasErrors: boolean
    message: string
  }
  tgtHit: {
    value: string | number
    hasErrors: boolean
    message: string
  }
  tgtHitTime: {
    value: string
    hasErrors: boolean
    message: string
  }
  notes: {
    value: string
    hasErrors: boolean
    message: string
  }
  rangeLogicError: boolean
  submitCount: number
  isSaving: boolean
}

function submitDataReducer(draft: InitialStateTypes, action: AddDataActionTypes) {
  switch (action.type) {
    case "dateCheck":
      draft.date.hasErrors = false
      draft.date.value = action.value
      if (draft.date.value == "") {
        draft.date.hasErrors = true
        draft.date.message = "Please select a date"
      }
      return
    case "rangeHighCheck":
      draft.rangeHigh.hasErrors = false
      draft.rangeHigh.value = action.value
      if (draft.rangeHigh.value === "") {
        draft.rangeHigh.hasErrors = true
        draft.rangeHigh.message = "Please enter a value"
      }
      return
    case "rangeLowCheck":
      draft.rangeLow.hasErrors = false
      draft.rangeLow.value = action.value
      if (draft.rangeLow.value === "") {
        draft.rangeLow.hasErrors = true
        draft.rangeLow.message = "Please enter a value"
      }
      return
    case "dirSignalCheck":
      draft.dirSignal.hasErrors = false
      draft.dirSignal.value = action.value
      return
    case "signalTimeCheck":
      draft.signalTime.hasErrors = false
      draft.signalTime.value = action.value
      return
    case "tgtHitCheck":
      draft.tgtHit.hasErrors = false
      draft.tgtHit.value = action.value
      return
    case "tgtHitTimeCheck":
      draft.tgtHitTime.hasErrors = false
      draft.tgtHitTime.value = action.value

      return
    case "notesCheck":
      draft.notes.hasErrors = false
      draft.notes.value = action.value
      if (draft.notes.value && draft.notes.value.length > 100) {
        draft.notes.hasErrors = true
        draft.notes.message = "Notes cannot exceed 100 characters"
      }
      return
    case "submitForm":
      if (typeof draft.date.value === "string" && draft.date.value.trim() == "") {
        draft.date.hasErrors = true
        draft.date.message = "This field cannot be left empty"
      }
      if (draft.rangeHigh.value === "") {
        draft.rangeHigh.hasErrors = true
        draft.rangeHigh.message = "This field cannot be left empty"
      }
      if (draft.rangeLow.value === "") {
        draft.rangeLow.hasErrors = true
        draft.rangeLow.message = "This field cannot be left empty"
      }
      // range logic check
      draft.rangeLogicError = false
      if (draft.rangeLow.value >= draft.rangeHigh.value) {
        draft.rangeLogicError = true
      }
      // always clear dirSignal error before rechecking since dependency
      draft.dirSignal.hasErrors = false
      if (draft.dirSignal.value?.trim() === "") {
        //draft.dirSignal.hasErrors = true
        draft.dirSignal.message = "Signal field left empty, but okay"
      }
      if ((draft.dirSignal.value?.trim() === "" && draft.signalTime.value !== "") || (draft.dirSignal.value?.trim() === "" && draft.tgtHit.value !== "") || (draft.dirSignal.value?.trim() === "" && draft.tgtHitTime.value !== "")) {
        draft.dirSignal.hasErrors = true
        draft.dirSignal.message = "Signal field left empty, not okay"
      }
      if (draft.dirSignal.value?.trim() !== "" && draft.signalTime.value?.trim() === "") {
        draft.signalTime.hasErrors = true
        draft.signalTime.message = "This field cannot be left empty"
      }
      if (draft.dirSignal.value?.trim() !== "" && typeof draft.tgtHit.value === "string" && draft.tgtHit.value.trim() === "") {
        draft.tgtHit.hasErrors = true
        draft.tgtHit.message = "This field cannot be left empty"
      }
      // clear error first since its a dependency
      draft.tgtHitTime.hasErrors = false
      if (draft.dirSignal.value?.trim() !== "" && draft.tgtHit.value === "Yes" && draft.tgtHitTime.value?.trim() === "") {
        draft.tgtHitTime.hasErrors = true
        draft.tgtHitTime.message = "This field cannot be left empty"
      }
      if (!draft.date.hasErrors && !draft.rangeHigh.hasErrors && !draft.rangeLow.hasErrors && !draft.rangeLogicError && !draft.dirSignal.hasErrors && !draft.signalTime.hasErrors && !draft.tgtHit.hasErrors && !draft.tgtHitTime.hasErrors && !draft.notes.hasErrors) {
        draft.submitCount++
      }
      return
  }
}

interface EditDataProps {
  item: DataPointType
}

const EditData: React.FC<EditDataProps> = ({ item }) => {
  const initialState = {
    date: {
      //eslint-disable-next-line
      value: item.date,
      hasErrors: false,
      message: ""
    },
    rangeHigh: {
      value: item.rangeHigh,
      hasErrors: false,
      message: ""
    },
    rangeLow: {
      value: item.rangeLow,
      hasErrors: false,
      message: ""
    },
    dirSignal: {
      value: item.dirSignal,
      hasErrors: false,
      message: ""
    },
    signalTime: {
      value: item.signalTime,
      hasErrors: false,
      message: ""
    },
    tgtHit: {
      value: item.tgtHit === 1 || item.tgtHit === "Yes" ? "Yes" : item.tgtHit === 0 || item.tgtHit === "No" ? "No" : "n/a",
      hasErrors: false,
      message: ""
    },
    tgtHitTime: {
      value: item.tgtHitTime,
      hasErrors: false,
      message: ""
    },
    notes: {
      value: item.notes,
      hasErrors: false,
      message: ""
    },
    rangeLogicError: false,
    submitCount: 0,
    isSaving: false
  }

  const [state, dispatch] = useImmerReducer(submitDataReducer, initialState)
  const dateInputRef = useRef<HTMLInputElement>(null)
  const manageDispatch = useContext(ManageDispatchContext)

  const submitHandler = (e: React.FormEvent) => {
    e.preventDefault()
    dispatch({ type: "submitForm" })
  }

  useEffect(() => {
    if (state.submitCount) {
      const newDataPoint = [
        {
          date: state.date.value,
          rangeHigh: state.rangeHigh.value,
          rangeLow: state.rangeLow.value,
          dirSignal: state.dirSignal.value,
          signalTime: state.signalTime.value,
          tgtHit: state.tgtHit.value,
          tgtHitTime: state.tgtHitTime.value,
          notes: state.notes.value
        }
      ]

      const updateDataPoint = async (updatedDataPoint: EditedTradingDayType[]) => {
        try {
          const response = await fetch("/api/update-item", {
            method: "POST",
            body: JSON.stringify(updatedDataPoint),
            headers: {
              "Content-Type": "application/json"
            }
          })
          const data = (await response.json()) as ResponseType
          if (data.message === "success") {
            alert("success")
            // clear form and show success message
            /* dispatch({ type: "clearFields" })
            if (dateInputRef && dateInputRef.current) {
              dateInputRef.current.focus()
            } */
            // if (data.data) manageDispatch({ type: "updateItem", value: data.data })
          }
        } catch (err) {
          throw { message: "Error", errors: err }
        }
      }
      void updateDataPoint(newDataPoint)
      return () => {
        // add abort signal
      }
    }
    //eslint-disable-next-line
  }, [state.submitCount])

  return (
    <form onSubmit={submitHandler}>
      <TextField
        InputLabelProps={{ shrink: true }}
        margin="normal"
        fullWidth
        hiddenLabel
        size="small"
        id="outlined-basic"
        label="Date"
        aria-label="target hit time"
        variant="outlined"
        type="date"
        ref={dateInputRef}
        value={state.date.value}
        onChange={e => {
          dispatch({ type: "dateCheck", value: e.target.value })
        }}
      />
      <TextField
        margin="normal"
        fullWidth
        hiddenLabel
        size="small"
        id="outlined-basic"
        label="Range High"
        variant="outlined"
        type="number"
        value={state.rangeHigh.value}
        onChange={e => {
          dispatch({ type: "rangeHighCheck", value: e.target.value })
        }}
      />
      <TextField
        margin="normal"
        fullWidth
        hiddenLabel
        size="small"
        id="outlined-basic"
        label="Range Low"
        variant="outlined"
        type="number"
        value={state.rangeLow.value}
        onChange={e => {
          dispatch({ type: "rangeLowCheck", value: e.target.value })
        }}
      />
      <TextField
        margin="normal"
        fullWidth
        hiddenLabel
        size="small"
        id="outlined-select-currency"
        select
        label="Signal"
        value={state.dirSignal.value}
        onChange={e => {
          dispatch({ type: "dirSignalCheck", value: e.target.value })
        }}
      >
        <MenuItem value={"Long"}>{"Long"}</MenuItem>
        <MenuItem value={"Short"}>{"Short"}</MenuItem>
      </TextField>
      <TextField
        InputLabelProps={{ shrink: true }}
        margin="normal"
        fullWidth
        hiddenLabel
        size="small"
        id="outlined-basic"
        label="Signal Time"
        aria-label="Signal time"
        variant="outlined"
        type="time"
        value={state.signalTime.value}
        onChange={e => {
          dispatch({ type: "signalTimeCheck", value: e.target.value })
        }}
      />
      <TextField
        margin="normal"
        fullWidth
        hiddenLabel
        size="small"
        id="outlined-select-currency"
        select
        label="Target Hit"
        value={state.tgtHit.value}
        onChange={e => {
          dispatch({ type: "tgtHitCheck", value: e.target.value })
        }}
      >
        <MenuItem value={"Yes"}>{"Yes"}</MenuItem>
        <MenuItem value={"No"}>{"No"}</MenuItem>
      </TextField>
      <TextField
        InputLabelProps={{ shrink: true }}
        margin="normal"
        fullWidth
        hiddenLabel
        size="small"
        id="outlined-basic"
        label="Target Hit Time"
        aria-label="target hit time"
        variant="outlined"
        type="time"
        value={state.tgtHitTime.value}
        onChange={e => {
          dispatch({ type: "tgtHitTimeCheck", value: e.target.value })
        }}
      />
      <TextField
        margin="normal"
        fullWidth
        hiddenLabel
        size="small"
        id="outlined-basic"
        label="Notes"
        variant="outlined"
        type="text"
        value={state.notes.value}
        onChange={e => {
          dispatch({ type: "notesCheck", value: e.target.value })
        }}
      />

      <Button>Submit</Button>
    </form>
  )
}

export default EditData