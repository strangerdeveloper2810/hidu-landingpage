# Hidu Coffee Backend & CMS Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build NestJS GraphQL backend with MongoDB, admin dashboard in Astro, and e-commerce features with multiple payment methods for Hidu Coffee shop.

**Architecture:** Separate NestJS backend (GraphQL API) + MongoDB database + Astro frontend (SSR mode) with admin dashboard. JWT authentication, Cloudinary/Firebase for images, VNPay/MoMo/ZaloPay for payments.

**Tech Stack:** NestJS, GraphQL (Apollo), MongoDB (Mongoose), JWT (Passport), Astro (SSR), Tailwind CSS, Cloudinary, Firebase

---

## Phase 1: Backend Setup & Foundation

### Task 1.1: Initialize NestJS Project

**Files:**
- Create: `backend/` directory
- Create: `backend/package.json`
- Create: `backend/src/main.ts`
- Create: `backend/tsconfig.json`

**Step 1: Create backend directory and initialize NestJS**

```bash
cd /Users/mdm/Desktop/hidu
mkdir backend
cd backend
npm init -y
npm install @nestjs/core @nestjs/common @nestjs/platform-express reflect-metadata rxjs
npm install -D @nestjs/cli typescript @types/node ts-node
npx nest new . --skip-git --package-manager npm
```

Expected: NestJS project structure created

**Step 2: Install GraphQL dependencies**

```bash
cd /Users/mdm/Desktop/hidu/backend
npm install @nestjs/graphql @nestjs/apollo @apollo/server graphql
```

**Step 3: Install MongoDB dependencies**

```bash
npm install @nestjs/mongoose mongoose
```

**Step 4: Install authentication dependencies**

```bash
npm install @nestjs/jwt @nestjs/passport passport passport-jwt bcrypt
npm install -D @types/passport-jwt @types/bcrypt
```

**Step 5: Install file upload dependencies**

```bash
npm install @nestjs/platform-express multer cloudinary firebase-admin
npm install -D @types/multer
```

**Step 6: Install utilities**

```bash
npm install class-validator class-transformer @nestjs/config
```

**Step 7: Create .env file**

Create: `backend/.env`

```env
# Database
MONGODB_URI=mongodb://localhost:27017/hidu

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Firebase
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-client-email

# Server
PORT=4000
CORS_ORIGIN=http://localhost:4321

# Payment (will fill later)
VNPAY_TMN_CODE=
VNPAY_HASH_SECRET=
MOMO_PARTNER_CODE=
MOMO_ACCESS_KEY=
ZALOPAY_APP_ID=
```

**Step 8: Create .gitignore**

Create: `backend/.gitignore`

```
node_modules/
dist/
.env
.env.local
*.log
.DS_Store
```

**Step 9: Update main.ts for CORS and port**

Modify: `backend/src/main.ts`

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:4321',
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`🚀 Server running on http://localhost:${port}/graphql`);
}
bootstrap();
```

**Step 10: Commit**

```bash
cd /Users/mdm/Desktop/hidu
git add backend/
git commit -m "feat: initialize NestJS backend with GraphQL, MongoDB, and auth dependencies"
```

---

### Task 1.2: Configure GraphQL Module

**Files:**
- Modify: `backend/src/app.module.ts`
- Create: `backend/src/schema.gql` (auto-generated)

**Step 1: Configure GraphQL in AppModule**

Modify: `backend/src/app.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { join } from 'path';

@Module({
  imports: [
    // Config
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // MongoDB
    MongooseModule.forRoot(process.env.MONGODB_URI),

    // GraphQL
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: true,
      context: ({ req, res }) => ({ req, res }),
    }),
  ],
})
export class AppModule {}
```

**Step 2: Test server starts**

```bash
cd /Users/mdm/Desktop/hidu/backend
npm run start:dev
```

Expected: Server starts on port 4000, GraphQL playground at http://localhost:4000/graphql

**Step 3: Commit**

```bash
cd /Users/mdm/Desktop/hidu
git add backend/src/app.module.ts
git commit -m "feat: configure GraphQL and MongoDB in AppModule"
```

---

## Phase 2: Database Models (Mongoose Schemas)

### Task 2.1: Create MenuItem Schema

**Files:**
- Create: `backend/src/menu/schemas/menu-item.schema.ts`
- Create: `backend/src/menu/dto/create-menu-item.input.ts`
- Create: `backend/src/menu/dto/update-menu-item.input.ts`
- Create: `backend/src/menu/entities/menu-item.entity.ts`

**Step 1: Create menu module directory**

```bash
cd /Users/mdm/Desktop/hidu/backend/src
mkdir -p menu/schemas menu/dto menu/entities
```

**Step 2: Create MenuItem schema**

Create: `backend/src/menu/schemas/menu-item.schema.ts`

```typescript
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MenuItemDocument = MenuItem & Document;

