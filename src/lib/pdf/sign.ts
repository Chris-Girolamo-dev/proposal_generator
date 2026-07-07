import { createHmac, timingSafeEqual } from "crypto";

// Short-lived signed tokens let the PDF renderer (a cookie-less headless browser)
// fetch one specific proposal's print view without exposing it as a public URL.
const TOKEN_TTL_MS = 60_000;

function secret(): string {
  const s = process.env.PDF_SIGNING_SECRET;
  if (!s) throw new Error("PDF_SIGNING_SECRET is not set");
  return s;
}

export function signProposalToken(proposalId: string): string {
  const expires = Date.now() + TOKEN_TTL_MS;
  const payload = `${proposalId}.${expires}`;
  const sig = createHmac("sha256", secret()).update(payload).digest("hex");
  return `${expires}.${sig}`;
}

export function verifyProposalToken(proposalId: string, token: string | null): boolean {
  if (!token) return false;
  const [expiresStr, sig] = token.split(".");
  const expires = Number(expiresStr);
  if (!expires || !sig || Date.now() > expires) return false;

  const payload = `${proposalId}.${expires}`;
  const expectedSig = createHmac("sha256", secret()).update(payload).digest("hex");

  const a = Buffer.from(sig);
  const b = Buffer.from(expectedSig);
  return a.length === b.length && timingSafeEqual(a, b);
}
