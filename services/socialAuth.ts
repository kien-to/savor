import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { makeRedirectUri } from 'expo-auth-session';
import { authService } from './auth';

WebBrowser.maybeCompleteAuthSession();

const GOOGLE_CLIENT_ID = {
  web: '956015678432-i466n4rhjumh3016vklq4cq5he4hvhgd.apps.googleusercontent.com',
  ios: '956015678432-mcgun19fkpv3jk3pu10lbhe40oqgvt7d.apps.googleusercontent.com',
  android: 'your-android-client-id.apps.googleusercontent.com'
};

const FACEBOOK_APP_ID = 'your-facebook-app-id';

export const googleConfig = {
  androidClientId: GOOGLE_CLIENT_ID.android,
  iosClientId: GOOGLE_CLIENT_ID.ios,
  webClientId: GOOGLE_CLIENT_ID.web,
  redirectUri: makeRedirectUri({
    scheme: 'savor',
    path: 'auth'
  })
};

export const socialAuthService = {
  async handleGoogleLogin(promptAsync: () => Promise<any>) {
    try {
      const result = await promptAsync();
      if (result?.type === 'success') {
        const { authentication } = result;
        return await authService.socialLogin({
          provider: 'google',
          token: authentication.accessToken
        });
      }
      throw new Error('Google login failed');
    } catch (error) {
      throw error;
    }
  },

  async handleFacebookLogin() {
    try {
      const result = await WebBrowser.openAuthSessionAsync(
        `https://www.facebook.com/v12.0/dialog/oauth?` +
        `client_id=${FACEBOOK_APP_ID}&` +
        `response_type=token&` +
        `redirect_uri=${encodeURIComponent(googleConfig.redirectUri)}`,
        googleConfig.redirectUri
      );

      if (result.type === 'success') {
        const token = result.url.split('access_token=')[1].split('&')[0];
        return await authService.socialLogin({
          provider: 'facebook',
          token
        });
      }
      throw new Error('Facebook login cancelled');
    } catch (error) {
      throw error;
    }
  }
};