@Schema({ timestamps: true })
export class MenuItem {
  @Prop({ required: true, unique: true })
  id: string; // "cf-001"

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  price: number;

  @Prop()
  priceLarge?: number;

  @Prop({ required: true, index: true })
  category: string;

  @Prop({ required: true })
  imageUrl: string;

  @Prop({ default: false })
  isPopular: boolean;

  @Prop({ default: false })
  isBestSeller: boolean;

  @Prop({ default: false })
  isNew: boolean;

  @Prop({ default: true })
  isAvailable: boolean;
}

export const MenuItemSchema = SchemaFactory.createForClass(MenuItem);
```

**Step 3: Create GraphQL entity**

Create: `backend/src/menu/entities/menu-item.entity.ts`

```typescript
import { ObjectType, Field, ID, Int, Float } from '@nestjs/graphql';

@ObjectType()
export class MenuItemEntity {
  @Field(() => ID)
  _id: string;

  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field(() => Float)
  price: number;

  @Field(() => Float, { nullable: true })
  priceLarge?: number;

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

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
```

**Step 4: Create input DTOs**

Create: `backend/src/menu/dto/create-menu-item.input.ts`

```typescript
import { InputType, Field, Float } from '@nestjs/graphql';
import { IsString, IsNumber, IsOptional, IsBoolean, Min } from 'class-validator';

@InputType()
export class CreateMenuItemInput {
  @Field()
  @IsString()
  id: string;

  @Field()
  @IsString()
  name: string;

  @Field()
  @IsString()
  description: string;

  @Field(() => Float)
  @IsNumber()
  @Min(0)
  price: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  priceLarge?: number;

  @Field()
  @IsString()
  category: string;

  @Field()
  @IsString()
  imageUrl: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isPopular?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isNew?: boolean;
}
```

Create: `backend/src/menu/dto/update-menu-item.input.ts`

```typescript
import { InputType, Field, Float } from '@nestjs/graphql';
import { IsString, IsNumber, IsOptional, IsBoolean, Min } from 'class-validator';

@InputType()
export class UpdateMenuItemInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  name?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
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
```

**Step 5: Commit**

```bash
cd /Users/mdm/Desktop/hidu
git add backend/src/menu/
git commit -m "feat: add MenuItem schema, entity, and DTOs"
```

---

### Task 2.2: Create Menu Resolver & Service

**Files:**
- Create: `backend/src/menu/menu.resolver.ts`
- Create: `backend/src/menu/menu.service.ts`
- Create: `backend/src/menu/menu.module.ts`
- Modify: `backend/src/app.module.ts`

**Step 1: Create Menu service**

Create: `backend/src/menu/menu.service.ts`

```typescript
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MenuItem, MenuItemDocument } from './schemas/menu-item.schema';
import { CreateMenuItemInput } from './dto/create-menu-item.input';
import { UpdateMenuItemInput } from './dto/update-menu-item.input';

@Injectable()
export class MenuService {
  constructor(
    @InjectModel(MenuItem.name) private menuItemModel: Model<MenuItemDocument>,
  ) {}

  async findAll(category?: string, isAvailable?: boolean): Promise<MenuItem[]> {
    const filter: any = {};
    if (category) filter.category = category;
    if (isAvailable !== undefined) filter.isAvailable = isAvailable;

    return this.menuItemModel.find(filter).exec();
  }

  async findOne(id: string): Promise<MenuItem> {
    return this.menuItemModel.findOne({ id }).exec();
  }

  async findCategories(): Promise<string[]> {
    const items = await this.menuItemModel.find().distinct('category').exec();
    return items;
  }

  async create(input: CreateMenuItemInput): Promise<MenuItem> {
    const created = new this.menuItemModel(input);
    return created.save();
  }

  async update(id: string, input: UpdateMenuItemInput): Promise<MenuItem> {
    return this.menuItemModel
      .findOneAndUpdate({ id }, input, { new: true })
      .exec();
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.menuItemModel.deleteOne({ id }).exec();
    return result.deletedCount > 0;
  }

