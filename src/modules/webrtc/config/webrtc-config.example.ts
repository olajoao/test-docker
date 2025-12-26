/**
 * Exemplo de Configuração WebRTC
 * 
 * Este arquivo demonstra como configurar o sistema WebRTC em diferentes cenários.
 * Copie e ajuste conforme necessário.
 */

// ============================================================
// 1. CONFIGURAÇÃO BÁSICA (Desenvolvimento)
// ============================================================

export const BASIC_CONFIG = {
  display_name: 'João Silva',
  uri: 'sip:1234@servidor.com',
  password: 'sua_senha_aqui',
  socket: {
    uri: 'wss://servidor.com:8089/ws',
    via_transport: 'auto', // 'auto' | 'tcp' | 'tls' | 'ws' | 'wss'
  },
  registrar_server: null,
  contact_uri: null,
  authorization_user: null,
  instance_id: null,
  session_timers: true,
  use_preloaded_route: false,
  pcConfig: {
    rtcpMuxPolicy: 'negotiate',
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' }
    ]
  },
  callstats: {
    enabled: false,
    AppID: null,
    AppSecret: null,
  }
};

// ============================================================
// 2. CONFIGURAÇÃO COM STUN/TURN (Produção)
// ============================================================

export const PRODUCTION_CONFIG = {
  display_name: 'Maria Santos',
  uri: 'sip:5678@empresa.com.br',
  password: 'senha_segura_123',
  socket: {
    uri: 'wss://sip.empresa.com.br:443/ws',
    via_transport: 'wss', // Forçar WSS para segurança
  },
  registrar_server: 'sip:sip.empresa.com.br',
  contact_uri: null,
  authorization_user: '5678',
  instance_id: 'webrtc-client-001',
  session_timers: true,
  use_preloaded_route: true,
  pcConfig: {
    rtcpMuxPolicy: 'require',
    iceServers: [
      // STUN servers públicos
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      
      // TURN server (exemplo)
      {
        urls: 'turn:turn.empresa.com.br:3478?transport=udp',
        username: 'usuario_turn',
        credential: 'senha_turn'
      },
      {
        urls: 'turns:turn.empresa.com.br:5349?transport=tcp',
        username: 'usuario_turn',
        credential: 'senha_turn'
      }
    ]
  },
  callstats: {
    enabled: false,
    AppID: null,
    AppSecret: null,
  }
};

// ============================================================
// 3. CONFIGURAÇÃO COM CALLSTATS.IO
// ============================================================

export const CONFIG_WITH_ANALYTICS = {
  display_name: 'Analytics User',
  uri: 'sip:9999@servidor.com',
  password: 'senha',
  socket: {
    uri: 'wss://servidor.com:8089/ws',
    via_transport: 'auto',
  },
  registrar_server: null,
  contact_uri: null,
  authorization_user: null,
  instance_id: null,
  session_timers: true,
  use_preloaded_route: false,
  pcConfig: {
    rtcpMuxPolicy: 'negotiate',
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' }
    ]
  },
  callstats: {
    enabled: true,
    AppID: 'seu_app_id_callstats',
    AppSecret: 'seu_app_secret_callstats',
  }
};

// ============================================================
// 4. CONFIGURAÇÃO MÚLTIPLOS ICE SERVERS (Alta Disponibilidade)
// ============================================================

export const HIGH_AVAILABILITY_CONFIG = {
  display_name: 'HA User',
  uri: 'sip:admin@servidor.com',
  password: 'senha_admin',
  socket: {
    uri: 'wss://servidor.com:8089/ws',
    via_transport: 'wss',
  },
  registrar_server: null,
  contact_uri: null,
  authorization_user: null,
  instance_id: null,
  session_timers: true,
  use_preloaded_route: false,
  pcConfig: {
    rtcpMuxPolicy: 'negotiate',
    iceServers: [
      // Múltiplos STUN servers para redundância
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      { urls: 'stun:stun2.l.google.com:19302' },
      { urls: 'stun:stun3.l.google.com:19302' },
      { urls: 'stun:stun4.l.google.com:19302' },
      
      // TURN servers para NAT traversal
      {
        urls: [
          'turn:turn1.empresa.com:3478?transport=udp',
          'turn:turn1.empresa.com:3478?transport=tcp'
        ],
        username: 'usuario',
        credential: 'senha'
      },
      {
        urls: 'turns:turn2.empresa.com:5349?transport=tcp',
        username: 'usuario',
        credential: 'senha'
      }
    ],
    // Configurações adicionais para melhor conectividade
    iceTransportPolicy: 'all', // 'all' | 'relay'
    bundlePolicy: 'max-bundle',
  },
  callstats: {
    enabled: false,
    AppID: null,
    AppSecret: null,
  }
};

// ============================================================
// 5. CONFIGURAÇÃO ASTERISK/FreePBX
// ============================================================

