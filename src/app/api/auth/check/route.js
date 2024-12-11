// src/app/api/auth/check/route.js

import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export async function GET(request) {
  try {
    // Extract the token from cookies
    const cookieHeader = request.headers.get('cookie');
    if (!cookieHeader) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const cookies = Object.fromEntries(
      cookieHeader.split('; ').map((v) => v.split('='))
    );

    const token = cookies.token;
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Verify JWT
    const decoded = jwt.verify(token, JWT_SECRET);
    const username = decoded.username;

    return NextResponse.json({ username });
  } catch (error) {
    console.error('Auth Check Error:', error);
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
}
