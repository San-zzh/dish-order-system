import { View, Text, ScrollView, Image } from '@tarojs/components'
import { useState } from 'react'
import Taro, { useLoad, useDidShow } from '@tarojs/taro'
import { Network } from '@/network'
import { Plus, Pencil, Trash2, Settings } from 'lucide-react-taro'

interface Category {
  id: string
  name: string
  description?: string
  sort_order: number
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

const AdminPage = () => {
  const [categories, setCategories] = useState<Category[]>([])
  const [dishes, setDishes] = useState<Dish[]>([])
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useLoad(() => {
    fetchData()
  })

  useDidShow(() => {
    fetchData()
  })

  const fetchData = async () => {
    try {
      setLoading(true)

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

      if (categoriesRes.data?.data) {
        setCategories(categoriesRes.data.data)
        if (categoriesRes.data.data.length > 0 && !selectedCategoryId) {
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

  const handleAddDish = () => {
    Taro.navigateTo({
      url: `/pages/admin/dish-edit/index?categoryId=${selectedCategoryId}`
    })
  }

  const handleEditDish = (dish: Dish) => {
    Taro.navigateTo({
      url: `/pages/admin/dish-edit/index?id=${dish.id}`
    })
  }

  const handleDeleteDish = (dish: Dish) => {
    Taro.showModal({
      title: '确认删除',
      content: `确定要删除「${dish.name}」吗？`,
      success: async (res) => {
        if (res.confirm) {
          try {
            const result = await Network.request({
              url: `/api/dishes/${dish.id}`,
              method: 'DELETE'
            })

            if (result.data?.code === 200) {
              Taro.showToast({ title: '删除成功', icon: 'success' })
              fetchData()
            } else {
              Taro.showToast({ title: result.data?.msg || '删除失败', icon: 'none' })
            }
          } catch (error) {
            Taro.showToast({ title: '删除失败', icon: 'none' })
          }
        }
      }
    })
  }

  const handleAddCategory = () => {
    Taro.showModal({
      title: '添加分类',
      editable: true,
      placeholderText: '请输入分类名称',
      success: async (res) => {
        if (res.confirm && res.content) {
          try {
            const result = await Network.request({
              url: '/api/categories',
              method: 'POST',
              data: { name: res.content }
            })

            if (result.data?.code === 200) {
              Taro.showToast({ title: '添加成功', icon: 'success' })
              fetchData()
            } else {
              Taro.showToast({ title: result.data?.msg || '添加失败', icon: 'none' })
            }
          } catch (error) {
            Taro.showToast({ title: '添加失败', icon: 'none' })
          }
        }
      }
    })
  }

  const filteredDishes = dishes.filter(dish => dish.category_id === selectedCategoryId)

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
      <View className="px-4 py-4 bg-white border-b border-stone-200">
        <View className="flex justify-between items-center">
          <Text className="text-lg font-bold text-stone-800">菜品管理</Text>
          <View className="flex gap-2">
            <View
              className="px-3 py-1.5 bg-stone-100 rounded-lg"
              onClick={handleAddCategory}
            >
              <Text className="text-xs text-stone-600">添加分类</Text>
            </View>
          </View>
        </View>
      </View>

      {/* 主体内容 */}
      <View className="flex-1 flex overflow-hidden">
        {/* 左侧分类导航 */}
        <ScrollView scrollY className="w-24 bg-stone-100">
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
        <ScrollView scrollY className="flex-1 bg-white">
          <View className="p-4">
            {/* 添加菜品按钮 */}
            <View
              className="bg-orange-500 rounded-xl p-4 mb-4 flex items-center justify-center"
              onClick={handleAddDish}
            >
              <Plus size={20} color="#FFFFFF" />
              <Text className="text-white font-medium ml-2">添加菜品</Text>
            </View>

            {filteredDishes.length === 0 ? (
              <View className="flex flex-col items-center justify-center py-12">
                <Settings size={48} color="#E5E5E5" />
                <Text className="block text-stone-400 text-sm mt-3">暂无菜品</Text>
              </View>
            ) : (
              filteredDishes.map((dish) => (
                <View key={dish.id} className="bg-stone-50 rounded-2xl p-4 mb-3">
                  <View className="flex gap-3">
                    {/* 菜品图片 */}
                    <Image
                      className="w-20 h-20 rounded-xl bg-stone-200"
                      src={dish.image || 'https://via.placeholder.com/80?text=菜品'}
                      mode="aspectFill"
                    />

                    {/* 菜品信息 */}
                    <View className="flex-1">
                      <View className="flex justify-between items-start">
                        <Text className="block text-base font-medium text-stone-800 flex-1">
                          {dish.name}
                        </Text>
                        <Text className={`text-xs px-2 py-0.5 rounded ${
                          dish.is_available ? 'bg-green-100 text-green-600' : 'bg-stone-200 text-stone-500'
                        }`}>
                          {dish.is_available ? '上架' : '下架'}
                        </Text>
                      </View>

                      <Text className="block text-sm text-stone-500 mt-1 line-clamp-1">
                        {dish.description}
                      </Text>

                      <View className="flex items-baseline gap-1 mt-1">
                        <Text className="text-orange-500 font-bold">¥{dish.price}</Text>
                        {dish.original_price && (
                          <Text className="text-stone-400 text-xs line-through">
                            ¥{dish.original_price}
                          </Text>
                        )}
                      </View>

                      {/* 操作按钮 */}
                      <View className="flex gap-2 mt-3">
                        <View
                          className="px-3 py-1.5 bg-blue-500 rounded-lg flex items-center"
                          onClick={() => handleEditDish(dish)}
                        >
                          <Pencil size={14} color="#FFFFFF" />
                          <Text className="text-white text-xs ml-1">编辑</Text>
                        </View>
                        <View
                          className="px-3 py-1.5 bg-red-500 rounded-lg flex items-center"
                          onClick={() => handleDeleteDish(dish)}
                        >
                          <Trash2 size={14} color="#FFFFFF" />
                          <Text className="text-white text-xs ml-1">删除</Text>
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

export default AdminPage
