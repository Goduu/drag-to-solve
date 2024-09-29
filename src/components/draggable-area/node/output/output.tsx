import { Badge } from '@/components/ui/badge'
import React, { FC } from 'react'
import { OutputItem } from '../../types'

type OutputProps = {
  output: OutputItem
}

export const Output: FC<OutputProps> = ({ output }) => {

  return (
    <Badge variant="outline" className={`cursor-pointer ${output.color}`}>
      {output.label}
    </Badge>
  )
}
