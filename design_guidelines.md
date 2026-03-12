# 饭店点菜小程序设计指南

## 品牌定位

**产品定位**：小饭店客人点菜小程序
**设计风格**：温暖、有食欲、简洁易用
**目标用户**：饭店客人、追求便捷点餐体验的顾客

**核心意象**：
- 午后阳光透过餐厅窗户，木质桌面上摆放着热气腾腾的菜肴
- 温暖的餐厅氛围，新鲜食材的自然色泽
- 家常菜的香气，亲切的用餐体验

---

## 配色方案

### 主色板

| 颜色 | 色值 | Tailwind 类名 | 意象来源 |
|------|------|---------------|----------|
| 主色 | #FF6B35 | `bg-orange-500` / `text-orange-500` | 火焰、烤制、温暖 |
| 辅色 | #C44D58 | `bg-red-500` / `text-red-500` | 辣味、浓香 |
| 背景色 | #FAF8F5 | `bg-stone-50` | 米白色、餐桌、布料 |
| 卡片背景 | #FFFFFF | `bg-white` | 干净整洁的餐盘 |
| 边框色 | #E5E5E5 | `border-stone-200` | 菜单边框 |
| 主文字 | #2D3436 | `text-stone-800` | 深棕灰色、清晰易读 |
| 次要文字 | #636E72 | `text-stone-500` | 描述信息 |

### 语义色

| 用途 | 色值 | Tailwind 类名 |
|------|------|---------------|
| 成功/已下单 | #27AE60 | `text-green-600` |
| 热卖标签 | #F39C12 | `bg-yellow-400` |
| 新品标签 | #3498DB | `bg-blue-400` |
| 辣味标签 | #E74C3C | `bg-red-400` |

---

## 字体规范

### 字体选择

- **标题字体**：思源宋体（或衬线字体）- 传递传统、经典
- **正文字体**：思源黑体（或无衬线字体）- 现代、清晰

### 字号层级

| 层级 | Tailwind 类名 | 使用场景 |
|------|---------------|----------|
| H1 | `text-2xl font-bold` | 页面标题 |
| H2 | `text-xl font-semibold` | 分类标题 |
| H3 | `text-lg font-medium` | 菜品名称 |
| Body | `text-sm` | 正文内容 |
| Caption | `text-xs` | 辅助信息 |

---

## 间距系统

| 位置 | Tailwind 类名 |
|------|---------------|
| 页面边距 | `px-4 py-4` |
| 卡片内边距 | `p-4` |
| 卡片间距 | `gap-3` |
| 列表项间距 | `gap-4` |
| 内部元素间距 | `gap-2` |

---

## 组件规范

### 按钮

#### 主按钮（添加到购物车）
```tsx
<View className="w-full bg-orange-500 text-white rounded-full py-3 text-center font-medium">
  添加到购物车
</View>
```

#### 次按钮（清空购物车）
```tsx
<View className="px-4 py-2 bg-stone-100 text-stone-600 rounded-full text-sm">
  清空购物车
</View>
```

#### 图标按钮（加减数量）
```tsx
<View className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center">
  <Minus size={16} color="#636E72" />
</View>
```

### 卡片

#### 菜品卡片
```tsx
<View className="bg-white rounded-2xl p-4 shadow-sm mb-3">
  <Image className="w-full h-32 rounded-xl mb-3" src={dish.image} />
  <Text className="block text-lg font-medium text-stone-800 mb-1">{dish.name}</Text>
  <Text className="block text-sm text-stone-500 mb-2 line-clamp-2">{dish.description}</Text>
  <View className="flex justify-between items-center">
    <Text className="text-orange-500 font-bold text-lg">¥{dish.price}</Text>
    <View className="flex items-center gap-2">
      {/* 加减按钮 */}
    </View>
  </View>
</View>
```

#### 订单卡片
```tsx
<View className="bg-white rounded-2xl p-4 shadow-sm mb-3">
  <View className="flex justify-between items-center mb-2">
    <Text className="block text-base font-medium text-stone-800">订单 #{order.id}</Text>
    <Text className="text-sm text-green-600">{order.status}</Text>
  </View>
  <Text className="block text-sm text-stone-500 mb-3">{order.time}</Text>
  <View className="border-t border-stone-100 pt-3">
    <Text className="block text-base font-semibold text-stone-800">¥{order.total}</Text>
  </View>
</View>
```

