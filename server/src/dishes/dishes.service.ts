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
      .eq('is_available', true)
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
      .maybeSingle(); // 使用 maybeSingle 而不是 single，避免未找到时报错

    if (error) {
      console.error('获取菜品详情失败:', error);
      throw new Error('获取菜品详情失败');
    }

    if (!data) {
      throw new Error('菜品不存在');
    }

    return data;
  }
}
