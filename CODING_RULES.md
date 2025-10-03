# コーディングルール / Coding Rules

## 目次
- [プロジェクト概要](#プロジェクト概要)
- [技術スタック](#技術スタック)
- [ディレクトリ構造](#ディレクトリ構造)
- [命名規則](#命名規則)
- [TypeScript ルール](#typescript-ルール)
- [React / Next.js ルール](#react--nextjs-ルール)
- [状態管理](#状態管理)
- [スタイリング](#スタイリング)
- [コンポーネント設計](#コンポーネント設計)
- [エラーハンドリング](#エラーハンドリング)
- [パフォーマンス](#パフォーマンス)
- [アクセシビリティ](#アクセシビリティ)
- [テスト](#テスト)

---

## プロジェクト概要

MC BATTLE - ラップバトルゲーム
- ワード選択型のターン制ゲーム
- Next.js 14 (App Router) + TypeScript
- Zustand による状態管理
- Shadcn UI + Tailwind CSS

---

## 技術スタック

### 必須技術
- **フレームワーク**: Next.js 14+ (App Router)
- **言語**: TypeScript 5+
- **スタイリング**: Tailwind CSS 3+
- **UI コンポーネント**: Shadcn UI
- **状態管理**: Zustand 4+
- **アイコン**: Lucide React

### 推奨ツール
- ESLint (Next.js デフォルト設定)
- Prettier (コードフォーマット)
- Git (バージョン管理)

---

## ディレクトリ構造

```
rapbattle/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # ルートレイアウト
│   ├── page.tsx                 # メインページ
│   └── globals.css              # グローバルスタイル
├── components/
│   ├── screens/                 # 画面コンポーネント
│   │   ├── [ScreenName]Screen.tsx
│   │   └── ...
│   ├── ui/                      # Shadcn UI コンポーネント
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── ...
│   └── features/                # 機能別コンポーネント（将来用）
├── lib/
│   ├── store.ts                 # Zustand ストア
│   ├── types.ts                 # 型定義
│   ├── utils.ts                 # ユーティリティ関数
│   ├── constants.ts             # 定数（必要に応じて）
│   └── [feature]-data.ts        # データファイル
├── hooks/                        # カスタムフック（必要に応じて）
├── public/                       # 静的ファイル
└── README.md                     # プロジェクト説明
```

### ディレクトリ命名規則
- **ケバブケース**: `word-select/`, `game-over/`
- **単数形**: 原則として単数形を使用（例外: `components/`, `hooks/`）

---

## 命名規則

### ファイル名
| 種類 | 命名規則 | 例 |
|------|---------|-----|
| React コンポーネント | PascalCase | `TitleScreen.tsx`, `Button.tsx` |
| ユーティリティ | camelCase | `utils.ts`, `store.ts` |
| 型定義 | camelCase | `types.ts` |
| 定数 | camelCase | `constants.ts` |
| データ | kebab-case + camelCase | `words-data.ts` |
| CSS | kebab-case | `globals.css` |

### 変数名
```typescript
// ✅ Good
const userName = "John";
const isActive = true;
const maxCount = 100;

// ❌ Bad
const user_name = "John";
const active = true;
const MAX_COUNT = 100; // 定数でない場合
```

### 関数名
```typescript
// ✅ Good - 動詞から始める
function getUserData() {}
function handleClick() {}
function validateInput() {}

// ❌ Bad
function user() {}
function click() {}
function input() {}
```

### コンポーネント名
```typescript
// ✅ Good - PascalCase、名詞または名詞句
export function TitleScreen() {}
export function WordSelectButton() {}

// ❌ Bad
export function titleScreen() {}
export function word_select_button() {}
```

### 型名
```typescript
// ✅ Good - PascalCase
type GameScreen = "title" | "battle";
interface UserProfile {
  name: string;
  age: number;
}

// ❌ Bad
type gameScreen = "title" | "battle";
interface user_profile {}
```

---

## TypeScript ルール

### 1. 型の明示
```typescript
// ✅ Good - 型を明示
const count: number = 0;
const message: string = "Hello";
function add(a: number, b: number): number {
  return a + b;
}

// ⚠️ Acceptable - 型推論が明確な場合
const count = 0; // number と推論される
const message = "Hello"; // string と推論される

// ❌ Bad - any の使用
const data: any = {}; // 避ける
```

### 2. Interface vs Type
```typescript
// ✅ Good - オブジェクト形状には interface
interface User {
  id: string;
  name: string;
}

// ✅ Good - Union, Intersection には type
type GameScreen = "title" | "battle" | "result";
type ExtendedUser = User & { email: string };

// ✅ Good - Props には type を使用（React の慣習）
type ButtonProps = {
  label: string;
  onClick: () => void;
};
```

### 3. Optional と Nullable
```typescript
// ✅ Good - Optional プロパティ
interface Config {
  required: string;
  optional?: string;
}

// ✅ Good - Nullable な値
type UserData = {
  name: string;
  avatar: string | null;
};

// ❌ Bad - undefined と null の混在を避ける
type BadData = {
  value: string | null | undefined;
};
```

### 4. Generics
```typescript
// ✅ Good - 再利用可能な型
function identity<T>(value: T): T {
  return value;
}

// ✅ Good - 制約付き Generics
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
```

### 5. Enum vs Union Type
```typescript
// ✅ Good - Union Type を優先（Tree-shaking に有利）
type GameScreen = "title" | "battle" | "result";

// ⚠️ Acceptable - 複雑な定数グループには Enum
enum Direction {
  Up = "UP",
  Down = "DOWN",
  Left = "LEFT",
  Right = "RIGHT",
}

// ❌ Bad - 数値 Enum は避ける
enum BadEnum {
  First,
  Second,
}
```

---

## React / Next.js ルール

### 1. コンポーネント定義
```typescript
// ✅ Good - 関数コンポーネント（function 宣言）
export function TitleScreen() {
  return <div>Title</div>;
}

// ✅ Good - Props 付きコンポーネント
type ButtonProps = {
  label: string;
  onClick: () => void;
};

export function Button({ label, onClick }: ButtonProps) {
  return <button onClick={onClick}>{label}</button>;
}

// ❌ Bad - default export は避ける（ページコンポーネント以外）
export default function Component() {}

// ❌ Bad - アロー関数は避ける（デバッグしにくい）
const Component = () => <div />;
```

### 2. Hooks の使用
```typescript
// ✅ Good - コンポーネントのトップレベルで呼び出す
export function MyComponent() {
  const [count, setCount] = useState(0);
  const value = useMemo(() => expensiveCalculation(), []);

  return <div>{count}</div>;
}

// ❌ Bad - 条件分岐内での Hook
export function BadComponent({ show }: { show: boolean }) {
  if (show) {
    const [count, setCount] = useState(0); // ❌ NG
  }
}

// ✅ Good - カスタムフック
function useGameState() {
  const [state, setState] = useState(initialState);
  // ... ロジック
  return { state, setState };
}
```

### 3. イベントハンドラ
```typescript
// ✅ Good - handle + イベント名
function MyComponent() {
  const handleClick = () => {
    console.log("clicked");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // ...
  };

  return <button onClick={handleClick}>Click</button>;
}

// ❌ Bad
function MyComponent() {
  const onClick = () => {}; // handle をつける
  const click = () => {};   // 動詞から始める
}
```

### 4. "use client" ディレクティブ
```typescript
// ✅ Good - クライアントコンポーネントには必須
"use client";

import { useState } from "react";

export function InteractiveComponent() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}

// ✅ Good - サーバーコンポーネント（"use client" 不要）
export function StaticComponent() {
  return <div>Static Content</div>;
}
```

### 5. Next.js App Router
```typescript
// ✅ Good - app/page.tsx はデフォルトエクスポート
export default function Home() {
  return <main>...</main>;
}

// ✅ Good - app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <html><body>{children}</body></html>;
}

// ✅ Good - メタデータのエクスポート
export const metadata: Metadata = {
  title: "My App",
  description: "Description",
};
```

---

## 状態管理

### Zustand ストアの設計

```typescript
// ✅ Good - 単一責任の原則
interface GameStore {
  // State
  currentScreen: GameScreen;
  score: number;

  // Actions
  setScreen: (screen: GameScreen) => void;
  incrementScore: (points: number) => void;
}

export const useGameStore = create<GameStore>((set) => ({
  currentScreen: "title",
  score: 0,

  setScreen: (screen) => set({ currentScreen: screen }),
  incrementScore: (points) => set((state) => ({
    score: state.score + points
  })),
}));

// ✅ Good - セレクタの使用
const currentScreen = useGameStore((state) => state.currentScreen);

// ❌ Bad - ストア全体を取得
const store = useGameStore(); // 不要な再レンダリングが発生
```

### ストアの分割
```typescript
// ✅ Good - 機能ごとにストアを分割（必要に応じて）
export const useGameStore = create<GameStore>(...);
export const useSettingsStore = create<SettingsStore>(...);

// ❌ Bad - 1つのストアに全てを詰め込む（小規模なら許容）
```

---

## スタイリング

### Tailwind CSS

```typescript
// ✅ Good - Tailwind クラスの使用
<div className="flex items-center justify-center p-4 bg-primary text-white">
  Content
</div>

// ✅ Good - cn ヘルパーで条件付きクラス
import { cn } from "@/lib/utils";

<div className={cn(
  "base-class",
  isActive && "active-class",
  variant === "primary" && "primary-class"
)}>
```

### CSS 変数
```css
/* ✅ Good - CSS 変数の使用 */
:root {
  --primary: 271 91% 65%;
  --background: 222 47% 11%;
}

/* ✅ Good - hsl() 関数での使用 */
.element {
  background: hsl(var(--primary));
}
```

### カスタムクラス
```css
/* ✅ Good - @layer で定義 */
@layer utilities {
  .neon-glow-cyan {
    text-shadow: 0 0 5px hsl(var(--neon-cyan));
  }
}

/* ❌ Bad - グローバルスコープで定義 */
.my-class {
  color: red;
}
```

---

## コンポーネント設計

### 1. 単一責任の原則
```typescript
// ✅ Good - 1つの責任
export function UserAvatar({ src, alt }: AvatarProps) {
  return <img src={src} alt={alt} className="rounded-full" />;
}

export function UserProfile({ user }: ProfileProps) {
  return (
    <div>
      <UserAvatar src={user.avatar} alt={user.name} />
      <h2>{user.name}</h2>
    </div>
  );
}

// ❌ Bad - 複数の責任
export function UserComponent({ user }: UserProps) {
  // アバター表示、プロフィール表示、設定変更などが混在
}
```

### 2. Props の設計
```typescript
// ✅ Good - 明確な Props
type ButtonProps = {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary";
  disabled?: boolean;
};

// ❌ Bad - 曖昧な Props
type BadProps = {
  data: any;
  config: object;
};
```

### 3. Children の活用
```typescript
// ✅ Good - Composition Pattern
type CardProps = {
  children: React.ReactNode;
  className?: string;
};

export function Card({ children, className }: CardProps) {
  return <div className={cn("card", className)}>{children}</div>;
}

// 使用例
<Card>
  <CardHeader>Title</CardHeader>
  <CardContent>Content</CardContent>
</Card>
```

### 4. コンポーネントのサイズ
- 100行以内を目標
- 200行を超えたら分割を検討
- 複雑なロジックはカスタムフックに抽出

---

## エラーハンドリング

### 1. エラーバウンダリ
```typescript
// ✅ Good - エラーバウンダリの実装（必要に応じて）
"use client";

export class ErrorBoundary extends React.Component<Props, State> {
  // ... 実装
}
```

### 2. try-catch
```typescript
// ✅ Good - 非同期処理のエラーハンドリング
async function fetchData() {
  try {
    const response = await fetch("/api/data");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch data:", error);
    return null;
  }
}

// ❌ Bad - エラーを無視
async function badFetch() {
  const data = await fetch("/api/data"); // エラーハンドリングなし
}
```

---

## パフォーマンス

### 1. メモ化
```typescript
// ✅ Good - 高コストな計算をメモ化
const expensiveValue = useMemo(() => {
  return heavyCalculation(data);
}, [data]);

// ✅ Good - コールバックのメモ化
const handleClick = useCallback(() => {
  doSomething(value);
}, [value]);

// ⚠️ 注意 - 過度なメモ化は避ける
```

### 2. 動的インポート
```typescript
// ✅ Good - 大きなコンポーネントの遅延読み込み
const HeavyComponent = dynamic(() => import("./HeavyComponent"), {
  loading: () => <p>Loading...</p>,
});

// ✅ Good - ssr: false でクライアント専用コンポーネント
const ClientOnlyComponent = dynamic(() => import("./ClientOnly"), {
  ssr: false,
});
```

---

## アクセシビリティ

### 1. セマンティック HTML
```typescript
// ✅ Good
<button onClick={handleClick}>Click me</button>
<nav>...</nav>
<main>...</main>

// ❌ Bad
<div onClick={handleClick}>Click me</div>
```

### 2. ARIA 属性
```typescript
// ✅ Good
<button aria-label="Close dialog" onClick={onClose}>
  <X />
</button>

// ✅ Good
<div role="dialog" aria-labelledby="dialog-title">
  <h2 id="dialog-title">Title</h2>
</div>
```

### 3. キーボード操作
```typescript
// ✅ Good - キーボードイベントのサポート
<div
  role="button"
  tabIndex={0}
  onClick={handleClick}
  onKeyDown={(e) => {
    if (e.key === "Enter" || e.key === " ") {
      handleClick();
    }
  }}
>
  Custom Button
</div>
```

---

## テスト

### 1. テストファイルの配置
```
components/
  Button.tsx
  Button.test.tsx  # ✅ コンポーネントと同じディレクトリ
```

### 2. テストの命名
```typescript
// ✅ Good
describe("Button", () => {
  it("renders with correct label", () => {});
  it("calls onClick when clicked", () => {});
});

// ❌ Bad
describe("Button", () => {
  it("test 1", () => {});
});
```

---

## Git コミットメッセージ

### フォーマット
```
<type>: <subject>

<body>

<footer>
```

### Type
- `feat`: 新機能
- `fix`: バグ修正
- `docs`: ドキュメント
- `style`: フォーマット
- `refactor`: リファクタリング
- `test`: テスト
- `chore`: その他

### 例
```
feat: タイトル画面コンポーネントを実装

- ボタンコンポーネントの追加
- ネオンエフェクトのスタイル適用

Closes #123
```

---

## チェックリスト

コミット前に確認：
- [ ] TypeScript のエラーがない
- [ ] ESLint の警告がない
- [ ] 命名規則に従っている
- [ ] コンポーネントが適切に分割されている
- [ ] 不要な console.log を削除
- [ ] 型を適切に定義している
- [ ] "use client" を適切に使用している
- [ ] パフォーマンスを考慮している

---

## 参考リンク

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Zustand Documentation](https://docs.pmnd.rs/zustand)
- [Shadcn UI](https://ui.shadcn.com/)

---

**最終更新**: 2025-10-01
