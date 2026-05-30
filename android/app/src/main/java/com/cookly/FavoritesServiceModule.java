package com.cookly;

import android.content.Intent;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class FavoritesServiceModule extends ReactContextBaseJavaModule {
    private ReactApplicationContext reactContext;

    public FavoritesServiceModule(ReactApplicationContext context) {
        super(context);
        this.reactContext = context;
    }

    @Override
    public String getName() {
        return "FavoritesServiceModule";
    }

    @ReactMethod
    public void start() {
        Intent intent = new Intent(reactContext, FavoritesService.class);
        reactContext.startService(intent);
    }

    @ReactMethod
    public void stop() {
        Intent intent = new Intent(reactContext, FavoritesService.class);
        reactContext.stopService(intent);
    }
}