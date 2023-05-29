import { useEffect, useState } from "react";
function StateWithInput() {
    // myName is the variable
    // setMyName is the updater function
    // Create a state variable with initial value
    // being an empty string ""
    const [myName, setMyName] = useState("");
    const [myPass, setMyPass] = useState("");
  
    function handleOnChange(text) {
      setMyName(text);
      
    }

    function handleOnChange2(text) {
      setMyName(text);
    }
  
    return (
      <div>
        <input type="text" onChange={(e) => handleOnChange(e.target.value)} />
        <p>Hello, this is my account: {myName}!</p>
        <input type="text" onChange={(e) => handleOnChange2(e.target.value)} />
        <p>This is my password:, {myPass}!</p>
      </div>
      
    );
  }
  export default StateWithInput;