import type { SipBranchProps } from "@/modules/sip/branchs/model";
import { BaseService } from "../base-service";
import type { AuthProps, UserPermissions } from "@/modules/auth/model";
import { http } from "../http";

export const baseService = new BaseService<SipBranchProps>("/api/gate/api/server/1/pabx/1/sip_devices")
export const authService = new BaseService<AuthProps>("/oauth/token")

// Permission service with custom method that returns string[]
export const permissionService = {
  async list(): Promise<string[]> {
    const response = await http.get<UserPermissions>("/api/permissions")
    return response.data.permissions
  }
}


