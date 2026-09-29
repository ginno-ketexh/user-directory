import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { App } from './App.tsx'

const users = [
  {
    id: 1,
    name: 'Leanne Graham',
    email: 'Sincere@april.biz',
    phone: '1-770-736-8031 x56442',
    company: { name: 'Romaguera-Crona' },
    address: { city: 'Gwenborough' },
  },
  {
    id: 2,
    name: 'Ervin Howell',
    email: 'Shanna@melissa.tv',
    phone: '010-692-6593 x09125',
    company: { name: 'Deckow-Crist' },
    address: { city: 'Wisokyburgh' },
  },
  {
    id: 3,
    name: 'Clementine Bauch',
    email: 'Nathan@yesenia.net',
    phone: '1-463-123-4447',
    company: { name: 'Romaguera-Jacobson' },
    address: { city: 'McKenziehaven' },
  },
  {
    id: 4,
    name: 'Patricia Lebsack',
    email: 'Julianne.OConner@kory.org',
    phone: '493-170-9623 x156',
    company: { name: 'Robel-Corkery' },
    address: { city: 'South Elvis' },
  },
]

const selectionPrompt = 'Select a user from the list to view full details'

function jsonResponse(body: unknown, ok = true, status = ok ? 200 : 500) {
  return {
    ok,
    status,
    json: async () => body,
  }
}

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('Story 1: Fetch and display directory', () => {
  it('renders users after data loads', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse(users)))

    render(<App />)

    const list = await screen.findByRole('list', { name: 'Users' })
    expect(within(list).getByText('Leanne Graham')).toBeInTheDocument()
    expect(within(list).getByText('Sincere@april.biz')).toBeInTheDocument()
    expect(within(list).getByText('Designer')).toBeInTheDocument()
    expect(within(list).getByText('Ervin Howell')).toBeInTheDocument()
    expect(within(list).getByText('Clementine Bauch')).toBeInTheDocument()
    expect(within(list).getByText('Patricia Lebsack')).toBeInTheDocument()
    expect(fetch).toHaveBeenCalledWith(
      'https://jsonplaceholder.typicode.com/users',
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    )
  })
})

describe('Story 2: Async states', () => {
  it('shows a loading status while users are requested', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse(users)))

    render(<App />)

    expect(screen.getByRole('status')).toHaveTextContent(/loading users/i)
    expect(await screen.findByRole('list', { name: 'Users' })).toBeInTheDocument()
  })

  it('shows an error and retries the request without a page reload', async () => {
    const user = userEvent.setup()
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse(null, false, 503))
      .mockResolvedValueOnce(jsonResponse(users))
    vi.stubGlobal('fetch', fetchMock)

    render(<App />)

    const alert = await screen.findByRole('alert')
    expect(alert).toHaveTextContent(/couldn’t load users/i)
    expect(alert).toHaveTextContent(/check your connection, then try again/i)

    await user.click(screen.getByRole('button', { name: 'Retry' }))

    expect(await screen.findByRole('button', { name: /leanne graham/i })).toBeInTheDocument()
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it('shows an empty state when nothing matches', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse(users)))
    const user = userEvent.setup()

    render(<App />)
    await screen.findByRole('list', { name: 'Users' })

    await user.type(screen.getByLabelText('Search by name'), 'nobody')

    expect(screen.getByText('No users found')).toBeInTheDocument()
    expect(screen.getByText('Try a different name or role filter.')).toBeInTheDocument()
    expect(screen.queryByRole('list', { name: 'Users' })).not.toBeInTheDocument()
  })
})

describe('Story 3: Real-time search', () => {
  it('filters the list by a case-insensitive search term', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse(users)))
    const user = userEvent.setup()

    render(<App />)
    await screen.findByRole('list', { name: 'Users' })

    await user.type(screen.getByLabelText('Search by name'), 'eRvIn')

    const list = screen.getByRole('list', { name: 'Users' })
    expect(within(list).getByText('Ervin Howell')).toBeInTheDocument()
    expect(within(list).queryByText('Leanne Graham')).not.toBeInTheDocument()
    expect(within(list).queryByText('Clementine Bauch')).not.toBeInTheDocument()
    expect(within(list).queryByText('Patricia Lebsack')).not.toBeInTheDocument()
  })

  it('trims surrounding whitespace when searching by name', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse(users)))
    const user = userEvent.setup()

    render(<App />)
    await screen.findByRole('list', { name: 'Users' })

    await user.type(screen.getByLabelText('Search by name'), '  eRvIn  ')

    const list = screen.getByRole('list', { name: 'Users' })
    expect(within(list).getByText('Ervin Howell')).toBeInTheDocument()
    expect(within(list).queryByText('Leanne Graham')).not.toBeInTheDocument()
    expect(within(list).queryByText('Clementine Bauch')).not.toBeInTheDocument()
    expect(within(list).queryByText('Patricia Lebsack')).not.toBeInTheDocument()
    expect(screen.getByText('1 user found')).toBeInTheDocument()
  })
})

