# 字号尺迁移报告（account / boarding / checkout / cart）

本轮只改字号、行高、字重 class。
没有改组件结构、文案、颜色。
没有切分支、没有 commit、没有 push。

语义尺（`lib/design-tokens/typography.ts` / `globals.css`）是唯一真相：

| token         | size | line-height | weight |
| ------------- | ---- | ----------- | ------ |
| `text-h1`     | 64   | 64          | 600    |
| `text-h2`     | 52   | 52          | 600    |
| `text-h3`     | 48   | 48          | 600    |
| `text-h4`     | 42   | 42          | 600    |
| `text-large`  | 32   | 40          | 600    |
| `text-lead`   | 24   | 32          | 600    |
| `text-p-ui`   | 20   | 24          | 500    |
| `text-p`      | 16   | 24          | 400    |
| `text-subtle` | 14   | 20          | 400    |
| `text-detail` | 12   | 20          | 300    |

换算前提：`globals.css:90-109` 把 Tailwind 默认尺钉成 1.25x。
`text-xs` 实际 15px，`text-sm` 实际 17.5px，`text-base` 实际 20px，`text-lg` 实际 22.5px，`text-xl` 实际 25px，`text-2xl` 实际 30px，`text-3xl` 实际 37.5px。
映射按渲染 px 就近归档，不按 class 名字面翻译。

## 映射表（原值 -> 新 token -> 处数）

处数按 git diff 里被替换掉的 class 出现次数计。
同一行如果同时去掉 `leading-*` / `font-bold`，不重复计入字号处数。

| 原 class                                 | 实际渲染 | 新 token                       | 新 size    | 处数 | 规则                                              |
| ---------------------------------------- | -------- | ------------------------------ | ---------- | ---- | ------------------------------------------------- |
| `text-[11px]`                            | 11       | `text-detail`                  | 12         | 9    | 角标 / 日历表头 / “1-hour blocks”                 |
| `text-[12px]` 角标、附加项、时间戳、币种 | 12       | `text-detail`                  | 12         | 18   | 真正的边角标注，保留                              |
| `text-[12px]` 字段标签、错误、侧栏邮箱   | 12       | `text-subtle`                  | 14         | 14   | account / boarding 偏小，提到次要信息档           |
| `text-[13px]`                            | 13       | `text-subtle`                  | 14         | 40   | 次要信息默认上提到 14                             |
| `text-[14px]`                            | 14       | `text-subtle`                  | 14         | 7    | 就近                                              |
| `text-[15px]`                            | 15       | `text-p`                       | 16         | 41   | 正文 / 输入 / 按钮默认 16                         |
| `text-[16px]`                            | 16       | `text-p`                       | 16         | 26   | 就近；标题保留 `font-semibold`                    |
| `text-[17px]`                            | 17       | `text-p`                       | 16         | 2    | 就近                                              |
| `text-[18px]`                            | 18       | `text-p-ui`                    | 20         | 5    | 小标题，往上靠 20 而不是压成正文 16               |
| `text-[20px]`                            | 20       | `text-p-ui`                    | 20         | 5    | 就近；原 600 保留 `font-semibold`                 |
| `text-[22px]`                            | 22       | `text-lead`                    | 24         | 9    | 区块标题，往上靠 24                               |
| `text-[24px]`                            | 24       | `text-lead`                    | 24         | 4    | token 自带 600，去掉 `font-semibold`              |
| `text-[36px]`                            | 36       | `text-large`                   | 32         | 4    | 就近（会缩小 4px，见待确认）                      |
| `text-[40px]`                            | 40       | `text-h4`                      | 42         | 3    | 就近；token 行高已是 1，去掉 `leading-*`          |
| `text-xs`                                | 15       | `text-subtle` 或 `text-detail` | 14 / 12    | 12   | 表单错误 / 说明 -> subtle；步进圆点数字 -> detail |
| `text-sm`                                | 17.5     | `text-p`                       | 16         | 24   | 就近且正文默认 16                                 |
| `text-base`                              | 20       | `text-p-ui`                    | 20         | 4    | 就近                                              |
| `text-lg`                                | 22.5     | `text-p-ui` 或 `text-lead`     | 20 / 24    | 3    | 商品标题走 p-ui（自带 500）；合计走 lead          |
| `text-xl`                                | 25       | `text-lead`                    | 24         | 3    | 就近                                              |
| `text-2xl`                               | 30       | `text-large`                   | 32         | 4    | 就近                                              |
| `text-3xl`                               | 37.5     | `text-h4`                      | 42         | 3    | 就近（空购物车 / 取消支付标题）                   |
| `text-body-medium`                       | 14       | `text-subtle`                  | 14         | 1    | 不在本轮 10 档尺里，并入 subtle                   |
| `font-bold`                              | 假粗     | `font-semibold` 或删除         | —          | 9    | Outfit 没加载 700；token 已是 600 则直接删        |
| `leading-*` / `leading-[NNpx]`           | 各异     | 删除                           | token 自带 | 34   | 无需要偏离的个案被保留                            |

