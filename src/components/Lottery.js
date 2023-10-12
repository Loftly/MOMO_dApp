function Lottery({ web3, contract, updateUserData }) {
    const [ticketPrice, setTicketPrice] = useState(null);
    const [totalPotValue, setTotalPotValue] = useState(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!contract) return;

        // Fetch the current ticket price and total pot value from the contract.
        async function fetchLotteryData() {
            try {
                const price = await contract.methods.ticketPriceInMOMO().call();
                const pot = await contract.methods.totalPot().call();
                setTicketPrice(web3.utils.fromWei(price, 'ether'));
                setTotalPotValue(web3.utils.fromWei(pot, 'ether'));
            } catch (error) {
                console.error("Error fetching lottery data:", error);
            }
        }

        fetchLotteryData();
    }, [web3, contract]);

    const buyLotteryTicket = async () => {
        if (!web3 || !contract) {
            setMessage('DApp not connected.');
            return;
        }

        const accounts = await web3.eth.getAccounts();
        try {
            setMessage('Purchasing lottery ticket...');
            await contract.methods.buyTicket().send({
                from: accounts[0],
                value: web3.utils.toWei(ticketPrice, 'ether')
            });

            // Update user data and reset message after purchasing
            updateUserData();
            setMessage('Ticket purchased successfully!');

        } catch (error) {
            setMessage(`Error: ${error.message}`);
        }
    };

    return (
        <div className="lottery">
            <h2>Lottery</h2>
            <p>Ticket Price: {ticketPrice} MOMO</p>
            <p>Total Pot: {totalPotValue} MOMO</p>
            <button onClick={buyLotteryTicket}>Buy Lottery Ticket</button>
            {message && <p>{message}</p>}
        </div>
    );
}
