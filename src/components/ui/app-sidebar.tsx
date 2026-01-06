import { Command, LifeBuoy, Workflow, Settings2, ChevronRight, Cog, SquareAsterisk, Phone, Headset, ChartLine, PhoneOutgoing, LogOut, Globe, Moon, Sun, KeyRound } from "lucide-react"

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
import { usePermissionStore } from "@/stores/permission-store"
import { useAuth } from "@/modules/auth/hooks"
import type { LucideIcon } from "lucide-react"
import { useTranslation, useLanguage } from "@/hooks/use-translation"
import { useTheme } from "@/hooks/use-theme"
import axios from "axios"
import type { Tokens } from "@/api/types/auth"
import { useAuthStore } from "@/stores/auth-store"
import { http } from "@/api/http"

interface NavSubItem {
  title: string
  url: string
  isActive?: boolean
  permission?: string
  isGroupTitle?: boolean  
  isExternal?: boolean
}

interface NavItem {
  title: string
  url: string
  icon: LucideIcon
  permission?: string   
  items?: NavSubItem[]
}

 
const navMain = (t: (key: string) => string): NavItem[] => [
  {
    title: t('nav.sip'),
    url: "#",
    icon: SquareAsterisk,
    items: [
      {
        title: t('nav.sip_branchs'),
        url: '/sip/branchs',
        isActive: true,
        permission: "contas_sip"
      },
      {
        title: t('nav.sip_trunks'),
        url: '/sip/trunks',
        permission: "troncos_sip"
      }
    ]
  },
  {
    title: t('nav.dialplan'),
    url: "#",
    icon: Workflow,
    items: [
      {
        title: t('nav.dialplan_numeros_entrada'),
        url: "/numeros-de-entrada",
        permission: "numeros_did"
      },
      {
        title: t('nav.dialplan_regras_entrada'),
        url: "/regras-de-entrada",
        permission: "regras_entrada"
      },
      {
        title: t('nav.dialplan_regras_saida'),
        url: "/regras-de-saida",
        permission: "regras_saida"
      },
    ],
  },
  {
    title: t('nav.pabx'),
    url: "#",
    icon: Phone,
    items: [
      {
        title: t('nav.pabx_webrtc'),
        url: "/webrtc",
        permission: "webrtc",
        isExternal: true
      },
      {
        title: t('nav.pabx_mytalk'),
        url: "/mytalk",
        permission: "mytalk",
        isExternal: true
      },
      {
        title: t('nav.pabx_agenda'),
        url: "#",
        permission: "agenda_persa"
      },
      {
        title: t('nav.pabx_callback'),
        url: "/pabx/callback",
        permission: "callback"
      },
      {
        title: t('nav.pabx_discagem_rapida'),
        url: "#",
        permission: "discagem_rapida"
      },
      {
        title: t('nav.pabx_filas'),
        url: "#",
        permission: "filas"
      },
      {
        title: t('nav.pabx_pop'),
        url: "#",
        permission: "pop"
      },
      {
        title: t('nav.pabx_sala_conferencia'),
        url: "#",
        permission: "sala_conferencia"
      },
      {
        title: t('nav.pabx_usuarios_senhas'),
        url: "#",
        permission: "senha_usuario"
      }
    ],
  },
  {
    title: t('nav.gerenciamento'),
    url: "#",
    icon: Cog,
    items: [
      {
        title: t('nav.gerenciamento_administradores'),
        url: "#",
        permission: "administradores"
      },
      {
        title: t('nav.gerenciamento_audios'),
        url: "/management/audio_music",
        permission: "audios"
      },
       {
        title: t('nav.gerenciamento_tarifas'),
        url: "#",
        permission: "configurar_tarifas"
      },
      {
        title: t('nav.gerenciamento_feriados'),
        url: "#",
        permission: "feriados"
      },
       {
        title: t('nav.gerenciamento_grupos'),
        url: "#",
        permission: "grupos_sip"
      },
      {
        title: t('nav.gerenciamento_pesquisa'),
        url: "#",
        permission: "pesquisa_satisfacao"
      }
    ],
  },
  {
    title: t('nav.relatorios'),
    url: "#",
    icon: ChartLine,
    items: [
      // Grupo CDR
      {
        title: "CDR",
        url: "#",
        isGroupTitle: true,
      },
      {
        title: "Ligações",
        url: "#",
        permission: "cdr"
      },
      {
        title: "Ligações por Ramal",
        url: "#",
        permission: "cdr_ramais"
      },
      {
        title: "Gravadas",
        url: "#",
        permission: "cdr_gravadas"
      },
      {
        title: "Ligações por Senha",
        url: "#",
        permission: "cdr_senhas"
      },
      {
        title: "Ligações por Hora",
        url: "#",
        permission: "cdr_por_horario"
      },
      
      // Grupo Filas
      {
        title: "Filas",
        url: "#",
        isGroupTitle: true,
      },
      {
        title: "Abandonos",
        url: "#",
        permission: "filas_abandonos"
      },
      {
        title: "Tempos de Espera",
        url: "#",
        permission: "filas_tempo_espera"
      },
      {
        title: "Relatório Analítico",
        url: "#",
        permission: "filas_relatorio_analitico"
      },
      {
        title: "Ligações por Membros",
        url: "#",
        permission: "relatorio_fila_membros"
      },
      {
        title: "Nível de Serviço",
        url: "#",
        permission: "relatorio_nivel_servico_filas"
      },
      
      // Grupo Ramais
      {
        title: "Ramais",
        url: "#",
        isGroupTitle: true,
      },
      {
        title: "Tempo em Ligação",
        url: "#",
        permission: "relatorio_ramais_ligacao"
      },
      
      // Grupo URA
      {
        title: "URA",
        url: "#",
        isGroupTitle: true,
      },
      {
        title: "Opções",
        url: "#",
        permission: "acessos_ura"
      },
       {
        title: "Pesquisa de Satisfação",
        url: "#",
        permission: "relatorio_pesquisa_satisfacao"
      }
     
    ],
  },
  {
    title: t('nav.callcenter'),
    url: "#",
    icon: Headset,
    permission: "gerenciamento_gestor"
  },
  {
    title: t('nav.discador'),
    url: "#",
    icon: PhoneOutgoing,
    permission: "discador"
  },
]

