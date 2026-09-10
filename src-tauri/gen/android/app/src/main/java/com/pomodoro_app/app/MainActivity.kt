package com.pomodoro_app.app

import android.graphics.Color
import android.os.Bundle
import androidx.activity.enableEdgeToEdge
import androidx.core.view.WindowCompat
import androidx.core.view.WindowInsetsControllerCompat

class MainActivity : TauriActivity() {
  override fun onCreate(savedInstanceState: Bundle?) {
        enableEdgeToEdge()
        super.onCreate(savedInstanceState)

        // Make navigation bar transparent
        WindowCompat.setDecorFitsSystemWindows(window, false)
        // window.setNavigationBarContrastEnforced(false)
        // window.navigationBarColor = Color.TRANSPARENT
        window.navigationBarColor = Color.argb(1,0,0,0)
        // window.statusBarColor = Color(0,0,0,1).toArgb()
    }
}