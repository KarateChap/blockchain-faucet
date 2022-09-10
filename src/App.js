import { useEffect, useState } from "react";
import Web3 from "web3/dist/web3.min.js";
import detectEthereumProvider from "@metamask/detect-provider";

function App() {
  const [web3Api, setWeb3Api] = useState({
    provider: null,
    web3: null,
  });

  const [account, setAccounts] = useState(null);

  useEffect(() => {
    const loadProvider = async () => {
      const provider = await detectEthereumProvider();

      if (provider) {
        setWeb3Api({ web3: new Web3(provider), provider });
      } else {
        console.error("Please install Metamask!");
      }
    };

    loadProvider();
  }, []);

  useEffect(() => {
    const getAccount = async () => {
      const accounts = await web3Api.web3.eth.getAccounts();
      setAccounts(accounts[0]);
    };
    web3Api.web3 && getAccount();
  }, [web3Api.web3]);

  return (
    <>
      <div className="h-screen w-full flex justify-center items-center p-10 select-none">
        <div className="flex flex-col justify-center items-start">
          <div className="flex justify-center items-center gap-5">
            <strong>Account: </strong>{" "}
            <h1>
              {account ? (
                account
              ) : (
                <button
                onClick={() => {
                  web3Api.provider.request({method: "eth_requestAccounts"})
                }} 
                className="py-[2px] px-4 bg-slate-200 hover:bg-slate-300 rounded-md  duration-75 active:scale-[90%] ">
                  Connect Wallet
                </button>
              )}
            </h1>
          </div>
          <div className="text-2xl md:text-4xl flex items-center justify-center gap-2">
            Current Balance:<span className="font-bold">10</span> ETH
          </div>
          <div className="flex gap-4 my-5">
            <button className="py-2 px-5 bg-blue-200 hover:bg-blue-300 rounded-md  duration-75 active:scale-[90%] ">
              Donate
            </button>
            <button className="py-2 px-5 bg-green-200 hover:bg-green-300 rounded-md duration-75 active:scale-[90%]">
              Withdraw
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
