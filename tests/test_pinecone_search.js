/**
 * Test the Pinecone's searchRecords approach with integrated embeddings
 */

const { Pinecone } = require('@pinecone-database/pinecone');
require('dotenv').config({ path: '.env.local' });

async function testWorkingSearch() {
  console.log('🎯 Testing WORKING searchRecords approach...\n');
  
  try {
    const pc = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY
    });
    
    const index = pc.index('portfolio-knowledge-integrated');
    const nsIndex = index.namespace('portfolio-hierarchy');
    
    const testQueries = [
      'Daniel work experience',
      'technical skills Python',
      'projects software development',
      'education background'
    ];
    
    for (const query of testQueries) {
      console.log(`🔍 Testing: "${query}"`);
      
      try {
        const result = await nsIndex.searchRecords({
          query: {
            topK: 3,
            inputs: { text: query }
          }
        });
        
        console.log(`✅ Found ${result.result?.hits?.length || 0} results`);
        
        if (result.result?.hits?.length > 0) {
          result.result.hits.forEach((hit, index) => {
            console.log(`${index + 1}. ID: ${hit._id}`);
            console.log(`   Score: ${hit._score}`);
            console.log(`   Text: ${hit.fields?.text?.substring(0, 150) || 'No text'}...`);
            console.log(`   Section: ${hit.fields?.section_title || 'No section'}`);
            console.log('');
          });
        }
        
      } catch (error) {
        console.error(`❌ Query failed: ${error.message}`);
      }
      
      console.log('-'.repeat(60));
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
if (require.main === module) {
  testWorkingSearch().then(() => {
    console.log('\n🎉 Working search test completed!');
    process.exit(0);
  }).catch(error => {
    console.error('\n💥 Test crashed:', error);
    process.exit(1);
  });
}

module.exports = { testWorkingSearch };