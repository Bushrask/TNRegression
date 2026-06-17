const fs = require('fs');
//const fetch = require('node-fetch');

const BASE_URL = 'https://test.teach-now.com/automationTest';
const API_KEY = 'P013mJNuct9TgqRmkIecuZo5qKaspipA';

async function post(endpoint, body) {
  const params = new URLSearchParams();
  Object.entries(body).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params.append(key, String(value));
    }
  });

  const res = await fetch(`${BASE_URL}/${endpoint}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'X-Automation-Api-Key': API_KEY,
    },
    body: params,
  });

  // ✅ Read body ONLY ONCE
  const text = await res.text().catch(() => '');

  console.log(`✅ ${endpoint} raw response:`, text);

  if (!res.ok) {
    throw new Error(`POST ${endpoint} failed: ${res.status} ${res.statusText} ${text}`);
  }

  // ✅ Parse safely
  const parsed = text ? JSON.parse(text) : {};

  // API returns business status in-body (statusCode/response) even on HTTP 200.
  if (parsed && typeof parsed.statusCode === 'number' && parsed.statusCode >= 400) {
    const message = parsed.response && parsed.response.error
      ? parsed.response.error
      : `API statusCode ${parsed.statusCode}`;
    throw new Error(`POST ${endpoint} failed: ${message}`);
  }

  return parsed && parsed.response ? parsed.response : parsed;
}

(async () => {
  try {
    // Create Candidate for CERT
    const candidate = await post('createCandidate', {
    "programId": 1,
    "fusebillId": 15261481, //staxbill account created for automation with paypal payment method saved
    "hubspotContactId": "test-123",
    "hubspotDealId": "test-123"
});

    // Create Cohort
    const cohort = await post('createCohort', {
      programId: 1,
      vcDay: 'Sunday',
      vcTime: '12:00 a.m.',
      startDate: '2026-06-07',
    });

    // Add Candidate to Cohort
    await post('addCandidateToCohort', {
      userId: candidate.userId,
      cohortId: cohort.cohortId,
    });

    // Prepare TypeScript export content
    const content = `export const configData = ${JSON.stringify({ candidate, cohort }, null, 2)};\n`;

    // Ensure directory exists
    const outDir = './support';
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

    fs.writeFileSync(`${outDir}/configData.ts`, content, 'utf8');

    console.log('✅ Test data generated successfully at ./support/configData.ts');
  } catch (err) {
    console.error('❌ Error generating test data', err);
    process.exit(1);
  }
})();
