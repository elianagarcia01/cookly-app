package com.cookly;

import android.app.Service;
import android.content.Intent;
import android.os.Handler;
import android.os.IBinder;
import android.os.Looper;
import android.util.Log;

public class FavoritesService extends Service {
    private static final String TAG = "FavoritesService";
    private Handler handler;
    private Runnable syncTask;
    private static final long SYNC_INTERVAL = 30000; // 30 segundos

    @Override
    public void onCreate() {
        super.onCreate();
        handler = new Handler(Looper.getMainLooper());
        syncTask = new Runnable() {
            @Override
            public void run() {
                syncFavorites();
                handler.postDelayed(this, SYNC_INTERVAL);
            }
        };
        Log.d(TAG, "FavoritesService creado");
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        Log.d(TAG, "FavoritesService iniciado");
        handler.post(syncTask);
        return START_STICKY;
    }

    private void syncFavorites() {
        Log.d(TAG, "Sincronizando favoritos en background...");
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        handler.removeCallbacks(syncTask);
        Log.d(TAG, "FavoritesService detenido");
    }

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }
}