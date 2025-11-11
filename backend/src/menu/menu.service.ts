import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MenuItem, MenuItemDocument } from './schemas/menu-item.schema';
import { CreateMenuItemInput } from './dto/create-menu-item.input';
import { UpdateMenuItemInput } from './dto/update-menu-item.input';

/**
 * MenuService - Business Logic Layer
 *
 * @Injectable() decorator:
 * - Đánh dấu class có thể inject vào nơi khác (Resolver, Controller)
 * - NestJS DI container quản lý lifecycle của service này
 * - Singleton pattern: Chỉ có 1 instance trong toàn application
 *
 * Responsibilities:
 * - Database operations (CRUD)
 * - Business logic (calculations, validations)
 * - Error handling
 * - Data transformation
 */
@Injectable()
export class MenuService {
  /**
   * Constructor Injection Pattern
   *
   * @InjectModel(MenuItem.name) decorator:
   * - Inject Mongoose model vào service
   * - MenuItem.name = "MenuItem" (tên schema)
   * - Model<MenuItemDocument> = Type của Mongoose model
   *
   * private menuItemModel:
   * - private = chỉ dùng trong class này
   * - menuItemModel = instance variable (this.menuItemModel)
   *
   * Dependency Injection Benefits:
   * - Loose coupling (không hard-code dependencies)
   * - Easy testing (mock dependencies)
   * - Single Responsibility (service chỉ lo business logic)
   */
  constructor(
    @InjectModel(MenuItem.name)
    private menuItemModel: Model<MenuItemDocument>,
  ) {}

  /**
   * findAll - Lấy tất cả menu items (có filter)
   *
   * @param category - Filter theo category (optional)
   * @param isAvailable - Filter theo availability (optional)
   * @returns Promise<MenuItem[]> - Array của menu items
   *
   * Mongoose Query:
   * - find(filter) - Tìm documents theo filter
   * - exec() - Execute query và return Promise
   *
   * Dynamic Filter Pattern:
   * const filter: any = {};
   * if (condition) filter.field = value;
   */
  async findAll(category?: string, isAvailable?: boolean): Promise<MenuItem[]> {
    const filter: any = {};

    // Dynamic filter: Chỉ add vào filter nếu param có giá trị
    if (category) filter.category = category;
    if (isAvailable !== undefined) filter.isAvailable = isAvailable;

    // MongoDB query: db.menuitems.find({ category: "coffee", isAvailable: true })
    return this.menuItemModel.find(filter).exec();
  }

  /**
   * findOne - Lấy 1 menu item by ID
   *
   * @param id - Legacy ID (cf-001, mt-001)
   * @returns Promise<MenuItem> - Menu item hoặc null
   *
   * findOne() - Tìm 1 document đầu tiên match filter
   */
  async findOne(id: string): Promise<MenuItem> {
    const item = await this.menuItemModel.findOne({ id }).exec();

    // Error handling: Throw exception nếu không tìm thấy
    if (!item) {
      throw new NotFoundException(`Menu item với ID "${id}" không tìm thấy`);
    }

    return item;
  }

  /**
   * findCategories - Lấy danh sách unique categories
   *
   * @returns Promise<string[]> - Array của category strings
   *
   * distinct(field) - Lấy giá trị unique của field
   * SQL equivalent: SELECT DISTINCT category FROM menuitems
   */
  async findCategories(): Promise<string[]> {
    const categories = await this.menuItemModel.distinct('category').exec();
    return categories;
  }

  /**
   * create - Tạo menu item mới
   *
   * @param input - Data từ client (đã validate)
   * @returns Promise<MenuItem> - Item vừa tạo
   *
   * Pattern:
   * 1. new this.model(data) - Tạo document instance
   * 2. document.save() - Lưu vào database
   *
   * Alternative:
   * this.model.create(data) - Shorthand cho new + save
   */
  async create(input: CreateMenuItemInput): Promise<MenuItem> {
    // Tạo document instance
    const created = new this.menuItemModel(input);

    // Save vào MongoDB và return document đã lưu
    return created.save();
  }

  /**
   * update - Update menu item
   *
   * @param id - Legacy ID cần update
   * @param input - Data cần update (partial)
   * @returns Promise<MenuItem> - Item sau khi update
   *
   * findOneAndUpdate(filter, update, options):
   * - filter: Điều kiện tìm document
   * - update: Data cần update (chỉ update fields có trong input)
   * - options.new: true → Return document SAU khi update
   *
   * SQL equivalent:
   * UPDATE menuitems SET price = 18000 WHERE id = 'cf-001' RETURNING *
   */
  async update(id: string, input: UpdateMenuItemInput): Promise<MenuItem> {
    const updated = await this.menuItemModel
      .findOneAndUpdate(
        { id }, // Filter: Tìm document có id này
        input, // Update: Apply changes từ input
        { new: true }, // Options: Return updated document
      )
      .exec();

    if (!updated) {
      throw new NotFoundException(`Menu item với ID "${id}" không tìm thấy`);
    }

    return updated;
  }

  /**
   * delete - Xóa menu item
   *
   * @param id - Legacy ID cần xóa
   * @returns Promise<boolean> - true nếu xóa thành công
   *
   * deleteOne(filter) - Xóa 1 document match filter
   * result.deletedCount - Số documents đã xóa (0 hoặc 1)
   */
  async delete(id: string): Promise<boolean> {
    const result = await this.menuItemModel.deleteOne({ id }).exec();

    // deletedCount = 0 → Không tìm thấy document
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Menu item với ID "${id}" không tìm thấy`);
    }

    return true;
  }

  /**
   * toggleAvailability - Bật/tắt availability
   *
   * @param id - Legacy ID
   * @returns Promise<MenuItem> - Item sau khi toggle
   *
   * Pattern:
   * 1. Lấy item hiện tại
   * 2. Đảo giá trị isAvailable
   * 3. Update vào database
   */
  async toggleAvailability(id: string): Promise<MenuItem> {
    // Lấy item hiện tại
    const item = await this.findOne(id);

    // Update với giá trị đảo ngược
    return this.menuItemModel
      .findOneAndUpdate(
        { id },
        { isAvailable: !item.isAvailable }, // Toggle: true → false, false → true
        { new: true },
      )
      .exec();
  }
}

/**
 * Mongoose Model Methods Cheat Sheet:
 *
 * READ:
 * - model.find(filter) - Tìm nhiều documents
 * - model.findOne(filter) - Tìm 1 document
 * - model.findById(id) - Tìm by MongoDB _id
 * - model.distinct(field) - Lấy unique values
 * - model.countDocuments(filter) - Đếm số documents
 *
 * CREATE:
 * - new model(data).save() - Tạo instance rồi save
 * - model.create(data) - Shorthand
 * - model.insertMany([data]) - Insert nhiều
 *
 * UPDATE:
 * - model.updateOne(filter, update) - Update 1, không return doc
 * - model.updateMany(filter, update) - Update nhiều
 * - model.findOneAndUpdate(filter, update, {new: true}) - Update và return doc
 * - model.findByIdAndUpdate(id, update, {new: true}) - Update by _id
 *
 * DELETE:
 * - model.deleteOne(filter) - Xóa 1
 * - model.deleteMany(filter) - Xóa nhiều
 * - model.findByIdAndDelete(id) - Xóa by _id
 *
 * QUERY MODIFIERS:
 * - .sort({ field: 1 }) - Sort ascending (1) / descending (-1)
 * - .limit(n) - Limit kết quả
 * - .skip(n) - Skip n documents (pagination)
 * - .select('field1 field2') - Chọn fields cần lấy
 * - .exec() - Execute query và return Promise
 */
