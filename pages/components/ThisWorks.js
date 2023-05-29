import React, { useEffect, useState } from "react";


function DoesNotWork() {
  let myNumber = 0;

  function increment() {
    myNumber++;
  }

  return (
    <div>
      <p>{myNumber}</p>
      <button onClick={increment}>Increment!</button>
    </div>
  );
}
function ThisWorks() {
    // myNumber is the variable itself
    // setMyNumber is a function that lets us update the value
    // useState(0) initializes the React Hook
    // with the starting value of 0
    const [myNumber, setMyNumber] = useState(0);
    const Total_amount = 3;
  
    function increment() {
      // Sets the new value to the old value + 1
      if (Total_amount > (myNumber+1)) { 
        setMyNumber(myNumber + 1);
      }
    }

    function decrement() {
      // Sets the new value to the old value - 1
      if ((myNumber-1) >= 0 ) { 
        setMyNumber(myNumber - 1);
      }
    }
    

    return (
      <div>
        <img src={"./"+myNumber+".jpg"} alt=""/>
        <p>NFT is : {myNumber}</p>
        <button onClick={increment}> _Increment+ </button>
        <button onClick={decrement}> _Decrement- </button>
      </div>
    );
  }

export default ThisWorks;