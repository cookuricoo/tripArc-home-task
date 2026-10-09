# Source from the repository root: . scripts/local-env.sh
if [ -d "$PWD/.tools/java/Contents/Home" ]; then
  export JAVA_HOME="$PWD/.tools/java/Contents/Home"
  export PATH="$JAVA_HOME/bin:$PATH"
fi
if [ -d "$PWD/.tools/android-sdk" ]; then
  export ANDROID_HOME="$PWD/.tools/android-sdk"
fi
if [ -n "${ANDROID_HOME:-}" ]; then
  export PATH="$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator:$ANDROID_HOME/cmdline-tools/latest/bin:$PATH"
fi
export ANDROID_USER_HOME="$PWD/.tools/android-user"
export ANDROID_AVD_HOME="$PWD/.tools/avd"
export APPIUM_HOME="$PWD/.appium"
