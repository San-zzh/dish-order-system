import { View, Text, Image, ScrollView } from '@tarojs/components'
import { useState } from 'react'
import { useLoad } from '@tarojs/taro'
import { Network } from '@/network'
import { useCartStore } from '@/stores/cart'
import { Utensils, Plus, Minus } from 'lucide-react-taro'

interface Category {
  id: string
  name: string
  icon?: string
}

interface Dish {
  id: string
  categoryId: string
  name: string
  description?: string
  image?: string
  price: number
  originalPrice?: number
  tags?: string[]
  isAvailable: boolean
  salesCount: number
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

      // 获取分类列表
      const categoriesRes = await Network.request<{ code: number; msg: string; data: Category[] }>({
        url: '/api/categories',
        method: 'GET'
      })
      console.log('分类列表:', categoriesRes.data)
      if (categoriesRes.data?.data) {
        setCategories(categoriesRes.data.data)
        if (categoriesRes.data.data.length > 0) {
          setSelectedCategoryId(categoriesRes.data.data[0].id)
        }
      }

      // 获取菜品列表
      const dishesRes = await Network.request<{ code: number; msg: string; data: Dish[] }>({
        url: '/api/dishes',
        method: 'GET'
      })
      console.log('菜品列表:', dishesRes.data)
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

  const filteredDishes = dishes.filter(dish => dish.categoryId === selectedCategoryId)

  if (loading) {
    return (
      <View className="flex items-center justify-center h-screen bg-stone-50">
        <Text className="text-stone-500 text-sm">加载中...</Text>
      </View>
    )
  }

  return (
    <View className="flex flex-col h-screen bg-stone-50">
      {/* 顶部标题栏 */}
      <View className="px-4 py-4 bg-white">
        <Text className="block text-xl font-bold text-stone-800">美味餐厅</Text>
        <Text className="block text-xs text-stone-500 mt-1">欢迎光临，请选择菜品</Text>
      </View>

      {/* 主体内容 */}
      <View className="flex-1 flex overflow-hidden">
        {/* 左侧分类导航 */}
        <ScrollView
          scrollY
          className="w-24 bg-stone-100"
        >
          <View className="flex flex-col py-2">
            {categories.map((category) => (
              <View
                key={category.id}
                className={`px-2 py-4 mx-2 rounded-lg text-center ${
                  selectedCategoryId === category.id
                    ? 'bg-orange-500 text-white'
                    : 'bg-white text-stone-600'
                }`}
                onClick={() => setSelectedCategoryId(category.id)}
              >
                <Text className="block text-xs font-medium">{category.name}</Text>
              </View>
            ))}
          </View>
        </ScrollView>

        {/* 右侧菜品列表 */}
        <ScrollView
          scrollY
          className="flex-1 bg-white"
        >
          <View className="p-4">
            {filteredDishes.length === 0 ? (
              <View className="flex flex-col items-center justify-center py-12">
                <Utensils size={48} color="#E5E5E5" />
                <Text className="block text-stone-400 text-sm mt-3">暂无菜品</Text>
              </View>
            ) : (
              filteredDishes.map((dish) => (
                <View key={dish.id} className="bg-white rounded-2xl p-4 mb-3 shadow-sm">
                  <View className="flex gap-3">
                    {/* 菜品图片 */}
                    <Image
                      className="w-28 h-28 rounded-xl bg-stone-100"
                      src={dish.image || 'https://via.placeholder.com/112?text=菜品'}
                      mode="aspectFill"
                    />

                    {/* 菜品信息 */}
                    <View className="flex-1 flex flex-col justify-between">
                      <View>
                        <Text className="block text-base font-medium text-stone-800 mb-1">
                          {dish.name}
                        </Text>
                        {dish.description && (
                          <Text className="block text-xs text-stone-500 line-clamp-2 mb-2">
                            {dish.description}
                          </Text>
                        )}
                        {/* 标签 */}
                        {dish.tags && dish.tags.length > 0 && (
                          <View className="flex gap-1 flex-wrap">
                            {dish.tags.map((tag, index) => (
                              <View
                                key={index}
                                className={`px-2 py-0.5 rounded text-xs text-white ${
                                  tag === '热卖' ? 'bg-yellow-400' :
                                  tag === '辣' ? 'bg-red-400' :
                                  tag === '新品' ? 'bg-blue-400' : 'bg-stone-400'
                                }`}
                              >
                                {tag}
                              </View>
                            ))}
                          </View>
                        )}
                      </View>

                      {/* 价格和数量 */}
                      <View className="flex justify-between items-end mt-2">
                        <View className="flex items-baseline gap-1">
                          <Text className="text-orange-500 font-bold text-lg">
                            ¥{dish.price}
                          </Text>
                          {dish.originalPrice && (
                            <Text className="text-stone-400 text-xs line-through">
                              ¥{dish.originalPrice}
                            </Text>
                          )}
                          <Text className="text-stone-400 text-xs ml-1">
                            已售 {dish.salesCount}
                          </Text>
                        </View>

                        {/* 加减按钮 */}
                        <View className="flex items-center gap-2">
                          {getDishQuantity(dish.id) > 0 ? (
                            <>
                              <View
                                className="w-7 h-7 rounded-full bg-stone-100 flex items-center justify-center"
                                onClick={() => handleDecrease(dish.id)}
                              >
                                <Minus size={14} color="#636E72" />
                              </View>
                              <Text className="text-base font-medium text-stone-800 w-6 text-center">
                                {getDishQuantity(dish.id)}
                              </Text>
                            </>
                          ) : null}
                          <View
                            className="w-7 h-7 rounded-full bg-orange-500 flex items-center justify-center"
                            onClick={() => handleAdd(dish)}
                          >
                            <Plus size={14} color="#FFFFFF" />
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              ))
            )}
          </View>
        </ScrollView>
      </View>
    </View>
  )
}

export default IndexPage
