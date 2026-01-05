import { Input } from "@/components/ui/input"
import { Route } from "@/pages/_app/_layout.pabx.callback"
import { useForm } from "@tanstack/react-form"
import { useSearch } from "@tanstack/react-router"

export function TableSearchForm() {
  const search = useSearch({ from: Route.id })
  const navigate = Route.useNavigate()

  const form = useForm({
    defaultValues: {
      filter: search.filter ?? ''
    },
    onSubmit: ({ value }) => {
      navigate({
        search: (prev) => ({
          ...prev,
          filter: value.filter || undefined,
          page: 1,
        })
      })
    }
  })

  return (
    <form className="flex-1" onSubmit={(e) => {
      e.preventDefault()
      form.handleSubmit()
    }}>
      <form.Field
        name="filter"
        children={(field) => (
          <Input
            className='py-2 h-8 w-[50%] outline-none ring-none focus-visible:ring-0'
            name={field.name}
            value={field.state.value}
            type='text'
            placeholder="Pesquisar..."
            onChange={(e) => field.handleChange(e.target.value)}
          />
        )}
      />
    </form>
  )
}
