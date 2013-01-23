/* 
   MODULE: FULLSCREEN BUTTON
   Handle full screen button and shortcut.
   
   Fires:
   - player:fullscreenchange
   
   Answers properties:
   - supportsFullscreen [get]
   - fullscreen [get/set]
*/

Player.provide('fullscreen-button', 
  {}, 
  function(Player,$,opts){
    var $this = this;
    $.extend($this, opts);

    // Toogle fullscreen on alt+enter
    $(window).keydown(function(e){
        if((e.altKey||e.metaKey) && (e.charCode==32 || e.keyCode==13)) {
          Player.set('fullscreen', !Player.get('fullscreen'));
        }
      });

    // Notify elements when fullscreen changes
    $(document).bind('fullscreenchange mozfullscreenchange webkitfullscreenchange', function(e){
        Player.fire('player:fullscreenchange');
      });

    // Update UI when full screen changes
    Player.bind('player:fullscreenchange player:loaded player:video:ready', function(e){
        $this.container.toggle(Player.get('supportsFullscreen'));
        $this.render();
      });

    /* GETTERS */
    Player.getter('supportsFullscreen', function(){
        var ve = Player.get('videoElement');
        return (ve ? ve.hasFullscreen() : false);
      });
    Player.getter('fullscreen', function(){
        var ve = Player.get('videoElement');
        return (ve ? ve.isFullscreen() : false);
      });
    /* SETTERS */
    Player.setter('fullscreen', function(fs){
        if(!Player.get('supportsFullscreen')) return;
        var ve = Player.get('videoElement');
        if(ve) {
            Player.set('playing', true);
            if(fs) {
                Player.set('analyticsEvent', 'fullscreen');
                ve.enterFullscreen();
            } else {
                ve.leaveFullscreen();
            }
        }
      });
      
    return $this;
  }
);