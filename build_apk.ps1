# PowerShell Build Script for AlgoMRI
# Usage: ./build_apk.ps1

Write-Host "🚀 Starting Build Process for AlgoMRI..." -ForegroundColor Cyan

# 1. Check for JDK 17
$javaVer = java -version 2>&1
if ($javaVer -match "17\.") {
    Write-Host "✅ JDK 17 detected." -ForegroundColor Green
} else {
    Write-Host "⚠️  Warning: Current Java version might not be 17. Please ensure JAVA_HOME points to JDK 17 explicitly if this build fails." -ForegroundColor Yellow
    $env:JAVA_HOME = "C:\Program Files\Java\jdk-17" # Update this path if your JDK 17 is elsewhere
    Write-Host "   Attempting to set JAVA_HOME to: $env:JAVA_HOME" -ForegroundColor Gray
}

# 2. Clear Expo Cache
Write-Host "`n🧹 Clearing Expo Cache..." -ForegroundColor Cyan
npx expo start -c --android --close

# 3. Clean Android Build
Write-Host "`n🧹 Cleaning Android Gradle Build..." -ForegroundColor Cyan
Set-Location android
./gradlew clean

# 4. Build Release APK
Write-Host "`n🏗️  Building Release APK..." -ForegroundColor Cyan
./gradlew assembleRelease

if ($?) {
    Write-Host "`n✅ Build Successful!" -ForegroundColor Green
    Write-Host "   APK Location: android\app\build\outputs\apk\release\app-release.apk" -ForegroundColor Green
} else {
    Write-Host "`n❌ Build Failed." -ForegroundColor Red
}

Set-Location ..
Write-Host "`nDone."
