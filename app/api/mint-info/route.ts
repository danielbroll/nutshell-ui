import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(`${process.env.MINT_URL}/v1/info`, {
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return NextResponse.json(
          { error: '/info status ' + response.status },
          { status: 500 }
      );
    }

    const mintInfo = await response.json();

    return NextResponse.json(mintInfo);
  } catch (error) {
    console.error('Error retrieving mint information:', error);
    return NextResponse.json(
        { error: 'unexpected' },
        { status: 500 }
    );
  }
}
