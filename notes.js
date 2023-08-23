let tl = gsap.timeline({
    scrollTrigger: {
    trigger: .animated-element',
    start: '-50% center',
    end: '200% center',
    scrub: true,
    markers: true,
    toggleActions: 'play reverse play reverse',
    }
    })
    tl.to('.animated-element', {
    x: 800,
    duration: .5
    })
    