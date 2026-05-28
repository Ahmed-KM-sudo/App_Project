import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LanguageSwitcher = () => {
    const { i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const languages = [
        { code: 'fr', label: 'Français', short: 'FR' },
        { code: 'en', label: 'English', short: 'EN' },
        { code: 'ar', label: 'العربية', short: 'AR' }
    ];

    const currentLanguage = languages.find(l => l.code === i18n.language) || languages[0];

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = lng;
        setIsOpen(false);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef} style={{ position: 'relative' }}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="glass-panel"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '8px 12px',
                    borderRadius: '12px',
                    background: 'var(--card-bg)',
                    border: '1px solid var(--card-border)',
                    color: 'var(--text-main)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: 'var(--shadow-sm)',
                    fontWeight: '600'
                }}
            >
                <Globe size={18} className="text-primary" style={{ color: 'var(--primary)' }} />
                <span>{currentLanguage.short}</span>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <ChevronDown size={14} />
                </motion.div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 5, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        style={{
                            position: 'absolute',
                            top: '100%',
                            right: i18n.language === 'ar' ? 'auto' : 0,
                            left: i18n.language === 'ar' ? 0 : 'auto',
                            zIndex: 1000,
                            minWidth: '150px',
                            background: 'var(--card-bg)',
                            backdropFilter: 'blur(12px)',
                            border: '1px solid var(--card-border)',
                            borderRadius: '12px',
                            padding: '6px',
                            boxShadow: 'var(--shadow-lg)',
                            overflow: 'hidden'
                        }}
                    >
                        {languages.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => changeLanguage(lang.code)}
                                style={{
                                    width: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '10px 12px',
                                    fontSize: '0.875rem',
                                    borderRadius: '8px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    background: i18n.language === lang.code ? 'var(--primary-light, rgba(37, 99, 235, 0.1))' : 'transparent',
                                    color: i18n.language === lang.code ? 'var(--primary)' : 'var(--text-main)',
                                    textAlign: i18n.language === 'ar' ? 'right' : 'left',
                                    gap: '12px'
                                }}
                                onMouseEnter={(e) => {
                                    if (i18n.language !== lang.code) {
                                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (i18n.language !== lang.code) {
                                        e.currentTarget.style.background = 'transparent';
                                    }
                                }}
                            >
                                <span style={{ fontWeight: i18n.language === lang.code ? '700' : '500' }}>
                                    {lang.label}
                                </span>
                                {i18n.language === lang.code && <Check size={14} />}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default LanguageSwitcher;

