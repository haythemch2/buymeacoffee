import React from "react";
import abi from '../artifacts/contracts/BuyMeACoffee.sol/BuyMeACoffee.json';
import { ethers } from "ethers";

const BuyCoffee = ({client}) => {
    const contractAddress = "0xd8678bA2e80fAAAFEcE847F94A3eD585779DBb99";
    const contractABI = abi.abi;

    const buyCoffee = async () => {
        try {
          const {ethereum} = window;
    
          if (ethereum) {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const buyMeACoffee = new ethers.Contract(
              contractAddress,
              contractABI,
              signer
            );
    
            console.log("buying coffee..")
            const coffeeTxn = await buyMeACoffee.buyCoffee(
              'mohsen',
              'coffee on me sahbi !',
              {value: ethers.parseEther("0.001")}
            );
    
            await coffeeTxn.wait();
    
            console.log("mined ", coffeeTxn.hash);
    
            console.log("coffee purchased!");
            const memos  = await buyMeACoffee.getMemos();
            console.log(memos);
          }
        } catch (error) {
          console.log(error);
        }
      };
  return (
    <div>      
      <button
        onClick={buyCoffee}
        type="button"
        className="btn sign-btn"
      >
        Buy Coffee
      </button>
    </div>
  );
};

export default BuyCoffee;