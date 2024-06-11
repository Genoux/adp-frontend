// src/app/api/checkImages/route.ts
import { NextResponse } from 'next/server';
import { champions } from '@/app/utils/champions';
import axios from 'axios';

const getImageUrl = (imageName: string, type: 'splash' | 'tiles') => {
  return `http://localhost:3000/images/champions/${type}/${imageName
    ?.toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[\W_]+/g, '')}.webp`;
};

const checkImageStatus = async (url: string) => {
  try {
    const response = await axios.get(url);
    console.log(`Fetch Successful: ${url} - ${response.status}`);
    return {
      url,
      status: response.status,
    };
  } catch (error) {
    console.error(`Fetch Error for ${url}:`, (error as any).message);
    return {
      url,
      status: 'error',
    };
  }
};

export async function POST() {
  const splashImages = champions.map((champ) =>
    getImageUrl(champ.name, 'splash')
  );

  const tileImages = champions.map((champ) => getImageUrl(champ.name, 'tiles'));

  const allImages = [...splashImages, ...tileImages];

  try {
    const results = await Promise.all(allImages.map(checkImageStatus));
    const brokenImages = results.filter((result) => result.status !== 200);

    console.log('Results:', results);
    console.log('Broken Images:', brokenImages);

    return NextResponse.json({
      message: brokenImages.length ? 'Some images are broken' : 'All images are fine',
      brokenImages,
    });
  } catch (error) {
    console.error('Error in API handler:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
