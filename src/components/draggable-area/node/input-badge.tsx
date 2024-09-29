import { Badge } from '@/components/ui/badge'
import React, { FC } from 'react'
import { InputItem, OutputItem } from '../types'

type InputBadgeProps = {
  input: InputItem
}

export const InputBadge: FC<InputBadgeProps> = ({ input }) => {

  return (
    <Badge variant="outline" className={`cursor-pointer ${input.color}`}>
      {input.label}
    </Badge>
  )
}
