import { AppBreadcrumb } from "@/components/app-breadcrumb"
import { AppSidebar } from "@/components/ui/app-sidebar"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute("/_app/_layout")({
  component: Layout,
})

export default function Layout() {

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

