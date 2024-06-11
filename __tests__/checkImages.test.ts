// __tests__/checkImages.test.ts
import fetch from 'node-fetch';

interface CheckImagesResponse {
  message: string;
  brokenImages: string[];
}

describe('Check Images API', () => {
  it('should return the status of all images', async () => {
    const response = await fetch('http://localhost:3000/api/checkImages', {
      method: 'POST',
    });
    console.log('Response:', response);
    const responseBody = await response.text();

    console.log('Raw Response:', responseBody);

    if (!responseBody) {
      throw new Error('Empty response body');
    }

    try {
      const data = JSON.parse(responseBody) as CheckImagesResponse;

      expect(response.status).toBe(200);
      expect(data.message).toBeTruthy();

      if (data.brokenImages && data.brokenImages.length > 0) {
        throw new Error(`Found broken images: ${data.brokenImages.join(', ')}`);
      } else {
        expect(data.brokenImages.length).toBe(0); // This should pass if there are no broken images
      }
    } catch (error) {
      console.error('Failed to parse JSON or found broken images:', error);
      throw error;
    }
  });
});
