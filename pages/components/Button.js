function Button() {
    function handleClick() {
      alert("Hello");
    }
  
    return (
      <button className="button" onClick={handleClick}>
        Click Me!
      </button>
    );
  }

export default Button;