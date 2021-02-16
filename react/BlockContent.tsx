import React from 'react'
import type { PropsWithChildren } from 'react'
import { useCssHandles } from 'vtex.css-handles'
import type { CssHandlesTypes } from 'vtex.css-handles'

const CSS_HANDLES = ['challengeContentWrapper'] as const

interface Props {
  classes?: CssHandlesTypes.CustomClasses<typeof CSS_HANDLES>
}

function BlockContent({ children, classes }: PropsWithChildren<Props>) {
  const { handles } = useCssHandles(CSS_HANDLES, { classes })

  return (
    <div className={`mw9 center ${handles.challengeContentWrapper}`}>
      {children}
    </div>
  )
}

export default BlockContent
