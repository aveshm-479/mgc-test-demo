/**
 * Smooth scroll utility for enhanced scrolling experience
 */

export const smoothScroll = {
  /**
   * Smooth scroll to a specific element or position
   * @param target - Element ID, element, or pixel position
   * @param options - Scroll options
   */
  to: (
    target: string | HTMLElement | number,
    options: {
      behavior?: 'smooth' | 'auto';
      duration?: number;
      offset?: number;
    } = {}
  ) => {
    const {
      behavior = 'smooth',
      duration = 500,
      offset = 0
    } = options;

    // Handle different target types
    let targetElement: HTMLElement | null = null;
    let targetPosition: number | null = null;

    if (typeof target === 'string') {
      targetElement = document.getElementById(target);
    } else if (typeof target === 'number') {
      targetPosition = target;
    } else if (target instanceof HTMLElement) {
      targetElement = target;
    }

    // Calculate final position
    let finalPosition: number;
    if (targetElement) {
      const rect = targetElement.getBoundingClientRect();
      finalPosition = window.pageYOffset + rect.top + offset;
    } else if (targetPosition !== null) {
      finalPosition = targetPosition + offset;
    } else {
      console.warn('Smooth scroll target not found:', target);
      return;
    }

    // Apply smooth scroll
    if (behavior === 'smooth' && duration > 0) {
      smoothScroll.animateScroll(finalPosition, duration);
    } else {
      window.scrollTo({
        top: finalPosition,
        behavior: behavior as ScrollBehavior
      });
    }
  },

  /**
   * Animate scroll with custom duration
   * @param targetPosition - Target scroll position
   * @param duration - Animation duration in milliseconds
   */
  animateScroll: (targetPosition: number, duration: number) => {
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime: number | null = null;

    const animation = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const run = smoothScroll.easeInOutQuad(timeElapsed, startPosition, distance, duration);
      window.scrollTo(0, run);
      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      }
    };

    requestAnimationFrame(animation);
  },

  /**
   * Easing function for smooth animations
   */
  easeInOutQuad: (t: number, b: number, c: number, d: number) => {
    t /= d / 2;
    if (t < 1) return (c / 2) * t * t + b;
    t--;
    return (-c / 2) * (t * (t - 2) - 1) + b;
  },

  /**
   * Enable smooth scrolling globally
   */
  enable: () => {
    // Ensure CSS smooth scroll is enabled
    document.documentElement.style.scrollBehavior = 'smooth';
    document.body.style.scrollBehavior = 'smooth';

    // Add smooth scroll to common scroll containers
    const scrollContainers = document.querySelectorAll('.scroll-container, .overflow-auto, .overflow-y-auto');
    scrollContainers.forEach(container => {
      (container as HTMLElement).style.scrollBehavior = 'smooth';
    });
  },

  /**
   * Disable smooth scrolling
   */
  disable: () => {
    document.documentElement.style.scrollBehavior = 'auto';
    document.body.style.scrollBehavior = 'auto';
  },

  /**
   * Smooth scroll to top
   */
  toTop: (duration: number = 500) => {
    smoothScroll.to(0, { duration });
  },

  /**
   * Smooth scroll to bottom
   */
  toBottom: (duration: number = 500) => {
    smoothScroll.to(document.body.scrollHeight, { duration });
  }
};

// Auto-enable smooth scrolling when module is imported
if (typeof window !== 'undefined') {
  smoothScroll.enable();
}

// Add smooth scroll to navigation links
export const addSmoothScrollToLinks = () => {
  if (typeof window === 'undefined') return;

  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const link = target.closest('a[href^="#"]');
    
    if (link) {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const targetId = href.slice(1);
        smoothScroll.to(targetId);
      }
    }
  });
};

// Initialize smooth scroll for links
if (typeof window !== 'undefined') {
  addSmoothScrollToLinks();
}
