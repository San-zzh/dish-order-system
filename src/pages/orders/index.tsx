import { View, Text, ScrollView } from '@tarojs/components'
import { useState } from 'react'
import Taro, { useLoad, useDidShow } from '@tarojs/taro'
import { Network } from '@/network'
import { ClipboardList, Clock } from 'lucide-react-taro'

interface OrderItem {
  dishId: string
  dishName: string
  dishPrice: number
  quantity: number
  subtotal: number
}

interface Order {
  id: string
  orderNumber: string
  tableNumber?: string
  totalAmount: number
  remark?: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  createdAt: string
  items: OrderItem[]
}

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useLoad(() => {
    fetchOrders()
  })

  useDidShow(() => {
    fetchOrders()
  })

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const res = await Network.request<{ code: number; msg: string; data: Order[] }>({
        url: '/api/orders',
        method: 'GET'
      })
      console.log('订单列表:', res.data)
      if (res.data?.data) {
        setOrders(res.data.data)
      }
    } catch (error) {
      console.error('获取订单列表失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return '待确认'
      case 'confirmed':
        return '已确认'
      case 'completed':
        return '已完成'
      case 'cancelled':
        return '已取消'
      default:
        return status
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600'
      case 'confirmed':
        return 'text-blue-600'
      case 'completed':
        return 'text-green-600'
      case 'cancelled':
        return 'text-stone-400'
      default:
        return 'text-stone-600'
    }
  }

  const formatTime = (time: string) => {
    const date = new Date(time)
    return `${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
  }

  const handleViewDetail = (order: Order) => {
    // 跳转到订单详情页面
    Taro.navigateTo({
      url: `/pages/orders/detail?id=${order.id}`
    })
  }

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
        <Text className="block text-lg font-bold text-stone-800">我的订单</Text>
      </View>

      {/* 订单列表 */}
      <ScrollView scrollY className="flex-1 bg-stone-50">
        <View className="p-4">
          {orders.length === 0 ? (
            <View className="flex flex-col items-center justify-center py-16">
              <ClipboardList size={64} color="#E5E5E5" />
              <Text className="block text-stone-400 text-sm mt-4">暂无订单</Text>
              <Text className="block text-stone-400 text-xs mt-2">快去点菜吧</Text>
            </View>
          ) : (
            orders.map((order) => (
              <View
                key={order.id}
                className="bg-white rounded-2xl p-4 mb-3 shadow-sm"
                onClick={() => handleViewDetail(order)}
              >
                {/* 订单头部 */}
                <View className="flex justify-between items-start mb-3">
                  <View className="flex items-center gap-2">
                    <Clock size={16} color="#636E72" />
                    <Text className="block text-sm font-medium text-stone-800">
                      {order.orderNumber}
                    </Text>
                  </View>
                  <Text className={`text-sm font-medium ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </Text>
                </View>

                {/* 订单时间 */}
                <View className="mb-3">
                  <Text className="block text-xs text-stone-500">
                    {formatTime(order.createdAt)}
                  </Text>
                  {order.tableNumber && (
                    <Text className="block text-xs text-stone-500">
                      {order.tableNumber}号桌
                    </Text>
                  )}
                </View>

                {/* 菜品摘要 */}
                <View className="mb-3">
                  <Text className="block text-xs text-stone-500 line-clamp-1">
                    {order.items.map(item => `${item.dishName} x${item.quantity}`).join('、')}
                  </Text>
                </View>

                {/* 订单金额 */}
                <View className="pt-3 border-t border-stone-100 flex justify-between items-center">
                  <Text className="text-sm text-stone-600">
                    共 {order.items.reduce((sum, item) => sum + item.quantity, 0)} 件
                  </Text>
                  <Text className="text-lg font-bold text-orange-500">
                    ¥{order.totalAmount}
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  )
}

export default OrdersPage
