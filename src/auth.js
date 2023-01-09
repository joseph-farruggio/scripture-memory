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
  function uuid() {
    let uuid = '';
    for (let i = 0; i < 12; i++) {
      uuid += Math.floor(Math.random() * 10);
    }
    return uuid;
  }

  return await supabase
    .from('reading_progress')
    .upsert({'id': uuid(), 'completed': IDs })
    .eq('user_id', user.id )
}
