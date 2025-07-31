import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// الترجمات لكل اللغات
const resources = {
  en: {
    translation: {
      "systemTitle": "Factory Management System",
      "autoCalculate": "Auto calculate final dimensions",
      "productDetails": "Product Details",
      "productName": "Product Name",
      "price": "Price",
      "componentData": "Component Data",
      "componentName": "Component Name",
      "quantity": "Quantity",
      "subcomponents": "Subcomponents",
      "addSubcomponent": "Add Subcomponent",
      "subcomponent": "Subcomponent",
      "pieceName": "Piece Name",
      "material": "Material",
      "count": "Count",
      "innerVeneer": "Inner Veneer",
      "outerVeneer": "Outer Veneer",
      "detailDimensions": "Detail Dimensions",
      "cuttingDimensions": "Cutting Dimensions",
      "finalDimensions": "Final Dimensions",
      "length": "Length",
      "width": "Width",
      "thickness": "Thickness",
      "notes": "Notes",
      "productionQuantity": "Production Quantity",
      "saveData": "Save Data",
      "calculate": "Calculate Final Dimensions",
      "cm": "cm",
      "currency": "EGP",
      "piece": "piece",
      "deleteComponent": "Delete Component",
      "settings": "Settings",
      "lightMode": "Light Mode",
      "darkMode": "Dark Mode",
      "missingData": "Missing data",
      "requiredFields": "The following fields are required:",
      "saveSuccess": "Saved successfully",
      "saveError": "Save error",
      "connectionError": "Connection error",
      "ok": "OK",
      "close": "Close"
    }
  },
  ar: {
    translation: {
      "systemTitle": "نظام إدارة المصنع",
      "autoCalculate": "الحساب التلقائي للمقاسات النهائية",
      "productDetails": "تفاصيل المنتج",
      "productName": "اسم المنتج",
      "price": "السعر",
      "componentData": "بيانات المكون",
      "componentName": "اسم المكون",
      "quantity": "الكمية",
      "subcomponents": "المكونات الفرعية",
      "addSubcomponent": "إضافة مكون فرعي",
      "subcomponent": "المكون الفرعي",
      "pieceName": "اسم القطعة",
      "material": "الخامة",
      "count": "العدد",
      "innerVeneer": "قشرة داخلية",
      "outerVeneer": "قشرة خارجية",
      "detailDimensions": "مقاسات التفصيل",
      "cuttingDimensions": "مقاسات التقصيب",
      "finalDimensions": "المقاسات النهائية",
      "length": "الطول",
      "width": "العرض",
      "thickness": "السُمك",
      "notes": "ملاحظات",
      "productionQuantity": "عدد الإنتاج",
      "saveData": "حفظ البيانات",
      "calculate": "حساب المقاسات النهائية",
      "cm": "سم",
      "currency": "جنيه",
      "piece": "قطعة",
      "deleteComponent": "حذف المكون",
      "settings": "الإعدادات",
      "lightMode": "الوضع النهاري",
      "darkMode": "الوضع الليلي",
      "missingData": "بيانات ناقصة",
      "requiredFields": "الحقول التالية مطلوبة:",
      "saveSuccess": "تم الحفظ بنجاح",
      "saveError": "خطأ في الحفظ",
      "connectionError": "خطأ في الاتصال",
      "ok": "حسناً",
      "close": "إغلاق"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'ar', // اللغة الافتراضية
    fallbackLng: 'ar',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;