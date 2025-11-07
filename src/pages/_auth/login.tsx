import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/modules/auth/hooks";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/login")({
  component: Login,
})

export function Login() {
  const { form } = useAuth()
  return (
    <section className="flex">
      <aside className="p-5 w-80 min-h-screen h-full space-y-10">
        <h1 className="text-lg font-medium">Painel de Controle do Cliente</h1>
        <form onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }} className="space-y-8">
          <form.Field
            name="login"
            validators={{
              onChange: ({ value }) => {
                if (!value.length) return 'Campo obrigatório'
                if (value.length < 3) return 'Mínimo 3 caracteres'
                return undefined
              }
            }}
            children={(field) => (
              <div className="relative">
                <Input
                  className="w-full text-xs placeholder:text-xs"
                  placeholder="Email ou PABX"
                  autoComplete="username"
                  name={field.name}
                  value={field.state.value}
                  type='text'
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {!field.state.meta.isValid && (
                  <em className="text-[10px] text-red-600 absolute -bottom-4 left-1" role="alert">{field.state.meta.errors.join(',')}</em>
                )}
              </div>
            )}
          />

          <form.Field
            name="password"
            children={(field) => (
              <Input
                className="w-full text-xs placeholder:text-xs"
                placeholder="Senha"
                name={field.name}
                autoComplete="current-password"
                value={field.state.value}
                type='password'
                onChange={(e) => field.handleChange(e.target.value)}
              />
            )}
          />

          <Button type="submit" size="sm" className="w-full cursor-pointer">Acessar</Button>
        </form>

        <small className="text-xs text-muted-foreground">SaperX - Todos os direitos reservados</small>
      </aside>
      <div className="flex items-center justify-center flex-1 bg-slate-800 text-white">
        background maneiro
      </div>
    </section>
  )
}
