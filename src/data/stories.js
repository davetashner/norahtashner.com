// Every story on the site. The Stories menu in the header and the /stories index page are both built from this
// list, and each story is read at /stories/<id>, so a new story only needs an entry here (plus its images in
// public/stories/<id>/).
export const STORIES = [
  {
    id: 'potatos-big-adventure',
    to: '/stories/potatos-big-adventure',
    title: "Potato's Big Adventure",
    menuLabel: "Potato's Big Adventure",
    author: 'Potato Tashner',
    tagline: 'Where was Potato? On vacation!',
    description:
      'Potato the corgi was not lost. She flew from Richmond to Paris, Texas, Times Square, Florence, Bruges and Paris, France, and came home with new stickers on her suitcase.',
    tags: ['Picture book', 'Printable'],
    image: '/stories/potatos-big-adventure/00.jpg',
    imageAlt: 'Potato the corgi in a cowboy hat pulling a suitcase through Richmond International Airport',
    imagePosition: 'center 40%',
    printPdf: '/stories/potatos-big-adventure/potatos-big-adventure-booklet.pdf',
    pages: [
      {
        heading: 'Hello!',
        text: "Hi, I'm Potato! Have you noticed I wasn't on my favorite spot on the couch? Don't worry. I wasn't lost, and I wasn't missing. I was on VACATION!",
        image: '/stories/potatos-big-adventure/01.jpg',
        imageAlt: 'Potato the corgi lying on the arm of the couch',
      },
      {
        heading: 'Up, Up, and Away!',
        text: 'I packed my suitcase, my coziest blanket, and my best little buddy. Then I flew away from Richmond International Airport. I was so sleepy that I snoozed above the pink clouds. Zzzzz...',
        image: '/stories/potatos-big-adventure/02.jpg',
        imageAlt: 'Potato asleep on an airplane in a sleep mask, hugging a tiny corgi toy, with a sunset sky outside the window',
      },
      {
        heading: 'Stop 1: Paris, Texas',
        text: 'First, I went to Paris, Texas! They have their very own Eiffel Tower, and it wears a giant cowboy hat! I wore my cowboy hat, too. Yeehaw!',
        image: '/stories/potatos-big-adventure/07.jpg',
        imageAlt: 'Potato in a cowboy hat and red bandana sitting in front of the Eiffel Tower with a cowboy hat in Paris, Texas',
      },
      {
        heading: 'Stop 2: Times Square',
        text: 'Next, I zoomed to Times Square in New York City. The lights were so big and bright, it felt like daytime at bedtime! My tail wagged and wagged.',
        image: '/stories/potatos-big-adventure/03.jpg',
        imageAlt: 'Potato looking back over her shoulder in Times Square with giant glowing signs and a yellow taxi',
      },
      {
        heading: 'Stop 3: Florence, Italy',
        text: 'Then I flew over the ocean to Florence, Italy. I trotted on bumpy cobblestones past a giant red dome. Everything smelled yummy. Ciao, Florence!',
        image: '/stories/potatos-big-adventure/04.jpg',
        imageAlt: 'Potato trotting on cobblestones in front of the red dome of the Florence cathedral',
      },
      {
        heading: 'Stop 4: Bruges, Belgium',
        text: 'In Bruges, I rode in a little boat on the canals. Pretty white swans floated right past me, and flowers hung from every window. It was so peaceful.',
        image: '/stories/potatos-big-adventure/06.jpg',
        imageAlt: 'Potato in a wooden boat on a canal in Bruges with a bell tower and a swan',
      },
      {
        heading: 'Stop 5: Paris, France',
        text: 'My last stop was the other Paris, in France! I had a picnic under the Eiffel Tower with a croissant, strawberries, and cheese. Bonjour! That means hello.',
        image: '/stories/potatos-big-adventure/05.jpg',
        imageAlt: 'Potato on a picnic blanket with a croissant, strawberries and cheese in front of the Eiffel Tower',
      },
      {
        heading: 'Home Sweet Home',
        text: 'After so many adventures, I was ready to go home. I trotted back through Richmond International Airport with new stickers and lots of stories.',
        image: '/stories/potatos-big-adventure/08.jpg',
        imageAlt: 'Potato from behind, pulling her sticker-covered suitcase through Richmond International Airport at sunset',
      },
    ],
    log: [
      { place: 'Richmond, Virginia', hello: 'Hello, home!' },
      { place: 'Paris, Texas', hello: 'Howdy!' },
      { place: 'New York City', hello: 'Hey there!' },
      { place: 'Florence, Italy', hello: 'Ciao!' },
      { place: 'Bruges, Belgium', hello: 'Hallo!' },
      { place: 'Paris, France', hello: 'Bonjour!' },
      { place: 'Richmond, Virginia', hello: "I'm back!" },
    ],
    ending: {
      heading: 'The End',
      text: "So that's why I was gone. I wasn't missing. I was exploring! Now I'm back on my favorite spot, dreaming about where to go next. Love, Potato",
      image: '/stories/potatos-big-adventure/01.jpg',
      imageAlt: 'Potato the corgi back on the arm of the couch',
    },
  },
]
