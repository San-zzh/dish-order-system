const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());

// Supabase 客户端
const supabaseUrl = process.env.COZE_SUPABASE_URL;
const supabaseKey = process.env.COZE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('错误: 缺少 Supabase 环境变量');
  console.error('COZE_SUPABASE_URL:', supabaseUrl ? '已设置' : '未设置');
  console.error('COZE_SUPABASE_ANON_KEY:', supabaseKey ? '已设置' : '未设置');
}

const supabase = supabaseUrl && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey)
  : null;

// 统一响应格式
const response = (res, code, msg, data = null) => {
  res.json({ code, msg, data });
};

// 健康检查
app.get('/api', (req, res) => {
  response(res, 200, 'success', { message: '点菜系统 API 运行中' });
});

// 获取分类列表
app.get('/api/categories', async (req, res) => {
  if (!supabase) {
    return response(res, 500, '数据库未配置');
  }
  
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true });
    
    if (error) throw error;
    response(res, 200, 'success', data);
  } catch (error) {
    console.error('获取分类失败:', error);
    response(res, 500, error.message);
  }
});

// 创建分类
app.post('/api/categories', async (req, res) => {
  if (!supabase) {
    return response(res, 500, '数据库未配置');
  }
  
  try {
    const { name, description, icon, sort_order } = req.body;
    const { data, error } = await supabase
      .from('categories')
      .insert({ name, description, icon, sort_order: sort_order || 0 })
      .select()
      .single();
    
    if (error) throw error;
    response(res, 200, '分类创建成功', data);
  } catch (error) {
    console.error('创建分类失败:', error);
    response(res, 500, error.message);
  }
});

// 获取菜品列表
app.get('/api/dishes', async (req, res) => {
  if (!supabase) {
    return response(res, 500, '数据库未配置');
  }
  
  try {
    const { data, error } = await supabase
      .from('dishes')
      .select('*')
      .order('sort_order', { ascending: true });
    
    if (error) throw error;
    response(res, 200, 'success', data);
  } catch (error) {
    console.error('获取菜品失败:', error);
    response(res, 500, error.message);
  }
});

// 获取单个菜品
app.get('/api/dishes/:id', async (req, res) => {
  if (!supabase) {
    return response(res, 500, '数据库未配置');
  }
  
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('dishes')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    response(res, 200, 'success', data);
  } catch (error) {
    console.error('获取菜品详情失败:', error);
    response(res, 500, error.message);
  }
});

// 创建菜品
app.post('/api/dishes', async (req, res) => {
  if (!supabase) {
    return response(res, 500, '数据库未配置');
  }
  
  try {
    const { categoryId, name, description, image, price, originalPrice, tags, isAvailable, sortOrder } = req.body;
    const { data, error } = await supabase
      .from('dishes')
      .insert({
        category_id: categoryId,
        name,
        description,
        image,
        price,
        original_price: originalPrice,
        tags,
        is_available: isAvailable ?? true,
        sort_order: sortOrder || 0
      })
      .select()
      .single();
    
    if (error) throw error;
    response(res, 200, '菜品创建成功', data);
  } catch (error) {
    console.error('创建菜品失败:', error);
    response(res, 500, error.message);
  }
});

// 更新菜品
app.put('/api/dishes/:id', async (req, res) => {
  if (!supabase) {
    return response(res, 500, '数据库未配置');
  }
  
  try {
    const { id } = req.params;
    const { categoryId, name, description, image, price, originalPrice, tags, isAvailable, sortOrder } = req.body;
    
    const updateData = {};
    if (categoryId !== undefined) updateData.category_id = categoryId;
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (image !== undefined) updateData.image = image;
    if (price !== undefined) updateData.price = price;
    if (originalPrice !== undefined) updateData.original_price = originalPrice;
    if (tags !== undefined) updateData.tags = tags;
    if (isAvailable !== undefined) updateData.is_available = isAvailable;
    if (sortOrder !== undefined) updateData.sort_order = sortOrder;
    
    const { data, error } = await supabase
      .from('dishes')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    response(res, 200, '菜品更新成功', data);
  } catch (error) {
    console.error('更新菜品失败:', error);
    response(res, 500, error.message);
  }
});

// 删除菜品
app.delete('/api/dishes/:id', async (req, res) => {
  if (!supabase) {
    return response(res, 500, '数据库未配置');
  }
  
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('dishes')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    response(res, 200, '菜品删除成功');
  } catch (error) {
    console.error('删除菜品失败:', error);
    response(res, 500, error.message);
  }
});

// 获取订单列表
app.get('/api/orders', async (req, res) => {
  if (!supabase) {
    return response(res, 500, '数据库未配置');
  }
  
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    response(res, 200, 'success', data);
  } catch (error) {
    console.error('获取订单失败:', error);
    response(res, 500, error.message);
  }
});

// 创建订单
app.post('/api/orders', async (req, res) => {
  if (!supabase) {
    return response(res, 500, '数据库未配置');
  }
  
  try {
    const { totalAmount, items, remark, tableNumber } = req.body;
    
    // 生成订单号
    const orderNumber = `ORD${Date.now()}${Math.floor(Math.random() * 1000)}`;
    
    const { data, error } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        total_amount: totalAmount,
        items,
        remark,
        table_number: tableNumber,
        status: 'pending'
      })
      .select()
      .single();
    
    if (error) throw error;
    response(res, 200, '订单创建成功', data);
  } catch (error) {
    console.error('创建订单失败:', error);
    response(res, 500, error.message);
  }
});

// 启动服务器
app.listen(port, '0.0.0.0', () => {
  console.log(`服务器运行在端口 ${port}`);
  console.log(`环境变量状态:`);
  console.log(`- COZE_SUPABASE_URL: ${supabaseUrl ? '已配置' : '未配置'}`);
  console.log(`- COZE_SUPABASE_ANON_KEY: ${supabaseKey ? '已配置' : '未配置'}`);
});
