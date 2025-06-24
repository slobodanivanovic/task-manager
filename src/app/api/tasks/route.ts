// src/app/api/tasks/route.ts - FIXED VERSION
import { supabaseAdmin } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const { data: tasks, error } = await supabaseAdmin
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Database error:', error) // ← Now using 'error'
      throw error
    }

    return NextResponse.json(tasks)
  } catch (err) { // ← Renamed to avoid unused variable
    console.error('API Error:', err)
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    if (!body.title || body.title.trim() === '') {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      )
    }

    const { data: task, error } = await supabaseAdmin
      .from('tasks')
      .insert([{
        title: body.title.trim(),
        description: body.description || null,
        priority: body.priority || 'medium',
        completed: body.completed || false
      }])
      .select()
      .single()

    if (error) {
      console.error('Database error:', error) // ← Now using 'error'
      throw error
    }

    return NextResponse.json(task, { status: 201 })
  } catch (err) { // ← Renamed to avoid unused variable
    console.error('API Error:', err)
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    )
  }
}