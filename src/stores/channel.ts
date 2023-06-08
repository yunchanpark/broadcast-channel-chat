import { BroadcastChannel } from "broadcast-channel";
import { create } from "zustand";

type TChannelStoreState = {
    tabId: string;
    channel: BroadcastChannel | null;
};

interface IChannelStoreActions {
    initChannel: (channel: BroadcastChannel | null) => void;
}

const createTabId = () => {
    const sessionTabId = sessionStorage.getItem("tabId");
    if (sessionTabId !== null) {
        return sessionTabId;
    }

    const date = new Date();
    const stringDate = date.toString();
    const tabId = stringDate + Math.random().toString(36).slice(2, 16);
    sessionStorage.setItem("tabId", tabId);
    return tabId;
};

const defaultChannelState: TChannelStoreState = {
    channel: null,
    tabId: createTabId(),
};

const channelStore = create<TChannelStoreState & IChannelStoreActions>()(
    (set) => ({
        ...defaultChannelState,
        initChannel: (channel) => {
            set((state) => ({ ...state, channel }));
        },
    })
);

export default channelStore;
