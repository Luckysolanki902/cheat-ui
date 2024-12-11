// src/app/api/auth/route.js

import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import clientPromise from '../../../lib/mongodb';

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(request) {
  try {
    const { username } = await request.json();

    if (!username) {
      return NextResponse.json({ message: 'Username is required.' }, { status: 400 });
    }

    // For simplicity, no password is required. In production, implement proper authentication.
    
    // Create JWT token
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '7d' }); // Token valid for 7 days

    // Set token in HttpOnly cookie
    const response = NextResponse.json({ message: 'Authentication successful.' });
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Auth Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(request) {
  // Optional: Implement token verification or user info retrieval
  return NextResponse.json({ message: 'Auth API' });
}
