// src/app/api/checkImages/route.ts
import { NextResponse } from 'next/server';
import { champions } from '@/app/utils/champions';
import axios from 'axios';

export const runtime = 'edge';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? '';
console.log('Base URL:', baseUrl);

const getImageUrl = (imageName: string, type: 'splash' | 'tiles') => {
  return `https://draft.tournoishaq.ca/images/champions/${type}/${imageName
    ?.toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[\W_]+/g, '')}.webp`;
};

const checkImageStatus = async (url: string) => {
  try {
    const response = await axios.head(url);
    console.log(`Checking status of ${url} - ${response.status}`);
    if (response.status === 200) {
      return null; // Image is accessible
    }
  } catch (error) {
    return url; // Return the URL if there is an error
  }
};

export async function POST() {
  const splashImages = champions.map((champ) => getImageUrl(champ.id, 'splash'));
  const tileImages = champions.map((champ) => getImageUrl(champ.id, 'tiles'));

  const splashResults = await Promise.allSettled(splashImages.map(checkImageStatus));
  const tileResults = await Promise.allSettled(tileImages.map(checkImageStatus));

  const brokenSplashImages = splashResults
    .filter((result) => result.status === 'rejected' || result.value !== null)
    .map((result) => (result.status === 'rejected' ? (result.reason as Error).message : result.value));
  
  const brokenTileImages = tileResults
    .filter((result) => result.status === 'rejected' || result.value !== null)
    .map((result) => (result.status === 'rejected' ? (result.reason as Error).message : result.value));

  const brokenImages = [...brokenSplashImages, ...brokenTileImages];

  console.log('Broken Images:', brokenImages);

  return NextResponse.json({
    message: brokenImages.length ? 'Some images are broken' : 'All images are fine',
    brokenImages,
  });
}
