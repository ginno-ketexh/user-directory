# User Directory

A small React directory for browsing people from the [JSONPlaceholder Users API](https://jsonplaceholder.typicode.com/users). Search by name, filter by role, and select a person to see their details.

## Setup

Requirements: Node.js 20+ and npm.

```bash
npm install
```

## Run the application

```bash
npm run dev
```

Vite prints a local URL (usually `http://localhost:5173`). A production build is:

```bash
npm run build
npm run preview
```

## Run tests

```bash
npm test
```

Tests use Vitest and React Testing Library. `fetch` is mocked, so the suite does not call the network.

## Technology choices

- **Vite + React + TypeScript.** The app is small, and Vite gives a fast dev server and a straightforward production build. TypeScript keeps the API user and the assigned role explicit.
- **Functional components and hooks.** Screen state lives in `UserDirectory` (`useState` / `useMemo`). Loading, success, and error live in `useUsers`.
- **`fetch`.** One GET is enough. A data library would add concepts this screen does not need.
- **Tailwind CSS.** Layout and states follow the approved Figma frames: stacked on mobile and tablet, search beside the role filter and the list beside details from the `xl` (1280px) breakpoint up.
- **Vitest + React Testing Library + jsdom.** Tests cover what a person sees: loaded rows, search, role filter, the empty message, error/retry, and selection.

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

`fetchUsers` loads `https://jsonplaceholder.typicode.com/users` and assigns a stable role:

```ts
const roles = ["Engineer", "Designer", "Product Manager", "QA Engineer"];
const role = roles[user.id % roles.length];
```

`filterUsers` applies the name query and the role together. The name match is case-insensitive and ignores surrounding whitespace. Role matching is exact, so "Engineer" does not include "QA Engineer".

Below 1280px the list and details stack, and choosing a person scrolls the details into view. From the `xl` breakpoint up, the list scrolls on its own so the details panel stays beside it. A selected row uses a mint background, a teal accent bar, and a “SELECTED” label so the state is not color alone. Keyboard focus uses a 2px blue ring.

Selecting a row keeps that person in the details panel even if a later search hides them from the list. Retry calls `fetch` again and does not reload the page. A newer request aborts the previous one, so a slow response cannot overwrite fresher data.

## Tradeoffs

- Filtering happens in the browser. That is the right fit for ten records and the wrong fit for a large directory (see below).
- The response is trusted as the JSONPlaceholder user shape after checking that it is an array. A runtime schema would be more defensive and more code than this exercise needs.
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
