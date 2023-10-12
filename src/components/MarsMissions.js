function MarsMission({ web3, contract, updateUserData }) {
    const [amount, setAmount] = useState('');
    const [message, setMessage] = useState('');

    const startMarsMission = async () => {
        if (!web3 || !contract) {
            setMessage('DApp not connected.');
            return;
        }

        const accounts = await web3.eth.getAccounts();
        try {
            setMessage('Sending your MOMO on a Mars Mission...');
            await contract.methods.startMarsMission(web3.utils.toWei(amount, 'ether')).send({ from: accounts[0] });

            // After the mission, update the user's data and show the outcome
            updateUserData();
            const missionOutcome = await contract.methods.userMissions(accounts[0]).call();
            setMessage(`Mars Mission completed with outcome: ${missionOutcome.outcome}`);

        } catch (error) {
            setMessage(`Error: ${error.message}`);
        }
    };

    return (
        <div className="mars-mission">
            <h2>Mars Mission</h2>
            <div>
                <input
                    type="text"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    placeholder="Amount of MOMO to send"
                />
                <button onClick={startMarsMission}>Start Mars Mission</button>
            </div>
            {message && <p>{message}</p>}
        </div>
    );
}
