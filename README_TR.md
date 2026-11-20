

<div align="center">

# 📚 KampüsKitap
### Üniversite Öğrencileri İçin Kitap Alım-Satım Platformu

**[🇹🇷 Türkçe](README_TR.md) | [🇬🇧 English](README.md)**

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" />
</p>

*Üniversite öğrencilerinin ders kitaplarını kolayca bulabilmesi, kendi kitaplarını satışa çıkarabilmesi ve kampüs içerisinde kitap alışverişini daha erişilebilir hale getirmek amacıyla geliştirilmiş modern bir web platformu.*

</div>

---

## 🌟 Proje Hakkında

**KampüsKitap**, üniversite öğrencilerinin ders kitaplarını alıp satabilecekleri kullanıcı odaklı bir platformdur.

Öğrenciler ders kodlarına veya kitap isimlerine göre arama yapabilir, farklı satıcıların ilanlarını karşılaştırabilir ve kendi kitapları için satış ilanları oluşturabilir.

Platform, özellikle öğrencilerin ihtiyaç duydukları ders kitaplarına daha kolay ulaşmalarını ve kullanmadıkları kitapları diğer öğrencilerle buluşturmalarını hedefler.

## ✨ Temel Özellikler

- **🔍 Gelişmiş Kitap Arama:** Ders kodu, kitap adı veya bölüm bilgisine göre ilanları arayabilme.
- **🎯 Akıllı Filtreleme:** Kitapların durumuna (Yeni, Az kullanılmış, Yıpranmış) ve maksimum fiyatına göre filtreleme.
- **📚 Kitap İlanı Oluşturma:** Kitap adı, ders kodu, bölüm, fiyat, durum ve açıklama bilgileriyle yeni ilan oluşturabilme.
- **👤 Kullanıcı Hesap Sistemi:** E-posta ve şifre kullanarak kayıt olma ve giriş yapabilme.
- **🗂️ Kişisel Kitaplık Paneli:** Kullanıcıların kendi ilanlarını ve toplam ilan değerlerini görüntüleyebilmesi.
- **✏️ İlan Yönetimi:** Kullanıcıların kendi ilanlarını düzenleyebilmesi ve silebilmesi.
- **🔗 İlan Paylaşımı:** İlan bağlantısını kolayca kopyalayarak başkalarıyla paylaşabilme.
- **📖 İlgili Kitap Önerileri:** Aynı ders koduna sahip diğer kitap ilanlarını görüntüleyebilme.
- **🎨 Dinamik Kitap Kapakları:** Kitapların ait olduğu bölüme göre otomatik renk belirleyen görsel tasarım sistemi.
- **📱 Modern Arayüz:** Farklı ekran boyutlarına uyum sağlayan, kullanıcı deneyimi odaklı tasarım.

## 🛠️ Teknoloji Yığını

| Katman | Teknoloji | Kullanım Amacı |
| :--- | :--- | :--- |
| **Frontend** | Next.js 16 | Modern web uygulaması ve sayfa yönetimi |
| **UI Kütüphanesi** | React 19 | Kullanıcı arayüzü ve bileşen yönetimi |
| **Programlama Dili** | TypeScript | Tip güvenli ve sürdürülebilir kod geliştirme |
| **CSS Framework** | Tailwind CSS 4 | Modern ve duyarlı arayüz tasarımı |
| **Backend** | Next.js Server Actions | Sunucu tarafı işlemler ve iş mantığı |
| **Veritabanı** | PostgreSQL | İlişkisel veri depolama |
| **ORM** | Prisma 7 | Veritabanı modelleme ve veri işlemleri |
| **Kimlik Doğrulama** | Better Auth | Kullanıcı kayıt ve giriş işlemleri |
| **Versiyon Kontrolü** | Git & GitHub | Kaynak kod yönetimi |

## 🏗️ Proje Mimarisi

```text
kampus-kitap/
│
├── prisma/
│   ├── migrations/          # Veritabanı migration dosyaları
│   └── schema.prisma        # Veritabanı modelleri
│
├── public/                  # Statik dosyalar ve görseller
│
├── src/
│   ├── app/
│   │   ├── api/             # API rotaları
│   │   ├── giris/           # Kullanıcı giriş sayfası
│   │   ├── kayit/           # Kullanıcı kayıt sayfası
│   │   ├── ilan/
│   │   │   ├── yeni/        # Yeni ilan oluşturma
│   │   │   └── [id]/        # İlan detay ve düzenleme
│   │   ├── ilanlarim/       # Kullanıcıya ait ilanlar
│   │   ├── layout.tsx       # Ana uygulama düzeni
│   │   └── page.tsx         # Ana sayfa
│   │
│   ├── components/
│   │   ├── AuthPanel.tsx
│   │   ├── Header.tsx
│   │   ├── ListingForm.tsx
│   │   ├── ShareButton.tsx
│   │   └── DeleteListingButton.tsx
│   │
│   └── lib/
│       ├── auth.ts          # Kimlik doğrulama yapılandırması
│       ├── auth-client.ts   # İstemci tarafı kimlik doğrulama
│       ├── prisma.ts        # Veritabanı bağlantısı
│       └── cover.ts         # Dinamik kapak renkleri
│
├── .env                     # Ortam değişkenleri
├── package.json
└── README.md
```

## ⚙️ Kurulum ve Çalıştırma

### 1. Projeyi Klonlayın

```bash
git clone <repository-url>
cd kampus-kitap
```

### 2. Bağımlılıkları Yükleyin

```bash
npm install
```

### 3. Ortam Değişkenlerini Yapılandırın

Proje ana dizininde `.env.local` dosyası oluşturun:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/kampuskitap"
BETTER_AUTH_SECRET="your-secret-key"
BETTER_AUTH_URL="http://localhost:3000"
```

Kendi PostgreSQL bağlantı bilgilerinizi kullanın. Gizli anahtar ve veritabanı bilgilerinizi GitHub üzerinde paylaşmayın.

### 4. Veritabanını Hazırlayın

```bash
npx prisma migrate dev
npx prisma generate
```

### 5. Uygulamayı Başlatın

```bash
npm run dev
```

Uygulamaya aşağıdaki adres üzerinden erişebilirsiniz:

```text
http://localhost:3000
```

## 🔐 Güvenlik ve Veri Yönetimi

- Kullanıcı kimlik doğrulama işlemleri Better Auth üzerinden gerçekleştirilir.
- Şifre tabanlı kayıt ve giriş sistemi kullanılır.
- İlan düzenleme ve silme işlemleri yalnızca ilgili ilanın sahibi tarafından gerçekleştirilebilir.
- Giriş yapmamış kullanıcılar ilan oluşturma ve kişisel ilan yönetimi sayfalarına erişemez.
- Veritabanı işlemleri Prisma ORM aracılığıyla gerçekleştirilir.
- Hassas bağlantı bilgileri ortam değişkenlerinde tutulmalıdır.

## 🎯 Projenin Amacı

KampüsKitap'ın temel amacı, üniversite öğrencileri arasında ders kitabı alışverişini kolaylaştırmak, kullanılmayan kitapların yeniden değerlendirilmesini sağlamak ve öğrencilerin aradıkları kaynaklara daha kolay ulaşabilecekleri bir platform oluşturmaktır.

---

<div align="center">

**📚 KampüsKitap — Kitabını Bul, Kampüste Sat!**

*Made with ❤️ for university students.*

</div>

