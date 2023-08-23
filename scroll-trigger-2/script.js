/** @format */
gsap.registerPlugin(ScrollTrigger);
gsap
  .timeline({
    scrollTrigger: {
      trigger: ".imageBoard",
      pin: true,
      start: "top top",
      end: "+=300%",
      scrub: 1,
    },
    defaults: {
      ease: "none",
    },
  })
  .to(
    document.body,
    {
      delay: 0.3,
      backgroundColor: "#f0f0f0",
    },
    "start"
  )
  .to(
    ".upper-container h1",
    {
      scale: 5,
    },
    "start"
  )
  .to(
    ".upper-container h1",
    {
      opacity: 0,
    },
    "start"
  )
  .to(
    "#scaleableImg1",
    {
      opacity: 0,
    },
    "start"
  )
  .to(
    "#scaleableImg2",
    {
      scale: 10,
      x: 0,
    },
    "start"
  )
  .to(
    "#scaleableImg3",
    {
      opacity: 0,
    },
    "start"
  )
  .to(
    "#scaleableImg4",
    {
      opacity: 0,
    },
    "start"
  )
  .to(
    ".cardImage",
    {
      delay: 0.1,
      scale: 5,
    },
    "start"
  )
  .to(
    ".cardImage",
    {
      delay: 0.4,
      opacity: 1,
    },
    
    "start"
  )
  .to(
    ".designed",
    {
      delay: 0.5,
      x: 20,
      opacity: 1,
    },
    
    "start"
  )
  .to(
    ".divider-1",
    {
      delay: 0.5,
      x: 20,
      opacity: 1,
    },
    
    "start"
  )
  .to(
    ".built",
    {
      delay: 0.54,
      x: 40,
      opacity: 1,
    },
    
    "start"
  )
  .to(
    ".future",
    {
      delay: 0.6,
      x: 10,
      opacity: 1,
    },
    
    "start"
  )
  .to(
    ".small-print",
    {
      delay: 0.7,
      opacity: 1,
    },
    
    "start"
  )
  .to(
    ".letter-u",
    {
      delay: 0.7,
      opacity: 1,
    },
    
    "start"
  )
  .to(
    ".letter-o",
    {
      delay: 0.71,
      opacity: 1,
    },
    
    "start"
  )

  .to(
    ".logo",
    {
      delay: 1,
      opacity: 1,
      y:-10,
    },
    
    "start"
  )
  
  .to(".scaleableImg", {
    opacity: 0,
  });




const textContainers = document.querySelector(".word");

const defaultScale = 1;
const maxScale = 2;
const neighborScale = 1.5;

textContainers.addEventListener("mousemove", (e) => {
  const spans = textContainers.querySelectorAll("svg");
  const target = e.target;
  const index = Array.from(spans).indexOf(target);

  spans.forEach((span, i) => {
    let scale = defaultScale;
    if (i === index) {
      scale = maxScale;
    } else if (i === index - 1 || i === index + 1) {
      scale = neighborScale;
    }

    span.style.transform = `scaleY(${scale})`;
  });

  textContainers.addEventListener("mouseleave", () => {
    spans.forEach((span) => {
      span.style.transform = `scaleY(${defaultScale})`;
    });
  });
});