合计：约 255 处 class 替换，39 个文件，净行数持平。

## 字重处理

- token 已是 600（`h4` / `large` / `lead`）：去掉冗余 `font-semibold`，`font-bold` 一并删。
- token 是 500（`p-ui`）：去掉冗余 `font-medium`；原 600/700 保留 `font-semibold`。
- token 是 400（`p` / `subtle`）或 300（`detail`）：原 `font-medium` / `font-semibold` 视为强调，保留。
- 营销段里刻意 Regular 的大字（`WhoIt's For` 副标题、`CareLead` 眉题、`TrustedVet` 正文）保留 `font-normal`。

已存在的 `text-subtle-medium` / `text-subtle-semibold` 没动。
它们是同尺（14）的字重变体，不是任意值，也不是 Tailwind 默认尺。

## 逐文件改动清单

### account

- `components/features/account/AccountLayout.tsx`：页标题 40 -> `text-h4`。
- `components/features/account/AccountSidebar.tsx`：头像缩写 / 姓名 17·16 -> `text-p`；邮箱 12 -> `text-subtle`。
- `components/features/account/FirstLoginBanner.tsx`：欢迎标题 `text-xl` -> `text-lead`；进度文案 `text-sm` -> `text-p`；圆点数字 `text-xs` -> `text-detail`。
- `components/features/account/AddressFormDialog.tsx`：标签 / 选择器 `text-sm`(17.5) -> `text-p`；错误 `text-xs` -> `text-subtle`。
- `components/features/account/sections/ProfileInfo.tsx`：区块标题 22 -> `text-lead`；输入 15 -> `text-p`；错误 12 -> `text-subtle`。
- `components/features/account/sections/AddressBook.tsx`：标题 22 -> `text-lead`；空态标题 16 -> `text-p`；类型 / Default 角标 11 -> `text-detail`；姓名 15 -> `text-p`；电话 13 -> `text-subtle`。
- `components/features/account/sections/OrderHistory.tsx`：空态 / 合计 18 -> `text-p-ui`；单号 16 -> `text-p`；日期 / 规格 / 数量 13 -> `text-subtle`；状态胶囊 12 -> `text-detail`；品名 / 行价 15 -> `text-p`；`font-bold` 降为 `font-semibold`。
- `components/features/account/sections/OrderDetails.tsx`：页标题 24 -> `text-lead`；区块标题 18 -> `text-p-ui`；信息行标签 12 -> `text-subtle`；状态胶囊 13 -> `text-subtle`；品名 / 行价 15 -> `text-p`；附加项 12 留 `text-detail`；合计 20/`font-bold` -> `text-p-ui font-semibold`。
- `components/features/account/sections/TrackOrder.tsx`：订单号 18 -> `text-p-ui`；时间线标题 15 -> `text-p`；描述 / 辅助 13 -> `text-subtle`；发货时间 / 最后更新 12 留 `text-detail`；卡片标题 16 -> `text-p`；字段标签 12 -> `text-subtle`。
- `components/features/account/sections/Boarding.tsx`：页标题 24 -> `text-lead`；空态 / 单号 16 -> `text-p`；状态胶囊 12 -> `text-detail`；日期 15 -> `text-p`；晚数 13 -> `text-subtle`。
- `components/features/account/sections/BoardingDetails.tsx`：页标题 24 -> `text-lead`；信息行标签 12 -> `text-subtle`；状态胶囊 12 -> `text-detail`；取消按钮 / 错误条 13 -> `text-subtle`；区块标题 16 -> `text-p`；宠物名 15 -> `text-p`。
- `components/features/account/sections/PaymentMethods.tsx`：标题 `text-2xl`(30) -> `text-large`；Default 角标 `text-xs` -> `text-detail`；卡号 / 有效期 `text-sm` -> `text-p`。

