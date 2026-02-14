declare module '@rails/actioncable' {
  export interface Subscription {
    unsubscribe(): void;
    perform(action: string, data?: object): void;
    send(data: object): void;
  }

  export interface SubscriptionCallbacks<T = unknown> {
    received?(data: T): void;
    connected?(): void;
    disconnected?(): void;
    rejected?(): void;
  }

  export interface Subscriptions {
    create<T>(
      channel: string | { channel: string; [key: string]: unknown },
      callbacks: SubscriptionCallbacks<T>
    ): Subscription;
  }

  export interface Consumer {
    subscriptions: Subscriptions;
    disconnect(): void;
  }

  export function createConsumer(url?: string): Consumer;
}
