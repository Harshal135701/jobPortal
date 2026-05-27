const { Server } = require('socket.io')
const express = require('express')
const app = express()
const http = require("http")
// The web socket is depend on http to create a connection and persist the connectin thats why we require it and then do create connection
const server = http.createServer(app)
const io = new Server(server)
const socketHandler = require("./socket/socketHandler");
socketHandler(io);
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv')
const path = require('path')
dotenv.config()
const authRoute = require('./routes/authRoute')
const jobRoute = require('./routes/jobRoutes')
const applicationRoute = require('./routes/applicationRoutes')
const recruiterRoute = require('./routes/recruiterRoutes')
const aiRoutes = require("./routes/aiRoutes");
const notificationRoute=require("./routes/notificationRoutes")


const connectDb = require('./config/db')
const { Socket } = require('socket.io-client')
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
app.use('/recruiter', recruiterRoute)
app.use('/ai', aiRoutes)
app.use("/notification",notificationRoute)

server.listen(PORT, () => {
    console.log(`The app is listening on port${PORT}`)
})
