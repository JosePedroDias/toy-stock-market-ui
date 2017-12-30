declare module "EventEmitter" {
  declare type ListenerFn = (...args: any[]) => void;

  declare class EventEmitter {
    static constructor(): EventEmitter;
    on(event: string | Symbol, listener: ListenerFn, context?: any): this;
    once(event: string | Symbol, listener: ListenerFn, context?: any): this;
    off(
      event: string | Symbol,
      listener?: ListenerFn,
      context?: any,
      once?: boolean
    ): this;
    emit(event: string, ...params?: any[]): this;
  }

  declare module.exports: Class<EventEmitter>;
}
