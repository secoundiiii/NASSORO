import JSZip from 'jszip';

export interface AndroidProjectOptions {
  appName: string;
  packageName: string;
  versionName: string;
  versionCode: number;
  appUrl: string;
}

export async function generateAndroidProjectZip(options: AndroidProjectOptions): Promise<Blob> {
  const zip = new JSZip();
  const pkgDir = options.packageName.replace(/\./g, '/');

  // Root build.gradle
  zip.file(
    'build.gradle',
    `// Top-level build file where you can add configuration options common to all sub-projects/modules.
buildscript {
    ext.kotlin_version = "1.9.22"
    repositories {
        google()
        mavenCentral()
    }
    dependencies {
        classpath "com.android.tools.build:gradle:8.2.2"
        classpath "org.jetbrains.kotlin:kotlin-gradle-plugin:$kotlin_version"
    }
}

allprojects {
    repositories {
        google()
        mavenCentral()
    }
}

task clean(type: Delete) {
    delete rootProject.buildDir
}
`
  );

  // settings.gradle
  zip.file(
    'settings.gradle',
    `pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}
rootProject.name = "${options.appName.replace(/\s+/g, '')}"
include ':app'
`
  );

  // gradle.properties
  zip.file(
    'gradle.properties',
    `org.gradle.jvmargs=-Xmx2048m -Dfile.encoding=UTF-8
android.useAndroidX=true
android.enableJetifier=true
kotlin.code.style=official
android.nonTransitiveRClass=true
`
  );

  // gradle-wrapper.properties
  zip.file(
    'gradle/wrapper/gradle-wrapper.properties',
    `distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
distributionUrl=https\\://services.gradle.org/distributions/gradle-8.4-bin.zip
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists
`
  );

  // gradlew Unix script
  zip.file(
    'gradlew',
    `#!/bin/sh
# Gradle startup script for POSIX systems
DIRNAME="\$(cd "\$(dirname "\$0")" && pwd)"
exec "\$DIRNAME/gradle/wrapper/gradle-wrapper.jar" "\$@"
`,
    { unixPermissions: '755' }
  );

  // gradlew.bat Windows script
  zip.file(
    'gradlew.bat',
    `@rem Gradle startup script for Windows
@if "%DEBUG%" == "" @echo off
set DIRNAME=%~dp0
if "%DIRNAME%" == "" set DIRNAME=.
gradle\\wrapper\\gradle-wrapper.jar %*
`
  );

  // app/build.gradle
  zip.file(
    'app/build.gradle',
    `plugins {
    id 'com.android.application'
    id 'org.jetbrains.kotlin.android'
}

android {
    namespace '${options.packageName}'
    compileSdk 34

    defaultConfig {
        applicationId "${options.packageName}"
        minSdk 24
        targetSdk 34
        versionCode ${options.versionCode}
        versionName "${options.versionName}"

        testInstrumentationRunner "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        debug {
            debuggable true
            applicationIdSuffix ".debug"
            versionNameSuffix "-DEBUG"
            signingConfig signingConfigs.debug
        }
        release {
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }

    compileOptions {
        sourceCompatibility JavaVersion.VERSION_17
        targetCompatibility JavaVersion.VERSION_17
    }

    kotlinOptions {
        jvmTarget = '17'
    }

    buildFeatures {
        viewBinding false
    }
}

dependencies {
    implementation 'androidx.core:core-ktx:1.12.0'
    implementation 'androidx.appcompat:appcompat:1.6.1'
    implementation 'com.google.android.material:material:1.11.0'
    implementation 'androidx.webkit:webkit:1.10.0'
    implementation 'androidx.swiperefreshlayout:swiperefreshlayout:1.1.0'
}
`
  );

  // app/proguard-rules.pro
  zip.file(
    'app/proguard-rules.pro',
    `# Add project specific ProGuard rules here.
-keepattributes JavascriptInterface
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}
`
  );

  // app/src/main/AndroidManifest.xml
  zip.file(
    'app/src/main/AndroidManifest.xml',
    `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <!-- Permissions required for full Android App & Mobile experience -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.VIBRATE" />
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
    <uses-permission android:name="android.permission.CAMERA" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:usesCleartextTraffic="true"
        android:hardwareAccelerated="true"
        android:theme="@style/Theme.DroidCraft">

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:configChanges="orientation|screenSize|keyboardHidden|screenLayout"
            android:windowSoftInputMode="adjustResize"
            android:theme="@style/Theme.DroidCraft">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>

</manifest>
`
  );

  // app/src/main/java/{pkg}/MainActivity.kt
  zip.file(
    `app/src/main/java/${pkgDir}/MainActivity.kt`,
    `package ${options.packageName}

import android.annotation.SuppressLint
import android.content.Context
import android.graphics.Bitmap
import android.net.ConnectivityManager
import android.net.NetworkCapabilities
import android.os.Bundle
import android.view.View
import android.webkit.*
import android.widget.ProgressBar
import android.widget.Toast
import androidx.activity.OnBackPressedCallback
import androidx.appcompat.app.AppCompatActivity
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout

class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView
    private lateinit var swipeRefresh: SwipeRefreshLayout
    private lateinit var progressBar: ProgressBar

    // The target Web & Mobile application URL
    private val appUrl = "${options.appUrl}"

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Native layout programmatic creation
        val rootLayout = android.widget.RelativeLayout(this).apply {
            layoutParams = android.view.ViewGroup.LayoutParams(
                android.view.ViewGroup.LayoutParams.MATCH_PARENT,
                android.view.ViewGroup.LayoutParams.MATCH_PARENT
            )
            setBackgroundColor(android.graphics.Color.parseColor("#020617"))
        }

        swipeRefresh = SwipeRefreshLayout(this).apply {
            layoutParams = android.view.ViewGroup.LayoutParams(
                android.view.ViewGroup.LayoutParams.MATCH_PARENT,
                android.view.ViewGroup.LayoutParams.MATCH_PARENT
            )
            setColorSchemeColors(android.graphics.Color.parseColor("#10B981"))
        }

        webView = WebView(this).apply {
            layoutParams = android.view.ViewGroup.LayoutParams(
                android.view.ViewGroup.LayoutParams.MATCH_PARENT,
                android.view.ViewGroup.LayoutParams.MATCH_PARENT
            )
            setBackgroundColor(android.graphics.Color.parseColor("#020617"))
        }

        progressBar = ProgressBar(this, null, android.R.attr.progressBarStyleHorizontal).apply {
            layoutParams = android.widget.RelativeLayout.LayoutParams(
                android.widget.RelativeLayout.LayoutParams.MATCH_PARENT,
                8
            ).apply {
                addRule(android.widget.RelativeLayout.ALIGN_PARENT_TOP)
            }
            visibility = View.GONE
        }

        swipeRefresh.addView(webView)
        rootLayout.addView(swipeRefresh)
        rootLayout.addView(progressBar)
        setContentView(rootLayout)

        configureWebView()
        setupBackHandler()

        swipeRefresh.setOnRefreshListener {
            webView.reload()
        }

        loadApp()
    }

    @SuppressLint("SetJavaScriptEnabled")
    private fun configureWebView() {
        val settings = webView.settings
        settings.javaScriptEnabled = true
        settings.domStorageEnabled = true
        settings.databaseEnabled = true
        settings.allowFileAccess = true
        settings.cacheMode = if (isNetworkAvailable()) WebSettings.LOAD_DEFAULT else WebSettings.LOAD_CACHE_ELSE_NETWORK
        settings.mixedContentMode = WebSettings.MIXED_CONTENT_ALWAYS_ALLOW
        settings.mediaPlaybackRequiresUserGesture = false
        settings.useWideViewPort = true
        settings.loadWithOverviewMode = true

        // User Agent customization for Android App wrapper
        val defaultUserAgent = settings.userAgentString
        settings.userAgentString = "$defaultUserAgent DroidCraftApp/1.0.0 (Android Native Wrapper)"

        webView.webViewClient = object : WebViewClient() {
            override fun onPageStarted(view: WebView?, url: String?, favicon: Bitmap?) {
                super.onPageStarted(view, url, favicon)
                progressBar.visibility = View.VISIBLE
            }

            override fun onPageFinished(view: WebView?, url: String?) {
                super.onPageFinished(view, url)
                progressBar.visibility = View.GONE
                swipeRefresh.isRefreshing = false
            }

            override fun onReceivedError(view: WebView?, request: WebResourceRequest?, error: WebResourceError?) {
                super.onReceivedError(view, request, error)
                if (request?.isForMainFrame == true && !isNetworkAvailable()) {
                    Toast.makeText(this@MainActivity, "Offline: Running cached mobile version", Toast.LENGTH_SHORT).show()
                }
            }
        }

        webView.webChromeClient = object : WebChromeClient() {
            override fun onProgressChanged(view: WebView?, newProgress: Int) {
                progressBar.progress = newProgress
                if (newProgress >= 100) {
                    progressBar.visibility = View.GONE
                }
            }
        }
    }

    private fun setupBackHandler() {
        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                if (webView.canGoBack()) {
                    webView.goBack()
                } else {
                    isEnabled = false
                    onBackPressedDispatcher.onBackPressed()
                }
            }
        })
    }

    private fun loadApp() {
        webView.loadUrl(appUrl)
    }

    private fun isNetworkAvailable(): Boolean {
        val cm = getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager
        val network = cm.activeNetwork ?: return false
        val capabilities = cm.getNetworkCapabilities(network) ?: return false
        return capabilities.hasCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET)
    }
}
`
  );

  // app/src/main/res/values/strings.xml
  zip.file(
    'app/src/main/res/values/strings.xml',
    `<resources>
    <string name="app_name">${options.appName}</string>
</resources>
`
  );

  // app/src/main/res/values/colors.xml
  zip.file(
    'app/src/main/res/values/colors.xml',
    `<resources>
    <color name="primary">#10B981</color>
    <color name="primary_dark">#059669</color>
    <color name="accent">#38BDF8</color>
    <color name="background">#020617</color>
    <color name="surface">#0F172A</color>
</resources>
`
  );

  // app/src/main/res/values/styles.xml
  zip.file(
    'app/src/main/res/values/styles.xml',
    `<resources>
    <style name="Theme.DroidCraft" parent="Theme.MaterialComponents.DayNight.NoActionBar">
        <item name="colorPrimary">@color/primary</item>
        <item name="colorPrimaryDark">@color/background</item>
        <item name="colorAccent">@color/accent</item>
        <item name="android:windowBackground">@color/background</item>
        <item name="android:statusBarColor">@color/background</item>
        <item name="android:navigationBarColor">@color/background</item>
    </style>
</resources>
`
  );

  // Adaptive icon XML
  zip.file(
    'app/src/main/res/mipmap-anydpi-v26/ic_launcher.xml',
    `<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@color/surface" />
    <foreground android:drawable="@color/primary" />
</adaptive-icon>
`
  );

  zip.file(
    'app/src/main/res/mipmap-anydpi-v26/ic_launcher_round.xml',
    `<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@color/surface" />
    <foreground android:drawable="@color/primary" />
</adaptive-icon>
`
  );

  // GitHub Actions workflow for zero-setup cloud build of app-debug.apk
  zip.file(
    '.github/workflows/build-apk.yml',
    `name: Build Android Debug APK

on:
  push:
    branches: [ "main", "master" ]
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v4

    - name: Set up JDK 17
      uses: actions/setup-java@v4
      with:
        java-version: '17'
        distribution: 'temurin'
        cache: gradle

    - name: Grant execute permission for gradlew
      run: chmod +x gradlew

    - name: Build Debug APK with Gradle
      run: ./gradlew assembleDebug --stacktrace

    - name: Upload Debug APK Artifact
      uses: actions/upload-artifact@v4
      with:
        name: app-debug.apk
        path: app/build/outputs/apk/debug/app-debug.apk
`
  );

  // build-apk.sh quick runner script
  zip.file(
    'build-apk.sh',
    `#!/bin/bash
# ========================================================
# DroidCraft - One-Command Android Debug APK Builder
# ========================================================
set -e

echo "🔨 Building Debug APK for ${options.appName}..."

if [ ! -f "gradlew" ]; then
    echo "❌ Error: gradlew not found in current directory."
    exit 1
fi

chmod +x gradlew
./gradlew assembleDebug

echo ""
echo "✅ Build SUCCESSFUL!"
echo "📦 Your installable Debug APK is ready at:"
echo "👉 app/build/outputs/apk/debug/app-debug.apk"
echo ""
echo "📲 To install on your connected Android phone via USB/Wi-Fi:"
echo "   adb install -r app/build/outputs/apk/debug/app-debug.apk"
echo ""
`,
    { unixPermissions: '755' }
  );

  // README with clear step-by-step instructions
  zip.file(
    'README-BUILD-APK.md',
    `# 📱 ${options.appName} - Android Studio Debug APK Project

This project contains everything needed to compile and install **${options.appName}** as a native Debug APK (\`app-debug.apk\`) on any Android phone.

---

## ⚡ Method 1: Instant Build with 1 Command (Linux / macOS / WSL)
\`\`\`bash
chmod +x build-apk.sh
./build-apk.sh
\`\`\`
The generated APK will be at:
\`app/build/outputs/apk/debug/app-debug.apk\`

To install on your phone directly:
\`\`\`bash
adb install -r app/build/outputs/apk/debug/app-debug.apk
\`\`\`

---

## 💻 Method 2: Open in Android Studio
1. Open **Android Studio**.
2. Select **File -> Open...** and pick this unzipped folder.
3. Wait for Gradle Sync to finish.
4. Click **Build -> Build Bundle(s) / APK(s) -> Build APK(s)**.
5. In the bottom-right popup, click **"locate"** to find \`app-debug.apk\`.
6. Transfer the APK file to your phone via USB, Google Drive, WhatsApp, or Bluetooth, tap it, and choose **Install**!

---

## ☁️ Method 3: Cloud Build via GitHub Actions (Zero Local Tools Needed)
1. Push this folder to a GitHub repository.
2. Go to the **Actions** tab in GitHub.
3. The included workflow \`.github/workflows/build-apk.yml\` will build your APK automatically in ~2 minutes!
4. Download the ready \`app-debug.apk\` directly from the job summary.

---

## 📲 Method 4: Build directly ON your Android phone with Termux
If you don't have a PC, you can build the APK right on your Android phone using Termux:
\`\`\`bash
pkg update && pkg install openjdk-17 gradle
gradle assembleDebug
\`\`\`

---
*Created with DroidCraft Studio*
`
  );

  return await zip.generateAsync({ type: 'blob' });
}
