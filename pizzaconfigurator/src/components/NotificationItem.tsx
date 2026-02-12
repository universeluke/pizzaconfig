import { useEffect } from "react";
import styles from "./NotificationItem.module.css";
import { customerTestIds } from "../test/customerTestIds";

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
    <div
      data-testid={customerTestIds.notification.notification}
      className={`${styles.toast} ${styles[kind]}`}
    >
      <span data-testid={customerTestIds.notification.notificationText}>
        {text}
      </span>
      <button
        data-testid={customerTestIds.notification.notificationDismissButton}
        onClick={() => onDismiss(id)}
      >
        x
      </button>
    </div>
  );
}
