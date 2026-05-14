"use client";

import Markdown from "@/app/components/Markdown";
import PrevNext from "@/app/components/docs/PrevNext";
import ECCDemo from "@/app/components/live/ECCDemo";

const intro = `
# Error Correction

Rondel uses Reed-Solomon error correction over GF(256) to recover data from damaged or partially obscured codes.

## How It Works

Reed-Solomon (RS) coding adds parity bytes to the encoded data. These parity bytes
allow the decoder to detect and correct errors without knowing which bytes were corrupted.

1. **Encoding:** The data bytes are treated as coefficients of a polynomial over GF(256). The encoder computes \`eccBytes\` parity values by dividing by a generator polynomial.
2. **Decoding:** The decoder computes syndromes from the received data. If any syndrome is non-zero, errors exist. The Berlekamp-Massey algorithm finds the error locator polynomial, Chien search locates the error positions, and Forney's algorithm computes the error magnitudes.

## Correction Capacity

With \`eccBytes\` parity bytes, the decoder can correct up to \`eccBytes / 2\` corrupted bytes.
The tradeoff is data capacity — more parity bytes means fewer bytes available for payload.

| ECC Bytes | Correctable Bytes | Use Case |
|-----------|-------------------|----------|
| \`4\` | 2 | Minimal protection, maximum capacity |
| \`8\` | 4 | Light protection for clean environments |
| \`16\` | 8 | Good balance for most applications |
| \`24\` | 12 | High protection for printed/physical media |
| \`32\` | 16 | Maximum protection, reduced capacity |
`;

const afterDemo = `
## Galois Field Arithmetic

All RS operations are performed in GF(256) — a finite field with 256 elements (one per byte value).
The field uses the primitive polynomial \`0x11D\` (x⁸ + x⁴ + x³ + x² + 1).

Key operations:

- **Addition/Subtraction:** XOR (same operation in GF(2ⁿ))
- **Multiplication:** Log/antilog table lookup — \`a × b = exp[log[a] + log[b]]\`
- **Division:** \`a ÷ b = exp[log[a] - log[b]]\`
- **Polynomial operations:** Multiply, divide, and evaluate polynomials with GF(256) coefficients

## Decoding Algorithm

The RS decoder follows this pipeline:

1. **Syndrome computation** — evaluate the received polynomial at the roots of the generator polynomial. All-zero syndromes mean no errors.
2. **Berlekamp-Massey** — iteratively build the error locator polynomial Λ(x) from the syndromes.
3. **Chien search** — evaluate Λ(x) at all field elements to find the error positions (roots of the locator).
4. **Forney algorithm** — compute the error magnitudes at each located position using the error evaluator polynomial.
5. **Correction** — XOR each error magnitude into the received data at the corresponding position.

## API

\`\`\`typescript
// Reed-Solomon encode — appends parity bytes
rsEncode(data: number[], eccBytes: number): number[]

// Reed-Solomon decode — corrects errors in-place
rsDecode(received: number[], eccBytes: number): number[]
\`\`\`
`;

export default function ErrorCorrectionPage() {
  return (
    <>
      <Markdown>{intro}</Markdown>
      <ECCDemo />
      <Markdown>{afterDemo}</Markdown>
      <PrevNext current="/docs/error-correction" />
    </>
  );
}
