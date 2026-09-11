const geminiService = require('./gemini.service');

class LanguageService {
  constructor() {
    this.slangDictionary = {
      // Rates / Prices
      'bhada': 'price',
      'bhadaa': 'price',
      'kiraya': 'price',
      'faare': 'price',
      'paise': 'price',
      'rate': 'price',
      'payment': 'price',
      'bhav': 'price',

      // Shipments / Cargo
      'maal': 'shipment',
      'saaman': 'shipment',
      'load': 'shipment',
      'gaddi da load': 'shipment',
      'cargo': 'shipment',

      // Vehicles / Trucks
      'gaddi': 'vehicle',
      'gaadi': 'vehicle',
      'lorry': 'vehicle',
      'truck': 'vehicle',
      'trolla': 'vehicle',

      // Capacity / Space
      'jagah': 'capacity',
      'space': 'capacity',
      'kapacity': 'capacity',
      'wazan': 'weight',
      'weight': 'weight'
    };
  }

  /**
   * Translate inter-party messages (Driver <-> Shipper)
   * @param {String} text - Message to translate
   * @param {String} targetRole - 'SHIPPER' or 'DRIVER'
   * @param {String} targetLanguage - e.g. 'hi', 'en', 'pa', 'mr', 'gu'
   */
  async translateInterPartyMessage(text, targetRole = 'SHIPPER', targetLanguage = 'en') {
    if (!text || !text.trim()) return { translatedText: text, originalText: text };

    const promptText = `
You are the Multilingual Translation Bridge for BACKTRACKING logistics platform.
Translate the following logistics message for a ${targetRole} into ${targetLanguage}.

Rules:
1. Preserve exact numbers, times, locations, and factual intent. Do NOT add fabricated information.
2. Adapt tone to be polite and professional for ${targetRole}.
3. Respond ONLY with valid JSON in this format:
{
  "translatedText": "Translated message here",
  "summary": "1-sentence summary",
  "targetLanguage": "${targetLanguage}"
}

Message to translate:
"${text}"
`;

    if (geminiService.genAI) {
      try {
        const modelNames = ['gemini-1.5-flash-latest', 'gemini-1.5-pro', 'gemini-pro'];
        for (const modelName of modelNames) {
          try {
            const model = geminiService.genAI.getGenerativeModel({ model: modelName });
            const result = await Promise.race([
              model.generateContent(promptText),
              new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 4000))
            ]);
            const resText = result.response.text();
            const jsonMatch = resText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              const parsed = JSON.parse(jsonMatch[0]);
              return {
                translatedText: parsed.translatedText,
                summary: parsed.summary,
                originalText: text,
                targetLanguage
              };
            }
          } catch (e) {
            // continue
          }
        }
      } catch (err) {
        // Fallback
      }
    }

    // Deterministic translation fallback if Gemini is offline
    return {
      translatedText: text,
      summary: 'Message relayed',
      originalText: text,
      targetLanguage
    };
  }
}

module.exports = new LanguageService();
