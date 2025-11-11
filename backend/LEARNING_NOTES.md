# NestJS Learning Notes - Hidu Coffee Project

> Ghi chú học NestJS qua thực tế, từ cơ bản đến nâng cao

---

## 1. NestJS Core Concepts

### 1.1. Dependency Injection (DI)

**Khái niệm:**
- DI là design pattern nơi các dependencies được "inject" vào class thay vì class tự tạo
- NestJS dùng DI container để quản lý lifecycle của các objects
- Giúp code dễ test, dễ maintain, loosely coupled

**Cách hoạt động:**
```typescript
// BAD: Tự tạo dependency (tightly coupled)
class MenuService {
  constructor() {
    this.database = new MongoDatabase(); // Hard-coded!
  }
}

// GOOD: Inject dependency (loosely coupled)
class MenuService {
  constructor(private database: Database) {} // Injected!
}
```

**Trong NestJS:**
- Dùng decorator `@Injectable()` để đánh dấu class có thể inject
- Constructor injection là pattern chính

---

### 1.2. Decorators

**Khái niệm:**
- Decorators là functions đặc biệt dùng để modify classes, methods, properties
- Syntax: `@DecoratorName(options)`
- TypeScript feature, NestJS dùng nhiều decorators

**Các decorators quan trọng:**

#### Module Decorators
- `@Module()` - Định nghĩa một module
- `@Global()` - Module available globally

#### Class Decorators
- `@Injectable()` - Class có thể inject vào nơi khác (Service, Repository)
- `@Controller()` - REST API controller
- `@Resolver()` - GraphQL resolver

#### Property Decorators (Mongoose)
- `@Prop()` - Định nghĩa schema property
- `@Schema()` - Đánh dấu class là Mongoose schema

#### Property Decorators (GraphQL)
- `@Field()` - Định nghĩa GraphQL field
- `@ObjectType()` - GraphQL object type (output)
- `@InputType()` - GraphQL input type

#### Method Decorators (GraphQL)
- `@Query()` - GraphQL query (read data)
- `@Mutation()` - GraphQL mutation (write data)

#### Parameter Decorators
- `@Args()` - Lấy arguments từ GraphQL
- `@Body()` - Lấy request body (REST)
- `@Param()` - Lấy URL params (REST)

---

### 1.3. Module Pattern

**Khái niệm:**
- Module là cách tổ chức code trong NestJS
- Mỗi feature = 1 module
- Root module (AppModule) import các feature modules

**Cấu trúc Module:**
```typescript
@Module({
  imports: [],      // Modules khác cần dùng
  providers: [],    // Services, Repositories (Injectable)
  controllers: [],  // REST Controllers (nếu có)
  exports: [],      // Export để modules khác dùng
})
export class FeatureModule {}
```

**Feature Module Structure:**
```
menu/
├── schemas/          # Database models (Mongoose)
├── entities/         # GraphQL types (output)
├── dto/             # Data Transfer Objects (input)
├── menu.service.ts   # Business logic
├── menu.resolver.ts  # GraphQL endpoints
└── menu.module.ts    # Module definition
```

---

## 2. Mongoose Integration

### 2.1. Schema Definition

**Khái niệm:**
- Schema định nghĩa cấu trúc document trong MongoDB
- Dùng decorators `@Schema()` và `@Prop()`

**Example:**
```typescript
@Schema({ timestamps: true }) // Auto add createdAt, updatedAt
export class MenuItem {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  price: number;

  @Prop({ default: true })
  isAvailable: boolean;
}

export const MenuItemSchema = SchemaFactory.createForClass(MenuItem);
```

**Options trong @Schema():**
- `timestamps: true` - Tự động thêm createdAt/updatedAt
- `collection: 'name'` - Tên collection trong MongoDB

**Options trong @Prop():**
- `required: true` - Field bắt buộc
- `unique: true` - Giá trị unique
- `default: value` - Giá trị mặc định
- `index: true` - Tạo index cho search nhanh
- `type: Type` - Kiểu dữ liệu (String, Number, Date, Array, Object)

### 2.2. Document Type

```typescript
export type MenuItemDocument = MenuItem & Document;
```

- Combine Mongoose class với Mongoose Document type
- Dùng để type safety khi làm việc với database

---

## 3. GraphQL với NestJS

### 3.1. Code-First Approach

**NestJS hỗ trợ 2 approaches:**
1. **Schema-First**: Viết .graphql file trước, generate TypeScript types
2. **Code-First**: Viết TypeScript classes, auto-generate .graphql schema

**Project này dùng Code-First vì:**
- DRY: Không duplicate types
- Type safety: TypeScript compile-time checking
- Dễ refactor

### 3.2. Entity vs DTO

**Entity (Output Type):**
- Data trả về cho client
- Dùng `@ObjectType()` và `@Field()`

```typescript
@ObjectType()
export class MenuItemEntity {
  @Field(() => ID)
  _id: string;

  @Field()
  name: string;

  @Field(() => Float)
  price: number;
}
```

**DTO (Input Type):**
- Data client gửi lên
- Dùng `@InputType()` và `@Field()`
- Có validation với class-validator

