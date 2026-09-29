# User stories

Stories 1 to 6 are the product requirements. Stories 7 to 9 record the design, data-safety, and delivery expectations added for this app. Each “Implemented in” line names the current code and the tests that cover it. Where the code only partly meets a criterion, that is stated here.

## Story 1: Fetch and Display User Directory

As a team member
I want to view a structured directory of users loaded from the API
So that I can easily scan company personnel and their roles

### Acceptance Criteria

- Fetch users from `https://jsonplaceholder.typicode.com/users` on the initial mount.
- Assign a deterministic role with `user.id % roles.length`, using Engineer, Designer, Product Manager, and QA Engineer, and keep that role stable across re-renders.
- Show Name, Email, and Role in the list.
- Highlight the active selected item.

**Implemented in:** `src/hooks/useUsers.ts` loads on mount through `src/api/users.ts` (`USERS_ENDPOINT`, `roleForId`). `src/components/UserList.tsx` and `src/components/UserListItem.tsx` render name, email, and role. A selected row uses the mint background, accent bar, SELECTED label, and `aria-current="true"`. Non-negative finite ids use `Math.trunc(id) % roles.length`; a missing, non-numeric, or negative id falls back to Engineer instead of indexing off the list. The list is a `ul`, not a table. Tests: describe `Story 1: Fetch and display directory` (`renders users after data loads`). The selected-row `aria-current` check lives in describe `Story 5: Inspect details` (`shows details for the selected user`). There is no test that asserts the highlight colors.

## Story 2: Asynchronous Application States

As a user
I want visual feedback during network requests, empty search results, and API errors
So that I understand the app status and can recover

### Acceptance Criteria

- Show a spinner or status while users are loading.
- Show a clear error banner and a Retry button that runs the request again without a page refresh.
- Show an explicit “No users found” message when search or filtering returns zero records.

**Implemented in:** `src/components/StatusMessage.tsx` (`LoadingState`, `ErrorState`) and `src/hooks/useUsers.ts` (`retry`). `src/components/UserList.tsx` renders the empty copy. Loading is a `role="status"` region with skeleton bars and the text “Loading users…”. There is no spinner graphic. The error is a `role="alert"` with Retry, and retry calls `fetch` again. Tests: describe `Story 2: Async states` (`shows a loading status while users are requested`, `shows an error and retries the request without a page reload`, `shows an empty state when nothing matches`).

## Story 3: Real-Time User Search

As a user
I want to search users by name
So that I can find colleagues without scrolling

### Acceptance Criteria

- Provide an accessible text input labeled “Search by Name”.
- Match names without regard to case.
- Filter the list in real time as the person types.

**Implemented in:** `src/components/UserSearch.tsx` and `src/filterUsers.ts`. The visible label is “Search by name” (lowercase “n”), wired with `htmlFor` / `id`. Matching is case-insensitive, updates on each change, and also ignores surrounding whitespace. Tests: describe `Story 3: Real-time search` (`filters the list by a case-insensitive search term`, `trims surrounding whitespace when searching by name`).

## Story 4: Role-Based Filtering

As a user
I want to filter users by role
So that I can view members of specific functions

### Acceptance Criteria

- Offer a dropdown with All Roles, Engineer, Designer, Product Manager, and QA Engineer.
- Selecting a role hides users in other roles.
- Search and role work together. For example, “Alice” plus Engineer shows only engineers whose names match Alice.

**Implemented in:** `src/components/RoleFilter.tsx`, `src/filterUsers.ts`, and `src/types.ts` (`roles`). Role matching is exact, so Engineer does not include QA Engineer. The combined filter is general; the suite does not use a person named Alice. Tests: describe `Story 4: Role filter` (`filters the list by role without matching a different role that shares a word`, `applies the search and role filter together`, which uses “clem” plus QA Engineer).

## Story 5: Inspect User Details

As a user
I want to select a user
So that I can see their full profile in an adjacent detail panel

### Acceptance Criteria

- Clicking an item selects it and shows the panel.
- The panel shows full name, email, role, phone, company name, and city or address.
- When nothing is selected, the placeholder is “Select a user from the list to view full details”.

**Implemented in:** `src/components/UserDirectory.tsx` (selection state) and `src/components/UserDetails.tsx`. The panel shows name, email, role, phone, company name, and city. It does not show street, suite, or zip code. The visible prompt includes the exact placeholder sentence, under the shorter heading “Select a user”. Tests: describe `Story 5: Inspect details` (`prompts to select a user for full details`, `shows details for the selected user`).

