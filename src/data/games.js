// Every game on the site. The Games menu in the header and the /games index page are both built from this list,
// so a new game only needs an entry here (plus its page and route in App.jsx).
export const GAMES = [
  {
    id: 'unikittyville',
    to: '/game',
    title: 'Unikittyville',
    menuLabel: 'Unikittyville',
    tagline: 'A Unicorn Kitty Adventure',
    description:
      'Design your own unicorn kitty, then explore, fish, cook and make friends across a colorful world.',
    tags: ['Adventure', 'Keyboard'],
    image: '/games/previews/unikittyville.jpg',
    imageAlt: 'Unikittyville title screen with a pink unicorn kitty and color choices for fur, eyes and horn',
    imagePosition: 'center 30%',
  },
  {
    id: 'norahs-big-vacation',
    to: '/vacation',
    title: "Norah's Big Vacation",
    menuLabel: 'England Vacation',
    tagline: '12 chapters, 12 mini-games · England & France',
    description:
      'Pack with the pups, ride the London Eye, zoom under the sea to France and make the Eiffel Tower sparkle, earning passport stamps along the way.',
    tags: ['Story', 'Tap to play'],
    image: '/games/previews/norahs-big-vacation.jpg',
    imageAlt: "The London Eye chapter of Norah's Big Vacation: snap a photo when the glowing pod reaches the top",
    imagePosition: 'center 38%',
  },
  {
    id: 'nugs-pond',
    to: '/nugs-pond',
    title: "Nug's Pond",
    menuLabel: "Nug's Pond",
    tagline: 'Adding & subtracting with Nug the frog',
    description:
      'Four math games with number sizes from 0–5 up to 0–100. Earn stars to unlock hats and 48 animal stickers.',
    tags: ['Math', 'Made for iPad'],
    image: '/games/previews/nugs-pond.jpg',
    imageAlt: "Nug's Pond home screen with Nug the frog and the Lily Hop, Bubble Pop, Pond Race and Fish Friends games",
    imagePosition: 'center top',
  },
]
