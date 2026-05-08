import { useEffect, useState } from 'react'
import api from '../lib/api'
import { useParams } from 'react-router-dom'

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { toast } from 'sonner'

interface Recipe {
  id: string
  title: string
  timeMinutes: number
  servings: number
}

interface Rating {
  id: string
  name: string
  rating: number
  comment: string | null
  createdAt: string
}

function RatingPage() {
    const { id } = useParams()
    const [recipe, setRecipe] =  useState<Recipe | null>(null)
    const [loading, setLoading] = useState(true)
    const [name, setName] = useState('')
    const [rating, setRating] = useState(5)
    const [comment, setComment] = useState('')
    const [submitted, setSubmitted] = useState(false)

    function submitRating() {
      if (!name) {
        toast.error("Please input a name!")
        return
      }
      api.post(`recipes/${id}/ratings`, {
        name,
        rating,
        comment
      }).then(() => {
        setSubmitted(true)
        toast.success("Rating submitted!")
      }).catch((err) => {
        console.log(err)
        toast.error("Something went wrong!")
      })
    }

    useEffect(() => {
      api.get(`/recipes/${id}`)
        .then(res => setRecipe(res.data))
        .catch(err => console.log(err))
        .finally(() => setLoading(false))
    }, [id])

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

    if (submitted) return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-muted-foreground">thank u for submitting</p>
      </div>
    )

    return (
     <div className="p-10">
        <FieldSet>
          <FieldLegend>Rate {recipe.title}</FieldLegend>
          <FieldDescription>Please leave honest feedback!</FieldDescription>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <Input id="name" autoComplete="off" onChange={e => setName(e.target.value)}/>
            </Field>
            <Field>
              <FieldLabel htmlFor="rating">Rating (0-10)</FieldLabel>
              <Slider id="rating" min={0} max={10} value={[rating]} onValueChange={val => setRating(val[0])} step={.1} />
              <FieldDescription className="text-sm font-medium w-4">{rating}</FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="comment">Comment</FieldLabel>
              <Textarea id="comment" onChange={e => setName(e.target.value)} />
            </Field>
            <Button onClick={submitRating}>Submit</Button>
          </FieldGroup>
        </FieldSet>
     </div>   
    )
}

export default RatingPage