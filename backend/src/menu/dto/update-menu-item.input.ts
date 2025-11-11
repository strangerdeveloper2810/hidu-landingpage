import { InputType, Field, Float } from '@nestjs/graphql';
import { IsString, IsNumber, IsOptional, IsBoolean, Min, MinLength } from 'class-validator';

/**
 * UpdateMenuItemInput - Input type cho mutation update món
 *
 * Khác với CreateMenuItemInput:
 * - TẤT CẢ fields đều @IsOptional() (chỉ update fields được gửi lên)
 * - Không cần field "id" (id được pass riêng trong mutation args)
 *
 * Partial Update Pattern:
 * Client chỉ gửi fields muốn update, không cần gửi tất cả
 */
@InputType()
export class UpdateMenuItemInput {
  /**
   * TẤT CẢ fields đều optional cho phép partial update
   * Client chỉ gửi fields muốn thay đổi
   */

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MinLength(3)
  name?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MinLength(10)
  description?: string;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  priceLarge?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  category?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isPopular?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isNew?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;
}

/**
 * Example GraphQL Mutation (Partial Update):
 *
 * # Chỉ update giá và availability
 * mutation {
 *   updateMenuItem(
 *     id: "cf-001"
 *     input: {
 *       price: 18000
 *       isAvailable: false
 *     }
 *   ) {
 *     _id
 *     name
 *     price
 *     isAvailable
 *   }
 * }
 *
 * MongoDB sẽ chỉ update 2 fields: price và isAvailable
 * Các fields khác giữ nguyên
 */