  async toggleAvailability(id: string): Promise<MenuItem> {
    const item = await this.findOne(id);
    return this.menuItemModel
      .findOneAndUpdate(
        { id },
        { isAvailable: !item.isAvailable },
        { new: true },
      )
      .exec();
  }
}
```

**Step 2: Create Menu resolver**

Create: `backend/src/menu/menu.resolver.ts`

```typescript
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { MenuService } from './menu.service';
import { MenuItemEntity } from './entities/menu-item.entity';
import { CreateMenuItemInput } from './dto/create-menu-item.input';
import { UpdateMenuItemInput } from './dto/update-menu-item.input';

@Resolver(() => MenuItemEntity)
export class MenuResolver {
  constructor(private readonly menuService: MenuService) {}

  @Query(() => [MenuItemEntity], { name: 'menuItems' })
  async findAll(
    @Args('category', { nullable: true }) category?: string,
    @Args('isAvailable', { nullable: true }) isAvailable?: boolean,
  ) {
    return this.menuService.findAll(category, isAvailable);
  }

  @Query(() => MenuItemEntity, { name: 'menuItem', nullable: true })
  async findOne(@Args('id') id: string) {
    return this.menuService.findOne(id);
  }

  @Query(() => [String], { name: 'categories' })
  async findCategories() {
    return this.menuService.findCategories();
  }

  @Mutation(() => MenuItemEntity)
  async createMenuItem(@Args('input') input: CreateMenuItemInput) {
    return this.menuService.create(input);
  }

  @Mutation(() => MenuItemEntity)
  async updateMenuItem(
    @Args('id') id: string,
    @Args('input') input: UpdateMenuItemInput,
  ) {
    return this.menuService.update(id, input);
  }

  @Mutation(() => Boolean)
  async deleteMenuItem(@Args('id') id: string) {
    return this.menuService.delete(id);
  }

  @Mutation(() => MenuItemEntity)
  async toggleMenuItemAvailability(@Args('id') id: string) {
    return this.menuService.toggleAvailability(id);
  }
}
```

**Step 3: Create Menu module**

Create: `backend/src/menu/menu.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MenuResolver } from './menu.resolver';
import { MenuService } from './menu.service';
import { MenuItem, MenuItemSchema } from './schemas/menu-item.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MenuItem.name, schema: MenuItemSchema },
    ]),
  ],
  providers: [MenuResolver, MenuService],
  exports: [MenuService],
})
export class MenuModule {}
```

**Step 4: Import MenuModule in AppModule**

Modify: `backend/src/app.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { join } from 'path';
import { MenuModule } from './menu/menu.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: true,
      context: ({ req, res }) => ({ req, res }),
    }),
    MenuModule,
  ],
})
export class AppModule {}
```

**Step 5: Test GraphQL queries**

```bash
cd /Users/mdm/Desktop/hidu/backend
npm run start:dev
```

Open http://localhost:4000/graphql and test:

```graphql
query {
  menuItems {
    id
    name
    price
    category
  }
}
```

Expected: Empty array `[]` (no data yet)

**Step 6: Commit**

```bash
cd /Users/mdm/Desktop/hidu
git add backend/
git commit -m "feat: add Menu resolver and service with CRUD operations"
```

---

### Task 2.3: Seed Initial Menu Data

**Files:**
- Create: `backend/src/seed/seed.service.ts`
- Create: `backend/src/seed/seed.module.ts`
- Create: `backend/src/seed/data/menu-items.data.ts`

**Step 1: Create seed data from existing menu.ts**

Create: `backend/src/seed/data/menu-items.data.ts`

Copy data từ `/Users/mdm/Desktop/hidu/src/data/menu.ts` và convert:

```typescript
export const MENU_ITEMS_SEED = [
  {
    id: 'cf-001',
    name: 'Cà phê đen',
    description: 'Cà phê phin truyền thống, đậm đà hương vị Việt',
    price: 15000,
    category: 'coffee',
    imageUrl: '/images/menu/ca-phe-den.jpg',
    isPopular: false,
  },
  {
    id: 'cf-002',
    name: 'Cà phê sữa',
    description: 'Cà phê sữa đặc truyền thống',
    price: 15000,
    category: 'coffee',
    imageUrl: '/images/menu/ca-phe-sua.jpg',
    isPopular: false,
  },
  {
    id: 'cf-003',
    name: 'Cà phê muối',
    description: 'Cà phê đặc biệt với kem muối',
    price: 18000,
    category: 'coffee',
    imageUrl: '/images/menu/ca-phe-muoi.jpg',
    isPopular: true,
  },
  // ... (copy all items from menu.ts)
];
```

**Step 2: Create seed service**

Create: `backend/src/seed/seed.service.ts`

```typescript
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MenuItem, MenuItemDocument } from '../menu/schemas/menu-item.schema';
import { MENU_ITEMS_SEED } from './data/menu-items.data';

