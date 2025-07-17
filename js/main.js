// 메인 페이지 JavaScript 기능

// 부드러운 스크롤 구현
document.addEventListener('DOMContentLoaded', function() {
    // 네비게이션 링크 클릭 시 부드러운 스크롤
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // 스크롤 시 헤더 스타일 변경
    const header = document.querySelector('header');
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', function() {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.backgroundColor = 'white';
            header.style.backdropFilter = 'none';
        }
        
        // 스크롤 방향에 따른 헤더 표시/숨김
        if (currentScrollY > lastScrollY && currentScrollY > 200) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollY = currentScrollY;
    });
    
    // 스크롤 애니메이션 (Intersection Observer)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);
    
    // 애니메이션 대상 요소들
    const animatedElements = document.querySelectorAll('.type-card, .step, .type-preview');
    animatedElements.forEach(element => {
        observer.observe(element);
    });
    
    // 통계 카운터 애니메이션
    const statNumbers = document.querySelectorAll('.stat-number');
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalValue = parseInt(target.textContent);
                animateCounter(target, finalValue);
                statsObserver.unobserve(target);
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(number => {
        statsObserver.observe(number);
    });
});

// 테스트 시작 함수
function startTest() {
    // 간단한 확인 메시지
    if (confirm('에겐테토 심리 테스트를 시작하시겠습니까?\n\n12개의 질문에 답하시면 됩니다.')) {
        // 기존 결과 삭제
        localStorage.removeItem('testResult');
        localStorage.removeItem('adViewed');
        
        // 퀴즈 페이지로 이동
        window.location.href = 'quiz.html';
    }
}

// 카운터 애니메이션 함수
function animateCounter(element, finalValue) {
    let currentValue = 0;
    const increment = finalValue / 30;
    const timer = setInterval(() => {
        currentValue += increment;
        if (currentValue >= finalValue) {
            element.textContent = finalValue;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(currentValue);
        }
    }, 50);
}

// 이스터 에그 - 로고 클릭 시 특별 효과
document.addEventListener('DOMContentLoaded', function() {
    const logo = document.querySelector('.logo');
    let clickCount = 0;
    
    if (logo) {
        logo.addEventListener('click', function() {
            clickCount++;
            
            if (clickCount === 5) {
                showEasterEgg();
                clickCount = 0;
            }
        });
    }
});

function showEasterEgg() {
    // 화면에 이모지 비 효과
    const emojis = ['🧠', '💝', '🌸', '⚡', '🔥', '🌺'];
    const container = document.body;
    
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const emoji = document.createElement('div');
            emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            emoji.style.position = 'fixed';
            emoji.style.top = '-50px';
            emoji.style.left = Math.random() * window.innerWidth + 'px';
            emoji.style.fontSize = '2rem';
            emoji.style.zIndex = '9999';
            emoji.style.pointerEvents = 'none';
            emoji.style.transition = 'transform 3s ease-in, opacity 3s ease-in';
            
            container.appendChild(emoji);
            
            setTimeout(() => {
                emoji.style.transform = 'translateY(' + (window.innerHeight + 100) + 'px)';
                emoji.style.opacity = '0';
            }, 100);
            
            setTimeout(() => {
                container.removeChild(emoji);
            }, 3000);
        }, i * 200);
    }
}

// 페이지 로드 시 페이드인 효과
document.addEventListener('DOMContentLoaded', function() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease-in';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// 스크롤 진행률 표시
document.addEventListener('DOMContentLoaded', function() {
    const progressBar = document.createElement('div');
    progressBar.style.position = 'fixed';
    progressBar.style.top = '0';
    progressBar.style.left = '0';
    progressBar.style.width = '0%';
    progressBar.style.height = '3px';
    progressBar.style.background = 'linear-gradient(90deg, #ff6b6b, #ffa726)';
    progressBar.style.zIndex = '9999';
    progressBar.style.transition = 'width 0.3s ease';
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', function() {
        const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        progressBar.style.width = scrollPercent + '%';
    });
});

// 키보드 네비게이션 지원
document.addEventListener('keydown', function(e) {
    // Escape 키로 팝업 닫기
    if (e.key === 'Escape') {
        const activeElement = document.activeElement;
        if (activeElement) {
            activeElement.blur();
        }
    }
    
    // Tab 키 네비게이션 개선
    if (e.key === 'Tab') {
        const focusableElements = document.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (e.shiftKey) {
            if (document.activeElement === firstElement) {
                lastElement.focus();
                e.preventDefault();
            }
        } else {
            if (document.activeElement === lastElement) {
                firstElement.focus();
                e.preventDefault();
            }
        }
    }
});

// 성능 최적화 - 이미지 지연 로딩
document.addEventListener('DOMContentLoaded', function() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // 폴백: IntersectionObserver를 지원하지 않는 브라우저
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
        });
    }
});

// 에러 처리
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    
    // 사용자에게 친화적인 에러 메시지 표시
    if (e.error && e.error.name === 'TypeError') {
        console.warn('Type error occurred, but continuing...');
    }
});

// 페이지 언로드 시 정리
window.addEventListener('beforeunload', function() {
    // 진행 중인 애니메이션 정리
    const progressBar = document.querySelector('div[style*="position: fixed"][style*="top: 0"]');
    if (progressBar) {
        progressBar.remove();
    }
});

// CSS 애니메이션 클래스 추가
const style = document.createElement('style');
style.textContent = `
    .fade-in {
        opacity: 0;
        transform: translateY(20px);
        animation: fadeInUp 0.6s ease forwards;
    }
    
    @keyframes fadeInUp {
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .lazy {
        opacity: 0;
        transition: opacity 0.3s;
    }
    
    .lazy.loaded {
        opacity: 1;
    }
`;
document.head.appendChild(style);