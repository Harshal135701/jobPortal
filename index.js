const express = require('express')
const app = express()
const dotenv = require('dotenv')
dotenv.config()
const authRoute = require('./routes/authRoute')
const staticRoute=require('./routes/staticRoutes')


const connectDb = require('./config/db')
connectDb()

const PORT = process.env.PORT;

app.use(express.json());
app.use('/api', staticRoute)
app.use('/api/auth', authRoute)

app.get('/', (req, res) => {
    res.send("Hey this is new project")
})


app.listen(PORT, () => {
    console.log(`The app is listening on port${PORT}`)
})
