import { fetchClient, processImageUrl } from '@/shared/utils/fetch'
import { UploadOutlined } from '@ant-design/icons'
import type { UploadFile, UploadProps } from 'antd'
import { Button, Upload, message } from 'antd'
import { ReactNode, useEffect, useState } from 'react'

interface BaseUploadProps {
  value?: string
  onChange?: (value: string) => void
  comp?: (fileList: UploadFile[], loading: boolean) => ReactNode
  props?: {
    btn?: boolean
  }
  uploadProps?: UploadProps
  allowedExtensions?: string[]
}

interface UploadResponse {
  code: number
  msg: string
  data: {
    name: string
    url: string
  }
}

type CustomFile = File | Blob | any

// 服务器允许的文件扩展名列表
const ALLOWED_EXTENSIONS = [
  'bmp', 'gif', 'jpg', 'jpeg', 'png',
  'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx',
  'html', 'htm', 'txt', 'pdf',
  'rar', 'zip', 'gz', 'bz2',
  'mp4', 'avi', 'rmvb'
]

// 验证文件扩展名
function validateFileExtension(
  file: File,
  allowedExtensions: string[]
): { valid: boolean; error?: string } {
  const fileName = file.name
  const lastDotIndex = fileName.lastIndexOf('.')

  if (lastDotIndex === -1 || lastDotIndex === fileName.length - 1) {
    return {
      valid: false,
      error: `文件 "${fileName}" 没有扩展名，请选择有效的文件格式`
    }
  }

  const extension = fileName.substring(lastDotIndex + 1).toLowerCase()

  if (!allowedExtensions.includes(extension)) {
    return {
      valid: false,
      error: `不支持的文件格式 "${extension}"。\n允许的格式：${allowedExtensions.join(', ')}`
    }
  }

  return { valid: true }
}

// 从 URL 中提取文件名
function getFileNameFromUrl(url: string): string {
  if (!url) return 'file'
  try {
    const urlObj = new URL(url)
    const pathname = urlObj.pathname
    const fileName = pathname.substring(pathname.lastIndexOf('/') + 1)
    return fileName && fileName.includes('.') ? fileName : 'file'
  } catch {
    const urlWithoutQuery = url.split('?')[0].split('#')[0]
    const lastSlash = urlWithoutQuery.lastIndexOf('/')
    if (lastSlash !== -1) {
      const fileName = urlWithoutQuery.substring(lastSlash + 1)
      if (fileName && fileName.includes('.')) {
        return fileName
      }
    }
    return 'file'
  }
}

async function uploadFile(file: CustomFile) {
  const formData = new FormData()
  formData.append('file', file)

  const res = await fetchClient('/miss-file/tencent/upload', {
    method: 'POST',
    body: formData
  })

  return res as UploadResponse
}

function BaseUpload(props: BaseUploadProps) {
  const { value, onChange, allowedExtensions } = props
  const btn = props.props?.btn ?? false
  const [fileList, setFileList] = useState<UploadFile[]>(
    value ? [{ uid: '-1', name: getFileNameFromUrl(value), status: 'done', url: processImageUrl(value) }] : []
  )
  const [loading, setLoading] = useState(false)
  const finalAllowedExtensions =
    allowedExtensions && allowedExtensions.length > 0
      ? allowedExtensions
      : ALLOWED_EXTENSIONS

  useEffect(() => {
    if (value) {
      setFileList([{ uid: '-1', name: getFileNameFromUrl(value), status: 'done', url: processImageUrl(value) }])
    } else {
      setFileList([])
    }
  }, [value])

  const beforeUpload = (file: File) => {
    const validation = validateFileExtension(file, finalAllowedExtensions)
    if (!validation.valid) {
      message.error(validation.error || '文件格式不支持')
      return Upload.LIST_IGNORE
    }
    return true
  }

  const handleUpload: UploadProps['customRequest'] = async options => {
    setLoading(true)
    try {
      const { file } = options
      let fileToUpload: CustomFile

      if (file instanceof File) {
        fileToUpload = file
      } else if (
        typeof file === 'object' &&
        file !== null &&
        'originFileObj' in file &&
        file.originFileObj
      ) {
        fileToUpload = file.originFileObj
      } else {
        fileToUpload = file
      }

      if (fileToUpload instanceof File) {
        const validation = validateFileExtension(fileToUpload, finalAllowedExtensions)
        if (!validation.valid) {
          message.error(validation.error || '文件格式不支持')
          setLoading(false)
          return
        }
      }

      const res = await uploadFile(fileToUpload)
      if (res.code === 200) {
        const fileUrl = processImageUrl(res.data.url)
        setFileList([
          {
            uid: '-1',
            name: res.data.name,
            status: 'done',
            url: fileUrl
          }
        ])
        onChange?.(res.data.url)
        message.success('上传成功')
      } else {
        message.error(res.msg || '上传失败')
      }
    } catch (error: any) {
      message.error(error?.message || '上传失败')
    } finally {
      setLoading(false)
    }
  }

  const handleRemove = () => {
    setFileList([])
    onChange?.('')
    return true
  }

  return (
    <div className='upload-container'>
      <Upload
        listType={!btn ? 'picture-card' : 'picture'}
        fileList={fileList}
        customRequest={handleUpload}
        beforeUpload={beforeUpload}
        onRemove={handleRemove}
        maxCount={1}
        accept={finalAllowedExtensions.map(ext => `.${ext}`).join(',')}
        showUploadList={{
          showPreviewIcon: true,
          showRemoveIcon: true
        }}
        {...(props.uploadProps || {})}
      >
        {props.comp ? (
          props.comp(fileList, loading)
        ) : fileList.length >= 1 ? null : (
          <div>
            {loading ? (
              <div>上传中...</div>
            ) : (
              <>
                {!btn ? (
                  <>
                    <UploadOutlined />
                    <div style={{ marginTop: 8 }}>上传</div>
                  </>
                ) : (
                  <Button icon={<UploadOutlined />}>上传</Button>
                )}
              </>
            )}
          </div>
        )}
      </Upload>
    </div>
  )
}

export default BaseUpload
