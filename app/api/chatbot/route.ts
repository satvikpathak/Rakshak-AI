import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();
    
    if (!message) {
      return NextResponse.json(
        { error: 'Message is required', success: false },
        { status: 400 }
      );
    }

    // Read context from context.txt
    const contextPath = path.join(process.cwd(), 'context.txt');
    
    let context = '';
    
    try {
      context = fs.readFileSync(contextPath, 'utf-8');
    } catch (error) {
      console.log('Context file not found, using default context');
      context = `🎯 Behavior Detection System
* **Loitering:** Flags stationary individuals who remain in the same location for extended periods.
* **Unattended Baggage:** Detects bags, packages, or luggage left without owners nearby.
* **Sudden Dispersal:** Triggers alerts when crowd size drops quickly, indicating potential panic or evacuation.

🧨 Weapon Detection (Demo Mode)
* Handbags are treated as proxies for weapons in demonstration.
* Red bounding box follows detected handbag objects.
* Alert persists once triggered and requires manual reset.

🧠 Face Recognition & Emotion Labeling
* Recognizes known suspects via data/known_suspects.json database.
* Shows suspect names highlighted in **magenta**.
* Emotion Labels:
  * Weapon holder → **"Angry"**
  * All others → **"Neutral"**

🎥 Input & Output Processing
* Supports webcam feed or MP4 file input (user selected).
* Output Generation:
  * Processed video → demo/output_*.mp4
  * Alert snapshots → demo/frame_*.jpg`;
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const prompt = `You are a helpful assistant for a Security Surveillance System.

Context about the system:
${context}

User question: ${message}

Please provide a helpful response about the security surveillance system. Be informative and professional. If the question is about system features, refer to the context provided above.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({
      message: text,
      success: true
    });

  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return NextResponse.json(
      { 
        error: 'Failed to get response from AI',
        success: false 
      },
      { status: 500 }
    );
  }
}

// Optional: Handle other HTTP methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}