import { sql } from "drizzle-orm"
import {
  pgTable,
  serial,
  timestamp,
  varchar,
  text,
  integer,
  boolean,
  jsonb,
  index,
  decimal,
} from "drizzle-orm/pg-core"
import { createSchemaFactory } from "drizzle-zod"
import { z } from "zod"

// 系统表
export const healthCheck = pgTable("health_check", {
  id: serial().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
});

// 菜品分类表
export const categories = pgTable(
  "categories",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    name: varchar("name", { length: 50 }).notNull(),
    description: text("description"),
    icon: varchar("icon", { length: 100 }),
    sortOrder: integer("sort_order").notNull().default(0),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
  },
  (table) => [
    index("categories_sort_idx").on(table.sortOrder),
    index("categories_active_idx").on(table.isActive),
  ]
);

// 菜品表
export const dishes = pgTable(
  "dishes",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    categoryId: varchar("category_id", { length: 36 }).notNull(),
    name: varchar("name", { length: 100 }).notNull(),
    description: text("description"),
    image: text("image"),
    price: decimal("price", { precision: 10, scale: 2 }).notNull(),
    originalPrice: decimal("original_price", { precision: 10, scale: 2 }),
    unit: varchar("unit", { length: 20 }).default("份"),
    tags: jsonb("tags"), // 标签：["热卖", "辣", "新品"]
    isAvailable: boolean("is_available").default(true).notNull(),
    salesCount: integer("sales_count").default(0).notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
  },
  (table) => [
    index("dishes_category_idx").on(table.categoryId),
    index("dishes_available_idx").on(table.isAvailable),
    index("dishes_sales_idx").on(table.salesCount),
  ]
);

// 订单表
export const orders = pgTable(
  "orders",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    orderNumber: varchar("order_number", { length: 50 }).notNull().unique(),
    tableNumber: varchar("table_number", { length: 20 }),
    customerName: varchar("customer_name", { length: 50 }),
    customerPhone: varchar("customer_phone", { length: 20 }),
    totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
    remark: text("remark"),
    status: varchar("status", { length: 20 }).notNull().default("pending"), // pending, confirmed, completed, cancelled
    createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
  },
  (table) => [
    index("orders_order_number_idx").on(table.orderNumber),
    index("orders_status_idx").on(table.status),
    index("orders_created_at_idx").on(table.createdAt),
  ]
);

// 订单详情表
export const orderItems = pgTable(
  "order_items",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    orderId: varchar("order_id", { length: 36 }).notNull(),
    dishId: varchar("dish_id", { length: 36 }).notNull(),
    dishName: varchar("dish_name", { length: 100 }).notNull(),
    dishPrice: decimal("dish_price", { precision: 10, scale: 2 }).notNull(),
    quantity: integer("quantity").notNull(),
    subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
    remark: text("remark"),
    createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
  },
  (table) => [
    index("order_items_order_idx").on(table.orderId),
    index("order_items_dish_idx").on(table.dishId),
  ]
);

// Zod schemas
const { createInsertSchema: createCoercedInsertSchema } = createSchemaFactory({
  coerce: { date: true },
});

// Categories
export const insertCategorySchema = createCoercedInsertSchema(categories).pick({
  name: true,
  description: true,
  icon: true,
  sortOrder: true,
  isActive: true,
});

// Dishes
export const insertDishSchema = createCoercedInsertSchema(dishes).pick({
  categoryId: true,
  name: true,
  description: true,
  image: true,
  price: true,
  originalPrice: true,
  unit: true,
  tags: true,
  isAvailable: true,
  sortOrder: true,
});

// Orders
export const insertOrderSchema = createCoercedInsertSchema(orders).pick({
  tableNumber: true,
  customerName: true,
  customerPhone: true,
  totalAmount: true,
  remark: true,
  status: true,
});

// OrderItems
export const insertOrderItemSchema = createCoercedInsertSchema(orderItems).pick({
  orderId: true,
  dishId: true,
  dishName: true,
  dishPrice: true,
  quantity: true,
  subtotal: true,
  remark: true,
});

// TypeScript types
export type Category = typeof categories.$inferSelect;
export type Dish = typeof dishes.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type OrderItem = typeof orderItems.$inferSelect;

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type InsertDish = z.infer<typeof insertDishSchema>;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;
