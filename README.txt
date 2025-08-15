
PATCH: Voeg 7 artiesten toe aan het STREAMS-tabblad.

Optie A (meest toekomstvast):
- Als je project een centrale lijst gebruikt (bijv. public/streams/artists.json of een ARTISTS-array in streams.js):
  * Open die lijst en plak deze 7 entries erbij (of merge het bestand public/streams/artists-extra.json).
  * Formaat: { "name", "spotifyId", "spotifyArtistUrl" }.

Optie B (zonder code te wijzigen):
- Zet het bestand public/streams-append.js in je project en voeg in public/streams.html na streams.js de regel toe:
  <script defer src="/streams-append.js"></script>
  Dit script voegt de 7 artiesten toe aan een globale lijst (ARTISTS / artists / StreamsArtists) als die bestaat.

Bestanden in deze patch:
- public/streams/artists-extra.json
- public/streams-append.js

Artiesten:
- Dreamflow (3JxvfjZaLHM60yYRt7BYZm)
- Poluz (0vaXEuhH3eaJuTdMoLFdbN)
- Doris Lost (43U1R9AZoGI3V5iaW6lht8)
- Eternal (4oOqA7kbwce90hbDDKjoID)
- Slaapmutsje (1iH0DmClTXD3DEXO490gbq)
- ZizZa (20ajFDuyJzM8xGkWL9agiV)
- Sleepy Teas (3Ax9FlTyHNJdOhAKaxhZl9)
