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
  {
    id: "camiles-great-big-wonderful-adventure",
    to: "/stories/camiles-great-big-wonderful-adventure",
    title: "Camile's Great Big Wonderful World Adventure",
    menuLabel: "Camile's Great Big Adventure",
    author: "Camile",
    tagline: "Seven continents. One small suitcase. A silver flute.",
    description: "Camile the doll travels to all seven continents with a tiny suitcase and a silver flute: jazz in New York, Andean flutes in Peru, a cafe waltz in Paris, lanterns in Marrakech, dancing in India, taiko drums in Japan, starry skies in Australia and the coldest concert in Antarctica.",
    tags: [
      "Picture book",
      "Printable",
      "Longer read",
      "Read aloud"
    ],
    image: "/stories/camiles-great-big-wonderful-adventure/00.jpg",
    imageAlt: "Camile the doll in a pink sequined dress and turquoise boots, holding a silver flute beside a sticker-covered pink suitcase in front of a giant globe",
    imagePosition: "center 35%",
    printPdf: "/stories/camiles-great-big-wonderful-adventure/camiles-great-big-wonderful-adventure-booklet.pdf",
    pages: [
      {
        heading: "Chapter 1: A Very Small Suitcase and a Very Big World",
        text: "Camile was not an ordinary doll.\n\nWell, she looked like an ordinary doll. She had bright blue eyes, fluffy blonde hair, and a pink sparkly dress that glittered whenever she danced.\n\nBut Camile had a secret.\n\nShe was a world traveler.\n\nAnd not just any world traveler. Camile had climbed mountains, sailed across oceans, tasted foods with names she couldn't pronounce, and once danced for three hours at a wedding where she didn't understand a single word anyone was saying.\n\nShe understood the music, though.\n\nCamile always understood the music.\n\nOne sunny morning in Virginia, Camile stood beside her little pink suitcase, studying a map of the world.\n\n\"Seven continents,\" she whispered. \"Seven enormous, extraordinary continents.\"\n\nShe traced a finger across the map.\n\nNorth America. South America. Europe. Africa. Asia. Australia. Antarctica.\n\nThen she looked at her suitcase.\n\nIt was very small.\n\nInside were four outfits, a toothbrush, a tiny notebook, a pencil, and her most precious possession: a silver flute.\n\n\"Perfect!\" Camile declared. \"Everything I need!\"\n\nShe did not pack seven pairs of shoes. She did not pack a hair dryer. She certainly did not pack a television.\n\n\"Why carry things,\" she liked to say, \"when you can carry memories instead?\"\n\nCamile put on her favorite pink sequined dress and turquoise boots.\n\nShe kissed her two best friends, Emerson and Norah, goodbye and promised to write from every stop.\n\n\"Will you be scared?\" Emerson asked.\n\n\"Probably sometimes!\" Camile said cheerfully.\n\n\"Will you get lonely?\" Norah asked.\n\n\"Maybe a little!\"\n\n\"Then why are you smiling?\"\n\nCamile grinned.\n\n\"Because I haven't even left yet, and I've already learned something wonderful.\"\n\n\"What's that?\"\n\n\"That you can be a little scared and very excited at the same time!\"\n\nAnd with that, she rolled her tiny suitcase down the driveway.\n\nHer great big adventure had begun.",
        image: "/stories/camiles-great-big-wonderful-adventure/01.jpg",
        imageAlt: "Camile waving goodbye as she rolls her pink suitcase down a sunny Virginia driveway while her two best friends wave from the porch"
      },
      {
        heading: "Chapter 2: The City That Never Sleeps (North America)",
        text: "Camile's first airplane landed in New York City.\n\nShe pressed her nose against the window as enormous buildings rose toward the clouds.\n\n\"Goodness gracious!\" she gasped. \"It's like somebody planted skyscraper seeds!\"\n\nNew York was loud.\n\nTaxis honked. Trains rumbled. Street musicians played saxophones, drums, guitars, and instruments Camile had never seen before.\n\nShe loved it immediately.\n\nFor breakfast, she visited a little bakery where the owner handed her a warm bagel with cream cheese.\n\n\"Good morning!\" he said.\n\n\"Good morning!\" Camile answered.\n\n\"You visiting?\"\n\n\"Every continent on Earth!\"\n\nThe baker blinked.\n\n\"That's a pretty big trip for someone so small.\"\n\nCamile took a tremendous bite of her bagel.\n\n\"Good thing I have a tremendous appetite!\"\n\nThat afternoon, she wandered into Central Park and heard the most marvelous sound.\n\nA jazz band was playing beneath the trees.\n\nCamile stopped dancing only long enough to unzip her suitcase and pull out her flute.\n\n\"May I join you?\"\n\nThe trumpet player smiled.\n\n\"Can you keep up?\"\n\nCamile raised one eyebrow.\n\n\"Can you?\"\n\nThe band laughed.\n\nAnd then the music began.\n\nThe trumpet went BA-BA-BWAAA!\n\nThe drums went TSS-BOOM-TSS!\n\nAnd Camile's little flute went TWEE-TWEE-TWEEE!\n\nSoon everyone was clapping, dancing, and laughing.\n\nThat evening, Camile ate dinner at a beautiful restaurant high above the city. Chandeliers sparkled overhead, and a waiter served her a tiny, perfectly arranged plate of pasta.\n\nIt was delicious.\n\nBut Camile thought the bagel had been just as wonderful.\n\nShe opened her notebook.\n\nDear Emerson and Norah,\n\nNew York is HUGE! I played jazz in Central Park and ate breakfast in a bakery and dinner in a restaurant way up in the sky. Both were wonderful!\n\nI learned that the best part of a meal isn't how fancy the restaurant is. It's how happy you feel eating it.\n\nNext stop: South America!\n\nLove, Camile",
        image: "/stories/camiles-great-big-wonderful-adventure/02.jpg",
        imageAlt: "Camile playing her silver flute on a Central Park bench with a jazz band, the Manhattan skyline behind the trees"
      },
      {
        heading: "Chapter 3: Dancing Above the Clouds (South America)",
        text: "The flight to Peru was long.\n\nVery long.\n\nCamile watched two movies, ate her airplane dinner, took a nap, woke up, read half a book, and looked out the window.\n\nStill flying.\n\n\"Excellent!\" she whispered. \"More time to imagine what's waiting!\"\n\nWhen she landed, she changed into her beautiful blue-and-green dress with its swishy layers and matching bow.\n\nIn the city of Cusco, she learned her first Spanish words.\n\n\"Hola!\" meant hello.\n\n\"Gracias!\" meant thank you.\n\nAnd \"¡Qué rico!\" meant how delicious!\n\nCamile used that last one quite a lot.\n\nAt a market, she tried warm corn, fresh bread, and a bowl of delicious potato soup.\n\n\"¡Qué rico!\" she announced.\n\nThe woman serving the soup laughed.\n\nLater, Camile traveled into the mountains, where the ancient stone city of Machu Picchu stood high among the clouds.\n\nShe stared in amazement.\n\n\"How did people build something so beautiful so long ago?\"\n\nHer guide explained that the Inca people had been remarkable builders who understood stone, mountains, and the land around them.\n\nCamile listened carefully.\n\nThat night, in a nearby village, musicians played traditional Andean melodies on wooden flutes called quenas.\n\nCamile's eyes widened.\n\n\"You play the flute too!\"\n\nOne musician offered to teach her a melody.\n\nIt sounded different from anything she had learned before. The notes floated and curved like birds flying through the mountains.\n\nCamile practiced.\n\nShe squeaked.\n\nShe tried again.\n\nShe squeaked louder.\n\nEveryone laughed kindly, including Camile.\n\nFinally, she found the melody.\n\nThe musician smiled.\n\nTogether they played beneath the stars while the villagers danced.\n\nCamile's little blue-and-green skirt spun round and round.\n\nBefore bed, she wrote another letter.\n\nDear Emerson and Norah,\n\nPeru is magnificent! I visited mountains so high they touched the clouds, learned to say \"¡Qué rico!\" when something tastes delicious, and played a beautiful song with Andean musicians.\n\nMy flute sounded terrible at first. But I learned that being bad at something new is just the beginning of getting good at it.\n\nAlso, potatoes are VERY important here, and I approve completely.\n\nLove, Camile",
        image: "/stories/camiles-great-big-wonderful-adventure/03.jpg",
        imageAlt: "Camile in a blue-and-green dress playing her flute beside an Andean musician with a quena at Machu Picchu, a llama peeking in"
      },
      {
        heading: "Chapter 4: The Most Wonderful Croissant in Paris (Europe)",
        text: "Camile arrived in Paris wearing her sunny yellow flowered dress and a straw hat tied with a pink ribbon.\n\n\"Bonjour!\" she said proudly.\n\nShe had practiced the word all the way across the Atlantic Ocean.\n\n\"Bonjour!\" answered the woman at the bakery.\n\nCamile gazed into the glass display.\n\nCroissants. Éclairs. Macarons. Tarts covered with strawberries.\n\n\"Oh dear,\" Camile whispered. \"I may need to move here.\"\n\nShe ordered a croissant and a cup of hot chocolate.\n\nThe croissant was warm and buttery and so flaky that crumbs scattered down her dress.\n\nCamile carefully picked up one crumb.\n\n\"Too delicious to waste.\"\n\nShe walked along the Seine, admired the bridges, and stared up at the Eiffel Tower.\n\nThat evening, the tower began to sparkle.\n\nCamile gasped.\n\n\"It looks like a thousand tiny stars decided to visit Paris!\"\n\nAt dinner, she visited an elegant French restaurant with white tablecloths, little candles, and a waiter who brought courses so beautiful Camile almost felt bad eating them.\n\nAlmost.\n\nShe tasted delicate vegetables, creamy sauce, and the tiniest chocolate dessert she had ever seen.\n\n\"Magnifique!\" she declared.\n\nThe next morning, she visited a small neighborhood café, where an elderly gentleman was playing an accordion.\n\nCamile sat beside him.\n\n\"Would you like some company?\"\n\nThe gentleman nodded.\n\nShe raised her silver flute, and together they played a cheerful waltz.\n\nAn elderly woman stood up and began to dance.\n\nThen a couple joined her.\n\nThen two children.\n\nBefore long, the entire café was dancing.\n\nCamile twirled so fast her straw hat fell off.\n\nShe caught it with one hand and finished the dance with a bow.\n\n\"Merci beaucoup!\" everyone cheered.\n\nThat night, Camile wrote by the light of her hotel window.\n\nDear Emerson and Norah,\n\nParis smells like fresh bread and flowers! I learned \"bonjour\" and \"merci,\" which means thank you. I ate in a fancy restaurant and a little café, and the café turned into a dance party!\n\nI think the Eiffel Tower is beautiful, but do you know what's even more beautiful? Watching strangers become friends when music starts playing.\n\nI miss you both. I hope you're dancing at home!\n\nLove, Camile",
        image: "/stories/camiles-great-big-wonderful-adventure/04.jpg",
        imageAlt: "Camile laughing and spinning outside a Paris cafe as her straw hat flies off, an accordion player and the Eiffel Tower behind her"
      },
      {
        heading: "Chapter 5: The Music of Marrakech (Africa)",
        text: "Camile's next flight carried her south across the Mediterranean Sea to Morocco, in Africa.\n\nShe arrived in Marrakech, where the buildings glowed pink and orange beneath the afternoon sun.\n\nThe markets were full of colors.\n\nRed carpets. Blue pottery. Golden lanterns. Mountains of fragrant spices.\n\nCamile had never smelled so many wonderful things at once.\n\n\"Marhaba!\" said a shopkeeper.\n\n\"Marhaba!\" Camile replied.\n\nShe learned that it was an Arabic greeting, and that \"shukran\" meant thank you.\n\nShe also heard people speaking Moroccan Arabic and Amazigh languages.\n\n\"More languages!\" Camile exclaimed. \"My notebook is going to be full!\"\n\nAt lunchtime, she visited a tiny restaurant tucked down a narrow lane.\n\nThe cook brought her a steaming tagine filled with vegetables, tender meat, and warm spices.\n\nCamile lifted the lid.\n\nA delicious cloud of steam floated toward her nose.\n\n\"Oh! That smells like a hug!\"\n\nShe ate with fresh bread and finished every bite.\n\nThat evening, she visited a beautiful courtyard restaurant surrounded by carved arches, fountains, and hundreds of glowing lanterns.\n\nMusicians were playing drums and stringed instruments.\n\nCamile asked about the rhythm.\n\nOne drummer tapped out a pattern.\n\nDUM-da-da-DUM!\n\nCamile tried to copy it with her hands.\n\nDUM-da-DUM-da—\n\n\"Oops!\"\n\nShe tried again.\n\nAnd again.\n\nSoon she could clap along.\n\nThen she brought out her flute.\n\nThe musicians welcomed her into their circle, and together they made a new melody.\n\nIt wasn't quite French music.\n\nIt wasn't quite Peruvian music.\n\nIt was something new.\n\nSomething they had created together.\n\nCamile danced beneath the lanterns until her feet were tired and her cheeks hurt from smiling.\n\nDear Emerson and Norah,\n\nMorocco is full of beautiful colors, delicious smells, and wonderful music! I learned \"marhaba\" and \"shukran,\" and ate the tastiest tagine.\n\nTonight, the musicians taught me a rhythm I'd never heard before. I shared a flute melody, and we made something new together.\n\nThe world has so many different kinds of music. I want to hear every single one!\n\nLove, Camile",
        image: "/stories/camiles-great-big-wonderful-adventure/05.jpg",
        imageAlt: "Camile sitting cross-legged with her eyes closed, playing her flute in a Marrakech courtyard full of lanterns and musicians"
      },
      {
        heading: "Chapter 6: A Thousand Colors and a Thousand Smiles (Asia)",
        text: "Camile arrived in Jaipur, India, as the sun rose over the city.\n\nShe wore her blue-and-green dress again, but added colorful bangles she'd bought at a market.\n\nEverywhere she looked, she saw beautiful patterns.\n\nPainted doors. Bright fabrics. Colorful flowers. Intricate carvings.\n\nA friendly shopkeeper greeted her.\n\n\"Namaste!\"\n\n\"Namaste!\" Camile replied.\n\nShe learned that many languages were spoken in India, and that Hindi was one of them.\n\n\"Dhanyavaad,\" she practiced. \"Thank you!\"\n\nAt lunchtime, a family invited Camile to share a homemade meal.\n\nThere was warm naan bread, fragrant rice, dal, and vegetables cooked with delicious spices.\n\nCamile dipped the naan into the dal.\n\nHer eyes widened.\n\n\"Oh, that's wonderful!\"\n\nThe grandmother smiled.\n\n\"Have some more.\"\n\nCamile happily agreed.\n\nThat evening, she attended a celebration with musicians and dancers wearing beautifully colorful clothes.\n\nA musician showed her a tabla, a pair of drums that could make astonishingly complicated rhythms.\n\nCamile listened carefully.\n\nThen she played a melody on her flute.\n\nA girl about Norah's age began teaching her some dance movements.\n\nCamile copied her hands.\n\nThen her feet.\n\nThen everything at once.\n\nShe got completely tangled up and nearly fell over.\n\nThe little girl giggled.\n\nCamile giggled too.\n\n\"Perhaps,\" Camile said, \"we should try that one again.\"\n\nBy the end of the evening, Camile had learned a short dance.\n\nShe had also learned that Indian classical and folk dances could tell stories through movements, rhythm, and expression.\n\n\"Imagine!\" she said. \"You can tell a whole story without saying a word!\"\n\nA few days later, she traveled on to Japan.",
        image: "/stories/camiles-great-big-wonderful-adventure/06.jpg",
        imageAlt: "Camile wobbling with a surprised face as a giggling girl teaches her a dance in front of the pink Hawa Mahal in Jaipur"
      },
      {
        heading: "Chapter 6 continued: Next Stop, Japan!",
        text: "There she changed into her pink travel jacket, starry teal leggings, and comfortable sneakers.\n\nIn Tokyo, she learned to bow politely and say \"konnichiwa\" for hello and \"arigatō\" for thank you.\n\nShe ate noodles at a tiny ramen shop, where she practiced eating with chopsticks.\n\nThe first noodle slipped away.\n\nThe second noodle slipped away.\n\nThe third noodle landed on her sleeve.\n\nCamile laughed.\n\n\"Well! I seem to be feeding my jacket!\"\n\nBut she kept practicing.\n\nSoon she was happily slurping noodles like everyone around her.\n\nLater, she attended a festival and heard the thunderous rhythms of taiko drums.\n\nDON! DON! DOKO-DON!\n\nCamile loved the energy.\n\nShe played her flute during a quieter musical gathering and learned to listen for the spaces between the notes, not just the notes themselves.\n\nBefore leaving Asia, she sat beside her hotel window and wrote.\n\nDear Emerson and Norah,\n\nAsia is so enormous that I visited two countries and still barely began exploring it!\n\nIn India, I learned a dance that tells a story. In Japan, I learned \"konnichiwa,\" heard incredible drums, and discovered that chopsticks take practice.\n\nI made new friends by trying things I didn't know how to do. I think that's a wonderful way to travel.\n\nLove, Camile",
        image: "/stories/camiles-great-big-wonderful-adventure/07.jpg",
        imageAlt: "Camile winking with a noodle on her pink jacket sleeve at a Tokyo festival, taiko drummers behind her"
      },
      {
        heading: "Chapter 7: A Dance Beneath the Southern Stars (Australia)",
        text: "The flight to Australia was Camile's longest yet.\n\nShe watched the sunrise from above the clouds.\n\nShe watched the sunset.\n\nShe slept.\n\nShe woke up and ate breakfast.\n\nThen she looked at the airplane map.\n\n\"Still over the ocean!\" she said happily.\n\nShe pulled out her notebook.\n\n\"Excellent. I have time to write down everything I want to learn.\"\n\nIn Sydney, she stepped off the airplane and put on her yellow flowered dress again.\n\n\"Hello, Australia!\"\n\nThe Sydney Opera House stood beside the harbor like enormous white sails.\n\nCamile stared at it.\n\n\"That building looks like music!\"\n\nShe spent the afternoon exploring the waterfront, where she met a family who invited her to a picnic.\n\nThey shared fresh fruit, sandwiches, and little chocolate-covered biscuits called Tim Tams.\n\nCamile tried one.\n\nThen another.\n\nThen she politely asked whether it would be possible to have one more.\n\nThat evening, she enjoyed a delicious seafood dinner at a restaurant overlooking the harbor.\n\nThe lights shimmered on the water, and the Opera House glowed in the distance.\n\nBut her favorite part of Australia came the next day.\n\nAt a cultural center, Camile attended a performance featuring Aboriginal musicians and storytellers.\n\nShe learned that Aboriginal and Torres Strait Islander peoples have many distinct cultures, languages, and traditions stretching back thousands of years.\n\nA musician explained how music and storytelling can preserve knowledge about people, places, and history.\n\nCamile listened with enormous interest.\n\nShe didn't interrupt.\n\nShe didn't assume she already understood.\n\nShe asked questions, thanked the performers, and learned the importance of respecting traditions that belong to other communities.\n\nLater, during an open community music activity, she played her flute alongside local musicians.\n\nThat evening, she danced joyfully beneath the stars.\n\nThe sky looked different here.\n\nShe could see constellations she had never seen at home.\n\n\"Even the stars have new stories to tell!\" she whispered.\n\nDear Emerson and Norah,\n\nAustralia is marvelous! I saw the Sydney Opera House, ate Tim Tams, learned about some of the world's oldest living cultures, and made music beneath a sky full of unfamiliar stars.\n\nI learned that being a good traveler means being a good listener. People have wonderful stories to share when you take the time to hear them.\n\nOne continent left!\n\nAnd it's going to be COLD!\n\nLove, Camile",
        image: "/stories/camiles-great-big-wonderful-adventure/08.jpg",
        imageAlt: "Camile with her eyes closed and hands on her cheeks after a bite of chocolate biscuit, Sydney Opera House across the harbor"
      },
      {
        heading: "Chapter 8: The Coldest Concert in the World (Antarctica)",
        text: "Camile had visited six continents.\n\nNow she needed one more.\n\nAntarctica.\n\nShe traveled to the southern tip of South America, where she joined a carefully organized expedition sailing toward the icy continent.\n\nThe journey across the ocean was rough.\n\nThe ship rocked.\n\nThe waves splashed.\n\nCamile looked out the window.\n\n\"Well,\" she said, \"the ocean certainly knows how to dance!\"\n\nAt last, enormous white mountains appeared in the distance.\n\nIcebergs floated across the sea like giant frozen castles.\n\nPenguins waddled along the shore.\n\nSeals rested on the ice.\n\nAnd everything seemed to sparkle.\n\nCamile had never seen anything so beautiful.\n\nShe put on her warmest clothes, a puffy coat over her pink travel outfit, a scarf, mittens, and enormous snow boots.\n\nShe looked down at her feet.\n\n\"I appear to be wearing two small boats.\"\n\nAn expedition guide explained that Antarctica had no permanent towns like the other continents.\n\nInstead, scientists and support teams lived at research stations, studying the ice, oceans, weather, and wildlife.\n\n\"Then who will I dance with?\" Camile asked.\n\nThe guide smiled.\n\n\"Scientists love dancing too.\"\n\nAt the research station, Camile met people from several different countries.\n\nThey spoke different languages.\n\nSome knew English. Some spoke Spanish, French, Mandarin, or other languages.\n\nCamile tried greetings she'd learned along her journey.\n\n\"Hola!\"\n\n\"Bonjour!\"\n\n\"Konnichiwa!\"\n\nEveryone smiled.\n\nThat evening, the scientists invited her to share dinner.\n\nIt wasn't a grand restaurant.\n\nThere were no chandeliers.\n\nNo white tablecloths.\n\nNo fancy waiters.\n\nJust a warm room, a big pot of hearty soup, fresh bread, and a group of people far from home.\n\nCamile thought it was one of the finest dinners she'd ever eaten.\n\nAfterward, she took out her silver flute.\n\n\"Would anyone like a concert?\"\n\nA scientist found a guitar.\n\nAnother tapped a rhythm on the table.\n\nSoon the entire room was singing and laughing.\n\nCamile played a melody that borrowed little pieces of everything she had learned.\n\nA jazz rhythm from New York.\n\nA mountain melody from Peru.\n\nA gentle waltz from Paris.\n\nA lively beat inspired by Morocco.\n\nA dancing phrase she remembered from India.\n\nA peaceful musical pause from Japan.\n\nA cheerful tune from Australia.\n\nAnd then something entirely new.\n\nSomething that belonged to this moment.\n\nWhen she finished, the room was silent.\n\nThen everyone applauded.\n\nOutside, the icy world was still and quiet.\n\nCamile stood by the window, holding her flute.\n\n\"Seven continents,\" she whispered.\n\nShe had done it.\n\nShe wrote her longest letter yet.\n\nDear Emerson and Norah,\n\nI MADE IT TO ANTARCTICA!\n\nThere are penguins and mountains made of ice and the most beautiful silence I've ever heard.\n\nI had dinner with scientists from around the world. We shared soup, bread, stories, and music. It was just as wonderful as any fancy restaurant.\n\nThere aren't many restaurants in Antarctica, but I think I've learned something important.\n\nA table becomes special because of the people sitting around it.\n\nI've visited all seven continents now. But do you know something funny?\n\nThe place I'm most excited to visit next is home.\n\nLove, Camile",
        image: "/stories/camiles-great-big-wonderful-adventure/09.jpg",
        imageAlt: "Camile in a puffy pink coat looking down at her enormous snow boots while a penguin pecks one, beside an Antarctic research station"
      },
      {
        heading: "Chapter 9: The Best Place in the Whole Wide World",
        text: "Camile flew north.\n\nThen north again.\n\nThen a little farther north.\n\nShe slept on airplanes, read books in airports, and watched clouds drift past her windows.\n\nShe didn't mind the long journey.\n\nLong airplane rides had become one of her favorite places to think.\n\nFinally, her plane landed in Virginia.\n\nCamile stepped off wearing her cozy pink jacket and carrying her little suitcase.\n\nIt looked exactly the same as when she'd left.\n\nPerhaps a bit more scratched.\n\nPerhaps a little dusty.\n\nBut still small.\n\nInside, Camile had tucked away a few treasured memories: a tiny postcard, a ribbon, some photographs, her notebook, and her silver flute.\n\nShe hadn't needed to buy much.\n\nShe had brought home something better.\n\nStories.\n\nAt the end of the driveway, Emerson and Norah were waiting.\n\n\"CAMILE!\"\n\nThey ran toward her.\n\nCamile dropped her suitcase and opened her arms.\n\nThe three friends hugged and laughed and nearly fell into a flower bed.\n\n\"Did you really visit every continent?\" Norah asked.\n\n\"Every single one!\"\n\n\"Did you eat strange things?\" Emerson asked.\n\n\"I ate wonderful things!\"\n\n\"Did you learn all the languages?\"\n\nCamile giggled.\n\n\"Not all of them. Not even close! But I learned how to say hello and thank you in quite a few.\"\n\n\"Did you get scared?\"\n\n\"Sometimes.\"\n\n\"Did you get lonely?\"\n\n\"Sometimes.\"\n\n\"Would you do it all again?\"\n\nCamile thought for a moment.\n\nShe remembered the lights of New York.\n\nThe mountains of Peru.\n\nThe sparkling Eiffel Tower.\n\nThe lanterns of Morocco.\n\nThe dancing in India.\n\nThe drums of Japan.\n\nThe stars over Australia.\n\nAnd the brilliant white ice of Antarctica.\n\nThen she looked at Emerson and Norah.\n\n\"Absolutely,\" she said.\n\n\"But first, I would like a snack.\"\n\nEveryone laughed.\n\nThat evening, they spread a big blanket across the living room floor.\n\nCamile showed them pictures.\n\nShe told stories.\n\nShe taught them a few new words.\n\n\"Bonjour!\"\n\n\"Hola!\"\n\n\"Marhaba!\"\n\n\"Namaste!\"\n\n\"Konnichiwa!\"\n\nThen she took out her silver flute.\n\n\"Would you like to hear my favorite song from the trip?\"\n\n\"Which country is it from?\" Norah asked.\n\nCamile smiled.\n\n\"All of them.\"\n\nShe began to play.\n\nIt started softly, like the wind passing over the mountains.\n\nThen it bounced like New York jazz.\n\nThen it danced like a Parisian waltz.\n\nIt twisted and twirled with rhythms she'd learned from friends around the world.\n\nSoon Emerson was tapping her feet.\n\nNorah was spinning around the room.\n\nAnd Camile was dancing too, her blonde hair flying, her pink jacket swishing, and her heart feeling so full it might burst.\n\nFinally, the music ended.\n\nFor a moment, nobody spoke.\n\nThen Norah asked a question.\n\n\"Camile, what's the most wonderful place in the whole world?\"\n\nCamile thought about it.\n\nShe thought about the food.\n\nThe music.\n\nThe people.\n\nThe astonishing things she'd seen.\n\nAnd finally she answered.\n\n\"The most wonderful place in the world?\"\n\nShe smiled.\n\n\"It's wherever you are when you're sharing something wonderful with someone else.\"\n\nShe looked at her two friends.\n\n\"And right now, that's here.\"",
        image: "/stories/camiles-great-big-wonderful-adventure/10.jpg",
        imageAlt: "Camile hugging her two best friends on a blanket covered in travel photos in a cozy living room"
      }
    ],
    narration: [
      {
        src: "/podcast/stories/camiles-great-big-wonderful-adventure/chapter-01-v3.mp3",
        pages: [
          0
        ]
      },
      {
        src: "/podcast/stories/camiles-great-big-wonderful-adventure/chapter-02-v3.mp3",
        pages: [
          1
        ]
      },
      {
        src: "/podcast/stories/camiles-great-big-wonderful-adventure/chapter-03-v3.mp3",
        pages: [
          2
        ]
      },
      {
        src: "/podcast/stories/camiles-great-big-wonderful-adventure/chapter-04-v3.mp3",
        pages: [
          3
        ]
      },
      {
        src: "/podcast/stories/camiles-great-big-wonderful-adventure/chapter-05-v3.mp3",
        pages: [
          4
        ]
      },
      {
        src: "/podcast/stories/camiles-great-big-wonderful-adventure/chapter-06-v3.mp3",
        pages: [
          5,
          6
        ]
      },
      {
        src: "/podcast/stories/camiles-great-big-wonderful-adventure/chapter-07-v3.mp3",
        pages: [
          7
        ]
      },
      {
        src: "/podcast/stories/camiles-great-big-wonderful-adventure/chapter-08-v3.mp3",
        pages: [
          8
        ]
      },
      {
        src: "/podcast/stories/camiles-great-big-wonderful-adventure/chapter-09-v3.mp3",
        pages: [
          9,
          "end"
        ]
      }
    ],
    logTitle: "Camile's Travel Log",
    log: [
      {
        place: "Virginia",
        hello: "Goodbye for now!"
      },
      {
        place: "New York City",
        hello: "Good morning!"
      },
      {
        place: "Cusco and Machu Picchu, Peru",
        hello: "¡Hola!"
      },
      {
        place: "Paris, France",
        hello: "Bonjour!"
      },
      {
        place: "Marrakech, Morocco",
        hello: "Marhaba!"
      },
      {
        place: "Jaipur, India",
        hello: "Namaste!"
      },
      {
        place: "Tokyo, Japan",
        hello: "Konnichiwa!"
      },
      {
        place: "Sydney, Australia",
        hello: "Hello, Australia!"
      },
      {
        place: "Antarctica",
        hello: "Hola! Bonjour! Konnichiwa!"
      },
      {
        place: "Home in Virginia",
        hello: "I'm home!"
      }
    ],
    ending: {
      heading: "Love Always, Camile",
      text: "Later, when Emerson and Norah were getting ready for bed, Camile opened her notebook one last time.\n\nShe turned to a fresh page.\n\nAt the top, she wrote:\n\nDear Emerson and Norah,\n\nThe world is bigger than we can imagine, filled with more languages than we can count, more songs than we could ever sing, and more delicious meals than we could ever eat.\n\nAnd every place has something beautiful to teach us.\n\nTravel light. Listen carefully. Be kind. Try the food. Learn the words. Dance when the music starts.\n\nAnd whenever you can, make a new friend.\n\nThe world is much too wonderful to be afraid of exploring it.\n\nLove always,\n\nCamile\n\nShe closed her notebook.\n\nPut her flute beside her pillow.\n\nAnd climbed into bed.\n\nTomorrow, perhaps, she would start planning her next adventure.\n\nBut tonight?\n\nTonight, Camile dreamed of a great big world.\n\nAnd all the wonderful friends she hadn't met yet.",
      headingSilent: true
    }
  },
]
