import type { DirectoryUser } from '../types.ts'

type UserDetailsProps = {
  user: DirectoryUser | null
}

export function UserDetails({ user }: UserDetailsProps) {
  return (
    <section
      aria-labelledby="user-details-heading"
      className="overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm"
    >
      <div className="border-b border-stone-200 px-4 py-3">
        <h2
          id="user-details-heading"
          className="text-sm font-semibold uppercase tracking-wide text-stone-500"
        >
          User details
        </h2>
      </div>

      {user ? (
        <dl className="grid gap-4 p-4 sm:grid-cols-2">
          <Detail label="Name" value={user.name} className="sm:col-span-2" emphasize />
          <Detail label="Email" value={user.email} />
          <Detail label="Role" value={user.role} />
          <Detail label="Phone" value={user.phone} />
          <Detail label="Company" value={user.company.name} />
          <Detail label="City" value={user.address.city} className="sm:col-span-2" />
        </dl>
      ) : (
        <p className="px-4 py-10 text-sm text-stone-600">Select a user to see their details.</p>
      )}
    </section>
  )
}

type DetailProps = {
  label: string
  value: string
  className?: string
  emphasize?: boolean
}

function Detail({ label, value, className, emphasize = false }: DetailProps) {
  return (
    <div className={className}>
      <dt className="text-xs font-medium uppercase tracking-wide text-stone-500">{label}</dt>
      <dd className={emphasize ? 'mt-1 text-lg font-semibold text-stone-900' : 'mt-1 text-sm text-stone-900'}>
        {value}
      </dd>
    </div>
  )
}
