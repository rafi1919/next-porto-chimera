import { NextRequest, NextResponse } from 'next/server';

const apiUrl = process.env.NEXT_PUBLIC_API_URL + '/' + process.env.NEXT_PUBLIC_API_VERSION; // or import.meta.env.VITE_API_URL

export async function POST(request: NextRequest) {
    try {        
       const formData = await request.formData();
       
       const response = await fetch(`${apiUrl}/upload-image`, {
            method: 'POST',
            body: formData
        })
        
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