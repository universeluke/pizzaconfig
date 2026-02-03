import type { CookStage } from "../../../types/types";
import styles from "./SrirachaMayo.module.css";

type Props = {
  size: "small" | "medium" | "large";
  cookStage: CookStage;
};

export default function SrirachaMayo({ size, cookStage }: Props) {
  return (
    <img
      className={`${styles.srirachaMayo} ${styles[size]} ${styles[cookStage]}`}
      src="/sriracha-mayo.png"
    ></img>
  );
}
