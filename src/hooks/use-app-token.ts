export interface AppTokenProps {
  token_type: string
  expires_in: number
  access_token: string
  refresh_token: string
  grant_type: string
  scope: string
  central_id: number
  client_id: number
  client_secret: string
  username: string
  password: string
  user_id: number
  id_company: number
  user: string
  name: string
  allow_mytalk: number
  allow_webrtc: number
  settings: {
    display_name: string
    uri: string
    password: string
    socket: {
      uri: string
      via_transport: string
    }
    registrar_server: string
    contact_uri: string
    authorization_user: string
    instance_id: string | null
    session_timers: boolean
    use_preloaded_route: boolean
    pcConfig: {
      rtcpMuxPolicy: string
      iceTransportPolicy: string
      iceCandidatePoolSize: number
      bundlePolicy: string
      iceServers: Array<{
        urls: string[]
        username?: string
        credential?: string
      }>
    }
    callstats: {
      enabled: boolean
      AppID: string | null
      AppSecret: string | null
    }
    webrtc_url: string
    view_mytalk?: boolean
  }
  login: string
  id_core_server: number
  logo_web_resale: string | null
  base_url: string
  pabx_id: number
  server_id: number
  sip_rwp: string
}

export const useAppToken = () => {
  const serialized = localStorage.getItem('app_token')
  if (!serialized) {
    console.log('[mytalk][useAppToken] missing localStorage.app_token')
    return {}
  }

  try {
    const decoded = atob(serialized)
    const raw = JSON.parse(decoded) as AppTokenProps

    const allowMytalk = Number((raw as any)?.allow_mytalk ?? 0)
    const allowWebrtc = Number((raw as any)?.allow_webrtc ?? 0)

    const appToken: AppTokenProps = {
      ...raw,
      allow_mytalk: allowMytalk as any,
      allow_webrtc: allowWebrtc as any,
      settings: {
        ...raw.settings,
        view_mytalk: raw.settings?.view_mytalk === true || allowMytalk === 1,
      },
    }

    console.log('[mytalk][useAppToken] parsed app_token', {
      allow_mytalk: (appToken as any).allow_mytalk,
      allow_webrtc: (appToken as any).allow_webrtc,
      view_mytalk: appToken.settings?.view_mytalk,
      sip_rwp: appToken.sip_rwp,
      base_url: appToken.base_url,
      has_access_token: Boolean((appToken as any).access_token),
    })

    return { appToken }
  } catch {
    console.log('[mytalk][useAppToken] failed to decode/parse app_token')
    return {}
  }
}
