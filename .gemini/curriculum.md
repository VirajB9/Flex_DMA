# 📚 Curriculum — Flex DMA (Spring Boot + MongoDB)

## Phase 1: Understanding What You Have ✅ (current)
- Project architecture overview
- How Spring Boot starts (main class, bootstrap runners)
- application.yml profiles (dev vs prod)
- Running the app locally

## Phase 2: Core Concepts (Entity → Repository → Service → Controller)
- MongoDB documents vs SQL tables
- `@Document`, `@Id`, `@Indexed` annotations
- Spring Data MongoDB repositories
- Service layer patterns & business logic
- REST controllers & `@PreAuthorize`
- DTOs vs Entities (why separate?)

## Phase 3: Security Deep Dive
- Spring Security filter chain
- JWT token flow (login → token → filter → auth)
- BCrypt password hashing
- Role-based vs Permission-based authorization
- `@EnableMethodSecurity` and `@PreAuthorize`

## Phase 4: Production Patterns
- Global exception handling (`@RestControllerAdvice`)
- API response wrappers
- Validation (`@Valid`, Jakarta Bean Validation)
- Soft delete pattern
- MongoDB auditing (`@CreatedDate`, `@LastModifiedDate`)

## Phase 5: Building New Features
- Add Client module (entity, repo, service, controller, DTOs)
- Add Lead module
- Add Project module
- Add Invoice module

## Phase 6: Fixing Issues & Refactoring
- Wire auth exceptions into GlobalExceptionHandler
- Implement empty stubs (UserMapper, JwtAuthenticationEntryPoint, etc.)
- Add `/health` to security whitelist
- Wrap auth controller responses in ApiResponse
