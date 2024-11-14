// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from "@supabase/supabase-js";

const supabaseAdminClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_KEY || ""
);

const getMapping = async (ids: string[]) => {
  const { data, error } = await supabaseAdminClient
    .from("profiles")
    .select("id, username")
    .in("id", ids);
  console.log(ids)
  
  if (error) {
    console.log(error);
    return
  }

  return new Map<string, string>(
    data.map((obj:any) => {
      return [obj.id, obj.username];
    }),
  );  
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  
  const { data, error } = await supabaseAdminClient
    .from("games")
    .select(`
      user_id,
      level,
      attempts
    `)
    .order('level', {
      ascending: false})
    .order('attempts', {
      ascending: true})
    .order('created_at', {
      ascending: true})
    .limit(50)
  
  if (error) {
    console.log(error);
    return;
  }
  
  const mapping = await getMapping(data.map((d:any) => d.user_id))
  if (!mapping) {
    return
  }

  const entries = data.map((d:any) => {
    return {username: String(mapping.get(d.user_id)), level: d.level, attempts: d.attempts}
  })
  
  res.status(200).json({ entries: entries })
}
