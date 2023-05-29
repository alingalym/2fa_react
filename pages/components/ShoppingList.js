function ShoppingList() {
    const items = ["Apples", "Bananas", "Grapes"];
  
    return (
      <div className="shopping-list">
        <h1>Shopping List</h1>
        <ul>
          {items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
    );
  }

export default ShoppingList;