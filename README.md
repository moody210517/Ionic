# On a Trouve APK Info 
Alias = onatrouve
Password=password

> jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore my-release-key.jks C:\Users\ACER\Desktop\30-MAI\lastclone\cdanslecoin\platforms\android\app\build\outputs\apk\release\app-release-unsigned.apk onatrouve

> C:\Users\ACER\AppData\Local\Android\Sdk\build-tools\28.0.3\zipalign -v 4 C:\Users\ACER\Desktop\30-MAI\lastclone\cdanslecoin\platforms\android\app\build\outputs\apk\release\app-release-unsigned.apk C:\Users\ACER\Desktop\30-MAI\lastclone\cdanslecoin\platforms\android\app\build\outputs\apk\release\onaTrouve.apk

> C:\Users\ACER\AppData\Local\Android\Sdk\build-tools\28.0.3\apksigner verify  C:\Users\ACER\Desktop\30-MAI\lastclone\cdanslecoin\platforms\android\app\build\outputs\apk\release\onaTrouve.apk

## Mac

> jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore my-release-key.jks /Users/macbookair/projects/ionic/on-a-trouve/platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk onatrouve

> /Users/macbookair/Library/Android/sdk/build-tools/29.0.2/zipalign -v 4 /Users/macbookair/projects/ionic/on-a-trouve/platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk /Users/macbookair/projects/ionic/on-a-trouve/platforms/android/app/build/outputs/apk/release/onatrouve.apk

> /Users/macbookair/Library/Android/sdk/build-tools/29.0.2/apksigner verify /Users/macbookair/projects/ionic/on-a-trouve/platforms/android/app/build/outputs/apk/release/onatrouve.apk