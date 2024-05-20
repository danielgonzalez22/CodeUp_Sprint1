const express = require('express')
const cors = require('cors')
const app = express()
require('dotenv').config()
const mongoose = require('./config/database')
const mainRouter = require('./routes/index')
const PORT = process.env.PORT || 3000
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors({}))
app.use('/', mainRouter)
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})