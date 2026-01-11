// Native fetch is available in Node.js 18+

const KIE_API_KEY = 'f15eab3c5dcaba7ac459dae22121f966';
const KIE_API_URL = 'https://api.kie.ai/api/v1/gpt4o-image';

async function testGeneration() {
    try {
        console.log('--- STARTING DEBUG TEST ---');
        console.log('1. Creating Task...');

        const createResponse = await fetch(`${KIE_API_URL}/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${KIE_API_KEY}`
            },
            body: JSON.stringify({
                prompt: "a majestic lion",
                size: "1:1",
                nVariants: 1,
                isEnhance: true
            })
        });

        const createData = await createResponse.json();
        console.log('Create Response:', JSON.stringify(createData, null, 2));

        if (createData.code !== 200 || !createData.data.taskId) {
            console.error('Failed to create task');
            return;
        }

        const taskId = createData.data.taskId;
        console.log(`\n2. Polling Task ID: ${taskId}`);

        let attempts = 0;
        while (attempts < 30) {
            attempts++;
            await new Promise(resolve => setTimeout(resolve, 2000));

            console.log(`\n--- Attempt ${attempts} ---`);
            const statusResponse = await fetch(`${KIE_API_URL}/record-info?taskId=${taskId}`, {
                headers: { 'Authorization': `Bearer ${KIE_API_KEY}` }
            });

            const statusData = await statusResponse.json();
            console.log('Status Response:', JSON.stringify(statusData, null, 2));

            const taskData = statusData.data || {};

            if (taskData.successFlag === 1) {
                console.log('\n✅ SUCCESS FLAG DETECTED!');
                console.log('Result URLs:', taskData.response?.result_urls);
                if (taskData.response?.result_urls?.length > 0) {
                    console.log('🎉 FINAL IMAGE URL:', taskData.response.result_urls[0]);
                } else {
                    console.error('❌ Success flag is 1, but result_urls is empty!');
                }
                return;
            } else if (taskData.successFlag === 2) {
                console.error('\n❌ FAILED FLAG DETECTED:', taskData.errorMessage);
                return;
            }
        }

    } catch (error) {
        console.error('CRITICAL ERROR:', error);
    }
}

testGeneration();
