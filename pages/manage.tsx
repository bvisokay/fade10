import { useImmerReducer } from "use-immer"
import { useEffect } from "react"
import styled from "@emotion/styled"
import { TradingDayType, ResponseType } from "../lib/types"
import { getSession } from "next-auth/react"
import { GetServerSidePropsContext } from "next"
import { BtnWide } from "../styles/GlobalComponents"

const Form = styled.form`
  border: 1px solid #999;
  border-radius: 0.23rem;
  margin: 3rem auto 3rem auto;
  max-width: 450px;
  padding: 1rem 0.5rem;

  .form-control {
    //border: 1px solid dodgerblue;
    margin-bottom: 0.5rem;
    padding: 0.5rem 0.25rem;
  }
  label {
    display: block;
    font-size: 0.8rem;
    padding-bottom: 0.25rem;
    font-weight: bold;
    color: var(--primary);
  }
  input,
  select,
  option {
    //border-radius: 0.23rem;
    padding: 0.5rem;
  }
`

type AddDataActionTypes = { type: "dateCheck"; value: string } | { type: "rangeHighCheck"; value: string } | { type: "rangeLowCheck"; value: string } | { type: "dirSignalCheck"; value: string } | { type: "signalTimeCheck"; value: string } | { type: "tgtHitCheck"; value: string } | { type: "tgtHitTimeCheck"; value: string } | { type: "notesCheck"; value: string } | { type: "submitCount"; value: number } | { type: "isSaving"; value: boolean } | { type: "submitForm" }

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
    value: string
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

const initialState = {
  date: {
    value: "",
    hasErrors: false,
    message: ""
  },
  rangeHigh: {
    value: "",
    hasErrors: false,
    message: ""
  },
  rangeLow: {
    value: "",
    hasErrors: false,
    message: ""
  },
  dirSignal: {
    value: "",
    hasErrors: false,
    message: ""
  },
  signalTime: {
    value: "",
    hasErrors: false,
    message: ""
  },
  tgtHit: {
    value: "",
    hasErrors: false,
    message: ""
  },
  tgtHitTime: {
    value: "",
    hasErrors: false,
    message: ""
  },
  notes: {
    value: "",
    hasErrors: false,
    message: ""
  },
  rangeLogicError: false,
  submitCount: 0,
  isSaving: false
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
      if (draft.notes.value.length > 100) {
        draft.notes.hasErrors = true
        draft.notes.message = "Notes cannot exceed 100 characters"
      }
      return
    case "submitForm":
      if (draft.date.value.trim() == "") {
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
      if (draft.dirSignal.value.trim() === "") {
        //draft.dirSignal.hasErrors = true
        draft.dirSignal.message = "Signal field left empty, but okay"
      }
      if ((draft.dirSignal.value.trim() === "" && draft.signalTime.value !== "") || (draft.dirSignal.value.trim() === "" && draft.tgtHit.value !== "") || (draft.dirSignal.value.trim() === "" && draft.tgtHitTime.value !== "")) {
        draft.dirSignal.hasErrors = true
        draft.dirSignal.message = "Signal field left empty, not okay"
      }
      if (draft.dirSignal.value.trim() !== "" && draft.signalTime.value.trim() === "") {
        draft.signalTime.hasErrors = true
        draft.signalTime.message = "This field cannot be left empty"
      }
      if (draft.dirSignal.value.trim() !== "" && draft.tgtHit.value.trim() === "") {
        draft.tgtHit.hasErrors = true
        draft.tgtHit.message = "This field cannot be left empty"
      }
      // clear error first since its a dependency
      draft.tgtHitTime.hasErrors = false
      if (draft.dirSignal.value.trim() !== "" && draft.tgtHit.value === "Yes" && draft.tgtHitTime.value.trim() === "") {
        draft.tgtHitTime.hasErrors = true
        draft.tgtHitTime.message = "This field cannot be left empty"
      }
      if (!draft.date.hasErrors && !draft.rangeHigh.hasErrors && !draft.rangeLow.hasErrors && !draft.rangeLogicError && !draft.dirSignal.hasErrors && !draft.signalTime.hasErrors && !draft.tgtHit.hasErrors && !draft.tgtHitTime.hasErrors && !draft.notes.hasErrors) {
        draft.submitCount++
      }
      return
  }
}

const Manage = () => {
  const [state, dispatch] = useImmerReducer(submitDataReducer, initialState)

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

      const saveNewDataPoint = async (newDataPoint: TradingDayType[]) => {
        try {
          const response = await fetch("/api/create-item", {
            method: "POST",
            body: JSON.stringify(newDataPoint),
            headers: {
              "Content-Type": "application/json"
            }
          })
          const data = (await response.json()) as ResponseType
          if (data.message === "success") {
            // clear form and show success message
          }
        } catch (err) {
          throw { message: "Error", errors: err }
        }
      }
      void saveNewDataPoint(newDataPoint)
      return () => {
        // add abort signal
      }
    }
    //eslint-disable-next-line
  }, [state.submitCount])

  return (
    <>
      <Form onSubmit={submitHandler}>
        <h3>Add Data</h3>
        <div className="form-control">
          <label>Date</label>
          <input
            type="date"
            value={state.date.value}
            onChange={e => {
              dispatch({ type: "dateCheck", value: e.target.value })
            }}
          />
        </div>
        <div className="form-control">
          <label>Range High</label>
          <input
            type="number"
            value={state.rangeHigh.value}
            onChange={e => {
              dispatch({ type: "rangeHighCheck", value: e.target.value })
            }}
          />
        </div>
        <div className="form-control">
          <label>Range Low</label>
          <input
            type="number"
            value={state.rangeLow.value}
            onChange={e => {
              dispatch({ type: "rangeLowCheck", value: e.target.value })
            }}
          />
        </div>
        <div className="form-control">
          <label>Signal</label>
          <select
            value={state.dirSignal.value}
            onChange={e => {
              dispatch({ type: "dirSignalCheck", value: e.target.value })
            }}
          >
            <option></option>
            <option>Long</option>
            <option>Short</option>
          </select>
        </div>
        <div className="form-control">
          <label>Signal Time</label>
          <input
            type="time"
            value={state.signalTime.value}
            onChange={e => {
              dispatch({ type: "signalTimeCheck", value: e.target.value })
            }}
          />
        </div>
        <div className="form-control">
          <label>Tgt Hit</label>
          <select
            value={state.tgtHit.value}
            onChange={e => {
              dispatch({ type: "tgtHitCheck", value: e.target.value })
            }}
          >
            <option></option>
            <option>Yes</option>
            <option>No</option>
          </select>
        </div>
        <div className="form-control">
          <label>Tgt Hit Time</label>
          <input
            type="time"
            value={state.tgtHitTime.value}
            onChange={e => {
              dispatch({ type: "tgtHitTimeCheck", value: e.target.value })
            }}
          />
        </div>
        <div className="form-control">
          <label>Notes</label>
          <input
            type="text"
            value={state.notes.value}
            onChange={e => {
              dispatch({ type: "notesCheck", value: e.target.value })
            }}
          />
        </div>
        <BtnWide>Submit</BtnWide>
      </Form>
    </>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession({ req: context.req })

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false
      }
    }
  }

  if (session?.user?.name !== process.env.SCRIBE) {
    return {
      redirect: {
        destination: "/",
        permanent: false
      }
    }
  }

  return {
    props: {
      session
    }
  }
}

export default Manage
