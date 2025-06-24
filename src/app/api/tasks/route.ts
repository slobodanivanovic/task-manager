// app/api/tasks/route.ts
import { supabaseAdmin } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const { data: tasks, error } = await supabaseAdmin
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json(tasks)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const { data: task, error } = await supabaseAdmin
      .from('tasks')
      .insert([
        { title: body.title, completed: body.completed || false }
      ])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(task, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    )
  }
}