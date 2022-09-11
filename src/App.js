import { useCallback, useEffect, useState } from "react";
import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";
import { loadContract } from "./utils/load-contract";

function App() {
  const [web3Api, setWeb3Api] = useState({
    provider: null,
    isProviderLoaded: false,
    web3: null,
    contract: null,
  });

  const [balance, setBalance] = useState(null);
  const [account, setAccounts] = useState(null);
  const [shouldReload, reload] = useState(false);

  const reloadEffect = useCallback(() => reload(!shouldReload), [shouldReload]);

  const setAccountListener = (provider) => {
    provider.on("accountsChanged", (accounts) => window.location.reload());
  };

  useEffect(() => {
    const loadProvider = async () => {
      const provider = await detectEthereumProvider();

      if (provider) {
        const contract = await loadContract("Faucet", provider);
        setAccountListener(provider);
        setWeb3Api({ web3: new Web3(provider), provider, contract, isProviderLoaded: true});
      } else {
        console.error("Please install Metamask!");
      }
    };

    loadProvider();
  }, []);

  useEffect(() => {
    const loadBalance = async () => {
      const { contract, web3 } = web3Api;
      let balance = await web3.eth.getBalance(contract.address);

      setBalance(web3.utils.fromWei(balance, "ether"));
    };

    web3Api.contract && loadBalance();
  }, [web3Api, shouldReload]);

  useEffect(() => {
    const getAccount = async () => {
      const accounts = await web3Api.web3.eth.getAccounts();
      setAccounts(accounts[0]);
    };
    web3Api.web3 && getAccount();
  }, [web3Api.web3]);

  const addFunds = useCallback(async () => {
    const { contract, web3 } = web3Api;
    await contract.addFunds({
      from: account,
      value: web3.utils.toWei("1", "ether"),
    });

    reloadEffect();
  }, [web3Api, account, reloadEffect]);

  const withdraw = async () => {
    const { contract, web3 } = web3Api;
    const withdrawAmount = web3.utils.toWei("0.1", "ether");

    await contract.withdraw(withdrawAmount, {
      from: account,
    });

    reloadEffect();
  };

  return (
    <>
      <div className="h-screen w-full flex justify-center items-center p-10 select-none">
        <div className="flex flex-col justify-center items-start">
          <div className="flex justify-center items-center gap-5">
            <strong>Account: </strong>{" "}
            <h1>
              {account ? (
                account
              ) : 
                !web3Api.provider ? 
                <>
                  <div className="bg-yellow-300 rounded-md p-2 text-sm">
                  Wallet is not detected!{` `}
                  <a target="_blank" href="https://docs.metamask.io">
                    Install Metamask
                  </a>
                  </div>
                </> : 
              (
                <button
                  onClick={() => {
                    web3Api.provider.request({ method: "eth_requestAccounts" });
                  }}
                  className="py-[2px] px-4 bg-slate-200 hover:bg-slate-300 rounded-md  duration-75 active:scale-[90%] "
                >
                  Connect Wallet
                </button>
              )}
            </h1>
          </div>
          <div className="text-2xl md:text-4xl flex items-center justify-center gap-2">
            Current Balance:<span className="font-bold">{balance}</span> ETH
          </div>
          <div className="flex gap-4 my-5">
            <button
              disabled={!account}
              onClick={addFunds}
              className="py-2 px-5 bg-blue-200 hover:bg-blue-300 rounded-md  duration-75 active:scale-[90%] "
            >
              Donate 1 ETH
            </button>
            <button
              disabled={!account}
              onClick={withdraw}
              className="py-2 px-5 bg-green-200 hover:bg-green-300 rounded-md duration-75 active:scale-[90%]"
            >
              Withdraw
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
