import { rt } from 'framer-motion/client';
import { NextRequest, NextResponse } from 'next/server';

const apiUrl = process.env.API_URL;

export async function GET(request: NextRequest) {
  try {
      const response = await fetch(apiUrl + '/top-porto', {
          method: 'GET',
      });
      const data = await response.json();
      return NextResponse.json(data);
  } catch (error) {
     return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }

}
