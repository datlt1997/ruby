document.addEventListener("DOMContentLoaded", function () {
    const flashMessages = document.querySelectorAll(".flash-message");
    flashMessages.forEach(function (el) {
      setTimeout(function () {
        el.style.transition = "opacity 0.5s ease-out";
        el.style.opacity = "0";
        setTimeout(() => el.remove(), 500); // remove sau khi ẩn
      }, 5000); // 5 giây
    });
    console.log(123);
  });