@Injectable()
export class SeedService {
  constructor(
    @InjectModel(MenuItem.name) private menuItemModel: Model<MenuItemDocument>,
  ) {}

  async seedMenuItems() {
    const count = await this.menuItemModel.countDocuments();
    if (count > 0) {
      console.log('Menu items already seeded, skipping...');
      return;
    }

    await this.menuItemModel.insertMany(MENU_ITEMS_SEED);
    console.log(`✅ Seeded ${MENU_ITEMS_SEED.length} menu items`);
  }

  async seedAll() {
    console.log('🌱 Starting database seed...');
    await this.seedMenuItems();
    console.log('✅ Seed complete!');
  }
}
```

**Step 3: Create seed module**

Create: `backend/src/seed/seed.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SeedService } from './seed.service';
import { MenuItem, MenuItemSchema } from '../menu/schemas/menu-item.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MenuItem.name, schema: MenuItemSchema },
    ]),
  ],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}
```

**Step 4: Create seed script**

Create: `backend/src/seed.ts`

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SeedService } from './seed/seed.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const seedService = app.get(SeedService);

  await seedService.seedAll();

  await app.close();
}

bootstrap();
```

**Step 5: Import SeedModule in AppModule**

Modify: `backend/src/app.module.ts` - add SeedModule to imports

**Step 6: Add seed script to package.json**

Modify: `backend/package.json`

```json
{
  "scripts": {
    "seed": "ts-node src/seed.ts"
  }
}
```

**Step 7: Run seed**

```bash
cd /Users/mdm/Desktop/hidu/backend
npm run seed
```

Expected: "✅ Seeded X menu items"

**Step 8: Test query again**

GraphQL Playground:

```graphql
query {
  menuItems {
    id
    name
    price
    category
  }
}
```

Expected: Returns all menu items

**Step 9: Commit**

```bash
cd /Users/mdm/Desktop/hidu
git add backend/
git commit -m "feat: add seed service and initial menu data"
```

---

## Phase 3: Remaining Schemas & Modules

Following the same pattern as Menu, create modules for:

### Task 3.1: Promotions Module
- Schema: `backend/src/promotions/schemas/promotion.schema.ts`
- Service & Resolver with CRUD
- Seed data from existing promotions

### Task 3.2: Banners Module
- Schema: `backend/src/banners/schemas/banner.schema.ts`
- Service & Resolver with CRUD operations

### Task 3.3: Shop Settings Module
- Schema: `backend/src/shop/schemas/shop-settings.schema.ts`
- Singleton pattern (only 1 document)
- Update mutation only

### Task 3.4: Orders Module
- Schema: `backend/src/orders/schemas/order.schema.ts`
- Auto-generate orderNumber
- Status workflow mutations

### Task 3.5: Inventory Module
- Schema: `backend/src/inventory/schemas/inventory.schema.ts`
- Link to MenuItem
- Auto-update stock on order

### Task 3.6: Users Module
- Schema: `backend/src/users/schemas/user.schema.ts`
- Password hashing with bcrypt
- Role-based fields

### Task 3.7: Analytics Module
- Schema: `backend/src/analytics/schemas/analytics.schema.ts`
- Aggregate queries from Orders
- Daily calculation cron job

*(Detailed steps for each module follow the same pattern as Task 2.1-2.3)*

---

## Phase 4: Authentication & Authorization

### Task 4.1: JWT Strategy

**Files:**
- Create: `backend/src/auth/strategies/jwt.strategy.ts`
- Create: `backend/src/auth/guards/jwt-auth.guard.ts`
- Create: `backend/src/auth/guards/roles.guard.ts`
- Create: `backend/src/auth/decorators/current-user.decorator.ts`
- Create: `backend/src/auth/decorators/roles.decorator.ts`

**Step 1: Create JWT strategy**

Create: `backend/src/auth/strategies/jwt.strategy.ts`

```typescript
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    return {
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}
```

**Step 2: Create auth guards**

Create: `backend/src/auth/guards/jwt-auth.guard.ts`

