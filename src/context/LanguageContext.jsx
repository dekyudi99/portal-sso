import React, { createContext, useContext, useState, useEffect } from 'react'

export const translations = {
  en: {
    portalBadge: "SSO Portal",
    welcome: "Welcome,",
    subtitle: "Select an application to launch your Single Sign-On session.",
    availableApps: "Available Applications",
    adminBadge: "Admin",
    launchApp: "Open",
    menuProfile: "Profile",
    menuSignOut: "Sign out",
    searchPlaceholder: "Search application...",
    noMatchText: "No application matching search query",
    noAccessTitle: "No Applications Assigned",
    noAccessDesc: "Your account does not have access permissions for any applications. Please contact an administrator.",
    userIdLabel: "User ID",
    themeDark: "Dark mode",
    themeLight: "Light mode",
    profileTitle: "Profile Settings",
    profileSubtitle: "Manage your personal account details from Keycloak",
    username: "Username",
    usernameHelp: "Username is managed by Keycloak and cannot be modified.",
    firstName: "First name",
    lastName: "Last name",
    email: "Email address",
    saveChanges: "Save Changes",
    saving: "Saving...",
    changePassword: "Change Password",
    changePasswordHelp: "Redirects to Keycloak security settings to change your password.",
    profileSaved: "Profile updated successfully.",
    profileError: "Failed to update profile. Please try again.",
    profileAccessError: "Cannot load account profile. Your account may lack the required permissions (view-profile / manage-account).",
    errFirstNameRequired: "First name is required.",
    errEmailInvalid: "A valid email address is required.",
    backToDashboard: "Back to Applications",
    apps: {
      voxagis: {
        name: "VoxaGIS",
        category: "Spatial Management",
        description: "Spatial management command center: manage GeoServer workspaces, publish raster & vector layers, and automated S2S pipelines.",
      },
      grovia: {
        name: "Grovia",
        category: "Biomass & Carbon",
        description: "Satellite-based mangrove biomass and carbon stock estimation platform integrated with Google Earth Engine remote sensing algorithms.",
      },
      flowgis: {
        name: "FlowGIS",
        category: "Flood Analytics",
        description: "Hydrological analysis and flood risk prediction platform with geosocial crowdsourcing and hazard monitoring.",
      },
      sipetani: {
        name: "SiPetani",
        category: "Agriculture GIS",
        description: "Agricultural spatial information system: commodity distribution, Subak and Gapoktan land monitoring in Buleleng Regency.",
      },
      wefgis_colab: {
        name: "App WefGIS",
        category: "WEF Nexus Analytics",
        description: "International collaboration platform for Water-Energy-Food nexus spatial mapping, phenology modeling, and remote sensing analysis.",
      },
    },
  },
  id: {
    portalBadge: "Portal SSO",
    welcome: "Selamat Datang,",
    subtitle: "Pilih aplikasi untuk langsung masuk menggunakan sesi Single Sign-On Anda.",
    availableApps: "Aplikasi Tersedia",
    adminBadge: "Admin",
    launchApp: "Buka",
    menuProfile: "Profil",
    menuSignOut: "Keluar",
    searchPlaceholder: "Cari aplikasi...",
    noMatchText: "Tidak ada aplikasi yang cocok dengan pencarian",
    noAccessTitle: "Belum Ada Akses Aplikasi",
    noAccessDesc: "Akun Anda saat ini belum memiliki izin role untuk mengakses platform dalam ekosistem ini. Silakan hubungi administrator sistem.",
    userIdLabel: "ID Akun",
    themeDark: "Mode Gelap",
    themeLight: "Mode Terang",
    profileTitle: "Pengaturan Profil",
    profileSubtitle: "Kelola data akun pribadi Anda yang terhubung dengan Keycloak",
    username: "Username",
    usernameHelp: "Username dikelola oleh Keycloak dan tidak dapat diubah.",
    firstName: "Nama Depan",
    lastName: "Nama Belakang",
    email: "Alamat Email",
    saveChanges: "Simpan Perubahan",
    saving: "Menyimpan...",
    changePassword: "Ubah Kata Sandi",
    changePasswordHelp: "Membuka halaman keamanan Keycloak untuk memperbarui kata sandi Anda.",
    profileSaved: "Profil berhasil diperbarui.",
    profileError: "Gagal memperbarui profil. Silakan coba lagi.",
    profileAccessError: "Tidak dapat memuat profil akun. Akun Anda mungkin belum memiliki izin (view-profile / manage-account).",
    errFirstNameRequired: "Nama depan wajib diisi.",
    errEmailInvalid: "Alamat email valid wajib diisi.",
    backToDashboard: "Kembali ke Aplikasi",
    apps: {
      voxagis: {
        name: "VoxaGIS",
        category: "Manajemen Spasial",
        description: "Pusat komando spasial untuk mengelola workspace GeoServer, publikasi layer raster & vektor, dan pipeline S2S otomatis.",
      },
      grovia: {
        name: "Grovia",
        category: "Biomassa & Karbon",
        description: "Platform estimasi stok biomassa dan karbon mangrove terintegrasi algoritma remote sensing Google Earth Engine.",
      },
      flowgis: {
        name: "FlowGIS",
        category: "Analisis Banjir",
        description: "Platform analisis hidrologi dan prediksi risiko banjir yang terintegrasi dengan pelaporan spasial bencana.",
      },
    },
  },
  th: {
    portalBadge: "พอร์ทัล SSO",
    welcome: "ยินดีต้อนรับ,",
    subtitle: "เลือกแอปพลิเคชันเพื่อเข้าสู่ระบบด้วยเซสชัน Single Sign-On ของคุณ",
    availableApps: "แอปพลิเคชันที่พร้อมใช้งาน",
    adminBadge: "ผู้ดูแลระบบ",
    launchApp: "เปิด",
    menuProfile: "โปรไฟล์",
    menuSignOut: "ออกจากระบบ",
    searchPlaceholder: "ค้นหาแอปพลิเคชัน...",
    noMatchText: "ไม่พบแอปพลิเคชันที่ค้นหา",
    noAccessTitle: "ยังไม่มีสิทธิ์เข้าถึงแอปพลิเคชัน",
    noAccessDesc: "บัญชีของคุณยังไม่ได้รับสิทธิ์ในการเข้าถึงแอปพลิเคชันใดๆ โปรดติดต่อผู้ดูแลระบบ",
    userIdLabel: "รหัสบัญชี",
    themeDark: "โหมดมืด",
    themeLight: "โหมดสว่าง",
    profileTitle: "ตั้งค่าโปรไฟล์",
    profileSubtitle: "จัดการข้อมูลบัญชีส่วนตัวของคุณที่เชื่อมต่อกับ Keycloak",
    username: "ชื่อผู้ใช้",
    usernameHelp: "ชื่อผู้ใช้ได้รับการจัดการโดย Keycloak และไม่สามารถแก้ไขได้",
    firstName: "ชื่อ",
    lastName: "นามสกุล",
    email: "ที่อยู่อีเมล",
    saveChanges: "บันทึกการเปลี่ยนแปลง",
    saving: "กำลังบันทึก...",
    changePassword: "เปลี่ยนรหัสผ่าน",
    changePasswordHelp: "เปิดการตั้งค่าความปลอดภัยของ Keycloak เพื่อเปลี่ยนรหัสผ่านของคุณ",
    profileSaved: "อัปเดตโปรไฟล์เรียบร้อยแล้ว",
    profileError: "ไม่สามารถอัปเดตโปรไฟล์ได้ โปรดลองอีกครั้ง",
    profileAccessError: "ไม่สามารถโหลดโปรไฟล์ได้ บัญชีของคุณอาจไม่มีสิทธิ์ที่จำเป็น (view-profile / manage-account)",
    errFirstNameRequired: "กรุณาระบุชื่อ",
    errEmailInvalid: "กรุณาระบุที่อยู่อีเมลที่ถูกต้อง",
    backToDashboard: "กลับสู่หน้ารวมแอปพลิเคชัน",
    apps: {
      voxagis: {
        name: "VoxaGIS",
        category: "การจัดการเชิงพื้นที่",
        description: "ศูนย์บัญชาการเชิงพื้นที่สำหรับจัดการเวิร์กสเปซ GeoServer เผยแพร่ข้อมูลเลเยอร์ และจัดการไปป์ไลน์อัตโนมัติ",
      },
      grovia: {
        name: "Grovia",
        category: "ชีวมวลและคาร์บอน",
        description: "แพลตฟอร์มประเมินชีวมวลและคาร์บอนป่าชายเลนด้วยการสำรวจระยะไกลผ่าน Google Earth Engine",
      },
      flowgis: {
        name: "FlowGIS",
        category: "การวิเคราะห์น้ำท่วม",
        description: "แพลตฟอร์มวิเคราะห์อุทกวิทยาและคาดการณ์ความเสี่ยงน้ำท่วม พร้อมระบบรายงานภัยพิบัติเชิงพื้นที่",
      },
    },
  },
}

const LanguageContext = createContext()

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('wefgis_lang')
      if (saved === 'en' || saved === 'id' || saved === 'th') return saved
    }
    return import.meta.env.VITE_DEFAULT_LANGUAGE || 'en'
  })

  useEffect(() => {
    localStorage.setItem('wefgis_lang', lang)
  }, [lang])

  const t = translations[lang] || translations.en

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

export default LanguageContext
