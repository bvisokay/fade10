import mysql from "serverless-mysql"
import { MongoClient } from "mongodb"

const db = mysql({
  config: {
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT ? parseInt(process.env.MYSQL_PORT) : undefined,
    database: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD
  }
})

export default async function executeQuery(query: string, payload?: string) {
  try {
    const results = await db.query(query, payload)
    await db.end()
    return results
  } catch (error) {
    return { error }
  }
}

export async function connectToDatabase() {
  const uri = process.env.MONGODB_URI
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const client = await MongoClient.connect(uri!)

  return client
} // end connectToDatabas
