import { describe, it, expect } from 'vitest';

// Meus casos de teste
describe("Matemática básica", () => {
    // Meus cenários de teste
    it("Soma 2 + 2", () => {
        // Fala sobre o que eu espero
        expect(2 + 2).toBe(4);
    })

    it("Multipicação 3 * 3", () => {
        expect(3 * 3).toBe(9);
    })
})