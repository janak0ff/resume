import { db } from './db';
export const includeProfile={links:true,experiences:{orderBy:{order:'asc' as const}},projects:{orderBy:{order:'asc' as const}},educations:{orderBy:{order:'asc' as const}},certifications:true,skills:true};
export async function getProfile(username:string){return db.profile.findUnique({where:{username},include:includeProfile});}
