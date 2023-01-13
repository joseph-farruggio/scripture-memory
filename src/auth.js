import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://yzdgbejeciqskvyuldcx.supabase.co'
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6ZGdiZWplY2lxc2t2eXVsZGN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzMyODI5OTEsImV4cCI6MTk4ODg1ODk5MX0.sbQyIiHTKuytcRqQo5uO8h9aXnwOtIZmx1jE9He5CcA"
const supabase = createClient(supabaseUrl, supabaseKey)

export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
  })
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
}

export async function getUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function getCompletedColumn(user) {
const { data, error } = await supabase
  .from('reading_progress')
  .select('completed')
  .eq('user_id', user.id )

  return data[0].completed
}


export async function updateCompletedColumn(user, IDs) {
  return await supabase
    .from('reading_progress')
    .upsert({'completed': IDs, 'user_id': user.id })
    .eq('user_id', user.id )
}

export async function getAccountability(user) {
if (!user) return
const { data, error } = await supabase
  .from('reading_progress')
  .select('accountabilityBoard')
  .eq('user_id', user.id )

  return data[0].accountabilityBoard
}

export async function getUsers() {
const { data, error } = await supabase
  .from('users')
  .select('accountabilityBoard')
  .eq('user_id', user.id )

  return data[0].accountabilityBoard
}

export async function addAccountabilityUser(user) {
  let userInfo = { 
    "name": user.user_metadata.full_name,
    "avatar": user.user_metadata.avatar_url,
  }

  return await supabase
    .from('reading_progress')
    .upsert({'accountabilityBoardUser': userInfo, 'user_id': user.id })
    .eq('user_id', user.id )
}