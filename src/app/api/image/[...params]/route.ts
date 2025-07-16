import blurHashes from '@/app/data/blurhashes.json';
import { NextRequest, NextResponse } from 'next/server';

const CDN_URL = 'https://ddragon.leagueoflegends.com/cdn/img/champion';
const DEFAULT_BLURHASH = 'LEHV6nWB2yk8pyo0adR*.7kCMdnj';

const PREDEFINED_SIZES = {
  tiles: {
    default: { width: 250, height: 250, quality: 80 },
  },
  centered: {
    default: { width: 1000, height: 1000, quality: 90 },
    large: { width: 1280, height: 720, quality: 100 },
  },
};

export async function GET(
  _request: NextRequest,
  { params }: { params: { params: string[] } }
) {
  if (!Array.isArray(params.params)) {
    return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
  }

  const [heroId] = params.params;

  if (!heroId) {
    return NextResponse.json({ error: 'Missing hero ID' }, { status: 400 });
  }

  const imageUrls: {
    [key: string]: {
      [key: string]: { url: string; width: number; height: number };
    };
  } = {};

  for (const [type, sizes] of Object.entries(PREDEFINED_SIZES)) {
    imageUrls[type] = {};
    for (const [sizeName, size] of Object.entries(sizes)) {
      // Serve directly from ddragon CDN
      const cdnImageUrl = `${CDN_URL}/${type}/${heroId}_0.jpg`;
      imageUrls[type][sizeName] = {
        url: cdnImageUrl,
        width: size.width,
        height: size.height,
      };
    }
  }

  const blurhash =
    (blurHashes as Record<string, { hash: string }>)[heroId]?.hash ||
    DEFAULT_BLURHASH;

  return NextResponse.json({ imageUrls, blurhash });
}
