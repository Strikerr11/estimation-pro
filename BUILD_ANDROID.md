# Build Android APK

## Prerequisites
1. Install Android Studio: https://developer.android.com/studio
2. Install JDK 17+: `brew install openjdk@17` (macOS) or download from https://adoptium.net/

## Quick Build (Debug APK)

```bash
# 1. Build the web app
npm run build

# 2. Sync to Android
npx cap sync android

# 3. Build debug APK
cd android && ./gradlew assembleDebug && cd ..

# APK location: android/app/build/outputs/apk/debug/app-debug.apk
```

## Build with Android Studio
```bash
npm run build
npx cap sync android
npx cap open android
# Then Build > Build Bundle(s) / APK(s) > Build APK(s) in Android Studio
```

## Release APK (Signed)
```bash
# Create keystore
keytool -genkey -v -keystore estimation-pro.keystore -alias estimation-pro -keyalg RSA -keysize 2048 -validity 10000

# Build release
cd android && ./gradlew assembleRelease && cd ..

# APK location: android/app/build/outputs/apk/release/app-release.apk
```

## iOS Build
```bash
npm run build
npx cap add ios    # first time only
npx cap sync ios
npx cap open ios   # opens Xcode
```

## Desktop (PWA - works on any OS)
The app is already a PWA. Visit in Chrome/Edge and click "Install" in the browser menu.