`app/(shop)/account/page.tsx` 只是壳，无字号 class。

### boarding

- `components/features/boarding/booking/BoardingBookingPage.tsx`：页标题 40 -> `text-h4`；主按钮 15 -> `text-p`。
- `components/features/boarding/booking/StepIndicator.tsx`：步进数字 11 -> `text-detail`；标签 14 -> `text-subtle`。
- `components/features/boarding/booking/StayCalendarCard.tsx`：标题 16 -> `text-p`；选中摘要 13 -> `text-subtle`；月份 15 -> `text-p`；星期 11 留 `text-detail`；日期格 / 时段 13 -> `text-subtle`；“1-hour blocks” 11 留 `text-detail`。
- `components/features/boarding/booking/StaySummaryCard.tsx`：标题 20 -> `text-p-ui`；提示 13 -> `text-subtle`。
- `components/features/boarding/booking/BookingDetailsStep.tsx`：输入 / 文本域 15 -> `text-p`；错误 `text-xs` -> `text-subtle`；宠物芯片 12 留 `text-detail`；三个区块标题 22 -> `text-lead`；加宠物 / 提交按钮 14·15 -> `text-subtle` / `text-p`。
- `components/features/boarding/booking/BookingSubmittedStep.tsx`：页标题 36 -> `text-large`；Reference 标签 12 -> `text-subtle`；单号 20 -> `text-p-ui`；状态胶囊 12 留 `text-detail`；提示 13 -> `text-subtle`；下一步标题 14 -> `text-subtle`；副标题 12 -> `text-subtle`；按钮 15 -> `text-p`。
- `components/features/boarding/lookup/BoardingLookupPage.tsx`：页标题 36 -> `text-large`；输入 / 按钮 15 -> `text-p`；错误 13 -> `text-subtle`；Reference 标签 12 -> `text-subtle`；单号 18 -> `text-p-ui`；状态胶囊 12 留 `text-detail`；取消按钮 14 -> `text-subtle`。
- `components/features/boarding/CancelBookingDialog.tsx`：标题 20 -> `text-p-ui`。
- `components/features/boarding/HeroIntroSection.tsx`：去掉与 token 重叠的 `leading-*` / `font-semibold`；CTA `text-sm` -> `text-p`；叠层说明保留 `font-normal`。
- `components/features/boarding/WhoItsForSection.tsx`：副标题 `text-xl`/`sm:text-2xl` -> `text-lead`/`sm:text-large` 并保留 `font-normal`；卡片标题去掉自定义行高；`text-body-medium` -> `text-subtle`。
- `components/features/boarding/CareLeadSection.tsx` / `PoopHappensSection.tsx` / `TrustedVetSection.tsx`：已是语义 token，只删冗余行高和字重。

`app/(shop)/piggyway-boarding/**/page.tsx` 只是壳，无字号 class。

### checkout

