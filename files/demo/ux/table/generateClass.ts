const generateStyleEl = (
  rootClassName,
  headerHeight: number,
  summaryHeight: number,
  { enHoverHighlight }
) => {
  const el = document.querySelector(`.${rootClassName}`)
  if (!el) {
    return
  }
  const styleEl = document.createElement('style')
  el.appendChild(styleEl)
  styleEl.textContent = `
  .${rootClassName} {
  height: 100%;
  background-color: white;
}

  .${rootClassName}
  .ant-form-item,
  .ant-input,
  .ant-select-selector {
    margin-bottom: 0px !important;
  }

.${rootClassName} > .ant-spin-nested-loading {
  height: 100%;
}
.${rootClassName} > .ant-spin-nested-loading {
  height: 100%;
}
.${rootClassName} > .ant-spin-nested-loading > .ant-spin-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.${rootClassName} > .ant-spin-nested-loading > .ant-spin-container > .ant-table {
  height: 0px;
  flex-grow: 1;
}

.${rootClassName} > .ant-spin-nested-loading > .ant-spin-container > .ant-table > .ant-table-container {
  height: 100%;
}

.${rootClassName}
  > .ant-spin-nested-loading
  > .ant-spin-container
  > .ant-table
  > .ant-table-container
  > .ant-table-body {
  max-height: calc(100% - ${headerHeight}px - ${summaryHeight}px) !important;
  overflow-y: auto !important;
}

.${rootClassName}
  > .ant-spin-nested-loading
  > .ant-spin-container
  > .ant-table
  > .ant-table-container
  > .ant-table-header 
  > table
  > thead
  > tr
  > th {
  background-color: #f2f5fc !important;
}

.${rootClassName}
  > .ant-spin-nested-loading
  > .ant-spin-container
  > .ant-table
  > .ant-table-container
  > .ant-table-header 
  > table
  > thead
  > tr
  > th::before {
  background-color: #f2f5fc !important;
  width: 0px !important
}
.${rootClassName}
  > .ant-spin-nested-loading
  > .ant-spin-container
  > .ant-table
  > .ant-table-container
  > .ant-table-body
  > table
  > tbody
  > tr:nth-child(2n + 1)
  > td {
  background-color: #f2f5fc;
}

.${rootClassName}
  > .ant-spin-nested-loading
  > .ant-spin-container
  > .ant-table
  > .ant-table-container
  > .ant-table-body
  > table
  > tbody
  > tr
  > td 
  > .ant-radio-wrapper
  > span
  > input[disabled] {
  pointer-events:none;
}
.${rootClassName}
  > .ant-spin-nested-loading
  > .ant-spin-container
  > .ant-table
  > .ant-table-container
  > .ant-table-body
  > table
  > tbody
  > tr
  > .ant-table-cell-row-hover {
  ${enHoverHighlight !== false ? 'background-color: #d6e4ff !important;' : ''}
}

  `
  return styleEl
}

export default generateStyleEl
