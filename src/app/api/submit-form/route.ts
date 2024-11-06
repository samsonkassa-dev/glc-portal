import { FormSubmissionData } from '@/types/form';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data: FormSubmissionData = await request.json();
    
    const response = await fetch(`${process.env.BACKEND_API_URL}/members`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.API_KEY}`
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();
    return NextResponse.json(result, { status: response.status });

  } catch (error) {
    console.error('Form submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit form' },
      { status: 500 }
    );
  }
} 