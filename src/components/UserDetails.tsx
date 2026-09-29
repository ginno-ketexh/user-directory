import type { Ref } from 'react'
import type { DirectoryUser } from '../types.ts'

type UserDetailsProps = {
  user: DirectoryUser | null
  sectionRef?: Ref<HTMLElement>
}

const cardClass = 'overflow-hidden rounded-xl border border-line bg-white shadow-card'

export function UserDetails({ user, sectionRef }: UserDetailsProps) {
  return (
    <section
      ref={sectionRef}
      aria-labelledby="user-details-heading"
      className={`min-w-0 scroll-mt-4 ${cardClass}`}
    >
      <div className="border-b border-line px-4 pb-2.5 pt-3.5">
        <h2 id="user-details-heading" className="text-[11px] font-bold uppercase text-faint">
          User details
        </h2>
      </div>

      {user ? (
        <dl className="flex flex-col gap-3.5 p-4 md:gap-4">
          <Detail label="Name" value={user.name} emphasize />
          <div className="grid gap-3.5 md:grid-cols-2 md:gap-x-8 md:gap-y-4">
            <Detail label="Email" value={user.email} />
            <Detail label="Role" value={user.role} />
            <Detail label="Phone" value={user.phone} />
            <Detail label="Company" value={user.company.name} />
          </div>
          <Detail label="City" value={user.address.city} />
        </dl>
      ) : (
        <div className="flex flex-col items-center gap-2 px-8 py-8 text-center">
          <p className="text-base font-semibold leading-[normal] text-ink">Select a user</p>
          <p className="text-[13px] leading-[normal] text-muted">
            Choose someone from the list to see their details.
          </p>
        </div>
      )}
    </section>
  )
}

type DetailProps = {
  label: string
  value: string
  emphasize?: boolean
}

function Detail({ label, value, emphasize = false }: DetailProps) {
  return (
    <div className="flex min-w-0 flex-col gap-1">
      <dt className="text-[11px] font-semibold uppercase leading-[normal] text-faint">{label}</dt>
      <dd
        className={
          emphasize
            ? 'break-words text-lg font-bold leading-[normal] text-ink'
            : 'break-words text-sm leading-[normal] text-ink'
        }
      >
        {value}
      </dd>
    </div>
  )
}