```typescript
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
```

Create: `backend/src/auth/guards/roles.guard.ts`

```typescript
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }

    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();
    const user = req.user;

    return roles.includes(user?.role);
  }
}
```

**Step 3: Create decorators**

Create: `backend/src/auth/decorators/current-user.decorator.ts`

```typescript
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req.user;
  },
);
```

Create: `backend/src/auth/decorators/roles.decorator.ts`

```typescript
import { SetMetadata } from '@nestjs/common';

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
```

**Step 4: Commit**

```bash
cd /Users/mdm/Desktop/hidu
git add backend/src/auth/
git commit -m "feat: add JWT authentication strategy and guards"
```

---

### Task 4.2: Auth Service & Resolver

**Files:**
- Create: `backend/src/auth/auth.service.ts`
- Create: `backend/src/auth/auth.resolver.ts`
- Create: `backend/src/auth/auth.module.ts`
- Create: `backend/src/auth/dto/login.input.ts`
- Create: `backend/src/auth/entities/auth-response.entity.ts`

**Step 1: Create DTOs and entities**

Create: `backend/src/auth/dto/login.input.ts`

```typescript
import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsString, MinLength } from 'class-validator';

@InputType()
export class LoginInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsString()
  @MinLength(6)
  password: string;
}
```

Create: `backend/src/auth/entities/auth-response.entity.ts`

```typescript
import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class UserEntity {
  @Field()
  id: string;

  @Field()
  email: string;

  @Field()
  fullName: string;

  @Field()
  role: string;
}

@ObjectType()
export class AuthResponse {
  @Field()
  accessToken: string;

  @Field(() => UserEntity)
  user: UserEntity;
}
```

**Step 2: Create auth service**

Create: `backend/src/auth/auth.service.ts`

```typescript
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '../users/schemas/user.schema';
import { LoginInput } from './dto/login.input';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async login(loginInput: LoginInput) {
    const user = await this.userModel.findOne({ email: loginInput.email });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      loginInput.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    await this.userModel.findByIdAndUpdate(user._id, {
      lastLogin: new Date(),
    });

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user._id.toString(),
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    };
  }

  async validateUser(userId: string) {
    return this.userModel.findById(userId).exec();
  }
}
```

**Step 3: Create auth resolver**

Create: `backend/src/auth/auth.resolver.ts`

```typescript
import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { AuthResponse } from './entities/auth-response.entity';
import { LoginInput } from './dto/login.input';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthResponse)
  async login(@Args('input') loginInput: LoginInput) {
    return this.authService.login(loginInput);
  }
}
```

**Step 4: Create auth module**

Create: `backend/src/auth/auth.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { JwtStrategy } from './strategies/jwt.strategy';
import { User, UserSchema } from '../users/schemas/user.schema';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get('JWT_EXPIRES_IN') || '7d',
        },
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [AuthService, AuthResolver, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
```

**Step 5: Import AuthModule in AppModule**

**Step 6: Create seed for admin user**

Add to `backend/src/seed/seed.service.ts`:

```typescript
async seedAdminUser() {
  const count = await this.userModel.countDocuments();
  if (count > 0) {
    console.log('Users already seeded, skipping...');
    return;
  }

  const hashedPassword = await bcrypt.hash('admin123456', 10);

  await this.userModel.create({
    email: 'admin@hidu.com',
    password: hashedPassword,
    fullName: 'Admin User',
    role: 'admin',
    isActive: true,
  });

  console.log('✅ Seeded admin user (admin@hidu.com / admin123456)');
}
```

**Step 7: Run seed**

```bash
cd /Users/mdm/Desktop/hidu/backend
npm run seed
```

**Step 8: Test login**

GraphQL Playground:

```graphql
mutation {
  login(input: { email: "admin@hidu.com", password: "admin123456" }) {
    accessToken
    user {
      email
      fullName
      role
    }
  }
}
```

Expected: Returns token and user info

**Step 9: Commit**

```bash
cd /Users/mdm/Desktop/hidu
git add backend/
git commit -m "feat: add auth service, resolver, and admin seed"
```

---

### Task 4.3: Protect Admin Mutations

**Files:**
- Modify: `backend/src/menu/menu.resolver.ts`
- Modify: All other resolvers with admin mutations

**Step 1: Add guards to menu mutations**

Modify: `backend/src/menu/menu.resolver.ts`

