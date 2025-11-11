import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

/**
 * Document Type: Combine schema class với Mongoose Document
 * Dùng cho type safety khi làm việc với database
 */
export type MenuItemDocument = MenuItem & Document;

/**
 * MenuItem Schema - Định nghĩa cấu trúc document trong MongoDB
 *
 * @Schema() decorator options:
 * - timestamps: true → Tự động add createdAt, updatedAt
 * - collection: 'menuitems' → Tên collection (mặc định là 'menuitems')
 */
@Schema({ timestamps: true })
export class MenuItem {
  /**
   * @Prop() decorator định nghĩa một field
   * Options:
   * - required: true → Field bắt buộc phải có
   * - unique: true → Giá trị phải unique trong collection
   * - default: value → Giá trị mặc định
   * - index: true → Tạo index cho search nhanh
   * - type: Type → Kiểu dữ liệu nếu cần specify
   */

  @Prop({ required: true, unique: true })
  id: string; // "cf-001", "mt-001" - legacy ID từ frontend

  @Prop({ required: true })
  name: string; // Tên món: "Cà phê đen"

  @Prop({ required: true })
  description: string; // Mô tả món

  @Prop({ required: true })
  price: number; // Giá (VNĐ): 15000

  @Prop()
  priceLarge?: number; // Giá size L (optional): 25000

  @Prop({ required: true, index: true }) // Index để search by category nhanh
  category: string; // "coffee", "matcha", "juice", etc.

  @Prop({ required: true })
  imageUrl: string; // URL ảnh từ Cloudinary/Firebase

  @Prop({ default: false })
  isPopular: boolean; // Món popular hay không

  @Prop({ default: false })
  isBestSeller: boolean; // Món bán chạy (auto-calculate sau)

  @Prop({ default: false })
  isNew: boolean; // Món mới

  @Prop({ default: true })
  isAvailable: boolean; // Còn hàng hay hết
}

/**
 * SchemaFactory.createForClass() tạo Mongoose schema từ class
 * Schema này được dùng để register với MongooseModule
 */
export const MenuItemSchema = SchemaFactory.createForClass(MenuItem);
