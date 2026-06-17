const fs = require('fs');
const path = require('path');
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

function loadConfigData() {
  // Try to require compiled/loaded module first
  try {
    // If `support/configData.js` exists, prefer it
    const jsPath = path.resolve(__dirname, '..', 'support', 'configData.js');
    const tsPath = path.resolve(__dirname, '..', 'support', 'configData.ts');

    if (fs.existsSync(jsPath)) {
      return require(jsPath).configData || require(jsPath).default || require(jsPath);
    }

    if (fs.existsSync(tsPath)) {
      // Read the TS file and extract the exported object literal
      const raw = fs.readFileSync(tsPath, 'utf8');
      const m = raw.match(/export\s+default\s+(\{[\s\S]*\})\s*;?/) || raw.match(/export\s+const\s+configData\s*=\s+(\{[\s\S]*\})\s*;?/);
      if (m && m[1]) {
        // eslint-disable-next-line no-new-func
        const obj = new Function(`return ${m[1]}`)();
        return obj;
      }
    }

    throw new Error('support/configData not found or could not be parsed');
  } catch (err) {
    throw err;
  }
}

(async () => {
  try {
    const configData = loadConfigData();
    const { candidate, cohort } = configData;

    // Remove candidate from cohort
    await post('RemoveCandidateFromCohort', {
      userId: candidate.userId,
      cohortId: cohort.cohortId,
    });

    // Delete cohort
    await post('DeleteCohort', {
      cohortId: cohort.cohortId,
    });

    // Delete candidate
    await post('DeleteCandidate', {
      userId: candidate.userId,
      applicantProgramId: candidate.applicantProgramId || null,
      applicantId: candidate.applicantId
    });

    console.log('✅ Test data deleted');
  } catch (err) {
    console.error('❌ Error deleting test data', err);
    process.exitCode = 1;
  }
})();
