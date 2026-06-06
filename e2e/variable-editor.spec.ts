import { expect, test } from '@playwright/test'

const ROW_SELECTOR = 'tbody tr:not(.ant-table-placeholder):not(.ant-table-measure-row)'

const dataRow = (page: import('@playwright/test').Page, index: number) =>
  page.locator(ROW_SELECTOR).nth(index)

const dataRowCount = (page: import('@playwright/test').Page) => page.locator(ROW_SELECTOR)

const nameInput = (page: import('@playwright/test').Page, rowIdx: number) =>
  dataRow(page, rowIdx).locator('td').nth(2).locator('input')

const selectTrigger = (page: import('@playwright/test').Page, rowIdx: number) =>
  dataRow(page, rowIdx).locator('td').nth(3).locator('.ant-select')

const dvInput = (page: import('@playwright/test').Page, rowIdx: number) =>
  dataRow(page, rowIdx).locator('td').nth(4).locator('input')

const commentInput = (page: import('@playwright/test').Page, rowIdx: number) =>
  dataRow(page, rowIdx).locator('td').nth(5).locator('input')

const indexCell = (page: import('@playwright/test').Page, rowIdx: number) =>
  dataRow(page, rowIdx).locator('td').nth(1)

const rowCheckbox = (page: import('@playwright/test').Page, rowIdx: number) =>
  dataRow(page, rowIdx).locator('td').nth(0).locator('.ant-checkbox-input')

const selectOption = async (
  page: import('@playwright/test').Page,
  rowIdx: number,
  optionText: string
) => {
  await selectTrigger(page, rowIdx).dblclick()
  await page
    .locator('.ant-select-dropdown:not(.ant-select-dropdown-hidden)')
    .getByText(optionText)
    .first()
    .click()
  await page.waitForFunction(
    () =>
      document.querySelectorAll('.ant-select-dropdown:not(.ant-select-dropdown-hidden)').length ===
      0
  )
}

