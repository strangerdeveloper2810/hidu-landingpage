import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { MenuService } from './menu.service';
import { MenuItemEntity } from './entities/menu-item.entity';
import { CreateMenuItemInput } from './dto/create-menu-item.input';
import { UpdateMenuItemInput } from './dto/update-menu-item.input';

/**
 * MenuResolver - GraphQL Endpoints Layer
 *
 * @Resolver(() => MenuItemEntity):
 * - Đánh dấu class là GraphQL resolver
 * - () => MenuItemEntity: Resolver này handle MenuItemEntity type
 *
 * Resolver Pattern:
 * 1. Nhận request từ GraphQL client
 * 2. Extract arguments (@Args)
 * 3. Call Service method (business logic)
 * 4. Return result (Service đã xử lý)
 *
 * Thin Resolver Principle:
 * - Resolver KHÔNG chứa business logic
 * - Chỉ là "cầu nối" giữa GraphQL và Service
 * - All logic nằm trong Service
 */
@Resolver(() => MenuItemEntity)
export class MenuResolver {
  /**
   * Constructor Injection
   *
   * Inject MenuService vào resolver
   * private menuService: Chỉ dùng trong class này
   */
  constructor(private readonly menuService: MenuService) {}

  /**
   * @Query() Decorator - GraphQL Query (READ operations)
   *
   * Syntax:
   * @Query(() => ReturnType, { options })
   *
   * Options:
   * - name: 'customName' → GraphQL query name
   * - nullable: true → Có thể return null
   * - description: 'text' → GraphQL schema description
   */

  /**
   * menuItems Query - Lấy danh sách menu items
   *
   * @Query(() => [MenuItemEntity]):
   * - Return type: Array of MenuItemEntity
   * - [Type] = Array trong GraphQL
   * - name: 'menuItems' (tên query trong GraphQL)
   *
   * @Args():
   * - Extract arguments từ GraphQL query
   * - { nullable: true } = Argument không bắt buộc
   *
   * GraphQL Query Example:
   * query {
   *   menuItems(category: "coffee", isAvailable: true) {
   *     id
   *     name
   *     price
   *   }
   * }
   */
  @Query(() => [MenuItemEntity], { name: 'menuItems' })
  async findAll(
    @Args('category', { nullable: true }) category?: string,
    @Args('isAvailable', { nullable: true }) isAvailable?: boolean,
  ) {
    // Gọi service method, service xử lý logic
    return this.menuService.findAll(category, isAvailable);
  }

  /**
   * menuItem Query - Lấy 1 menu item by ID
   *
   * @Query(() => MenuItemEntity, { nullable: true }):
   * - Return type: Single MenuItemEntity hoặc null
   * - nullable: true = Có thể return null (not found)
   *
   * GraphQL Query Example:
   * query {
   *   menuItem(id: "cf-001") {
   *     id
   *     name
   *     price
   *     category
   *   }
   * }
   */
  @Query(() => MenuItemEntity, { name: 'menuItem', nullable: true })
  async findOne(@Args('id') id: string) {
    return this.menuService.findOne(id);
  }

  /**
   * categories Query - Lấy danh sách categories
   *
   * @Query(() => [String]):
   * - Return type: Array of String
   * - String = GraphQL built-in scalar type
   *
   * GraphQL Query Example:
   * query {
   *   categories
   * }
   *
   * Response:
   * {
   *   "data": {
   *     "categories": ["coffee", "matcha", "juice", "cacao"]
   *   }
   * }
   */
  @Query(() => [String], { name: 'categories' })
  async findCategories() {
    return this.menuService.findCategories();
  }

  /**
   * @Mutation() Decorator - GraphQL Mutation (WRITE operations)
   *
   * Syntax giống @Query():
   * @Mutation(() => ReturnType, { options })
   *
   * Mutations dùng cho:
   * - Create
   * - Update
   * - Delete
   * - Any operation thay đổi data
   */

  /**
   * createMenuItem Mutation - Tạo menu item mới
   *
   * @Mutation(() => MenuItemEntity):
   * - Return type: MenuItemEntity (item vừa tạo)
   *
   * @Args('input'):
   * - Extract argument với key 'input'
   * - Type: CreateMenuItemInput (auto validate)
   *
   * GraphQL Mutation Example:
   * mutation {
   *   createMenuItem(input: {
   *     id: "cf-008"
   *     name: "Cà phê sữa dừa"
   *     description: "Cà phê với sữa dừa thơm ngon"
   *     price: 20000
   *     category: "coffee"
   *     imageUrl: "https://example.com/image.jpg"
   *   }) {
   *     _id
   *     id
   *     name
   *     price
   *   }
   * }
   */
  @Mutation(() => MenuItemEntity)
  async createMenuItem(@Args('input') input: CreateMenuItemInput) {
    return this.menuService.create(input);
  }

  /**
   * updateMenuItem Mutation - Update menu item
   *
   * @Args('id') - Argument đầu tiên: ID cần update
   * @Args('input') - Argument thứ 2: Data cần update
   *
   * GraphQL Mutation Example:
   * mutation {
   *   updateMenuItem(
   *     id: "cf-001"
   *     input: {
   *       price: 18000
   *       isAvailable: false
   *     }
   *   ) {
   *     id
   *     name
   *     price
   *     isAvailable
   *   }
   * }
   */
  @Mutation(() => MenuItemEntity)
  async updateMenuItem(
    @Args('id') id: string,
    @Args('input') input: UpdateMenuItemInput,
  ) {
    return this.menuService.update(id, input);
  }

  /**
   * deleteMenuItem Mutation - Xóa menu item
   *
   * @Mutation(() => Boolean):
   * - Return type: Boolean (true = success)
   *
   * GraphQL Mutation Example:
   * mutation {
   *   deleteMenuItem(id: "cf-001")
   * }
   *
   * Response:
   * {
   *   "data": {
   *     "deleteMenuItem": true
   *   }
   * }
   */
  @Mutation(() => Boolean)
  async deleteMenuItem(@Args('id') id: string) {
    return this.menuService.delete(id);
  }

  /**
   * toggleMenuItemAvailability Mutation - Bật/tắt available
   *
   * GraphQL Mutation Example:
   * mutation {
   *   toggleMenuItemAvailability(id: "cf-001") {
   *     id
   *     isAvailable
   *   }
   * }
   */
  @Mutation(() => MenuItemEntity)
  async toggleMenuItemAvailability(@Args('id') id: string) {
    return this.menuService.toggleAvailability(id);
  }
}

/**
 * GraphQL Query vs Mutation:
 *
 * Query (READ):
 * - Không thay đổi data
 * - Có thể cache
 * - Idempotent (gọi nhiều lần = same result)
 * - GET trong REST
 *
 * Mutation (WRITE):
 * - Thay đổi data
 * - Không cache
 * - Có side effects
 * - POST/PUT/DELETE trong REST
 *
 * Resolver Flow:
 *
 * Client gửi GraphQL request
 *     ↓
 * Resolver nhận request
 *     ↓
 * @Args extract arguments
 *     ↓
 * ValidationPipe validate (DTOs)
 *     ↓
 * Call Service method
 *     ↓
 * Service xử lý business logic
 *     ↓
 * Service return result
 *     ↓
 * Resolver return to client
 *     ↓
 * GraphQL format response
 */
