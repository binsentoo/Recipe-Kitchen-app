import { BrowserRouter, Routes, Route } from 'react-router-dom'
import RecipesPage from './pages/RecipesPage'
import FridgePage from './pages/FridgePage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RecipesPage/>} />
        <Route path="/fridge" element={<FridgePage/>} />
      </Routes>  
    </BrowserRouter>
  )
}

export default App