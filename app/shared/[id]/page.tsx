'use client'

import { useParams } from 'next/navigation'
import Home from '../../page'

export default function SharedPalette() {
  const params = useParams()
  const id = params.id as string

  if (!id) {
    return <div>Invalid shared palette</div>
  }

  return <Home initialSharedId={id} />
}
