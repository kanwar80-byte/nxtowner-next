import "server-only";
import { getUserKpis, getLatestUsers, type UserKpiData, type UserTableRow } from "@/lib/admin/queries";

export async function getAdminUserKpis(): Promise<UserKpiData> {
  return getUserKpis();
}

export async function getAdminUsersList(): Promise<UserTableRow[]> {
  return getLatestUsers(50);
}




