package com.wxb_crm_rn;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.clipsub.RNShake.RNShakeEventPackage;
import com.dylanvann.fastimage.FastImageViewPackage;
import com.imagepicker.ImagePickerPackage;
import org.wonday.pdf.RCTPdfView;
import com.RNFetchBlob.RNFetchBlobPackage;
//import com.microsoft.codepush.react.CodePush;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import com.beefe.picker.PickerViewPackage;
import org.reactnative.camera.RNCameraPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

import com.wxb_crm_rn.xgpush.XGPushPackage;
import com.theweflex.react.WeChatPackage;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {

//        @Override
//        protected String getJSBundleFile() {
//        return CodePush.getJSBundleFile();
//        }
    
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new RNShakeEventPackage(),
            new FastImageViewPackage(),
            new ImagePickerPackage(),
            new RCTPdfView(),
            new RNFetchBlobPackage(),
//            new CodePush(BuildConfig.CODEPUSH_KEY, getApplicationContext(), BuildConfig.DEBUG),
            new SplashScreenReactPackage(),
            new PickerViewPackage(),
            new RNCameraPackage(),
            new VectorIconsPackage(),
            new XGPushPackage(),
              new WeChatPackage()
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
