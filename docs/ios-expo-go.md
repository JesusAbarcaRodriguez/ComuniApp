# 📱 Running ComuniApp on iPhone with Expo Go

## Background

Expo Go on iOS does not support React Native's **New Architecture**. For that reason, ComuniApp ships with the New Architecture disabled in `comuniApp/app.json`:

```json
{
  "expo": {
    "newArchEnabled": false
  }
}
```

If you re-enable it, the app will no longer run in Expo Go. See [Option 3](#option-3-development-build-advanced) instead.

---

## Option 1: Expo Go on the same network (recommended)

```bash
cd comuniApp
npx expo start --clear
```

On the iPhone:

1. Install or update **Expo Go** from the App Store
2. Connect to the **same Wi-Fi network** as your computer
3. Scan the QR code with the iOS **Camera** app
4. Tap the banner. The app opens in Expo Go

The first load takes around 30 seconds while the JavaScript bundle downloads.

---

## Option 2: Tunnel mode (network issues)

If the phone and the computer are on different networks, or a firewall blocks the connection:

```bash
npx expo start --tunnel
```

| ✅ Pros | ⚠️ Cons |
| --- | --- |
| Works across different networks | Slightly slower |
| Bypasses firewalls and VPNs | Requires a (free) Expo account |

---

## Option 3: Development build (advanced)

To use the New Architecture or native modules that Expo Go doesn't include, build a **development build**.

**Cloud build with EAS** (~15–20 min, free Expo account):

```bash
npm install -g eas-cli
eas login
eas build:configure
eas build --platform ios --profile development
```

**Local build** (macOS + Xcode only):

```bash
npx expo run:ios
```

---

## 🔧 Troubleshooting checklist

**Computer**

- [ ] `npx expo start` is running and shows an `exp://192.168.x.x:8081` address
- [ ] No firewall is blocking port `8081`

**iPhone**

- [ ] Expo Go is up to date
- [ ] Same Wi-Fi network as the computer
- [ ] No VPN active
- [ ] Camera permission granted

**Network**

- [ ] The router allows device-to-device traffic (AP isolation disabled)

---

## 🚨 Common errors

| Error | Cause | Fix |
| --- | --- | --- |
| `Unable to connect to Metro` | Network / firewall | `npx expo start --tunnel` |
| `Network response timed out` | Firewall or antivirus blocking Node.js | Add a firewall exception for Node.js |
| `newArchEnabled requires custom build` | New Architecture enabled in Expo Go | Set `"newArchEnabled": false` in `app.json` |
| `This QR code is not valid` | Stale cache or incompatible version | `npx expo start --clear`, or reinstall `node_modules` |

---

## 🔗 Useful links

- [Expo Go](https://docs.expo.dev/workflow/expo-go/)
- [Development builds](https://docs.expo.dev/develop/development-builds/introduction/)
- [Network troubleshooting](https://docs.expo.dev/troubleshooting/network/)
