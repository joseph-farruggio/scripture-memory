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
  // generate uuid in js
  const uuid = () => {
    let dt = new Date().getTime();
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = (dt + Math.random()*16)%16 | 0;
      dt = Math.floor(dt/16);
      return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    });
  }

  return await supabase
    .from('reading_progress')
    .upsert({'id': uuid, 'completed': IDs })
    .eq('user_id', user.id )
}
