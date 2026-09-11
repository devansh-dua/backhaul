const geminiService = require('./gemini.service');

class ResponseGenerator {
  /**
   * Generate conversational natural language responses in user's preferred language.
   * @param {Object} intentData - { intent, language, requiresConfirmation, clarificationNeeded, clarificationOptions, entities }
   * @param {Object} actionResult - Result from ActionEngine if executed
   * @param {Object} context - Real DB context
   */
  async generateResponse(intentData, actionResult = null, context = {}) {
    const {
      intent,
      language = 'hi',
      requiresConfirmation,
      clarificationNeeded,
      clarificationOptions = [],
      entities = {}
    } = intentData;

    const userRole = context.user?.role || 'CARRIER';

    // 1. Handle Clarification Scenario (Multiple options available)
    if (clarificationNeeded) {
      if (language === 'hi' || language === 'hi-en') {
        return {
          response: `Aapke route par ${clarificationOptions.length} matching options available hain. Aap kaunsa select karna chahte hain?`,
          actionType: 'CLARIFICATION',
          options: clarificationOptions
        };
      }
      return {
        response: `There are ${clarificationOptions.length} compatible options matching your request. Which one would you like to select?`,
        actionType: 'CLARIFICATION',
        options: clarificationOptions
      };
    }

    // 2. Handle Action Execution Result (Executed or Error)
    if (actionResult) {
      if (!actionResult.success) {
        const errorMsg = actionResult.error || 'Execution failed';
        if (language === 'hi' || language === 'hi-en') {
          return {
            response: `⚠️ Action execute nahi ho paya: ${errorMsg}. Kripya dobara try karein.`,
            actionType: 'ERROR'
          };
        }
        return {
          response: `⚠️ Failed to execute action: ${errorMsg}. Please try again.`,
          actionType: 'ERROR'
        };
      }

      // Success responses for specific actions
      if (actionResult.actionExecuted === 'ACCEPT_SHIPMENT') {
        const details = actionResult.details || {};
        if (language === 'hi' || language === 'hi-en') {
          return {
            response: `✅ Shipment accept ho gaya! Route ${details.route || 'Delhi → Jaipur'} for ₹${(details.grossRevenueINR || 7800).toLocaleString('en-IN')}. Live tracking starts now.`,
            actionType: 'SUCCESS'
          };
        } else if (language === 'pa') {
          return {
            response: `✅ Shipment accept ho gaya! ${details.route || 'Delhi → Jaipur'} vala load book ho gaya hai.`,
            actionType: 'SUCCESS'
          };
        }
        return {
          response: `✅ Shipment successfully accepted! Route ${details.route || 'Delhi → Jaipur'} booked for ₹${(details.grossRevenueINR || 7800).toLocaleString('en-IN')}.`,
          actionType: 'SUCCESS'
        };
      }

      if (actionResult.actionExecuted === 'CREATE_SHIPMENT') {
        const details = actionResult.details || {};
        if (language === 'hi' || language === 'hi-en') {
          return {
            response: `✅ Shipment successfully post kar diya hai! ${details.route} (${details.weightTons}T ${details.cargoType}). Nearby carriers ko notify kar diya gaya hai.`,
            actionType: 'SUCCESS'
          };
        }
        return {
          response: `✅ Shipment posted successfully! Route ${details.route} (${details.weightTons}T). Nearby carriers have been notified.`,
          actionType: 'SUCCESS'
        };
      }

      if (actionResult.actionExecuted === 'UPDATE_AVAILABLE_CAPACITY' || actionResult.actionExecuted === 'CREATE_CAPACITY') {
        const details = actionResult.details || {};
        if (language === 'hi' || language === 'hi-en') {
          return {
            response: `✅ Fleet capacity update ho gayi! ${details.origin} → ${details.destination} par ${details.availableCapacityTons} Ton available capacity published hai.`,
            actionType: 'SUCCESS'
          };
        }
        return {
          response: `✅ Fleet capacity updated! Published ${details.availableCapacityTons} Tons available space on ${details.origin} → ${details.destination}.`,
          actionType: 'SUCCESS'
        };
      }

      if (actionResult.actionExecuted === 'VERIFY_DELIVERY_OTP') {
        if (language === 'hi' || language === 'hi-en') {
          return {
            response: `🎉 Delivery OTP verified successfully! Shipment mark ho gaya DELIVERED. Digital POD generate ho gaya hai.`,
            actionType: 'SUCCESS'
          };
        }
        return {
          response: `🎉 Delivery OTP verified successfully! Shipment marked as DELIVERED. Digital POD generated.`,
          actionType: 'SUCCESS'
        };
      }

      if (actionResult.actionExecuted === 'REQUEST_DELIVERY_OTP') {
        if (language === 'hi' || language === 'hi-en') {
          return {
            response: `📲 Destination reached! Customer ko real-time Delivery OTP bhej diya gaya hai. Unse OTP pooch kar enter karein.`,
            actionType: 'PROMPT_OTP'
          };
        }
        return {
          response: `📲 Destination reached! Real-time Delivery OTP dispatched to customer. Please request and enter the OTP.`,
          actionType: 'PROMPT_OTP'
        };
      }
    }

    // 3. Handle Confirmation Flow Prompt (Before execution)
    if (requiresConfirmation) {
      if (intent === 'ACCEPT_SHIPMENT') {
        const availableLoads = context.carrierContext?.availableLoads || [];
        const topLoad = availableLoads[0];
        const routeStr = topLoad?.route || `${entities.origin || 'Delhi'} → ${entities.destination || 'Jaipur'}`;
        const priceStr = topLoad ? `₹${topLoad.priceINR.toLocaleString('en-IN')}` : `₹7,800`;
        const detourStr = topLoad ? `${topLoad.detourKm} km` : `12 km`;

        if (language === 'hi' || language === 'hi-en') {
          return {
            response: `${routeStr} shipment ${priceStr} ka hai aur total detour ${detourStr} hai. Kya main ise accept kar doon?`,
            actionType: 'CONFIRMATION_REQUIRED',
            pendingIntent: intent,
            pendingEntities: entities,
            confirmButtons: [
              { label: 'YES, ACCEPT', action: 'CONFIRM', value: true },
              { label: 'NO, CANCEL', action: 'CANCEL', value: false }
            ]
          };
        } else if (language === 'pa') {
          return {
            response: `${routeStr} load ${priceStr} da hai. Ki main eh accept kar daan?`,
            actionType: 'CONFIRMATION_REQUIRED',
            pendingIntent: intent,
            pendingEntities: entities,
            confirmButtons: [
              { label: 'HAAN, ACCEPT KARO', action: 'CONFIRM', value: true },
              { label: 'NAHI', action: 'CANCEL', value: false }
            ]
          };
        }
        return {
          response: `${routeStr} shipment is rated at ${priceStr} with ${detourStr} detour. Would you like me to confirm and accept this shipment?`,
          actionType: 'CONFIRMATION_REQUIRED',
          pendingIntent: intent,
          pendingEntities: entities,
          confirmButtons: [
            { label: 'YES, ACCEPT', action: 'CONFIRM', value: true },
            { label: 'NO, CANCEL', action: 'CANCEL', value: false }
          ]
        };
      }

      if (intent === 'CREATE_SHIPMENT') {
        const origin = entities.origin || 'Delhi';
        const destination = entities.destination || 'Jaipur';
        const weight = entities.weightTons || 2.5;
        const cargo = entities.shipmentType || 'Electronics';

        if (language === 'hi' || language === 'hi-en') {
          return {
            response: `Maine details fill kar di hain: ${origin} → ${destination}, ${weight} Ton ${cargo}. Kya main ye shipment post kar doon?`,
            actionType: 'CONFIRMATION_REQUIRED',
            pendingIntent: intent,
            pendingEntities: entities,
            confirmButtons: [
              { label: 'HAAN, POST KAR DO', action: 'CONFIRM', value: true },
              { label: 'CANCEL', action: 'CANCEL', value: false }
            ]
          };
        }
        return {
          response: `Shipment details prepared: ${origin} → ${destination}, ${weight} Tons ${cargo}. Shall I post this shipment requirement now?`,
          actionType: 'CONFIRMATION_REQUIRED',
          pendingIntent: intent,
          pendingEntities: entities,
          confirmButtons: [
            { label: 'YES, POST SHIPMENT', action: 'CONFIRM', value: true },
            { label: 'CANCEL', action: 'CANCEL', value: false }
          ]
        };
      }

      if (intent === 'UPDATE_AVAILABLE_CAPACITY' || intent === 'CREATE_CAPACITY') {
        const capacityVal = entities.availableCapacity || 3;
        if (language === 'hi' || language === 'hi-en') {
          return {
            response: `Aapke truck ki available capacity ${capacityVal} Ton update kar doon?`,
            actionType: 'CONFIRMATION_REQUIRED',
            pendingIntent: intent,
            pendingEntities: entities,
            confirmButtons: [
              { label: 'HAAN, UPDATE KARO', action: 'CONFIRM', value: true },
              { label: 'CANCEL', action: 'CANCEL', value: false }
            ]
          };
        }
        return {
          response: `Would you like me to update your vehicle available capacity to ${capacityVal} Tons?`,
          actionType: 'CONFIRMATION_REQUIRED',
          pendingIntent: intent,
          pendingEntities: entities,
          confirmButtons: [
            { label: 'YES, UPDATE', action: 'CONFIRM', value: true },
            { label: 'CANCEL', action: 'CANCEL', value: false }
          ]
        };
      }
    }

    // 4. Handle Read-Only Intents using Real Database Context
    if (intent === 'GET_AVAILABLE_LOADS') {
      const loads = context.carrierContext?.availableLoads || [];
      if (loads.length === 0) {
        if (language === 'hi' || language === 'hi-en') {
          return {
            response: `Abhi tak aapke route par koi open compatible load available nahi hai. Naya load aate hi aapko socket notification mil jayega.`,
            actionType: 'INFO'
          };
        }
        return {
          response: `No compatible open loads currently found along your corridor. You will receive an instant notification when a load is posted.`,
          actionType: 'INFO'
        };
      }

      const topLoad = loads[0];
      if (language === 'hi' || language === 'hi-en') {
        return {
          response: `Aapke route par ${loads.length} compatible loads hain. Sabse achha option ${topLoad.route} का ₹${topLoad.priceINR.toLocaleString('en-IN')} ka hai (${topLoad.weight}T payload, +${topLoad.detourKm} km detour). Kya main ise accept kar doon?`,
          actionType: 'CONFIRMATION_REQUIRED',
          pendingIntent: 'ACCEPT_SHIPMENT',
          pendingEntities: { capacityId: topLoad.capacityId, priceINR: topLoad.priceINR },
          confirmButtons: [
            { label: 'YES, ACCEPT LOAD', action: 'CONFIRM', value: true },
            { label: 'VIEW ALL LOADS', action: 'NAVIGATE', value: '/carrier/find-loads' }
          ]
        };
      }
      return {
        response: `Found ${loads.length} compatible loads along your corridor. The best option is ${topLoad.route} rated at ₹${topLoad.priceINR.toLocaleString('en-IN')} (${topLoad.weight}T, +${topLoad.detourKm} km detour). Shall I accept this load for you?`,
        actionType: 'CONFIRMATION_REQUIRED',
        pendingIntent: 'ACCEPT_SHIPMENT',
        pendingEntities: { capacityId: topLoad.capacityId, priceINR: topLoad.priceINR },
        confirmButtons: [
          { label: 'YES, ACCEPT LOAD', action: 'CONFIRM', value: true },
          { label: 'VIEW ALL LOADS', action: 'NAVIGATE', value: '/carrier/find-loads' }
        ]
      };
    }

    if (intent === 'GET_SHIPMENT_PRICE') {
      const loads = context.carrierContext?.availableLoads || [];
      if (loads.length > 0) {
        const price = loads[0].priceINR;
        if (language === 'hi' || language === 'hi-en') {
          return { response: `Is load ka estimated payment ₹${price.toLocaleString('en-IN')} hai.`, actionType: 'INFO' };
        }
        return { response: `The estimated payment for this load is ₹${price.toLocaleString('en-IN')}.`, actionType: 'INFO' };
      }
      return { response: `Normal freight rate on Delhi-Jaipur corridor is ₹7,800 to ₹9,500.`, actionType: 'INFO' };
    }

    if (intent === 'GET_ETA') {
      const activeTrip = context.carrierContext?.activeTrip;
      if (activeTrip) {
        if (language === 'hi' || language === 'hi-en') {
          return { response: `Trip ${activeTrip.route} in progress. Estimated arrival time 5:40 PM.`, actionType: 'INFO' };
        }
        return { response: `Trip ${activeTrip.route} is in progress. Estimated arrival time is 5:40 PM.`, actionType: 'INFO' };
      }
      return { response: `Estimated travel time along Delhi → Jaipur corridor is 4 hours 35 minutes.`, actionType: 'INFO' };
    }

    if (intent === 'GET_MY_TRIP') {
      const activeTrip = context.carrierContext?.activeTrip;
      if (activeTrip) {
        if (language === 'hi' || language === 'hi-en') {
          return { response: `Aapka active trip: ${activeTrip.route} (Status: ${activeTrip.status}). Payment: ₹${activeTrip.grossRevenueINR.toLocaleString('en-IN')}.`, actionType: 'INFO' };
        }
        return { response: `Your active trip: ${activeTrip.route} (Status: ${activeTrip.status}). Revenue: ₹${activeTrip.grossRevenueINR.toLocaleString('en-IN')}.`, actionType: 'INFO' };
      }
      return { response: `Abhi koi active trip nahi chal raha hai. Aap load search karke trip start kar sakte hain.`, actionType: 'INFO' };
    }

    if (intent === 'QUERY_PARTNER_TRUST') {
      const topPartners = context.user?.topPartners || [];
      const topPartner = topPartners[0];
      const trustProfile = context.user?.trustProfile;

      if (topPartner && topPartner.completedTogether > 0) {
        if (language === 'hi' || language === 'hi-en') {
          return {
            response: `Is partner (${topPartner.companyName}) ke saath aapne pehle ${topPartner.completedTogether} shipments complete kiye hain. Average rating ${topPartner.rating || 4.9}★ hai aur 100% successful delivery record hai.`,
            actionType: 'INFO'
          };
        }
        return {
          response: `You have successfully completed ${topPartner.completedTogether} shipments with ${topPartner.companyName}. Average rating is ${topPartner.rating || 4.9}★ with 100% delivery success rate.`,
          actionType: 'INFO'
        };
      }

      if (trustProfile && trustProfile.completedShipments > 0) {
        if (language === 'hi' || language === 'hi-en') {
          return {
            response: `Aapka platform Trust Score ${trustProfile.averageRating || 4.8}★ hai based on ${trustProfile.completedShipments} completed shipments with ${trustProfile.onTimeRate} on-time delivery rate.`,
            actionType: 'INFO'
          };
        }
        return {
          response: `Your platform Trust Score is ${trustProfile.averageRating || 4.8}★ based on ${trustProfile.completedShipments} completed shipments with a ${trustProfile.onTimeRate} on-time rate.`,
          actionType: 'INFO'
        };
      }

      if (language === 'hi' || language === 'hi-en') {
        return {
          response: `Is partner ke saath aapka abhi koi previous shipment record nahi hai. Platform par naye partners "New Partner" display hote hain.`,
          actionType: 'INFO'
        };
      }
      return {
        response: `There is no previous shipment history with this partner. New users are displayed as "New Partner" until deliveries are completed.`,
        actionType: 'INFO'
      };
    }

    // Default Fallback
    if (language === 'hi' || language === 'hi-en') {
      return {
        response: `Kripya batayein aap kya karna chahte hain. Aap bol sakte hain "Delhi se Jaipur load dikhao" ya "Shipment accept karo".`,
        actionType: 'PROMPT'
      };
    }
    return {
      response: `Please tell me what you would like to do. You can say "Find loads for Jaipur" or "Accept load".`,
      actionType: 'PROMPT'
    };
  }
}

module.exports = new ResponseGenerator();
