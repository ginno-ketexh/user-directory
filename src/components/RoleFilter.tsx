import { roles, type RoleFilter as RoleFilterValue } from '../types.ts'

type RoleFilterProps = {
  value: RoleFilterValue
  onChange: (value: RoleFilterValue) => void
}

const controlClass =
  'role-select w-full appearance-none rounded-lg border border-line bg-white py-[11px] pl-3 pr-8 text-sm leading-normal text-ink outline-none focus-visible:border-focus focus-visible:shadow-focus xl:w-[220px]'

export function RoleFilter({ value, onChange }: RoleFilterProps) {
  return (
    <div className="flex flex-col gap-1.5 xl:w-[220px] xl:shrink-0">
      <label htmlFor="role-filter" className="text-xs font-medium leading-normal text-muted">
        Role
      </label>
      <select
        id="role-filter"
        value={value}
        onChange={(event) => onChange(event.target.value as RoleFilterValue)}
        className={controlClass}
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
