import { View, Text } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'
import Taro from '@tarojs/taro'
import { User, Settings, Phone, Info, Shield } from 'lucide-react-taro'

const ProfilePage = () => {
  useLoad(() => {
    console.log('个人中心页面加载')
  })

  const handleNavigateToAdmin = () => {
    Taro.navigateTo({
      url: '/pages/admin/index'
    })
  }

  return (
    <View className="flex flex-col h-screen bg-stone-50">
      {/* 顶部用户信息 */}
      <View className="bg-orange-500 px-4 pt-12 pb-8">
        <View className="flex items-center gap-4">
          <View className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
            <User size={32} color="#FFFFFF" />
          </View>
          <View>
            <Text className="block text-xl font-bold text-white">欢迎使用</Text>
            <Text className="block text-sm text-white/80 mt-1">美味餐厅点菜系统</Text>
          </View>
        </View>
      </View>

      {/* 功能列表 */}
      <View className="flex-1 bg-stone-50 px-4 py-4">
        <View className="bg-white rounded-2xl shadow-sm">
          {/* 菜品管理入口 */}
          <View 
            className="flex items-center justify-between px-4 py-4 border-b border-stone-100"
            onClick={handleNavigateToAdmin}
          >
            <View className="flex items-center gap-3">
              <Shield size={20} color="#FF6B35" />
              <Text className="text-sm text-stone-800 font-medium">菜品管理</Text>
            </View>
            <Text className="text-stone-400 text-xs">{">"}</Text>
          </View>

          <View className="flex items-center justify-between px-4 py-4 border-b border-stone-100">
            <View className="flex items-center gap-3">
              <Phone size={20} color="#636E72" />
              <Text className="text-sm text-stone-800">联系商家</Text>
            </View>
            <Text className="text-stone-400 text-xs">{">"}</Text>
          </View>

          <View className="flex items-center justify-between px-4 py-4 border-b border-stone-100">
            <View className="flex items-center gap-3">
              <Info size={20} color="#636E72" />
              <Text className="text-sm text-stone-800">关于我们</Text>
            </View>
            <Text className="text-stone-400 text-xs">{">"}</Text>
          </View>

          <View className="flex items-center justify-between px-4 py-4">
            <View className="flex items-center gap-3">
              <Settings size={20} color="#636E72" />
              <Text className="text-sm text-stone-800">设置</Text>
            </View>
            <Text className="text-stone-400 text-xs">{">"}</Text>
          </View>
        </View>

        {/* 版本信息 */}
        <View className="mt-8 text-center">
          <Text className="text-xs text-stone-400">版本 1.0.0</Text>
        </View>
      </View>
    </View>
  )
}

export default ProfilePage
