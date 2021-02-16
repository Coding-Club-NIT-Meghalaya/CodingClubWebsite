//   /// animating cubes***************
// function init(){

//     const c1=document.getElementById("cube1");
//     const c2=document.getElementById("cube2");
//     const c3=document.getElementById("cube3");
//     const c4=document.getElementById("cube4");

//     gsap.from(c1,{
//         opacity:0.6,
//         ease:Power2.easeOut,
//         x:()=>window.innerWidth-c1.offsetLeft,
//         y:()=>-c1.offsetTop,
//         rotate:90,
//         duration:2
//     });
//     gsap.from(c2,{
//         opacity:0.6,
//         ease:Power2.easeOut,
//         x:()=>window.innerWidth-c2.offsetLeft,
//         y:()=>-c2.offsetTop,
//         rotate:90,
//         duration:2
//     });
//     gsap.from(c3,{
//         opacity:0.6,
//         ease:Power2.easeOut,
//         x:()=>window.innerWidth-c3.offsetLeft,
//         y:()=>-c3.offsetTop,
//         rotate:90,
//         duration:2
//     });
//     gsap.from(c4,{
//         opacity:0.4,
//         ease:Power2.easeOut,
//         x:-200,
//         rotate:90,
//         duration:1.5
//     });

//     // gsap.to(c2,{
//     //     scrollTrigger:{
//     //         trigger:"header",
//     //         start: "top top",
//     //         scrub:true,
//     //         toggleActions:" restart none reverse reset"
//     //     },
//     //     y:20,
//     //     x:20,
//     //     duration:2
//     // });
// }
//  window.addEventListener("resize", init);
//  init();
function navSlide() {
  const burger = document.querySelector(".burger");
  const nav = document.querySelector(".nav-links");
  const navLinks = document.querySelectorAll(".nav-links li");

  burger.addEventListener("click", () => {
    //Toggle Nav
    nav.classList.toggle("nav-active");

    //Animate Links
    navLinks.forEach((link, index) => {
      if (link.style.animation) {
        link.style.animation = "";
      } else {
        link.style.animation = `navLinkFade 0.5s ease forwards ${
          index / 7 + 0.5
        }s`;
      }
    });
    //Burger Animation
    burger.classList.toggle("toggle");
  });
}

navSlide();
