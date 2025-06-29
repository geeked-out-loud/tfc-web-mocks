import { useEffect, useState } from 'react'

interface SlidingUnderlineProps {
  activeIndex: number
  itemRefs: React.MutableRefObject<(HTMLElement | null)[]>
  className?: string
  color?: string
  height?: string
  duration?: string
}

export default function SlidingUnderline({ 
  activeIndex,
  itemRefs,
  className = '',
  color = '#d7a900',
  height = '0.5',
  duration = '300'
}: SlidingUnderlineProps) {
  const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0 })

  useEffect(() => {
    if (activeIndex !== -1 && itemRefs.current[activeIndex]) {
      const activeElement = itemRefs.current[activeIndex]
      const containerRect = activeElement.parentElement?.getBoundingClientRect()
      const elementRect = activeElement.getBoundingClientRect()
      
      if (containerRect) {
        const left = elementRect.left - containerRect.left
        const width = elementRect.width
        setUnderlineStyle({ left, width })
      }
    }
  }, [activeIndex, itemRefs])

  return (
    <div 
      className={`absolute bottom-0 transition-all ease-out ${className}`}
      style={{
        left: `${underlineStyle.left}px`,
        width: `${underlineStyle.width}px`,
        height: `${height}rem`,
        backgroundColor: color,
        transitionDuration: `${duration}ms`,
      }}
    />
  )
}

export { type SlidingUnderlineProps }
