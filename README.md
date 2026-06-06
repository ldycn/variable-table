## 表格面试题

## 简介

本项目除完成面试题需求功能外，还希望展示：

1. 答题者对ai开发的部分理解。
2. 答题者的部分前端架构能力。

为满足以上展示目的：

1. 本项目基础库采用的是本人上家公司编写的ux基础库组件（部分删减和微调），可能功能存在一些功能冗余，个人认为保留部分冗余有助于面试官更快速的理解本人的编码、架构思路，所以没有删除
2. 本项目除了优化基础库之外没有手写代码，以体现基础库完成之后使用harness约束之后业务代码可以几乎全部用ai生成的优势。完整的已在团队中大规模使用的前端架构和ai流工具（agent，skill，agent集群任务编排等），可以在面试中向面试官展示

## 运行项目

1. 安装依赖：`npm install`
2. 运行项目：`npm run dev`
3. e2e测试：`npm run test:e2e`

## 技术栈

- **框架**: React 18 + TypeScript
- **UI 库**: Ant Design 5 + TailwindCSS 3
- **状态管理**: State + Ref + Ant Design Form API (因实际开发中利用架构可以简化数据流，导致不需要用redux类状态管理插件去强行创造全局（或局部脱离react）状态，所以本项目采用上管理方案)
- **构建工具**: Vite 6
- **测试**: Playwright（E2E 测试）
- **其他**: ahooks、lodash

## 项目架构（省略常见部分说明）

```
面试题/
├── src/                          # 源代码
│   ├── pages/                    # 页面模块
│   │   └── variable-editor/      # 变量编辑器页面
│   │       ├── index.tsx         # 页面 UI 结构（纯视图层，无业务逻辑）
│   │       ├── configs.tsx       # 静态配置（表格列定义、枚举映射等）
│   │       └── usePage.tsx       # 页面核心逻辑（状态管理、API 请求、事件处理）
│   ├── ux/                       # 基础 UX 组件库
│   │   ├── form/                 # 表单基础组件
│   │   │   ├── Form.tsx          # 表单组件
│   │   │   ├── field/            # 字段注册与焦点管理
│   │   │   └── table/            # 表格表单组件（Input、Select 等）
│   │   ├── table/                # 表格基础组件（是FormTable的依赖）
│   │   │   ├── columnItems.tsx   # 常见列生成工具
│   │   │   └── 。。。               # 表格实现
│   │   └── searcher/             # 搜索表单组件
│   │       └── items/            # 搜索项（Select 等，是搜索项表单，界面表单和表格表单的底层组件，所以需要在项目中引用。）
│   └── utils/                    # 工具函数
│       └── IDGenerator.ts        # ID 生成器
├── e2e/                          # E2E 测试
│   └── variable-editor.spec.ts   # 变量编辑器测试用例
└── files/                        # ai开发所需项目相关文档
    ├── architecture.md           # 系统架构设计文档
    ├── requirements.md           # 需求文档
    ├── test-cases-summary.md     # 测试用例文档
    └── demo/                     # 原始基础库参考代码
```

### 架构设计原则

- **页面三层分离**: 页面由 `index.tsx`（视图）、`usePage.tsx`（逻辑）、`configs.tsx`（配置）三部分组成。
- **基础库复用**: `src/ux/` 封装了表单、表格、搜索等基础组件的用户体验逻辑，供页面层统一调用。
- 其他设计原则可以在architecture.md中查看。

## 开发全流程（LLM均使用GLM 5.1）

1. 复制前公司本人开发基础库代码到demo。
2. 复制需求到requirements.md。
3. 命令ai输出测试用例到test-cases-summary.md
4. 审核测试用例。
5. 复制前公司本人开发系统架构设计并适配该项目需求，最终输出architecture.md文件
6. 命令ai根据需求调整demo代码。
7. 命令ai根据已有文档完成开发和测试。
8. 命令ai查找不能通过的"TC-09 综合场景"前两个测试用例的原因并修复
9. 阻止ai错误的通过修改源代码来解决因为动画时延导致的测试不通过的问题，让ai通过修改测试用例保证测试通过。
10. 给ai提出细节优化点并审核对应代码和测试用例：
    1. 设置行数据的时候最终通过循环调用setFieldValue而不是setFieldsValue来修改表单值以防止表格定位变动
    2. 列配置直接在configs中声明,之后在index中使用和引入usePageStore中需要的数据和方法即可.
    3. 使用基础库的getSerialNumberColumnConfig方法生成序号列
    4. 删除输入框的长度限制
    5. 删除项目src/中不影响测试用例通过的无用功能的代码，方便其他人阅读项目代码
11. 手动测试并提出细节优化点并审核对应代码和测试用例：
    1. 在尽可能小的改动中，将选择框打开弹窗的方式从单击变成双击并修改添加对应测试用例
    2. int data type下，default value 不应该可以为0001，onBlur时应该保存Number()之后的结果，修改添加对应测试用例
12. 再次手动测试
13. 完成
