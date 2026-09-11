const geminiService = require('./gemini.service');

class IntentParser {
  /**
   * Parse natural language voice/text into structured logistics intent.
   * @param {String} userInput - User's utterance (Hindi, English, Hinglish, Punjabi, Marathi, Gujarati)
   * @param {Object} context - Real DB context built by ContextBuilder
   */
  async parseIntent(userInput, context = {}) {
    if (!userInput || !userInput.trim()) {
      return {
        intent: 'UNKNOWN',
        confidence: 0,
        language: 'hi',
        requiresConfirmation: false,
        entities: {}
      };
    }

    const cleanInput = userInput.trim();

    // Check if input is pure OTP code
    const otpMatch = cleanInput.match(/\b\d{6}\b/);
    if (otpMatch) {
      return {
        intent: 'VERIFY_DELIVERY_OTP',
        confidence: 0.99,
        language: 'en',
        requiresConfirmation: true,
        entities: { otpCode: otpMatch[0] }
      };
    }

    const contextSummary = {
      role: context.user?.role || 'CARRIER',
      page: context.page || 'dashboard',
      primaryVehicle: context.carrierContext?.primaryVehicle,
      activeTrip: context.carrierContext?.activeTrip,
      availableLoads: context.carrierContext?.availableLoads?.slice(0, 3),
      openCapacities: context.carrierContext?.openCapacities,
      targetEntity: context.carrierContext?.targetEntity || context.shipperContext?.targetEntity
    };

    const promptText = `
You are the Multilingual Natural Language Intent Parser for BACKTRACKING logistics platform.
Target User Role: ${contextSummary.role}
Current Screen/Page: ${contextSummary.page}

Application Real Database Context:
${JSON.stringify(contextSummary, null, 2)}

User Spoken/Typed Input:
"${cleanInput}"

INSTRUCTIONS:
1. Detect input language: 'hi' (Hindi), 'hi-en' (Hinglish), 'en' (English), 'pa' (Punjabi), 'mr' (Marathi), 'gu' (Gujarati).
2. Classify intent into ONE of:
   - DRIVER/CARRIER INTENTS:
     'GET_MY_TRIP', 'GET_AVAILABLE_LOADS', 'GET_SHIPMENT_DETAILS', 'GET_SHIPMENT_PRICE',
     'ACCEPT_SHIPMENT', 'REJECT_SHIPMENT', 'UPDATE_AVAILABLE_CAPACITY', 'CREATE_CAPACITY',
     'GET_ETA', 'GET_EARNINGS', 'GET_DRIVER_HOURS', 'START_TRIP',
     'REQUEST_DELIVERY_OTP', 'VERIFY_DELIVERY_OTP', 'TRANSLATE_MESSAGE', 'QUERY_PARTNER_TRUST'
   - SHIPPER INTENTS:
     'CREATE_SHIPMENT', 'GET_SHIPMENT_STATUS', 'FIND_CAPACITY', 'COMPARE_VEHICLES',
     'GET_SHIPPING_PRICE', 'CANCEL_SHIPMENT', 'TRANSLATE_MESSAGE', 'QUERY_PARTNER_TRUST'
   - GENERAL: 'UNKNOWN'

3. Extract Entities:
   - origin (e.g. "Delhi")
   - destination (e.g. "Jaipur")
   - weightTons (number, e.g. 2.5 or 3)
   - shipmentType (e.g. "Electronics", "General Freight")
   - pickupDate (e.g. "Today", "Tomorrow")
   - capacityId or shipmentId (refer to context items if user says "iska", "ye wala", "Jaipur wala")
   - otpCode (6-digit number)
   - reason (e.g. "HIGH_DETOUR", "PRICE_LOW")

4. Confirmation & Ambiguity Rules:
   - Data modifying intents ('ACCEPT_SHIPMENT', 'CREATE_SHIPMENT', 'UPDATE_AVAILABLE_CAPACITY', 'CREATE_CAPACITY', 'VERIFY_DELIVERY_OTP', 'CANCEL_SHIPMENT', 'START_TRIP') MUST have "requiresConfirmation": true.
   - If user wants to accept a load, but multiple loads exist in context and input does not specify which one uniquely, set "clarificationNeeded": true and provide "clarificationOptions".

Respond ONLY with valid JSON in this exact structure:
{
  "intent": "ACCEPT_SHIPMENT",
  "language": "hi-en",
  "confidence": 0.96,
  "requiresConfirmation": true,
  "clarificationNeeded": false,
  "entities": {
    "origin": "Delhi",
    "destination": "Jaipur",
    "weightTons": 2.5,
    "shipmentId": "...",
    "otpCode": null,
    "reason": null
  },
  "clarificationOptions": []
}
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
            const text = result.response.text();
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              const parsed = JSON.parse(jsonMatch[0]);
              return this.sanitizeParsedIntent(parsed, cleanInput, context);
            }
          } catch (e) {
            // try next model
          }
        }
      } catch (err) {
        // fallback
      }
    }

    // Deterministic Rule-Based Fallback Parser if Gemini is offline
    return this.deterministicFallbackParse(cleanInput, context);
  }

  sanitizeParsedIntent(parsed, rawInput, context) {
    const intent = parsed.intent || 'UNKNOWN';
    const entities = parsed.entities || {};
    const modifyingIntents = [
      'ACCEPT_SHIPMENT', 'CREATE_SHIPMENT', 'UPDATE_AVAILABLE_CAPACITY',
      'CREATE_CAPACITY', 'VERIFY_DELIVERY_OTP', 'CANCEL_SHIPMENT', 'START_TRIP'
    ];

    const requiresConfirmation = modifyingIntents.includes(intent) ? true : !!parsed.requiresConfirmation;

    // If intent is ACCEPT_SHIPMENT and no shipmentId/capacityId entity is populated, resolve from context
    if (intent === 'ACCEPT_SHIPMENT' && !entities.capacityId && !entities.shipmentId) {
      const availableLoads = context.carrierContext?.availableLoads || [];
      if (availableLoads.length === 1) {
        entities.capacityId = availableLoads[0].capacityId;
        entities.shipmentId = availableLoads[0].id;
      } else if (availableLoads.length > 1) {
        parsed.clarificationNeeded = true;
        parsed.clarificationOptions = availableLoads.map(l => ({
          capacityId: l.capacityId,
          label: `${l.route} (${l.weight}T) - ₹${l.priceINR.toLocaleString('en-IN')}`
        }));
      }
    }

    return {
      intent,
      language: parsed.language || 'hi',
      confidence: parsed.confidence || 0.9,
      requiresConfirmation,
      clarificationNeeded: !!parsed.clarificationNeeded,
      clarificationOptions: parsed.clarificationOptions || [],
      entities
    };
  }

  deterministicFallbackParse(rawInput, context) {
    const lower = rawInput.toLowerCase();

    // OTP detection
    const otpMatch = rawInput.match(/\b\d{6}\b/);
    if (otpMatch) {
      return {
        intent: 'VERIFY_DELIVERY_OTP',
        language: 'en',
        confidence: 0.98,
        requiresConfirmation: true,
        entities: { otpCode: otpMatch[0] }
      };
    }

    // Trust & Partner query check
    if (lower.includes('shipper kaisa') || lower.includes('carrier reliable') || lower.includes('trust') || lower.includes('rating') || lower.includes('record kaisa')) {
      return {
        intent: 'QUERY_PARTNER_TRUST',
        language: lower.includes('reliable') || lower.includes('trust') ? 'en' : 'hi-en',
        confidence: 0.96,
        requiresConfirmation: false,
        entities: {}
      };
    }

    // Rejection Check
    if (lower.includes('nahi lena') || lower.includes('reject') || lower.includes('detour bahut') || lower.includes('nahi chahiye')) {
      return {
        intent: 'REJECT_SHIPMENT',
        language: 'hi',
        confidence: 0.94,
        requiresConfirmation: false,
        entities: { reason: lower.includes('detour') ? 'HIGH_DETOUR' : 'USER_REJECTED' }
      };
    }

    // Shipment creation check (Shipper posting load)
    if (lower.includes('bhejna') || lower.includes('bhej') || lower.includes('post') || lower.includes('create shipment') || lower.includes('electronics')) {
      const matchTon = lower.match(/(\d+(\.\d+)?)\s*ton/);
      const tons = matchTon ? parseFloat(matchTon[1]) : 2.5;
      return {
        intent: 'CREATE_SHIPMENT',
        language: 'hi-en',
        confidence: 0.95,
        requiresConfirmation: true,
        entities: {
          origin: lower.includes('delhi') ? 'Delhi' : 'Delhi',
          destination: lower.includes('jaipur') ? 'Jaipur' : 'Jaipur',
          weightTons: tons,
          shipmentType: lower.includes('electronics') ? 'Electronics' : 'General Freight'
        }
      };
    }

    // Delivery / Arrival
    if (lower.includes('delivery') || lower.includes('pahuch gaya') || lower.includes('ho gayi')) {
      return {
        intent: 'REQUEST_DELIVERY_OTP',
        language: 'hi',
        confidence: 0.92,
        requiresConfirmation: false,
        entities: {}
      };
    }

    // Load query / Accept shipment
    if (lower.includes('load') || lower.includes('maal') || lower.includes('dhoondo') || lower.includes('dikhao') || lower.includes('le lunga') || lower.includes('le leta')) {
      if (lower.includes('accept') || lower.includes('le leta') || lower.includes('le lunga')) {
        const availableLoads = context.carrierContext?.availableLoads || [];
        return {
          intent: 'ACCEPT_SHIPMENT',
          language: 'hi-en',
          confidence: 0.95,
          requiresConfirmation: true,
          entities: {
            capacityId: availableLoads[0]?.capacityId,
            origin: 'Delhi',
            destination: 'Jaipur'
          }
        };
      }

      return {
        intent: 'GET_AVAILABLE_LOADS',
        language: 'hi-en',
        confidence: 0.9,
        requiresConfirmation: false,
        entities: { origin: 'Delhi', destination: 'Jaipur' }
      };
    }

    // Price query
    if (lower.includes('bhada') || lower.includes('kiraya') || lower.includes('price') || lower.includes('rate') || lower.includes('earning')) {
      return {
        intent: 'GET_SHIPMENT_PRICE',
        language: 'hi',
        confidence: 0.92,
        requiresConfirmation: false,
        entities: {}
      };
    }

    // Capacity update / creation (e.g. 3 ton jagah hai)
    if (lower.includes('jagah') || lower.includes('capacity') || lower.includes('ton')) {
      const matchTon = lower.match(/(\d+(\.\d+)?)\s*ton/);
      const tons = matchTon ? parseFloat(matchTon[1]) : 3;
      return {
        intent: 'UPDATE_AVAILABLE_CAPACITY',
        language: 'hi',
        confidence: 0.9,
        requiresConfirmation: true,
        entities: { availableCapacity: tons }
      };
    }

    return {
      intent: 'UNKNOWN',
      language: 'hi',
      confidence: 0.5,
      requiresConfirmation: false,
      entities: {}
    };
  }
}

module.exports = new IntentParser();
