export interface WebRTCSettings {
  display_name: string;
  uri: string;
  password: string;
  socket: {
    uri: string;
    via_transport: string;
  };
  registrar_server: string;
  contact_uri: string;
  authorization_user: string;
  instance_id: string | null;
  session_timers: boolean;
  use_preloaded_route: boolean;
  pcConfig: {
    rtcpMuxPolicy: string;
    iceTransportPolicy?: string;
    iceCandidatePoolSize?: number;
    bundlePolicy?: string;
    iceServers: Array<{
      urls: string | string[];
      username?: string;
      credential?: string;
    }>;
  };
  callstats: {
    enabled: boolean;
    AppID: string | null;
    AppSecret: string | null;
  };
  webrtc_url: string;
  view_mytalk?: boolean;
}

// Constante para o tipo da mensagem, evitando erros de digitação.
const WEBRTC_SETTINGS_MESSAGE_TYPE = "webrtc-settings";

/**
 * Envia as configurações do WebRTC para um iframe via postMessage.
 *
 * @param iframe - O elemento HTMLIFrameElement de destino.
 * @param settings - O objeto de configurações do WebRTC a ser enviado.
 */

export function sendSettingsToIframe(
  iframe: HTMLIFrameElement | null,
  settings: WebRTCSettings | null,
): void {
  if (iframe?.contentWindow) {
    const targetOrigin = "*";

    iframe.contentWindow.postMessage(
      {
        type: WEBRTC_SETTINGS_MESSAGE_TYPE,
        payload: settings ?? null,
      },
      targetOrigin,
    );
  } else {
    console.error(
      "[webrtc-iframe-service] Falha: A janela de conteúdo do iframe não está acessível.",
    );
  }
}
