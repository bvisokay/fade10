import { useEffect, useState } from "react"
import { TradingDayType, QueryResponseType, DataRowType } from "../lib/types"
import { getSession } from "next-auth/react"
import { GetServerSidePropsContext } from "next"
import executeQuery from "../lib/db"
import AppDataGrid from "../components/AppDataGrid"
import AddData from "../components/AddData"

type PropTypes = {
  spy: TradingDayType[]
}

const Manage: React.FC<PropTypes> = props => {
  //console.log(props)
  //console.log("props.spy", props.spy)

  const [spy, setSpy] = useState<TradingDayType[]>([])

  useEffect(() => {
    const datedAndSortedSpy = props.spy
      .map(item => {
        item.formattedDate = new Date(item.date)
        return { ...item }
      })
      .sort((a, b) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        if (a.formattedDate! > b.formattedDate!) return -1
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        if (a.formattedDate! < b.formattedDate!) return 1
        else return 0
      })
    setSpy(datedAndSortedSpy)
    //eslint-disable-next-line
  }, [])

  if (!spy.length) {
    return <p>Loading...</p>
  }

  return (
    <>
      <AddData />
      <hr />
      {spy.length && <AppDataGrid spy={spy} />}
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

  try {
    const response = (await executeQuery(`SELECT * FROM spy`)) as QueryResponseType

    if (response.error) {
      //eslint-disable-next-line
      console.log(`Error from DB operation: ${response.error}`)
      throw new Error()
    }
    let cleanedResponse: TradingDayType[] = []

    if (Array.isArray(response)) {
      cleanedResponse = response.map((item: DataRowType) => {
        return {
          date: item.date.toString(),
          rangeHigh: item.rangehigh,
          rangeLow: item.rangelow,
          dirSignal: item.dirsignal,
          signalTime: item.signaltime,
          tgtHit: item.tgthit,
          tgtHitTime: item.tgthittime,
          notes: item.notes
        }
      })
    }

    return {
      props: {
        session,
        spy: cleanedResponse
      }
    }
  } catch (err) {
    //eslint-disable-next-line
    console.log(`There was an error: ${err}`)
    return {
      props: {
        session,
        spy: []
      }
    }
  }
}

export default Manage
