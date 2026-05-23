# Angular Coding Guidelines

This document defines Angular-specific coding standards and best practices for Angular projects.

## Table of Contents

- [Core Principles](#core-principles)
- [Component Architecture](#component-architecture)
- [Signals and Reactivity](#signals-and-reactivity)
- [Dependency Injection](#dependency-injection)
- [Template Syntax](#template-syntax)
- [State Management](#state-management)
- [RxJS Patterns](#rxjs-patterns)
- [Directives and Pipes](#directives-and-pipes)
- [Forms](#forms)
- [Styling](#styling)
- [File Organization](#file-organization)

---

## Core Principles

### Standalone Components

**All components, directives, and pipes must be standalone.** No NgModules except for root `AppComponent`.

**Note:** Since standalone is now the default in modern Angular, you should **not** explicitly add `standalone: true` to your component decorator. It's the default behavior.

```typescript
// ✅ DO: Standalone component (standalone is default, no need to specify)
@Component({
  selector: 'app-dashboard',
  imports: [MatCardModule, MatButtonModule, MatIconModule],
  template: `...`,
})
export class DashboardComponent {}

// ❌ DON'T: Explicitly add standalone: true (unnecessary)
@Component({
  selector: 'app-dashboard',
  standalone: true, // NOT NEEDED - this is now the default
  imports: [MatCardModule, MatButtonModule],
  template: `...`,
})
export class DashboardComponent {}

// ❌ DON'T: Module-based component
@NgModule({
  declarations: [DashboardComponent],
  imports: [MatCardModule],
})
export class DashboardModule {}
```

### Signal-Based Reactivity

**Use signals for all component state.** Prefer signals over RxJS Observables for component-local state.

```typescript
// ✅ DO: Signals for component state
export class MyComponent {
  readonly count = signal(0);
  readonly isLoading = signal(false);
  readonly items = signal<Item[]>([]);

  readonly doubledCount = computed(() => this.count() * 2);
}

// ❌ DON'T: BehaviorSubject for component state
export class MyComponent {
  #countSubject = new BehaviorSubject(0);
  count$ = this.#countSubject.asObservable();
}
```

### Inline Templates

**Always use inline templates.** No separate `.html` files.

```typescript
// ✅ DO: Inline template
@Component({
  selector: 'app-user-card',
  template: `
    <div class="user-card">
      <h3>{{ user().name }}</h3>
      <p>{{ user().email }}</p>
    </div>
  `,
})
export class UserCardComponent {}

// ❌ DON'T: External template file
@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
})
export class UserCardComponent {}
```

### No Separate Style Files

**Use Tailwind utility classes in templates.** No component-specific CSS files.

```typescript
// ✅ DO: Tailwind classes in template
@Component({
  template: `
    <div class="flex items-center gap-4 p-6 bg-white rounded-lg shadow-md">
      <h2 class="text-2xl font-bold text-gray-900">{{ title() }}</h2>
    </div>
  `,
})
export class MyComponent {}

// ❌ DON'T: External styles
@Component({
  template: `<div class="container">...</div>`,
  styleUrls: ['./my-component.component.css'],
})
export class MyComponent {}
```

---

## Component Architecture

### Component Structure

Components should follow this order:

1. Imports
2. Component decorator with metadata
3. Class declaration
4. Injected dependencies (using `inject()`)
5. Signals (state)
6. Computed signals (derived state)
7. Constructor (prefer for initialization)
8. Lifecycle hooks (only if needed)
9. Public methods
10. Private methods

```typescript
import { Component, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { DataStore } from '@myapp/data-access';

/**
 * Dashboard Component
 * Main dashboard view
 */
@Component({
  selector: 'app-dashboard',
  imports: [MatButtonModule],
  template: `
    <div class="max-w-4xl mx-auto">
      <h1>{{ title() }}</h1>
      <button (click)="handleClick()">Click me</button>
    </div>
  `,
})
export class DashboardComponent {
  // Injected dependencies
  readonly #dataStore = inject(DataStore);

  // Signals (state)
  readonly title = signal('Dashboard');
  readonly isLoading = signal(false);

  // Computed signals (derived state)
  readonly hasItems = computed(() => this.#dataStore.items().length > 0);

  // Constructor - prefer for initialization
  constructor() {
    this.#loadData();
  }

  // Public methods
  handleClick(): void {
    this.title.set('Clicked!');
  }

  // Private methods
  async #loadData(): Promise<void> {
    this.isLoading.set(true);
    // Load data
    this.isLoading.set(false);
  }
}
```

### Component Naming

- **Component class**: `PascalCase` + `Component` suffix
- **Selector**: `app-` prefix, `kebab-case`
- **File name**: `kebab-case` + `.component.ts`

```typescript
// ✅ DO: Consistent naming
// File: dashboard.component.ts
@Component({
  selector: 'app-dashboard',
})
export class DashboardComponent {}

// File: item-selector.component.ts
@Component({
  selector: 'app-item-selector',
})
export class ItemSelectorComponent {}
```

### Lifecycle Hooks: Constructor vs OnInit

**Prefer constructor for initialization.** Only use `OnInit` when you need inputs to be settled first.

```typescript
// ✅ DO: Use constructor for initialization without input dependencies
@Component({
  selector: 'app-dashboard',
  template: `<div>{{ data() }}</div>`,
})
export class DashboardComponent {
  readonly #dataService = inject(DataService);
  readonly data = signal<string>('');

  constructor() {
    // Initialize immediately - no input dependencies
    this.#loadData();
  }

  async #loadData(): Promise<void> {
    const result = await this.#dataService.fetchData();
    this.data.set(result);
  }
}

// ✅ DO: Use OnInit when depending on inputs
@Component({
  selector: 'app-user-profile',
  template: `<div>{{ userDetails() }}</div>`,
})
export class UserProfileComponent implements OnInit {
  readonly #userService = inject(UserService);

  // Input that needs to be settled before initialization
  readonly userId = input.required<string>();

  readonly userDetails = signal<User | null>(null);

  ngOnInit(): void {
    // Now userId() is available and settled
    this.#loadUser(this.userId());
  }

  async #loadUser(id: string): Promise<void> {
    const user = await this.#userService.getUser(id);
    this.userDetails.set(user);
  }
}

// ✅ DO: Use effect when you need to react to input changes
@Component({
  selector: 'app-dynamic-profile',
  template: `<div>{{ userDetails() }}</div>`,
})
export class DynamicProfileComponent {
  readonly #userService = inject(UserService);
  readonly userId = input.required<string>();
  readonly userDetails = signal<User | null>(null);

  constructor() {
    // React to userId changes
    effect(() => {
      const id = this.userId();
      this.#loadUser(id);
    });
  }

  async #loadUser(id: string): Promise<void> {
    const user = await this.#userService.getUser(id);
    this.userDetails.set(user);
  }
}

// ❌ DON'T: Use OnInit unnecessarily
@Component({
  selector: 'app-simple',
})
export class SimpleComponent implements OnInit {
  readonly data = signal('Hello');

  ngOnInit(): void {
    // BAD: No input dependencies, use constructor instead
    this.#initializeData();
  }

  #initializeData(): void {
    // Implementation
  }
}
```

**When to use each:**

- **Constructor**: For initialization that doesn't depend on inputs (most cases)
- **OnInit**: Only when you need to wait for inputs to be settled
- **Effect**: When you need to react to input changes over time

### Component Inputs and Outputs

Use the new `input()` and `output()` functions.

```typescript
// ✅ DO: Signal inputs and outputs
import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-user-card',
  template: `
    <div (click)="onClick()">
      <h3>{{ user().name }}</h3>
    </div>
  `,
})
export class UserCardComponent {
  // Required input
  readonly user = input.required<User>();

  // Optional input with default
  readonly showAvatar = input(true);

  // Output event
  readonly userClick = output<User>();

  onClick(): void {
    this.userClick.emit(this.user());
  }
}

// ❌ DON'T: Old decorator-based inputs/outputs
@Component({
  selector: 'app-user-card',
})
export class UserCardComponent {
  @Input({ required: true }) user!: User;
  @Output() userClick = new EventEmitter<User>();
}
```

### View Queries

Use signal-based view queries.

```typescript
// ✅ DO: Signal-based view queries
import { Component, viewChild, viewChildren } from '@angular/core';
import { MatButton } from '@angular/material/button';

@Component({
  template: `
    <button #submitBtn mat-button>Submit</button>
    <button mat-button>Cancel</button>
  `,
})
export class FormComponent {
  // Single element query
  readonly submitButton = viewChild<MatButton>('submitBtn');

  // Multiple elements query
  readonly allButtons = viewChildren(MatButton);

  onSubmit(): void {
    const btn = this.submitButton();
    if (btn) {
      btn.disabled = true;
    }
  }
}

// ❌ DON'T: Decorator-based view queries
@Component({})
export class FormComponent {
  @ViewChild('submitBtn') submitButton?: MatButton;
  @ViewChildren(MatButton) allButtons?: QueryList<MatButton>;
}
```

---

## Signals and Reactivity

### Signal State

Use `signal()` for mutable state, `computed()` for derived state.

```typescript
// ✅ DO: Signals for state management
export class ItemSelectorComponent {
  // Mutable state
  readonly items = signal<Item[]>([]);
  readonly searchQuery = signal('');
  readonly isLoading = signal(false);

  // Derived/computed state
  readonly filteredItems = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) return this.items();

    return this.items().filter((item) =>
      `${item.name} ${item.description}`.toLowerCase().includes(query),
    );
  });

  readonly hasResults = computed(() => this.filteredItems().length > 0);
}
```

### Updating Signals

Always use `.set()` or `.update()` to modify signals.

```typescript
// ✅ DO: Use .set() for complete replacement
this.count.set(10);
this.user.set({ name: 'John', email: 'john@example.com' });

// ✅ DO: Use .update() for partial updates
this.count.update((current) => current + 1);
this.items.update((current) => [...current, newItem]);

// ❌ DON'T: Try to mutate signal value directly
this.items().push(newItem); // This won't trigger updates!
```

### No Function Calls in Templates

**Never call functions in templates to calculate view values.** Always use computed signals for derived state. This ensures optimal performance and prevents unnecessary recalculations during change detection cycles.

```typescript
// ❌ DON'T: Call functions in templates
@Component({
  template: `
    <div>Total: {{ calculateTotal() }}</div>
    <div>Discount: {{ getDiscount(item()) }}</div>
    @for (item of items(); track item.id) {
      <div>{{ formatPrice(item) }}</div>
    }
  `,
})
export class ShoppingComponent {
  readonly items = signal<Item[]>([]);
  readonly item = signal<Item | null>(null);

  // BAD: Functions called on every change detection cycle
  calculateTotal(): number {
    return this.items().reduce((sum, item) => sum + item.price, 0);
  }

  getDiscount(item: Item | null): number {
    return item ? item.price * 0.1 : 0;
  }

  formatPrice(item: Item): string {
    return `CHF ${item.price.toFixed(2)}`;
  }
}

// ✅ DO: Use computed signals
@Component({
  template: `
    <div>Total: {{ total() }}</div>
    <div>Discount: {{ discount() }}</div>
    @for (item of enrichedItems(); track item.id) {
      <div>{{ item.formattedPrice }}</div>
    }
  `,
})
export class ShoppingComponent {
  readonly items = signal<Item[]>([]);
  readonly item = signal<Item | null>(null);

  // Computed signals recalculate only when dependencies change
  readonly total = computed(() => {
    return this.items().reduce((sum, item) => sum + item.price, 0);
  });

  readonly discount = computed(() => {
    const currentItem = this.item();
    return currentItem ? currentItem.price * 0.1 : 0;
  });

  readonly enrichedItems = computed(() => {
    return this.items().map((item) => ({
      ...item,
      formattedPrice: `CHF ${item.price.toFixed(2)}`,
    }));
  });
}
```

**For repeated template structures (loops), use one of these patterns:**

**Option 1: Sub-components** (Recommended for complex calculations or component reuse)

```typescript
// ✅ DO: Extract to sub-component
@Component({
  selector: 'app-item-card',
  template: `
    <div class="item-card">
      <div class="title">{{ item().name }}</div>
      <div class="price">{{ formattedPrice() }}</div>
      <div class="discount">{{ discountAmount() }}</div>
    </div>
  `,
})
export class ItemCardComponent {
  readonly item = input.required<Item>();

  readonly formattedPrice = computed(() => {
    return `CHF ${this.item().price.toFixed(2)}`;
  });

  readonly discountAmount = computed(() => {
    return `Save CHF ${(this.item().price * 0.1).toFixed(2)}`;
  });
}

// Parent component
@Component({
  imports: [ItemCardComponent],
  template: `
    @for (item of items(); track item.id) {
      <app-item-card [item]="item" />
    }
  `,
})
export class ShoppingComponent {
  readonly items = signal<Item[]>([]);
}
```

**Option 2: Enrich array data** (Recommended for simple calculations or when data enrichment is needed for multiple purposes)

```typescript
// ✅ DO: Enrich array with computed values
interface EnrichedItem extends Item {
  readonly formattedPrice: string;
  readonly discountAmount: number;
  readonly finalPrice: number;
}

@Component({
  template: `
    @for (item of enrichedItems(); track item.id) {
      <div class="item">
        <div>{{ item.formattedPrice }}</div>
        <div>Discount: CHF {{ item.discountAmount.toFixed(2) }}</div>
        <div>Final: CHF {{ item.finalPrice.toFixed(2) }}</div>
      </div>
    }
  `,
})
export class ShoppingComponent {
  readonly items = signal<Item[]>([]);

  readonly enrichedItems = computed<EnrichedItem[]>(() => {
    return this.items().map((item) => ({
      ...item,
      formattedPrice: `CHF ${item.price.toFixed(2)}`,
      discountAmount: item.price * 0.1,
      finalPrice: item.price * 0.9,
    }));
  });
}
```

**Key Benefits:**

- **Performance**: Computed signals only recalculate when dependencies change, not on every change detection cycle
- **Predictability**: Values are memoized and consistent across template renders
- **Maintainability**: Clear separation between data transformation and presentation
- **Testability**: Computed signals are easier to test than functions called in templates

### Effects

Use `effect()` sparingly, only for side effects that need to react to signal changes.

```typescript
// ✅ DO: Effects for side effects
import { Component, effect, signal } from '@angular/core';

export class MyComponent {
  readonly userId = signal<string | null>(null);

  constructor() {
    // Effect runs when userId changes
    effect(() => {
      const id = this.userId();
      if (id) {
        console.log('User ID changed:', id);
        this.#trackUserActivity(id);
      }
    });
  }

  #trackUserActivity(userId: string): void {
    // Analytics or logging
  }
}

// ❌ DON'T: Use effects for derived state (use computed instead)
export class MyComponent {
  readonly count = signal(0);
  readonly doubled = signal(0);

  constructor() {
    effect(() => {
      this.doubled.set(this.count() * 2); // BAD! Use computed() instead
    });
  }
}
```

---

## Dependency Injection

### Function-Based Injection

**Always use `inject()` function** in component class bodies. Use `#` for private dependencies.

```typescript
// ✅ DO: inject() with private fields using #
import { Component, inject } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  template: `...`,
})
export class DashboardComponent {
  readonly #http = inject(HttpClient);
  readonly #router = inject(Router);
  readonly #authService = inject(AuthService);

  loadData(): void {
    this.#http.get('/api/data').subscribe();
  }
}

// ❌ DON'T: Constructor injection
@Component({})
export class DashboardComponent {
  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}
}
```

### Service Injection in Services

Services should also use `inject()` in the class body.

```typescript
// ✅ DO: inject() in services
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class DataApiService {
  readonly #http = inject(HttpClient);
  readonly #config = inject(AppConfig);

  getItems(userId: string): Observable<Item[]> {
    const url = `${this.#config.apiUrl}/items`;
    return this.#http.get<Item[]>(url, { params: { userId } });
  }
}
```

### Injection Contexts

Remember that `inject()` can only be called in injection context (class constructors, field initializers).

```typescript
// ✅ DO: inject() in field initializer
export class MyComponent {
  readonly #service = inject(MyService);
}

// ✅ DO: inject() in constructor
export class MyComponent {
  readonly #service: MyService;

  constructor() {
    this.#service = inject(MyService);
  }
}

// ❌ DON'T: inject() outside injection context
export class MyComponent {
  #service!: MyService;

  ngOnInit() {
    this.#service = inject(MyService); // ERROR!
  }
}
```

---

## Template Syntax

### Control Flow

Use the new `@if`, `@for`, `@switch` syntax.

```typescript
@Component({
  template: `
    <!-- Conditional rendering -->
    @if (isLoading()) {
      <mat-spinner></mat-spinner>
    } @else if (errorMessage()) {
      <div class="error">{{ errorMessage() }}</div>
    } @else {
      <div class="content">{{ content() }}</div>
    }

    <!-- List rendering -->
    @for (item of items(); track item.id) {
      <div class="item">{{ item.name }}</div>
    } @empty {
      <p>No items found</p>
    }

    <!-- Switch statement -->
    @switch (status()) {
      @case ('loading') {
        <mat-spinner></mat-spinner>
      }
      @case ('error') {
        <div class="error">Error occurred</div>
      }
      @case ('success') {
        <div class="success">Success!</div>
      }
      @default {
        <div>Unknown status</div>
      }
    }
  `,
})
export class MyComponent {}
```

### Safe Navigation with Signals

Signals handle null/undefined automatically. Use `as` for type narrowing.

```typescript
@Component({
  template: `
    <!-- Direct signal access -->
    @if (user(); as u) {
      <div>{{ u.name }}</div>
      <div>{{ u.email }}</div>
    }

    <!-- Computed values -->
    <div>Total: {{ itemCount() }}</div>

    <!-- Optional chaining in expressions -->
    <div>{{ user()?.profile?.bio ?? 'No bio' }}</div>
  `,
})
export class MyComponent {
  readonly user = signal<User | null>(null);
  readonly itemCount = computed(() => this.items().length);
}
```

### Event Binding

Bind to methods or arrow functions.

```typescript
@Component({
  template: `
    <!-- Method binding -->
    <button (click)="handleClick()">Click</button>

    <!-- With parameters -->
    <button (click)="selectItem(item)">Select</button>

    <!-- Event object -->
    <input (input)="onInput($event)" />

    <!-- Multiple events -->
    <div (mouseenter)="onMouseEnter()" (mouseleave)="onMouseLeave()">
      Hover me
    </div>
  `,
})
export class MyComponent {
  handleClick(): void {
    console.log('Clicked!');
  }

  selectItem(item: Item): void {
    this.selectedItem.set(item);
  }

  onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchQuery.set(value);
  }
}
```

---

## State Management

### Store Pattern with NgRx SignalStore

**Use `signalStore` from `@ngrx/signals` for all shared state management.** This provides a standardized, type-safe way to manage state with built-in signal reactivity.

Install the package:

```bash
npm install @ngrx/signals
```

```typescript
// libs/data-access/src/lib/data.store.ts
import { computed } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';

/**
 * Data Store State Interface
 */
export interface DataState {
  readonly currentItem: Item | null;
  readonly items: readonly Item[];
  readonly loading: boolean;
  readonly error: string | null;
}

/**
 * Initial state
 */
const initialState: DataState = {
  currentItem: null,
  items: [],
  loading: false,
  error: null,
};

/**
 * Data Signal Store
 */
export const DataStore = signalStore(
  { providedIn: 'root' },

  // State
  withState(initialState),

  // Computed selectors
  withComputed((store) => ({
    hasCurrentItem: computed(() => store.currentItem() !== null),

    itemCount: computed(() => store.items().length),
  })),

  // Methods for mutations
  withMethods((store) => ({
    setCurrentItem(item: Item | null): void {
      patchState(store, { currentItem: item, error: null });
    },

    setItems(items: readonly Item[]): void {
      patchState(store, { items, error: null });
    },

    addItem(item: Item): void {
      patchState(store, {
        items: [...store.items(), item],
        currentItem: item,
        error: null,
      });
    },

    updateItem(itemId: string, updates: Partial<Item>): void {
      const items = store
        .items()
        .map((i) => (i.id === itemId ? { ...i, ...updates } : i));

      patchState(store, { items, error: null });
    },

    setLoading(loading: boolean): void {
      patchState(store, { loading });
    },

    setError(error: string | null): void {
      patchState(store, { error, loading: false });
    },

    reset(): void {
      patchState(store, initialState);
    },
  })),
);
```

### Component Usage of Store

```typescript
@Component({
  template: `
    @if (store.loading()) {
      <mat-spinner></mat-spinner>
    } @else if (store.items(); as items) {
      @for (item of items; track item.id) {
        <div>{{ item.name }} - {{ item.description }}</div>
      }
    }

    <!-- Use computed selectors -->
    <div>Item count: {{ store.itemCount() }}</div>
  `,
})
export class ItemListComponent {
  // Inject the store
  readonly store = inject(DataStore);

  constructor() {
    // Call store methods
    this.store.setItems([
      { id: '1', name: 'Item A', description: 'First item' },
      { id: '2', name: 'Item B', description: 'Second item' },
    ]);
  }

  selectItem(item: Item): void {
    this.store.setCurrentItem(item);
  }
}
```

**Key Points:**

- Use `inject(DataStore)` to get the store instance
- Access state directly: `store.items()`, `store.loading()`
- Access computed signals: `store.itemCount()`
- Call methods to mutate state: `store.setItems()`, `store.setCurrentItem()`
- No need for private fields - store can be public for template access

---

## RxJS Patterns

### When to Use RxJS

Use RxJS for:

- HTTP requests
- WebSocket streams
- Complex async operations
- Event streams from external sources

```typescript
// ✅ DO: RxJS for HTTP and async operations
export class DataService {
  readonly #http = inject(HttpClient);

  loadUsers(): Observable<User[]> {
    return this.#http.get<User[]>('/api/users');
  }

  searchUsers(query: string): Observable<User[]> {
    return this.#http.get<User[]>('/api/users/search', {
      params: { q: query },
    });
  }
}
```

### Converting Observables to Signals

Use `toSignal()` to convert Observables to signals in components.

```typescript
import { toSignal } from '@angular/core/rxjs-interop';

@Component({})
export class MyComponent {
  readonly #http = inject(HttpClient);

  // Convert Observable to signal
  readonly users = toSignal(this.#http.get<User[]>('/api/users'), {
    initialValue: [],
  });

  // With error handling
  readonly data = toSignal(
    this.#http.get<Data>('/api/data').pipe(catchError(() => of(null))),
    {
      initialValue: null,
    },
  );
}
```

### Unsubscribe Pattern

Use `takeUntilDestroyed` from `@angular/core/rxjs-interop` for automatic subscription cleanup. This eliminates the need for manual `OnDestroy` implementations and `destroy$` Subjects.

```typescript
// ✅ DO: Use takeUntilDestroyed in constructor (recommended)
import { Component, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';

@Component({})
export class MyComponent implements OnInit {
  readonly #authService = inject(AuthService);

  constructor() {
    // takeUntilDestroyed() automatically cleans up when component is destroyed
    this.#authService.events
      .pipe(
        filter((e) => e.type === 'authenticated'),
        takeUntilDestroyed(),
      )
      .subscribe({
        next: (event) => this.#handleAuth(event),
        error: (error) => this.#handleError(error),
      });
  }

  ngOnInit(): void {
    // Component initialization
  }

  #handleAuth(event: AuthEvent): void {
    // Handle auth event
  }

  #handleError(error: unknown): void {
    // Handle error
  }
}
```

```typescript
// ✅ DO: Use takeUntilDestroyed in methods (for subscriptions created outside constructor)
import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';

@Component({})
export class MyComponent {
  readonly #authService = inject(AuthService);
  readonly #destroyRef = inject(DestroyRef);

  onUserAction(): void {
    // Pass destroyRef when subscribing in methods
    this.#authService.events
      .pipe(
        filter((e) => e.type === 'authenticated'),
        takeUntilDestroyed(this.#destroyRef),
      )
      .subscribe({
        next: (event) => this.#handleAuth(event),
        error: (error) => this.#handleError(error),
      });
  }

  #handleAuth(event: AuthEvent): void {
    // Handle auth event
  }

  #handleError(error: unknown): void {
    // Handle error
  }
}
```

```typescript
// ❌ DON'T: Manual takeUntil with OnDestroy (outdated pattern)
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

@Component({})
export class MyComponent implements OnInit, OnDestroy {
  readonly #destroy$ = new Subject<void>();
  readonly #authService = inject(AuthService);

  ngOnInit(): void {
    this.#authService.events
      .pipe(
        filter((e) => e.type === 'authenticated'),
        takeUntil(this.#destroy$), // BAD: Use takeUntilDestroyed instead
      )
      .subscribe({
        next: (event) => this.#handleAuth(event),
        error: (error) => this.#handleError(error),
      });
  }

  ngOnDestroy(): void {
    this.#destroy$.next();
    this.#destroy$.complete();
  }
}
```

**Key Points:**

- Use `takeUntilDestroyed()` in constructors for automatic cleanup
- Use `takeUntilDestroyed(this.#destroyRef)` in methods when subscribing outside the constructor
- No need for `OnDestroy` or manual `destroy$` Subject
- Cleaner, more maintainable code with automatic cleanup

---

## Directives and Pipes

### Attribute Directives

```typescript
import { Directive, ElementRef, inject, input, OnInit } from '@angular/core';

@Directive({
  selector: 'mat-icon',
})
export class IconSizeDirective implements OnInit {
  readonly #elementRef = inject(ElementRef<HTMLElement>);
  readonly size = input<'sm' | 'md' | 'lg'>('md');

  ngOnInit(): void {
    const sizeMap = {
      sm: '16px',
      md: '24px',
      lg: '32px',
    };

    this.#elementRef.nativeElement.style.fontSize = sizeMap[this.size()];
  }
}

// Usage in template
// <mat-icon size="lg">check</mat-icon>
```

### Structural Directives

Prefer built-in `@if` and `@for` over custom structural directives.

### Pipes

Create pure, standalone pipes.

```typescript
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'localeDate',
  pure: true,
})
export class LocaleDatePipe implements PipeTransform {
  transform(value: Date | string | null, locale = 'en-US'): string {
    if (!value) return '';

    const date = typeof value === 'string' ? new Date(value) : value;
    return new Intl.DateTimeFormat(locale, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  }
}

// Usage in template
// {{ createdAt | localeDate }}
// {{ createdAt | localeDate:'de-CH' }}
```

---

## Forms

### Signal Forms

**Use Angular Signal Forms for all form handling.** Signal Forms manage form state using Angular signals, providing automatic two-way binding between your data model and the UI.

> **Note:** Signal Forms are **experimental** (Angular v21+). The API may change before stabilizing. Import everything from `@angular/forms/signals`.

### Basic Form Setup

Every form starts with a `signal()` holding your data model, passed to `form()` to create a field tree. Bind inputs with the `[formField]` directive.

```typescript
import { Component, signal } from '@angular/core';
import {
  form,
  FormField,
  required,
  email,
  minLength,
  submit,
} from '@angular/forms/signals';

interface LoginData {
  email: string;
  password: string;
}

@Component({
  selector: 'app-login',
  imports: [FormField],
  template: `
    <form (submit)="onSubmit($event)" class="flex flex-col gap-4 max-w-md">
      <mat-form-field>
        <mat-label>Email</mat-label>
        <input matInput type="email" [formField]="loginForm.email" />
        @if (loginForm.email().touched() && loginForm.email().invalid()) {
          @for (error of loginForm.email().errors(); track error) {
            <mat-error>{{ error.message }}</mat-error>
          }
        }
      </mat-form-field>

      <mat-form-field>
        <mat-label>Password</mat-label>
        <input matInput type="password" [formField]="loginForm.password" />
        @if (loginForm.password().touched() && loginForm.password().invalid()) {
          @for (error of loginForm.password().errors(); track error) {
            <mat-error>{{ error.message }}</mat-error>
          }
        }
      </mat-form-field>

      <button
        mat-raised-button
        type="submit"
        [disabled]="loginForm().invalid()"
      >
        Log In
      </button>
    </form>
  `,
})
export class LoginComponent {
  readonly loginModel = signal<LoginData>({
    email: '',
    password: '',
  });

  readonly loginForm = form(this.loginModel, (schema) => {
    required(schema.email, { message: 'Email is required' });
    email(schema.email, { message: 'Enter a valid email address' });
    required(schema.password, { message: 'Password is required' });
    minLength(schema.password, 8, {
      message: 'Password must be at least 8 characters',
    });
  });

  onSubmit(event: Event): void {
    event.preventDefault();
    submit(this.loginForm, {
      action: async () => {
        const credentials = this.loginModel();
        await this.#authenticate(credentials);
      },
    });
  }

  async #authenticate(credentials: LoginData): Promise<void> {
    // Submit logic
  }
}

// ❌ DON'T: Use legacy Reactive Forms (FormGroup, FormControl, Validators)
@Component({})
export class LoginComponent {
  readonly form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });
}
```

**Key concepts:**

- **Model signal**: A `signal()` holding a plain data object — the single source of truth
- **Field tree**: Created by `form(model)`, mirrors the model shape for field access via dot notation
- **`[formField]` directive**: Two-way binds an HTML input to a field in the tree
- **Schema function**: Second argument to `form()`, defines validation and form logic rules

### Form Submission with FormRoot

For a cleaner submission flow, use the `FormRoot` directive which automatically handles `preventDefault` and `novalidate`.

```typescript
import { Component, inject, signal } from '@angular/core';
import {
  form,
  FormField,
  FormRoot,
  required,
  email,
} from '@angular/forms/signals';

@Component({
  selector: 'app-registration',
  imports: [FormField, FormRoot],
  template: `
    <form [formRoot]="registrationForm" class="flex flex-col gap-4">
      <input type="text" [formField]="registrationForm.username" />
      <input type="email" [formField]="registrationForm.email" />
      <input type="password" [formField]="registrationForm.password" />
      <button type="submit" [disabled]="registrationForm().invalid()">
        Register
      </button>
    </form>
  `,
})
export class RegistrationComponent {
  readonly #api = inject(ApiService);

  readonly registrationModel = signal({
    username: '',
    email: '',
    password: '',
  });

  readonly registrationForm = form(
    this.registrationModel,
    (schema) => {
      required(schema.username);
      required(schema.email);
      email(schema.email);
      required(schema.password);
    },
    {
      submission: {
        action: async () => {
          await this.#api.register(this.registrationModel());
        },
      },
    },
  );
}
```

When using `FormRoot`, submitting the form automatically calls `submit()`, which marks all fields as touched (revealing errors) and executes the `action` callback only if the form is valid.

### Reading and Updating Field Values

```typescript
// Read the current value of a field
const currentEmail = this.loginForm.email().value();

// Read from the model signal (complete form data)
const formData = this.loginModel();

// Update a single field programmatically
this.loginForm.email().value.set('alice@wonderland.com');

// Replace the entire model (e.g., loading from API)
this.loginModel.set({ email: 'loaded@api.com', password: '' });
```

### Validation

Signal Forms uses a **schema-based** approach. Validation rules bind to fields inside the schema function and run automatically when values change.

**Built-in validators:** `required()`, `email()`, `min()`, `max()`, `minLength()`, `maxLength()`, `pattern()`

```typescript
readonly profileForm = form(this.profileModel, (schema) => {
  required(schema.name, { message: 'Name is required' });
  minLength(schema.name, 2, { message: 'Name must be at least 2 characters' });
  maxLength(schema.bio, 500, { message: 'Bio cannot exceed 500 characters' });
  min(schema.age, 18, { message: 'Must be at least 18 years old' });
  pattern(schema.phone, /^\d{3}-\d{3}-\d{4}$/, { message: 'Format: 555-123-4567' });
});
```

### Custom Validation

Use `validate()` for custom synchronous validation rules.

```typescript
import { validate, SchemaPath } from '@angular/forms/signals';

// Reusable custom validator
function httpsUrl(path: SchemaPath<string>, options?: { message?: string }): void {
  validate(path, ({ value }) => {
    if (!value().startsWith('https://')) {
      return { kind: 'https', message: options?.message ?? 'URL must start with https://' };
    }
    return null;
  });
}

// Usage in form schema
readonly settingsForm = form(this.settingsModel, (schema) => {
  httpsUrl(schema.webhookUrl, { message: 'Webhook URL must use HTTPS' });
});
```

### Cross-Field Validation

Use `valueOf()` inside a `validate()` to read other field values reactively.

```typescript
import { validate, required, minLength } from '@angular/forms/signals';

readonly passwordForm = form(this.passwordModel, (schema) => {
  required(schema.password, { message: 'Password is required' });
  minLength(schema.password, 8, { message: 'Password must be at least 8 characters' });
  required(schema.confirmPassword, { message: 'Please confirm your password' });
  validate(schema.confirmPassword, ({ value, valueOf }) => {
    if (value() !== valueOf(schema.password)) {
      return { kind: 'passwordMismatch', message: 'Passwords do not match' };
    }
    return null;
  });
});
```

### Async Validation

Use `validateHttp()` for server-side validation (e.g., checking username availability).

```typescript
import { required, validateHttp } from '@angular/forms/signals';

readonly usernameForm = form(this.usernameModel, (schema) => {
  required(schema.username, { message: 'Username is required' });
  validateHttp(schema.username, {
    request: ({ value }) => `/api/check-username?username=${value()}`,
    onSuccess: (response: { taken: boolean }) => {
      return response.taken
        ? { kind: 'usernameTaken', message: 'Username is already taken' }
        : null;
    },
    onError: () => ({ kind: 'networkError', message: 'Could not verify availability' }),
  });
});
```

Show a loading indicator while async validation runs:

```html
@if (usernameForm.username().pending()) {
<span>Checking availability...</span>
}
```

### Form Logic: disabled, hidden, readonly, debounce

Control field behavior reactively through the schema.

```typescript
import { disabled, hidden, readonly, debounce, required, pattern, applyWhen } from '@angular/forms/signals';

readonly orderForm = form(this.orderModel, (schema) => {
  // Disable coupon field when total is below threshold
  disabled(schema.couponCode, ({ valueOf }) =>
    valueOf(schema.total) < 50 ? 'Order must be $50 or more to use a coupon' : false,
  );

  // Hide shipping address when not required
  hidden(schema.shippingAddress, ({ valueOf }) => !valueOf(schema.requiresShipping));

  // Readonly system-generated fields
  readonly(schema.orderId);

  // Debounce search input
  debounce(schema.searchQuery, 300);

  // Conditionally apply validation based on another field
  applyWhen(
    schema,
    ({ valueOf }) => valueOf(schema.country) === 'US',
    (schema) => {
      required(schema.zipCode);
      pattern(schema.zipCode, /^\d{5}(-\d{4})?$/);
    },
  );
});
```

In templates, use the field state signals for conditional rendering:

```html
<!-- formField auto-binds disabled/readonly attributes -->
<input [formField]="orderForm.couponCode" />
@if (orderForm.couponCode().disabled()) { @for (reason of
orderForm.couponCode().disabledReasons(); track reason) {
<p class="text-sm text-gray-500">{{ reason.message }}</p>
} }

<!-- hidden() requires manual @if in templates -->
@if (!orderForm.shippingAddress().hidden()) {
<input [formField]="orderForm.shippingAddress" />
}
```

### Nested Objects and Arrays

Signal Forms support nested models and arrays natively.

```typescript
import {
  applyEach,
  required,
  min,
  SchemaPathTree,
} from '@angular/forms/signals';

interface OrderItem {
  name: string;
  quantity: number;
}

interface OrderData {
  title: string;
  items: OrderItem[];
}

function itemSchema(item: SchemaPathTree<OrderItem>): void {
  required(item.name, { message: 'Item name is required' });
  min(item.quantity, 1, { message: 'Quantity must be at least 1' });
}

@Component({
  imports: [FormField],
  template: `
    <input [formField]="orderForm.title" />
    @for (item of orderForm.items; track item) {
      <input [formField]="item.name" />
      <input type="number" [formField]="item.quantity" />
    }
  `,
})
export class OrderComponent {
  readonly orderModel = signal<OrderData>({
    title: '',
    items: [{ name: '', quantity: 0 }],
  });

  readonly orderForm = form(this.orderModel, (schema) => {
    required(schema.title);
    applyEach(schema.items, itemSchema);
  });

  addItem(): void {
    this.orderModel.update((m) => ({
      ...m,
      items: [...m.items, { name: '', quantity: 0 }],
    }));
  }
}
```

### Standard Schema Integration (Zod / Valibot)

Signal Forms integrate with [Standard Schema](https://standardschema.dev/) libraries for complex validation.

```typescript
import { form, validateStandardSchema } from '@angular/forms/signals';
import * as z from 'zod';

const userSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

readonly userForm = form(this.userModel, (schema) => {
  validateStandardSchema(schema, userSchema);
});
```

### Field State Reference

Every `field()` call returns a `FieldState` with these reactive signals:

| Signal       | Description                                               |
| ------------ | --------------------------------------------------------- |
| `value()`    | Current field value (writable)                            |
| `valid()`    | `true` if all validation passes and no validators pending |
| `invalid()`  | `true` if field has validation errors                     |
| `touched()`  | `true` if user has focused and blurred the field          |
| `dirty()`    | `true` if user has modified the field                     |
| `disabled()` | `true` if field is disabled                               |
| `hidden()`   | `true` if field is hidden                                 |
| `readonly()` | `true` if field is readonly                               |
| `pending()`  | `true` if async validation is in progress                 |
| `errors()`   | Array of `{ kind, message }` error objects                |

### Resetting Forms

```typescript
readonly #initialModel: ContactData = { name: '', email: '', message: '' };
readonly contactModel = signal<ContactData>({ ...this.#initialModel });
readonly contactForm = form(this.contactModel, (schema) => { /* ... */ }, {
  submission: {
    action: async (f) => {
      await this.#api.sendMessage(this.contactModel());
      f().reset({ ...this.#initialModel });
    },
  },
});
```

---

## Styling

### Tailwind Utility Classes

Use Tailwind classes directly in templates.

```typescript
@Component({
  template: `
    <!-- Layout -->
    <div class="flex flex-col gap-4 p-6 max-w-4xl mx-auto">
      <!-- Typography -->
      <h1 class="text-3xl font-bold text-gray-900">Title</h1>
      <p class="text-sm text-gray-600">Description</p>

      <!-- Colors -->
      <div class="bg-primary-500 text-white p-4 rounded-lg">
        Primary colored box
      </div>

      <!-- Responsive -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <!-- Grid items -->
      </div>

      <!-- State variants -->
      <button class="px-4 py-2 bg-blue-500 hover:bg-blue-600 focus:ring-2">
        Button
      </button>
    </div>
  `,
})
export class MyComponent {}
```

### Angular Material Integration

Combine Material components with Tailwind utilities.

```typescript
@Component({
  imports: [MatCardModule, MatButtonModule],
  template: `
    <mat-card class="max-w-md mx-auto">
      <mat-card-header>
        <mat-card-title class="text-2xl font-bold">Card Title</mat-card-title>
      </mat-card-header>
      <mat-card-content class="mt-4">
        <p class="text-gray-700">Card content with Tailwind styling</p>
      </mat-card-content>
      <mat-card-actions class="flex justify-end gap-2 p-4">
        <button mat-button>Cancel</button>
        <button mat-raised-button color="primary">Submit</button>
      </mat-card-actions>
    </mat-card>
  `,
})
export class CardComponent {}
```

### Material Icons Best Practices

**Use a size directive (if your project has one) or consistent sizing classes. Use `!important` for colors when needed.**

Material icons have their own color system that takes precedence over Tailwind classes. To ensure consistent styling:

1. **Use consistent sizing** via a custom directive or utility classes
2. **Use `!important` modifier** (e.g., `text-white!`) when Tailwind colors are overridden by Material's theme

```typescript
// ✅ DO: Consistent sizing and !important for colors when needed
@Component({
  imports: [MatIconModule],
  template: `
    <!-- Small icon with color -->
    <mat-icon class="text-blue-600! w-4 h-4">check</mat-icon>

    <!-- Medium icon (default) -->
    <mat-icon class="text-white!">settings</mat-icon>

    <!-- Large icon -->
    <mat-icon class="text-red-500! w-8 h-8">error</mat-icon>
  `,
})
export class MyComponent {}

// ❌ DON'T: Color without !important when Material overrides it
@Component({
  template: `
    <!-- BAD: Color may be overridden by Material theme -->
    <mat-icon class="text-white">check</mat-icon>
  `,
})
export class MyComponent {}
```

**Why `!important` May Be Required:**

Material Design icons have built-in color inheritance from Material's theme system. Using `!important` ensures your Tailwind color classes take precedence when needed:

```typescript
// Without !important: Material's theme color may be applied
<mat-icon class="text-white">check</mat-icon>  // Might show theme color

// With !important: Your Tailwind color is guaranteed
<mat-icon class="text-white!">check</mat-icon>  // Always white
```

---

## File Organization

### Component Files

One component per file, following naming conventions.

```
apps/my-app/src/app/
├── features/
│   ├── dashboard/
│   │   └── dashboard.component.ts
│   └── list/
│       └── list.component.ts
├── shell/
│   ├── app-shell.component.ts
│   └── components/
│       └── status-chip.component.ts
└── shared/
    ├── services/
    │   └── auth.service.ts
    └── guards/
        └── auth.guard.ts
```

### Library Structure

```
libs/
├── data-access/
│   └── src/
│       ├── lib/
│       │   └── data.store.ts
│       └── index.ts
├── api/
│   └── src/
│       ├── lib/
│       │   └── data-api.service.ts
│       └── index.ts
└── ui/
    └── src/
        ├── lib/
        │   └── directives/
        └── index.ts
```

---

## Summary Checklist

- ✅ All components, directives, and pipes are standalone
- ✅ Use signals for component state, computed for derived state
- ✅ Never call functions in templates—use computed signals instead (for loops, use sub-components or enrich array data)
- ✅ Always use inline templates (no `.html` files)
- ✅ Use Tailwind classes (no component `.css` files)
- ✅ Use `inject()` function for dependency injection
- ✅ Use `#` prefix for private fields in components and services
- ✅ Prefer constructor over OnInit (only use OnInit when inputs must be settled)
- ✅ Use `input()` and `output()` for component I/O
- ✅ Use `viewChild()` and `viewChildren()` for view queries
- ✅ Use `@if`, `@for`, `@switch` control flow in templates
- ✅ Use NgRx SignalStore (`@ngrx/signals`) for shared state management
- ✅ Convert Observables to signals with `toSignal()` when needed
- ✅ Use `takeUntilDestroyed()` for automatic subscription cleanup
- ✅ Use Signal Forms (`@angular/forms/signals`) with `form()` + `[formField]` for all forms
- ✅ Define validation in schema functions, not imperatively
- ✅ Document components with JSDoc comments
- ✅ Follow consistent file naming: `kebab-case.component.ts`
