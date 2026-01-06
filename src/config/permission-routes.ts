/**
 * Mapeamento de permissões para rotas
 * A ordem define a prioridade de redirecionamento após login
 */
export const PERMISSION_ROUTES: Record<string, string> = {
  // SIP
  'contas_sip': '/sip/branchs',
  'troncos_sip': '/sip/trunks',
  
  // Dialplan
  'numeros_did': '/dialplan/numeros-entrada',
  'regras_entrada': '/dialplan/regras-entrada',
  'regras_saida': '/dialplan/regras-saida',
  
  // PABX
  'agenda': '/pabx/agenda',
  'callback': '/pabx/callback',
  'discagem_rapida': '/pabx/discagem-rapida',
  'filas': '/pabx/filas',
  'pop': '/pabx/pop',
  'sala_conferencia': '/pabx/sala-conferencia',
  'usuarios_senhas': '/pabx/usuarios-senhas',
  
  // Gerenciamento
  'administradores': '/gerenciamento/administradores',
  'audios': '/gerenciamento/audios',
  'tarifas': '/gerenciamento/tarifas',
  'feriados': '/gerenciamento/feriados',
  'grupos': '/gerenciamento/grupos',
  'pesquisa': '/gerenciamento/pesquisa',
  
  // Relatórios
  'relatorios_cdr': '/relatorios/cdr',
  'relatorios_cdr_ramais': '/relatorios/cdr-ramais',
  'relatorios_cdr_gravadas': '/relatorios/cdr-gravadas',
  'relatorios_cdr_senhas': '/relatorios/cdr-senhas',
  'relatorios_cdr_horario': '/relatorios/cdr-horario',
  'relatorios_filas_abandonos': '/relatorios/filas-abandonos',
  'relatorios_filas_tempo': '/relatorios/filas-tempo',
  'relatorios_filas_analitico': '/relatorios/filas-analitico',
  'relatorios_filas_membros': '/relatorios/filas-membros',
  'relatorios_filas_nivel': '/relatorios/filas-nivel',
  'relatorios_ramais_tempo': '/relatorios/ramais-tempo',
  'relatorios_ura': '/relatorios/ura',
  'relatorios_pesquisa': '/relatorios/pesquisa',
  
  // Callcenter
  'callcenter': '/callcenter',

  //Discador
  'discador': '/discador',
}

/**
 * Retorna a primeira rota disponível baseada nas permissões do usuário
 */
export function getFirstAvailableRoute(permissions: string[]): string {
  // Procura a primeira permissão que tem rota mapeada
  for (const permission of permissions) {
    const route = PERMISSION_ROUTES[permission]
    if (route) {
      return route
    }
  }
  
  // Fallback padrão
  return '/sip/branchs'
}