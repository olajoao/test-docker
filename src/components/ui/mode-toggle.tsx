import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/hooks/use-theme"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="flex items-center cursor-pointer justify-end gap-2 w-full"
    >
      {theme === "light" ? (
        <>
          <Moon className="h-4 w-4" />
        </>
      ) : (
        <>
          <Sun className="h-4 w-4" />
        </>
      )}
    </button>
  )
}
