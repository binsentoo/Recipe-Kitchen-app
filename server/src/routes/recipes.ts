import express from 'express'
import prisma from '../lib/prisma.ts'

const router = express.Router()

// POST create rating
router.post('/:id/ratings', async (req, res) => {
    try {
        const { name, rating, comment } = req.body
        const newRating = await prisma.rating.create({
            data: {
                recipeId: req.params.id,
                name,
                rating,
                comment,
            }
        })
        res.json(newRating)
    } catch (error) {
        console.error(error)
        res.status(500).json({error: 'Failed to create rating'})
    }
})

// GET all ratings by recipe id
router.get('/:id/ratings', async (req, res) => {
    try { 
        const ratings = await prisma.rating.findMany({
            where: {recipeId: req.params.id},
            orderBy: { createdAt: 'desc' }
        })
        res.json(ratings)
    } catch (error) {
        console.error(error)
        res.status(500).json({error: 'Failed to get ratings'})
    }
})


// POST create recipe
router.post('/', async (req, res) => {
    try { 
        const { title, timeMinutes, servings, ingredients, steps } = req.body
        const recipe = await prisma.recipe.create({
            data: {
                title,
                timeMinutes,
                servings,
                ingredients: {
                    create: ingredients
                },
                steps: {
                    create: steps
                }
            },
            include: {
                ingredients: true,
                steps: true
            }
        })
        res.json(recipe) 
    } catch (error) {
        console.error(error)
        res.status(500).json({error: 'Failed to create recipe'})
    }
})

// GET read recipe (by id)
router.get('/:id', async (req, res) => {
    try {
        const recipe = await prisma.recipe.findUnique({
            where: { id: req.params.id },
            include: {
                ingredients: true,
                steps: true
            }
        })
        if (!recipe) {
            return res.status(404).json({ error: 'Recipe not found via id: ' + req.params.id })
        }
        res.json(recipe)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Failed to fetch recipe via id: ' + req.params.id })
    }
})

// GET all recipes
router.get('/', async (req, res) => {
    try {
        const recipes = await prisma.recipe.findMany({
            include: {
                ingredients: true,
                steps: true
            }
        })
        res.json(recipes)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Failed to fetch recipes'})
    }
})

// PUT update recipe
router.put('/:id', async (req, res) => {
    try {
        const { title, timeMinutes, servings, ingredients, steps } = req.body

        // delete old recipe ingredient and steps
        await prisma.recipeIngredient.deleteMany({
            where: { recipeId: req.params.id }
        })
        await prisma.recipeStep.deleteMany({
            where: { recipeId: req.params.id }
        })

    // update recipe via replacing the whole thing
    const recipe = await prisma.recipe.update({
        where: { id: req.params.id },
        data: {
            title,
            timeMinutes,
            servings,
            ingredients: {
                create: ingredients
            },
            steps: {
                create: steps
            }
        },
        include: {
            ingredients: true,
            steps: true
        }
        })
        res.json(recipe)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Failed to update recipe: ' + req.params.id })
    }
})

// DELETE recipe
router.delete('/:id', async (req, res) => {
    try {
        await prisma.recipe.delete({
            where: { id: req.params.id }
        })
        res.json({ message: 'Recipe deleted ' + req.params.id})
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Failed to delete recipe via id ' + req.params.id})
    }
})

export default router