import { useImmerReducer } from "use-immer"
import { useEffect, useRef, useContext } from "react"
import { EditedTradingDayType, DataPointType, ItemUpdatedResponseType, UpdatedDataPointType } from "../../lib/types"
import { ManageDispatchContext } from "../../store/ManageContext"

// mui
import Button from "@mui/material/Button"
import TextField from "@mui/material/TextField"
import DialogActions from "@mui/material/DialogActions"
import Box from "@mui/material/Box"
import InputLabel from "@mui/material/InputLabel"
import FormControl from "@mui/material/FormControl"
import NativeSelect from "@mui/material/NativeSelect"

type AddDataActionTypes = { type: "dateCheck"; value: string } | { type: "rangeHighCheck"; value: string | number } | { type: "rangeLowCheck"; value: string | number } | { type: "dirSignalCheck"; value: string } | { type: "signalTimeCheck"; value: string } | { type: "tgtHitCheck"; value: string | number } | { type: "tgtHitTimeCheck"; value: string } | { type: "notesCheck"; value: string } | { type: "submitCount"; value: number } | { type: "isSaving"; value: boolean } | { type: "submitForm" }

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
      if (draft.dirSignal.value === "n/a") {
        draft.dirSignal.value = ""
      }
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
  item: DataPointType | UpdatedDataPointType
  isEditOpen: boolean
  handleEditClose: () => void
}

const EditData: React.FC<EditDataProps> = ({ item, handleEditClose }) => {
  const cleanedItem = {
    date: item.date,
    displayDate: item.displayDate,
    rangeHigh: item.rangeHigh,
    rangeLow: item.rangeLow,
    dirSignal: item.dirSignal !== "" && item.dirSignal !== "n/a" && item.dirSignal !== "NULL" ? item.dirSignal : "",
    signalTime: item.signalTime === "n/a" || item.signalTime === "NULL" || item.signalTime === "00:00:00" ? "" : item.signalTime,
    tgtHit: item.tgtHit !== "" && item.tgtHit !== "NULL" && item.tgtHit !== "n/a" && item.tgtHit !== "00:00:00" ? item.tgtHit : "",
    tgtHitTime: item.dirSignal !== "" && item.tgtHitTime !== "NULL" && item.tgtHitTime !== "00:00:00" ? item.tgtHitTime : "",
    notes: item.notes !== "null" && item.notes !== "n/a" ? item.notes : ""
  }
  const initialState = {
    date: {
      //eslint-disable-next-line
      value: cleanedItem.date,
      hasErrors: false,
      message: ""
    },
    rangeHigh: {
      value: cleanedItem.rangeHigh,
      hasErrors: false,
      message: ""
    },
    rangeLow: {
      value: cleanedItem.rangeLow,
      hasErrors: false,
      message: ""
    },
    dirSignal: {
      value: cleanedItem.dirSignal,
      hasErrors: false,
      message: ""
    },
    signalTime: {
      value: cleanedItem.signalTime,
      hasErrors: false,
      message: ""
    },
    tgtHit: {
      value: cleanedItem.tgtHit,
      hasErrors: false,
      message: ""
    },
    tgtHitTime: {
      value: cleanedItem.tgtHitTime,
      hasErrors: false,
      message: ""
    },
    notes: {
      value: cleanedItem.notes,
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
          originalDate: item.date,
          newDate: state.date.value,
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
            method: "PATCH",
            body: JSON.stringify(updatedDataPoint),
            headers: {
              "Content-Type": "application/json"
            }
          })
          const data = (await response.json()) as ItemUpdatedResponseType

          if (data.message === "success") {
            if (typeof data.data !== "string") {
              console.log("data.message === success && typeof data.data !== string")
              //eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              manageDispatch({ type: "updateItem", value: data.data! })
            }
            handleEditClose()
            // clear form and show success message
            /* dispatch({ type: "clearFields" })
            if (dateInputRef && dateInputRef.current) {
              dateInputRef.current.focus()
            } */
            // if (data.data) manageDispatch({ type: "updateItem", value: data.data })
          }
          if (data.message !== "success") {
            console.log("response from api to client was not success")
            //eslint-disable-next-line
            handleEditClose()
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
    <form>
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
      <Box sx={{ minWidth: 120, mt: 2, mb: 2, pl: 1, pr: 1 }}>
        <FormControl fullWidth>
          <InputLabel shrink={true} variant="standard" htmlFor="uncontrolled-native">
            Signal
          </InputLabel>
          <NativeSelect
            value={state.dirSignal.value}
            inputProps={{
              name: "Signal",
              id: "uncontrolled-native"
            }}
            onChange={e => {
              dispatch({ type: "dirSignalCheck", value: e.target.value })
            }}
          >
            <option value={""}>Select</option>
            <option value={"Long"}>Long</option>
            <option value={"Short"}>Short</option>
          </NativeSelect>
        </FormControl>
      </Box>
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
      <Box sx={{ minWidth: 120, mt: 2, mb: 2, pl: 1, pr: 1 }}>
        <FormControl fullWidth>
          <InputLabel shrink={true} variant="standard" htmlFor="uncontrolled-native">
            Target Hit
          </InputLabel>
          <NativeSelect
            inputProps={{
              name: "Target Hit",
              id: "uncontrolled-native"
            }}
            value={state.tgtHit.value}
            onChange={e => {
              dispatch({ type: "tgtHitCheck", value: e.target.value })
            }}
          >
            <option value={""}>Select</option>
            <option value={"Yes"}>Yes</option>
            <option value={"No"}>No</option>
          </NativeSelect>
        </FormControl>
      </Box>
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
      <DialogActions sx={{ mt: 2 }}>
        <Button onClick={submitHandler} variant="contained" autoFocus>
          Submit
        </Button>
        <Button onClick={handleEditClose} variant="contained">
          Cancel
        </Button>
      </DialogActions>
    </form>
  )
}

export default EditData
