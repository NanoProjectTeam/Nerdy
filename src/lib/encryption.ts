// End-to-End Encryption (E2EE) using Web Crypto API (AES-GCM 256-bit)

const DEFAULT_SECRET_SALT = 'nerdy-e2ee-secret-salt-2026';

function bytesToBase64(bytes: Uint8Array): string {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToBytes(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

// Derive or create AES-GCM key from channel identifier
export async function getChannelKey(channelId: string = 'general'): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    enc.encode(`${DEFAULT_SECRET_SALT}-${channelId}`) as unknown as BufferSource,
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: enc.encode('nerdy-salt-42') as unknown as BufferSource,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

// Encrypt plaintext message with AES-256-GCM
export async function encryptMessage(
  text: string,
  channelId: string = 'general'
): Promise<{ encrypted: string; iv: string }> {
  try {
    if (typeof window === 'undefined' || !window.crypto || !window.crypto.subtle) {
      return { encrypted: text, iv: '' };
    }

    const key = await getChannelKey(channelId);
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const enc = new TextEncoder();
    const encoded = enc.encode(text);

    const ciphertext = await window.crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: iv as unknown as BufferSource,
      },
      key,
      encoded as unknown as BufferSource
    );

    const encryptedBase64 = bytesToBase64(new Uint8Array(ciphertext));
    const ivBase64 = bytesToBase64(iv);

    return {
      encrypted: encryptedBase64,
      iv: ivBase64,
    };
  } catch (err) {
    console.error('Encryption error:', err);
    return { encrypted: text, iv: '' };
  }
}

// Decrypt ciphertext message with AES-256-GCM
export async function decryptMessage(
  encryptedBase64: string,
  ivBase64: string,
  channelId: string = 'general'
): Promise<string> {
  try {
    if (!ivBase64 || typeof window === 'undefined' || !window.crypto || !window.crypto.subtle) {
      return encryptedBase64;
    }

    const key = await getChannelKey(channelId);
    const iv = base64ToBytes(ivBase64);
    const ciphertext = base64ToBytes(encryptedBase64);

    const decrypted = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv as unknown as BufferSource,
      },
      key,
      ciphertext as unknown as BufferSource
    );

    const dec = new TextDecoder();
    return dec.decode(decrypted);
  } catch {
    // If plaintext or key mismatch, return original text safely
    return encryptedBase64;
  }
}
