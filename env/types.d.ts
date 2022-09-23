type Env = Partial<Readonly<typeof import("./env.local.json")>>;

declare namespace NodeJS {
  interface ProcessEnv extends Env {
    readonly TWITTER_CLIENT_ID?: string;
    readonly TWITTER_CLIENT_SECRET?: string;
    readonly TWITTER_CONSUMER_KEY?: string;
    readonly TWITTER_CONSUMER_SECRET?: string;
    readonly NEXTAUTH_SECRET?: string;
  }
}
