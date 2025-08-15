
(function(){
  var extra = [{"name": "Dreamflow", "spotifyId": "3JxvfjZaLHM60yYRt7BYZm"}, {"name": "Poluz", "spotifyId": "0vaXEuhH3eaJuTdMoLFdbN"}, {"name": "Doris Lost", "spotifyId": "43U1R9AZoGI3V5iaW6lht8"}, {"name": "Eternal", "spotifyId": "4oOqA7kbwce90hbDDKjoID"}, {"name": "Slaapmutsje", "spotifyId": "1iH0DmClTXD3DEXO490gbq"}, {"name": "ZizZa", "spotifyId": "20ajFDuyJzM8xGkWL9agiV"}, {"name": "Sleepy Teas", "spotifyId": "3Ax9FlTyHNJdOhAKaxhZl9"}];
  function add(list, item){
    if (!Array.isArray(list)) return;
    var exists = list.some(function(a){ return a?.spotifyId === item.spotifyId || a?.name === item.name; });
    if (!exists) list.push(item);
  }
  function inject(){
    var lists = [window.ARTISTS, window.artists, window.StreamsArtists, window.__ARTISTS__];
    for (var i=0;i<lists.length;i++){
      if (Array.isArray(lists[i])){
        for (var j=0;j<extra.length;j++) add(lists[i], extra[j]);
        return true;
      }
    }
    return false;
  }
  if (!inject()) window.addEventListener('load', inject);
})();    
