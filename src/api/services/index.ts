import type { SipBranchProps } from "@/modules/sip/branchs/model";
import { BaseService } from "../base-service";

export const branchsService = new BaseService<SipBranchProps>("/branchs")