## Story 6: Responsive Layout and Accessibility

As a user on desktop or mobile
I want a responsive split view with keyboard accessibility
So that I can browse the directory on either device and without a pointer

### Acceptance Criteria

- On desktop, use a split pane with controls on top, the list on the left, and details on the right.
- On small screens, stack the layout vertically.
- Form controls have associated labels. Items are keyboard focusable (Tab) and selectable (Enter and Space). Use semantic `header`, `main`, `aside`, and `button`.

**Implemented in:** `src/components/UserDirectory.tsx`, `src/components/UserSearch.tsx`, `src/components/RoleFilter.tsx`, `src/components/UserListItem.tsx`, and `src/components/UserDetails.tsx`. Controls stay above the list and details. Side-by-side layout starts at the `lg` breakpoint (1024px). Below that, including the 768px tablet width and mobile, the controls, list, and details stack, and choosing a person scrolls the details into view. Search and role have `label` elements. Each row is a `button`, so Tab, Enter, and Space use native button behavior. There is one `header`, the directory content is in `main`, and the detail panel is an `aside`. Tests: describe `Story 6: Responsive layout and accessibility` (`uses one header, a main landmark, and a details aside`). There is no automated test for Tab, Enter, Space, or the breakpoint.

## Story 7: Consistent, Designed UI (Design Systems)

As a reader of the directory
I want the interface to follow the shared design
So that desktop, tablet, and mobile feel like the same product

### Acceptance Criteria

- Follow the Figma source of truth at https://www.figma.com/design/dJW8tdVKc2O3nrGTagTxDL, including the desktop, tablet, and mobile frames.
- Use shared tokens for color, spacing, and type.
- Show a visible focus ring and distinct selected, hover, loading, error, and empty states.

**Implemented in:** `tailwind.config.js` (color, spacing-related shadow, and type tokens) and `src/index.css`, applied by the components under `src/components/`. The frames used as reference are Desktop 1280, Tablet 768, and Mobile 390. At 1280 the list and details columns match that frame (497 / 671) and the page padding is 48px. Tablet and mobile stay stacked. The app also turns the split view on at 1024px, which is not its own Figma frame. Focus uses a 2px blue ring. Selected, hover, loading, error, and empty treatments are visible. Loading is the skeleton status from Story 2, not a separate spinner frame. There is no visual-regression test. The state copy is covered by the Story 2 and Story 5 screen tests. Layout at 390, 768, 1024, and 1280 was checked in a browser against the production build.

## Story 8: Safe Handling of Incomplete Data

As a user
I want incomplete records and filter changes to stay understandable
So that a missing field does not look like a broken row and result changes are announced once

### Acceptance Criteria

- Optional company, address, and city show “N/A”, including when the value is an empty string.
- Tell screen readers when the list or the empty state changes, without announcing the empty state twice.

**Implemented in:** `src/api/users.ts` skips records that are not usable user objects and treats company and address as optional. `src/components/UserDetails.tsx` (`valueOrNA`) renders “N/A” when company name or city is missing or `""`. The panel does not render street or the rest of the address, so those are not given their own “N/A”. An empty phone or email is shown as a blank string, not “N/A”. `src/components/UserList.tsx` announces a visually hidden count while rows are showing. When nothing matches, only the “No users found” status is live; the “0 users found” string is in the DOM with `aria-hidden` and is not a second live region. Tests: describe `Story 8: Safe with incomplete data` (`renders N/A when a user is missing company and address`, `renders N/A when company or city is an empty string`, `exposes the empty state as a single status`).

## Story 9: Quality and Delivery

As a maintainer
I want the directory tested, documented, and published
So that someone can review it and open it without cloning the repo first

### Acceptance Criteria

- Automated tests, lint, and the production build pass.
- The README includes an AI disclosure and an answer for how the app would scale.
- The app is live on GitHub Pages.
- `node_modules` is not committed.

**Implemented in:** `package.json` scripts `test`, `lint`, and `build`. Screen tests live in `src/App.test.tsx`. `README.md` keeps the “AI usage” disclosure and the “Scalability: 100,000+ users” section, and links to this document. `.github/workflows/pages.yml` deploys GitHub Pages from `main` (and can be run manually). The README live demo is https://ginno-ketexh.github.io/user-directory/. This branch is not merged, so that site serves `main` until this pull request lands. `node_modules/` is listed in `.gitignore` and is not part of the commits. There is no Story 9 describe block; delivery is checked with `npm test`, `npm run lint`, and `npm run build`.
