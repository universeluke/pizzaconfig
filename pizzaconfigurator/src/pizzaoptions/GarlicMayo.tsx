import type { CookStage } from "../../../types/types";
import styles from "./GarlicMayo.module.css";

type Props = {
  size: "small" | "medium" | "large";
  cookStage: CookStage;
};

export default function GarlicMayo({ size, cookStage }: Props) {
  return (
    <img
      className={`${styles.garlicMayo} ${styles[size]} ${styles[cookStage]}`}
      src="/garlic-mayo.png"
    ></img>
  );
}
