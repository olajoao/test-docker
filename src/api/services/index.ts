import type { SipBranchProps } from "@/modules/sip/branchs/model";
import { BaseService } from "../base-service";
import type { AuthProps } from "@/modules/auth/model";

export const baseService = new BaseService<SipBranchProps>("/api/gate/api/server/1/pabx/1/sip_devices")
export const authService = new BaseService<AuthProps>("/oauth/token")
