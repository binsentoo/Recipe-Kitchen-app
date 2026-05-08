import { useEffect, useState } from 'react'
import api from '../lib/api'

interface FridgeItem {
  id: string
  quantity: number
  unit: string
  expiration: string
}

function FridgePage() {
  const [items, setItems] = useState<FridgeItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/fridge')
      .then(res => setItems(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p>Loading...</p>

  return (
    <div>
      <h1>My Fridge</h1>
      {items.length === 0 && <p>Fridge is empty!</p>}
      {items.map(item => (
        <div key={item.id}>
          <p>{item.quantity} {item.unit}</p>
          <p>Expires: {new Date(item.expiration).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  )
}

export default FridgePage