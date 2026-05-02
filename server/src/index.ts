import express from 'express'
import cors from 'cors'
import recipesRouter from './routes/recipes.ts'
import fridgeRouter from './routes/fridge.ts'

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/recipes', recipesRouter)
app.use('/app/fridge', fridgeRouter)
const PORT = 3000

app.listen(PORT, () => {
    console.log("test")
})
