import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type')
  const status = searchParams.get('status')

  let query = supabase
    .from('offers')
    .select('*')
    .order('created_at', { ascending: false })

  if (type && type !== 'all') {
    query = query.eq('ticket_type', type)
  }
  if (status && status !== 'all') {
    query = query.eq('status', status)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ offers: data })
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { name, email, phone, ticket_type, quantity, price_sar, contact_methods } = body

  if (!name || !email || !phone || !ticket_type || !quantity || !price_sar || !contact_methods) {
    return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('offers')
    .insert([{
      name,
      email,
      phone,
      ticket_type,
      quantity: parseInt(quantity),
      price_sar: parseFloat(price_sar),
      contact_methods,
      status: 'available',
    }])
    .select()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ offer: data[0] })
}