export const ASTERISK_CONFIG = {
  display_name: 'Ramal 1001',
  uri: 'sip:1001@pbx.empresa.local',
  password: 'senha_ramal_1001',
  socket: {
    uri: 'wss://pbx.empresa.local:8089/ws',
    via_transport: 'wss',
  },
  registrar_server: null, // Asterisk usa o mesmo servidor
  contact_uri: null,
  authorization_user: '1001',
  instance_id: null,
  session_timers: true,
  use_preloaded_route: false,
  pcConfig: {
    rtcpMuxPolicy: 'negotiate',
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' }
    ]
  },
  callstats: {
    enabled: false,
    AppID: null,
    AppSecret: null,
  }
};

// ============================================================
// 6. CONFIGURAÇÃO VIA WINDOW.SETTINGS (Runtime Injection)
// ============================================================

/**
 * Para injetar configurações em runtime via HTML:
 * 
 * <script>
 *   window.SETTINGS = {
 *     uri: 'sip:1234@servidor.com',
 *     password: 'senha123',
 *     socket: {
 *       uri: 'wss://servidor.com:8089/ws'
 *     }
 *   };
 * </script>
 */

// ============================================================
// 7. CONFIGURAÇÃO PARA IFRAME (PostMessage)
// ============================================================

/**
 * Para comunicação entre parent e iframe:
 * 
 * // No parent window
 * const iframe = document.getElementById('webrtc-iframe');
 * iframe.contentWindow.postMessage({
 *   type: 'webrtc-settings',
 *   settings: {
 *     uri: 'sip:1234@servidor.com',
 *     password: 'senha123',
 *     socket: {
 *       uri: 'wss://servidor.com:8089/ws'
 *     }
 *   }
 * }, '*');
 * 
 * // No iframe, o sistema automaticamente escuta e aplica
 */

// ============================================================
// COMO USAR ESTAS CONFIGURAÇÕES
// ============================================================

/**
 * 1. Via Zustand Store (Programático):
 * 
 * import { useWebRTCStore } from '@/modules/webrtc/stores/webrtc-store';
 * import { PRODUCTION_CONFIG } from './webrtc-config.example';
 * 
 * const { setSettings } = useWebRTCStore();
 * setSettings(PRODUCTION_CONFIG);
 * 
 * 
 * 2. Via Settings UI (Manual):
 * 
 * - Fazer login no sistema
 * - Clicar no ícone de Settings (engrenagem)
 * - Preencher os campos manualmente
 * - Clicar em "Save Settings"
 * 
 * 
 * 3. Via localStorage (Persistência):
 * 
 * localStorage.setItem('settings', JSON.stringify({
 *   state: {
 *     settings: PRODUCTION_CONFIG,
 *     displayName: 'Meu Nome'
 *   }
 * }));
 * 
 * 
 * 4. Via Environment Variables (Build Time):
 * 
 * // .env.local
 * VITE_SIP_URI=sip:1234@servidor.com
 * VITE_SIP_PASSWORD=senha
 * VITE_WEBSOCKET_URI=wss://servidor.com:8089/ws
 * 
 * // Carregar no código
 * const config = {
 *   uri: import.meta.env.VITE_SIP_URI,
 *   password: import.meta.env.VITE_SIP_PASSWORD,
 *   socket: {
 *     uri: import.meta.env.VITE_WEBSOCKET_URI
 *   }
 * };
 */

// ============================================================
// TROUBLESHOOTING
// ============================================================

/**
 * PROBLEMA: Não conecta ao servidor WebSocket
 * SOLUÇÃO:
 * - Verificar se o servidor aceita conexões WSS na porta especificada
 * - Verificar certificado SSL (deve ser válido)
 * - Testar manualmente: wscat -c wss://servidor.com:8089/ws
 * - Verificar firewall/proxy
 * 
 * 
 * PROBLEMA: Registra mas não consegue fazer chamada
 * SOLUÇÃO:
 * - Verificar ICE servers (STUN/TURN)
 * - Ativar logs: localStorage.setItem('debug', 'webrtc-jssip:*')
 * - Verificar NAT/Firewall
 * - Testar com TURN server
 * 
 * 
 * PROBLEMA: Áudio não funciona
 * SOLUÇÃO:
 * - Verificar permissões de microfone no navegador
 * - Testar com navigator.mediaDevices.getUserMedia({ audio: true })
 * - Verificar codecs suportados
 * - Ver console para erros
 * 
 * 
 * PROBLEMA: Chamada conecta mas não há áudio
 * SOLUÇÃO:
 * - Verificar ICE candidates (ver console)
 * - Adicionar TURN server
 * - Verificar firewall bloqueia UDP
 * - Testar com iceTransportPolicy: 'relay'
 */

export default {
  BASIC_CONFIG,
  PRODUCTION_CONFIG,
  CONFIG_WITH_ANALYTICS,
  HIGH_AVAILABILITY_CONFIG,
  ASTERISK_CONFIG,
};
