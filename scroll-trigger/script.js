/** @format */
gsap.registerPlugin(ScrollTrigger);

//on scroll animation
// landing page
gsap
  .timeline({
    scrollTrigger: {
      trigger: ".navbar",
      pin: true,
      start: "top top",
      end: "+=30%",
      scrub: 1,
      markers: true,
    },
    defaults: {
      ease: "none",
    },
  })
  .to(".logo-text", {
    y: -550,
    scale: 0.1,
    position: "fixed",
    zIndex: 100,
    color: "#83DDB6",
  })
  .to(".small-logo", {
    opacity: 1,
    scale: 1,
    y: -50,
  })
  .to(
    ".webgl-logo",
    {
     display: "block",
     opacity: 1,
     ease: "slow.out",
    }
  )
  .from(
    ".hr",
    8,
    {
      width: 0,
      ease: "power4.out",
      delay: 0,
      stagger: {
        amount: 2,
      },
    },
    "-=1.5"
  )
  .from(
    ".reveal div",
    1.8,
    {
      y: 200,
      ease: "power4.out",
      stagger: {
        amount: 0.8,
      },
    },
    "-=2"
  ).from(
    ".nav-item",
    1.8,
    {
      opacity: 0,
      y: 100,
      ease: "power4.out",
      stagger: {
        amount: 0.3,
      },
    },
    "-=2"
  );

  gsap
  .timeline({
    scrollTrigger: {
      trigger: ".next-section",
      pin: true,
      start: "center center",
      end: "+=30%",
      scrub: 2,
      markers: true,
    },
    defaults: {
      ease: "none",
    },
  })
  .to(".landing-page", {
    opacity: 0,
  })
  .to(".next-section", {
    backgroundColor: "#FFF",
  })
  .from(".next-section > *" ,5, {
    opacity: 0,
    ease: "power4.out",
    stagger: {
      amount: 0.8,
      y: 100,
    },
  });;

//introduction animation
gsap.from(".clip-top, .clip-bottom", 2, {
  delay: 1,
  height: "50vh",
  ease: "power4.inOut",
});

gsap.to(".marquee", 3.5, {
  delay: 0.75,
  top: "50%",
  ease: "power4.inOut",
});

gsap.to(".clip-center .marquee", 3.5, {
  delay: 0.75,
  top: "50%",
  ease: "power4.inOut",
});

gsap.from(".clip-top .marquee, .clip-bottom .marquee", 5,{
  delay:1,
  left:"100%",
  ease:"power3.inOut"
})

    gsap.from(".clip-center .marquee", 5, {
  delay: 1,
  left: "-100%",
  ease: "power3.inOut",
});

gsap.to(".clip-top", 2, {
  delay: 6,
  clipPath: "inset(0 0 100% 0)",
  ease: "power4.inOut",
});

gsap.to(".clip-bottom", 2, {
  delay:6,
  clipPath:"inset(100% 0 0 0)",
  ease:"power4.inOut",
})

gsap.to(
  ".clip-top .marquee, .clip-bottom .marquee, .clip-center .marquee span,.logo-text-marquee",
  1,
  {
    delay: 6,
    opacity: 0,
    ease: "power2.inOut",
  }
);

gsap.to(
  ".logo-text",
  1,
  {
    delay: 5.8,
    opacity: 1,
    ease: "power2.inOut",
  }
);




const blocks = document.querySelectorAll(".block");
const resetDuration = 300;



blocks.forEach((block) => {
  let timeoutId;

  block.addEventListener("mouseover", () => {
    clearTimeout(timeoutId);
// add random letters to each block via the content url
    block.style.setProperty("--content", `"${block.dataset.letter}"`);
    block.classList.add("active");
    timeoutId = setTimeout(() => {
      block.classList.remove("active");
    }, resetDuration);
  });
});