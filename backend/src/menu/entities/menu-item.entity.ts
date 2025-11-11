import { ObjectType, Field, ID, Float } from '@nestjs/graphql';

/**
 * MenuItemEntity - GraphQL Output Type
 *
 * Đây là type mà CLIENT nhận được khi query GraphQL
 * Khác với Schema (database), Entity có thể:
 * - Ẩn fields nhạy cảm (password, internal IDs)
 * - Thêm computed fields
 * - Format data khác với database
 *
 * @ObjectType() → Đánh dấu class là GraphQL type
 */
@ObjectType()
export class MenuItemEntity {
  /**
   * @Field() decorator đánh dấu property là GraphQL field
   *
   * Syntax:
   * - @Field() → GraphQL tự infer type (String, Boolean)
   * - @Field(() => Type) → Specify type explicitly
   *
   * GraphQL Types:
   * - ID → GraphQL ID (string hoặc number unique identifier)
   * - String → Text
   * - Int → Integer number
   * - Float → Decimal number
   * - Boolean → true/false
   * - [Type] → Array of Type
   * - Type! → Non-nullable (required)
   */

  @Field(() => ID) // GraphQL ID type
  _id: string; // MongoDB ObjectId as string

  @Field() // GraphQL String (auto-infer)
  id: string; // Legacy ID: "cf-001"

  @Field()
  name: string;

  @Field()
  description: string;

  @Field(() => Float) // GraphQL Float (decimal number)
  price: number;

  @Field(() => Float, { nullable: true }) // Optional field
  priceLarge?: number; // ? = optional trong TypeScript

  @Field()
  category: string;

  @Field()
  imageUrl: string;

  @Field()
  isPopular: boolean;

  @Field()
  isBestSeller: boolean;

  @Field()
  isNew: boolean;

  @Field()
  isAvailable: boolean;

  @Field() // Auto add bởi timestamps trong Schema
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

/**
 * So sánh với REST API:
 *
 * REST Response:
 * GET /api/menu-items/123
 * {
 *   "_id": "507f1f77bcf86cd799439011",
 *   "id": "cf-001",
 *   "name": "Cà phê đen",
 *   "price": 15000,
 *   ...
 * }
 *
 * GraphQL Query:
 * query {
 *   menuItem(id: "cf-001") {
 *     _id
 *     name
 *     price
 *     # Client chọn fields cần lấy!
 *   }
 * }
 *
 * GraphQL Response:
 * {
 *   "data": {
 *     "menuItem": {
 *       "_id": "507f1f77bcf86cd799439011",
 *       "name": "Cà phê đen",
 *       "price": 15000
 *     }
 *   }
 * }
 */
