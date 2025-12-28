interface Env {
  GOOGLE_CLOUD_SERVICE_ACCOUNT_KEY: string;
}

interface TTSAudioRequest {
  text: string;
  voice?: {
    languageCode: string;
    name: string;
    ssmlGender: string;
  };
  audioConfig?: {
    audioEncoding: string;
    speakingRate: number;
    pitch: number;
  };
}

interface TTSResponse {
  audioContent: string; // Base64 encoded audio
  audioConfig: any;
  voice: any;
}

export const onRequestPost = async (context: any) => {
  try {
    const { request, env } = context;
    const ttsRequest: TTSAudioRequest = await request.json();

    if (!ttsRequest.text) {
      return new Response(JSON.stringify({
        error: 'Text is required for TTS synthesis'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    // Default voice configuration if not provided
    const voice = ttsRequest.voice || {
      languageCode: 'en-US',
      name: 'en-US-Neural2-D',
      ssmlGender: 'NEUTRAL'
    };

    // Default audio configuration if not provided
    const audioConfig = ttsRequest.audioConfig || {
      audioEncoding: 'MP3',
      speakingRate: 1.0,
      pitch: 0.0
    };

    // Prepare the request payload for Google Cloud TTS API
    const payload = {
      input: { text: ttsRequest.text },
      voice,
      audioConfig
    };

    // Get Google Cloud access token using service account key
    const accessToken = await getGoogleAccessToken(env.GOOGLE_CLOUD_SERVICE_ACCOUNT_KEY);

    // Call Google Cloud Text-to-Speech API
    const ttsResponse = await fetch('https://texttospeech.googleapis.com/v1/text:synthesize', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!ttsResponse.ok) {
      const errorData = await ttsResponse.text();
      console.error('Google Cloud TTS API error:', errorData);
      throw new Error(`TTS API request failed: ${ttsResponse.status} ${ttsResponse.statusText}`);
    }

    const ttsResult: TTSResponse = await ttsResponse.json();

    return new Response(JSON.stringify({
      audioContent: ttsResult.audioContent,
      audioConfig: ttsResult.audioConfig,
      voice: ttsResult.voice
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });

  } catch (error: any) {
    console.error('TTS synthesis error:', error);
    return new Response(JSON.stringify({
      error: error.message || 'Failed to synthesize speech'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
};

async function getGoogleAccessToken(serviceAccountKey: string): Promise<string> {
  try {
    const keyData = JSON.parse(serviceAccountKey);

    // Create JWT payload
    const now = Math.floor(Date.now() / 1000);
    const payload = {
      iss: keyData.client_email,
      scope: 'https://www.googleapis.com/auth/cloud-platform',
      aud: 'https://oauth2.googleapis.com/token',
      exp: now + 3600, // 1 hour
      iat: now
    };

    // Create JWT header
    const header = {
      alg: 'RS256',
      typ: 'JWT'
    };

    // Base64 encode header and payload
    const encodedHeader = btoa(JSON.stringify(header)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
    const encodedPayload = btoa(JSON.stringify(payload)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

    // Create signature
    const message = `${encodedHeader}.${encodedPayload}`;
    const signature = await signJWT(message, keyData.private_key);

    const jwt = `${message}.${signature}`;

    // Exchange JWT for access token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: jwt
      })
    });

    if (!tokenResponse.ok) {
      throw new Error(`Failed to get access token: ${tokenResponse.status}`);
    }

    const tokenData = await tokenResponse.json();
    return tokenData.access_token;

  } catch (error: any) {
    console.error('Error getting Google access token:', error);
    throw new Error(`Authentication failed: ${error.message}`);
  }
}

async function signJWT(message: string, privateKey: string): Promise<string> {
  // In Cloudflare Workers, we need to use Web Crypto API for signing
  // This is a simplified implementation - in production, you'd want more robust JWT signing

  // Convert PEM private key to CryptoKey
  const pemKey = privateKey
    .replace(/-----BEGIN PRIVATE KEY-----/, '')
    .replace(/-----END PRIVATE KEY-----/, '')
    .replace(/\s/g, '');

  const keyData = Uint8Array.from(atob(pemKey), c => c.charCodeAt(0));

  const cryptoKey = await crypto.subtle.importKey(
    'pkcs8',
    keyData,
    {
      name: 'RSASSA-PKCS1-v1_5',
      hash: 'SHA-256'
    },
    false,
    ['sign']
  );

  // Sign the message
  const signature = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    cryptoKey,
    new TextEncoder().encode(message)
  );

  // Convert to base64url
  return btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

export const onRequestOptions = async () => {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
};
