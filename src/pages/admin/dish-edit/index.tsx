import { View, Text, Input, Textarea, Image, Switch } from '@tarojs/components'
import { useState } from 'react'
import Taro, { useLoad } from '@tarojs/taro'
import { Network } from '@/network'

interface Category {
  id: string
  name: string
}

const DishEditPage = () => {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [dishId, setDishId] = useState<string>('')
  
  const [formData, setFormData] = useState({
    name: '',
    categoryId: '',
    description: '',
    image: '',
    price: '',
    originalPrice: '',
    tags: '',
    isAvailable: true,
    sortOrder: '0'
  })

  useLoad((options) => {
    if (options?.id) {
      setDishId(options.id as string)
      fetchDish(options.id as string)
    } else if (options?.categoryId) {
      setFormData(prev => ({ ...prev, categoryId: options.categoryId as string }))
    }
    fetchCategories()
  })

  const fetchCategories = async () => {
    try {
      const res = await Network.request<{ code: number; msg: string; data: Category[] }>({
        url: '/api/categories',
        method: 'GET'
      })
      if (res.data?.data) {
        setCategories(res.data.data)
      }
    } catch (error) {
      console.error('获取分类失败:', error)
    }
  }

  const fetchDish = async (id: string) => {
    try {
      setLoading(true)
      const res = await Network.request<{ code: number; msg: string; data: any }>({
        url: `/api/dishes/${id}`,
        method: 'GET'
      })
      
      if (res.data?.data) {
        const dish = res.data.data
        setFormData({
          name: dish.name || '',
          categoryId: dish.category_id || '',
          description: dish.description || '',
          image: dish.image || '',
          price: dish.price?.toString() || '',
          originalPrice: dish.original_price?.toString() || '',
          tags: dish.tags?.join(',') || '',
          isAvailable: dish.is_available ?? true,
          sortOrder: dish.sort_order?.toString() || '0'
        })
      }
    } catch (error) {
      console.error('获取菜品详情失败:', error)
      Taro.showToast({ title: '获取菜品详情失败', icon: 'none' })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (!formData.name) {
      Taro.showToast({ title: '请输入菜品名称', icon: 'none' })
      return
    }
    if (!formData.categoryId) {
      Taro.showToast({ title: '请选择分类', icon: 'none' })
      return
    }
    if (!formData.price) {
      Taro.showToast({ title: '请输入价格', icon: 'none' })
      return
    }

    try {
      setLoading(true)
      
      const data = {
        name: formData.name,
        categoryId: formData.categoryId,
        description: formData.description,
        image: formData.image,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : [],
        isAvailable: formData.isAvailable,
        sortOrder: parseInt(formData.sortOrder) || 0
      }

      let result
      if (dishId) {
        result = await Network.request({
          url: `/api/dishes/${dishId}`,
          method: 'PUT',
          data
        })
      } else {
        result = await Network.request({
          url: '/api/dishes',
          method: 'POST',
          data
        })
      }

      if (result.data?.code === 200) {
        Taro.showToast({
          title: dishId ? '修改成功' : '添加成功',
          icon: 'success'
        })
        setTimeout(() => {
          Taro.navigateBack()
        }, 1500)
      } else {
        Taro.showToast({
          title: result.data?.msg || '操作失败',
          icon: 'none'
        })
      }
    } catch (error) {
      console.error('保存菜品失败:', error)
      Taro.showToast({ title: '保存失败', icon: 'none' })
    } finally {
      setLoading(false)
    }
  }

  const handleCategoryChange = () => {
    const categoryNames = categories.map(c => c.name)
    const categoryIdArray = categories.map(c => c.id)
    
    Taro.showActionSheet({
      itemList: categoryNames,
      success: (res) => {
        setFormData(prev => ({
          ...prev,
          categoryId: categoryIdArray[res.tapIndex]
        }))
      }
    })
  }

  const getSelectedCategoryName = () => {
    const category = categories.find(c => c.id === formData.categoryId)
    return category?.name || '请选择分类'
  }

  return (
    <View className="flex flex-col h-screen bg-stone-50">
      {/* 顶部标题栏 */}
      <View className="px-4 py-4 bg-white border-b border-stone-200">
        <View className="flex justify-between items-center">
          <Text className="text-lg font-bold text-stone-800">
            {dishId ? '编辑菜品' : '添加菜品'}
          </Text>
          <View
            className="px-4 py-2 bg-orange-500 rounded-lg"
            onClick={handleSubmit}
          >
            <Text className="text-white text-sm font-medium">保存</Text>
          </View>
        </View>
      </View>

      {/* 表单内容 */}
      <View className="flex-1 p-4">
        {/* 菜品名称 */}
        <View className="bg-white rounded-xl p-4 mb-4">
          <Text className="block text-sm text-stone-500 mb-2">菜品名称 *</Text>
          <Input
            className="w-full text-stone-800"
            placeholder="请输入菜品名称"
            value={formData.name}
            onInput={(e) => setFormData(prev => ({ ...prev, name: e.detail.value }))}
          />
        </View>

        {/* 所属分类 */}
        <View className="bg-white rounded-xl p-4 mb-4" onClick={handleCategoryChange}>
          <Text className="block text-sm text-stone-500 mb-2">所属分类 *</Text>
          <View className="flex justify-between items-center">
            <Text className={`text-base ${formData.categoryId ? 'text-stone-800' : 'text-stone-400'}`}>
              {getSelectedCategoryName()}
            </Text>
            <Text className="text-stone-400 text-xs">{">"}</Text>
          </View>
        </View>

        {/* 价格 */}
        <View className="bg-white rounded-xl p-4 mb-4">
          <Text className="block text-sm text-stone-500 mb-2">价格 *</Text>
          <View className="flex items-center gap-2">
            <Text className="text-stone-400">¥</Text>
            <Input
              className="flex-1 text-stone-800"
              type="digit"
              placeholder="请输入价格"
              value={formData.price}
              onInput={(e) => setFormData(prev => ({ ...prev, price: e.detail.value }))}
            />
          </View>
        </View>

        {/* 原价 */}
        <View className="bg-white rounded-xl p-4 mb-4">
          <Text className="block text-sm text-stone-500 mb-2">原价（可选）</Text>
          <View className="flex items-center gap-2">
            <Text className="text-stone-400">¥</Text>
            <Input
              className="flex-1 text-stone-800"
              type="digit"
              placeholder="请输入原价"
              value={formData.originalPrice}
              onInput={(e) => setFormData(prev => ({ ...prev, originalPrice: e.detail.value }))}
            />
          </View>
        </View>

        {/* 描述 */}
        <View className="bg-white rounded-xl p-4 mb-4">
          <Text className="block text-sm text-stone-500 mb-2">菜品描述</Text>
          <Textarea
            className="w-full text-stone-800"
            placeholder="请输入菜品描述"
            value={formData.description}
            onInput={(e) => setFormData(prev => ({ ...prev, description: e.detail.value }))}
            style={{ minHeight: '80px' }}
          />
        </View>

        {/* 图片链接 */}
        <View className="bg-white rounded-xl p-4 mb-4">
          <Text className="block text-sm text-stone-500 mb-2">图片链接</Text>
          <Input
            className="w-full text-stone-800"
            placeholder="请输入图片URL"
            value={formData.image}
            onInput={(e) => setFormData(prev => ({ ...prev, image: e.detail.value }))}
          />
          {formData.image && (
            <Image
              className="w-full h-32 mt-2 rounded-lg bg-stone-100"
              src={formData.image}
              mode="aspectFill"
            />
          )}
        </View>

        {/* 标签 */}
        <View className="bg-white rounded-xl p-4 mb-4">
          <Text className="block text-sm text-stone-500 mb-2">标签（逗号分隔）</Text>
          <Input
            className="w-full text-stone-800"
            placeholder="如：热卖,推荐,辣"
            value={formData.tags}
            onInput={(e) => setFormData(prev => ({ ...prev, tags: e.detail.value }))}
          />
        </View>

        {/* 上架状态 */}
        <View className="bg-white rounded-xl p-4 mb-4">
          <View className="flex justify-between items-center">
            <Text className="text-sm text-stone-500">上架状态</Text>
            <Switch
              checked={formData.isAvailable}
              onChange={(e) => setFormData(prev => ({ ...prev, isAvailable: e.detail.value }))}
              color="#FF6B35"
            />
          </View>
        </View>

        {/* 排序 */}
        <View className="bg-white rounded-xl p-4 mb-4">
          <Text className="block text-sm text-stone-500 mb-2">排序（数字越小越靠前）</Text>
          <Input
            className="w-full text-stone-800"
            type="number"
            placeholder="0"
            value={formData.sortOrder}
            onInput={(e) => setFormData(prev => ({ ...prev, sortOrder: e.detail.value }))}
          />
        </View>
      </View>
    </View>
  )
}

export default DishEditPage
