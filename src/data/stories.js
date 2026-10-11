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
    logTitle: "Potato's Travel Log",
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
  {
    id: 'camilles-great-vacation',
    to: '/stories/camilles-great-vacation',
    title: "Camille's Great Vacation",
    menuLabel: "Camille's Great Vacation",
    author: 'Camille',
    tagline: 'Nine stops. One suitcase. Zero boring days!',
    description: 'Camille took a golden ticket around the world: cherry blossoms in Tokyo, an eagle in Mongolia, a luau in Hawaii, tea in London, a reef in Mexico and deep-dish pizza in Chicago, before a bike ride at home.',
    tags: [
      'Picture book',
      'Printable',
      'Longer read',
    ],
    image: '/stories/camilles-great-vacation/01.jpg',
    imageAlt: 'Camille the doll in a pink kimono with a pink cherry-blossom suitcase in front of the giant red lantern at Senso-ji in Tokyo',
    imagePosition: 'center 30%',
    printPdf: '/stories/camilles-great-vacation/camilles-great-vacation-booklet.pdf',
    pages: [
      {
        heading: 'Hello, World!',
        headingSilent: true,
        text: "Hi, I'm Camille! If you peeked into my bedroom in Richmond, Virginia, you might have noticed my bed was empty. Don't worry. I wasn't lost, and I wasn't missing. I was on the biggest adventure of my whole life!\n\nIt all began with one very boring Tuesday. Then I found a shiny golden ticket tucked inside my suitcase. It said: ONE TRIP AROUND THE WORLD. NO BORING DAYS ALLOWED. I grabbed my suitcase, tucked my stuffed corgi under my arm, and whispered, \"Let's go!\"",
        notes: [
          {
            label: 'RULE 1',
            text: 'Try one brand new food in every place.',
          },
          {
            label: 'RULE 2',
            text: 'Dance whenever there is music.',
          },
          {
            label: 'RULE 3',
            text: 'Say hello to everybody.',
          },
        ],
      },
      {
        heading: 'Stop 1: Tokyo, Japan',
        text: "WHOOSH! The ticket glowed, and I landed in Tokyo in a swirl of pink cherry blossoms. Under a giant red lantern, I said my first \"Konnichiwa!\" That means hello.\n\nThe old Asakusa market was crowded with shops and every one of them smelled delicious. A shopkeeper taught me how to bow, and I bowed so many times my hair bounced.\n\nI bought a warm, fish-shaped cake called taiyaki, stuffed with sweet red beans. Just then, a group of drummers started a thunderous taiko beat. I danced right in the middle of the street, and everyone clapped!",
        image: '/stories/camilles-great-vacation/01.jpg',
        imageAlt: 'Camille the doll in a pink kimono with a pink cherry-blossom suitcase in front of the giant red lantern at Senso-ji in Tokyo',
        notes: [
          {
            label: 'EAT',
            text: 'Taiyaki, a fish-shaped cake with sweet red beans',
          },
          {
            label: 'HEAR',
            text: 'Taiko drums that rumbled all the way to my toes',
          },
          {
            label: 'MEET',
            text: "Yuki, who taught me to say \"Oishii!\" (delicious)",
          },
        ],
      },
      {
        heading: 'Stop 2: Mongolia',
        text: "Next I zoomed to the windy grasslands of Mongolia, where a golden eagle named Altan landed on my arm. Sain baina uu! (Hello!)\n\nA herder family invited me into their round white tent, called a ger. It was warm inside and smelled like woodsmoke. Grandmother Naran handed me a bowl of salty milk tea and a plate of steamed dumplings called buuz. I ate five!\n\nAfter dinner, the cousins played a fiddle with a carved horse head on top. They taught me a galloping dance, and we stomped until the whole ger shook. Then we lay in the grass and counted more stars than I knew existed.",
        image: '/stories/camilles-great-vacation/02.jpg',
        imageAlt: 'Camille in a fur hat and blue coat on a horse, holding a bow, with a golden eagle on her arm on the Mongolian grassland',
        notes: [
          {
            label: 'EAT',
            text: 'Buuz, steamed dumplings with juicy meat inside',
          },
          {
            label: 'HEAR',
            text: 'The morin khuur, a fiddle with a horse-head top',
          },
          {
            label: 'MEET',
            text: 'Altan, a golden eagle with a very serious stare',
          },
        ],
      },
      {
        heading: 'Stop 3: The Maldives',
        text: "A seaplane splashed down in the Maldives, a sparkling chain of more than a thousand tiny islands. My hut stood on stilts right over the water. I could watch fish swim by from my hammock!\n\nI sipped a fruity punch with a pink umbrella, and then I put on a mask and snorkeled. A sea turtle paddled beside me, and a manta ray as wide as a trampoline glided underneath.\n\nThat night, a fisherman named Hassan grilled tuna right on the beach. Drummers began a boduberu, with big drums and clapping that got faster and faster. The waves in the lagoon even glowed blue, like someone had spilled glitter in the sea.",
        image: '/stories/camilles-great-vacation/03.jpg',
        imageAlt: 'Camille in a hammock with a fruity drink with a pink umbrella, in front of overwater huts in the Maldives',
        notes: [
          {
            label: 'EAT',
            text: 'Fresh grilled tuna with sweet coconut',
          },
          {
            label: 'HEAR',
            text: 'Boduberu drums that make everyone dance faster',
          },
          {
            label: 'MEET',
            text: 'Hassan, a fisherman who let me steer his boat',
          },
        ],
      },
      {
        heading: 'Stop 4: Honolulu, Hawaii',
        text: "Aloha! I touched down on Waikiki Beach just as the sun began to set. Someone placed a necklace of flowers, called a lei, around my neck. A luau was about to begin!\n\nThe hula dancers told whole stories with their hands. I saw rain falling, waves rolling, and birds flying. A dancer named Leilani pulled me up to join them, and I swayed my hips like the ocean.\n\nThe feast was amazing: sweet pineapple, pork cooked slowly in an underground oven, and shave ice in every color. A musician strummed a tiny ukulele. Its name means \"jumping flea\" because the fingers hop so fast. Mahalo means thank you, and I said it about a hundred times.",
        image: '/stories/camilles-great-vacation/04.jpg',
        imageAlt: 'Camille in flower leis and a grass skirt dancing hula at sunset on Waikiki Beach with Diamond Head behind her',
        notes: [
          {
            label: 'EAT',
            text: 'Shave ice and juicy fresh pineapple',
          },
          {
            label: 'HEAR',
            text: "A ukulele, which means \"jumping flea\"",
          },
          {
            label: 'MEET',
            text: 'Leilani, a dancer who taught me the hula',
          },
        ],
      },
      {
        heading: 'Stop 5: London, England',
        text: "Next I popped up beside the River Thames, right under Big Ben! The clock tower bonged, red buses zoomed past, and two guards in scarlet and gold posed for a photo with me.\n\nDid you know the guards in red are called Beefeaters? One of them, Mr. Hargrove, told me secrets about an old castle full of ravens. Then I rode in the very front seat on top of a double-decker bus and pretended I was driving.\n\nFor afternoon tea, I stirred my cup with my pinky out. I ate fluffy scones with jam and thick cream. (People argue about which goes on first!) A street singer played a Beatles song on the guitar, and the whole crowd sang along.",
        image: '/stories/camilles-great-vacation/05.jpg',
        imageAlt: 'Camille with a plaid scarf and a Union Jack flag in front of Big Ben with two red-uniformed Beefeater guards',
        notes: [
          {
            label: 'EAT',
            text: 'A warm scone with strawberry jam and cream',
          },
          {
            label: 'HEAR',
            text: 'A street singer and a whole crowd singing along',
          },
          {
            label: 'MEET',
            text: 'Mr. Hargrove, a Beefeater who loved my jokes',
          },
        ],
      },
      {
        heading: 'Stop 6: Florida',
        text: "After so much city, I wanted sand! I hopped to a Florida beach and built a sandcastle with four towers. Then I found a giant shell, held it to my ear, and heard the ocean whisper hello.\n\nA girl named Marisol spotted my castle and said it needed a moat. We dug and dug until the moat was as long as a jump rope. When a wave crashed over it, we shrieked and laughed and started all over again.\n\nLater, we shared a slice of key lime pie that was tangy and sweet and cold. At sunset, a band played steel drums that sounded like bubbling water. We danced barefoot in the sand while dolphins jumped in the waves.",
        image: '/stories/camilles-great-vacation/06.jpg',
        imageAlt: 'Camille in a flowery swimsuit on a Florida beach next to a sandcastle, holding a big pink shell',
        notes: [
          {
            label: 'EAT',
            text: 'Key lime pie, tangy and sweet and ice cold',
          },
          {
            label: 'HEAR',
            text: 'Steel drums that sounded like bubbling water',
          },
          {
            label: 'MEET',
            text: 'Marisol, an expert sandcastle engineer',
          },
        ],
      },
      {
        heading: 'Stop 7: Alaska',
        text: "Brrr! I swapped sand for snow in the mountains of Alaska. I zipped into a pink snowsuit and signed up for ski school. My first run was wobblier than a bowl of jelly!\n\n\"Make a pizza, not french fries!\" called my instructor, Sam. That means point your skis in a wedge to slow down. I wobbled, I wiggled, and I fell on my bottom six times. But by the afternoon, I was zigzagging down the mountain like a pro.\n\nAt the lodge, I had hot chocolate piled with marshmallows. That night, the sky filled with ribbons of green and purple light. They were the northern lights! Everyone around the fire stopped talking, and the only sound was a fiddle playing softly.",
        image: '/stories/camilles-great-vacation/07.jpg',
        imageAlt: 'Camille in a pink snowsuit and helmet skiing downhill with a ski instructor behind her in the Alaskan mountains',
        notes: [
          {
            label: 'EAT',
            text: 'Hot chocolate with a mountain of marshmallows',
          },
          {
            label: 'HEAR',
            text: 'A fiddle by a crackling fire',
          },
          {
            label: 'MEET',
            text: 'Sam, a ski teacher who never stopped smiling',
          },
        ],
      },
      {
        heading: 'Stop 8: Cozumel, Mexico',
        text: "From snowflakes to bubbles! In Mexico, I strapped on a tank, flippers, and a mask and dove into the warm sea. \"Hola!\" I tried to say, but only bubbles came out.\n\nThe coral reef was a whole city under the water. Yellow and blue fish zipped past, a sea turtle glided by, and a moray eel peeked out of a cave. Then a shark swam right over my head! My heart did a flip, but my guide, Lucía, gave me the OK signal. Sharks are mostly curious, not hungry.\n\nBack on the dock, I tried tacos with pineapple and the creamiest guacamole ever. A mariachi band marched up with trumpets and violins, and I danced until my flippers fell off.",
        image: '/stories/camilles-great-vacation/08.jpg',
        imageAlt: 'Camille scuba diving in pink flippers and goggles over a coral reef with colorful fish, a sea turtle and a shark',
        notes: [
          {
            label: 'EAT',
            text: 'Tacos al pastor with fresh guacamole',
          },
          {
            label: 'HEAR',
            text: 'Mariachi trumpets and violins on the dock',
          },
          {
            label: 'MEET',
            text: 'Lucía, a guide who knows every fish by name',
          },
        ],
      },
      {
        heading: 'Stop 9: Chicago, Illinois',
        text: "My last stop was the Windy City! My hotel room had a window full of twinkling skyscrapers and a river that sparkled like jewelry. I was tired in the very best way.\n\nBefore bed, I took a boat ride down the Chicago River. The buildings were so tall I had to lean all the way back to see the tops. Our guide pointed out the Willis Tower, which scrapes the clouds.\n\nFor dinner, I ate deep-dish pizza so thick it needed a fork. The cheese stretched out as long as my arm! In a park nearby, a blues band wailed on a saxophone and a harmonica. A doorman named Frank handed me a warm cookie and wished me goodnight.",
        image: '/stories/camilles-great-vacation/09.jpg',
        imageAlt: 'Camille asleep in a hotel bed hugging a stuffed corgi, with the Chicago skyline glowing in the window',
        notes: [
          {
            label: 'EAT',
            text: 'Deep-dish pizza with cheese that stretched for miles',
          },
          {
            label: 'HEAR',
            text: 'A blues band with a saxophone and a harmonica',
          },
          {
            label: 'MEET',
            text: 'Frank, a doorman with the best warm cookies',
          },
        ],
      },
      {
        heading: 'Home Sweet Home',
        text: "The last whoosh landed me in my own bed in Richmond, Virginia. My own pillow. My own butterfly night-light. I fell asleep before I finished my yawn.\n\nDo you know the best part of a big adventure? Coming home to the people and things you love.\n\nI slept for a very long time, and I dreamed of everywhere at once. I dreamed of drums in Japan, a golden eagle in Mongolia, and a shark that wanted to be friends. In my dream, they were all dancing together in a big circle, and I was dancing right in the middle.\n\nMy suitcase was full of seashells, flags, and stories, and I couldn't wait to share every single one.",
        image: '/stories/camilles-great-vacation/10.jpg',
        imageAlt: 'Camille asleep in her purple bedroom with a stuffed corgi, a glowing butterfly night-light and a basket of toys',
      },
      {
        heading: 'The Next Morning',
        text: "I woke up with sand in my shoes and, I'm pretty sure, a tiny bit of Hawaiian sunshine in my hair. I put on my green helmet, hopped on my pink bike, and zoomed out of the driveway!",
        image: '/stories/camilles-great-vacation/00.jpg',
        imageAlt: 'Camille in a green helmet riding a pink bike down her driveway in front of her house',
      },
    ],
    // Clips live in S3 under podcast/ (audio is not stored in git, and that prefix survives deploys). One clip per
    // part of the story, in reading order. A clip can cover several spreads (page index or 'end').
    narration: [
      { src: '/podcast/stories/camilles-great-vacation/part-01.mp3', pages: [0], readsNotes: true },
      { src: '/podcast/stories/camilles-great-vacation/part-02.mp3', pages: [1] },
      { src: '/podcast/stories/camilles-great-vacation/part-03.mp3', pages: [2] },
      { src: '/podcast/stories/camilles-great-vacation/part-04.mp3', pages: [3] },
      { src: '/podcast/stories/camilles-great-vacation/part-05.mp3', pages: [4] },
      { src: '/podcast/stories/camilles-great-vacation/part-06.mp3', pages: [5] },
      { src: '/podcast/stories/camilles-great-vacation/part-07.mp3', pages: [6] },
      { src: '/podcast/stories/camilles-great-vacation/part-08.mp3', pages: [7] },
      { src: '/podcast/stories/camilles-great-vacation/part-09.mp3', pages: [8] },
      { src: '/podcast/stories/camilles-great-vacation/part-10.mp3', pages: [9] },
      { src: '/podcast/stories/camilles-great-vacation/part-11.mp3', pages: [10] },
      { src: '/podcast/stories/camilles-great-vacation/part-12.mp3', pages: [11, 'end'] },
    ],
    logTitle: "Camille's Travel Log",
    log: [
      {
        place: 'Tokyo, Japan',
        note: 'Taiyaki and taiko drums',
      },
      {
        place: 'Mongolia',
        note: 'Dumplings and a golden eagle',
      },
      {
        place: 'The Maldives',
        note: 'Snorkeling and island drums',
      },
      {
        place: 'Hawaii',
        note: 'Hula and shave ice',
      },
      {
        place: 'London, England',
        note: 'Scones and double-decker buses',
      },
      {
        place: 'Florida',
        note: 'Sandcastles and key lime pie',
      },
      {
        place: 'Alaska',
        note: 'Skiing and the northern lights',
      },
      {
        place: 'Cozumel, Mexico',
        note: 'Diving and mariachi',
      },
      {
        place: 'Chicago, Illinois',
        note: 'Deep-dish pizza and the blues',
      },
      {
        place: 'Richmond, Virginia',
        note: 'My own cozy bed!',
      },
    ],
    ending: {
      heading: 'The End...Or Is It?',
      headingSilent: true,
      text: "Here is what I learned: the whole world is full of friendly people, yummy food, and music that makes your feet want to move. And the best part is that the same is true right outside my front door!\n\nRiding my bike down my own street, with the wind in my hair, felt just like an adventure too. Maybe an adventure is not about how far you go. Maybe it's about saying yes, saying hello, and keeping your eyes wide open.\n\nSo where should I go next? Turn the page and tell me!\n\nLove, Camille",
    },
  },
]
