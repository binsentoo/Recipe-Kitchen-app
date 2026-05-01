import express from 'express'
import cors from 'cors'
import recipesRouter from './routes/recipes.ts'

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/recipes', recipesRouter)

const PORT = 3000

app.listen(PORT, () => {
    console.log("test")
})
