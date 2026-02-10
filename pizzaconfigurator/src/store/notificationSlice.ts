import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type NotificationType = "info" | "success" | "error";

export interface NotificationItem {
  id: string;
  text: string;
  kind: NotificationType;
  timeout?: number;
}

interface NotificationState {
  list: NotificationItem[];
}

const initialState: NotificationState = {
  list: [],
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    pushNotification: (
      state,
      action: PayloadAction<{
        text: string;
        kind?: NotificationType;
        timeout?: number;
      }>
    ) => {
      state.list.unshift({
        id: crypto.randomUUID(),
        text: action.payload.text,
        kind: action.payload.kind ?? "info",
        timeout: action.payload.timeout,
      });
    },

    popNotification: (state, action: PayloadAction<string>) => {
      state.list = state.list.filter((n) => n.id !== action.payload);
    },

    clearNotifications: (state) => {
      state.list = [];
    },
  },
});

export const {
  pushNotification,
  popNotification,
  clearNotifications,
} = notificationSlice.actions;

export default notificationSlice.reducer;