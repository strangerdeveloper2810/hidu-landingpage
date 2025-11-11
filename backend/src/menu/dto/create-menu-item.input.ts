import { InputType, Field, Float } from '@nestjs/graphql';
import { IsString, IsNumber, IsOptional, IsBoolean, Min, MinLength } from 'class-validator';

/**
 * CreateMenuItemInput - GraphQL Input Type cho mutation tạo món mới
 *
 * @InputType() → Đánh dấu class là GraphQL input type
 * Kết hợp với class-validator decorators để validate data
 *
 * Flow:
 * 1. Client gửi data qua GraphQL mutation
 * 2. NestJS ValidationPipe tự động validate theo decorators
 * 3. Nếu valid → data được pass vào resolver
 * 4. Nếu invalid → throw BadRequestException với error message
 */
@InputType()
export class CreateMenuItemInput {
  /**
   * class-validator decorators:
   *
   * @IsString() → Phải là string
   * @IsNumber() → Phải là number
   * @IsBoolean() → Phải là boolean
   * @IsOptional() → Field không bắt buộc (nullable)
   * @MinLength(n) → String tối thiểu n ký tự
   * @Min(n) → Number tối thiểu là n
   * @Max(n) → Number tối đa là n
   * @IsEmail() → Phải là email valid
   * @IsUrl() → Phải là URL valid
   */

  @Field()
  @IsString()
  @MinLength(3, { message: 'ID phải có ít nhất 3 ký tự' })
  id: string; // "cf-001"

  @Field()
  @IsString()
  @MinLength(3, { message: 'Tên món phải có ít nhất 3 ký tự' })
  name: string;

  @Field()
  @IsString()
  @MinLength(10, { message: 'Mô tả phải có ít nhất 10 ký tự' })
  description: string;

  @Field(() => Float)
  @IsNumber()
  @Min(0, { message: 'Giá phải lớn hơn hoặc bằng 0' })
  price: number;

  @Field(() => Float, { nullable: true })
  @IsOptional() // Field này không bắt buộc
  @IsNumber()
  @Min(0)
  priceLarge?: number;

  @Field()
  @IsString()
  @MinLength(2, { message: 'Category phải có ít nhất 2 ký tự' })
  category: string;

  @Field()
  @IsString()
  imageUrl: string; // URL ảnh

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isPopular?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isNew?: boolean;
}

/**
 * Example GraphQL Mutation:
 *
 * mutation {
 *   createMenuItem(input: {
 *     id: "cf-001"
 *     name: "Cà phê đen"
 *     description: "Cà phê phin truyền thống"
 *     price: 15000
 *     category: "coffee"
 *     imageUrl: "https://example.com/image.jpg"
 *   }) {
 *     _id
 *     name
 *     price
 *   }
 * }
 *
 * Nếu validation fail (ví dụ: name chỉ có 2 ký tự):
 * {
 *   "errors": [{
 *     "message": "Tên món phải có ít nhất 3 ký tự"
 *   }]
 * }
 */
