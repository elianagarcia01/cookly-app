package com.cookly;

import android.content.ContentProvider;
import android.content.ContentValues;
import android.content.UriMatcher;
import android.database.Cursor;
import android.database.MatrixCursor;
import android.net.Uri;

public class FavoritesProvider extends ContentProvider {
    public static final String AUTHORITY = "com.cookly.favorites";
    public static final Uri CONTENT_URI = Uri.parse("content://" + AUTHORITY + "/favorites");

    private static final int FAVORITES = 1;
    private static final UriMatcher uriMatcher = new UriMatcher(UriMatcher.NO_MATCH);

    static {
        uriMatcher.addURI(AUTHORITY, "favorites", FAVORITES);
    }

    @Override
    public boolean onCreate() {
        return true;
    }

    @Override
    public Cursor query(Uri uri, String[] projection, String selection,
                        String[] selectionArgs, String sortOrder) {
        if (uriMatcher.match(uri) == FAVORITES) {
            MatrixCursor cursor = new MatrixCursor(new String[]{
                    "idMeal", "strMeal", "strCategory", "strMealThumb", "savedAt"
            });
            // Retorna cursor vacío — los datos reales están en op-sqlite
            return cursor;
        }
        return null;
    }

    @Override
    public String getType(Uri uri) {
        return "vnd.android.cursor.dir/vnd." + AUTHORITY + ".favorites";
    }

    @Override
    public Uri insert(Uri uri, ContentValues values) {
        return null;
    }

    @Override
    public int delete(Uri uri, String selection, String[] selectionArgs) {
        return 0;
    }

    @Override
    public int update(Uri uri, ContentValues values, String selection, String[] selectionArgs) {
        return 0;
    }
}