// Language Manager for ServicePro
class LanguageManager {
    constructor() {
        this.currentLang = 'en';
        this.translations = {};
        this.rtlLanguages = ['ar'];
    }

    async init() {
        try {
            // Load translations
            await this.loadTranslations();
            
            // Get saved language or detect
            const savedLang = localStorage.getItem('servicepro_lang');
            if (savedLang && this.translations[savedLang]) {
                this.setLanguage(savedLang);
            } else {
                this.detectLanguage();
            }
            
            // Add event listeners
            this.setupEventListeners();
            
            // Apply initial translations
            this.updatePage();
            
        } catch (error) {
            console.error('Error initializing language manager:', error);
        }
    }

    async loadTranslations() {
        try {
            const [enResponse, arResponse] = await Promise.all([
                fetch('lang/en.json'),
                fetch('lang/ar.json')
            ]);
            
            if (!enResponse.ok || !arResponse.ok) {
                throw new Error('Failed to load translation files');
            }
            
            this.translations.en = await enResponse.json();
            this.translations.ar = await arResponse.json();
            
        } catch (error) {
            console.error('Error loading translations:', error);
            // Fallback to empty translations
            this.translations = { en: {}, ar: {} };
        }
    }

    detectLanguage() {
        const browserLang = (navigator.language || navigator.userLanguage || 'en').split('-')[0];
        const lang = this.translations[browserLang] ? browserLang : 'en';
        this.setLanguage(lang, false); // Don't save on auto-detect
    }

    setLanguage(lang, save = true) {
        if (!this.translations[lang] || lang === this.currentLang) return;
        
        this.currentLang = lang;
        
        if (save) {
            localStorage.setItem('servicepro_lang', lang);
        }
        
        this.updatePage();
    }

    updatePage() {
        // Update HTML direction and language
        if (this.isRTL()) {
            document.documentElement.dir = 'rtl';
            document.documentElement.lang = 'ar';
        } else {
            document.documentElement.dir = 'ltr';
            document.documentElement.lang = 'en';
        }
        
        // Update all translations
        this.updateTranslations();
        
        // Update language switcher UI
        this.updateLanguageSwitcher();
        
        // Update CSS classes
        this.updateBodyClasses();
    }

    isRTL() {
        return this.rtlLanguages.includes(this.currentLang);
    }

    updateTranslations() {
        const langData = this.translations[this.currentLang];
        if (!langData) return;

        // Update text content
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (langData[key]) {
                el.textContent = langData[key];
            }
        });

        // Update placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (langData[key]) {
                el.placeholder = langData[key];
            }
        });

        // Update alt text
        document.querySelectorAll('[data-i18n-alt]').forEach(el => {
            const key = el.getAttribute('data-i18n-alt');
            if (langData[key]) {
                el.alt = langData[key];
            }
        });

        // Update title
        document.querySelectorAll('[data-i18n-title]').forEach(el => {
            const key = el.getAttribute('data-i18n-title');
            if (langData[key]) {
                document.title = langData[key];
            }
        });

        // Update value attributes
        document.querySelectorAll('[data-i18n-value]').forEach(el => {
            const key = el.getAttribute('data-i18n-value');
            if (langData[key]) {
                el.value = langData[key];
            }
        });
    }

    updateLanguageSwitcher() {
        document.querySelectorAll('.lang-btn').forEach(btn => {
            const lang = btn.dataset.lang;
            btn.classList.remove('active');
            if (lang === this.currentLang) {
                btn.classList.add('active');
            }
        });
    }

    updateBodyClasses() {
        document.body.classList.remove('rtl', 'ltr');
        document.body.classList.add(this.isRTL() ? 'rtl' : 'ltr');
    }

    setupEventListeners() {
        // Language switcher buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('.lang-btn')) {
                const btn = e.target.closest('.lang-btn');
                const lang = btn.dataset.lang;
                if (lang && lang !== this.currentLang) {
                    this.setLanguage(lang);
                }
            }
        });
    }

    t(key) {
        return this.translations[this.currentLang]?.[key] || key;
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.languageManager = new LanguageManager();
    window.languageManager.init();
});