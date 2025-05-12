/**
 * 本地化工具
 * 提供多语言支持和翻译功能
 */

/**
 * 本地化类
 * 管理翻译和本地化设置
 */
class Localization {
  constructor() {
    this.translations = {
      en: {},
      fr: {},
      zh: {}
    };
    
    this.loadTranslations();
  }
  
  /**
   * 加载翻译
   * 从翻译文件加载所有支持语言的翻译
   */
  loadTranslations() {
    try {
      this.translations.en = require('../locales/en.json');
      
      this.translations.fr = require('../locales/fr.json');
      
      this.translations.zh = require('../locales/zh.json');
      
      console.log('翻译加载成功');
    } catch (error) {
      console.error('加载翻译失败:', error);
      
      this.loadFallbackTranslations();
    }
  }
  
  /**
   * 加载备用翻译
   * 当无法从文件加载翻译时使用的基本翻译
   */
  loadFallbackTranslations() {
    this.translations.en = {
      common: {
        welcome: 'Welcome to ThinkForward AI',
        login: 'Login',
        register: 'Register',
        logout: 'Logout',
        profile: 'Profile',
        settings: 'Settings',
        save: 'Save',
        cancel: 'Cancel',
        delete: 'Delete',
        edit: 'Edit',
        view: 'View',
        search: 'Search',
        filter: 'Filter',
        sort: 'Sort',
        next: 'Next',
        previous: 'Previous',
        submit: 'Submit',
        loading: 'Loading...',
        error: 'An error occurred',
        success: 'Success',
        warning: 'Warning',
        info: 'Information',
        required: 'Required',
        optional: 'Optional',
        yes: 'Yes',
        no: 'No',
        or: 'or',
        and: 'and',
        all: 'All',
        none: 'None',
        select: 'Select',
        clear: 'Clear',
        close: 'Close',
        open: 'Open',
        show: 'Show',
        hide: 'Hide',
        add: 'Add',
        remove: 'Remove',
        create: 'Create',
        update: 'Update',
        confirm: 'Confirm',
        back: 'Back',
        home: 'Home'
      },
      auth: {
        email: 'Email',
        password: 'Password',
        confirmPassword: 'Confirm Password',
        firstName: 'First Name',
        lastName: 'Last Name',
        displayName: 'Display Name',
        forgotPassword: 'Forgot Password?',
        resetPassword: 'Reset Password',
        changePassword: 'Change Password',
        currentPassword: 'Current Password',
        newPassword: 'New Password',
        confirmNewPassword: 'Confirm New Password',
        loginSuccess: 'Login successful',
        registerSuccess: 'Registration successful',
        logoutSuccess: 'Logout successful',
        passwordResetSuccess: 'Password reset successful',
        passwordChangeSuccess: 'Password changed successfully',
        verifyEmail: 'Verify Email',
        emailVerified: 'Email verified successfully',
        resendVerification: 'Resend Verification Email',
        verificationSent: 'Verification email sent',
        resetPasswordInstructions: 'Enter your email address and we will send you instructions to reset your password',
        resetPasswordEmailSent: 'Password reset email sent',
        invalidCredentials: 'Invalid email or password',
        accountLocked: 'Account locked. Please try again later',
        passwordMismatch: 'Passwords do not match',
        passwordTooShort: 'Password must be at least 8 characters long',
        emailAlreadyExists: 'Email already exists',
        invalidToken: 'Invalid or expired token',
        twoFactorAuth: 'Two-Factor Authentication',
        setupTwoFactor: 'Setup Two-Factor Authentication',
        verifyTwoFactor: 'Verify Two-Factor Authentication',
        twoFactorEnabled: 'Two-Factor Authentication enabled',
        twoFactorDisabled: 'Two-Factor Authentication disabled',
        enterVerificationCode: 'Enter verification code',
        invalidVerificationCode: 'Invalid verification code'
      },
      profile: {
        personalInfo: 'Personal Information',
        contactInfo: 'Contact Information',
        education: 'Education',
        workExperience: 'Work Experience',
        languages: 'Languages',
        documents: 'Documents',
        preferences: 'Preferences',
        security: 'Security',
        privacy: 'Privacy',
        notifications: 'Notifications',
        accountSettings: 'Account Settings',
        deleteAccount: 'Delete Account',
        downloadData: 'Download Your Data',
        updateProfile: 'Update Profile',
        profileUpdated: 'Profile updated successfully',
        uploadPhoto: 'Upload Photo',
        removePhoto: 'Remove Photo',
        phoneNumber: 'Phone Number',
        address: 'Address',
        city: 'City',
        province: 'Province',
        country: 'Country',
        postalCode: 'Postal Code',
        dateOfBirth: 'Date of Birth',
        gender: 'Gender',
        nationality: 'Nationality',
        maritalStatus: 'Marital Status',
        dependents: 'Dependents',
        occupation: 'Occupation',
        bio: 'Bio',
        website: 'Website',
        socialMedia: 'Social Media'
      },
      errors: {
        required: '{field} is required',
        minLength: '{field} must be at least {min} characters',
        maxLength: '{field} must be at most {max} characters',
        email: 'Please enter a valid email address',
        passwordMatch: 'Passwords must match',
        invalidDate: 'Please enter a valid date',
        invalidNumber: 'Please enter a valid number',
        invalidPhone: 'Please enter a valid phone number',
        invalidUrl: 'Please enter a valid URL',
        serverError: 'Server error. Please try again later',
        notFound: 'Not found',
        unauthorized: 'Unauthorized access',
        forbidden: 'Forbidden access',
        badRequest: 'Bad request',
        conflict: 'Conflict',
        tooManyRequests: 'Too many requests. Please try again later',
        timeout: 'Request timeout. Please try again',
        offline: 'You are offline. Please check your internet connection',
        unknown: 'An unknown error occurred'
      }
    };
    
    this.translations.fr = {
      common: {
        welcome: 'Bienvenue à ThinkForward AI',
        login: 'Connexion',
        register: 'S\'inscrire',
        logout: 'Déconnexion',
        profile: 'Profil',
        settings: 'Paramètres',
        save: 'Enregistrer',
        cancel: 'Annuler',
        delete: 'Supprimer',
        edit: 'Modifier',
        view: 'Voir',
        search: 'Rechercher',
        filter: 'Filtrer',
        sort: 'Trier',
        next: 'Suivant',
        previous: 'Précédent',
        submit: 'Soumettre',
        loading: 'Chargement...',
        error: 'Une erreur est survenue',
        success: 'Succès',
        warning: 'Avertissement',
        info: 'Information',
        required: 'Obligatoire',
        optional: 'Optionnel',
        yes: 'Oui',
        no: 'Non',
        or: 'ou',
        and: 'et',
        all: 'Tous',
        none: 'Aucun',
        select: 'Sélectionner',
        clear: 'Effacer',
        close: 'Fermer',
        open: 'Ouvrir',
        show: 'Afficher',
        hide: 'Masquer',
        add: 'Ajouter',
        remove: 'Supprimer',
        create: 'Créer',
        update: 'Mettre à jour',
        confirm: 'Confirmer',
        back: 'Retour',
        home: 'Accueil'
      },
      auth: {
        email: 'Email',
        password: 'Mot de passe',
        confirmPassword: 'Confirmer le mot de passe',
        firstName: 'Prénom',
        lastName: 'Nom',
        displayName: 'Nom d\'affichage',
        forgotPassword: 'Mot de passe oublié?',
        resetPassword: 'Réinitialiser le mot de passe',
        changePassword: 'Changer le mot de passe',
        currentPassword: 'Mot de passe actuel',
        newPassword: 'Nouveau mot de passe',
        confirmNewPassword: 'Confirmer le nouveau mot de passe',
        loginSuccess: 'Connexion réussie',
        registerSuccess: 'Inscription réussie',
        logoutSuccess: 'Déconnexion réussie',
        passwordResetSuccess: 'Réinitialisation du mot de passe réussie',
        passwordChangeSuccess: 'Changement de mot de passe réussi',
        verifyEmail: 'Vérifier l\'email',
        emailVerified: 'Email vérifié avec succès',
        resendVerification: 'Renvoyer l\'email de vérification',
        verificationSent: 'Email de vérification envoyé',
        resetPasswordInstructions: 'Entrez votre adresse email et nous vous enverrons des instructions pour réinitialiser votre mot de passe',
        resetPasswordEmailSent: 'Email de réinitialisation du mot de passe envoyé',
        invalidCredentials: 'Email ou mot de passe invalide',
        accountLocked: 'Compte verrouillé. Veuillez réessayer plus tard',
        passwordMismatch: 'Les mots de passe ne correspondent pas',
        passwordTooShort: 'Le mot de passe doit comporter au moins 8 caractères',
        emailAlreadyExists: 'L\'email existe déjà',
        invalidToken: 'Jeton invalide ou expiré',
        twoFactorAuth: 'Authentification à deux facteurs',
        setupTwoFactor: 'Configurer l\'authentification à deux facteurs',
        verifyTwoFactor: 'Vérifier l\'authentification à deux facteurs',
        twoFactorEnabled: 'Authentification à deux facteurs activée',
        twoFactorDisabled: 'Authentification à deux facteurs désactivée',
        enterVerificationCode: 'Entrez le code de vérification',
        invalidVerificationCode: 'Code de vérification invalide'
      }
    };
    
    this.translations.zh = {
      common: {
        welcome: '欢迎使用ThinkForward AI',
        login: '登录',
        register: '注册',
        logout: '退出登录',
        profile: '个人资料',
        settings: '设置',
        save: '保存',
        cancel: '取消',
        delete: '删除',
        edit: '编辑',
        view: '查看',
        search: '搜索',
        filter: '筛选',
        sort: '排序',
        next: '下一步',
        previous: '上一步',
        submit: '提交',
        loading: '加载中...',
        error: '发生错误',
        success: '成功',
        warning: '警告',
        info: '信息',
        required: '必填',
        optional: '选填',
        yes: '是',
        no: '否',
        or: '或',
        and: '和',
        all: '全部',
        none: '无',
        select: '选择',
        clear: '清除',
        close: '关闭',
        open: '打开',
        show: '显示',
        hide: '隐藏',
        add: '添加',
        remove: '移除',
        create: '创建',
        update: '更新',
        confirm: '确认',
        back: '返回',
        home: '首页'
      },
      auth: {
        email: '电子邮箱',
        password: '密码',
        confirmPassword: '确认密码',
        firstName: '名字',
        lastName: '姓氏',
        displayName: '显示名称',
        forgotPassword: '忘记密码？',
        resetPassword: '重置密码',
        changePassword: '更改密码',
        currentPassword: '当前密码',
        newPassword: '新密码',
        confirmNewPassword: '确认新密码',
        loginSuccess: '登录成功',
        registerSuccess: '注册成功',
        logoutSuccess: '退出登录成功',
        passwordResetSuccess: '密码重置成功',
        passwordChangeSuccess: '密码更改成功',
        verifyEmail: '验证邮箱',
        emailVerified: '邮箱验证成功',
        resendVerification: '重新发送验证邮件',
        verificationSent: '验证邮件已发送',
        resetPasswordInstructions: '输入您的电子邮箱，我们将向您发送重置密码的说明',
        resetPasswordEmailSent: '密码重置邮件已发送',
        invalidCredentials: '无效的邮箱或密码',
        accountLocked: '账户已锁定，请稍后再试',
        passwordMismatch: '密码不匹配',
        passwordTooShort: '密码长度不能少于8个字符',
        emailAlreadyExists: '该电子邮箱已被注册',
        invalidToken: '无效或已过期的令牌',
        twoFactorAuth: '两因素认证',
        setupTwoFactor: '设置两因素认证',
        verifyTwoFactor: '验证两因素认证',
        twoFactorEnabled: '两因素认证已启用',
        twoFactorDisabled: '两因素认证已禁用',
        enterVerificationCode: '输入验证码',
        invalidVerificationCode: '无效的验证码'
      },
      profile: {
        personalInfo: '个人信息',
        contactInfo: '联系信息',
        education: '教育背景',
        workExperience: '工作经验',
        languages: '语言能力',
        documents: '文档',
        preferences: '偏好设置',
        security: '安全设置',
        privacy: '隐私设置',
        notifications: '通知设置',
        accountSettings: '账户设置',
        deleteAccount: '删除账户',
        downloadData: '下载您的数据',
        updateProfile: '更新个人资料',
        profileUpdated: '个人资料更新成功',
        uploadPhoto: '上传照片',
        removePhoto: '移除照片',
        phoneNumber: '电话号码',
        address: '地址',
        city: '城市',
        province: '省份',
        country: '国家',
        postalCode: '邮政编码',
        dateOfBirth: '出生日期',
        gender: '性别',
        nationality: '国籍',
        maritalStatus: '婚姻状况',
        dependents: '家属',
        occupation: '职业',
        bio: '个人简介',
        website: '网站',
        socialMedia: '社交媒体'
      },
      errors: {
        required: '{field}不能为空',
        minLength: '{field}长度不能少于{min}个字符',
        maxLength: '{field}长度不能超过{max}个字符',
        email: '请输入有效的电子邮箱地址',
        passwordMatch: '密码必须匹配',
        invalidDate: '请输入有效的日期',
        invalidNumber: '请输入有效的数字',
        invalidPhone: '请输入有效的电话号码',
        invalidUrl: '请输入有效的URL',
        serverError: '服务器错误，请稍后再试',
        notFound: '未找到',
        unauthorized: '未授权访问',
        forbidden: '禁止访问',
        badRequest: '错误的请求',
        conflict: '冲突',
        tooManyRequests: '请求过多，请稍后再试',
        timeout: '请求超时，请重试',
        offline: '您处于离线状态，请检查网络连接',
        unknown: '发生未知错误'
      }
    };
  }
  
