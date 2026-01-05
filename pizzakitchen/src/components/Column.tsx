type Order = {
  id: string;
  status: "todo" | "in_progress" | "done";
  pizza: any;
};

export default function Column(props: {
  title: string;
  orders: Order[];
  onPrev?: (id: string) => void;
  onNext?: (id: string) => void;
}) {
  return (
    <div>
      <h3>
        {props.title} ({props.orders.length})
      </h3>
      {props.orders.map((order) => (
        <div key={order.id}>
          <div>{order.id}</div>
          <pre>{JSON.stringify(order.pizza, null, 2)}</pre>
          {props.onPrev && (
            <button onClick={() => props.onPrev?.(order.id)}>Prev</button>
          )}
          {props.onNext && (
            <button onClick={() => props.onNext?.(order.id)}>Next</button>
          )}
        </div>
      ))}
    </div>
  );
}