- `app/(shop)/checkout/canceled/page.tsx`：`text-3xl font-bold` -> `text-h4`。
- `app/(shop)/checkout/success/page.tsx`：页标题 36 -> `text-large`；按钮 15 -> `text-p`；Order 标签 12 -> `text-subtle`；单号 16 -> `text-p`；Paid 胶囊 12 留 `text-detail`；品名 / 数量 / 行价 14·13 -> `text-subtle`；附加项 12 留 `text-detail`；合计 22/`font-bold` -> `text-lead`；币种 12 留 `text-detail`。
- `components/features/checkout/CheckoutPage.tsx`：空车 `text-3xl` -> `text-h4`；页标题 40 -> `text-h4`；步进数字 11 -> `text-detail`。
- `components/features/checkout/CheckoutSummary.tsx`：标题 20 -> `text-p-ui`；件数 13 -> `text-subtle`；数量角标 11 留 `text-detail`；规格 / 附加项 12 留 `text-detail`；运费提示 13 -> `text-subtle`；促销说明 12 留 `text-detail`；促销错误 12 -> `text-subtle`；合计 24/`font-bold` -> `text-lead`；节省条 13 -> `text-subtle`。
- `components/features/checkout/PaymentForm.tsx`：标题 22 -> `text-lead`；错误 14 -> `text-subtle`；支付按钮 16 -> `text-p`。
- `components/features/checkout/steps/EmailStep.tsx`：标题 22 -> `text-lead`；输入 15 -> `text-p`；说明 13 -> `text-subtle`；按钮 16 -> `text-p`。
- `components/features/checkout/steps/AddressStep.tsx`：履约标题 16 -> `text-p`；meta 13 / note 12 -> `text-subtle`；Contact 标签 12 -> `text-subtle`；邮箱值 / 全部输入 15 -> `text-p`；区块标题 22 -> `text-lead`；按钮 16 -> `text-p`。
- `components/features/checkout/PickupSelector.tsx`：与 boarding 日历同一套映射（15/16 -> `text-p`，13 -> `text-subtle`，11 表头 / 1-hour blocks 留 `text-detail`）。

### cart

- `components/features/cart/CartPage.tsx`：加载 `text-lg` -> `text-p-ui`；空车 `text-3xl font-bold` -> `text-h4`；错误 `text-sm` -> `text-p`；页标题 `text-2xl font-bold` -> `text-large`。
- `components/features/cart/CartItem.tsx`：品名 `text-lg font-medium` -> `text-p-ui`；规格 / 附加项 `text-sm` -> `text-p`。
- `components/features/cart/CartSummary.tsx`：促销码 `text-sm`/`text-xs` -> `text-p`/`text-subtle`；标题 `text-xl` -> `text-lead`；进度条 `text-sm`/`text-xs` -> `text-p`/`text-subtle`；明细 `text-base` -> `text-p-ui`；合计 `text-lg` -> `text-lead`。
- `components/features/cart/RelatedProducts.tsx`：`text-2xl` -> `text-large`。
- `components/features/cart/FloatingCartButton.tsx`：角标 `text-xs font-bold` -> `text-detail font-semibold`；规格 `text-sm` -> `text-p`。
- `components/features/cart/CartProvider.tsx`：提示 `text-sm` -> `text-p`。

`app/(shop)/cart/page.tsx` 只是壳。

## 有意放大的地方

account / boarding 用户明确说偏小。
11 / 12 / 13 除非是角标或法律小字，一律上提。

- 字段标签（Reference / Order / Phone / Contact / Recipient / Address）12 -> `text-subtle` 14。
  这是可读的次要信息，不是角标。
- 日期、数量、晚数、电话、时间线描述、错误条、说明文 13 -> `text-subtle` 14。
- 侧栏邮箱 12 -> `text-subtle` 14。
- 表单错误 12 / `text-xs`(15) -> `text-subtle` 14。
- 输入、按钮、品名 15 -> `text-p` 16。正文默认落在 16。
- 18px 小标题（空订单、订单项、合计）-> `text-p-ui` 20。压成 16 会和正文撞车。
- 22px 区块标题 -> `text-lead` 24。
- 日历日期格 / 时段 13 -> `text-subtle` 14。格子 38px 高，放得下。
- `text-3xl`(37.5) 空车 / 取消支付标题 -> `text-h4` 42。
- `text-2xl`(30) 区块标题 -> `text-large` 32。

刻意没放大、留在 `text-detail` 的：

- 状态胶囊、类型胶囊、Default、Paid、宠物芯片。
- 步进圆点数字、购物车数量角标。
- 日历星期表头、"1-hour blocks"。
- 附加项 / 规格细行、发货时间戳、"Last updated"、币种代码。

## 需要人确认

1. **36px 页标题收到 32（`text-large`）**
   lookup / 提交成功 / checkout success 的主标题按就近规则是 32，不是 42。
   视觉上会略缩。
   若希望这些页标题更接近原来的 36，应改成 `text-h4`(42)。

