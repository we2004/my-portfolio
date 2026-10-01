interface SkillBadgeProps {
  name: string
}

export function SkillBadge({ name }: SkillBadgeProps) {
  return (
    <li>
      <div className="flex items-center gap-2 whitespace-nowrap rounded-md border border-foreground/15 bg-foreground/6 px-3 py-2 font-ui text-[10px] uppercase text-foreground shadow-sm shadow-foreground/10 transition-[border-color,background-color] duration-200 hover:border-accent/70 sm:text-xs">
        <span
          aria-hidden="true"
          className="text-accent"
        >
          &lt;/&gt;
        </span>
        <span>{name}</span>
      </div>
    </li>
  )
}

export default SkillBadge
