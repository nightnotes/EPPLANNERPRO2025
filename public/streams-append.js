
(function(){
  var extra = [{"name": "Dreamflow", "spotifyId": "3JxvfjZaLHM60yYRt7BYZm", "spotifyArtistUrl": "https://artists.spotify.com/c/artist/3JxvfjZaLHM60yYRt7BYZm/home"}, {"name": "Poluz", "spotifyId": "0vaXEuhH3eaJuTdMoLFdbN", "spotifyArtistUrl": "https://artists.spotify.com/c/artist/0vaXEuhH3eaJuTdMoLFdbN/home"}, {"name": "Doris Lost", "spotifyId": "43U1R9AZoGI3V5iaW6lht8", "spotifyArtistUrl": "https://artists.spotify.com/c/artist/43U1R9AZoGI3V5iaW6lht8/home"}, {"name": "Eternal", "spotifyId": "4oOqA7kbwce90hbDDKjoID", "spotifyArtistUrl": "https://artists.spotify.com/c/artist/4oOqA7kbwce90hbDDKjoID/home"}, {"name": "Slaapmutsje", "spotifyId": "1iH0DmClTXD3DEXO490gbq", "spotifyArtistUrl": "https://artists.spotify.com/c/artist/1iH0DmClTXD3DEXO490gbq/home"}, {"name": "ZizZa", "spotifyId": "20ajFDuyJzM8xGkWL9agiV", "spotifyArtistUrl": "https://artists.spotify.com/c/artist/20ajFDuyJzM8xGkWL9agiV/home"}, {"name": "Sleepy Teas", "spotifyId": "3Ax9FlTyHNJdOhAKaxhZl9", "spotifyArtistUrl": "https://artists.spotify.com/c/artist/3Ax9FlTyHNJdOhAKaxhZl9/home"}];
  function ensureKey(obj, fromA, toB){
    if (obj[toB] == null && obj[fromA] != null) obj[toB] = obj[fromA];
  }
  function normalize(a){
    ensureKey(a, 'id', 'spotifyId');
    return a;
  }
  function dedupePush(arr, obj){
    if (!Array.isArray(arr)) return;
    var o = normalize(obj);
    var exists = arr.some(function(a){
      a = normalize(a||{});
      return (a.spotifyId && o.spotifyId && a.spotifyId === o.spotifyId) || (a.name === o.name);
    });
    if (!exists) arr.push(o);
  }
  function tryAppend(){
    var lists = [];
    if (typeof window !== 'undefined'){
      lists = [window.ARTISTS, window.artists, window.StreamsArtists, window.__ARTISTS__];
    }
    var attached = false;
    for (var i=0;i<lists.length;i++){
      if (Array.isArray(lists[i])){
        for (var j=0;j<extra.length;j++){ dedupePush(lists[i], extra[j]); }
        attached = true;
      }
    }
    return attached;
  }
  if (!tryAppend()){
    window.addEventListener('load', tryAppend);
  }
})();    
