import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const speech = await prisma.speech.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!speech) {
      return NextResponse.json(
        { error: 'Speech not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ speech });
  } catch (error) {
    console.error('Error fetching speech:', error);
    return NextResponse.json(
      { error: 'Failed to fetch speech' },
      { status: 500 }
    );
  }
} 