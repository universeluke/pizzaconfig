import styles from "./App.module.css";
import Pepperoni from "./components/Pepperoni";
import Cheese from "./components/Cheese";
import Tomato from "./components/Tomato";
import Mushrooms from "./components/Mushrooms";
import Oregano from "./components/Oregano";

function App() {
  return (
    <div className={styles.base}>
      <div style={{ position: "absolute" }}>
        <Tomato />
      </div>
      <div style={{ position: "absolute" }}>
        <Cheese />
      </div>
      <div style={{ position: "absolute" }}>
        <Pepperoni />
      </div>
      <div style={{ position: "absolute" }}>
        <Mushrooms />
      </div>
      <div style={{ position: "absolute" }}>
        <Oregano />
      </div>
    </div>
  );
}

export default App;
