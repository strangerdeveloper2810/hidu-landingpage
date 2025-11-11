import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MenuResolver } from './menu.resolver';
import { MenuService } from './menu.service';
import { MenuItem, MenuItemSchema } from './schemas/menu-item.schema';

/**
 * MenuModule - Feature Module
 *
 * @Module() decorator:
 * Định nghĩa 1 module trong NestJS
 * Module = Container cho 1 feature (Menu feature)
 *
 * So sánh với Spring Boot:
 * - @Module() ~ @Configuration
 * - imports ~ @Import
 * - providers ~ @Bean methods
 * - exports ~ public beans
 *
 * Module Pattern Benefits:
 * - Encapsulation: Đóng gói feature logic
 * - Reusability: Dễ dàng import vào modules khác
 * - Maintainability: Tách biệt features
 * - Lazy loading: Load module khi cần (microservices)
 */
@Module({
  /**
   * imports: []
   * Import các modules khác mà feature này cần dùng
   *
   * MongooseModule.forFeature():
   * - Register Mongoose schemas cho module này
   * - Tạo Model từ Schema
   * - Model sẽ được inject vào Service (@InjectModel)
   *
   * Array of { name, schema }:
   * - name: MenuItem.name = "MenuItem" (tên schema)
   * - schema: MenuItemSchema (schema definition)
   *
   * So sánh Spring Boot:
   * @EnableJpaRepositories(basePackages = "com.example.menu")
   */
  imports: [
    MongooseModule.forFeature([
      { name: MenuItem.name, schema: MenuItemSchema },
    ]),
  ],

  /**
   * providers: []
   * Declare các providers (services, repositories) của module này
   *
   * Provider = Class có @Injectable() decorator
   * NestJS DI container sẽ:
   * 1. Instantiate providers
   * 2. Resolve dependencies (constructor injection)
   * 3. Make available trong module scope
   *
   * Providers trong module này:
   * - MenuResolver: GraphQL endpoints (có thể coi như provider)
   * - MenuService: Business logic
   *
   * So sánh Spring Boot:
   * @ComponentScan(basePackages = "com.example.menu")
   * @Bean methods trong @Configuration
   */
  providers: [
    MenuResolver, // GraphQL resolver
    MenuService, // Business logic service
  ],

  /**
   * exports: []
   * Export providers để modules khác có thể dùng
   *
   * Nếu MenuService được export:
   * - Modules khác import MenuModule
   * - Có thể inject MenuService
   *
   * Example:
   * @Module({
   *   imports: [MenuModule],  // Import MenuModule
   * })
   * export class OrderModule {
   *   constructor(private menuService: MenuService) {}
   *   // Có thể dùng menuService
   * }
   *
   * Current: Export MenuService để OrderModule có thể dùng sau
   */
  exports: [MenuService],
})
export class MenuModule {}

/**
 * Module Lifecycle:
 *
 * 1. NestJS scan @Module() decorators
 * 2. Build dependency graph
 * 3. Instantiate modules theo order
 * 4. For each module:
 *    a. Import dependencies (imports)
 *    b. Instantiate providers
 *    c. Resolve constructor dependencies
 *    d. Make exports available
 * 5. Application ready
 *
 * Feature Module Pattern:
 *
 * menu/
 * ├── schemas/           # Database models
 * ├── entities/          # GraphQL output types
 * ├── dto/              # Input types + validation
 * ├── menu.service.ts    # Business logic
 * ├── menu.resolver.ts   # GraphQL endpoints
 * └── menu.module.ts     # Module definition (đóng gói tất cả)
 *
 * Module Benefits:
 * - Separation of Concerns: Mỗi feature 1 module
 * - Dependency Management: Clear dependencies
 * - Testing: Dễ dàng mock dependencies
 * - Scalability: Dễ split thành microservices
 *
 * Module Types trong NestJS:
 *
 * 1. Feature Module (MenuModule):
 *    - Implement 1 feature cụ thể
 *    - Import vào AppModule
 *
 * 2. Shared Module:
 *    - Chứa code dùng chung (utils, helpers)
 *    - Export để modules khác dùng
 *
 * 3. Global Module (@Global()):
 *    - Available cho tất cả modules
 *    - Không cần import
 *
 * 4. Dynamic Module:
 *    - Configure runtime (như ConfigModule, DatabaseModule)
 *    - .forRoot(), .forFeature() pattern
 */