describe('Story 4: Role filter', () => {
  it('filters the list by role without matching a different role that shares a word', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse(users)))
    const user = userEvent.setup()

    render(<App />)
    await screen.findByRole('list', { name: 'Users' })

    await user.selectOptions(screen.getByLabelText('Role'), 'Engineer')

    const list = screen.getByRole('list', { name: 'Users' })
    expect(within(list).getByText('Patricia Lebsack')).toBeInTheDocument()
    expect(within(list).getByText('Engineer')).toBeInTheDocument()
    expect(within(list).queryByText('Clementine Bauch')).not.toBeInTheDocument()
    expect(within(list).queryByText('Leanne Graham')).not.toBeInTheDocument()
    expect(within(list).queryByText('Ervin Howell')).not.toBeInTheDocument()
  })

  it('applies the search and role filter together', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse(users)))
    const user = userEvent.setup()

    render(<App />)
    await screen.findByRole('list', { name: 'Users' })

    await user.selectOptions(screen.getByLabelText('Role'), 'QA Engineer')
    await user.type(screen.getByLabelText('Search by name'), 'clem')

    const list = screen.getByRole('list', { name: 'Users' })
    expect(within(list).getByText('Clementine Bauch')).toBeInTheDocument()
    expect(within(list).queryByText('Patricia Lebsack')).not.toBeInTheDocument()
  })
})

describe('Story 5: Inspect details', () => {
  it('prompts to select a user for full details', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse(users)))

    render(<App />)
    await screen.findByRole('list', { name: 'Users' })

    expect(screen.getByText('Select a user')).toBeInTheDocument()
    expect(screen.getByText(selectionPrompt)).toBeVisible()
  })

  it('shows details for the selected user', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse(users)))
    const user = userEvent.setup()

    render(<App />)
    await screen.findByRole('list', { name: 'Users' })

    expect(screen.getByText('Select a user')).toBeInTheDocument()
    expect(screen.getByText(selectionPrompt)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /ervin howell/i }))

    const details = screen.getByRole('complementary', { name: 'User details' })
    expect(within(details).getByText('Ervin Howell')).toBeInTheDocument()
    expect(within(details).getByText('Shanna@melissa.tv')).toBeInTheDocument()
    expect(within(details).getByText('Product Manager')).toBeInTheDocument()
    expect(within(details).getByText('010-692-6593 x09125')).toBeInTheDocument()
    expect(within(details).getByText('Deckow-Crist')).toBeInTheDocument()
    expect(within(details).getByText('Wisokyburgh')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /ervin howell/i })).toHaveAttribute(
      'aria-current',
      'true',
    )
  })
})

describe('Story 6: Responsive layout and accessibility', () => {
  it('uses one header, a main landmark, and a details aside', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse(users)))

    render(<App />)
    await screen.findByRole('list', { name: 'Users' })

    expect(document.querySelectorAll('header')).toHaveLength(1)
    const main = screen.getByRole('main')
    const details = screen.getByRole('complementary', { name: 'User details' })

    expect(details).toHaveAttribute('aria-labelledby', 'user-details-heading')
    expect(main).toContainElement(screen.getByLabelText('Search by name'))
    expect(main).toContainElement(screen.getByRole('list', { name: 'Users' }))
    expect(main).toContainElement(details)
    expect(main.contains(document.querySelector('header'))).toBe(false)
  })
})

describe('Story 8: Safe with incomplete data', () => {
  it('renders N/A when a user is missing company and address', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        jsonResponse([
          { nope: true },
          {
            id: 2,
            name: 'Ervin Howell',
            email: 'Shanna@melissa.tv',
            phone: '010-692-6593 x09125',
          },
        ]),
      ),
    )
    const user = userEvent.setup()

    render(<App />)

    await user.click(await screen.findByRole('button', { name: /ervin howell/i }))

    const details = screen.getByRole('complementary', { name: 'User details' })
    expect(within(details).getByText('Ervin Howell')).toBeInTheDocument()
    expect(within(details).getByText('Shanna@melissa.tv')).toBeInTheDocument()
    expect(within(details).getByText('010-692-6593 x09125')).toBeInTheDocument()
    expect(within(details).getAllByText('N/A')).toHaveLength(2)
  })

  it('renders N/A when company or city is an empty string', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        jsonResponse([
          {
            id: 2,
            name: 'Ervin Howell',
            email: 'Shanna@melissa.tv',
            phone: '010-692-6593 x09125',
            company: { name: '' },
            address: { city: '' },
          },
        ]),
      ),
    )
    const user = userEvent.setup()

    render(<App />)

    await user.click(await screen.findByRole('button', { name: /ervin howell/i }))

    const details = screen.getByRole('complementary', { name: 'User details' })
    expect(within(details).getByText('Ervin Howell')).toBeInTheDocument()
    expect(within(details).getByText('Shanna@melissa.tv')).toBeInTheDocument()
    expect(within(details).getAllByText('N/A')).toHaveLength(2)
  })

  it('exposes the empty state as a single status', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse(users)))
    const user = userEvent.setup()

    render(<App />)
    await screen.findByRole('list', { name: 'Users' })

    await user.type(screen.getByLabelText('Search by name'), 'nobody')

    const status = screen.getByRole('status')
    expect(status).toHaveTextContent('No users found')
    expect(status).toHaveTextContent('Try a different name or role filter.')
    expect(screen.getByText('0 users found')).toBeInTheDocument()
    expect(screen.getAllByRole('status')).toHaveLength(1)
    expect(document.querySelectorAll('[aria-live]')).toHaveLength(0)
  })
})
