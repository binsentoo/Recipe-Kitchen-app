import express from 'express'
import prisma from '../lib/prisma.ts'

const router = express.Router()

// GET all fridge items
router.get('/', async (req, res) => {
    try {
        const items = await prisma.fridgeItem.findMany()
        res.json(items)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Failed to fetch fridge items" })
    }
})

// GET specific fridge item
router.get('/:id', async (req, res) => {
    try {
        const item = await prisma.fridgeItem.findUnique({
            where: { id: req.params.id }
        })
        res.json(item)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Failed to fetch fridge item " + req.params.id})
    }
})

// POST create fridge item
router.post('/', async (req, res) => {
    try {
        const { quantity, unit, expiration } = req.body
        const item = await prisma.fridgeItem.create({
            data: {
                quantity,
                unit,
                expiration
            }
        })
        res.json(item)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Failed to create fridge item"})
    }
})

// PUT update fridge
router.put('/:id', async (req, res) => {
    try {
        const { quantity, unit, expiration } = req.body
        const item = await prisma.fridgeItem.update({
            where: { id: req.params.id},
            data: {
                quantity,
                unit,
                expiration
            }
        })
        res.json(item)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Failed to update fridge item " + req.params.id})
    }
})

// DELETE fridge item
router.delete('/:id', async (req, res) => {
    try {
        await prisma.fridgeItem.delete({
            where: { id: req.params.id }
        })
        res.json({ message: 'Fridge item deleted ' + req.params.id})
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Failed to delete fridge item via id ' + req.params.id})
    }
})

export default router