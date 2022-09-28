import { startBot } from "./bot"
import { connectToMongoDB } from "./database/database"

async function start() {
    await connectToMongoDB()
    await startBot()
}


start()