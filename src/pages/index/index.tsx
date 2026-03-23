import { View, Text, Image, ScrollView } from '@tarojs/components'
import { useState } from 'react'
import { useLoad } from '@tarojs/taro'
import { Network } from '@/network'
import { useCartStore } from '@/stores/cart'
import { Utensils, Plus, Minus, Flame, Fish, Soup, Coffee, Beef, Salad } from 'lucide-react-taro'

interface Category {
  id: string
  name: string
  icon?: string
  description?: string
}

interface Dish {
  id: string
  category_id: string
  name: string
  description?: string
  image?: string
  price: number
  original_price?: number
  tags?: string[]
  is_available: boolean
  sales_count: number
}

// 分类图标映射
const getCategoryIcon = (iconName?: string) => {
  const iconMap: Record<string, typeof Flame> = {
    flame: Flame,
    fish: Fish,
    soup: Soup,
    coffee: Coffee,
    beef: Beef,
    salad: Salad,
  }
  return iconMap[iconName || ''] || Utensils
}

const IndexPage = () => {
  const [categories, setCategories] = useState<Category[]>([])
  const [dishes, setDishes] = useState<Dish[]>([])
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const { addItem, items } = useCartStore()

  useLoad(() => {
    fetchData()
  })

  const fetchData = async () => {
    try {
      setLoading(true)

      // 并行获取分类和菜品
      const [categoriesRes, dishesRes] = await Promise.all([
        Network.request<{ code: number; msg: string; data: Category[] }>({
          url: '/api/categories',
          method: 'GET'
        }),
        Network.request<{ code: number; msg: string; data: Dish[] }>({
          url: '/api/dishes',
          method: 'GET'
        })
      ])

      console.log('分类列表:', categoriesRes.data)
      console.log('菜品列表:', dishesRes.data)

      if (categoriesRes.data?.data) {
        setCategories(categoriesRes.data.data)
        if (categoriesRes.data.data.length > 0) {
          setSelectedCategoryId(categoriesRes.data.data[0].id)
        }
      }

      if (dishesRes.data?.data) {
        setDishes(dishesRes.data.data)
      }
    } catch (error) {
      console.error('获取数据失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const getDishQuantity = (dishId: string) => {
    return items.find(item => item.dishId === dishId)?.quantity || 0
  }

  const handleAdd = (dish: Dish) => {
    addItem({
      id: `${dish.id}-${Date.now()}`,
      dishId: dish.id,
      dishName: dish.name,
      dishPrice: Number(dish.price),
      image: dish.image
    })
  }

  const handleDecrease = (dishId: string) => {
    const item = items.find(i => i.dishId === dishId)
    if (item && item.quantity > 0) {
      useCartStore.getState().updateQuantity(dishId, item.quantity - 1)
    }
  }

  // 使用正确的字段名 category_id 进行过滤
  const filteredDishes = dishes.filter(dish => dish.category_id === selectedCategoryId)

  // 加载状态
  if (loading) {
    return (
      <View className="flex flex-col items-center justify-center h-screen bg-stone-50">
        <View className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
        <Text className="text-stone-500 text-sm mt-4">加载中...</Text>
      </View>
    )
  }

  return (
    <View className="flex flex-col h-screen bg-stone-50">
      {/* 顶部标题栏 */}
      <View className="px-4 pt-4 pb-3 bg-white shadow-sm">
        <View className="flex items-center justify-between">
          <View>
            <Text className="block text-xl font-bold text-stone-800">🍽️ 美味餐厅</Text>
            <Text className="block text-xs text-stone-400 mt-0.5">精选美食，品质保证</Text>
          </View>
          <View className="px-3 py-1.5 bg-orange-50 rounded-full">
            <Text className="text-xs text-orange-500 font-medium">共 {dishes.length} 道菜</Text>
          </View>
        </View>
      </View>

      {/* 主体内容 */}
      <View className="flex-1 flex overflow-hidden">
        {/* 左侧分类导航 */}
        <ScrollView scrollY className="w-22 bg-white border-r border-stone-100">
          <View className="flex flex-col py-2">
            {categories.map((category) => {
              const IconComponent = getCategoryIcon(category.icon)
              const isSelected = selectedCategoryId === category.id
              return (
                <View
                  key={category.id}
                  className={`flex flex-col items-center py-3 px-1 mx-1 my-1 rounded-xl ${
                    isSelected
                      ? 'bg-orange-500'
                      : 'bg-transparent'
                  }`}
                  onClick={() => setSelectedCategoryId(category.id)}
                >
                  <View className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 ${
                    isSelected ? 'bg-white/20' : 'bg-stone-100'
                  }`}
                  >
                    <IconComponent size={20} color={isSelected ? '#FFFFFF' : '#78716C'} />
                  </View>
                  <Text className={`block text-xs font-medium ${
                    isSelected ? 'text-white' : 'text-stone-600'
                  }`}
                  >
                    {category.name}
                  </Text>
                </View>
              )
            })}
          </View>
        </ScrollView>

        {/* 右侧菜品列表 */}
        <ScrollView scrollY className="flex-1 bg-stone-50">
          <View className="p-3">
            {filteredDishes.length === 0 ? (
              <View className="flex flex-col items-center justify-center py-20">
                <View className="w-20 h-20 rounded-full bg-stone-100 flex items-center justify-center">
                  <Utensils size={36} color="#A8A29E" />
                </View>
                <Text className="block text-stone-400 text-sm mt-4">该分类暂无菜品</Text>
                <Text className="block text-stone-300 text-xs mt-1">请选择其他分类查看</Text>
              </View>
            ) : (
              filteredDishes.map((dish) => {
                const quantity = getDishQuantity(dish.id)
                return (
                  <View 
                    key={dish.id} 
                    className="bg-white rounded-2xl p-3 mb-3 shadow-sm border border-stone-100"
                  >
                    <View className="flex gap-3">
                      {/* 菜品图片 */}
                      <View className="relative">
                        <Image
                          className="w-28 h-28 rounded-xl bg-stone-100"
                          src={dish.image || 'https://via.placeholder.com/112?text=菜品'}
                          mode="aspectFill"
                        />
                        {/* 热卖/新品标签 */}
                        {dish.tags && dish.tags.length > 0 && (
                          <View className="absolute top-1 left-1">
                            <View className={`px-1.5 py-0.5 rounded text-xs text-white ${
                              dish.tags[0] === '热卖' ? 'bg-red-500' :
                              dish.tags[0] === '新品' ? 'bg-blue-500' :
                              dish.tags[0] === '推荐' ? 'bg-amber-500' : 'bg-stone-400'
                            }`}
                            >
                              {dish.tags[0]}
                            </View>
                          </View>
                        )}
                      </View>

                      {/* 菜品信息 */}
                      <View className="flex-1 flex flex-col justify-between py-0.5">
                        <View>
                          <Text className="block text-base font-semibold text-stone-800 mb-1">
                            {dish.name}
                          </Text>
                          {dish.description && (
                            <Text className="block text-xs text-stone-400 line-clamp-2 leading-relaxed">
                              {dish.description}
                            </Text>
                          )}
                        </View>

                        {/* 价格和操作 */}
                        <View className="flex justify-between items-end mt-2">
                          <View className="flex items-baseline gap-1.5">
                            <Text className="text-orange-500 font-bold text-lg">
                              ¥{dish.price}
                            </Text>
                            {dish.original_price && dish.original_price > dish.price && (
                              <Text className="text-stone-300 text-xs line-through">
                                ¥{dish.original_price}
                              </Text>
                            )}
                          </View>

                          {/* 数量控制 */}
                          <View className="flex items-center gap-1.5">
                            {quantity > 0 ? (
                              <>
                                <View
                                  className="w-7 h-7 rounded-full bg-stone-100 flex items-center justify-center active:bg-stone-200"
                                  onClick={() => handleDecrease(dish.id)}
                                >
                                  <Minus size={14} color="#78716C" />
                                </View>
                                <Text className="text-base font-semibold text-stone-800 w-6 text-center">
                                  {quantity}
                                </Text>
                              </>
                            ) : null}
                            <View
                              className="w-7 h-7 rounded-full bg-orange-500 flex items-center justify-center active:bg-orange-600"
                              onClick={() => handleAdd(dish)}
                            >
                              <Plus size={14} color="#FFFFFF" />
                            </View>
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                )
              })
            )}
          </View>
          
          {/* 底部安全区域 */}
          <View className="h-20" />
        </ScrollView>
      </View>
    </View>
  )
}

export default IndexPage
