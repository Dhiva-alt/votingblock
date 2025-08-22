import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import contractAddress from "./contracts/contract-address.json";
import VotingArtifact from "./contracts/Voting.json";
import "./App.css";

function App() {
  const [candidates, setCandidates] = useState([]);
  const [selected, setSelected] = useState("");
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);

  // Initialize provider, signer, and contract
  useEffect(() => {
    const init = async () => {
      try {
        // Connect to a local blockchain (e.g., Hardhat at http://127.0.0.1:8545)
        const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

        // Example: use the first account’s private key (ONLY for dev)
        const privateKey =
          "0xYOUR_PRIVATE_KEY_HERE"; // ⚠️ Replace with test key
        const signerInstance = new ethers.Wallet(privateKey, provider);
        setSigner(signerInstance);

        // Load contract
        const contractInstance = new ethers.Contract(
          contractAddress.Voting,
          VotingArtifact.abi,
          signerInstance
        );
        setContract(contractInstance);
      } catch (err) {
        console.error("Failed to init:", err);
      }
    };

    init();
  }, []);

  const loadCandidates = async () => {
    if (!contract) return;

    let list = [];
    try {
      const count = await contract.candidatesCount();
      for (let i = 0; i < count; i++) {
        const cand = await contract.candidates(i);
        list.push({ id: i, name: cand.name, votes: cand.voteCount.toString() });
      }
    } catch (err) {
      console.error("Error loading candidates:", err);
    }
    setCandidates(list);
  };

  const vote = async () => {
    if (!contract || selected === "") return;
    try {
      const tx = await contract.vote(selected);
      await tx.wait();
      alert("Vote cast successfully 🎉");
      loadCandidates();
    } catch (err) {
      console.error("Voting failed:", err);
      alert("Voting failed ❌");
    }
  };

  return (
    <div className="app-container">
      <h1 className="title">🗳️ Blockchain Voting DApp</h1>

      {!signer ? (
        <p>Connecting to blockchain...</p>
      ) : (
        <>
          <button onClick={loadCandidates} className="btn load">
            Load Candidates
          </button>

          <div className="candidates">
            {candidates.map((c) => (
              <div
                key={c.id}
                className={`candidate-card ${
                  selected === c.id ? "selected" : ""
                }`}
                onClick={() => setSelected(c.id)}
              >
                <h2>{c.name}</h2>
                <p>Votes: {c.votes}</p>
              </div>
            ))}
          </div>

          {candidates.length > 0 && (
            <button onClick={vote} className="btn vote">
              Cast Vote ✅
            </button>
          )}
        </>
      )}
    </div>
  );
}

export default App;
