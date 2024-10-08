document.addEventListener('DOMContentLoaded', () => {
    const nlpInput = document.getElementById('nlp-input');
    const processBtn = document.getElementById('process-btn');
    const processedResult = document.getElementById('processed-result');
    const transactionDetails = document.getElementById('transaction-details');
    const executeBtn = document.getElementById('execute-btn');
    const addressInput = document.getElementById('address-input');
    const checkBalanceBtn = document.getElementById('check-balance-btn');
    const balanceResult = document.getElementById('balance-result');

    processBtn.addEventListener('click', async () => {
        const input = nlpInput.value;
        try {
            const response = await fetch('/process', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ input }),
            });
            const data = await response.json();
            processedResult.textContent = JSON.stringify(data, null, 2);
            transactionDetails.textContent = JSON.stringify(data, null, 2);
            executeBtn.style.display = 'block';
        } catch (error) {
            console.error('Error:', error);
            processedResult.textContent = 'Error processing input';
        }
    });

    executeBtn.addEventListener('click', async () => {
        try {
            const response = await fetch('/execute', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: transactionDetails.textContent,
            });
            const result = await response.json();
            alert(result.success ? `Transaction executed successfully. Hash: ${result.tx_hash}` : `Error: ${result.error}`);
        } catch (error) {
            console.error('Error:', error);
            alert('Error executing transaction');
        }
    });

    checkBalanceBtn.addEventListener('click', async () => {
        const address = addressInput.value;
        if (!address) {
            balanceResult.textContent = 'Please enter an address';
            return;
        }

        try {
            const response = await fetch(`/check_balance/${address}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            balanceResult.textContent = `Balance: ${data.balance} RBTC`;
        } catch (error) {
            console.error('Error:', error);
            balanceResult.textContent = 'Error fetching balance. Please try again.';
        }
    });
});
