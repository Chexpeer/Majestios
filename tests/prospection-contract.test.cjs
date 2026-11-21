"use strict";
const assert=require("node:assert/strict");
async function main(){
  const c=await import("../supabase/functions/_shared/prospection-contract.mjs");
  const v=await import("../supabase/functions/_shared/prospection-validation.mjs");
  const a=await import("../supabase/functions/_shared/prospection-authz.mjs");
  const e=await import("../supabase/functions/_shared/prospection-errors.mjs");
  assert.deepEqual(v.validatePublicDirectorySearch({query:"  atelier   Martin "}),{ok:true,value:{query:"atelier Martin"}});
  for(const bad of [{query:"A"},{query:"atelier",departments:["72"]},{query:"atelier",organization_id:"forged"},{query:"atelier",page:{number:2}}])assert.notEqual(v.validatePublicDirectorySearch(bad).ok,true);
  const good=v.validateMemberSearch({query:"électricité",filters:{activity_codes:["43.21A"],departments:["72"],workforce_bands:["0-2","3-5"]},page:{number:2,size:10}});
  assert.equal(good.ok,true);assert.equal(good.value.page.number,2);
  for(const bad of [{query:"électricité",filters:{provider:"fake"}},{query:"électricité",filters:{departments:["999"]}},{query:"électricité",filters:{activity_codes:["bad"]}},{query:"électricité",page:{size:11}},{query:"",filters:{}},{query:"x"}])assert.equal(v.validateMemberSearch(bad).ok,false);
  const raw={id:"opaque-1",siren:"123456789",siret:"12345678900016",name:"Entreprise Alpha",activity_label:"Travaux électriques",activity_code:"43.21A",source:"supplier",source_url:"https://private.invalid",raw:{payload:{secret:true}},address:{postal_code:"72000",city:"Le Mans",department:"72",source:"leak"},qualification:{score:120,label:"prioritaire",reasons:["motif"],provider:"leak"}};
  const pub=c.toDirectoryCompanyDTO(raw);
  assert.deepEqual(pub,{id:"opaque-1",name:"Entreprise Alpha",siren:"123456789",activity_label:"Travaux électriques",address:{postal_code:"72000",city:"Le Mans",department:"72"}});
  assert.equal(Object.hasOwn(pub,"siret"),false);assert.deepEqual(c.findForbiddenDtoFields(pub),[]);
  const member=c.toMemberCompanyDTO(raw);assert.equal(member.siret,"12345678900016");assert.equal(member.qualification.score,100);assert.deepEqual(c.findForbiddenDtoFields(member),[]);
  assert.ok(c.findForbiddenDtoFields({nested:[{source_url:"leak"}]}).length);assert.equal(c.toDirectoryCompanyDTO({id:"only-id"}),null);
  const failure=e.createSearchError("ACCESS_DENIED","req-1");assert.equal(failure.status,403);assert.equal(failure.body.error.code,"ACCESS_DENIED");assert.deepEqual(c.findForbiddenDtoFields(failure.body),[]);
  const base={userId:"u1",memberships:[{user_id:"u1",organization_id:"o1",role:"member"}],organizations:[{id:"o1",kind:"client"}]};
  assert.equal(a.authorizeProspectionMembership(base).ok,true);
  for(const role of ["owner","admin","member"])assert.equal(a.authorizeProspectionMembership({...base,memberships:[{...base.memberships[0],role}]}).ok,true);
  for(const variant of [
    {...base,memberships:[{...base.memberships[0],role:"viewer"}]},
    {...base,organizations:[{id:"o1",kind:"internal"}]},
    {...base,organizations:[{id:"o1",kind:"partner"}]},
    {...base,memberships:[...base.memberships,{...base.memberships[0],organization_id:"o2"}],organizations:[...base.organizations,{id:"o2",kind:"client"}]},
    {...base,memberships:[{...base.memberships[0],user_id:"other"}]}
  ])assert.equal(a.authorizeProspectionMembership(variant).ok,false);
  function fake({user,memberships,organizations,membershipError,organizationError}){
    const calls=[];
    return {calls,auth:{getUser:async token=>{calls.push(["auth",token]);return user?{data:{user},error:null}:{data:{user:null},error:new Error("invalid")};}},
      from(table){const q={filters:[]};const b={select(x){q.select=x;return b;},eq(k,x){q.filters.push(["eq",k,x]);return b;},in(k,x){q.filters.push(["in",k,x]);return b;},then(resolve,reject){calls.push([table,q]);const result=table==="organization_members"?{data:memberships,error:membershipError}:{data:organizations,error:organizationError};return Promise.resolve(result).then(resolve,reject);}};return b;}};
  }
  const user={id:"u1",email:"member@example.test",email_confirmed_at:"2026-01-01T00:00:00Z"};
  const client=fake({user,memberships:base.memberships,organizations:base.organizations});
  const access=await a.resolveProspectionAccess({token:"valid",userClient:client});
  assert.equal(access.ok,true);assert.equal(access.organizationId,"o1");
  assert.ok(client.calls.some(x=>x[0]==="organization_members"&&x[1].filters.some(f=>f[0]==="eq"&&f[1]==="user_id"&&f[2]==="u1")));
  assert.equal((await a.resolveProspectionAccess({token:"",userClient:client})).code,"AUTH_REQUIRED");
  assert.equal((await a.resolveProspectionAccess({token:"t",userClient:fake({user:{id:"u1",email:"x"},memberships:base.memberships,organizations:base.organizations})})).code,"ACCESS_DENIED");
  assert.equal((await a.resolveProspectionAccess({token:"t",userClient:fake({user:null,memberships:[],organizations:[]})})).code,"AUTH_REQUIRED");
  assert.equal((await a.resolveProspectionAccess({token:"t",userClient:fake({user,memberships:null,organizations:[],membershipError:new Error("RLS")})})).code,"ACCESS_DENIED");
  console.log("Tests contrat Prospection : OK");
}
main().catch(error=>{console.error(error);process.exitCode=1;});
