# Station Soundscape

Its a generative ambient music data visualization web app.. It turns
the arrival and departure of train into music notes, ripples and dots!!!

## What it does
- Live mode: gets realtime train data from Finland's digitraffic website
- Offline mode : makes fake train data (when there is no internet/some issue with digitraffic)
- Song mode: fake trains that play a real song(Mary Had a little lamb for now)

- Picks a station and a mood(bright/sad). Each station has a different starting note

## How trains form the music
- The track number picks the note from a pentatonic scale 
- cancelled train is always silent
- arrivals fly in towards and departures fly outwards
- green = on time, amber = little late, red = very late
- real gaps between the trains are sped up alot to form ambient type music

## Modes
/?mode=offline - fake train data
/?mode=song - fake train data to play song
 (append this after the url)


