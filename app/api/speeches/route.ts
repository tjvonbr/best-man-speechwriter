import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const speeches = await prisma.speech.findMany({
      where: { userId: userId },
      select: {
        id: true,
        speechType: true,
        groomName: true,
        brideName: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ speeches });
  } catch (error) {
    console.error('Error fetching speeches:', error);
    return NextResponse.json(
      { error: 'Failed to fetch speeches' },
      { status: 500 }
    );
  }
} 