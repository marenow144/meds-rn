package com.meds;

import android.app.Application;

import com.facebook.react.ReactApplication;
import io.sentry.RNSentryPackage;
import com.dylanvann.fastimage.FastImageViewPackage;
import com.lugg.ReactNativeConfig.ReactNativeConfigPackage;
import io.invertase.firebase.RNFirebasePackage;
import com.reactlibrary.RNOpenCvLibraryPackage;
import com.reactnativecommunity.webview.RNCWebViewPackage;
import com.rnfs.RNFSPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.horcrux.svg.SvgPackage;
import org.reactnative.camera.RNCameraPackage;
import java.util.Arrays;
import java.util.List;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.messaging.RNFirebaseMessagingPackage;
import io.invertase.firebase.notifications.RNFirebaseNotificationsPackage;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new RNSentryPackage(),
            new FastImageViewPackage(),
            new ReactNativeConfigPackage(),
            new RNFirebasePackage(),
              new SvgPackage(),
              new RNCWebViewPackage(),
              new RNFSPackage(),
              new RNCameraPackage(),
              new RNOpenCvLibraryPackage(),
              //new RNFirebasePackage(),
              new RNFirebaseMessagingPackage(),
              new RNFirebaseNotificationsPackage(),
              new RNGestureHandlerPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
