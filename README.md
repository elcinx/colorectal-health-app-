# Kolorektal Kanser Sağlık Destek Uygulaması 🏥

Bu uygulama, kolorektal kanser hastaları ve yakınları için geliştirilmiş, hastalık sürecini yönetmeyi ve takip etmeyi kolaylaştıran dijital bir sağlık asistanıdır.

## 🚀 Özellikler

- **Hasta Takibi:** Semptom yönetimi ve kan tahlili sonuçlarının dijital takibi.
- **Güvenli Kimlik Doğrulama:** Hasta ve yönetici (admin) rolleriyle güvenli giriş.
- **Eğitici İçerikler:** Hastalık süreci ve öneriler hakkında bilgilendirici sayfalar.
- **Semptom Günlüğü:** Günlük sağlık durumunun kaydedilmesi.
- **Yönetici Paneli:** Soru-cevap yönetimi ve hasta verilerinin izlenmesi.

## 🛠️ Teknoloji Yığını

- **Framework:** Expo SDK 54 (React Native)
- **Dil:** TypeScript
- **Navigasyon:** Expo Router
- **Durum Yönetimi:** Zustand
- **Animasyonlar:** React Native Reanimated v4
- **Tasarım:** Custom Modern UI System (Lexend Font & Dark Mode)

## 💻 Yerel Kurulum (Geliştiriciler İçin)

Projeyi kendi bilgisayarınızda çalıştırmak için:

1.  **Repoyu Klonlayın:**
    ```bash
    git clone https://github.com/elcinx/colorectal-health-app-.git
    cd colorectal-health-app-
    ```

2.  **Bağımlılıkları Yükleyin:**
    ```bash
    npm install
    ```

3.  **Uygulamayı Başlatın:**
    ```bash
    npx expo start
    ```

4.  **Telefonunuzda Çalıştırın:**
    - App Store veya Play Store'dan **"Expo Go"** uygulamasını indirin.
    - Terminalde çıkan QR kodu telefonunuzun kamerasıyla okutun.

## 📱 Test Kullanıcıları

Uygulamanın özelliklerini denemek için aşağıdaki hesapları kullanabilirsiniz:

| Rol | E-posta | Şifre |
| :--- | :--- | :--- |
| **Yönetici (Admin)** | `admin@test.com` | `herhangi bir şifre` |
| **Hasta (Patient)** | `hasta@test.com` | `herhangi bir şifre` |

## 📦 Build (APK/IPA) Alma

Uygulamanın kurulum dosyalarını (APK veya IPA) oluşturmak için Expo Application Services (EAS) kullanılır:

1.  **EAS CLI Kurulumu:** `npm install -g eas-cli`
2.  **Giriş Yapın:** `eas login`
3.  **Projeyi Yapılandırın:** `eas build:configure`
4.  **Android APK Oluşturma:**
    ```bash
    eas build -p android --profile preview
    ```
5.  **iOS IPA Oluşturma (Apple Developer Hesabı Gereklidir):**
    ```bash
    eas build -p ios --profile preview
    ```

---
*Bu proje insan odaklı sağlık çözümleri için tasarlanmıştır.* 💙
