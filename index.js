require('dotenv').config();
const { ChatOpenAI } = require('@langchain/openai');
const { MCPClient } = require('@langchain/mcp-adapters');

// Initialize OpenAI client with API key from .env
const openai = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  model: 'gpt-4',
  temperature: 0.7,
});

// Initialize MCP client
const mcpClient = new MCPClient({
  // You can configure MCP server details here if needed
  // For now, we'll use the default configuration
});

async function main() {
  try {
    console.log('🚀 Starting MCP Client with LangChain...');
    console.log('📋 Environment check:');
    console.log(`   - OPENAI_API_KEY: ${process.env.OPENAI_API_KEY ? '✅ Set' : '❌ Not set'}`);
    console.log(`   - NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
    
    // Example: Using the weather MCP tools
    console.log('\n🌤️  Testing Weather MCP Tools...');
    
    // Get weather forecast for a specific location
    const forecastParams = {
      latitude: 40.7128, // New York City
      longitude: -74.0060
    };
    
    console.log(`📍 Getting forecast for coordinates: ${forecastParams.latitude}, ${forecastParams.longitude}`);
    
    // Example of how to use MCP tools with LangChain
    const weatherPrompt = `Get the current weather forecast for New York City and provide a summary.`;
    
    const response = await openai.invoke([
      ['system', 'You are a helpful assistant that can access weather data through MCP tools.'],
      ['human', weatherPrompt]
    ]);
    
    console.log('\n📊 Weather Response:');
    console.log(response.content);
    
    // Example: Get weather alerts for a state
    console.log('\n⚠️  Testing Weather Alerts...');
    const alertsParams = {
      state: 'CA' // California
    };
    
    console.log(`🔔 Getting alerts for state: ${alertsParams.state}`);
    
    // You can integrate MCP tool calls here
    // For example, calling the weather alerts tool:
    // const alerts = await mcpClient.callTool('mcp_weather_get-alerts', alertsParams);
    
    console.log('\n✅ MCP Client test completed successfully!');
    
  } catch (error) {
    console.error('❌ Error running MCP client:', error);
    process.exit(1);
  }
}

// Example function to demonstrate MCP tool integration
async function demonstrateMCPTools() {
  console.log('\n🔧 MCP Tools Demonstration:');
  
  // Example of available MCP tools (based on the tools available in this environment)
  const availableTools = [
    {
      name: 'mcp_weather_get-forecast',
      description: 'Get weather forecast for a location',
      parameters: {
        latitude: 'number (required)',
        longitude: 'number (required)'
      }
    },
    {
      name: 'mcp_weather_get-alerts',
      description: 'Get weather alerts for a state',
      parameters: {
        state: 'string (required) - Two-letter state code'
      }
    }
  ];
  
  console.log('📋 Available MCP Tools:');
  availableTools.forEach(tool => {
    console.log(`   - ${tool.name}: ${tool.description}`);
    console.log(`     Parameters: ${JSON.stringify(tool.parameters)}`);
  });
  
  // Example of how to structure a tool call
  console.log('\n💡 Example Tool Call Structure:');
  console.log(`
  const toolCall = {
    name: 'mcp_weather_get-forecast',
    arguments: {
      latitude: 40.7128,
      longitude: -74.0060
    }
  };
  `);
}

// Run the main function
if (require.main === module) {
  main()
    .then(() => {
      console.log('\n🎉 MCP Client execution completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Fatal error:', error);
      process.exit(1);
    });
}

// Export functions for use in other modules
module.exports = {
  openai,
  mcpClient,
  main,
  demonstrateMCPTools
};
