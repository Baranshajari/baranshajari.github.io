// Clear scroll position on reload and prevent scroll position from being remembered
if (window.history.scrollRestoration) {
    window.history.scrollRestoration = 'manual';
}

// Scroll to top on page load
window.addEventListener('load', function() {
    window.scrollTo(0, 0);
});

// Clear scroll position when navigating away
window.addEventListener('beforeunload', function() {
    window.scrollTo(0, 0);
});

// Add shadow to header when scrolling
const header = document.querySelector('header');
window.addEventListener('scroll', function() {
    if (window.scrollY > 0) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            // Get viewport height
            const viewportHeight = window.innerHeight;
            
            // Get the element's position and dimensions
            const rect = target.getBoundingClientRect();
            const absoluteTop = window.pageYOffset + rect.top;
            
            // Calculate position to center element in viewport
            const targetPosition = absoluteTop - (viewportHeight - rect.height) / 2;
            const startPosition = window.pageYOffset;
            const distance = targetPosition - startPosition;
            const duration = 1500; // 1.5 seconds
            let start = null;

            function animation(currentTime) {
                if (start === null) start = currentTime;
                const timeElapsed = currentTime - start;
                const progress = Math.min(timeElapsed / duration, 1);
                
                // Smooth easing function
                const easeInOutCubic = t => t < 0.5 
                    ? 4 * t * t * t 
                    : 1 - Math.pow(-2 * t + 2, 3) / 2;
                
                window.scrollTo(0, startPosition + distance * easeInOutCubic(progress));
                
                if (timeElapsed < duration) {
                    requestAnimationFrame(animation);
                }
            }
            
            requestAnimationFrame(animation);
        }
    });
});

// Handle logo click to scroll to top
document.querySelector('.logo a').addEventListener('click', function(e) {
    e.preventDefault();
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Scroll to top button functionality
const scrollToTopButton = document.getElementById('scrollToTop');

// Show/hide button based on scroll position
window.addEventListener('scroll', function() {
    if (window.scrollY > 300) { // Show button after scrolling 300px
        scrollToTopButton.classList.add('visible');
    } else {
        scrollToTopButton.classList.remove('visible');
    }
});

// Smooth scroll to top when button is clicked
scrollToTopButton.addEventListener('click', function() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});