test.describe('变量表编辑器', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test.describe('TC-01 表格展示', () => {
    test('TC-01-01 初始加载显示空表格', async ({ page }) => {
      const headers = page.locator('thead th')
      await expect(headers).toHaveCount(6)
      await expect(headers.nth(1)).toContainText('Index')
      await expect(headers.nth(2)).toContainText('Name')
      await expect(headers.nth(3)).toContainText('Data Type')
      await expect(headers.nth(4)).toContainText('Default Value')
      await expect(headers.nth(5)).toContainText('Comment')

      await expect(dataRowCount(page)).toHaveCount(0)

      await expect(page.getByTestId('add-row-btn')).toBeVisible()
      await expect(page.getByTestId('delete-row-btn')).toBeVisible()
    })

    test('TC-01-02 索引列只读不可编辑', async ({ page }) => {
      await page.getByTestId('add-row-btn').click()
      await expect(indexCell(page, 0)).toContainText('1')
      const input = indexCell(page, 0).locator('input')
      await expect(input).toHaveCount(0)
    })

    test('TC-01-03 按钮始终可见', async ({ page }) => {
      await expect(page.getByTestId('add-row-btn')).toBeVisible()
      await expect(page.getByTestId('delete-row-btn')).toBeVisible()

      await page.getByTestId('add-row-btn').click()
      await expect(page.getByTestId('add-row-btn')).toBeVisible()
      await expect(page.getByTestId('delete-row-btn')).toBeVisible()
    })
  })

  test.describe('TC-02 添加变量行', () => {
    test('TC-02-01 空表格添加第一行', async ({ page }) => {
      await page.getByTestId('add-row-btn').click()

      await expect(dataRowCount(page)).toHaveCount(1)
      await expect(indexCell(page, 0)).toContainText('1')
    })

    test('TC-02-02 已有数据时添加新行', async ({ page }) => {
      for (let i = 0; i < 3; i++) {
        await page.getByTestId('add-row-btn').click()
      }
      await page.getByTestId('add-row-btn').click()

      await expect(dataRowCount(page)).toHaveCount(4)
      await expect(indexCell(page, 3)).toContainText('4')
    })

    test('TC-02-03 连续多次添加行', async ({ page }) => {
      for (let i = 0; i < 5; i++) {
        await page.getByTestId('add-row-btn').click()
      }

      await expect(dataRowCount(page)).toHaveCount(5)
      for (let i = 1; i <= 5; i++) {
        await expect(indexCell(page, i - 1)).toContainText(String(i))
      }
    })

    test('TC-02-04 添加行不影响已有数据', async ({ page }) => {
      await page.getByTestId('add-row-btn').click()
      await nameInput(page, 0).fill('Start')

      await page.getByTestId('add-row-btn').click()

      await expect(dataRowCount(page)).toHaveCount(2)
      await expect(nameInput(page, 0)).toHaveValue('Start')
      await expect(indexCell(page, 1)).toContainText('2')
    })
  })

  test.describe('TC-03 删除变量行', () => {
    test('TC-03-01 删除单行后索引重算', async ({ page }) => {
      for (let i = 0; i < 3; i++) {
        await page.getByTestId('add-row-btn').click()
      }

      await rowCheckbox(page, 1).click()
      await page.getByTestId('delete-row-btn').click()

      await expect(dataRowCount(page)).toHaveCount(2)
      await expect(indexCell(page, 0)).toContainText('1')
      await expect(indexCell(page, 1)).toContainText('2')
    })

    test('TC-03-02 删除首行后索引重算', async ({ page }) => {
      for (let i = 0; i < 3; i++) {
        await page.getByTestId('add-row-btn').click()
      }

      await rowCheckbox(page, 0).click()
      await page.getByTestId('delete-row-btn').click()

      await expect(dataRowCount(page)).toHaveCount(2)
      await expect(indexCell(page, 0)).toContainText('1')
      await expect(indexCell(page, 1)).toContainText('2')
    })

    test('TC-03-03 删除末行后索引不变', async ({ page }) => {
      for (let i = 0; i < 3; i++) {
        await page.getByTestId('add-row-btn').click()
      }

      await rowCheckbox(page, 2).click()
      await page.getByTestId('delete-row-btn').click()

      await expect(dataRowCount(page)).toHaveCount(2)
      await expect(indexCell(page, 0)).toContainText('1')
      await expect(indexCell(page, 1)).toContainText('2')
    })

    test('TC-03-04 删除至空表格', async ({ page }) => {
      await page.getByTestId('add-row-btn').click()

      await rowCheckbox(page, 0).click()
      await page.getByTestId('delete-row-btn').click()

      await expect(dataRowCount(page)).toHaveCount(0)
      await expect(page.getByTestId('add-row-btn')).toBeVisible()
      await expect(page.getByTestId('delete-row-btn')).toBeVisible()
    })

    test('TC-03-05 未选中行时点击删除', async ({ page }) => {
      await page.getByTestId('add-row-btn').click()

      await page.getByTestId('delete-row-btn').click()

      await expect(dataRowCount(page)).toHaveCount(1)
    })

    test('TC-03-06 删除行后添加新行索引连续', async ({ page }) => {
      for (let i = 0; i < 3; i++) {
        await page.getByTestId('add-row-btn').click()
      }

      await rowCheckbox(page, 1).click()
      await page.getByTestId('delete-row-btn').click()

      await page.getByTestId('add-row-btn').click()
      await expect(dataRowCount(page)).toHaveCount(3)
      await expect(indexCell(page, 2)).toContainText('3')
    })
  })

  test.describe('TC-04 编辑变量名称', () => {
    test('TC-04-01 输入唯一名称保存成功', async ({ page }) => {
      await page.getByTestId('add-row-btn').click()
      const input = nameInput(page, 0)
      await input.fill('Stop')
      await input.press('Enter')

      await expect(input).toHaveValue('Stop')
    })

    test('TC-04-02 输入空值恢复原值并提示错误', async ({ page }) => {
      await page.getByTestId('add-row-btn').click()
      const input = nameInput(page, 0)
      await input.fill('Start')
      await input.press('Enter')

      await input.clear()
      await input.press('Enter')

      await expect(page.getByText('Name cannot be empty')).toBeVisible()
    })

    test('TC-04-03 输入已存在名称（大小写不同）报错', async ({ page }) => {
      await page.getByTestId('add-row-btn').click()
      await page.getByTestId('add-row-btn').click()

      await nameInput(page, 0).fill('counter')
      await nameInput(page, 0).press('Enter')

      await nameInput(page, 1).fill('Counter')
      await nameInput(page, 1).press('Enter')

      await expect(page.getByText('Name already exists')).toBeVisible()
    })

    test('TC-04-04 输入完全相同的名称报错', async ({ page }) => {
      await page.getByTestId('add-row-btn').click()
      await page.getByTestId('add-row-btn').click()

      await nameInput(page, 0).fill('counter')
      await nameInput(page, 0).press('Enter')

      await nameInput(page, 1).fill('counter')
      await nameInput(page, 1).press('Enter')

      await expect(page.getByText('Name already exists')).toBeVisible()
    })

    test('TC-04-05 输入全大写对比已有名称', async ({ page }) => {
      await page.getByTestId('add-row-btn').click()
      await page.getByTestId('add-row-btn').click()

      await nameInput(page, 0).fill('Counter')
      await nameInput(page, 0).press('Enter')

      await nameInput(page, 1).fill('COUNTER')
      await nameInput(page, 1).press('Enter')

      await expect(page.getByText('Name already exists')).toBeVisible()
    })

    test('TC-04-06 输入与自身相同的名称不报错', async ({ page }) => {
      await page.getByTestId('add-row-btn').click()
      const input = nameInput(page, 0)
      await input.fill('Start')
      await input.press('Enter')

      await input.clear()
      await input.fill('Start')
      await input.press('Enter')

      await expect(page.locator('.ant-message-notice')).toHaveCount(0)
    })

    test('TC-04-07 特殊字符名称', async ({ page }) => {
      await page.getByTestId('add-row-btn').click()
      const input = nameInput(page, 0)
      await input.fill('var_01@测试')
      await input.press('Enter')

      await expect(input).toHaveValue('var_01@测试')
    })
  })

  test.describe('TC-05 选择数据类型', () => {
    test('TC-05-01 选择BOOL', async ({ page }) => {
      await page.getByTestId('add-row-btn').click()

      await selectTrigger(page, 0).dblclick()
      await page
        .locator('.ant-select-dropdown:not(.ant-select-dropdown-hidden)')
        .getByText('BOOL')
        .first()
        .click()

      await expect(
        dataRow(page, 0).locator('td').nth(3).locator('.ant-select-selection-item')
      ).toContainText('BOOL')
    })

    test('TC-05-02 选择BOOL后默认值变为TRUE', async ({ page }) => {
      await page.getByTestId('add-row-btn').click()

      await selectTrigger(page, 0).dblclick()
      await page
        .locator('.ant-select-dropdown:not(.ant-select-dropdown-hidden)')
        .getByText('BOOL')
        .first()
        .click()

      await expect(dvInput(page, 0)).toHaveValue('TRUE')
    })

    test('TC-05-03 选择INT后默认值变为0', async ({ page }) => {
      await page.getByTestId('add-row-btn').click()

      await selectTrigger(page, 0).dblclick()
      await page
        .locator('.ant-select-dropdown:not(.ant-select-dropdown-hidden)')
        .getByText('INT')
        .first()
        .click()

      await expect(dvInput(page, 0)).toHaveValue('0')
    })

    test('TC-05-04 类型从BOOL切换为INT', async ({ page }) => {
      await page.getByTestId('add-row-btn').click()

      await selectTrigger(page, 0).dblclick()
      await page
        .locator('.ant-select-dropdown:not(.ant-select-dropdown-hidden)')
        .getByText('BOOL')
        .first()
        .click()
      await expect(dvInput(page, 0)).toHaveValue('TRUE')

      await selectTrigger(page, 0).dblclick()
      await page
        .locator('.ant-select-dropdown:not(.ant-select-dropdown-hidden)')
        .getByText('INT')
        .first()
        .click()
      await expect(dvInput(page, 0)).toHaveValue('0')
    })

    test('TC-05-05 类型从INT切换为BOOL', async ({ page }) => {
      await page.getByTestId('add-row-btn').click()

      await selectTrigger(page, 0).dblclick()
      await page
        .locator('.ant-select-dropdown:not(.ant-select-dropdown-hidden)')
        .getByText('INT')
        .first()
        .click()
      await expect(dvInput(page, 0)).toHaveValue('0')

      await selectTrigger(page, 0).dblclick()
      await page
        .locator('.ant-select-dropdown:not(.ant-select-dropdown-hidden)')
        .getByText('BOOL')
        .first()
        .click()
      await expect(dvInput(page, 0)).toHaveValue('TRUE')
    })

    test('TC-05-06 单击选择框不打开下拉列表', async ({ page }) => {
      await page.getByTestId('add-row-btn').click()

      await selectTrigger(page, 0).click()

      await expect(
        page.locator('.ant-select-dropdown:not(.ant-select-dropdown-hidden)')
      ).toHaveCount(0)
    })

    test('TC-05-07 双击选择框打开下拉列表', async ({ page }) => {
      await page.getByTestId('add-row-btn').click()

      await selectTrigger(page, 0).dblclick()

      await expect(
        page.locator('.ant-select-dropdown:not(.ant-select-dropdown-hidden)')
      ).toHaveCount(1)
    })
  })

  test.describe('TC-06 编辑BOOL类型默认值', () => {
    async function setupBoolRow(page: import('@playwright/test').Page) {
      await page.getByTestId('add-row-btn').click()
      await selectTrigger(page, 0).dblclick()
      await page
        .locator('.ant-select-dropdown:not(.ant-select-dropdown-hidden)')
        .getByText('BOOL')
        .first()
        .click()
    }

    test('TC-06-01 输入true（小写）', async ({ page }) => {
      await setupBoolRow(page)
      const input = dvInput(page, 0)
      await input.clear()
      await input.fill('true')
      await input.press('Enter')
      await expect(input).toHaveValue('TRUE')
    })

    test('TC-06-02 输入TRUE（大写）', async ({ page }) => {
      await setupBoolRow(page)
      const input = dvInput(page, 0)
      await input.clear()
      await input.fill('TRUE')
      await input.press('Enter')
      await expect(input).toHaveValue('TRUE')
    })

    test('TC-06-03 输入false（小写）', async ({ page }) => {
      await setupBoolRow(page)
      const input = dvInput(page, 0)
      await input.clear()
      await input.fill('false')
      await input.press('Enter')
      await expect(input).toHaveValue('FALSE')
    })

    test('TC-06-04 输入FALSE（大写）', async ({ page }) => {
      await setupBoolRow(page)
      const input = dvInput(page, 0)
      await input.clear()
      await input.fill('FALSE')
      await input.press('Enter')
      await expect(input).toHaveValue('FALSE')
    })

    test('TC-06-05 输入混合大小写True', async ({ page }) => {
      await setupBoolRow(page)
      const input = dvInput(page, 0)
      await input.clear()
      await input.fill('True')
      await input.press('Enter')
      await expect(input).toHaveValue('TRUE')
    })

    test('TC-06-06 输入非法值yes', async ({ page }) => {
      await setupBoolRow(page)
      const input = dvInput(page, 0)
      await input.clear()
      await input.fill('yes')
      await input.press('Enter')
      await expect(page.getByText(/BOOL default value/)).toBeVisible()
    })

    test('TC-06-07 输入数字1', async ({ page }) => {
      await setupBoolRow(page)
      const input = dvInput(page, 0)
      await input.clear()
      await input.fill('1')
      await input.press('Enter')
      await expect(page.getByText(/BOOL default value/)).toBeVisible()
    })

    test('TC-06-08 输入空值恢复为TRUE', async ({ page }) => {
      await setupBoolRow(page)
      const input = dvInput(page, 0)
      await input.clear()
      await input.press('Enter')
      await expect(input).toHaveValue('TRUE')
    })
  })

  test.describe('TC-07 编辑INT类型默认值', () => {
    async function setupIntRow(page: import('@playwright/test').Page) {
      await page.getByTestId('add-row-btn').click()
      await selectTrigger(page, 0).dblclick()
      await page
        .locator('.ant-select-dropdown:not(.ant-select-dropdown-hidden)')
        .getByText('INT')
        .first()
        .click()
    }

    test('TC-07-01 输入正常正整数', async ({ page }) => {
      await setupIntRow(page)
      const input = dvInput(page, 0)
      await input.clear()
      await input.fill('42')
      await input.press('Enter')
      await expect(input).toHaveValue('42')
    })

    test('TC-07-02 输入负整数', async ({ page }) => {
      await setupIntRow(page)
      const input = dvInput(page, 0)
      await input.clear()
      await input.fill('-100')
      await input.press('Enter')
      await expect(input).toHaveValue('-100')
    })

    test('TC-07-03 输入零', async ({ page }) => {
      await setupIntRow(page)
      const input = dvInput(page, 0)
      await input.clear()
      await input.fill('0')
      await input.press('Enter')
      await expect(input).toHaveValue('0')
    })

    test('TC-07-04 输入最大值边界2147483647', async ({ page }) => {
      await setupIntRow(page)
      const input = dvInput(page, 0)
      await input.clear()
      await input.fill('2147483647')
      await input.press('Enter')
      await expect(input).toHaveValue('2147483647')
    })

    test('TC-07-05 输入最小值边界-2147483648', async ({ page }) => {
      await setupIntRow(page)
      const input = dvInput(page, 0)
      await input.clear()
      await input.fill('-2147483648')
      await input.press('Enter')
      await expect(input).toHaveValue('-2147483648')
    })

    test('TC-07-06 输入超出上限', async ({ page }) => {
      await setupIntRow(page)
      const input = dvInput(page, 0)
      await input.clear()
      await input.fill('2147483648')
      await input.press('Enter')
      await expect(page.getByText(/out of range/)).toBeVisible()
    })

    test('TC-07-07 输入超出下限', async ({ page }) => {
      await setupIntRow(page)
      const input = dvInput(page, 0)
      await input.clear()
      await input.fill('-2147483649')
      await input.press('Enter')
      await expect(page.getByText(/out of range/)).toBeVisible()
    })

    test('TC-07-08 输入远超范围的值', async ({ page }) => {
      await setupIntRow(page)
      const input = dvInput(page, 0)
      await input.clear()
      await input.fill('9999999999')
      await input.press('Enter')
      await expect(page.getByText(/out of range/)).toBeVisible()
    })

    test('TC-07-09 输入小数', async ({ page }) => {
      await setupIntRow(page)
      const input = dvInput(page, 0)
      await input.clear()
      await input.fill('3.14')
      await input.press('Enter')
      await expect(page.getByText(/must be an integer/)).toBeVisible()
    })

    test('TC-07-10 输入非数字字符串', async ({ page }) => {
      await setupIntRow(page)
      const input = dvInput(page, 0)
      await input.clear()
      await input.fill('abc')
      await input.press('Enter')
      await expect(page.getByText(/must be an integer/)).toBeVisible()
    })

    test('TC-07-11 输入含空格的数字', async ({ page }) => {
      await setupIntRow(page)
      const input = dvInput(page, 0)
      await input.clear()
      await input.fill('1 23')
      await input.press('Enter')
      await expect(page.getByText(/must be an integer/)).toBeVisible()
    })

    test('TC-07-12 输入科学计数法', async ({ page }) => {
      await setupIntRow(page)
      const input = dvInput(page, 0)
      await input.clear()
      await input.fill('1e5')
      await input.press('Enter')
      await expect(page.getByText(/must be an integer/)).toBeVisible()
    })

    test('TC-07-13 输入前导零应标准化', async ({ page }) => {
      await setupIntRow(page)
      const input = dvInput(page, 0)
      await input.clear()
      await input.fill('007')
      await input.press('Enter')
      await expect(input).toHaveValue('7')
    })

    test('TC-07-14 输入0001应标准化为1', async ({ page }) => {
      await setupIntRow(page)
      const input = dvInput(page, 0)
      await input.clear()
      await input.fill('0001')
      await input.press('Enter')
      await expect(input).toHaveValue('1')
    })

    test('TC-07-15 输入-001应标准化为-1', async ({ page }) => {
      await setupIntRow(page)
      const input = dvInput(page, 0)
      await input.clear()
      await input.fill('-001')
      await input.press('Enter')
      await expect(input).toHaveValue('-1')
    })
  })

  test.describe('TC-08 编辑注释', () => {
    test('TC-08-01 输入普通文本', async ({ page }) => {
      await page.getByTestId('add-row-btn').click()
      const input = commentInput(page, 0)
      await input.fill('系统启动变量')
      await input.press('Enter')
      await expect(input).toHaveValue('系统启动变量')
    })

    test('TC-08-02 输入空值', async ({ page }) => {
      await page.getByTestId('add-row-btn').click()
      const input = commentInput(page, 0)
      await input.fill('计数值')
      await input.press('Enter')

      await input.clear()
      await input.press('Enter')
      await expect(input).toHaveValue('')
    })

    test('TC-08-03 输入特殊字符', async ({ page }) => {
      await page.getByTestId('add-row-btn').click()
      const input = commentInput(page, 0)
      await input.fill('@#$%^&*()')
      await input.press('Enter')
      await expect(input).toHaveValue('@#$%^&*()')
    })

    test('TC-08-04 输入长文本', async ({ page }) => {
      await page.getByTestId('add-row-btn').click()
      const input = commentInput(page, 0)
      const longText = 'a'.repeat(200)
      await input.fill(longText)
      await input.press('Enter')
      await expect(input).toHaveValue(longText)
    })
  })

  test.describe('TC-09 综合场景', () => {
    test('TC-09-01 完整故事卡片复现', async ({ page }) => {
      for (let i = 0; i < 3; i++) {
        await page.getByTestId('add-row-btn').click()
      }

      await nameInput(page, 0).fill('Start')
      await selectOption(page, 0, 'BOOL')

      await nameInput(page, 1).fill('Stop')
      await selectOption(page, 1, 'BOOL')

      await nameInput(page, 2).fill('Count')
      await selectOption(page, 2, 'INT')
      const dv = dvInput(page, 2)
      await dv.clear()
      await dv.fill('123')

      await commentInput(page, 0).fill('系统启动')
      await commentInput(page, 2).fill('计数值')

      await expect(nameInput(page, 0)).toHaveValue('Start')
      await expect(
        dataRow(page, 0).locator('td').nth(3).locator('.ant-select-selection-item')
      ).toContainText('BOOL')
      await expect(dvInput(page, 0)).toHaveValue('TRUE')
      await expect(commentInput(page, 0)).toHaveValue('系统启动')

      await expect(nameInput(page, 1)).toHaveValue('Stop')
      await expect(dvInput(page, 1)).toHaveValue('TRUE')

      await expect(nameInput(page, 2)).toHaveValue('Count')
      await expect(
        dataRow(page, 2).locator('td').nth(3).locator('.ant-select-selection-item')
      ).toContainText('INT')
      await expect(dvInput(page, 2)).toHaveValue('123')
      await expect(commentInput(page, 2)).toHaveValue('计数值')
    })

    test('TC-09-02 增删改后数据一致性', async ({ page }) => {
      for (let i = 0; i < 3; i++) {
        await page.getByTestId('add-row-btn').click()
      }

      await nameInput(page, 0).fill('Start')
      await selectOption(page, 0, 'BOOL')

      await nameInput(page, 1).fill('Stop')
      await selectOption(page, 1, 'BOOL')

      await nameInput(page, 2).fill('Count')
      await selectOption(page, 2, 'INT')
      await dvInput(page, 2).clear()
      await dvInput(page, 2).fill('123')

      await commentInput(page, 0).fill('系统启动')
      await commentInput(page, 2).fill('计数值')

      await rowCheckbox(page, 1).click()
      await page.getByTestId('delete-row-btn').click()

      await expect(dataRowCount(page)).toHaveCount(2)

      await nameInput(page, 0).clear()
      await nameInput(page, 0).fill('Begin')
      await nameInput(page, 0).press('Enter')

      await dvInput(page, 1).clear()
      await dvInput(page, 1).fill('999')
      await dvInput(page, 1).press('Enter')

      await expect(nameInput(page, 0)).toHaveValue('Begin')
      await expect(
        dataRow(page, 0).locator('td').nth(3).locator('.ant-select-selection-item')
      ).toContainText('BOOL')
      await expect(dvInput(page, 0)).toHaveValue('TRUE')
      await expect(commentInput(page, 0)).toHaveValue('系统启动')

      await expect(nameInput(page, 1)).toHaveValue('Count')
      await expect(
        dataRow(page, 1).locator('td').nth(3).locator('.ant-select-selection-item')
      ).toContainText('INT')
      await expect(dvInput(page, 1)).toHaveValue('999')
      await expect(commentInput(page, 1)).toHaveValue('计数值')
    })

    test('TC-09-03 类型切换后校验联动', async ({ page }) => {
      await page.getByTestId('add-row-btn').click()
      await selectTrigger(page, 0).dblclick()
      await page
        .locator('.ant-select-dropdown:not(.ant-select-dropdown-hidden)')
        .getByText('BOOL')
        .first()
        .click()

      const dv = dvInput(page, 0)
      await expect(dv).toHaveValue('TRUE')

      await selectTrigger(page, 0).dblclick()
      await page
        .locator('.ant-select-dropdown:not(.ant-select-dropdown-hidden)')
        .getByText('INT')
        .first()
        .click()
      await expect(dv).toHaveValue('0')

      await dv.clear()
      await dv.fill('3.14')
      await dv.press('Enter')
      await expect(page.getByText(/must be an integer/)).toBeVisible()

      await dv.clear()
      await dv.fill('100')
      await dv.press('Enter')
      await expect(dv).toHaveValue('100')

      await selectTrigger(page, 0).dblclick()
      await page
        .locator('.ant-select-dropdown:not(.ant-select-dropdown-hidden)')
        .getByText('BOOL')
        .first()
        .click()
      await expect(dv).toHaveValue('TRUE')
    })

    test('TC-09-04 添加多行后逐行删除至空', async ({ page }) => {
      for (let i = 0; i < 3; i++) {
        await page.getByTestId('add-row-btn').click()
      }

      await rowCheckbox(page, 0).click()
      await page.getByTestId('delete-row-btn').click()
      await expect(dataRowCount(page)).toHaveCount(2)
      await expect(indexCell(page, 0)).toContainText('1')
      await expect(indexCell(page, 1)).toContainText('2')

      await rowCheckbox(page, 1).click()
      await page.getByTestId('delete-row-btn').click()
      await expect(dataRowCount(page)).toHaveCount(1)
      await expect(indexCell(page, 0)).toContainText('1')

      await rowCheckbox(page, 0).click()
      await page.getByTestId('delete-row-btn').click()
      await expect(dataRowCount(page)).toHaveCount(0)

      await expect(page.getByTestId('add-row-btn')).toBeVisible()
      await expect(page.getByTestId('delete-row-btn')).toBeVisible()
    })
  })

  test.describe('TC-10 边界与异常', () => {
    test('TC-10-01 名称前后带空格', async ({ page }) => {
      await page.getByTestId('add-row-btn').click()
      const input = nameInput(page, 0)
      await input.fill(' Start ')
      await input.press('Enter')
      await expect(input).toHaveValue(' Start ')
    })

    test('TC-10-02 添加大量行性能', async ({ page }) => {
      test.setTimeout(60000)
      const start = Date.now()
      for (let i = 0; i < 100; i++) {
        await page.getByTestId('add-row-btn').click()
      }
      const elapsed = Date.now() - start
      await expect(dataRowCount(page)).toHaveCount(100)
      expect(elapsed).toBeLessThan(40000)
    })

    test('TC-10-03 并发编辑同一行不同字段', async ({ page }) => {
      await page.getByTestId('add-row-btn').click()
      await nameInput(page, 0).fill('TestName')
      await commentInput(page, 0).fill('TestComment')

      await expect(nameInput(page, 0)).toHaveValue('TestName')
      await expect(commentInput(page, 0)).toHaveValue('TestComment')
    })

    test('TC-10-04 浏览器刷新后数据', async ({ page }) => {
      await page.getByTestId('add-row-btn').click()
      await nameInput(page, 0).fill('TestVar')

      await page.reload()
      await page.waitForLoadState('networkidle')

      await expect(dataRowCount(page)).toHaveCount(0)
    })
  })
})
