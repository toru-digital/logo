/** @format */
gsap.registerPlugin(ScrollTrigger);

gsap
  .timeline({
    scrollTrigger: {
      trigger: ".imageBoard",
      pin: true,
      start: "top top",
      end: "+=200%",
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

  gsap.to(".text p", {
    backgroundPositionX: "0%",
    stagger: 1,
    scrollTrigger: {
      trigger: ".text p",
      scrub: 1,
      start: "top center",
      end: "bottom top",
      markers: true,
    },
  });