import React from 'react'
import type { PropsWithChildren } from 'react'
import { useCssHandles } from 'vtex.css-handles'

const CSS_HANDLES = ['challengeContentWrapper'] as const

function BlockContent({ children }: PropsWithChildren<unknown>) {
  const handles = useCssHandles(CSS_HANDLES)

  return (
    <div className={`mw9 center ${handles.challengeContentWrapper}`}>
      {children}
    </div>
  )
}

export default BlockContent
