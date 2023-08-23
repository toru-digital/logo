
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
