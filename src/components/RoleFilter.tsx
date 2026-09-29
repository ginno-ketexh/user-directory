import { roles, type RoleFilter as RoleFilterValue } from '../types.ts'

type RoleFilterProps = {
  value: RoleFilterValue
  onChange: (value: RoleFilterValue) => void
}

export function RoleFilter({ value, onChange }: RoleFilterProps) {
  return (
    <div>
      <label htmlFor="role-filter" className="mb-1.5 block text-sm font-medium text-stone-700">
        Role
      </label>
      <select
        id="role-filter"
        value={value}
        onChange={(event) => onChange(event.target.value as RoleFilterValue)}
        className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 shadow-sm focus-visible:border-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700"
      >
        <option value="all">All Roles</option>
        {roles.map((role) => (
          <option key={role} value={role}>
            {role}
          </option>
        ))}
      </select>
    </div>
  )
}