```typescript
@InputType()
export class CreateMenuItemInput {
  @Field()
  @IsString()
  @MinLength(3)
  name: string;

  @Field(() => Float)
  @IsNumber()
  @Min(0)
  price: number;
}
```

### 3.3. Resolver

**Khái niệm:**
- Resolver = Controller trong GraphQL
- Handle queries và mutations
- Return data hoặc call Service

```typescript
@Resolver(() => MenuItemEntity)
export class MenuResolver {
  constructor(private menuService: MenuService) {}

  @Query(() => [MenuItemEntity])
  async menuItems() {
    return this.menuService.findAll();
  }

  @Mutation(() => MenuItemEntity)
  async createMenuItem(@Args('input') input: CreateMenuItemInput) {
    return this.menuService.create(input);
  }
}
```

---

## 4. Service Layer

**Khái niệm:**
- Service chứa business logic
- Gọi database, xử lý data, return kết quả
- Marked với `@Injectable()` để có thể inject

**Pattern:**
```typescript
@Injectable()
export class MenuService {
  constructor(
    @InjectModel(MenuItem.name)
    private menuItemModel: Model<MenuItemDocument>
  ) {}

  async findAll(): Promise<MenuItem[]> {
    return this.menuItemModel.find().exec();
  }

  async create(input: CreateMenuItemInput): Promise<MenuItem> {
    const created = new this.menuItemModel(input);
    return created.save();
  }
}
```

**Mongoose Model Methods:**
- `find()` - Tìm nhiều documents
- `findOne()` - Tìm 1 document
- `findById()` - Tìm by ID
- `create()` - Tạo mới
- `findByIdAndUpdate()` - Update by ID
- `findByIdAndDelete()` - Delete by ID
- `save()` - Lưu document

---

## 5. Validation với class-validator

**Decorators validation:**
- `@IsString()` - Phải là string
- `@IsNumber()` - Phải là number
- `@IsEmail()` - Phải là email valid
- `@MinLength(n)` - String min length
- `@Min(n)` / `@Max(n)` - Number range
- `@IsOptional()` - Field không bắt buộc
- `@IsBoolean()` - Phải là boolean
- `@IsArray()` - Phải là array

**Global Validation Pipe:**
```typescript
// main.ts
app.useGlobalPipes(new ValidationPipe({
  whitelist: true,           // Loại bỏ fields không khai báo
  forbidNonWhitelisted: true, // Error nếu có unknown fields
  transform: true,            // Auto transform types
}));
```

---

## 6. MongoDB Query Patterns

### 6.1. Basic Queries

```typescript
// Find all
await this.model.find().exec();

// Find với conditions
await this.model.find({ category: 'coffee' }).exec();

// Find với multiple conditions
await this.model.find({
  category: 'coffee',
  isAvailable: true
}).exec();

// Find one
await this.model.findOne({ id: 'cf-001' }).exec();
```

### 6.2. Advanced Queries

```typescript
// Sorting
await this.model.find().sort({ price: 1 }).exec(); // 1 = asc, -1 = desc

// Limiting
await this.model.find().limit(10).exec();

// Skip (pagination)
await this.model.find().skip(20).limit(10).exec();

// Select specific fields
await this.model.find().select('name price').exec();

// Distinct values
await this.model.distinct('category').exec();
```

---

## 7. Best Practices

### 7.1. Naming Conventions

- **Files:** kebab-case (`menu-item.schema.ts`)
- **Classes:** PascalCase (`MenuItem`, `MenuService`)
- **Interfaces/Types:** PascalCase with suffix (`MenuItemDocument`)
- **Functions:** camelCase (`findAll`, `createMenuItem`)
- **Constants:** UPPER_SNAKE_CASE (`DATABASE_CONNECTION`)

### 7.2. Folder Structure

```
src/
├── main.ts                 # Entry point
├── app.module.ts           # Root module
├── common/                 # Shared code
│   ├── decorators/
│   ├── filters/
│   ├── guards/
│   └── pipes/
└── features/               # Feature modules
    ├── menu/
    ├── auth/
    └── orders/
```

### 7.3. Error Handling

```typescript
// Service
async findOne(id: string): Promise<MenuItem> {
  const item = await this.model.findOne({ id }).exec();
  if (!item) {
    throw new NotFoundException(`MenuItem with ID ${id} not found`);
  }
  return item;
}
```

**Common Exceptions:**
- `NotFoundException` - 404
- `BadRequestException` - 400
- `UnauthorizedException` - 401
- `ForbiddenException` - 403
- `ConflictException` - 409

---

## 8. Testing Concepts (Sẽ học sau)

- Unit testing với Jest
- E2E testing
- Mocking dependencies
- Test database setup

---

## Kiến thức sẽ học tiếp

- [ ] JWT Authentication & Guards
- [ ] Role-Based Access Control (RBAC)
- [ ] File Upload (Multer + Cloudinary)
- [ ] Middleware & Interceptors
- [ ] Custom Decorators
- [ ] Error Filters
- [ ] Logging
- [ ] Configuration Management
- [ ] Database Transactions
- [ ] Caching (Redis)
- [ ] Microservices (Message Queue)
- [ ] WebSockets (Real-time)
- [ ] Testing Strategy

---

**Last updated:** Phase 2 - MenuItem Module
