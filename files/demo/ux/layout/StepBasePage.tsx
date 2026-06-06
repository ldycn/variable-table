import { sleep } from '@/utils/sleep'
import { handleBackResult } from '@/ux/back'
import { LeftOutlined } from '@ant-design/icons'
import { Button, Steps } from 'antd'
import useFormInstance from 'antd/es/form/hooks/useFormInstance'
import { ReactNode, useImperativeHandle, useState, forwardRef } from 'react'
import { useNavigate } from 'react-router-dom'
import EntityDetailBasePage from './EntityDetailBasePage'

export interface StepBasePageProps {
  entityName: string
  stepItems: Array<{
    key: string
    title: string
    content: ReactNode
  }>
  loading?: boolean
  action?: ReactNode
  events?: {
    onSave?: () => Promise<any> | void
    beforeBack?: () =>
      | boolean
      | { isFormChanged: boolean; continue?: any; onSave?: () => Promise<boolean | void> }
      | Promise<
          | boolean
          | { isFormChanged: boolean; continue?: any; onSave?: () => Promise<boolean | void> }
        >
    beforeStepChange?: (currentStep: number, nextStep: number) => boolean | Promise<boolean>
  }
  initialStep?: number
}

export interface StepBasePageRef {
  setStep: (step: number) => void
  getStep: () => number
}

export const StepBasePage = forwardRef<StepBasePageRef, StepBasePageProps & { pageTitle: string }>(
  (props, ref) => {
    const navigate = useNavigate()
    const form = useFormInstance()
    const [loading, setLoading] = useState(false)
    const [currentStep, setCurrentStep] = useState(props.initialStep || 0)

    useImperativeHandle(ref, () => ({
      setStep: (step: number) => {
        if (step >= 0 && step < props.stepItems.length) {
          setCurrentStep(step)
        }
      },
      getStep: () => currentStep
    }))

    const onBack = async () => {
      if (!props.events?.beforeBack) {
        navigate(-1)
        return
      }
      const result = await props.events.beforeBack()
      await handleBackResult(result, () => navigate(-1))
    }

    const onSave = async () => {
      if (loading) {
        return
      }
      try {
        await form.validateFields()
      } catch (e) {
        return
      }
      setLoading(true)
      await Promise.resolve()
      await sleep(250)
      await (props.events?.onSave || (() => void 0))()
      setLoading(false)
      return true
    }

    const handlePrev = () => {
      if (currentStep > 0) {
        setCurrentStep(currentStep - 1)
      }
    }

    const handleNext = async () => {
      const nextStep = currentStep + 1
      if (props.events?.beforeStepChange) {
        const canProceed = await Promise.resolve(
          props.events.beforeStepChange(currentStep, nextStep)
        )
        if (!canProceed) {
          return
        }
      }
      if (nextStep < props.stepItems.length) {
        setCurrentStep(nextStep)
      } else {
        await onSave()
      }
    }

    const isLastStep = currentStep === props.stepItems.length - 1

    const renderAction = () => (
      <>
        {currentStep > 0 && (
          <Button onClick={handlePrev} className='mr-[8px]'>
            上一步
          </Button>
        )}
        {props.action}
        <Button
          loading={typeof props.loading !== 'undefined' ? props.loading : loading}
          className='ml-[16px]'
          type='primary'
          htmlType='submit'
          onClick={handleNext}
        >
          {isLastStep ? '完成' : '下一步'}
        </Button>
      </>
    )

    return (
      <EntityDetailBasePage
        title={
          <>
            <div
              className='w-[32px] h-[32px] bg-[#DEDFE0] rounded-full flex justify-center items-center mr-[16px] cursor-pointer'
              onClick={onBack}
            >
              <LeftOutlined className='text-[24px] text-white ml-[-2px]' />
            </div>
            <div>
              {props.pageTitle}
              {props.entityName}
            </div>
          </>
        }
        action={renderAction()}
        blocks={[
          {
            node: (
              <div className='px-[16px] py-[14px]'>
                <Steps
                  current={currentStep}
                  size='small'
                  items={props.stepItems.map(item => ({
                    title: item.title
                  }))}
                />
              </div>
            )
          },
          {
            key: 'step-content',
            node: (
              <div className='h-full'>
                {props.stepItems.map((item, index) => (
                  <div
                    key={item.key}
                    style={{
                      display: index === currentStep ? 'block' : 'none',
                      height: '100%'
                    }}
                  >
                    {item.content}
                  </div>
                ))}
              </div>
            )
          }
        ]}
      />
    )
  }
)

StepBasePage.displayName = 'StepBasePage'