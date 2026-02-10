import { useDispatch, useSelector } from "react-redux";
import { popNotification } from "../store/notificationSlice";
import type { RootState } from "../store/store";
import NotificationItem from "./NotificationItem";
import styles from "./NotificationStack.module.css";

export default function NotificationStack() {
  const dispatch = useDispatch();
  const notifications = useSelector(
    (state: RootState) => state.notification.list,
  );

  if (!notifications.length) return null;

  return (
    <div className={styles.stack}>
      {notifications.map((notif) => (
        <NotificationItem
          key={notif.id}
          id={notif.id}
          text={notif.text}
          kind={notif.kind}
          timeout={notif.timeout}
          onDismiss={(id) => dispatch(popNotification(id))}
        />
      ))}
    </div>
  );
}
