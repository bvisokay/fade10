import { useEffect, useContext } from "react"
import { DataPointType, FetchAllDataResultType } from "../lib/types"
import { getSession } from "next-auth/react"
import { GetServerSidePropsContext } from "next"
import AppDataGrid from "../components/Manage/AppDataGrid"
import AddData from "../components/Manage/AddData"
import { fetchAllData } from "../lib/util"

import { ManageDispatchContext } from "../store/ManageContext"

type PropTypes = {
  spy: DataPointType[]
}

const Manage: React.FC<PropTypes> = props => {
  const manageDispatch = useContext(ManageDispatchContext)

  useEffect(() => {
    manageDispatch({ type: "addMultipleItems", value: props.spy })
    //eslint-disable-next-line
  }, [])

  if (!props.spy.length) {
    return <p>Loading...</p>
  }

  return (
    <>
      <AddData />
      <hr />
      <AppDataGrid />
    </>
  )
}

/*
 *
 * GETSERVERSIDEPROPS
 *
 */

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

  const result: FetchAllDataResultType = await fetchAllData()

  if (result.message !== "success") {
    return {
      props: {
        session,
        spy: []
      }
    }
  }

  if (result.message === "success") {
    return {
      props: {
        session,
        spy: result.data
      }
    }
  }
}

export default Manage