```typescript
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Resolver(() => MenuItemEntity)
export class MenuResolver {
  // ... queries remain public

  @Mutation(() => MenuItemEntity)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async createMenuItem(@Args('input') input: CreateMenuItemInput) {
    return this.menuService.create(input);
  }

  @Mutation(() => MenuItemEntity)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async updateMenuItem(/* ... */) {
    // ...
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async deleteMenuItem(/* ... */) {
    // ...
  }

  @Mutation(() => MenuItemEntity)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'staff')
  async toggleMenuItemAvailability(/* ... */) {
    // ...
  }
}
```

**Step 2: Apply same pattern to all resolvers**

**Step 3: Test protected mutation without token**

Should return 401 Unauthorized

**Step 4: Test with token**

Add header in GraphQL Playground:
```json
{
  "Authorization": "Bearer YOUR_TOKEN_HERE"
}
```

**Step 5: Commit**

```bash
cd /Users/mdm/Desktop/hidu
git add backend/
git commit -m "feat: protect admin mutations with JWT guards"
```

---

## Phase 5: File Upload Service

### Task 5.1: Cloudinary Upload

**Files:**
- Create: `backend/src/upload/upload.service.ts`
- Create: `backend/src/upload/upload.resolver.ts`
- Create: `backend/src/upload/upload.module.ts`

**Step 1: Create upload service**

Create: `backend/src/upload/upload.service.ts`

```typescript
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class UploadService {
  constructor(private configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadToCloudinary(
    file: Express.Multer.File,
    folder: string = 'hidu',
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        { folder },
        (error, result) => {
          if (error) return reject(error);
          resolve(result.secure_url);
        },
      );

      Readable.from(file.buffer).pipe(upload);
    });
  }
}
```

**Step 2: Create upload resolver**

Create: `backend/src/upload/upload.resolver.ts`

```typescript
import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GraphQLUpload, FileUpload } from 'graphql-upload';
import { UploadService } from './upload.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Resolver()
export class UploadResolver {
  constructor(private readonly uploadService: UploadService) {}

  @Mutation(() => String)
  @UseGuards(JwtAuthGuard)
  async uploadImage(
    @Args({ name: 'file', type: () => GraphQLUpload })
    file: FileUpload,
  ): Promise<string> {
    const { createReadStream, filename, mimetype } = await file;

    // Convert to buffer
    const chunks = [];
    for await (const chunk of createReadStream()) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    const multerFile: Express.Multer.File = {
      buffer,
      originalname: filename,
      mimetype,
    } as any;

    return this.uploadService.uploadToCloudinary(multerFile);
  }
}
```

**Step 3: Install graphql-upload**

```bash
cd /Users/mdm/Desktop/hidu/backend
npm install graphql-upload
npm install -D @types/graphql-upload
```

**Step 4: Configure GraphQL for file upload**

Modify: `backend/src/app.module.ts`

Add to GraphQLModule config:
```typescript
GraphQLModule.forRoot<ApolloDriverConfig>({
  // ... existing config
  uploads: false, // Disable built-in upload
}),
```

**Step 5: Create upload module**

Create: `backend/src/upload/upload.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadResolver } from './upload.resolver';

@Module({
  providers: [UploadService, UploadResolver],
  exports: [UploadService],
})
export class UploadModule {}
```

**Step 6: Import in AppModule**

**Step 7: Commit**

```bash
cd /Users/mdm/Desktop/hidu
git add backend/
git commit -m "feat: add Cloudinary image upload service"
```

---

## Phase 6: Astro Frontend Integration

### Task 6.1: Enable Astro SSR Mode

**Files:**
- Modify: `astro.config.mjs`
- Create: `src/lib/graphql-client.ts`

**Step 1: Install Astro Node adapter**

```bash
cd /Users/mdm/Desktop/hidu
npm install @astrojs/node
```

**Step 2: Update Astro config for SSR**

Modify: `astro.config.mjs`

```javascript
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import node from '@astrojs/node';

export default defineConfig({
  output: 'server',
  adapter: node({
    mode: 'standalone',
  }),
  integrations: [tailwind(), sitemap()],
});
```

**Step 3: Install GraphQL client**

```bash
npm install @apollo/client graphql
```

**Step 4: Create GraphQL client**

Create: `src/lib/graphql-client.ts`

```typescript
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const httpLink = new HttpLink({
  uri: import.meta.env.GRAPHQL_API_URL || 'http://localhost:4000/graphql',
  credentials: 'include',
});

export const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  ssrMode: typeof window === 'undefined',
});
```

