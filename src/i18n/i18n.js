
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const savedLanguage = localStorage.getItem('language') || 'en';

const resources = {
  en: {
    translation: {
      brand: 'PATH2PRO',

      hero: {
        description:
          'Built for the next generation of Egyptian ballers. Showcase your skills, track your stats, and connect directly with top clubs and scouts.',
        featureOneTitle: 'Let Your Game Talk',
        featureOneText:
          'Share your best match moments, highlight your skills, and show scouts exactly what you bring to the pitch.',
        featureTwoTitle: 'Real Trial Offers',
        featureTwoText:
          'Receive official trial invitations directly on your dashboard from verified scouts—no middlemen, no fake promises.'
      },

      tabs: {
        login: 'LOGIN',
        register: 'REGISTER'
      },

      account: {
        chooseTitle: 'Choose Account Type',
        chooseDescription:
          'Select your primary role on the platform to get started.',
        player: 'Player',
        scout: 'Scout'
      },

      login: {
        title: 'Welcome Back',
        description:
          'Enter your email and password to access your account.',
        email: 'EMAIL ADDRESS',
        emailPlaceholder: 'james@gmail.com',
        password: 'Password',
        passwordPlaceholder: '••••••••',
        signIn: 'SIGN IN',
        signingIn: 'SIGNING IN...',
        failed: 'Login failed.',
        invalidRole: 'Invalid user role.'
      },

      register: {
        firstName: 'First Name',
        firstNamePlaceholder: 'Mohamed',
        lastName: 'Last Name',
        lastNamePlaceholder: 'Ahmed',
        email: 'Email Address',
        emailPlaceholder: 'james@gmail.com',
        password: 'Password',
        passwordPlaceholder: '•••••••••',
        passwordRequirements:
          'Minimum 9 characters, including an uppercase letter, lowercase letter, and number.',
        createAccount: 'CREATE ACCOUNT',
        creating: 'CREATING...',
        failed: 'Registration failed.',
        invalidRole: 'Invalid user role.'
      },

      errors: {
        serverConnection: 'Unable to connect to the server.'
      },

      language: {
        english: 'English',
        arabic: 'العربية'
      }
    }
  },

  ar: {
    translation: {
      brand: 'PATH2PRO',

      hero: {
        description:
          'صُممت منصتنا للجيل القادم من لاعبي كرة القدم المصريين. اعرض مهاراتك، وتابع إحصائياتك، وتواصل مباشرةً مع أفضل الأندية والكشافين.',
        featureOneTitle: 'دع مستواك يتحدث عنك',
        featureOneText:
          'شارك أفضل لحظات مبارياتك، وأبرز مهاراتك، وأظهر للكشافين بالضبط ما يمكنك تقديمه داخل الملعب.',
        featureTwoTitle: 'عروض تجارب حقيقية',
        featureTwoText:
          'احصل على دعوات رسمية للتجارب مباشرةً من الكشافين الموثقين، بدون وسطاء أو وعود وهمية.'
      },

      tabs: {
        login: 'تسجيل الدخول',
        register: 'إنشاء حساب'
      },

      account: {
        chooseTitle: 'اختر نوع الحساب',
        chooseDescription:
          'حدد دورك الأساسي على المنصة للبدء.',
        player: 'لاعب',
        scout: 'كشاف'
      },

      login: {
        title: 'مرحبًا بعودتك',
        description:
          'أدخل بريدك الإلكتروني وكلمة المرور للوصول إلى حسابك.',
        email: 'البريد الإلكتروني',
        emailPlaceholder: 'james@gmail.com',
        password: 'كلمة المرور',
        passwordPlaceholder: '••••••••',
        signIn: 'تسجيل الدخول',
        signingIn: 'جاري تسجيل الدخول...',
        failed: 'فشل تسجيل الدخول.',
        invalidRole: 'نوع المستخدم غير صالح.'
      },

      register: {
        firstName: 'الاسم الأول',
        firstNamePlaceholder: 'محمد',
        lastName: 'اسم العائلة',
        lastNamePlaceholder: 'أحمد',
        email: 'البريد الإلكتروني',
        emailPlaceholder: 'james@gmail.com',
        password: 'كلمة المرور',
        passwordPlaceholder: '•••••••••',
        passwordRequirements:
          'يجب أن تتكون كلمة المرور من 9 أحرف على الأقل، وتتضمن حرفًا كبيرًا وحرفًا صغيرًا ورقمًا.',
        createAccount: 'إنشاء الحساب',
        creating: 'جاري إنشاء الحساب...',
        failed: 'فشل إنشاء الحساب.',
        invalidRole: 'نوع المستخدم غير صالح.'
      },

      errors: {
        serverConnection: 'تعذر الاتصال بالخادم.'
      },

      language: {
        english: 'English',
        arabic: 'العربية'
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLanguage,
    fallbackLng: 'en',

    interpolation: {
      escapeValue: false
    }
  });

export default i18n;

