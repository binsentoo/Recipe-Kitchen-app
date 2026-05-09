import { BrowserRouter, Routes, Route } from 'react-router-dom'
import RecipesPage from './pages/RecipesPage'
import RecipePage from './pages/RecipePage'
import FridgePage from './pages/FridgePage'
import RatingPage from './pages/RatingPage'
import { Toaster } from "@/components/ui/sonner"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RecipesPage/>} />
        <Route path="/recipe/:id" element={<RecipePage/>} />
        <Route path="/fridge" element={<FridgePage/>} />
        <Route path="/rate/:id" element={<RatingPage/>} />
      </Routes>
      <Toaster/>
    </BrowserRouter>
  )
}

export default App