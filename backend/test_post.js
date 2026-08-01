const fs = require('fs');
async function test() {
  try {
    const formData = new FormData();
    const dummyData = {
      fullName: 'Test Nanny',
      dob: '1990-01-01',
      gender: 'Female',
      mobileNumber: '1234567890',
      emailAddress: 'testnanny@example.com',
      nationality: 'Indian',
      preferredLanguage: 'English',
      yearsExperience: '5',
      expectedSalary: '20000',
      availableFrom: '2026-09-01'
    };
    formData.append('data', JSON.stringify(dummyData));
    
    // Attach a dummy file using blob
    const fileContent = fs.readFileSync('package.json');
    const fileBlob = new Blob([fileContent], { type: 'application/json' });
    formData.append('resume', fileBlob, 'package.json');

    const res = await fetch('https://api.resumebuilder.vayunexsolution.com/api/nannies', {
      method: 'POST',
      body: formData
    });
    
    const text = await res.text();
    console.log('Status:', res.status);
    console.log('Response:', text);
  } catch (error) {
    console.error('Failed:', error.message);
  }
}
test();