2. **`text-sm`(17.5) 收到 `text-p`(16)**
   就近且符合正文默认，但 account 表单标签、cart 规格行会比现在小 1.5px。
   若这些场景要保持接近 17.5，只能破例用 `text-p-ui`(20)，会明显变大。

3. **cart 商品标题 `text-lg`(22.5) / `font-medium` -> `text-p-ui`(20)**
   字重对上了（500），字号小 2.5px。
   另一边是 `text-lead`(24/600)，会更粗也更大。

4. **boarding 营销段我动了冗余行高**
   `HeroIntro` 叠层说明原来是 28 / 30 / 31，现在跟 token（`p-ui` 24 / `lead` 32）。
   `CareLead` 长文原来整段 `leading-[32px]`，现在 `p-ui` 是 24、`sm:text-lead` 才是 32。
   这是营销落地页。
   范围里写了 `components/features/boarding/`，但也写了不要碰营销页。
   我按“范围内的 Tailwind 尺 + 冗余 leading/weight”处理了。
   若营销行高要锁死，可以把这三处 `leading-*` 加回去。

5. **checkout / cart 的 13px 也提到了 14**
   “偏小”原话只点了 account 和 boarding。
   checkout / cart 我用了同一套规则，避免三套尺并存。
   若 checkout 摘要要更紧，附加项已经留在 `text-detail`，但 13px 辅助文案现在是 14。

6. **`text-subtle-medium` / `text-subtle-semibold` 没并进 10 档尺**
   侧栏、筛选胶囊、返回链接已经在用它们。
   本轮任务是清任意值和 Tailwind 尺，没有把这些变体改写成 `text-subtle` + 手写字重。

## 验证

- `npx tsc --noEmit`：通过。
- 对本轮文件跑 eslint：0 error。
  仅 `CartProvider.tsx` 有一条预先存在的 `requireAuth` unused warning，与本次无关。
- 全仓 `pnpm lint` 仍会被 `.open-next/` 构建产物刷屏（配置没忽略它），不是这次引入的。
- `http://localhost:3000` 下 `/account`、`/cart`、`/checkout`、`/checkout/canceled`、`/piggyway-boarding`、`/piggyway-boarding/book`、`/piggyway-boarding/lookup` 均返回 200。
  account / checkout 登录墙后面的真实字号需要你在浏览器里看一眼。

## 第二轮：boarding 预订页档位重排

范围只限 `components/features/boarding/booking/` 下 6 个文件。
第一轮把任意值换成了语义 token，但预订页把可交互内容和可读正文几乎全压进 `text-subtle`(14)。
这一轮只动字号、行高、字重，以及时间标签行的基线对齐。
没有改颜色、文案、组件结构、交互逻辑。
没有切分支、没有 commit、没有 push。

### 为什么卡片标题拉到 24，而不是停在 20

任务先要求两个并排卡片标题统一到 `text-p-ui`(20)。
月份标签「August 2026」原来是 `text-p`(16)，和日历卡片标题同档，在抢戏，要提到 `text-p-ui`(20)。
提完之后卡片标题和月份都是 20，台阶又平了。
规则是必须保住「卡片标题 > 月份标签」，所以卡片标题继续拉到 `text-lead`(24)。
`Stay summary` 必须和日历卡片标题同档，一起到 24。
Details 步骤三个 `h2` 第一轮已经是 `text-lead`(24)，和重排后的并排卡片同档，没有再动。

`text-lead` 自带 600，日历标题和 Stay summary 上去之后去掉了冗余的 `font-semibold`。
月份留在 `text-p-ui font-semibold`（20 / 24 / 600），和 24 / 32 / 600 的卡片标题差 4px，台阶成立。

### 改前 -> 改后 -> 理由

