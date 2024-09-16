require('dotenv').config()
const express = require('express')
const cors = require('cors')
const router = require('./routes/index')
const errorHandler = require('./middleware/ErrorHandlingMiddleware')

const PORT = process.env.PORT || 5000


const app = express()
app.use(cors())
app.use(express.json())
app.use('/api', router)

app.use(errorHandler)

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
