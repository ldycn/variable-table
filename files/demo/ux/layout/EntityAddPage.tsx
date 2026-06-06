import { sleep } from '@/utils/sleep'
import { handleBackResult } from '@/ux/back'
import { LeftOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import useFormInstance from 'antd/es/form/hooks/useFormInstance'
import { ReactNode, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import EntityDetailBasePage from './EntityDetailBasePage'

export interface EntityAddPageProps {
  entityName: string
  action?: ReactNode
  loading?: boolean
  blocks: { node: ReactNode; grow?: number }[]
  events?: {
    onSave?: () => Promise<any> | void
    beforeBack?: () =>
      | boolean
      | { isFormChanged: boolean; continue?: any; onSave?: () => Promise<boolean | void> }
      | Promise<
          | boolean
          | { isFormChanged: boolean; continue?: any; onSave?: () => Promise<boolean | void> }
        >
  }
}

const EntityAddPage = (props: EntityAddPageProps) => {
  const navigate = useNavigate()
  const form = useFormInstance()
  const [loading, setLoading] = useState(false)

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

  return (
    <EntityDetailBasePage
      {...props}
      title={
        <>
          <div
            className='w-[32px] h-[32px] bg-[#DEDFE0] rounded-full flex justify-center items-center mr-[16px] cursor-pointer'
            onClick={onBack}
          >
            <LeftOutlined className='text-[24px] text-white ml-[-2px]' />
          </div>
          <div>新建{props.entityName}</div>
        </>
      }
      action={
        <>
          {props.action}
          <Button
            loading={typeof props.loading !== 'undefined' ? props.loading : loading}
            className='ml-[16px]'
            type='primary'
            htmlType='submit'
            onClick={onSave}
          >
            完成
          </Button>
        </>
      }
    />
  )
}

export default EntityAddPage
