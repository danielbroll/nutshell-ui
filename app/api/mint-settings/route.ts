import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(`${process.env.MINT_URL}/v1/settings`, {
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return NextResponse.json(
          { error: '/settings status ' + response.status },
          { status: 500 }
      );
    }

    const mintSettings = await response.json();

    return NextResponse.json(mintSettings);
  } catch (error) {
    console.error('Error retrieving mint settings:', error);
    return NextResponse.json(
        { error: 'unexpected'},
        { status: 200 }
    );
  }
}