### 输入框（订单备注）
```tsx
<View className="bg-stone-50 rounded-xl px-4 py-3">
  <Textarea
    className="w-full bg-transparent text-sm"
    placeholder="请输入口味备注..."
    style={{ width: '100%', minHeight: '80px' }}
  />
</View>
```

### 列表项（分类）
```tsx
<View className="px-4 py-3 bg-orange-500 text-white rounded-r-lg">
  <Text className="block text-sm font-medium">{category.name}</Text>
</View>
```

### 空状态
```tsx
<View className="flex flex-col items-center justify-center py-12">
  <ShoppingCart size={48} color="#E5E5E5" />
  <Text className="block text-stone-400 text-sm mt-3">购物车是空的</Text>
</View>
```

---

## 导航结构

### TabBar 配置

| 页面 | 文本 | 图标 | 选中图标 |
|------|------|------|----------|
| 首页 | 首页 | `Utensils` | `Utensils` |
| 购物车 | 购物车 | `ShoppingCart` | `ShoppingCart` |
| 订单 | 订单 | `ClipboardList` | `ClipboardList` |
| 我的 | 我的 | `User` | `User` |

**配色**：
- 未选中：`#636E72`
- 选中：`#FF6B35`
- 背景：`#FFFFFF`

### 页面跳转规范
- TabBar 页面：使用 `Taro.switchTab()`
- 详情页面：使用 `Taro.navigateTo()`
- 订单详情：使用 `Taro.navigateTo()`

---

## 小程序约束

### 性能优化
- 菜品图片压缩：单张 < 100KB
- 首屏加载：优先加载分类列表，菜品图片懒加载
- 列表分页：每页 20 条数据

### 图片策略
- 菜品图片：推荐尺寸 800x600（4:3），JPG 格式
- 缩略图：200x150，用于列表展示
- 使用 CDN 或对象存储

### 包体积控制
- 图标使用 Lucide 图标库（已预装）
- 避免引入大型第三方库
- 使用分包加载（如有必要）

---

## 设计禁忌

- ❌ 禁止使用冷色调（蓝色、紫色）
- ❌ 禁止纯白色背景（使用米白色 #FAF8F5）
- ❌ 禁止过于几何化、科技感的设计
- ❌ 禁止使用占位符图片（使用真实菜品图片）
- ❌ 禁止过度装饰，保持简洁易用

---

## 页面结构

### 首页（菜品列表）
- 顶部：搜索框（可选）
- 主体：左侧分类导航（固定宽度）+ 右侧菜品列表（滚动）
- 底部：购物车入口（悬浮按钮）

### 购物车页面
- 顶部：标题栏（清空按钮）
- 主体：已选菜品列表（可调整数量）
- 底部：合计金额 + 提交订单按钮

### 订单页面
- 顶部：标题栏
- 主体：订单列表（按时间倒序）
- 点击：查看订单详情

### 订单详情页面
- 顶部：返回按钮 + 标题
- 主体：订单信息、菜品清单、备注、时间
- 底部：操作按钮（如有）

---

## 交互设计

### 购物车动画
- 添加商品：图标跳动 + 数量增加动画
- 提交订单：加载状态 → 成功提示

### 下拉刷新
- 首页、订单列表支持下拉刷新

### 触感反馈
- 按钮点击：触感反馈（小程序端）
- 添加购物车：轻微震动

---

## 特殊状态

### 加载状态
```tsx
<View className="flex items-center justify-center py-8">
  <ActivityIndicator size="large" color="#FF6B35" />
</View>
```

### 空购物车
```tsx
<View className="flex flex-col items-center justify-center py-16 px-8">
  <ShoppingCart size={64} color="#E5E5E5" />
  <Text className="block text-stone-400 text-sm mt-4 text-center">
    购物车是空的{'\n'}快去选择心仪的菜品吧
  </Text>
</View>
```

### 网络错误
```tsx
<View className="flex flex-col items-center justify-center py-16">
  <WifiOff size={48} color="#E5E5E5" />
  <Text className="block text-stone-400 text-sm mt-3">网络连接失败</Text>
  <View className="mt-4">
    <Button size="mini">重新加载</Button>
  </View>
</View>
```
