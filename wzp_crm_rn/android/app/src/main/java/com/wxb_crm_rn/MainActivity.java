package com.wxb_crm_rn;
import android.os.Bundle; // here 
import com.facebook.react.ReactActivity;
import org.devio.rn.splashscreen.SplashScreen; // here

import android.Manifest;
import android.os.Build;
import android.content.pm.PackageManager;
import com.pgyersdk.update.PgyUpdateManager;

import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;

public class MainActivity extends ReactActivity {

    private static final int REQUEST_CODE_READ_EXTERNAL_STORAGE_PERMISSIONS = 1;
    private static final int REQUEST_CODE_WRITE_EXTERNAL_STORAGE = 2;

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
     @Override
      protected void onCreate(Bundle savedInstanceState) { // here


         //动态请求权限
         if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
             if (checkSelfPermission(Manifest.permission.READ_EXTERNAL_STORAGE) != PackageManager.PERMISSION_GRANTED) {
                 requestPermissions(
                         new String[]{Manifest.permission.READ_EXTERNAL_STORAGE},
                         REQUEST_CODE_READ_EXTERNAL_STORAGE_PERMISSIONS);
                 requestPermissions(
                         new String[]{Manifest.permission.WRITE_EXTERNAL_STORAGE},
                         REQUEST_CODE_WRITE_EXTERNAL_STORAGE);
             }
         }

         // 蒲公英升级
         PgyUpdateManager.register(this);

         super.onCreate(savedInstanceState);
     }

     @Override
    protected ReactActivityDelegate createReactActivityDelegate() {
        SplashScreen.show(this);
        // PgyUpdateManager.register(this);

        return new ReactActivityDelegate(this, getMainComponentName()) {
        };
    }


    @Override
    protected String getMainComponentName() {
        return "wxb_crm_rn";
    }
}
