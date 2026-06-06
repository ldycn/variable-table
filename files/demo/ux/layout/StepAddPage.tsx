import { forwardRef } from 'react'
import type { StepBasePageProps, StepBasePageRef } from './StepBasePage'
import { StepBasePage } from './StepBasePage'

export interface StepAddPageProps extends Omit<StepBasePageProps, 'pageTitle'> {}

export interface StepAddPageRef extends StepBasePageRef {}

const StepAddPage = forwardRef<StepAddPageRef, StepAddPageProps>((props, ref) => {
  return <StepBasePage {...props} pageTitle='新建' ref={ref} />
})

StepAddPage.displayName = 'StepAddPage'

export default StepAddPage
