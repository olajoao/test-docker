/**
 * Mock de permissões para desenvolvimento
 * Usado quando a API real ainda não está disponível
 */

/**
 * ⚙️ CONFIGURAÇÃO GLOBAL DE MOCK
 * Altere para false quando a API estiver pronta
 */
export const USE_MOCK_PERMISSIONS = true

/**
 * Simula delay de rede para testes realistas
 */
const MOCK_DELAY_MS = 800

 
export const MOCK_PERMISSIONS: string[] = [
  "contas_sip",
  "troncos_sip",
  "numeros_did",
  "regras_entrada",
  "regras_saida",
  "agenda_persa",
  "callback",
  "discagem_rapida",
  "filas",
  "pop",
  "sala_conferencia",
  "senha_usuario",
  "administradores",
  "audios",
  "configurar_tarifas",
  "feriados",
  "grupos_sip",
  "pesquisa_satisfacao",
  "cdr",
  "cdr_ramais",
  "cdr_gravadas",
  "cdr_senhas",
  "cdr_por_horario",
  "filas_abandonos",
  "filas_tempo_espera",
  "filas_relatorio_analitico",
  "relatorio_fila_membros",
  "relatorio_nivel_servico_filas",
  "relatorio_ramais_ligacao",
  "acessos_ura",
  "relatorio_pesquisa_satisfacao",
  "gerenciamento_gestor",
  "discador"
]


/**
 * Retorna dados mockados como string[]
 */
export async function getMockPermissions(): Promise<string[]> {
  
  await new Promise(resolve => setTimeout(resolve, MOCK_DELAY_MS))
  
  return MOCK_PERMISSIONS
}
