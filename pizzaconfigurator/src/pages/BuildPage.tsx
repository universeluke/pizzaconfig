import styles from "./BuildPage.module.css";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store/store";
import AccordionSection from "../components/AccordionSection";
import {
  setCheese,
  setNotes,
  setSauce,
  toggleDip,
  toggleHerb,
  toggleOil,
  toggleTopping,
} from "../store/pizzaSlice";
import BurgerMenu from "../components/BurgerMenu";
import AddToBasket from "../components/AddToBasket";
import Basket from "../components/Basket";
import PizzaVisualizer from "../components/PizzaVisualiser";

function BuildPage() {
  const dispatch = useDispatch();
  const pizza = useSelector((state: RootState) => state.pizza);

  const OPTIONS = {
    sauce: ["tomato", "basil pesto", "white", "monthly special"],
    cheese: ["fior di latte", "mozzarella", "vegan", "none"],
    toppings: ["pepperoni", "mushroom", "onion", "ham"],
    oils: ["olive oil", "chilli oil"],
    herbs: ["oregano", "basil"],
    dips: ["garlic mayo", "bbq"],
  };

  return (
    <>
      <BurgerMenu />
      <Basket />

      <h2 className={styles.title}>
        <span className={styles.titleGreen}>DESIGN</span>
        <br />
        <span className={styles.titleGreen}>YOUR</span>

        <br />
        <span className={styles.titleRed}>PIE</span>
      </h2>

      <PizzaVisualizer pizza={pizza} />

      <div>
        <AccordionSection
          title="SAUCE"
          options={OPTIONS.sauce}
          mode="single"
          value={pizza.sauce}
          values={[]}
          onSelect={(opt) => dispatch(setSauce(opt))}
        />

        <AccordionSection
          title="CHEESE"
          options={OPTIONS.cheese}
          mode="single"
          value={pizza.cheese}
          values={[]}
          onSelect={(opt) => dispatch(setCheese(opt))}
        />

        <AccordionSection
          title="TOPPINGS"
          options={OPTIONS.toppings}
          mode="multi"
          value={null}
          values={pizza.toppings}
          onSelect={(opt) => dispatch(toggleTopping(opt))}
        />

        <AccordionSection
          title="OILS"
          options={OPTIONS.oils}
          mode="multi"
          value={null}
          values={pizza.oils}
          onSelect={(opt) => dispatch(toggleOil(opt))}
        />

        <AccordionSection
          title="HERBS"
          options={OPTIONS.herbs}
          mode="multi"
          value={null}
          values={pizza.herbs}
          onSelect={(opt) => dispatch(toggleHerb(opt))}
        />

        <AccordionSection
          title="DIPS"
          options={OPTIONS.dips}
          mode="multi"
          value={null}
          values={pizza.dips}
          onSelect={(opt) => dispatch(toggleDip(opt))}
        />

        <div className={styles.notesSection}>
          <h3 className={styles.notes}>NOTES FOR KITCHEN</h3>
          <textarea
            className={styles.notesInput}
            value={pizza.notes}
            onChange={(e) => dispatch(setNotes(e.target.value))}
          />
        </div>
        <AddToBasket />
      </div>
    </>
  );
}

export default BuildPage;
