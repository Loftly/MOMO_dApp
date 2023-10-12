function Betting({ web3, contract, updateUserData }) {
    const [choice, setChoice] = useState(null);
    const [betAmount, setBetAmount] = useState('');
    const [potentialWinnings, setPotentialWinnings] = useState(null);
    const [message, setMessage] = useState('');

    const calculatePotentialWinnings = (amount) => {
        // Here, I'm assuming the house takes a 2% edge, so potential winnings are 98% of the bet.
        // Adjust as needed based on your contract's actual logic.
        return (amount * 0.98).toFixed(2);
    };

    const handleBetAmountChange = (e) => {
        setBetAmount(e.target.value);
        setPotentialWinnings(calculatePotentialWinnings(e.target.value));
    };

    const placeBet = async () => {
        if (!web3 || !contract) {
            setMessage('DApp not connected.');
            return;
        }

        const accounts = await web3.eth.getAccounts();
        try {
            setMessage('Placing bet...');
            await contract.methods.placeBet(choice, web3.utils.toWei(betAmount, 'ether')).send({
                from: accounts[0]
            });

            // Update user data and reset message after bet is placed
            updateUserData();
            setMessage('Bet placed successfully!');

        } catch (error) {
            setMessage(`Error: ${error.message}`);
        }
    };

    return (
        <div className="betting">
            <h2>Betting</h2>
            <p>
                Choose: 
                <button onClick={() => setChoice('HEADS')}>HEADS</button>
                <button onClick={() => setChoice('TAILS')}>TAILS</button>
            </p>
            <input
                type="number"
                placeholder="Amount to bet"
                value={betAmount}
                onChange={handleBetAmountChange}
            />
            <p>Potential Winnings: {potentialWinnings} MOMO</p>
            <button onClick={placeBet}>Place Bet</button>
            {message && <p>{message}</p>}
        </div>
    );
}
