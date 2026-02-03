import type { CookStage } from "../../../types/types";
import styles from "./BbqDip.module.css";

type Props = {
  size: "small" | "medium" | "large";
  cookStage: CookStage;
};

export default function BbqDip({ size, cookStage }: Props) {
  return (
    <img
      className={`${styles.bbqDip} ${styles[size]} ${styles[cookStage]}`}
      src="/bbq-dip.png"
    ></img>
  );
}
