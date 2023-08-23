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
    "#scaleableImg1",
    {
      opacity: 1,
      transformOrigin: "center",
      attr:{fill:"red"}

    },
    "start"
  )
  .to(
    "#scaleableImg2",
    {
      delay: .5,
      opacity: 1,
      x:300,
      fill: "red",
    },
    "start"
  )
  .to(
    "#scaleableImg3",
    {
      delay:1,
      opacity: 1,
      x:300,

    },
    "start"
  )
  .to(
    "#scaleableImg4",
    {
      delay:1.5,
      opacity: 1,
      x:300,
    },
    "start"
  )
  .to(
    "#scaleableImg1",
    {
      delay:2,
      scale: 0.2,
      transformOrigin: "center",

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




