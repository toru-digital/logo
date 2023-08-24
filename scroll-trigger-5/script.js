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
      attr: { fill: "red" },
    },
    "start"
  )
  .to(
    "#scaleableImg2",
    {
      delay: 0.5,
      opacity: 1,
      x: 300,
      fill: "red",
    },
    "start"
  )
  .to(
    "#scaleableImg3",
    {
      delay: 1,
      opacity: 1,
      x: 300,
    },
    "start"
  )
  .to(
    "#scaleableImg4",
    {
      delay: 1.5,
      opacity: 1,
      x: 300,
    },
    "start"
  )
  .to(
    "#scaleableImg1",
    {
      delay: 2,
      scaleX: -1,
      opacity: 0,
      transformOrigin: "center",
    },
    "start"
  )
  .to(
    "#scaleableImg1-2",
    {
      delay: 2.5,
      transformOrigin: "center",
      opacity: 1,
      scale: 1,
    },
    "start"
  )
  .to(
    "#scaleableImg2",
    {
      delay: 2.3,
      scaleX: -1,
      opacity: 0,
      transformOrigin: "center",
    },
    "start"
  )
  .to(
    "#scaleableImg2-2",
    {
      delay: 2.7,
      transformOrigin: "center",
      opacity: 1,
    },
    "start"
  )
  .to(
    "#scaleableImg3",
    {
      delay: 2.6,
      scaleX: -1,
      opacity: 0,
      transformOrigin: "center",
    },
    "start"
  )
  .to(
    "#scaleableImg3-2",
    {
      delay: 2.9,
      transformOrigin: "center",
      opacity: 1,
    },
    "start"
  )
  .to(
    "#scaleableImg4",
    {
      delay: 2.8,
      scaleX: -1,
      opacity: 0,
      transformOrigin: "center",
    },
    "start"
  )
  .to(
    "#scaleableImg4-2",
    {
      delay: 3.1,
      transformOrigin: "center",
      opacity: 1,
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
  );

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
