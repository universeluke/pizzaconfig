import { useEffect } from "react";
import styles from "./NotificationItem.module.css";

interface Props {
  id: string;
  text: string;
  kind: "info" | "success" | "error";
  timeout?: number;
  onDismiss: (id: string) => void;
}

export default function NotificationItem({
  id,
  text,
  kind,
  timeout,
  onDismiss,
}: Props) {
  useEffect(() => {
    if (!timeout) return;

    const t = setTimeout(() => {
      onDismiss(id);
    }, timeout);

    return () => clearTimeout(t);
  }, [id, timeout, onDismiss]);

  return (
    <div className={`${styles.toast} ${styles[kind]}`}>
      <span>{text}</span>
      <button onClick={() => onDismiss(id)}>x</button>
    </div>
  );
}
