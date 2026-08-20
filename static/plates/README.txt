Plates.

Drop a photograph here and switch it on in src/routes/+page.svelte by
setting `src` on the matching entry in the `plates` array, e.g.

    { plate: 'Plate I', caption: 'BUILDT, Dublin', src: '/plates/buildt-01.jpg' }

Notes:
- Shoot in colour and keep the original. The site converts to monochrome
  in CSS, so the palette holds either way and you keep the option.
- Export around 1600px on the long edge. The plates are never displayed
  wider than about 520px, so anything larger is wasted weight.
- The frame is 4:5 portrait. Compose for that, or pass a different
  `ratio` to the Plate component.
- Below the fold, so they load lazily. Do not put a plate in the hero.
