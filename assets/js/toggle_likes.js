class ToggleLike {
  constructor(toggleElement) {
    this.toggler = toggleElement;
    this.toggleLike();
  }
  toggleLike() {
    $(this.toggler).click(function(e) {
      e.preventDefault();
      let val = $(this)
        .html()
        .split(" ")[0];
      val = parseInt(val);
      $.ajax({
        type: "get",
        url: $(this).attr("href"),
        success: response => {
          const { data: { deleted } = {} } = response;
          if (deleted) {
            $(this).html(`${val - 1} Like`);
          } else {
            $(this).html(`${val + 1} Like`);
          }
        }
      });
    });
  }
}