| 位置                                                                           | 改前                                | 改后                              | 理由                                                |
| ------------------------------------------------------------------------------ | ----------------------------------- | --------------------------------- | --------------------------------------------------- |
| `StayCalendarCard` 卡片标题「Start — Drop-off」                                | `text-p`(16) + `font-semibold`      | `text-lead`(24)                   | 先和右侧统一到 20，再为了压过月份提到 24            |
| `StaySummaryCard` 卡片标题「Stay summary」                                     | `text-p-ui`(20) + `font-semibold`   | `text-lead`(24)                   | 两个并排卡片标题必须同档                            |
| `BookingDetailsStep` 三个 h2（Your details / Pet details / Emergency contact） | 已是 `text-lead`(24)                | 不动                              | 同级卡片标题，重排后仍和并排卡片同档                |
| 月份标签「August 2026」                                                        | `text-p`(16) + `font-semibold`      | `text-p-ui`(20) + `font-semibold` | 原来和卡片标题同档抢戏；提到 20 后标题再让到 24     |
| 日期数字                                                                       | `text-subtle`(14)，容器 `h-[38px]`  | `text-p`(16)，容器高度不动        | 点击目标，不能和角标同档                            |
| 时间槽按钮                                                                     | `text-subtle`(14)，容器 `h-9`(36)   | `text-p`(16)，容器高度不动        | 同上；24 行高在 36 高里还能垂直居中                 |
| `StaySummaryCard` 摘要行 label                                                 | `text-subtle`(14)                   | 不动                              | 次要标签，留给 value 做对比                         |
| `StaySummaryCard` 摘要行 value                                                 | `text-subtle-medium`(14)            | `text-p font-medium`(16)          | label / value 要有字号台阶；保留 medium             |
| `BookingSubmittedStep` 摘要行 value                                            | `text-subtle-medium`(14)            | `text-p font-medium`(16)          | Confirm 步骤同一套摘要行，一并拉开                  |
| 时间区块标签「Drop-off time」                                                  | `text-subtle`(14) + `font-medium`   | `text-p`(16) + `font-semibold`    | 标签比自己管的时间槽(16)还小，层级倒了              |
| 「1-hour blocks」                                                              | `text-detail`(12)                   | 不动                              | 真角标                                              |
| 时间标签行对齐                                                                 | `items-center`                      | `items-baseline`                  | 左侧 16/24、右侧 12/20，按中线对齐会偏基线          |
| Details「+ Add another pet」                                                   | `text-subtle`(14) + `font-semibold` | `text-p`(16) + `font-semibold`    | 同类按钮不该有两套字号，跟齐到 16                   |
| Details「← Back」                                                              | `text-subtle-medium`(14)            | `text-p`(16) + `font-medium`      | 和同行 Submit 必须同档；变体尺换成标准尺 + 显式字重 |
| Details「Submit Request」                                                      | 已是 `text-p`(16) + `font-semibold` | 不动                              | 主按钮已经在 16                                     |
| 日历星期表头 Mo/Tu/We                                                          | `text-detail`(12)                   | 不动                              | 真角标                                              |
| 步骤条圆点数字                                                                 | `text-detail`(12)                   | 不动                              | 真角标                                              |

### 本次补的两处

**1. 时间区块标签倒挂**

`StayCalendarCard.tsx:215` 的 `{timeLabel}`（Drop-off time / Pick-up time）上一轮漏了。
时间槽按钮已经是 `text-p`(16)，标签还停在 `text-subtle`(14)，管辖关系是倒的。
提到 `text-p font-semibold`。
右侧「1-hour blocks」继续 `text-detail`(12)。
这一行从 `items-center` 改成 `items-baseline`，避免 24 行高对 20 行高时两侧基线错位。

**2. Details 三个按钮三个档**

改前：Add another pet 14 / Back 14（还是 `text-subtle-medium`）/ Submit 16。
Back 和 Submit 在同一条 Actions 行里并排，字号必须一致，Back 提到 `text-p font-medium`。
「+ Add another pet」是另一处 outline 按钮。
默认跟齐到 16：同类按钮不该有两套字号。
三个按钮都改成 `text-p` + 显式字重，不再混用 `text-subtle-medium` 这种变体尺。
Add another pet / Submit 保留 `font-semibold`，Back 保留原来的 medium。

### 未验证

下面两项这一轮没做，留给后续人工验收。不要当成已经完成。

- 四个步骤（Drop-off / Pick-up / Details / Confirm）的浏览器目视核对没做。
- `text-h4` 行高 1.0（42/42）会不会挤压或裁切页面 H1「Book a Boarding Stay」，这一轮没有实机量。

### 本轮静态检查

- `npx tsc --noEmit`：通过。
- 对本轮 6 个 booking 文件跑 eslint：0 error，0 warning。
