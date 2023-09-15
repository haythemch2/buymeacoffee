import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import abi from '../artifacts/contracts/BuyMeACoffee.sol/BuyMeACoffee.json';

const MemmosList = () => {
  const contractAddress = "0xd8678bA2e80fAAAFEcE847F94A3eD585779DBb99";
  const contractABI = abi.abi;

  const [memos, setMemos] = useState([]);

   useEffect(() => {
    getMemos();
     return () => {
      setMemos([])
     }
   }, [])

   
    const getMemos = async () => {
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

            buyMeACoffee.on("NewMemo", onNewMemo);
            const memos  = await buyMeACoffee.getMemos();
            memos.forEach(element => {
              setMemos((prevState) => [
                ...prevState,
                {
                  address: element.from,
                  timestamp: element.timestamp,
                  message:element.message,
                  name:element.name
                }
              ]);
            });
          }
        } catch (error) {
          console.log(error);
        }
      };

      const onNewMemo = (from, timestamp, name, message) => {
        alert("Memo received: ", from, timestamp, name, message);
        setMemos((prevState) => [
          ...prevState,
          {
            address: from,
            timestamp,
            message,
            name
          }
        ]);
      }
  return (
    <div >      
     {memos.map((memo, idx) => {
        return (
          <div key={idx} style={{border:"2px solid", borderRadius:"5px", padding: "5px", margin: "5px"}}>
            <p style={{fontWeight:"bold"}}>"{memo.message}"</p>
            <p>From: {memo.name} at {memo.timestamp.toString()}</p>
          </div>
        )
      })}
    </div>
  );
};

export default MemmosList;