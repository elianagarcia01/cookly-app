package com.cookly;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.modules.core.DeviceEventManagerModule;

public class NetworkEventEmitter extends ReactContextBaseJavaModule {
    private static NetworkEventEmitter instance;
    private ReactApplicationContext reactContext;

    public NetworkEventEmitter(ReactApplicationContext context) {
        super(context);
        this.reactContext = context;
        instance = this;
    }

    public static NetworkEventEmitter getInstance() {
        return instance;
    }

    @Override
    public String getName() {
        return "NetworkEventEmitter";
    }

    public void sendNetworkStatus(boolean isConnected) {
        if (reactContext.hasActiveCatalystInstance()) {
            reactContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit("networkStatusChanged", isConnected);
        }
    }
}