const userData = {
  name: "Alex Johnson",
  email: "alex@example.com",
  avatar: "/diverse-user-avatars.png",
}

export function AppSidebar() {
  const matchRoute = useMatchRoute()
  const { hasPermission, permissions, status } = usePermissionStore()
  const { handleLogout } = useAuth()
  const { t } = useTranslation()
  const { language, changeLanguage } = useLanguage()
  const { theme, setTheme } = useTheme()
  
  const shouldShowMenuItem = (permission?: string, isGroupTitle?: boolean) => {
    if (isGroupTitle) return true
    
    if (!permission) return false
    
    if (status !== 'loaded') return false

    if (permissions.length === 0) return false

    return hasPermission(permission)
  }

  /**
   * Filtra os subitens baseado nas permissões do usuário
   * Remove títulos de grupo que não têm itens visíveis abaixo deles
   */
  const getVisibleSubItems = (items?: NavSubItem[]) => {
    if (!items) return []
    
    if (status !== 'loaded') return []
    if (permissions.length === 0) return []
    
    const visibleItems: NavSubItem[] = []
    let currentGroupTitle: NavSubItem | null = null
    let pendingGroupItems: NavSubItem[] = []

    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      
      if (item.isGroupTitle) {
        if (currentGroupTitle && pendingGroupItems.length > 0) {
          visibleItems.push(currentGroupTitle)
          visibleItems.push(...pendingGroupItems)
        }
        
        currentGroupTitle = item
        pendingGroupItems = []
      } else {
        const hasPermissionForItem = shouldShowMenuItem(item.permission, false)
        
        if (hasPermissionForItem) {
          if (currentGroupTitle) {
            pendingGroupItems.push(item)
          } else {
            visibleItems.push(item)
          }
        }
      }
    }

    if (currentGroupTitle && pendingGroupItems.length > 0) {
      visibleItems.push(currentGroupTitle)
      visibleItems.push(...pendingGroupItems)
    }

    return visibleItems
  }


  const authenticatedUser = async () => {
    const apiBaseUrl = import.meta.env.VITE_API_NYA_BASE_URL ?? import.meta.env.VITE_API_DEV_URL

    const data = new URLSearchParams({
      grant_type: 'password',
      username: 'dev@saperx.com.br',
      password: 'biYY$jnUjUz'
    })

    try {
      const res = await axios.post<Tokens>(
        `${apiBaseUrl}/oauth/token`,
        data,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: 'Basic MTQ6NmJta3ZqNnpLbEtGU2V5Y0UwRmxMb0Z1dEZDOWZuV044eDVTak01Rw=='
          }
        }
      )

      useAuthStore.getState().setAuth(res.data)
      http.defaults.headers.common.Authorization = `Bearer ${res.data.access_token}`
      console.log('Authenticated. Token applied to http client.')
    } catch (err) {
      console.error(err)
    }
  }

  const shouldShowModule = (items?: NavSubItem[]) => {
    if (!items) return false
    
    if (status !== 'loaded') return false
    
    const visibleSubItems = getVisibleSubItems(items)
    return visibleSubItems.length > 0
  }

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
                  <KeyRound
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      void authenticatedUser()
                    }}
                  />
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navMain(t).map((item) => {
                const visibleSubItems = getVisibleSubItems(item.items)
                
                // Módulo só aparece se tiver pelo menos um subitem visível
                // A API não precisa retornar "sip", "pabx" - apenas os recursos específicos
                if (item.items && !shouldShowModule(item.items)) return null
                
                // Se tem items mas não tem subitens visíveis, não mostra o módulo
                if (item.items && visibleSubItems.length === 0) return null

                // Se é um item simples sem subitens (Callcenter, Discador)
                if (!item.items) {
                  // Verifica permissão específica
                  if (!shouldShowMenuItem(item.permission, false)) return null
                  
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild tooltip={item.title}>
                        <a href={item.url}>
                          <item.icon />
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                }

                const isGroupActive =
                  !!matchRoute({ to: item.url, fuzzy: true }) ||
                  !!visibleSubItems.some((sub) => matchRoute({ to: sub.url, fuzzy: true }))

                if (!visibleSubItems.length) {
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
                          {visibleSubItems.map((subItem, index) => {
                            // Se for título de grupo, renderiza como texto sem link
                            if (subItem.isGroupTitle) {
                              return (
                                <SidebarMenuSubItem key={`${subItem.title}-${index}`}>
                                  <div className={cn(
                                    "px-2 py-1.5 text-xs font-semibold text-sidebar-foreground/70 uppercase tracking-wide",
                                    index > 0 && "mt-2"
                                  )}>
                                    {subItem.title}
                                  </div>
                                </SidebarMenuSubItem>
                              )
                            }
                            
                            return (
                              <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuSubButton asChild className={subItem.isActive ? 'text-purple-600' : ''}>
                                  {subItem.isExternal ? (
                                    <a 
                                      href={subItem.url} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="text-muted-foreground hover:text-purple-600 flex items-center gap-2"
                                    >
                                      <span>{subItem.title}</span>
                                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                        <polyline points="15 3 21 3 21 9"></polyline>
                                        <line x1="10" y1="14" x2="21" y2="3"></line>
                                      </svg>
                                    </a>
                                  ) : (
                                    <Link to={subItem.url}>
                                      {({ isActive }) => {
                                        return (
                                          <div className={isActive ? 'text-purple-600' : 'text-muted-foreground'}>
                                            <span>{subItem.title}</span>
                                          </div>
                                        )
                                      }}
                                    </Link>
                                  )}
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            )
                          })}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                )
              })}
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
                    <AvatarImage src={userData.avatar || "/placeholder.svg"} alt={userData.name} />
                    <AvatarFallback className="rounded-lg">AJ</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{userData.name}</span>
                    <span className="truncate text-xs">{userData.email}</span>
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
                      <AvatarImage src={userData.avatar || "/placeholder.svg"} alt={userData.name} />
                      <AvatarFallback className="rounded-lg">AJ</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">{userData.name}</span>
                      <span className="truncate text-xs">{userData.email}</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings2 className="mr-2 h-4 w-4" />
                  {t('user.account_settings')}
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <LifeBuoy className="mr-2 h-4 w-4" />
                  {t('user.support')}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
                  {theme === "light" ? (
                    <>
                      <Moon className="mr-2 h-4 w-4" />
                      <span>{t('theme.dark')}</span>
                    </>
                  ) : (
                    <>
                      <Sun className="mr-2 h-4 w-4" />
                      <span>{t('theme.light')}</span>
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => changeLanguage(language === 'pt-BR' ? 'en' : 'pt-BR')}>
                  <Globe className="mr-2 h-4 w-4" />
                  <span className="flex items-center gap-2">
                    {language === 'pt-BR' ? (
                      <>
                        <span className="text-base">🇺🇸</span>
                        <span>English</span>
                      </>
                    ) : (
                      <>
                        <span className="text-base">🇧🇷</span>
                        <span>Português</span>
                      </>
                    )}
                  </span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  {t('auth.logout')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}