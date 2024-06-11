// __tests__/checkImages.test.ts
import fetch from 'node-fetch';

interface BrokenImage {
  url: string;
  status: string;
}

interface CheckImagesResponse {
  message: string;
  brokenImages: BrokenImage[];
}

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

describe('Check Images API', () => {
  it('should return and empty array', async () => {
    const response = await fetch(`${baseUrl}/api/checkImages`, {
      method: 'POST',
    });
    const responseBody = await response.text();

    if (!responseBody) {
      throw new Error('Empty response body');
    }

    try {
      const data = JSON.parse(responseBody) as CheckImagesResponse;
      console.log("it - data:", data.brokenImages);

      expect(response.status).toBe(200);
      expect(data.brokenImages.length).toBe(0);
    } catch (error) {
      console.error('Failed to parse JSON:', error);
      throw error;
    }
  });
});
