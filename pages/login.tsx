import { useEffect /* useContext */ } from "react"
import { useImmerReducer } from "use-immer"
import Link from "next/link"
import { useRouter } from "next/router"
import { signIn } from "next-auth/react"
import { getSession } from "next-auth/react"
//import { GlobalDispatchContext } from "../store/GlobalContext"
import { GetServerSideProps, GetServerSidePropsContext } from "next"

import { BtnWide, SectionVeryNarrow, FormControl } from "../styles/GlobalComponents"

// need to protect

const Login: React.FC = () => {
  //const appDispatch = useContext(GlobalDispatchContext)
  const router = useRouter()

  type LoginActionTypes = { type: "usernameChecks"; value: string } | { type: "passwordChecks"; value: string } | { type: "submitForm"; value?: string }

  const initialState = {
    username: {
      value: "",
      hasErrors: false,
      message: ""
    },
    password: {
      value: "",
      hasErrors: false,
      message: ""
    },
    showErrors: false,
    submitCount: 0
  }

  const [state, dispatch] = useImmerReducer(loginReducer, initialState)

  function loginReducer(draft: typeof initialState, action: LoginActionTypes) {
    switch (action.type) {
      case "usernameChecks":
        draft.username.hasErrors = false
        draft.username.value = action.value
        if (draft.username.value === "") {
          draft.username.hasErrors = true
          draft.username.message = "Enter a username"
        }
        if (draft.username.value.length > 30 || draft.username.value.length < 3) {
          draft.username.hasErrors = true
          draft.username.message = "Invalid username"
        }
        if (draft.username.value && !/^([a-zA-Z0-9]+)$/.test(draft.username.value)) {
          draft.username.hasErrors = true
          draft.username.message = "Invalid username"
        }
        return
      case "passwordChecks":
        draft.password.hasErrors = false
        draft.password.value = action.value
        if (draft.password.value === "") {
          draft.password.hasErrors = true
          draft.password.message = "Enter a password"
        }
        if (draft.password.value.length > 50 || draft.password.value.length < 8) {
          draft.password.hasErrors = true
          draft.password.message = "Invalid password"
        }
        return
      case "submitForm":
        if (!draft.username.hasErrors && !draft.password.hasErrors) {
          draft.showErrors = false
          draft.submitCount++
        } else {
          draft.showErrors = true
        }
        return
    }
  }

  async function fetchResults(signal: AbortSignal) {
    try {
      const result = await signIn("credentials", {
        signal: signal,
        redirect: false,
        username: state.username.value?.toLowerCase(),
        password: state.password.value
      })

      // no user found or bad username/password
      // what if we send non-alphanumeric
      if (result?.error) {
        //appDispatch({ type: "flashMessage", value: result.error })
        return
      }
      // push to new page
      void router.replace("/data")
      // show message to the user
      //appDispatch({ type: "flashMessage", value: "Welcome Back" })

      //
    } catch (err) {
      console.log("err", err)
    }
  }

  // useEffect to watch sendCount to attempt signIn only after validation passes
  // don't run when the page first loads
  useEffect(() => {
    if (state.submitCount) {
      const controller = new AbortController()
      const signal = controller.signal
      void fetchResults(signal)
      return () => controller.abort()
    }
    //eslint-disable-next-line
  }, [state.submitCount])

  function loginSubmitHandler(e: React.FormEvent) {
    e.preventDefault()
    //check for validation errors
    dispatch({ type: "usernameChecks", value: state.username.value })
    dispatch({ type: "passwordChecks", value: state.password.value })
    dispatch({ type: "submitForm" })
  }

  return (
    <SectionVeryNarrow>
      <h2>Sign In</h2>

      <form onSubmit={loginSubmitHandler}>
        <FormControl>
          <label htmlFor="username">Username</label>
          <input type="text" value={state.username.value} onChange={e => dispatch({ type: "usernameChecks", value: e.target.value })} aria-label="username" autoComplete="off" placeholder="Username" autoFocus />
          {state.showErrors && state.username.hasErrors && <div className="liveValidateMessage">{state.username.message}</div>}
        </FormControl>
        <FormControl>
          <label htmlFor="password">Password</label>
          <input type="password" value={state.password.value} onChange={e => dispatch({ type: "passwordChecks", value: e.target.value })} aria-label="password" autoComplete="off" placeholder="Password" />
          {state.showErrors && state.password.hasErrors && <div className="liveValidateMessage">{state.password.message}</div>}
        </FormControl>
        <BtnWide>Sign In</BtnWide>
      </form>
      <p>
        Don&apos;t have an account?{" "}
        <Link href="/register">
          <a className="primary-color strong">Register Free</a>
        </Link>
      </p>
    </SectionVeryNarrow>
  )
}

export default Login

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  const session = await getSession({ req: context.req })

  if (session) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false
      }
    }
  }

  return {
    props: {}
  }
}