**Step 5: Create .env file for frontend**

Create: `.env`

```env
GRAPHQL_API_URL=http://localhost:4000/graphql
```

**Step 6: Commit**

```bash
git add astro.config.mjs src/lib/graphql-client.ts .env package.json
git commit -m "feat: enable Astro SSR and add GraphQL client"
```

---

### Task 6.2: Update Menu Page to Fetch from API

**Files:**
- Modify: `src/pages/menu.astro`
- Create: `src/lib/queries/menu.queries.ts`

**Step 1: Create GraphQL queries**

Create: `src/lib/queries/menu.queries.ts`

```typescript
import { gql } from '@apollo/client';

export const GET_MENU_ITEMS = gql`
  query GetMenuItems($category: String, $isAvailable: Boolean) {
    menuItems(category: $category, isAvailable: $isAvailable) {
      id
      name
      description
      price
      priceLarge
      category
      imageUrl
      isPopular
      isBestSeller
      isNew
      isAvailable
    }
  }
`;

export const GET_CATEGORIES = gql`
  query GetCategories {
    categories
  }
`;
```

**Step 2: Update menu.astro**

Modify: `src/pages/menu.astro`

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import MenuGrid from '../components/sections/MenuGrid.astro';
import { apolloClient } from '../lib/graphql-client';
import { GET_MENU_ITEMS, GET_CATEGORIES } from '../lib/queries/menu.queries';

// Fetch from GraphQL instead of import
const { data } = await apolloClient.query({
  query: GET_MENU_ITEMS,
  variables: { isAvailable: true },
});

const menuItems = data.menuItems;

const { data: categoriesData } = await apolloClient.query({
  query: GET_CATEGORIES,
});

const categories = categoriesData.categories;
---

<BaseLayout
  title="Thực đơn - Hidu Coffee"
  description="Khám phá thực đơn đa dạng tại Hidu Coffee"
>
  <MenuGrid menuItems={menuItems} categories={categories} />
</BaseLayout>
```

**Step 3: Test menu page**

```bash
npm run dev
```

Visit http://localhost:4321/menu

Expected: Menu items loaded from backend

**Step 4: Commit**

```bash
git add src/pages/menu.astro src/lib/queries/
git commit -m "feat: update menu page to fetch from GraphQL API"
```

---

### Task 6.3: Create Admin Login Page

**Files:**
- Create: `src/pages/admin/login.astro`
- Create: `src/lib/auth.ts`
- Create: `src/middleware/index.ts`

**Step 1: Create auth utilities**

Create: `src/lib/auth.ts`

```typescript
import { ApolloClient, gql } from '@apollo/client';

const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(input: { email: $email, password: $password }) {
      accessToken
      user {
        email
        fullName
        role
      }
    }
  }
`;

export async function login(
  client: ApolloClient<any>,
  email: string,
  password: string,
) {
  const { data } = await client.mutate({
    mutation: LOGIN_MUTATION,
    variables: { email, password },
  });

  return data.login;
}

export function setAuthToken(token: string) {
  if (typeof document !== 'undefined') {
    document.cookie = `auth-token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; samesite=strict`;
  }
}

export function getAuthToken(request: Request): string | null {
  const cookies = request.headers.get('cookie');
  if (!cookies) return null;

  const match = cookies.match(/auth-token=([^;]+)/);
  return match ? match[1] : null;
}

export function clearAuthToken() {
  if (typeof document !== 'undefined') {
    document.cookie = 'auth-token=; path=/; max-age=0';
  }
}
```

**Step 2: Create admin login page**

Create: `src/pages/admin/login.astro`

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';

const error = Astro.url.searchParams.get('error');
---

