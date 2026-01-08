import { useState } from "react";
import styles from "./AccordionSection.module.css";

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
    <div className={styles.section}>
      <button className={styles.header} onClick={() => setOpen(!open)}>
        <span className={styles.headerTitle}>{props.title}</span>
        <span className={styles.chevron}>{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className={styles.body}>
          {props.options.map((option) => {
            const selected =
              props.mode === "single"
                ? props.value === option
                : props.values.includes(option);

            return (
              <button
                key={option}
                className={styles.option}
                onClick={() => props.onSelect(option)}
              >
                <span className={styles.optionText}>{option}</span>
                <span
                  className={`${styles.dot} ${
                    selected ? styles.dotSelected : ""
                  }`}
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
