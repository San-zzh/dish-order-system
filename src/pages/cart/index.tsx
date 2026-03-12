import { View, Text, Image, ScrollView } from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'
import { useCartStore } from '@/stores/cart'
import { Minus, Plus, Trash2 } from 'lucide-react-taro'
import { Network } from '@/network'

const CartPage = () => {
  const { items, updateQuantity, removeItem, clearCart, getTotalPrice, getTotalItems } = useCartStore()

  useLoad(() => {
    console.log('购物车页面加载')
  })

  const handleIncrease = (dishId: string) => {
    const item = items.find(i => i.dishId === dishId)
    if (item) {
      updateQuantity(dishId, item.quantity + 1)
    }
  }

  const handleDecrease = (dishId: string) => {
    const item = items.find(i => i.dishId === dishId)
    if (item && item.quantity > 0) {
      updateQuantity(dishId, item.quantity - 1)
    }
  }

  const handleRemove = (dishId: string) => {
    removeItem(dishId)
  }

  const handleClearCart = () => {
    if (items.length === 0) return
    Taro.showModal({
      title: '提示',
      content: '确定要清空购物车吗？',
      success: (res) => {
        if (res.confirm) {
          clearCart()
        }
      }
    })
  }

  const handleSubmitOrder = async () => {
    if (items.length === 0) {
      Taro.showToast({
        title: '购物车是空的',
        icon: 'none'
      })
      return
    }

    try {
      const orderItems = items.map(item => ({
        dishId: item.dishId,
        dishName: item.dishName,
        dishPrice: item.dishPrice,
        quantity: item.quantity,
        subtotal: item.dishPrice * item.quantity
      }))

      const totalAmount = getTotalPrice()

      const res = await Network.request({
        url: '/api/orders',
        method: 'POST',
        data: {
          totalAmount,
          items: orderItems
        }
      })

      console.log('提交订单:', res.data)

      if (res.data?.code === 200) {
        Taro.showToast({
          title: '订单提交成功',
          icon: 'success'
        })
        clearCart()
        setTimeout(() => {
          Taro.switchTab({ url: '/pages/orders/index' })
        }, 1500)
      } else {
        Taro.showToast({
          title: res.data?.msg || '订单提交失败',
          icon: 'none'
        })
      }
    } catch (error) {
      console.error('提交订单失败:', error)
      Taro.showToast({
        title: '网络错误，请重试',
        icon: 'none'
      })
    }
  }

  if (items.length === 0) {
    return (
      <View className="flex flex-col h-screen bg-stone-50">
        <View className="flex flex-col items-center justify-center flex-1">
          <View className="w-32 h-32 rounded-full bg-stone-100 flex items-center justify-center mb-4">
            <Trash2 size={64} color="#E5E5E5" />
          </View>
          <Text className="block text-stone-400 text-sm mb-2">购物车是空的</Text>
          <Text className="block text-stone-400 text-xs">快去选择心仪的菜品吧</Text>
        </View>
      </View>
    )
  }

  return (
    <View className="flex flex-col h-screen bg-stone-50">
      {/* 顶部标题栏 */}
      <View className="px-4 py-4 bg-white flex justify-between items-center">
        <Text className="block text-lg font-bold text-stone-800">购物车</Text>
        <View
          className="px-3 py-1 bg-stone-100 rounded-full"
          onClick={handleClearCart}
        >
          <Text className="text-xs text-stone-600">清空</Text>
        </View>
      </View>

      {/* 购物车列表 */}
      <ScrollView scrollY className="flex-1 bg-stone-50">
        <View className="p-4">
          {items.map((item) => (
            <View key={item.dishId} className="bg-white rounded-2xl p-4 mb-3 shadow-sm">
              <View className="flex gap-3">
                {/* 菜品图片 */}
                <Image
                  className="w-20 h-20 rounded-xl bg-stone-100"
                  src={item.image || 'https://via.placeholder.com/80?text=菜品'}
                  mode="aspectFill"
                />

                {/* 菜品信息 */}
                <View className="flex-1 flex flex-col justify-between">
                  <View>
                    <Text className="block text-sm font-medium text-stone-800 mb-1">
                      {item.dishName}
                    </Text>
                    <Text className="block text-orange-500 font-bold">
                      ¥{item.dishPrice}
                    </Text>
                  </View>

                  {/* 加减按钮 */}
                  <View className="flex justify-between items-end">
                    <View className="flex items-center gap-2">
                      <View
                        className="w-7 h-7 rounded-full bg-stone-100 flex items-center justify-center"
                        onClick={() => handleDecrease(item.dishId)}
                      >
                        <Minus size={14} color="#636E72" />
                      </View>
                      <Text className="text-base font-medium text-stone-800 w-6 text-center">
                        {item.quantity}
                      </Text>
                      <View
                        className="w-7 h-7 rounded-full bg-orange-500 flex items-center justify-center"
                        onClick={() => handleIncrease(item.dishId)}
                      >
                        <Plus size={14} color="#FFFFFF" />
                      </View>
                    </View>

                    <View
                      className="px-2 py-1"
                      onClick={() => handleRemove(item.dishId)}
                    >
                      <Trash2 size={16} color="#E5E5E5" />
                    </View>
                  </View>
                </View>
              </View>

              {/* 小计 */}
              <View className="mt-3 pt-3 border-t border-stone-100 flex justify-end">
                <Text className="text-sm text-stone-600">
                  小计: <Text className="text-orange-500 font-bold">¥{item.dishPrice * item.quantity}</Text>
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* 底部结算栏 */}
      <View className="bg-white px-4 py-3 border-t border-stone-100">
        <View className="flex items-center justify-between">
          <View className="flex items-baseline gap-2">
            <Text className="text-sm text-stone-600">合计:</Text>
            <Text className="text-2xl font-bold text-orange-500">¥{getTotalPrice()}</Text>
            <Text className="text-xs text-stone-400">共 {getTotalItems()} 件</Text>
          </View>
          <View
            className="px-8 py-3 bg-orange-500 rounded-full"
            onClick={handleSubmitOrder}
          >
            <Text className="text-white font-medium">提交订单</Text>
          </View>
        </View>
      </View>
    </View>
  )
}

export default CartPage