<BaseLayout title="Admin Login - Hidu">
  <div class="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Admin Login
        </h2>
      </div>

      {error && (
        <div class="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <form class="mt-8 space-y-6" method="POST" action="/api/auth/login">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="email" class="sr-only">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-amber-500 focus:border-amber-500 focus:z-10 sm:text-sm"
              placeholder="Email"
            />
          </div>
          <div>
            <label for="password" class="sr-only">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-amber-500 focus:border-amber-500 focus:z-10 sm:text-sm"
              placeholder="Password"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
          >
            Đăng nhập
          </button>
        </div>
      </form>
    </div>
  </div>
</BaseLayout>
```

**Step 3: Create login API endpoint**

Create: `src/pages/api/auth/login.ts`

```typescript
import type { APIRoute } from 'astro';
import { apolloClient } from '../../../lib/graphql-client';
import { login, setAuthToken } from '../../../lib/auth';

export const POST: APIRoute = async ({ request, redirect }) => {
  const formData = await request.formData();
  const email = formData.get('email')?.toString();
  const password = formData.get('password')?.toString();

  if (!email || !password) {
    return redirect('/admin/login?error=Missing credentials');
  }

  try {
    const result = await login(apolloClient, email, password);

    // Set cookie
    const response = redirect('/admin/dashboard');
    response.headers.set(
      'Set-Cookie',
      `auth-token=${result.accessToken}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${7 * 24 * 60 * 60}`
    );

    return response;
  } catch (error) {
    return redirect('/admin/login?error=Invalid credentials');
  }
};
```

**Step 4: Test login**

Visit http://localhost:4321/admin/login
Login with: admin@hidu.com / admin123456

**Step 5: Commit**

```bash
git add src/pages/admin/ src/lib/auth.ts src/pages/api/
git commit -m "feat: add admin login page and auth API"
```

---

## Phase 7: Admin Dashboard Pages

### Task 7.1: Admin Dashboard Layout

**Files:**
- Create: `src/layouts/AdminLayout.astro`
- Create: `src/components/admin/Sidebar.astro`
- Create: `src/components/admin/Header.astro`

*(Detailed implementation of admin dashboard UI components)*

### Task 7.2: Menu Management Page

**Files:**
- Create: `src/pages/admin/menu.astro`
- Create: `src/components/admin/MenuTable.astro`
- Create: `src/components/admin/MenuForm.astro`

*(CRUD interface for menu items)*

### Task 7.3: Orders Management

**Files:**
- Create: `src/pages/admin/orders.astro`
- Create: `src/components/admin/OrdersList.astro`
- Create: `src/components/admin/OrderDetails.astro`

*(Order management with status updates)*

### Task 7.4: Analytics Dashboard

**Files:**
- Create: `src/pages/admin/analytics.astro`
- Create: `src/components/admin/RevenueChart.astro`
- Create: `src/components/admin/BestSellersChart.astro`

*(Charts and analytics display)*

---

## Phase 8: E-commerce Flow

### Task 8.1: Shopping Cart (Client-side)

**Files:**
- Create: `src/components/cart/CartButton.astro`
- Create: `src/pages/cart.astro`
- Create: `src/lib/cart-store.ts` (using nanostores or similar)

### Task 8.2: Checkout Page

**Files:**
- Create: `src/pages/checkout.astro`
- Create: `src/components/checkout/CheckoutForm.astro`
- Create: `src/components/checkout/PaymentMethods.astro`

### Task 8.3: Order Confirmation

**Files:**
- Create: `src/pages/order/[orderId].astro`
- Create: `src/pages/api/orders/create.ts`

---

## Phase 9: Payment Integration

### Task 9.1: VNPay Integration

**Files:**
- Create: `backend/src/payment/vnpay.service.ts`
- Create: `backend/src/payment/payment.resolver.ts`
- Create: `src/pages/api/payment/vnpay-callback.ts`

*(VNPay payment flow implementation)*

### Task 9.2: MoMo Integration

*(Similar to VNPay)*

### Task 9.3: ZaloPay Integration

*(Similar to VNPay)*

---

## Testing & Deployment

### Task 10.1: Environment Configuration

**Files:**
- Create: `backend/.env.production`
- Create: `.env.production`
- Create: `docker-compose.yml` (optional)

### Task 10.2: Deploy Backend

- Setup MongoDB Atlas
- Deploy to Railway/Render
- Configure environment variables
- Test API endpoints

### Task 10.3: Deploy Frontend

- Deploy to Vercel/Netlify
- Configure environment variables
- Test SSR pages

---

## Success Criteria

- [ ] Backend GraphQL API running with all CRUD operations
- [ ] JWT authentication working
- [ ] Menu, Promotions, Banners managed through admin
- [ ] Orders can be created and tracked
- [ ] Inventory auto-updates on orders
- [ ] Analytics showing revenue and best sellers
- [ ] Image upload to Cloudinary working
- [ ] Landing page fetches dynamic data
- [ ] Admin dashboard fully functional
- [ ] Payment integration (at least 1 method) working
- [ ] Deployed to production

---

**Next Steps:** Use `superpowers:executing-plans` or `superpowers:subagent-driven-development` to implement this plan.
