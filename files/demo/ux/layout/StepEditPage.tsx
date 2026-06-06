import { StepBasePage } from './StepBasePage'
import type { StepBasePageProps, StepBasePageRef } from './StepBasePage'
import { forwardRef } from 'react'

export interface StepEditPageProps extends Omit<StepBasePageProps, 'pageTitle'> {}

export interface StepEditPageRef extends StepBasePageRef {}

const StepEditPage = forwardRef<StepEditPageRef, StepEditPageProps>((props, ref) => {
  return <StepBasePage {...props} pageTitle='编辑' ref={ref} />
})

StepEditPage.displayName = 'StepEditPage'

export default StepEditPage