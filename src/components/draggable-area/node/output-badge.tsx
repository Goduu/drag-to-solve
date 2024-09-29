import { Badge } from '@/components/ui/badge'
import React, { FC } from 'react'
import { OutputItem } from '../types'

type OutputBadgeProps = {
  output: OutputItem
}

export const OutputBadge: FC<OutputBadgeProps> = ({ output }) => {

  return (
    <Badge variant="outline" className={`cursor-pointer ${output.color}`}>
      {output.label}
    </Badge>
  )
}
