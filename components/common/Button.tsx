import { useState } from 'react'
import s from './Button.module.scss'
import cn from 'classnames'
import { randomInt as rInt } from '/lib/utils'

export type Props = {
  children: React.ReactNode
  className?: string
}

export default function Button({ className, children }: Props) {


  return (
    <button className={cn(s.button, className)}>
      {children}
    </button>
  )
}