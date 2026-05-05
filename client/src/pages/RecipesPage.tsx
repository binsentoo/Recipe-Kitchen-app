import { useEffect, useState } from 'react'
import api from '../lib/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Spinner } from "@/components/ui/spinner"
import { ButtonGroup } from "@/components/ui/button-group"

interface Recipe {
  id: string
  title: string
  timeMinutes: number
  servings: number
}

interface Ingredient {
  name: string
  quantity: string
  unit: string
}

interface Step {
  stepNumber: number
  description: string
}

function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [timeMinutes, setTimeMinutes] = useState('')
  const [servings, setServings] = useState('')
  const [ingredients, setIngredients] = useState<Ingredient[]>([
  { name: '', quantity: '', unit: '' }])
  const [steps, setSteps] = useState<Step[]>([
    { stepNumber: 1, description: '' }])

  function fetchRecipes() {
    api.get('/recipes')
      .then(res => setRecipes(res.data))
      .catch(err => console.log(err))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchRecipes()
  }, [])

  if (loading) return (
    <div className="flex items-center gap-2 p-8">
      <Spinner />
      <p>Loading...</p>
    </div>
  )

  function addRecipe() {
    if (!title || !timeMinutes || !servings || !ingredients || !steps) return
    api.post('/recipes', {
      title,
      timeMinutes: parseInt(timeMinutes),
      servings: parseInt(servings),
      ingredients: ingredients.map(ing => ({
        ...ing,
        quantity: parseInt(ing.quantity)
        })),
      steps
    }).then(() => {
      fetchRecipes()
      setShowForm(false),
      setTitle(''),
      setTimeMinutes(''),
      setServings(''),
      setIngredients([{ name: '', quantity: '', unit: '' }])
      setSteps([{ stepNumber: 1, description: '' }])
    }).catch(err => console.log(err))
  }

  // add blank ingredient
  function addIngredient() {
    setIngredients([...ingredients, {name: '', quantity: '', unit: '' }])
  }

  // remove via index
  function removeIngredient(index: number) {
    setIngredients(ingredients.filter((_, i) => i !== index))
  }

  // update specific ingredient field
  function updateIngredient(index: number, field: string, value: string) {
    const updated = [...ingredients]
    updated[index] = {...updated[index], [field]: value}
    setIngredients(updated)
  }

  function addStep() {
    setSteps([...steps, { stepNumber: steps.length + 1, description: '' }])
  }

  function removeStep(index: number) {
    setSteps(steps.filter((_, i) => i !== index))
  }

  function updateStep(index: number, value: string) {
    const updated = [...steps]
    updated[index] = {...updated[index], description: value}
    setSteps(updated)
  }

  return (
    <div className="p-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold">My Recipes</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add Recipe'}
        </Button>
      </div>

      {/* Add Recipe Form */}
      {showForm && (
        <div className="bg-card border rounded-xl p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">New Recipe</h2>
          <div className="grid grid-cols-3 gap-10 mb-4">
            {/* First column */}
            <div>
              <div className="mb-5">
                <label className="text-sm text-accent-foreground mb-1 block">Title</label>
                <Input
                  placeholder="e.g. Kimchi Stew"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                />
              </div>
              <div className="mb-5">
                <label className="text-sm text-accent-foreground mb-1 block">Time (min)</label>
                <Input
                  type="number"
                  placeholder="25"
                  value={timeMinutes}
                  onChange={e => setTimeMinutes(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="text-sm text-accent-foreground mb-1 block">Servings</label>
                <Input
                  type="number"
                  placeholder="2"
                  value={servings}
                  onChange={e => setServings(e.target.value)}
                />
              </div>
            </div>
            {/* Second Column (ingredients)*/}
            <div>
              <label className="text-sm text-accent-foreground mb-1 block">Ingredients</label>
              {ingredients.map((ingredient, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder="Name"
                    value={ingredient.name}
                    onChange={e => updateIngredient(index, 'name', e.target.value)}
                  />
                  <Input
                    placeholder="Quantity"
                    type="number"
                    value={ingredient.quantity}
                    onChange={e => updateIngredient(index, 'quantity', e.target.value)}
                  />
                  <Input
                    placeholder="Unit"
                    value={ingredient.unit}
                    onChange={e => updateIngredient(index, 'unit', e.target.value)}
                  />
                  <Button onClick={addIngredient}>Add</Button>
                </div>
              ))}
            </div>
            {/* Third Column (steps)*/}
            <div>
              <label className="text-sm text-accent-foreground mb-1 block">Steps</label>
              {steps.map((step, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder="Name"
                    value={step.stepNumber}
                    onChange={e => updateStep(index, e.target.value)}
                  />
                  <Input
                    placeholder="Description"
                    value={step.description}
                    onChange={e => updateStep(index, e.target.value)}
                  />
                  <Button onClick={addStep}>Add</Button>
                </div>
              ))}
            </div>
          </div>
          <Button onClick={addRecipe}>Save Recipe</Button>
        </div>
      )}

      {/* Empty state */}
      {recipes.length === 0 && (
        <div className="text-center py-20 text-muted-foreground">
          <p className="text-5xl mb-4">🍽</p>
          <p className="text-lg">No recipes yet — add your first one!</p>
        </div>
      )}

      {/* Recipe Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {recipes.map(recipe => (
          <Card key={recipe.id} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="text-lg">{recipe.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {recipe.timeMinutes} min
              </p>
              <p className="text-sm text-muted-foreground">
                {recipe.servings} servings
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default RecipesPage