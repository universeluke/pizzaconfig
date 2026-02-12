import { useDispatch, useSelector } from "react-redux";
import { popNotification } from "../store/notificationSlice";
import type { RootState } from "../store/store";
import NotificationItem from "./NotificationItem";
import styles from "./NotificationStack.module.css";
import { customerTestIds } from "../test/customerTestIds";

export default function NotificationStack() {
  const dispatch = useDispatch();
  const notifications = useSelector(
    (state: RootState) => state.notification.list,
  );

  if (!notifications.length) return null;

  return (
    <div
      data-testid={customerTestIds.notification.notificationContainer}
      className={styles.stack}
    >
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
