import { useEffect, useState } from 'react'
import api from '../lib/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Spinner } from "@/components/ui/spinner"
import { ButtonGroup } from "@/components/ui/button-group"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { toast } from "sonner"
import { Textarea } from "@/components/ui/textarea"
import { QRCodeSVG } from 'qrcode.react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"

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
  const [sharingId, setSharingId] = useState<string | null>(null)

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
      toast.success("Recipe has been added.")
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
        <Button size="lg" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add Recipe'}
        </Button>
      </div>

      {/* Add Recipe Form */}
      {showForm && (
        <div className="bg-card border rounded-xl p-6 mb-8">
          <div className="flex mb-4">
            <h2 className="text-lg font-semibold">New Recipe</h2>
            <ToggleGroup disabled className="ml-5" type="single" spacing={5} variant="outline">
              <ToggleGroupItem value="manual">Input Manually</ToggleGroupItem>
              <ToggleGroupItem value="text">Import by Copy & Paste</ToggleGroupItem>
              <ToggleGroupItem value="import">Import via Link</ToggleGroupItem>
            </ToggleGroup>
          </div>
          <div className="grid md:grid-cols-3 grid-cols-1 gap-10 mb-4">
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
                  {index === ingredients.length - 1 ? (
                    // Last row — show Add button
                    <Button variant="outline" onClick={addIngredient}>+</Button>
                  ) : (
                    // All other rows — show Delete button
                    <Button variant="destructive" onClick={() => removeIngredient(index)}>✕</Button>
                  )}
                </div>
              ))}
            </div>
            {/* Third Column (steps)*/}
            <div>
              <label className="text-sm text-accent-foreground mb-1 block">Steps</label>
              {steps.map((step, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="self-center text-sm text-muted-foreground w-6 text-center shrink-0">
                    {step.stepNumber}.
                  </span>
                  <Input
                    placeholder="Description"
                    value={step.description}
                    onChange={e => updateStep(index, e.target.value)}
                  />
                  {index === steps.length - 1 ? (
                    <Button variant="outline" onClick={addStep}>+</Button>
                  ) : (
                    <Button variant="destructive" onClick={() => removeStep(index)}>✕</Button>
                  )}
                </div>
              ))}
            </div>
          </div>
          <Button size="lg" onClick={addRecipe}>Save Recipe</Button>
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
          <div key={recipe.id}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
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
                <Button variant="outline" onClick={() => setSharingId(recipe.id)}>Share Rating Link</Button>
              </CardContent>
            </Card>

            {/* QR code */}
            <Dialog open={sharingId === recipe.id} onOpenChange={() => setSharingId(null)}>
              <DialogContent showCloseButton={false}>
                <DialogHeader>
                  <DialogTitle>Rating QR Code</DialogTitle>
                  <DialogDescription>Show this QR code to your friends who tried the meal!</DialogDescription>
                </DialogHeader>
                <QRCodeSVG
                  value={`http://localhost:5173/rate/${recipe.id}`}
                  size={200}
                />
                <DialogFooter className="sm:justify-start">
                  <DialogClose asChild>
                    <Button type="button">Close</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RecipesPage