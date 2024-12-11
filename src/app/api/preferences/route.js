// src/app/api/preferences/route.js

import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import clientPromise from '../../../lib/mongodb';

const JWT_SECRET = process.env.JWT_SECRET;

export async function GET(request) {
  try {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Verify JWT
    const decoded = jwt.verify(token, JWT_SECRET);
    const username = decoded.username;

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db(process.env.DATABASE_NAME);
    const preferencesCollection = db.collection('preferences');

    // Fetch user preferences
    const userPref = await preferencesCollection.findOne({ username });
    if (!userPref) {
      // If user doesn't exist, create default preferences
      const default_prefs = { copy_paste: false };
      await preferencesCollection.insertOne({ username, preferences: default_prefs });
      return NextResponse.json({ preferences: default_prefs });
    }

    return NextResponse.json({ preferences: userPref.preferences });
  } catch (error) {
    console.error('Preferences GET Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Verify JWT
    const decoded = jwt.verify(token, JWT_SECRET);
    const username = decoded.username;

    const { preferences } = await request.json();

    if (!preferences || typeof preferences.copy_paste !== 'boolean') {
      return NextResponse.json({ message: 'Invalid preferences data.' }, { status: 400 });
    }

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db(process.env.DATABASE_NAME);
    const preferencesCollection = db.collection('preferences');

    // Update user preferences
    await preferencesCollection.updateOne(
      { username },
      { $set: { preferences } },
      { upsert: true }
    );

    return NextResponse.json({ message: 'Preferences updated successfully.' });
  } catch (error) {
    console.error('Preferences POST Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
