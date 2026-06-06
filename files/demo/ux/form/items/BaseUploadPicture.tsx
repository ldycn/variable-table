import { fetchClient, processImageUrl } from '@/shared/utils/fetch'
import { PlusOutlined, UploadOutlined } from '@ant-design/icons'
import type { UploadFile, UploadProps } from 'antd'
import { Button, Upload, message } from 'antd'
import { ReactNode, useEffect, useState } from 'react'

interface UploadPictureProps {
  value?: { name?: string; url: string }
  onChange?: (value: { name?: string; url: string }) => void
  comp?: (fileList, loading) => ReactNode
  props?: {
    btn?: boolean
  }
  uploadProps?: UploadProps
}
interface UploadPictureResponse {
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
  'bmp',
  'gif',
  'jpg',
  'jpeg',
  'png',
  'doc',
  'docx',
  'xls',
  'xlsx',
  'ppt',
  'pptx',
  'html',
  'htm',
  'txt',
  'pdf',
  'rar',
  'zip',
  'gz',
  'bz2',
  'mp4',
  'avi',
  'rmvb'
]

// 验证文件扩展名
function validateFileExtension(file: File): { valid: boolean; error?: string } {
  const fileName = file.name
  const lastDotIndex = fileName.lastIndexOf('.')

  if (lastDotIndex === -1 || lastDotIndex === fileName.length - 1) {
    return {
      valid: false,
      error: `文件 "${fileName}" 没有扩展名，请选择有效的文件格式`
    }
  }

  const extension = fileName.substring(lastDotIndex + 1).toLowerCase()

  if (!ALLOWED_EXTENSIONS.includes(extension)) {
    return {
      valid: false,
      error: `不支持的文件格式 "${extension}"。\n允许的格式：${ALLOWED_EXTENSIONS.join(', ')}`
    }
  }

  return { valid: true }
}

// 从 URL 中提取文件名
function getFileNameFromUrl(url: string): string {
  if (!url) return 'image.png'
  try {
    const urlObj = new URL(url)
    const pathname = urlObj.pathname
    const fileName = pathname.substring(pathname.lastIndexOf('/') + 1)
    // 如果 URL 中有文件名，使用它；否则使用默认值
    return fileName && fileName.includes('.') ? fileName : 'image.png'
  } catch {
    // 如果不是有效 URL，尝试从字符串中提取（去除查询参数和锚点）
    const urlWithoutQuery = url.split('?')[0].split('#')[0]
    const lastSlash = urlWithoutQuery.lastIndexOf('/')
    if (lastSlash !== -1) {
      const fileName = urlWithoutQuery.substring(lastSlash + 1)
      if (fileName && fileName.includes('.')) {
        return fileName
      }
    }
    return 'image.png'
  }
}

async function uploadFile(file: CustomFile) {
  const formData = new FormData()
  formData.append('file', file)

  const res = await fetchClient('/miss-file/tencent/upload', {
    method: 'POST',
    body: formData
  })

  return res as UploadPictureResponse
}

function BaseUploadPicture(props: UploadPictureProps) {
  const { value, onChange } = props
  const btn = props.props?.btn ?? false
  const [fileList, setFileList] = useState<UploadFile[]>(
    value
      ? [
          {
            uid: '-1',
            name: value.name || getFileNameFromUrl(value.url),
            status: 'done',
            url: processImageUrl(value.url)
          }
        ]
      : []
  )
  const [loading, setLoading] = useState(false)

  // 监听 value 变化，更新 fileList
  useEffect(() => {
    if (value) {
      setFileList([
        {
          uid: '-1',
          name: value.name || getFileNameFromUrl(value.url),
          status: 'done',
          url: processImageUrl(value.url)
        }
      ])
    } else {
      setFileList([])
    }
  }, [value])

  // 上传前的文件验证
  const beforeUpload = (file: File) => {
    const validation = validateFileExtension(file)
    if (!validation.valid) {
      message.error(validation.error || '文件格式不支持')
      return Upload.LIST_IGNORE // 阻止上传
    }
    return true
  }

  const handleUpload: UploadProps['customRequest'] = async options => {
    setLoading(true)
    try {
      const { file } = options
      // 处理各种可能的文件对象类型
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

      // 再次验证文件类型（双重保险）
      if (fileToUpload instanceof File) {
        const validation = validateFileExtension(fileToUpload)
        if (!validation.valid) {
          message.error(validation.error || '文件格式不支持')
          setLoading(false)
          return
        }
      }

      console.log('准备上传文件:', fileToUpload)
      const res = await uploadFile(fileToUpload)
      if (res.code === 200) {
        const imageUrl = processImageUrl(res.data.url)
        setFileList([
          {
            uid: '-1',
            name: res.data.name,
            status: 'done',
            url: imageUrl
          }
        ])
        // 保存原始 URL（可能是相对路径）
        onChange?.({ name: res.data.name, url: res.data.url })
        message.success('上传成功')
      } else {
        message.error(res.msg || '上传失败')
      }
    } catch (error: any) {
      console.error('上传失败:', error)
      message.error(error?.message || '上传失败')
    } finally {
      setLoading(false)
    }
  }

  const handleRemove = () => {
    setFileList([])
    onChange?.({ url: '' })
    return true
  }
  console.log(fileList)
  return (
    <div className='upload-picture-container'>
      <Upload
        listType={!btn ? 'picture-card' : 'picture'}
        fileList={fileList}
        customRequest={handleUpload}
        beforeUpload={beforeUpload}
        onRemove={handleRemove}
        maxCount={1}
        accept={ALLOWED_EXTENSIONS.map(ext => `.${ext}`).join(',')}
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
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>上传图片</div>
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
export default BaseUploadPicture
