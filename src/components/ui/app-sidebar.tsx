import { Command, LifeBuoy, PieChart, Settings2, ChevronRight, SquareAsterisk, Phone, Headset, ChartSpline, PhoneOutgoing } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarGroup,
  SidebarGroupContent,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Link, useMatchRoute } from "@tanstack/react-router"
import { cn } from "@/lib/utils"

const data = {
  user: {
    name: "Alex Johnson",
    email: "alex@example.com",
    avatar: "/diverse-user-avatars.png",
  },
  navMain: [
    {
      title: "SIP",
      url: "/sip/ramais-sip",
      icon: SquareAsterisk,
      items: [
        {
          title: 'Ramais SIP',
          url: '/sip/ramais-sip',
          isActive: true
        },
        {
          title: 'SIP Trunks',
          url: '/sip/sip-trunks'
        }
      ]
    },
    {
      title: "Dialplan",
      url: "#",
      icon: PieChart,
      items: [
        {
          title: "Números de entrada",
          url: "/numeros-de-entrada",
        },
        {
          title: "Regras de entrada",
          url: "/regras-de-entrada",
        },
        {
          title: "Regras de saída",
          url: "/regras-de-saida",
        },
      ],
    },
    {
      title: "PABX",
      url: "#",
      icon: Phone,
      items: [
        {
          title: "All Projects",
          url: "#",
        },
        {
          title: "Active",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Gerenciamento",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "All Projects",
          url: "#",
        },
        {
          title: "Active",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Relatórios",
      url: "#",
      icon: ChartSpline,
      items: [
        {
          title: "Getting Started",
          url: "#",
        },
        {
          title: "API Reference",
          url: "#",
        },
        {
          title: "Guides",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Callcenter",
      url: "#",
      icon: Headset,
    },
    {
      title: "Discador",
      url: "#",
      icon: PhoneOutgoing,
    },
  ],
}

export function AppSidebar() {
  const matchRoute = useMatchRoute()
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Acme Inc</span>
                  <span className="truncate text-xs">Enterprise</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.navMain.map((item) => {
                const isGroupActive =
                  !!matchRoute({ to: item.url, fuzzy: true }) ||
                  !!item.items?.some((sub) => matchRoute({ to: sub.url, fuzzy: true }))

                if (!item.items) {
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={!!matchRoute({ to: item.url })} tooltip={item.title}>
                        <Link to={item.url}>
                          {({ isActive }) => {
                            return (
                              <div className={isActive ? 'text-purple-600' : ''}>
                                <item.icon />
                                <span>{item.title}</span>
                              </div>
                            )
                          }}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                }

                return (
                  <Collapsible key={item.title} asChild defaultOpen={isGroupActive}>
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild className="group">
                        <SidebarMenuButton tooltip={item.title} isActive={isGroupActive}>
                          <item.icon />
                          <span>{item.title}</span>
                          <ChevronRight className={cn("ml-auto transition-transform duration-200 group-collapsible:rotate-90", "group-data-[state=open]:rotate-90")} />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton asChild className={subItem.isActive ? 'text-purple-600' : ''}>
                                <Link to={subItem.url}>
                                  {({ isActive }) => {
                                    return (
                                      <div className={isActive ? 'text-purple-600' : 'text-muted-foreground'}>
                                        <span>{subItem.title}</span>
                                      </div>
                                    )
                                  }}
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              {data.navSecondary.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={data.user.avatar || "/placeholder.svg"} alt={data.user.name} />
                    <AvatarFallback className="rounded-lg">AJ</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{data.user.name}</span>
                    <span className="truncate text-xs">{data.user.email}</span>
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage src={data.user.avatar || "/placeholder.svg"} alt={data.user.name} />
                      <AvatarFallback className="rounded-lg">AJ</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">{data.user.name}</span>
                      <span className="truncate text-xs">{data.user.email}</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings2 className="mr-2 h-4 w-4" />
                  Account Settings
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <LifeBuoy className="mr-2 h-4 w-4" />
                  Support
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

