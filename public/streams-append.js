
(function(){
  var extra = [{"name": "Dreamflow", "spotifyId": "3JxvfjZaLHM60yYRt7BYZm", "spotifyArtistUrl": "https://artists.spotify.com/c/artist/3JxvfjZaLHM60yYRt7BYZm/home"}, {"name": "Poluz", "spotifyId": "0vaXEuhH3eaJuTdMoLFdbN", "spotifyArtistUrl": "https://artists.spotify.com/c/artist/0vaXEuhH3eaJuTdMoLFdbN/home"}, {"name": "Doris Lost", "spotifyId": "43U1R9AZoGI3V5iaW6lht8", "spotifyArtistUrl": "https://artists.spotify.com/c/artist/43U1R9AZoGI3V5iaW6lht8/home"}, {"name": "Eternal", "spotifyId": "4oOqA7kbwce90hbDDKjoID", "spotifyArtistUrl": "https://artists.spotify.com/c/artist/4oOqA7kbwce90hbDDKjoID/home"}, {"name": "Slaapmutsje", "spotifyId": "1iH0DmClTXD3DEXO490gbq", "spotifyArtistUrl": "https://artists.spotify.com/c/artist/1iH0DmClTXD3DEXO490gbq/home"}, {"name": "ZizZa", "spotifyId": "20ajFDuyJzM8xGkWL9agiV", "spotifyArtistUrl": "https://artists.spotify.com/c/artist/20ajFDuyJzM8xGkWL9agiV/home"}, {"name": "Sleepy Teas", "spotifyId": "3Ax9FlTyHNJdOhAKaxhZl9", "spotifyArtistUrl": "https://artists.spotify.com/c/artist/3Ax9FlTyHNJdOhAKaxhZl9/home"}];
  function dedupePush(arr, obj){
    if (!Array.isArray(arr)) return;
    var exists = arr.some(function(a){ return (a.spotifyId||a.id) === (obj.spotifyId||obj.id) || a.name === obj.name; });
    if (!exists) arr.push(obj);
  }
  function tryAppend(){
    if (typeof window !== 'undefined'){
      var lists = [window.ARTISTS, window.artists, window.StreamsArtists];
      for (var i=0;i<lists.length;i++){
        if (Array.isArray(lists[i])){
          for (var j=0;j<extra.length;j++){ dedupePush(lists[i], extra[j]); }
          return true;
        }
      }
      // Some apps expose ARTISTS as a const in module scope; attempt a global fallback
      if (Array.isArray(window?.__ARTISTS__)) {
        for (var k=0;k<extra.length;k++){ dedupePush(window.__ARTISTS__, extra[k]); }
        return true;
      }
    }
    return false;
  }
  if (!tryAppend()){
    // retry once after load
    window.addEventListener('load', tryAppend);
  }
})();
