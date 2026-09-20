import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const text = searchParams.get('text');
  const surah = searchParams.get('surah');
  const ayah = searchParams.get('ayah');

  try {
    // 1. If surah and ayah are provided, stream Mishary Alafasy high-quality ayah audio
    if (surah && ayah) {
      const sNum = parseInt(surah, 10);
      const aNum = parseInt(ayah, 10);
      if (!isNaN(sNum) && !isNaN(aNum) && sNum >= 1 && sNum <= 114 && aNum >= 1 && aNum <= 286) {
        const sPad = String(sNum).padStart(3, '0');
        const aPad = String(aNum).padStart(3, '0');
        const ayahAudioUrl = `https://verses.quran.com/Alafasy/mp3/${sPad}${aPad}.mp3`;

        const res = await fetch(ayahAudioUrl, { next: { revalidate: 86400 * 30 } });
        if (res.ok) {
          const buffer = await res.arrayBuffer();
          return new NextResponse(buffer, {
            status: 200,
            headers: {
              'Content-Type': 'audio/mpeg',
              'Cache-Control': 'public, max-age=31536000, immutable',
            },
          });
        }
      }
    }

    // 2. If Arabic text is provided, stream clear Arabic pronunciation
    if (text) {
      const cleanText = text.split('/')[0].trim();
      const encoded = encodeURIComponent(cleanText);
      const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encoded}&tl=ar&client=tw-ob`;

      const res = await fetch(ttsUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
        },
        next: { revalidate: 86400 * 30 },
      });

      if (res.ok) {
        const buffer = await res.arrayBuffer();
        return new NextResponse(buffer, {
          status: 200,
          headers: {
            'Content-Type': 'audio/mpeg',
            'Cache-Control': 'public, max-age=31536000, immutable',
          },
        });
      }
    }

    return NextResponse.json({ error: 'Missing audio parameters' }, { status: 400 });
  } catch (error) {
    console.error('Audio proxy error:', error);
    return NextResponse.json({ error: 'Failed to fetch audio' }, { status: 500 });
  }
}
