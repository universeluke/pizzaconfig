import styles from "./Column.module.css";

type Order = {
  id: string;
  user_id: string;
  status: "todo" | "in_progress" | "cooking" | "done" | "collected";
  pizza: any;
};

export default function Column(props: {
  title: string;
  orders: Order[];
  onPrev?: (order: Order[]) => void;
  onNext?: (order: Order[]) => void;
}) {
  return (
    <div>
      <h3>
        {props.title} ({props.orders.length})
      </h3>
      <div className={styles.column}>
        {props.orders.map((order) => (
          <div key={order.id} className={styles.order}>
            <div className={styles.id}>{order.id}</div>
            <div className={styles.optionsList}>
              <span>{order.pizza.sauce} sauce</span>
              <span>
                {order.pizza.cheese === "none" ? "no" : order.pizza.cheese}{" "}
                cheese
              </span>
              <span>
                {order.pizza.toppings.map((topping) => (
                  <div key={topping}>{topping}</div>
                ))}
              </span>
              <span>
                {order.pizza.oils.map((oil) => (
                  <div key={oil}>{oil}</div>
                ))}
              </span>
              <span>
                {order.pizza.herbs.map((herb) => (
                  <div key={herb}>{herb}</div>
                ))}
              </span>
              <span>
                {order.pizza.dips.map((dip) => (
                  <div key={dip}>{dip} dip</div>
                ))}
              </span>
              {order.pizza.notes && (
                <span className={styles.notes}>notes: {order.pizza.notes}</span>
              )}
            </div>
            {props.onPrev && (
              <button onClick={() => props.onPrev?.(order)}>Prev</button>
            )}
            {props.onNext && (
              <button onClick={() => props.onNext?.(order)}>Next</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
