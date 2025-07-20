const express = require('express');
const router = express.Router();
const { MCPServer } = require('@langchain/mcp-adapters');

// MCP Math Tools
const mcpServer = new MCPServer({
  // Configure server without SSE transport
});

// Create Express app instance
const app = express();
app.use(express.json());
app.use('/', router);

/**
 * Adds two numbers together
 * @mcp.tool('mcp_math_add')
 * @param {Object} params Parameters object
 * @param {number} params.a First number to add
 * @param {number} params.b Second number to add
 * @returns {Object} Result object containing the sum
 */
async function mcpMathAdd(params) {
  try {
    const { a, b } = params;
    
    if (typeof a !== 'number' || typeof b !== 'number') {
      throw new Error('Both parameters must be numbers');
    }

    return {
      result: a + b
    };
  } catch (error) {
    console.error('Error in mcpMathAdd:', error);
    throw error;
  }
}

/**
 * Multiplies two numbers together
 * @mcp.tool('mcp_math_multiply')
 * @param {Object} params Parameters object  
 * @param {number} params.a First number to multiply
 * @param {number} params.b Second number to multiply
 * @returns {Object} Result object containing the product
 */
async function mcpMathMultiply(params) {
  try {
    const { a, b } = params;

    if (typeof a !== 'number' || typeof b !== 'number') {
      throw new Error('Both parameters must be numbers');
    }

    return {
      result: a * b
    };
  } catch (error) {
    console.error('Error in mcpMathMultiply:', error);
    throw error;
  }
}

// Register routes
router.post('/mcp_math_add', async (req, res) => {
  try {
    const result = await mcpMathAdd(req.body);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/mcp_math_multiply', async (req, res) => {
  try {
    const result = await mcpMathMultiply(req.body);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Start server on port 8081
const PORT = 8081;
app.listen(PORT, () => {
  console.log(`Math server running on port ${PORT}`);
});

module.exports = router;
