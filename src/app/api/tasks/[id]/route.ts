import { supabaseAdmin } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const taskId = parseInt(params.id)

    if (isNaN(taskId)) {
      return NextResponse.json(
        { error: 'Invalid task ID' },
        { status: 400 }
      )
    }

    const { data: task, error } = await supabaseAdmin
      .from('tasks')
      .update({
        ...body,
        updated_at: new Date().toISOString()
      })
      .eq('id', taskId)
      .select()
      .single()

    if (error) {
      console.error('Database error:', error) // ← Now using 'error'
      throw error
    }

    if (!task) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(task)
  } catch (err) { // ← Renamed to avoid unused variable
    console.error('API Error:', err)
    return NextResponse.json(
      { error: 'Failed to update task' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const taskId = parseInt(params.id)

    if (isNaN(taskId)) {
      return NextResponse.json(
        { error: 'Invalid task ID' },
        { status: 400 }
      )
    }

    const { error } = await supabaseAdmin
      .from('tasks')
      .delete()
      .eq('id', taskId)

    if (error) {
      console.error('Database error:', error) // ← Now using 'error'
      throw error
    }

    return NextResponse.json({ message: 'Task deleted successfully' })
  } catch (err) { // ← Renamed to avoid unused variable
    console.error('API Error:', err)
    return NextResponse.json(
      { error: 'Failed to delete task' },
      { status: 500 }
    )
  }
}