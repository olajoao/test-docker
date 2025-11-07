import { authService } from "@/api/services"
import { useMutation } from "@tanstack/react-query"
import type { AuthProps, AuthSuccessProps } from "./model"
import { useForm } from "@tanstack/react-form"
import { toast } from "sonner"
import { useNavigate } from "@tanstack/react-router"

export const useAuth = () => {
  const navigate = useNavigate()
  const loginMutation = useMutation({
    mutationKey: ['login'],
    mutationFn: (payload: AuthProps) => authService.create(payload),
    onSuccess: (data) => handleSuccess(data),
    onError: handleError
  })

  function handleSuccess(response: AuthSuccessProps) {
    localStorage.setItem('app_data', JSON.stringify(response))
    navigate({ to: '/sip/branchs' })
  }

  function handleError() {
    toast.warning('Erro ao fazer login. Verifique as credenciais e tente novamente.')
  }

  const form = useForm({
    defaultValues: {
      login: '',
      password: ''
    },
    onSubmit: async ({ value }) => {
      const payload: AuthProps = {
        grant_type: "password",
        client_id: 7,
        client_secret: "vMeKD4XOqO2GHw8ce47nF2c8uI7OZBU96Efc1zPO",
        username: "660:developers@elevensoft.dev",
        scope: "",
        password: "spx@spx",
      }

      console.log('just to hide unused error', value)
      return await loginMutation.mutateAsync(payload)
    }
  })

  return {
    form, loginMutation
  }
}
