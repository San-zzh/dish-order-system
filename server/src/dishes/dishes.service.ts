import { Injectable } from '@nestjs/common';
import { getSupabaseClient } from '@/storage/database/supabase-client';

@Injectable()
export class DishesService {
  private client = getSupabaseClient();

  async getCategories() {
    const { data, error } = await this.client
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('获取分类失败:', error);
      throw new Error('获取分类失败');
    }

    return data || [];
  }

  async getDishes(categoryId?: string) {
    let query = this.client
      .from('dishes')
      .select('*')
      .order('sort_order', { ascending: true });

    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('获取菜品失败:', error);
      throw new Error('获取菜品失败');
    }

    return data || [];
  }

  async getDishById(id: string) {
    const { data, error } = await this.client
      .from('dishes')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error('获取菜品详情失败:', error);
      throw new Error('获取菜品详情失败');
    }

    if (!data) {
      throw new Error('菜品不存在');
    }

    return data;
  }

  // 创建菜品
  async createDish(dishData: {
    categoryId: string;
    name: string;
    description?: string;
    image?: string;
    price: number;
    originalPrice?: number;
    unit?: string;
    tags?: string[];
    isAvailable?: boolean;
    salesCount?: number;
    sortOrder?: number;
  }) {
    const { data, error } = await this.client
      .from('dishes')
      .insert({
        category_id: dishData.categoryId,
        name: dishData.name,
        description: dishData.description,
        image: dishData.image,
        price: dishData.price,
        original_price: dishData.originalPrice,
        unit: dishData.unit || '份',
        tags: dishData.tags || [],
        is_available: dishData.isAvailable !== undefined ? dishData.isAvailable : true,
        sales_count: dishData.salesCount || 0,
        sort_order: dishData.sortOrder || 0,
      })
      .select()
      .single();

    if (error) {
      console.error('创建菜品失败:', error);
      throw new Error('创建菜品失败');
    }

    return data;
  }

  // 更新菜品
  async updateDish(id: string, dishData: {
    categoryId?: string;
    name?: string;
    description?: string;
    image?: string;
    price?: number;
    originalPrice?: number;
    unit?: string;
    tags?: string[];
    isAvailable?: boolean;
    salesCount?: number;
    sortOrder?: number;
  }) {
    const updateData: any = {};

    if (dishData.categoryId !== undefined) updateData.category_id = dishData.categoryId;
    if (dishData.name !== undefined) updateData.name = dishData.name;
    if (dishData.description !== undefined) updateData.description = dishData.description;
    if (dishData.image !== undefined) updateData.image = dishData.image;
    if (dishData.price !== undefined) updateData.price = dishData.price;
    if (dishData.originalPrice !== undefined) updateData.original_price = dishData.originalPrice;
    if (dishData.unit !== undefined) updateData.unit = dishData.unit;
    if (dishData.tags !== undefined) updateData.tags = dishData.tags;
    if (dishData.isAvailable !== undefined) updateData.is_available = dishData.isAvailable;
    if (dishData.salesCount !== undefined) updateData.sales_count = dishData.salesCount;
    if (dishData.sortOrder !== undefined) updateData.sort_order = dishData.sortOrder;

    updateData.updated_at = new Date().toISOString();

    const { data, error } = await this.client
      .from('dishes')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('更新菜品失败:', error);
      throw new Error('更新菜品失败');
    }

    if (!data) {
      throw new Error('菜品不存在');
    }

    return data;
  }

  // 删除菜品
  async deleteDish(id: string) {
    const { error } = await this.client
      .from('dishes')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('删除菜品失败:', error);
      throw new Error('删除菜品失败');
    }

    return { success: true };
  }

  // 创建分类
  async createCategory(categoryData: {
    name: string;
    description?: string;
    icon?: string;
    sortOrder?: number;
  }) {
    const { data, error } = await this.client
      .from('categories')
      .insert({
        name: categoryData.name,
        description: categoryData.description,
        icon: categoryData.icon,
        sort_order: categoryData.sortOrder || 0,
        is_active: true,
      })
      .select()
      .single();

    if (error) {
      console.error('创建分类失败:', error);
      throw new Error('创建分类失败');
    }

    return data;
  }

  // 更新分类
  async updateCategory(id: string, categoryData: {
    name?: string;
    description?: string;
    icon?: string;
    sortOrder?: number;
    isActive?: boolean;
  }) {
    const updateData: any = {};

    if (categoryData.name !== undefined) updateData.name = categoryData.name;
    if (categoryData.description !== undefined) updateData.description = categoryData.description;
    if (categoryData.icon !== undefined) updateData.icon = categoryData.icon;
    if (categoryData.sortOrder !== undefined) updateData.sort_order = categoryData.sortOrder;
    if (categoryData.isActive !== undefined) updateData.is_active = categoryData.isActive;

    updateData.updated_at = new Date().toISOString();

    const { data, error } = await this.client
      .from('categories')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('更新分类失败:', error);
      throw new Error('更新分类失败');
    }

    if (!data) {
      throw new Error('分类不存在');
    }

    return data;
  }

  // 删除分类
  async deleteCategory(id: string) {
    const { error } = await this.client
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('删除分类失败:', error);
      throw new Error('删除分类失败');
    }

    return { success: true };
  }
}
