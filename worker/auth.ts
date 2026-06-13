export async function verifyTelegramAuth(initData: string, token: string): Promise<boolean> {
  const urlParams = new URLSearchParams(initData);
  const hash = urlParams.get("hash");
  if (!hash) return false;
  
  urlParams.delete("hash");
  urlParams.sort();
  
  let dataCheckString = "";
  for (const [key, value] of urlParams.entries()) {
    dataCheckString += `${key}=${value}\n`;
  }
  dataCheckString = dataCheckString.slice(0, -1);

  const encoder = new TextEncoder();
  const secretKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode("WebAppData"),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  
  const secret = await crypto.subtle.sign("HMAC", secretKey, encoder.encode(token));
  const signatureKey = await crypto.subtle.importKey(
    "raw",
    secret,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  
  const signature = await crypto.subtle.sign("HMAC", signatureKey, encoder.encode(dataCheckString));
  const hexSignature = Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
    
  return hexSignature === hash;
}