  /**
   * 翻译文本
   * @param {String} key - 翻译键，使用点表示法（如'common.welcome'）
   * @param {String} locale - 语言代码
   * @param {Object} params - 替换参数
   * @returns {String} - 翻译后的文本
   */
  translate(key, locale = 'en', params = {}) {
    try {
      locale = this.validateLocale(locale);
      
      const keys = key.split('.');
      
      let translation = this.translations[locale];
      for (const k of keys) {
        if (!translation || !translation[k]) {
          if (locale !== 'en') {
            return this.translate(key, 'en', params);
          }
          return key;
        }
        translation = translation[k];
      }
      
      if (typeof translation === 'string') {
        return this.replaceParams(translation, params);
      }
      
      return key;
    } catch (error) {
      console.error('翻译错误:', error);
      return key;
    }
  }
  
  /**
   * 替换翻译中的参数
   * @param {String} text - 包含参数占位符的文本
   * @param {Object} params - 替换参数
   * @returns {String} - 替换后的文本
   */
  replaceParams(text, params) {
    if (!params || Object.keys(params).length === 0) {
      return text;
    }
    
    let result = text;
    
    Object.keys(params).forEach(key => {
      const regex = new RegExp(`{${key}}`, 'g');
      result = result.replace(regex, params[key]);
    });
    
    return result;
  }
  
