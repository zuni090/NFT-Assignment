import { Contract, ethers, parseEther } from "ethers"
import React from 'react'
import { useEffect } from "react"
import { useContext } from "react"
import { useState } from "react"
import { createContext } from "react"

const provider = new ethers.BrowserProvider(window.ethereum)

export const Web3Context = createContext()

export const useWeb3Context = () => useContext(Web3Context)

const Web3Provider = ({ children }) => {
    const [error, setError] = useState(null);
    const [account, setAccount] = useState(null);
    const [address, setAddress] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    const connectWalletHandler = () => {
        setIsConnected(false)
        if (window.ethereum) {
            provider.send("eth_requestAccounts", [])
                .then(async () => accountHandler(await provider.getSigner()))
                .catch((err) => setError(err.message))
        } else {
            setError("Please connect to a wallet!!!");
        }
    }

    const accountHandler = async (walletAccount) => {
        const walletAddress = await walletAccount.getAddress();
        setAddress(walletAddress);
        setAccount(walletAccount);
        setIsConnected(true)
    }

    const getUserBalance = async (userAddress) => ethers.formatEther(
        await provider.getBalance(userAddress, "latest")
    )

    const getContract = (contract_Addr, contract_abi) => {
        return new Contract(
            contract_Addr,
            JSON.parse(contract_abi),
            account,
        )
    }

    const mintNFT = async (price, contract_Addr, contract_abi) => {
        const balance = await getUserBalance(address)

        if (price <= balance) {
            const contract = getContract(contract_Addr, contract_abi)
            const value = ethers.parseUnits(price, 'ether');
            await contract.safeMint(account, { value })
        } else {
            alert("Insufficient balance for transaction")
            throw new Error("Insufficient balance for transaction")
        }
    }

    const NFTInfo = async (contract_Addr, contract_abi) => {
        const contract = getContract(contract_Addr, contract_abi)
        return {
            max: contract.MAX_SUPPLY,
            price: contract.MINT_PRICE,
            supply: await contract.totalSupply()
        }
    }

    useEffect(() => {
        connectWalletHandler()

        // Listen for changes in MetaMask accounts
        window.ethereum.on('accountsChanged', connectWalletHandler);

        // Cleanup function
        return () => {
            window.ethereum.removeListener('accountsChanged', connectWalletHandler);
        };
    }, [])

    return (
        <Web3Context.Provider value={{ isConnected, account, address, error, getUserBalance, mintNFT, NFTInfo }}>
            {children}
        </Web3Context.Provider>
    )
}

export default Web3Provider