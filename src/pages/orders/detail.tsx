import { View, Text, ScrollView } from '@tarojs/components'
import { useState } from 'react'
import Taro, { useLoad } from '@tarojs/taro'
import { Network } from '@/network'
import { ArrowLeft, Clock, Utensils } from 'lucide-react-taro'

interface OrderItem {
  dishId: string
  dishName: string
  dishPrice: number
  quantity: number
  subtotal: number
  remark?: string
}

interface Order {
  id: string
  orderNumber: string
  tableNumber?: string
  customerName?: string
  customerPhone?: string
  totalAmount: number
  remark?: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  createdAt: string
  items: OrderItem[]
}

const OrderDetailPage = () => {
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useLoad((options) => {
    if (options?.id) {
      fetchOrderDetail(options.id as string)
    }
  })

  const fetchOrderDetail = async (orderId: string) => {
    try {
      setLoading(true)
      const res = await Network.request<{ code: number; msg: string; data: Order }>({
        url: `/api/orders/${orderId}`,
        method: 'GET'
      })
      console.log('订单详情:', res.data)
      if (res.data?.data) {
        setOrder(res.data.data)
      }
    } catch (error) {
      console.error('获取订单详情失败:', error)
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
        return 'text-yellow-600 bg-yellow-50'
      case 'confirmed':
        return 'text-blue-600 bg-blue-50'
      case 'completed':
        return 'text-green-600 bg-green-50'
      case 'cancelled':
        return 'text-stone-400 bg-stone-100'
      default:
        return 'text-stone-600 bg-stone-100'
    }
  }

  const formatTime = (time: string) => {
    const date = new Date(time)
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
  }

  const handleBack = () => {
    Taro.navigateBack()
  }

  if (loading) {
    return (
      <View className="flex items-center justify-center h-screen bg-stone-50">
        <Text className="text-stone-500 text-sm">加载中...</Text>
      </View>
    )
  }

  if (!order) {
    return (
      <View className="flex items-center justify-center h-screen bg-stone-50">
        <Text className="text-stone-500 text-sm">订单不存在</Text>
      </View>
    )
  }

  return (
    <View className="flex flex-col h-screen bg-stone-50">
      {/* 顶部导航栏 */}
      <View className="px-4 py-4 bg-white flex items-center gap-3">
        <View onClick={handleBack}>
          <ArrowLeft size={24} color="#2D3436" />
        </View>
        <Text className="block text-lg font-bold text-stone-800">订单详情</Text>
      </View>

      {/* 订单内容 */}
      <ScrollView scrollY className="flex-1 bg-stone-50">
        <View className="p-4">
          {/* 订单状态 */}
          <View className="bg-white rounded-2xl p-4 mb-3 shadow-sm">
            <View className="flex items-center justify-between mb-3">
              <Text className="block text-base font-medium text-stone-800">
                {order.orderNumber}
              </Text>
              <View className={`px-3 py-1 rounded-full ${getStatusColor(order.status)}`}>
                <Text className="text-sm font-medium">
                  {getStatusText(order.status)}
                </Text>
              </View>
            </View>
            <View className="flex items-center gap-2 text-stone-500">
              <Clock size={14} />
              <Text className="text-xs">
                {formatTime(order.createdAt)}
              </Text>
            </View>
            {order.tableNumber && (
              <View className="flex items-center gap-2 text-stone-500 mt-1">
                <Utensils size={14} />
                <Text className="text-xs">
                  {order.tableNumber}号桌
                </Text>
              </View>
            )}
          </View>

          {/* 菜品清单 */}
          <View className="bg-white rounded-2xl p-4 mb-3 shadow-sm">
            <Text className="block text-base font-medium text-stone-800 mb-3">菜品清单</Text>
            {order.items.map((item, index) => (
              <View key={index} className="flex justify-between items-start py-3 border-b border-stone-100 last:border-0">
                <View className="flex-1">
                  <Text className="block text-sm font-medium text-stone-800">
                    {item.dishName}
                  </Text>
                  {item.remark && (
                    <Text className="block text-xs text-stone-500 mt-1">
                      备注: {item.remark}
                    </Text>
                  )}
                  <Text className="block text-xs text-stone-500 mt-1">
                    ¥{item.dishPrice} × {item.quantity}
                  </Text>
                </View>
                <Text className="text-sm font-medium text-orange-500">
                  ¥{item.subtotal}
                </Text>
              </View>
            ))}
          </View>

          {/* 订单信息 */}
          <View className="bg-white rounded-2xl p-4 mb-3 shadow-sm">
            <Text className="block text-base font-medium text-stone-800 mb-3">订单信息</Text>
            {order.customerName && (
              <View className="flex justify-between py-2 border-b border-stone-100">
                <Text className="text-sm text-stone-500">联系人</Text>
                <Text className="text-sm text-stone-800">{order.customerName}</Text>
              </View>
            )}
            {order.customerPhone && (
              <View className="flex justify-between py-2 border-b border-stone-100">
                <Text className="text-sm text-stone-500">电话</Text>
                <Text className="text-sm text-stone-800">{order.customerPhone}</Text>
              </View>
            )}
            {order.remark && (
              <View className="py-2">
                <Text className="text-sm text-stone-500 mb-1">备注</Text>
                <Text className="text-sm text-stone-800">{order.remark}</Text>
              </View>
            )}
          </View>

          {/* 金额信息 */}
          <View className="bg-white rounded-2xl p-4 shadow-sm">
            <View className="flex justify-between items-center py-2">
              <Text className="text-sm text-stone-500">商品数量</Text>
              <Text className="text-sm text-stone-800">
                {order.items.reduce((sum, item) => sum + item.quantity, 0)} 件
              </Text>
            </View>
            <View className="flex justify-between items-center py-2 border-t border-stone-100">
              <Text className="text-lg font-bold text-stone-800">合计</Text>
              <Text className="text-2xl font-bold text-orange-500">
                ¥{order.totalAmount}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

export default OrderDetailPage
