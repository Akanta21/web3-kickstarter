import React from 'react'
import { Card } from 'semantic-ui-react'

export default function EnhancedCards({items}) {
  return (
    <Card.Group items={items} />
  )
}
