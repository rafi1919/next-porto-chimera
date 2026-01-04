import { rt } from 'framer-motion/client';
import { NextRequest, NextResponse } from 'next/server';

const apiUrl = process.env.API_URL;

export async function GET(request: NextRequest) {
  try {
      const response = await fetch(apiUrl + '/portos', {
          method: 'GET',
      });
      const data = await response.json();
      return NextResponse.json(data);
  } catch (error) {
     return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }

}

export async function POST(request: NextRequest) {
  try {

    if (!apiUrl) {
      return NextResponse.json({ error: 'API_URL not configured' }, { status: 500 });
    }

    const formData = await request.formData();

    // Forward the FormData to the external API
    const response = await fetch(apiUrl+ '/portos', {
      method: 'POST',
      body: formData, // FormData handles multipart automatically
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to post to external API' }, { status: response.status });
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    
    if (!apiUrl) {
      return NextResponse.json({ error: 'API_URL not configured' }, { status: 500 });
    }

    const formData = await request.formData();
    
    // Convert FormData to JSON payload
    const payload: any = {
      title: formData.get('title'),
      role: formData.get('role'),
      description: formData.get('description'),
    };

    if(formData.get('image') && formData.get('image') instanceof File){
      payload.image = formData.get('image');
    }
    
    // Forward the JSON payload to the external API
    const response = await fetch(apiUrl + '/portos/' + formData.get('id'), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    
    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to update to external API' }, { status: response.status });
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}