import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { Contract, providers, ethers } from "ethers";
import React, { useEffect, useState, useRef } from "react";
import Web3Modal from "web3modal";
import Web3 from 'web3';
import { NFT_CONTRACT_ADDRESS, abi } from "@/constants";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [verified, setVerified] = useState(false);
  const [length, setLength] = useState(0);
  const [info, setInfo] = useState("start");
  const [res, setRes] = useState("");
  const [myName, setMyName] = useState("");
  const [myPass, setMyPass] = useState("");
  const [contract, setContract] = useState();
  const [signature, setSignature] = useState();
  const [acc, setAcc] = useState([]);
  const [pass, setPass] = useState([]);
  const web3ModalRef = useRef();
  
  const web3 = new Web3(Web3.givenProvider || 'http://localhost:3000');
  
  const getProviderOrSigner = async (needSigner = false) => {
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new ethers.providers.Web3Provider(provider);
    let signer = web3Provider.getSigner();
    const contract = new ethers.Contract(NFT_CONTRACT_ADDRESS, abi, signer);
    setContract(contract);
    setAcc([...acc,"user"]);
    setPass([...pass,"password"]);
    setLength(1);
    const { chainId } = await web3Provider.getNetwork();
    
    if (chainId !== 97) {
      window.alert("Change network");
      //TODO metmask переключился на 97
    }
    if (needSigner) {
      //const signer = web3Provider.getSigner();
      //console.log(contract);
      return signer;
    }
    return web3Provider;
  };
 

  const connectWallet = async () => {
    try {
      await getProviderOrSigner();
      setWalletConnected(true);
    } catch (error) {
      console.error(error);
    }
  };

  const check_A = (usr) => {
    for (let i=0; i<length; i++) {
      if (acc[i]==usr) return i;
    }
    return 99999;
  }
  
  const check_AA = (usr, pswd) => {
    for (let i=0; i<length; i++) {
      if ((acc[i]==usr) && (pass[i]==pswd)) return i;
    }
    return 99999;
  }

  const Login = async () => {
    try {
      setVerified(false);
      if (check_A(myName)!=99999) {
        if (check_AA(myName,myPass)!=99999) {
          let getTBNB = await contract.Login(myName); 
          if (getTBNB == 1) {
            await sign_message();
            setVerified(true);
            setInfo("First step of login is succesful, Please click on Verify button!");
          }
          else {
            setInfo("Login is not succesful due to the lack of BNB account!");
          }
        }
        else{
          setInfo("Account is found but the password is not correct!");
        }
      }
      else { 
        setInfo("Account is not found: you have to register!");
      }
      setRes(myName);
    } catch (error) {
      setInfo("Login call was failed: "+error);
      console.error(error);
    }
  };

  const RegWeb = () => {
    try {
      setInfo("RegWeb was called!");
      setRes(myName);
      //setVerified(false);
  	  if (check_A(myName)!=99999) {
        setInfo("Account is not added: the account is existing!");
      }
      else {
        setAcc([...acc,myName]);
        setPass([...pass,myPass]);
        let len = length + 1;
        setLength(len);
        setInfo("Account is added: the total number is "+len+" Please try to logon upon Metamask completion.");
      }  
    } catch (error) {
      setInfo("RegWeb call was failed: "+error);
      console.error(error);
    }
  };

  
  const Register = async () => {
    try {
      setInfo("Register TBNB was called!");
      setVerified(false);
      const setTBNB = await contract.Register(myName);
      if (setTBNB != 0){
        setRes(myName);
        setInfo("TBNB Account is added, please try to logon upon Metamask confirmation.");
      }
      else {
        setRes(myName);
        setInfo("Account is not added: TBNB address is existing!");
      }
    } catch (error) {
      setInfo("Register TBNB call was failed: "+error);
      console.error(error);
    }
  };

const UnRegWeb = () => {
    try {
      setRes(myName);
      setInfo("UnRegWeb was called!");
      let i = check_A(myName);
      if (i == 99999) {
        setInfo("This account is not existing!");
      }
      else{
        let copy_acc = Object.assign([], acc);
        let copy_pass = Object.assign([], pass);
        let index = i;
        copy_acc.splice(index, 1);
        copy_pass.splice(index, 1);
        setAcc(copy_acc);
        setPass(copy_pass);
        let len = length - 1;
        setLength(len);
        setInfo("Account was removed: the total number is "+len);
      }
    } catch (error) {
      setInfo("UnRegWeb call was failed: "+error);
      console.error(error);
    }
  };


  const UnRegister = async () => {
    try {
      setInfo("UnRegister TBNB was called!");
      setVerified(false);
      setRes(myName);
      let getTBNB = await contract.UnRegister(myName); 
      if (getTBNB == 1){
        setInfo("Account was removed: the total number is "+length);
      }
      else {
        setInfo("Account was not removed: You need to be an owner!");
      }
    } catch (error) {
      setInfo("Unregister TBNB call was failed: "+error);
      console.error(error);
    }
  };

  const sign_message = async () => {
    try {
      let mess = "message_to_sign";
     	mess = web3.utils.sha3(mess); //hash of message
      const accounts = await web3.eth.requestAccounts();
      let sign = await web3.eth.personal.sign(mess, accounts[0]);
      setSignature(sign);
      setRes("The message was signed in Metamask, Please click Verify button.");
    } catch (error) {
      console.error(error);
    }
  };

  const verify_message = async () => {
    try {
      var mess = "message_to_sign";
     	mess = web3.utils.sha3(mess); //hash of message
      var signing_address = await web3.eth.personal.ecRecover(mess, signature);
      setRes(signing_address);
      if (contract.Check_Account_Address(myName, signing_address)) {
        setInfo("Verify was successful!");
      } else {
        setInfo("Verify is not successful!");
      }
      setVerified(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!walletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: 97,
        providerOptions: {},
        disableInjectedProvider: false,
      });
      connectWallet();
    }
  }, [walletConnected]);

  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={styles.description}>
          <p>Basic Web3 dApp on React</p>
          <div>
            <button onClick={connectWallet} className={styles.button}>
              {!walletConnected ? "Connect Wallet" : "Wallet connected"}
            </button>
          </div>
        </div>
        <div>
          <input type="text" onChange={(e) => setMyName(e.target.value)} />
          <p>My account: {myName}</p>
          <input type="text" onChange={(e) => setMyPass(e.target.value)} />
          <p>My password: {myPass}</p>
          <button onClick={Login} className={styles.button}>Login</button>
          <button onClick={verify_message} className={styles.button} disabled={!verified}>Verify</button>
          <p>______________________________________________________</p>
          <p>Size: {length}</p>
          <p>Result: {res}</p>
          <p>Information: {info}</p>
          <button onClick={RegWeb} className={styles.button}>Sign Up Web</button>
          <button onClick={UnRegWeb} className={styles.button}>Remove Web</button>
          <p>______________________________________________________</p>
          <button onClick={Register} className={styles.button}>Sign Up TBNB</button>
          <button onClick={UnRegister} className={styles.button}>Remove TBNB</button>
        </div>
      </main>
    </div>
  );
}