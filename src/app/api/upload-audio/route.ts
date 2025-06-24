import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const data = await req.arrayBuffer();
    const fileSize = data.byteLength;
    console.log('Received audio file. Size:', fileSize, 'bytes');
    // You could process or save the file here
    return NextResponse.json({ success: true, fileSize });
} 