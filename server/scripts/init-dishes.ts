import { getSupabaseClient } from '../src/storage/database/supabase-client';

async function initDishes() {
  const client = getSupabaseClient();

  // 创建分类
  const categories = [
    { name: '热菜', description: '经典热菜', icon: 'flame', sort_order: 1 },
    { name: '日式料理', description: '精致日料', icon: 'utensils', sort_order: 2 },
    { name: '海鲜', description: '新鲜海鲜', icon: 'fish', sort_order: 3 },
  ];

  console.log('正在创建分类...');
  const { data: categoriesData, error: categoriesError } = await client
    .from('categories')
    .insert(categories)
    .select();

  if (categoriesError) {
    console.error('创建分类失败:', categoriesError);
    return;
  }

  console.log('分类创建成功:', categoriesData);

  // 创建菜品
  const dishes = [
    {
      category_id: categoriesData[0].id, // 热菜
      name: '土豆烧牛肉',
      description: '精选牛腩配土豆，慢火炖煮，肉质软烂，土豆绵糯，汤汁浓郁',
      price: 48,
      original_price: 58,
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800',
      tags: ['热卖', '家常'],
      sales_count: 128,
      sort_order: 1,
    },
    {
      category_id: categoriesData[1].id, // 日式料理
      name: '寿喜烧',
      description: '日式经典锅物，精选牛肉片配新鲜蔬菜，蘸生蛋液食用，口感滑嫩',
      price: 88,
      original_price: 108,
      image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800',
      tags: ['新品', '人气'],
      sales_count: 86,
      sort_order: 1,
    },
    {
      category_id: categoriesData[2].id, // 海鲜
      name: '蒜蓉虾仁',
      description: '新鲜大虾，蒜蓉调味，清蒸烹制，鲜嫩可口，蒜香四溢',
      price: 68,
      original_price: 78,
      image: 'https://images.unsplash.com/photo-1565680018093-ebb6b9ab5460?w=800',
      tags: ['推荐', '辣'],
      sales_count: 95,
      sort_order: 1,
    },
  ];

  console.log('正在创建菜品...');
  const { data: dishesData, error: dishesError } = await client
    .from('dishes')
    .insert(dishes)
    .select();

  if (dishesError) {
    console.error('创建菜品失败:', dishesError);
    return;
  }

  console.log('菜品创建成功:', dishesData);
  console.log('\n初始化完成！');
}

initDishes().catch(console.error);
