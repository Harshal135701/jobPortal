const express = require('express')
const app = express()
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv')
const path = require('path')
dotenv.config()
const authRoute = require('./routes/authRoute')
// const staticRoute=require('./routes/staticRoutes')
const jobRoute = require('./routes/jobRoutes')
const applicationRoute = require('./routes/applicationRoutes')


const connectDb = require('./config/db')
connectDb()

const PORT = process.env.PORT;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());


app.use('/', authRoute)
app.use('/jobs', jobRoute)
app.use('/applications', applicationRoute)

app.listen(PORT, () => {
    console.log(`The app is listening on port${PORT}`)
})
