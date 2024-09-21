import blurHashes from '@/app/data/blurhashes.json';
import { NextRequest, NextResponse } from 'next/server';

const BASE_URL = process.env.NEXT_PUBLIC_IMAGE_BASE_URL;
const CDN_URL = 'https://ddragon.leagueoflegends.com/cdn/img/champion';
const DEFAULT_BLURHASH = 'LEHV6nWB2yk8pyo0adR*.7kCMdnj';

const PREDEFINED_SIZES = {
  tiles: {
    default: { width: 150, height: 150, quality: 80 },
  },
  centered: {
    default: { width: 400, height: 720, quality: 80 },
    large: { width: 1215, height: 720, quality: 60 },
  },
};

export async function GET(
  request: NextRequest,
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
      const cdnImageUrl = `${CDN_URL}/${type}/${heroId}_0.jpg`;
      const params = `w_${size.width},h_${size.height},q_${size.quality}`;
      imageUrls[type][sizeName] = {
        url: `${BASE_URL}/upload/${params}/${encodeURIComponent(cdnImageUrl)}`,
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
