import { MEMBER_ROLES } from "./prospection-contract.mjs";
function deny(code="ACCESS_DENIED",status=403){return {ok:false,code,status};}
/** Décision pure : memberships et organisations doivent provenir de lectures RLS du client utilisateur. */
export function authorizeProspectionMembership({userId,memberships,organizations}){
  if(!userId||!Array.isArray(memberships)||!Array.isArray(organizations))return deny();
  if(memberships.some(row=>!row||row.user_id!==userId)||memberships.length!==1)return deny();
  const membership=memberships[0];
  if(!membership.organization_id||!MEMBER_ROLES.includes(membership.role))return deny();
  const matches=organizations.filter(org=>org&&org.id===membership.organization_id);
  if(matches.length!==1||matches[0].kind!=="client")return deny();
  return {ok:true,userId,organizationId:matches[0].id,role:membership.role};
}
/**
 * Vérifie Auth puis lit les appartenances avec le client utilisateur (clé publishable + JWT).
 * Ne jamais fournir ici un client service_role.
 */
export async function resolveProspectionAccess({token,userClient,requireConfirmedEmail=true}){
  if(typeof token!=="string"||!token.trim()||!userClient?.auth?.getUser||typeof userClient.from!=="function")return deny("AUTH_REQUIRED",401);
  let auth;
  try{auth=await userClient.auth.getUser(token);}catch{return deny("AUTH_REQUIRED",401);}
  const user=auth?.data?.user;
  if(auth?.error||!user?.id)return deny("AUTH_REQUIRED",401);
  if(requireConfirmedEmail&&!Boolean(user.email&&(user.email_confirmed_at||user.confirmed_at)))return deny();
  let membershipResult;
  try{membershipResult=await userClient.from("organization_members").select("organization_id,user_id,role").eq("user_id",user.id);}catch{return deny();}
  if(membershipResult?.error||!Array.isArray(membershipResult?.data)||membershipResult.data.length!==1)return deny();
  const ids=[...new Set(membershipResult.data.map(row=>row?.organization_id).filter(Boolean))];
  if(ids.length!==1)return deny();
  let organizationResult;
  try{organizationResult=await userClient.from("organizations").select("id,kind").in("id",ids);}catch{return deny();}
  if(organizationResult?.error||!Array.isArray(organizationResult?.data))return deny();
  return authorizeProspectionMembership({userId:user.id,memberships:membershipResult.data,organizations:organizationResult.data});
}
