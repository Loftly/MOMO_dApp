import React, { useState, useEffect } from 'react';
import Web3 from 'web3';

const contractABI = [/* ... */];  // Replace with your ABI
const contractAddress = '0xE1Ef01C19751540778b73c122B4fc9a5EF543ECf';

function Wallet() {
    const [web3, setWeb3] = useState(null);
    const [contract, setContract] = useState(null);
    const [account, setAccount] = useState(null);
    const [balance, setBalance] = useState(null);
    const [toAddress, setToAddress] = useState('');
    const [amount, setAmount] = useState('');

    useEffect(() => {
        if (window.ethereum) {
            const web3Instance = new Web3(window.ethereum);
            setWeb3(web3Instance);
        } else if (window.web3) {
            setWeb3(new Web3(window.web3));
        } else {
            window.alert("Please install MetaMask or another Ethereum wallet.");
        }
    }, []);

    useEffect(() => {
        if (web3) {
            const contractInstance = new web3.eth.Contract(contractABI, contractAddress);
            setContract(contractInstance);
            fetchBalance();
        }
    }, [web3]);

    async function fetchBalance() {
        if (!web3) return;
        const accounts = await web3.eth.getAccounts();
        if (accounts.length === 0) {
            console.error("No account detected!");
            return;
        }
        setAccount(accounts[0]);
        const balanceWei = await web3.eth.getBalance(accounts[0]);
        const balanceEth = web3.utils.fromWei(balanceWei, 'ether');
        setBalance(balanceEth);
    }

    async function sendTransaction() {
        if (!web3 || !account) return;
        await web3.eth.sendTransaction({
            from: account,
            to: toAddress,
            value: web3.utils.toWei(amount, 'ether')
        });
        fetchBalance();  // Update balance after sending transaction
    }

    async function fetchDataFromContract() {
        if (!contract) return;
        const data = await contract.methods.getSomeData().call();
        console.log(data);
    }

    async function connectWallet() {
        if (!web3 || !window.ethereum) return;
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
        fetchBalance();
    }

    return (
        <div>
            <h2>Wallet Component</h2>
            
            {!account && 
                <button onClick={connectWallet}>Connect Wallet</button>
            }

            {account && 
                <div>
                    <p>Connected Address: {account}</p>
                    <p>Balance: {balance} ETH</p>
                    
                    <h3>Send Transaction</h3>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        sendTransaction();
                    }}>
                        <input 
                            type="text" 
                            placeholder="To Address" 
                            value={toAddress}
                            onChange={e => setToAddress(e.target.value)}
                        />
                        <input 
                            type="text" 
                            placeholder="Amount in ETH" 
                            value={amount}
                            onChange={e => setAmount(e.target.value)}
                        />
                        <button type="submit">Send</button>
                    </form>

                    <button onClick={fetchDataFromContract}>Fetch Data from Contract</button>
                </div>
            }
        </div>
    );
}

export default Wallet;
