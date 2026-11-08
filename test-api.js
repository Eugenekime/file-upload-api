import FormData from 'form-data';
import fs from 'node:fs';
import axios from 'axios';

const API_URL = 'http://localhost:3000';

// 1. Upload image
async function testUpload() {
  const form = new FormData();

  form.append('file', fs.createReadStream('test-image.jpg'));

  const response = await axios.post(`${API_URL}/api/upload/single`, form, {
    headers: form.getHeaders(),
  });

  console.log('\nUpload response:', response.data);

  return response.data.file.filename;
}

// 2. Get metadata
async function testMetadata(filename) {
  const response = await axios.get(
    `${API_URL}/api/process/metadata/${filename}`
  );

  console.log('\nMetadata response:', response.data);
}

// 3. Resize image
async function testResize(filename) {
  const response = await axios.post(
    `${API_URL}/api/process/resize/${filename}`,
    {
      width: 800,
      height: 600,
      fit: 'inside',
    }
  );

  console.log('\nResize response:', response.data);
}

// 4. Create thumbnail
async function testThumbnail(filename) {
  const response = await axios.post(
    `${API_URL}/api/process/thumbnail/${filename}`
  );

  console.log('\nThumbnail response:', response.data);
}

// 5. Convert image
async function testConvert(filename) {
  const response = await axios.post(
    `${API_URL}/api/process/convert/${filename}`,
    {
      format: 'webp',
      quality: 85,
    }
  );

  console.log('\nConvert response:', response.data);
}

// 6. Add watermark
async function testWatermark(filename) {
  const response = await axios.post(
    `${API_URL}/api/process/watermark/${filename}`
  );

  console.log('\nWatermark response:', response.data);
}

// 7. Create responsive images
async function testResponsive(filename) {
  const response = await axios.post(
    `${API_URL}/api/process/responsive/${filename}`
  );

  console.log('\nResponsive response:', response.data);
}

// Run tests
async function runTests() {
  try {
    const filename = await testUpload();

    await testMetadata(filename);
    await testResize(filename);
    await testThumbnail(filename);
    await testConvert(filename);
    await testWatermark(filename);
    await testResponsive(filename);

    console.log('\nAll tests completed successfully!');
  } catch (error) {
    console.error('\nTest failed:', error.response?.data || error.message);
  }
}

runTests();
