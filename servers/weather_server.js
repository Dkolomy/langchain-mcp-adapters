const express = require('express');
const router = express.Router();
const { MCPServer } = require('@langchain/mcp-adapters');

/**
 * Creates an MCP server instance with SSE transport
 */
const mcpServer = new MCPServer({
  transport: "sse",
  // Additional config options can be added here
});

// Create Express app instance
const app = express();
app.use(express.json());
app.use('/', router);

/**
 * Handles SSE weather forecast requests
 * @mcp.tool('mcp_weather_sse')
 * @param {Object} req Express request object
 * @param {Object} res Express response object
 */
async function handleWeatherSSE(req, res) {
  // Set headers for SSE
  res.writeHead(200, {
    'Content-Type': 'text/event-stream', 
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });

  // Initialize MCP SSE connection
  const sseConnection = await mcpServer.createSSEConnection(req, res);

  // Keep connection open
  const intervalId = setInterval(() => {
    // Send weather data periodically through MCP SSE
    sseConnection.send({
      temperature: Math.round(Math.random() * 30),
      conditions: "Sunny", 
      timestamp: new Date().toISOString()
    });
  }, 5000);

  // Handle client disconnect
  req.on('close', () => {
    clearInterval(intervalId);
    sseConnection.close();
  });
}

// Register route for SSE weather endpoint
router.get('/mcp_weather_sse', handleWeatherSSE);

// Start server on port 8082
const PORT = 8082;
app.listen(PORT, () => {
  console.log(`Weather server running on port ${PORT}`);
});

module.exports = router;
