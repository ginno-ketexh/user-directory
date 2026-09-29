# User Directory

A small React directory for browsing people from the [JSONPlaceholder Users API](https://jsonplaceholder.typicode.com/users). Search by name, filter by role, and select a person to see their details.

**Live demo:** https://ginno-ketexh.github.io/user-directory/

## Setup

Requirements: Node.js 20+ and npm.

```bash
npm install
```

## Run the application

```bash
npm run dev
```

Vite prints a local URL (usually `http://localhost:5173/user-directory/`). A production build is:

```bash
npm run build
npm run preview
```

Preview uses the same `/user-directory/` base (usually `http://localhost:4173/user-directory/`).

## Run tests

```bash
npm test
```

Tests use Vitest and React Testing Library. `fetch` is mocked, so the suite does not call the network.

## Technology choices

- **Vite + React + TypeScript.** The app is small, and Vite gives a fast dev server and a straightforward production build. TypeScript keeps the API user and the assigned role explicit.
- **Functional components and hooks.** Screen state lives in `UserDirectory` (`useState` / `useMemo`). Loading, success, and error live in `useUsers`.
- **`fetch`.** One GET is enough. A data library would add concepts this screen does not need.
- **Tailwind CSS.** Layout and states follow the approved Figma frames. The page stacks below the `lg` breakpoint (1024px). From there, search sits beside the role filter and the list sits beside details. Horizontal padding widens again at `xl` (1280px), which matches the desktop frame.
- **Vitest + React Testing Library + jsdom.** Tests are grouped by user story. They cover loaded rows, search (including trimmed whitespace), role filter, the empty status message, missing or blank company and city, error/retry, selection, and the page landmarks.

## Architecture

```text
App
└── UserDirectory          search, role, and selection state
    ├── UserSearch
    ├── RoleFilter
    ├── UserList
    │   └── UserListItem
    ├── UserDetails
    └── loading / error states
```

`fetchUsers` loads `https://jsonplaceholder.typicode.com/users`, skips records that are not usable user objects, and assigns a stable role. A missing or negative id does not index off the role list:

```ts
const roles = ["Engineer", "Designer", "Product Manager", "QA Engineer"];
const index = Number.isInteger(user.id) && user.id >= 0 ? user.id % roles.length : 0;
const role = roles[index] ?? roles[0];
```

`filterUsers` applies the name query and the role together. The name match is case-insensitive and ignores surrounding whitespace. Role matching is exact, so "Engineer" does not include "QA Engineer".

Below 1024px the list and details stack, and choosing a person scrolls the details into view. That scroll is smooth unless reduced motion is requested, in which case the details are brought into view without animation. From the `lg` breakpoint up, the list scrolls on its own so the details panel stays beside it. A selected row uses a mint background, a teal accent bar, and a “SELECTED” label so the state is not color alone, and the button sets `aria-current="true"`. Keyboard focus uses a 2px blue ring. Rows are buttons, so Enter and Space select them. The page has one `header`, the directory content is in `main`, and the detail panel is an `aside`.

While rows are showing, a visually hidden count (for example, “3 users found”) updates as the search or role filter changes. An empty list is announced once, through that status (“No users found”), and does not also raise a live “0 users found”. Company and city render as “N/A” when they are missing or an empty string.

Selecting a row keeps that person in the details panel even if a later search hides them from the list. Retry calls `fetch` again and does not reload the page. A newer request aborts the previous one, so a slow response cannot overwrite fresher data.

## User stories and where they are implemented

The full wording, acceptance criteria, and current status of each story are in [docs/USER_STORIES.md](docs/USER_STORIES.md). The table below is the short map.

| Story | Acceptance summary | Files / components | Tests |
| --- | --- | --- | --- |
| 1. Fetch and display directory | On mount, load `https://jsonplaceholder.typicode.com/users`. Role is `roles[id % roles.length]` for Engineer, Designer, Product Manager, and QA Engineer. The list shows name, email, and role, and the selected row is highlighted. | `src/api/users.ts`, `src/hooks/useUsers.ts`, `src/components/UserDirectory.tsx`, `src/components/UserList.tsx`, `src/components/UserListItem.tsx` | `Story 1: Fetch and display directory` |
| 2. Async states | Show a loading status, an error message with Retry that fetches again without reloading the page, and “No users found” when the filters match nothing. | `src/hooks/useUsers.ts`, `src/components/StatusMessage.tsx`, `src/components/UserList.tsx` | `Story 2: Async states` |
| 3. Real-time search | A labeled “Search by name” field filters as you type. Matching is case-insensitive and ignores surrounding whitespace. | `src/components/UserSearch.tsx`, `src/filterUsers.ts` | `Story 3: Real-time search` |
| 4. Role filter | The dropdown offers All Roles, Engineer, Designer, Product Manager, and QA Engineer. It combines with search, and “Engineer” does not include “QA Engineer”. | `src/components/RoleFilter.tsx`, `src/filterUsers.ts`, `src/types.ts` | `Story 4: Role filter` |
| 5. Inspect details | Choosing a person shows name, email, role, phone, company, and city. With nobody selected, the panel shows “Select a user from the list to view full details”. | `src/components/UserDetails.tsx`, `src/components/UserDirectory.tsx` | `Story 5: Inspect details` |
| 6. Responsive layout and accessibility | Controls stay on top. List and details are side by side from `lg` (1024px) and stacked below that, including mobile. Controls have labels. Rows are buttons, so Enter and Space activate them. The page uses one `header`, a `main`, and an `aside` for details. | `src/components/UserDirectory.tsx`, `src/components/UserDetails.tsx`, `src/components/UserListItem.tsx`, `src/components/UserSearch.tsx`, `src/components/RoleFilter.tsx` | `Story 6: Responsive layout and accessibility` |
| 7. Design | The UI follows the Figma frames (desktop 1280, tablet 768, mobile 390) and the shared color, spacing, and type tokens. Focus, selected, hover, loading, error, and empty states are visible. | `tailwind.config.js`, `src/index.css`, `src/components/` | Screen tests cover the states. Layout at 390, 768, 1024, and 1280 was checked in the browser. |
| 8. Safe with incomplete data | Missing or empty-string company and city render “N/A”. A filtered list announces a count while rows remain, and announces the empty state once. | `src/api/users.ts`, `src/components/UserDetails.tsx`, `src/components/UserList.tsx` | `Story 8: Safe with incomplete data` |
| 9. Quality and delivery | `npm test`, `npm run lint`, and `npm run build` pass. This README keeps the AI disclosure and the scalability notes. GitHub Pages is configured, and `node_modules` is not committed. | `package.json`, `README.md`, `docs/USER_STORIES.md`, `.github/workflows/pages.yml`, `.gitignore` | `npm test`, `npm run lint`, `npm run build` |

## Tradeoffs

- Filtering happens in the browser. That is the right fit for ten records and the wrong fit for a large directory (see below).
- Each API record is checked before it is shown. A row that is not an object, or that has no usable id and name, is skipped so one bad record cannot crash the page. Company and address are optional.
- Search updates on each keystroke. With ten local records there is nothing to debounce.
- Bonus items from the brief (URL state, sorting, pagination, favorites, dark mode) are not included.

## With more time

- Sync search and role to the query string so a filtered view can be shared and restored on refresh.
- Debounce the search field once filtering is no longer free.
- Add a keyboard shortcut or arrow-key list navigation on top of the existing buttons.
- Cover the role helper and `filterUsers` with a few pure unit tests in addition to the screen tests.

## Scalability: 100,000+ users

The current design downloads every user and filters in memory. That will not hold up at this size.

- **Server-side search and filtering.** Name and role should be query parameters. The client should not receive the full set.
- **Cursor pagination.** Return a page plus a cursor (`?limit=50&cursor=...`) instead of offset pages that drift when data changes. The UI would ask for the next page as the person scrolls or presses "Next".
- **List virtualization.** Render only the rows on screen (for example with `react-window` or `react-virtual`) so thousands of DOM nodes are not mounted for one page of results.
- **Debounce and cancel.** Debounce the search box (about 200–300ms) and abort the previous request with `AbortController` so stale responses cannot overwrite a newer query.
- **Caching.** Cache pages by query key, and invalidate when the directory data changes. A small client cache is enough until the same filters are requested constantly, at which point a shared HTTP or server cache matters more.
- **API shape.** Return the fields the list needs (id, name, email, role) and load phone, company, and city only when a row is selected.

## AI usage

Cursor cloud agent assisted this implementation under Ginno’s direction. The candidate remains responsible for explaining the code, architecture, tradeoffs, and tests in the interview.
