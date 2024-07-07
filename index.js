import express from 'express'
import msgRouter from './src/modules/msg/msg.routes.js';
import userRouter from './src/modules/user/user.routes.js';
import connectDB from './db/connections.js';
const app = express()
const port = 3000
connectDB()
app.use(express.json())
app.use("/users", userRouter)
app.use("/msgs", msgRouter)

app.get('*', (req, res) => res.send('Page Noy Found!').status(404));
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

