import { useDispatch } from "react-redux";
import { pushNotification } from "../store/notificationSlice";
import type { NotificationType } from "../store/notificationSlice";

export function useNotification() {
  const dispatch = useDispatch();

  return (
    text: string,
    options?: { kind?: NotificationType; timeout?: number }
  ) => {
    dispatch(
      pushNotification({
        text,
        kind: options?.kind,
        timeout: options?.timeout,
      })
    );
  };
}