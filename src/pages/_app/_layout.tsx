import { AppBreadcrumb } from "@/components/app-breadcrumb"
import { AppSidebar } from "@/components/ui/app-sidebar"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { createFileRoute, Outlet } from '@tanstack/react-router'
import { usePermissions } from '@/modules/auth/hooks'
// import { useAuthStore } from "@/stores/auth-store"
// import { useEffect } from "react"

export const Route = createFileRoute("/_app/_layout")({
  component: Layout,
})
 
export default function Layout() {
  // const navigate = useNavigate()
  // const isAuthenticated = useAuthStore(state => state.isAuthenticated)
  
  // Carrega permissões do mock para exibir sidebar
  const { isLoading } = usePermissions()

  // Desabilitado temporariamente - sem integração com backend
  // useEffect(() => {
  //   if (!isAuthenticated) {
  //     navigate({ to: '/login' })
  //   }
  // }, [isAuthenticated, navigate])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-sm text-muted-foreground">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="relative">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <AppBreadcrumb />
        </header>
        <section className="overflow-x-hidden flex flex-1 flex-col gap-4 p-4 min-w-0">
          <Outlet />
        </section>
        <footer className="bg-white dark:bg-secondary border-t flex justify-between sticky items-center bottom-0 inset-x-0 p-3 text-[0.65rem] text-muted-foreground">
          <span>(48) 91234-5678</span>
          <span>email@empresa.com</span>
        </footer>
      </SidebarInset>
    </SidebarProvider>
  )
}

