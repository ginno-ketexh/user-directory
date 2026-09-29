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

describe('User Directory', () => {
  it('renders users after data loads', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse(users)))

    render(<App />)

    expect(screen.getByRole('status')).toHaveTextContent(/loading users/i)

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

  it('shows an empty state when nothing matches', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse(users)))
    const user = userEvent.setup()

    render(<App />)
    await screen.findByRole('list', { name: 'Users' })

    await user.type(screen.getByLabelText('Search by name'), 'nobody')

    expect(screen.getByText('No users found.')).toBeInTheDocument()
    expect(screen.queryByRole('list', { name: 'Users' })).not.toBeInTheDocument()
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
    expect(alert).toHaveTextContent(/could not load users/i)
    expect(alert).toHaveTextContent(/status 503/i)

    await user.click(screen.getByRole('button', { name: 'Retry' }))

    expect(await screen.findByRole('button', { name: /leanne graham/i })).toBeInTheDocument()
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it('shows details for the selected user', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse(users)))
    const user = userEvent.setup()

    render(<App />)
    await screen.findByRole('list', { name: 'Users' })

    expect(screen.getByText('Select a user to see their details.')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /ervin howell/i }))

    const details = screen.getByRole('region', { name: 'User details' })
    expect(within(details).getByText('Ervin Howell')).toBeInTheDocument()
    expect(within(details).getByText('Shanna@melissa.tv')).toBeInTheDocument()
    expect(within(details).getByText('Product Manager')).toBeInTheDocument()
    expect(within(details).getByText('010-692-6593 x09125')).toBeInTheDocument()
    expect(within(details).getByText('Deckow-Crist')).toBeInTheDocument()
    expect(within(details).getByText('Wisokyburgh')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /ervin howell/i })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
  })
})