  /**
   * 验证语言代码
   * @param {String} locale - 语言代码
   * @returns {String} - 有效的语言代码
   */
  validateLocale(locale) {
    const supportedLocales = Object.keys(this.translations);
    
    if (supportedLocales.includes(locale)) {
      return locale;
    }
    
    const mainLocale = locale.split('-')[0];
    if (supportedLocales.includes(mainLocale)) {
      return mainLocale;
    }
    
    return 'en';
  }
  
  /**
   * 获取支持的语言列表
   * @returns {Array} - 支持的语言代码列表
   */
  getSupportedLocales() {
    return Object.keys(this.translations);
  }
  
  /**
   * 获取语言名称
   * @param {String} locale - 语言代码
   * @returns {String} - 语言名称
   */
  getLocaleName(locale) {
    const localeNames = {
      en: 'English',
      fr: 'Français',
      zh: '中文'
    };
    
    return localeNames[locale] || locale;
  }
  
  /**
   * 添加翻译
   * @param {String} locale - 语言代码
   * @param {String} key - 翻译键
   * @param {String} value - 翻译值
   */
  addTranslation(locale, key, value) {
    try {
      locale = this.validateLocale(locale);
      
      const keys = key.split('.');
      
      if (!this.translations[locale]) {
        this.translations[locale] = {};
      }
      
      let current = this.translations[locale];
      for (let i = 0; i < keys.length - 1; i++) {
        const k = keys[i];
        if (!current[k]) {
          current[k] = {};
        }
        current = current[k];
      }
      
      current[keys[keys.length - 1]] = value;
    } catch (error) {
      console.error('添加翻译错误:', error);
    }
  }
}

const localization = new Localization();

module.exports = {
  localization
};
