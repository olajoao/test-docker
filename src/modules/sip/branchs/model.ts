import z from "zod";

export const branchSearchSchema = z.object({
  page: z.number().optional(),
  perPage: z.number().catch(50).optional(),
  filter: z.string().optional(),
})

export const branchRegisterSchema = z.object({})

/**
 * Sip devices model
 * Representa um peer (ramal) SIP configurado no sistema.
 */
export interface SipBranchProps {
  /** Name of the peer (account) */
  readonly name: string;

  /** Context of the peer */
  readonly context: string;

  /** Password of the peer */
  readonly secret: string;

  /** Host of the peer */
  readonly host: string; // geralmente "dynamic"

  /** Indicates if the peer is behind a NAT */
  readonly nat: NatMode;

  /** Type of the peer */
  readonly type: PeerType;

  /** CallerID of the peer */
  readonly callerid: string;

  /** Indicates if the peer is qualify */
  readonly qualify: YesNo;

  /** Deny address to access the peer */
  readonly deny: string;

  /** Codecs that the peer does not support */
  readonly disallow: string;

  /** Permit address to access the peer */
  readonly permit: string;

  /** Callgroup UUID */
  readonly callgroup: string;

  /** Pickupgroup UUID */
  readonly pickupgroup: string;

  /** IP address of the peer */
  readonly ip: string;

  /** Status of the peer */
  readonly status: PeerStatus;

  /** Indicates if the peer is recording */
  readonly gravar: boolean | 'true' | 'false';

  /** Indicates if the peer is DND and when it was activated */
  readonly dnd: string; // formato: "YYYY-MM-DD HH:mm:ss"

  /** Indicates if the peer is in use and when it was activated */
  readonly log_inuse: string; // formato: "YYYY-MM-DD HH:mm:ss"

  /** Status of the call */
  readonly callstatus: CallStatus;

  /** Password of the call */
  readonly call_password: string;

  /** UUID of the outbound route */
  readonly rota_saida: string;

  /** Indicates if the peer is diverted */
  readonly desvio: string;

  /** Number of the virtual peer */
  readonly ramal_virtual: number;

  /** ID of the company */
  readonly id_empresa: number;

  /** ID of the template */
  readonly id_template: number;

  /** Destination of the transbord */
  readonly transbordo_destino: string;

  /** Seconds of the transbord */
  readonly transbordo_segundos: number;

  /** Limit of simultaneous calls */
  readonly call_limit: number;

  /** Indicates if the peer is DOD */
  readonly dod: YesNo;

  /** Indicates the login hour (tinyint in DB) */
  readonly login_horario: number | string;
}

/** Type of SIP peer */
export const PeerType = {
  FRIEND: 'friend',
  USER: 'user',
  PEER: 'peer',
} as const;

export type PeerType = typeof PeerType[keyof typeof PeerType];

/** Call status */
export const CallStatus = {
  RINGING: 'RINGING',
  BUSY: 'BUSY',
  NOANSWER: 'NOANSWER',
  CANCEL: 'CANCEL',
  ANSWER: 'ANSWER',
  CONGESTION: 'CONGESTION',
} as const;

export type CallStatus = typeof CallStatus[keyof typeof CallStatus];

/** NAT mode */
export type NatMode = 'yes' | 'no';

/** Generic yes/no flag */
export type YesNo = 'yes' | 'no';

/** Status of the peer registration or reachability */
export type PeerStatus = 'offline' | `OK (${number} ms)`;
