import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type TMessage = {
    sender: string;
    text: string;
};

type TChatStoreState = {
    messages: TMessage[];
};

interface IChatStoreActions {
    setMessages: (message: TMessage) => void;
}

const chatStore = create<TChatStoreState & IChatStoreActions>()(
    persist(
        (set) => ({
            messages: [],
            setMessages: (message) =>
                set((state) => ({ messages: [...state.messages, message] })),
        }),
        {
            name: "chat-session-storage", // unique name
            storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
        }
    )
);

export default chatStore;
