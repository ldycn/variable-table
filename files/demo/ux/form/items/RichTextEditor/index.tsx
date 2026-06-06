// 常用插件（免费）
import IDGenerator from '@/utils/IDGenerator'
import { Editor } from '@tinymce/tinymce-react'
import FormItem, { FormItemProps } from 'antd/es/form/FormItem'
import { omit } from 'lodash'
import { useMemo, useState } from 'react'

interface RichTextEditorProps extends Omit<EditorProps, 'onChange' | 'value'> {
  /** formItem的Props */
  formItemProps?: FormItemProps
  onChange?: (value) => void,
  maxLength?: number
}

interface EditorProps {
  value: string
  onChange: (value) => void
  disabled?: boolean
  maxLength?: number
}
const TOOLTIP_MAP = {
  'Bold (Ctrl+B)': '加粗 (Ctrl+B)',
  'Italic (Ctrl+I)': '斜体 (Ctrl+I)',
  'Underline': '下划线',
  'Align left': '左对齐',
  'Align center': '居中对齐',
  'Align right': '右对齐',
  'Justify': '两端对齐',
  'Bullet list': '无序列表',
  'Numbered list': '有序列表',
  'Undo (Ctrl+Z)': '撤销 (Ctrl+Z)',
  'Redo (Ctrl+Y)': '重做 (Ctrl+Y)',
  'Insert/edit link': '插入链接',
  'Insert/edit image': '插入图片',
  'Source code': '源代码',
  'Background color Light Green': '背景颜色',
  'Increase indent': '增加缩进',
  'Decrease indent': '减少缩进',
  'Clear formatting': '清除格式',
  'Background color menu': '背景色菜单',
  'Background color Black': '黑色背景'
}


// TODO 待简化public文件,减少体积
function RichTextEditorFormItem (props: EditorProps) {
  console.log(props, 'props')
  const maxLength = props.maxLength || 200
  const [count, setCount] = useState(0)

  return (
    <>
      <Editor
        licenseKey='gpl'
        tinymceScriptSrc={'/tinymce/tinymce.min.js'}
        value={props.value}
        disabled={props.disabled}
        onEditorChange={(content, editor) => {
          const text = editor.getContent({ format: 'text' }).trim()
          setCount(text.length)

          // Notify antd form of value change
          if (typeof content === 'string') {
            console.log(content)
            props.onChange && props.onChange(content)
          }
        }}
        // onBlur={(e, editor) => {
        //   // TinyMCE's onBlur signature is (e, editor)
        //   props.onBlur && props.onBlur()
        // }}
        init={{
          content_style: `
          body { line-height: 1.3; ${props.disabled && 'background-color: rgba(0,0,0,0.04)'
            } }   /* 全局行高 */
          p { margin: 0 }     /* 段落间距可选 */
        `,
          language: 'zh_CN',
          language_url: '/tinymce/langs/zh_CN.js',
          // selector: '#textarea1', // change this value according to your HTML
          // //启用菜单栏并显示如下项 [文件 编辑 插入 格式 表格]
          // menubar: 'file edit insert view format table',
          // // 配置每个菜单栏的子菜单项（如下是默认配置）
          // menu: {
          //   file: { title: 'File', items: 'newdocument' },
          //   edit: { title: 'Edit', items: 'undo redo | cut copy paste pastetext | selectall' },
          //   insert: { title: 'Insert', items: 'link media | template hr' },
          //   view: { title: 'View', items: 'visualaid' },
          //   format: {
          //     title: 'Format',
          //     items:
          //       'bold italic underline strikethrough superscript subscript | formats | removeformat'
          //   },
          //   table: { title: 'Table', items: 'inserttable tableprops deletetable | cell row column' }
          // },
          // plugins: 'image',
          // toolbar: 'image',
          branding: false,
          height: 300,
          menubar: false,
          plugins: [
            'advlist autolink lists link image charmap preview',
            'searchreplace visualblocks code fullscreen',
            'insertdatetime media table help wordcount'
          ],
          toolbar:
            'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | code | styleselect | link image',
          setup: (editor) => {
            const getTextLength = () =>
              editor.getContent({ format: 'text' }).trim().length

            editor.on('keydown', (e) => {
              const length = getTextLength()

              if (length >= maxLength) {
                const allowKeys = [
                  'Backspace',
                  'Delete',
                  'ArrowLeft',
                  'ArrowRight',
                  'ArrowUp',
                  'ArrowDown'
                ]
                // 允许快捷键（全选 / 复制 / 剪切）
                if (
                  allowKeys.includes(e.key) ||
                  e.ctrlKey ||
                  e.metaKey
                ) {
                  return
                }

                e.preventDefault()
              }
            })
            editor.on('init', () => {
              const observer = new MutationObserver(() => {
                const tooltipBody = document.querySelector(
                  '.tox-tooltip__body'
                ) as HTMLElement | null

                if (!tooltipBody) return

                const text = tooltipBody.innerText.trim()
                if (TOOLTIP_MAP[text]) {
                  tooltipBody.innerText = TOOLTIP_MAP[text]
                }
              })

              observer.observe(document.body, {
                childList: true,
                subtree: true
              })

              editor.on('remove', () => observer.disconnect())
            })
          }

        }}
      />
      <div
        style={{
          textAlign: 'right',
          fontSize: 12,
          color: '#999',
          marginTop: 4
        }}
      >
        {count}/{maxLength} 字
      </div>
    </>
  )
}

export default function RichTextEditor (props: RichTextEditorProps) {
  const id = useMemo(() => 'a' + IDGenerator.createRandomStringId(), [])
  let rules = props.formItemProps?.rules || []
  if (props.formItemProps?.required) {
    rules = rules.filter(v => (v as any).required !== true)
    rules.push({ required: true, message: '请填写' + props.formItemProps?.label + '！' })
  }
  console.log(props, 'FormItem')
  return (
    <FormItem
      {...props.formItemProps}
      labelCol={{ span: 24 }}
      wrapperCol={{ span: 24 }}
      rules={rules}
      shouldUpdate
    >
      <RichTextEditorFormItem {...(omit(props, ['formItemProps', 'onChange']) as any)} />
    </FormItem>
  )
}
