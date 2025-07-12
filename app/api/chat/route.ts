import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { message, selectedText, speechContext, mode = 'chat' } = await request.json();

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'ANTHROPIC_API_KEY is not configured' },
        { status: 500 }
      );
    }

    let prompt: string;

    if (mode === 'rewrite') {
      prompt = `You are an expert speechwriter specializing in wedding speeches. 

Context: This is a wedding speech with the following details:
${speechContext}

Selected text from the speech that needs to be rewritten: "${selectedText}"

User's rewrite instructions: ${message}

Please rewrite the selected text according to the user's instructions. Your rewritten version should:
- Follow the user's specific instructions
- Maintain the same tone and style as the original speech
- Be appropriate for a wedding context
- Flow naturally with the rest of the speech
- Be the same approximate length as the original text
- Keep the same level of formality and sentiment

Return ONLY the rewritten text, without any explanations or additional context.`;
    } else {
      prompt = `You are a helpful assistant that can answer questions about wedding speeches. 

Context: This is a wedding speech with the following details:
${speechContext}

Selected text from the speech: "${selectedText}"

User question: ${message}

Please provide a helpful, informative response about the selected text or the speech in general. Your response should be:
- Relevant to the user's question
- Helpful for understanding or improving the speech
- Professional and appropriate for a wedding context
- Concise but thorough

Respond in a conversational tone that would be helpful to someone working on their wedding speech.`;
    }

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: mode === 'rewrite' ? 300 : 500,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const responseText = response.content[0].type === 'text' ? response.content[0].text : '';

    return NextResponse.json({ response: responseText });
  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    );
  }
} 