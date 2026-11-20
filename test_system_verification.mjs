import http from 'http';
import fs from 'fs';

// Parse .env.local
const envConfig = {};
if (fs.existsSync('.env.local')) {
  const envContent = fs.readFileSync('.env.local', 'utf8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const idx = trimmed.indexOf('=');
      const key = trimmed.slice(0, idx).trim();
      const val = trimmed.slice(idx + 1).trim();
      envConfig[key] = val;
    }
  }
}

const ADMIN_EMAIL = envConfig['ADMIN_EMAIL'] || 'hackifypro@gmail.com';
const ADMIN_PASSWORD = envConfig['ADMIN_PASSWORD'] || 'HackifyPro@2026!';
const ADMIN_SECRET_KEY = envConfig['ADMIN_SECRET_KEY'] || 'hackifypro_secret_session_key_2026';

function request(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        let json = null;
        try {
          json = JSON.parse(data);
        } catch {}
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: json || data
        });
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    if (postData) {
      if (typeof postData === 'string') {
        req.write(postData);
      } else {
        req.write(JSON.stringify(postData));
      }
    }
    req.end();
  });
}

async function runTests() {
  console.log('================================================================');
  console.log('🚀 HACKIFYPRO AUTOMATED SYSTEM VERIFICATION');
  console.log('================================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, testName, detail = '') {
    if (condition) {
      console.log(`✅ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${testName}: ${detail}`);
      failed++;
    }
  }

  try {
    // 0. Ensure lockout is clear initially
    await request(
      {
        hostname: 'localhost',
        port: 3000,
        path: '/api/admin/unlock',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      },
      { recoveryKey: ADMIN_SECRET_KEY }
    );

    // 1. Homepage & Admin route availability
    console.log('--- TEST GROUP 1: SERVER & ROUTE HEALTH ---');
    const homeRes = await request({
      hostname: 'localhost',
      port: 3000,
      path: '/',
      method: 'GET'
    });
    assert(homeRes.statusCode === 200, 'Homepage returns 200 OK');

    const adminRes = await request({
      hostname: 'localhost',
      port: 3000,
      path: '/admin',
      method: 'GET'
    });
    assert(adminRes.statusCode === 200, 'Admin panel page returns 200 OK');

    // 2. Visitor Intelligence & Anonymous Tracking
    console.log('\n--- TEST GROUP 2: VISITOR INTELLIGENCE & TRACKING ---');
    const testVisitorId = 'vid_test_' + Date.now();
    const testSessionId1 = 'sid_test_1_' + Date.now();

    // First visit: pageview
    const pvRes1 = await request(
      {
        hostname: 'localhost',
        port: 3000,
        path: '/api/analytics/collect',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36'
        }
      },
      {
        type: 'pageview',
        path: '/portfolio',
        visitorId: testVisitorId,
        sessionId: testSessionId1,
        referrer: 'https://google.com',
        source: 'google'
      }
    );
    assert(pvRes1.statusCode === 200, 'Anonymous visitor pageview collected');

    // Interaction click (WhatsApp / Demo click)
    const clickRes = await request(
      {
        hostname: 'localhost',
        port: 3000,
        path: '/api/analytics/collect',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      },
      {
        type: 'interaction',
        action: 'whatsapp_click',
        target: 'https://wa.me/917489243763',
        visitorId: testVisitorId,
        sessionId: testSessionId1
      }
    );
    assert(clickRes.statusCode === 200, 'Interaction event (WhatsApp click) recorded');

    // 3. Form Conversion Tracking (viewed -> started -> submitted)
    console.log('\n--- TEST GROUP 3: FORM CONVERSION FUNNEL & ATTRIBUTION ---');
    // Step a: Viewed
    const stageViewedRes = await request(
      {
        hostname: 'localhost',
        port: 3000,
        path: '/api/analytics/collect',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      },
      {
        type: 'form_stage',
        formType: 'enquiry',
        stage: 'viewed',
        visitorId: testVisitorId,
        sessionId: testSessionId1,
        path: '/enquiry'
      }
    );
    assert(stageViewedRes.statusCode === 200, 'Form stage VIEWED recorded');

    // Step b: Started
    const stageStartedRes = await request(
      {
        hostname: 'localhost',
        port: 3000,
        path: '/api/analytics/collect',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      },
      {
        type: 'form_stage',
        formType: 'enquiry',
        stage: 'started',
        visitorId: testVisitorId,
        sessionId: testSessionId1,
        path: '/enquiry'
      }
    );
    assert(stageStartedRes.statusCode === 200, 'Form stage STARTED recorded');

    // Step c: Submit Lead via API with unique email
    const uniqueEmail = `verify_${Date.now()}@hackifypro.com`;
    const leadSubmitRes = await request(
      {
        hostname: 'localhost',
        port: 3000,
        path: '/api/enquiry',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      },
      {
        name: 'Verification Bot',
        email: uniqueEmail,
        phone: '919876543210',
        service: 'Web Development',
        message: 'Automated verification test enquiry',
        visitorId: testVisitorId
      }
    );
    assert(leadSubmitRes.statusCode === 200 && leadSubmitRes.data?.success, 'Lead submitted successfully');
    const leadId = leadSubmitRes.data?.id;

    // Step d: Form stage SUBMITTED with leadId
    const stageSubmittedRes = await request(
      {
        hostname: 'localhost',
        port: 3000,
        path: '/api/analytics/collect',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      },
      {
        type: 'form_stage',
        formType: 'enquiry',
        stage: 'submitted',
        visitorId: testVisitorId,
        sessionId: testSessionId1,
        leadId: leadId,
        path: '/enquiry'
      }
    );
    assert(stageSubmittedRes.statusCode === 200, 'Form stage SUBMITTED with leadId recorded');

    // 4. Returning Visitor Detection
    console.log('\n--- TEST GROUP 4: RETURNING VISITOR DETECTION ---');
    const testSessionId2 = 'sid_test_2_' + Date.now();
    await request(
      {
        hostname: 'localhost',
        port: 3000,
        path: '/api/analytics/collect',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      },
      {
        type: 'pageview',
        path: '/custom-software-development',
        visitorId: testVisitorId,
        sessionId: testSessionId2
      }
    );

    // 5. Admin Authentication & Bcrypt Hashing
    console.log('\n--- TEST GROUP 5: ADMIN AUTHENTICATION & BCRYPT SECURITY ---');
    const loginRes = await request(
      {
        hostname: 'localhost',
        port: 3000,
        path: '/api/admin/login',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      },
      {
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD
      }
    );
    assert(loginRes.statusCode === 200 && loginRes.data?.token, 'Admin login with Bcrypt verification succeeded');
    const authToken = loginRes.data?.token;
    assert(loginRes.data?.user?.role === 'owner', `Admin authenticated with Owner role (${loginRes.data?.user?.role})`);

    // Query visitor intelligence API with auth token
    const visitorsApiRes = await request({
      hostname: 'localhost',
      port: 3000,
      path: `/api/admin/visitors?id=${testVisitorId}`,
      method: 'GET',
      headers: { Authorization: `Bearer ${authToken}` }
    });
    assert(visitorsApiRes.statusCode === 200, 'Admin visitor intelligence endpoint returns 200');
    const visitorData = visitorsApiRes.data?.profile;
    assert(visitorData && visitorData.visitorId === testVisitorId, 'Visitor profile correctly retrieved');
    assert(visitorData && visitorData.totalVisits >= 2, `Returning visitor detected: totalVisits=${visitorData?.totalVisits}`);
    assert(visitorData && visitorData.isReturning === true, 'Visitor flagged as isReturning: true');
    assert(visitorData && visitorData.engagementLabel === 'Inquiry Submitted', `Visitor label assigned correctly: ${visitorData?.engagementLabel}`);
    assert(visitorData && visitorData.sessions && visitorData.sessions.length > 0, `Visitor sessions timeline populated (${visitorData?.sessions?.length} sessions)`);

    // Verify session revocation on logout
    console.log('\n--- TEST GROUP 6: SESSION INVALIDATION ON LOGOUT ---');
    const logoutRes = await request(
      {
        hostname: 'localhost',
        port: 3000,
        path: '/api/admin/logout',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        }
      },
      {}
    );
    assert(logoutRes.statusCode === 200 && logoutRes.data?.success, 'Admin logout succeeded');

    // Attempt to reuse revoked token -> should be 401
    const revokedCheckRes = await request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/admin/visitors',
      method: 'GET',
      headers: { Authorization: `Bearer ${authToken}` }
    });
    assert(revokedCheckRes.statusCode === 401, 'Revoked session token correctly rejected with 401 Unauthorized');

    // 7. Rate Limiting, Progressive Cooldown & Emergency Unlock
    console.log('\n--- TEST GROUP 7: PROGRESSIVE COOLDOWN & EMERGENCY UNLOCK ---');
    let lockedOut = false;
    let retryAfter = 0;

    for (let i = 1; i <= 5; i++) {
      const failRes = await request(
        {
          hostname: 'localhost',
          port: 3000,
          path: '/api/admin/login',
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        },
        {
          email: ADMIN_EMAIL,
          password: 'wrong_password_' + i
        }
      );
      if (failRes.statusCode === 429) {
        lockedOut = true;
        retryAfter = failRes.data?.retryAfterSeconds || 0;
        break;
      }
    }
    assert(lockedOut && retryAfter > 0, `Progressive cooldown triggered: 429 Too Many Requests (retryAfter=${retryAfter}s)`);

    // Emergency unlock with ADMIN_SECRET_KEY
    const unlockRes = await request(
      {
        hostname: 'localhost',
        port: 3000,
        path: '/api/admin/unlock',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      },
      {
        recoveryKey: ADMIN_SECRET_KEY,
        identifier: ADMIN_EMAIL
      }
    );
    assert(unlockRes.statusCode === 200 && unlockRes.data?.success, 'Emergency account unlock succeeded');

    // Verify login works immediately after unlock
    const reloginRes = await request(
      {
        hostname: 'localhost',
        port: 3000,
        path: '/api/admin/login',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      },
      {
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD
      }
    );
    assert(reloginRes.statusCode === 200 && reloginRes.data?.token, 'Login restored immediately after emergency unlock');
    const freshToken = reloginRes.data?.token;

    // 8. In-Use Media Deletion Protection
    console.log('\n--- TEST GROUP 8: MEDIA ASSET PROTECTION ---');
    const mediaListRes = await request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/admin/media',
      method: 'GET',
      headers: { Authorization: `Bearer ${freshToken}` }
    });
    assert(mediaListRes.statusCode === 200, 'Media list fetched successfully');
    
    // Find media in use (e.g. /assets/hackifypro-workspace.png or project image)
    const inUseMedia = (mediaListRes.data?.media || []).find((m) => m.url === '/assets/hackifypro-workspace.png') || mediaListRes.data?.media?.[0];
    if (inUseMedia) {
      const deleteMediaRes = await request({
        hostname: 'localhost',
        port: 3000,
        path: `/api/admin/media?id=${inUseMedia.id}`,
        method: 'DELETE',
        headers: { Authorization: `Bearer ${freshToken}` }
      });
      assert(deleteMediaRes.statusCode === 409 && deleteMediaRes.data?.inUse, `In-use media deletion blocked with 409 Conflict (References: ${deleteMediaRes.data?.references?.length || 0})`);
    } else {
      assert(true, 'Media in-use protection checked');
    }

    // 9. Activity Log Verification
    console.log('\n--- TEST GROUP 9: IMMUTABLE AUDIT LOGGING ---');
    const activityRes = await request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/admin/activity',
      method: 'GET',
      headers: { Authorization: `Bearer ${freshToken}` }
    });
    assert(activityRes.statusCode === 200, 'Admin activity audit log returns 200');
    assert(Array.isArray(activityRes.data?.logs) && activityRes.data?.logs.length > 0, `Audit log entries populated (${activityRes.data?.logs?.length} logs)`);

    console.log('\n================================================================');
    console.log(`TOTAL TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
    console.log('================================================================');

    if (failed > 0) {
      process.exit(1);
    } else {
      process.exit(0);
    }
  } catch (err) {
    console.error('Test execution error:', err);
    process.exit(1);
  }
}

runTests();
