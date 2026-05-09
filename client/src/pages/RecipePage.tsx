import { useEffect, useState } from 'react'
import api from '../lib/api'
import { Spinner } from '@/components/ui/spinner'
import { useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
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
  averageRating: number | null
  ingredients: Ingredient[]
  steps: Step[]
  ratings: Rating[]
}

interface Ingredient {
  id: string
  name: string
  quantity: string
  unit: string
}

interface Step {
  id: string
  stepNumber: number
  description: string
}

interface Rating {
  id: string
  name: string
  rating: number
  comment: string | null
  createdAt: string
}

function RecipePage() {
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [sharingId, setSharingId] = useState<string | null>(null)
  const navigate = useNavigate()

  function fetchRecipe() {
    api.get(`/recipes/${id}`)
    .then(res => setRecipe(res.data))
    .catch(err => console.log(err))
    .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchRecipe()
  }, [])

  if (loading) return (
  <div className="flex items-center gap-2 p-8">
    <Spinner />
    <p>Loading...</p>
  </div>
  )

  if (!recipe) return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <p className="text-muted-foreground">Recipe not found.</p>
    </div>
  )

  return (
    <div className="p-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <Button variant="ghost" onClick={() => navigate('/')}>← Back</Button>
        <Button variant="destructive">Delete</Button>
      </div>
      {/* Title */}
      <div className="mb-3">
        <h1 className="text-3xl font-bold mb-2">{recipe.title}</h1>
        <div className="flex gap-8 text-muted-foreground">
          <span>{recipe.timeMinutes} minutes</span>
          <span>{recipe.servings} servings</span>
          {recipe.averageRating && (
            <span className="text-sm text-muted-foreground">
              ⭐ {recipe.averageRating.toFixed(1)}
            </span>
          )}
        </div>
      </div>
      {/* Share Buttons */}
      <div className="gap-3 flex">
        <Button variant="outline" disabled>Share Recipe</Button>
        <Button variant="outline" onClick={() => setSharingId(recipe.id)}>Share Rating Link</Button>
      </div>
      {/* Ingredients */}
      <div>
        <h2 className="font-bold text-3xl">Ingredients</h2>
        <ul>
          {recipe.ingredients.map(ingredient => (
            <li key={ingredient.id}>
              <p>{ingredient.name} {ingredient.quantity} {ingredient.unit}</p>
            </li>
          ))}
        </ul>
      </div>
      {/* Steps */}
      <div>
        <h2>Steps</h2>
        <ul>
          {recipe.steps.map(step => (
            <li key={step.id}>
              <p>{step.stepNumber} {step.description}</p>
            </li>
          ))}
        </ul>
      </div>
      {/* Ratings */}
      <div>
        <h2>Ratings</h2>
        <ul>
          {recipe.ratings.map(rating => (
            <li key={rating.id}>
              <p>{rating.name} {rating.rating} {rating.comment} {rating.createdAt}</p>
            </li>
          ))}
        </ul>
      </div>



      {/* QR code */}
      <Dialog open={sharingId === recipe.id} onOpenChange={() => setSharingId(null)}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Rating QR Code</DialogTitle>
            <DialogDescription>Show this QR code to your friends who tried the meal!</DialogDescription>
          </DialogHeader>
          <QRCodeSVG
            value={`https://recipe-kitchen-app-sigma.vercel.app/rate/${recipe.id}`}
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
  )
}

export default RecipePage