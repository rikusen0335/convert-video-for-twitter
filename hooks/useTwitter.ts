import { getToken } from "next-auth/jwt";
import { TwitterApi } from "twitter-api-v2";

export default function useTwitter() {
  const login = async () => {
    const client = new TwitterApi({
      appKey: process.env.TWITTER_CONSUMER_KEY!!,
      appSecret: process.env.TWITTER_CONSUMER_SECRET!!,
      accessToken: token.credentials.authToken,
      accessSecret: "",
    });
    const { url, codeVerifier, state } = client.generateOAuth2AuthLink("/api/auth/twitter/callback", { scope: ['tweet.read', 'users.read'] });
  }

  return {
    login,
  };
}
