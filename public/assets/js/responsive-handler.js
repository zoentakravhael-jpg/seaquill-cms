/**
 * RESPONSIVE HANDLER
 * Dynamic scaling untuk resolusi 1366x768 dan Full HD
 */

(function() {
    'use strict';
    
    // Configuration
    const config = {
        breakpoints: {
            laptop: { width: 1366, height: 768 },
            fullhd: { width: 1920, height: 1080 },
            desktop: { width: 1440, height: 900 }
        },
        scalingFactors: {
            1366: 0.85,  // Scale down untuk laptop
            1440: 0.9,   // Scale sedikit untuk desktop sedang
            1920: 1.0    // Normal untuk Full HD
        }
    };
    
    // Detect viewport dan apply scaling
    function detectAndScale() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const body = document.body;
        
        // Remove existing classes
        body.classList.remove('viewport-laptop', 'viewport-fullhd', 'viewport-desktop', 'viewport-small');
        
        // Apply viewport-specific classes
        if (width <= 1366) {
            body.classList.add('viewport-laptop');
            applyDynamicScaling(0.85);
        } else if (width <= 1440) {
            body.classList.add('viewport-desktop');
            applyDynamicScaling(0.9);
        } else if (width >= 1920) {
            body.classList.add('viewport-fullhd');
            applyDynamicScaling(1.0);
        }
        
        // Apply height-based optimizations
        if (height <= 768) {
            body.classList.add('viewport-short');
            optimizeForShortScreens();
        }
        
        // Update CSS custom properties
        updateCSSProperties(width, height);
    }
    
    // Apply dynamic scaling to specific elements - EXCLUDE HEADER
    function applyDynamicScaling(factor) {
        const scalableElements = document.querySelectorAll('.th-service, .shop-card, .blog-card, .th-team');
        
        // EXCLUDE header elements from scaling
        const excludeHeaders = Array.from(scalableElements).filter(element => {
            return !element.closest('.th-header') && !element.closest('header');
        });
        
        excludeHeaders.forEach(element => {
            if (factor < 1) {
                element.style.transform = `scale(${factor})`;
                element.style.transformOrigin = 'center';
                element.style.marginBottom = `${20 * factor}px`;
            } else {
                element.style.transform = '';
                element.style.marginBottom = '';
            }
        });
        
        // PROTECT header elements explicitly
        const headerElements = document.querySelectorAll('.th-header *, header *');
        headerElements.forEach(element => {
            element.style.transform = '';
            element.style.scale = '';
        });
    }
    
    // Optimize untuk layar pendek
    function optimizeForShortScreens() {
        const heroSection = document.querySelector('.th-hero-wrapper');
        const sections = document.querySelectorAll('.space, .space-top, .space-bottom');
        
        if (heroSection) {
            heroSection.style.minHeight = '60vh';
            heroSection.style.padding = '40px 0';
        }
        
        sections.forEach(section => {
            section.style.paddingTop = '40px';
            section.style.paddingBottom = '40px';
        });
    }
    
    // Update CSS custom properties berdasarkan viewport
    function updateCSSProperties(width, height) {
        const root = document.documentElement;
        
        // Calculate responsive font size
        let baseFontSize = Math.max(14, Math.min(18, width / 85));
        root.style.setProperty('--responsive-font-size', baseFontSize + 'px');
        
        // Calculate container padding
        let containerPadding = Math.max(15, Math.min(40, width / 45));
        root.style.setProperty('--responsive-padding', containerPadding + 'px');
        
        // Calculate section spacing
        let sectionSpacing = Math.max(40, Math.min(100, height / 8));
        root.style.setProperty('--responsive-section-spacing', sectionSpacing + 'px');
    }
    
    // Optimize images untuk viewport
    function optimizeImages() {
        const images = document.querySelectorAll('img[data-responsive]');
        const width = window.innerWidth;
        
        images.forEach(img => {
            if (width <= 1366) {
                // Untuk laptop, gunakan ukuran gambar yang lebih kecil
                const smallSrc = img.dataset.small || img.src;
                if (img.src !== smallSrc) {
                    img.src = smallSrc;
                }
            }
        });
    }
    
    // Debounce function untuk performance
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Initialize
    function init() {
        detectAndScale();
        optimizeImages();
        
        // Add event listeners
        const debouncedResize = debounce(() => {
            detectAndScale();
            optimizeImages();
        }, 250);
        
        window.addEventListener('resize', debouncedResize);
        window.addEventListener('orientationchange', debouncedResize);
        
        // Apply initial optimizations
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => {
                detectAndScale();
                
                // HEADER PROTECTION - Don't modify navigation in header
                const navItems = document.querySelectorAll('.main-menu > ul > li > a');
                const headerNavItems = document.querySelectorAll('.th-header .main-menu > ul > li > a, header .main-menu > ul > li > a');
                
                // Only modify non-header navigation
                navItems.forEach(item => {
                    if (!item.closest('.th-header') && !item.closest('header') && window.innerWidth <= 1366) {
                        item.style.padding = '8px 12px';
                        item.style.fontSize = '13px';
                    }
                });
                
                // Explicitly preserve header navigation
                headerNavItems.forEach(item => {
                    item.style.padding = '15px 20px';
                    item.style.fontSize = '16px';
                });
                
                // Add smooth scrolling untuk mobile dan laptop
                if (window.innerWidth <= 1366 || 'ontouchstart' in window) {
                    document.documentElement.style.scrollBehavior = 'smooth';
                }
                
                // HEADER LOGO PROTECTION
                const headerLogos = document.querySelectorAll('.th-header .header-logo img, header .header-logo img');
                headerLogos.forEach(logo => {
                    logo.style.height = '80px';
                    logo.style.width = 'auto';
                    logo.style.transform = 'none';
                });
                
            }, 100);
        });
    }
    
    // Performance monitoring
    function performanceOptimization() {
        // Lazy load non-critical elements
        const lazyElements = document.querySelectorAll('[data-lazy]');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    element.classList.add('loaded');
                    observer.unobserve(element);
                }
            });
        });
        
        lazyElements.forEach(element => {
            observer.observe(element);
        });
        
        // Optimize animations untuk device dengan performa rendah
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        if (reducedMotion.matches || window.innerWidth <= 1366) {
            document.documentElement.style.setProperty('--animation-duration', '0.2s');
        }
    }
    
    // CSS class helpers
    const ResponsiveHelpers = {
        // Add utility classes untuk responsive development
        addResponsiveClasses: function() {
            const width = window.innerWidth;
            const classes = [];
            
            if (width <= 576) classes.push('xs');
            else if (width <= 768) classes.push('sm');
            else if (width <= 992) classes.push('md');
            else if (width <= 1200) classes.push('lg');
            else if (width <= 1366) classes.push('xl');
            else classes.push('xxl');
            
            document.body.className = document.body.className
                .replace(/\b(xs|sm|md|lg|xl|xxl)\b/g, '')
                .trim() + ' ' + classes.join(' ');
        }
    };
    
    // Export for external use
    window.ResponsiveHandler = {
        init: init,
        detectAndScale: detectAndScale,
        helpers: ResponsiveHelpers
    };
    
    // Auto-initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // Initialize performance optimizations
    performanceOptimization();
    
})();
