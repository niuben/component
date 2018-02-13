$(".unslider-container").each(function() {
    var $this = $(this);
    var autoplay = false;
            
    $this.unslider({
      delay: 8000,
      autoplay: false,
      nav: false
    });
            
    var slider = $this.data("unslider");
    $this.hover(
        function() {
            slider.stop();
        },
        function() {
            slider.start();
        }
    );                
});