import { useState } from "react";

export default function AccordionSection(props: {
  title: string;
  options: string[];
  mode: "single" | "multi";
  value: string | null;
  values: string[];
  onSelect: (option: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setOpen(!open)}>
        {props.title} {open ? "▲" : "▼"}
      </button>

      {open &&
        props.options.map((option) => {
          const selected =
            props.mode === "single"
              ? props.value === option
              : props.values.includes(option);

          return (
            <div key={option}>
              <button onClick={() => props.onSelect(option)}>
                {selected ? "● " : "○ "}
                {option}
              </button>
            </div>
          );
        })}
    </div>
  );
}
