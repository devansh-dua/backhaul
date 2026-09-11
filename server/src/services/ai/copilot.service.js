const contextBuilder = require('./contextBuilder');
const intentParser = require('./intentParser');
const actionEngine = require('./actionEngine');
const responseGenerator = require('./responseGenerator');
const AIInteraction = require('../../models/AIInteraction');

class CopilotService {
  /**
   * Main entry point for BACKTRACKING AI Copilot
   * @param {Object} payload - { message, language, context, inputType, confirmAction, pendingIntent, pendingEntities }
   * @param {String} userId - Authenticated User ID
   * @param {Object} io - Socket.IO instance
   */
  async processCopilotRequest(payload = {}, userId, io = null) {
    const {
      message = '',
      language = 'hi',
      context: clientContext = {},
      inputType = 'TEXT',
      confirmAction = false,
      pendingIntent,
      pendingEntities
    } = payload;

    // 1. Build Real Database Context for authenticated user
    const dbContext = await contextBuilder.buildContext(userId, payload.role, clientContext);

    // 2. Handle Action Confirmation Execution (User clicked [YES, ACCEPT] or confirmed verbally)
    if (confirmAction && pendingIntent) {
      const intentData = {
        intent: pendingIntent,
        entities: pendingEntities || {},
        language
      };

      const actionResult = await actionEngine.executeAction(intentData, userId, dbContext, io);
      const responseData = await responseGenerator.generateResponse(intentData, actionResult, dbContext);

      // Log interaction
      await this.logInteraction({
        user: userId,
        role: dbContext.user?.role,
        language,
        inputType,
        rawInput: message || `CONFIRM_${pendingIntent}`,
        intent: pendingIntent,
        confidence: 1.0,
        actionExecuted: actionResult.actionExecuted,
        status: actionResult.success ? 'EXECUTED' : 'FAILED',
        contextSnapshot: { clientContext }
      });

      return {
        success: actionResult.success,
        intent: pendingIntent,
        language,
        confidence: 1.0,
        requiresConfirmation: false,
        response: responseData.response,
        actionType: responseData.actionType,
        actionDetails: actionResult.details || null
      };
    }

    // 3. Parse Natural Language Voice/Text Input
    const intentData = await intentParser.parseIntent(message, dbContext);

    // Override language if explicitly supplied
    if (language && language !== 'auto') {
      intentData.language = language;
    }

    // 4. Check if Intent requires confirmation or clarification BEFORE executing
    if (intentData.requiresConfirmation || intentData.clarificationNeeded) {
      const responseData = await responseGenerator.generateResponse(intentData, null, dbContext);

      await this.logInteraction({
        user: userId,
        role: dbContext.user?.role,
        language: intentData.language,
        inputType,
        rawInput: message,
        intent: intentData.intent,
        confidence: intentData.confidence,
        requiresConfirmation: true,
        status: 'PENDING_CONFIRMATION',
        contextSnapshot: { clientContext }
      });

      return {
        success: true,
        intent: intentData.intent,
        language: intentData.language,
        confidence: intentData.confidence,
        requiresConfirmation: intentData.requiresConfirmation,
        clarificationNeeded: intentData.clarificationNeeded,
        clarificationOptions: intentData.clarificationOptions,
        response: responseData.response,
        actionType: responseData.actionType,
        confirmButtons: responseData.confirmButtons || null,
        pendingEntities: intentData.entities
      };
    }

    // 5. Execute Action directly if read-only or no confirmation needed
    let actionResult = null;
    if (intentData.intent !== 'UNKNOWN') {
      actionResult = await actionEngine.executeAction(intentData, userId, dbContext, io);
    }

    // 6. Generate Conversational Natural Language Response
    const responseData = await responseGenerator.generateResponse(intentData, actionResult, dbContext);

    await this.logInteraction({
      user: userId,
      role: dbContext.user?.role,
      language: intentData.language,
      inputType,
      rawInput: message,
      intent: intentData.intent,
      confidence: intentData.confidence,
      actionExecuted: actionResult?.actionExecuted,
      status: 'EXECUTED',
      contextSnapshot: { clientContext }
    });

    return {
      success: true,
      intent: intentData.intent,
      language: intentData.language,
      confidence: intentData.confidence,
      requiresConfirmation: false,
      response: responseData.response,
      actionType: responseData.actionType,
      confirmButtons: responseData.confirmButtons || null,
      actionDetails: actionResult?.details || null
    };
  }

  async logInteraction(logData) {
    try {
      await AIInteraction.create(logData);
    } catch (err) {
      // Non-blocking log write
    }
  }
}

module.exports = new CopilotService();
