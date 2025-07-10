import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { prisma } from '@/lib/prisma';
import { nanoid } from 'nanoid';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { name, sex, email, speechType, groomName, brideName, relationship, stories, tone, length } = await request.json();

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'ANTHROPIC_API_KEY is not configured' },
        { status: 500 }
      );
    }

    const prompt = `You are an expert speechwriter specializing in wedding speeches. Create a ${speechType} speech with the following details:

Speaker: ${name} (${sex})
Speech Type: ${speechType}
Groom's Name: ${groomName}
Bride's Name: ${brideName}
Relationship to the couple: ${relationship}
Personal stories/anecdotes: ${stories}
Tone: ${tone}
Length: ${length}

Please create a heartfelt, personal, and engaging speech that:
- Includes a warm opening that captures attention
- Incorporates the personal stories and anecdotes provided
- Balances humor with sentimentality
- Includes specific details about the couple
- Has a memorable conclusion with a toast
- Is appropriate for a wedding audience
- Matches the requested tone and length
- Feels authentic and personal, as if it's being delivered by ${name}

Make the speech feel authentic and personal, as if it's being delivered by someone who truly knows and cares about the couple. The speech should reflect the speaker's relationship and personal connection to the couple.`;

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const speech = message.content[0].type === 'text' ? message.content[0].text : '';

    // Create or find user by email
    const user = await prisma.user.upsert({
      where: { email: email },
      update: {},
      create: {
        name: name,
        sex: sex,
        email: email,
      },
    });

    // Create speech with unique slug
    const slug = nanoid(10);
    const speechRecord = await prisma.speech.create({
      data: {
        slug: slug,
        speechType: speechType,
        groomName: groomName,
        brideName: brideName,
        relationship: relationship,
        stories: stories || null,
        tone: tone,
        length: length,
        speech: speech,
        userId: user.id,
      },
    });

    return NextResponse.json({ 
      speech: speech,
      slug: speechRecord.slug,
      speechId: speechRecord.id
    });
  } catch (error) {
    console.error('Error generating speech:', error);
    return NextResponse.json(
      { error: 'Failed to generate speech' },
      { status: 500 }
    );
  }
} 