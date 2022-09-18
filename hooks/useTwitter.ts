import { TwitterApi } from "twitter-api-v2";

export default function useTwitter() {
  const appOnlyClient = new TwitterApi(process.env.TWITTER_BEARER_TOKEN);

  const postTweet = async () => await appOnlyClient.v2.tweet('twitter-api-v2 is awesome!', {
      poll: { duration_minutes: 120, options: ['Absolutely', 'For sure!'] },
  });

  return {
      postTweet
  };
}
