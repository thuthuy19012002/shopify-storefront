document.addEventListener("DOMContentLoaded", () => {
  const items = document.querySelectorAll(".scroll-fade-in");

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("scroll-fade-in-cancel");

          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  items.forEach((item) => observer.observe(item));
});
