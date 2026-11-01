// Every song on the /songs page. Norah made them with Suno.
// The MP3s live in S3 at s3://norahtashner.com/podcast/songs/<id>.mp3 (audio is not stored in git;
// see PUBLISHING.md), so a new song needs an upload plus an entry here.
export const SONGS = [
  {
    "id": "the-day-i-met-penny",
    "title": "The Day I Met Penny",
    "description": "The story of adopting Penny, the littlest, loudest pup.",
    "tag": "Story song",
    "src": "/podcast/songs/the-day-i-met-penny.mp3",
    "durationSeconds": 231,
    "lyrics": [
      {
        "label": "Intro – Spoken",
        "lines": [
          "Hey, everybody!",
          "I got a story to tell.",
          "It’s about a little dog…",
          "And her name is PENNY!",
          "This is how it all started."
        ]
      },
      {
        "label": "Verse 1 – The Day We Met",
        "lines": [
          "This is the one and only song of me and Penny,",
          "I got lots of stories, probably twenty!",
          "She was just a little pup with a funny little face,",
          "Running all around like she owned the place.",
          "The first time I saw her, I knew she was the one,",
          "A little furry puppy who just wanted to have fun.",
          "I wanted to adopt her, I wanted her to stay,",
          "And when we brought her home, it was the best day!"
        ]
      },
      {
        "label": "Chorus",
        "lines": [
          "Me and Penny, me and Penny, me and Penny!",
          "We have so much fun, yeah, we have so many!",
          "Penny was so little when we got her,",
          "I was so excited, I wanted to adopt her!",
          "We adopted her last month,",
          "And we’ve been having fun a whole bunch!",
          "Me and Penny, me and Penny, me and Penny!",
          "She’s my little puppy and I love her plenty!"
        ]
      },
      {
        "label": "Verse 2 – Our Bigger House",
        "lines": [
          "We moved to a bigger house where they could run and play,",
          "Obi and Penny chasing squirrels all day!",
          "Penny is in the house!",
          "Obi is in the house!",
          "Two little dogs running all around the house!",
          "Penny’s got her toys and Obi’s got his bed,",
          "Sometimes Penny steals his toys instead!",
          "Obi looks at Penny like, “Hey, that’s mine!”",
          "Penny runs away like, “Nope, it’s fine!”",
          "But this is Penny’s song, so don’t get it wrong,",
          "Me and Obi get our own song later on!"
        ]
      },
      {
        "label": "Chorus",
        "lines": [
          "Me and Penny, me and Penny, me and Penny!",
          "We have so much fun, yeah, we have so many!",
          "Penny was so little when we got her,",
          "I was so excited, I wanted to adopt her!",
          "We adopted her last month,",
          "And we’ve been having fun a whole bunch!",
          "Me and Penny, me and Penny, me and Penny!",
          "She’s my little puppy and I love her plenty!"
        ]
      },
      {
        "label": "Verse 3 – Best Friends",
        "lines": [
          "Me and Penny love to be together,",
          "We like to play in any kind of weather!",
          "Sit next together, side by side,",
          "She’s my little buddy and my partner in crime!",
          "We chew on problems till we figure out they’re right,",
          "Sometimes it takes all day, sometimes it takes all night!",
          "She follows me around when I’m walking through the door,",
          "Then she rolls around and wiggles on the floor.",
          "Penny Wenny Pumpkin Pie,",
          "Little pointy ears sticking up so high!",
          "She might be little, but she’s got a big heart,",
          "And she’s been my best friend right from the start!"
        ]
      },
      {
        "label": "Bridge – Softer, Slower Beat",
        "lines": [
          "We leave the bowl by the back door,",
          "Trade the quiet for a quick lap around the yard.",
          "Penny nosing through the grass by the fence,",
          "Me laughing when she brings me a stick with mud on it.",
          "No big plan, just this small life,",
          "A warm house and a name she turns to.",
          "I call out, “Penny!” and she comes running fast,",
          "I wish these little moments could forever last.",
          "We sit together when the day is through,",
          "And I tell her all the things that I want to do.",
          "She doesn’t say a word, but that’s okay,",
          "I think she understands me anyway."
        ]
      },
      {
        "label": "Final Chorus – Big, Happy Finish",
        "lines": [
          "Me and Penny, me and Penny, me and Penny!",
          "She’s my little puppy and I love her plenty!",
          "Running in the backyard, playing in the sun,",
          "Me and Penny always having fun!",
          "Penny is in the house!",
          "Obi is in the house!",
          "Everybody’s running all around the house!",
          "Me and Penny, me and Penny, me and Penny!",
          "Wouldn’t trade my puppy for a million pennies!"
        ]
      },
      {
        "label": "Outro – Spoken Over Music",
        "lines": [
          "And that’s the story…",
          "Of the day I met Penny.",
          "My little Penny Wenny Pumpkin Pie.",
          "Oh, and Obi?",
          "Don’t worry.",
          "It’ll be me and Obi next song over!",
          "PENNY!",
          "PENNY!"
        ]
      }
    ]
  },
  {
    "id": "obi-bear",
    "title": "Obi Bear (The Fluffy Bear Song)",
    "description": "Obi Bear is the fluffiest dog in the world. Chase, chase, chase! Squirrel, squirrel!",
    "tag": "Dance",
    "src": "/podcast/songs/obi-bear.mp3",
    "durationSeconds": 134,
    "lyrics": [
      {
        "label": "Intro – Spoken",
        "lines": [
          "This is it, I’m gonna play it!",
          "Drum roll please, Daddy, hit it!",
          "Yeah! Yeah!",
          "Obi Bear in the house!",
          "Let’s go!"
        ]
      },
      {
        "label": "Verse 1",
        "lines": [
          "Yeah, it is the fluffy bear song,",
          "Obi Bear’s been fluffy all along!",
          "Fluffy, fluffy bear,",
          "Yeah, a little, little bear,",
          "Fluffy, fluffy, fluffy bear,",
          "With his fluffy little hair!",
          "He’s got four paws and a fluffy little tail,",
          "Running through the yard like a puppy on a trail!",
          "He likes to run around and chase those backyard dogs,",
          "Woof, woof, woof!",
          "Woof, woof, woof!",
          "Woof, woof, woof, woof, woof!"
        ]
      },
      {
        "label": "Chorus",
        "lines": [
          "Ooh, oh, oh!",
          "Obi Bear, let’s go!",
          "Woof, woof, woof, woof, woof, woof!",
          "Running really fast, everybody move!",
          "Chase, chase, chase!",
          "Squirrel, squirrel!",
          "Running round the yard in a fluffy little whirl!",
          "Chase, chase, chase!",
          "Squirrel, squirrel!",
          "Obi Bear’s the fluffiest dog in the world!"
        ]
      },
      {
        "label": "Verse 2",
        "lines": [
          "Yeah, a little, little bear,",
          "Fluffy, fluffy everywhere!",
          "Running through the grass,",
          "Running super fast,",
          "Chasing all the squirrels",
          "But he never catches that!",
          "He’s a fluffy little dog,",
          "But we call him Obi Bear,",
          "He’s got a fluffy little face",
          "And some crazy fluffy hair!",
          "He sees a backyard dog,",
          "And he starts to run,",
          "Woof, woof, woof!",
          "He’s just having fun!"
        ]
      },
      {
        "label": "Chorus",
        "lines": [
          "Ooh, oh, oh!",
          "Obi Bear, let’s go!",
          "Woof, woof, woof, woof, woof, woof!",
          "Running really fast, everybody move!",
          "Chase, chase, chase!",
          "Squirrel, squirrel!",
          "Running round the yard in a fluffy little whirl!",
          "Chase, chase, chase!",
          "Squirrel, squirrel!",
          "Obi Bear’s the fluffiest dog in the world!"
        ]
      },
      {
        "label": "Bridge – Beat Drops",
        "lines": [
          "Fluffy, fluffy, fluffy bear!",
          "Put your paws up in the air!",
          "Little, little, little bear!",
          "Obi Bear is everywhere!",
          "Woof! Woof!",
          "Who’s that dog?",
          "OBI BEAR!",
          "Woof! Woof!",
          "Who’s got fluff?",
          "OBI BEAR!"
        ]
      },
      {
        "label": "Outro",
        "lines": [
          "Obi is a fluffy, fluffy, fluffy little dog,",
          "He likes to run around and chase those backyard dogs!",
          "Woof, woof, woof!",
          "Woof, woof, woof!",
          "Chase, chase, chase!",
          "Squirrel, squirrel!",
          "Obi Bear!",
          "Yeah!",
          "That’s my dog!"
        ]
      }
    ]
  },
  {
    "id": "pet-frenzy",
    "title": "Pet Frenzy",
    "description": "Dogs, fish, a hummingbird, a toad and a worm in a shoe. Everybody go crazy!",
    "tag": "Party",
    "src": "/podcast/songs/pet-frenzy.mp3",
    "durationSeconds": 261,
    "lyrics": [
      {
        "label": "Intro – Spoken",
        "lines": [
          "Okay, everybody!",
          "We have a situation!",
          "There’s fur on the couch,",
          "There’s fish in the tank,",
          "There’s something in the garden…",
          "And I think it just JUMPED!",
          "DJ, HIT IT!"
        ]
      },
      {
        "label": "Verse 1 – The Dogs",
        "lines": [
          "Obi Bear’s sleeping with his paws in the air,",
          "Looking like a giant fuzzy teddy bear!",
          "But somebody walks their dog down the street,",
          "Now he’s jumping up on all four feet!",
          "BARK BARK BARK!",
          "Who’s that outside?!",
          "Obi Bear’s ready for a wild dog ride!",
          "Penny comes running, her ears standing tall,",
          "She’s the littlest dog but she’s louder than them all!",
          "Penny Wenny Pumpkin Pie,",
          "Running so fast that her ears might fly!",
          "Obi goes WOOF and Penny goes YAP,",
          "Then they both get tired and take a little nap!"
        ]
      },
      {
        "label": "Pre-Chorus",
        "lines": [
          "Something’s hopping!",
          "Something’s flying!",
          "Something’s swimming!",
          "Someone’s crying!",
          "Wait, who’s crying?",
          "Oh, it’s just Penny."
        ]
      },
      {
        "label": "Chorus – The Pet Frenzy",
        "lines": [
          "PET FRENZY! PET FRENZY!",
          "Everybody’s going crazy!",
          "Big dog, small dog, fishies too,",
          "Everybody’s got a crazy thing to do!",
          "PET FRENZY! PET FRENZY!",
          "Nobody’s being lazy!",
          "Wiggle to the left,",
          "Wiggle to the right,",
          "It’s a pet party morning, noon, and night!",
          "HEY! HEY!",
          "PET FRENZY!",
          "HEY! HEY!",
          "PET FRENZY!"
        ]
      },
      {
        "label": "Verse 2 – The Fish Tank",
        "lines": [
          "Four little fish in a glass hotel,",
          "What are they thinking? Nobody can tell!",
          "One swims up,",
          "One swims down,",
          "One keeps spinning round and round!",
          "Bubble bubble, blub blub blub,",
          "Fishy number three thinks he’s in a club!",
          "Fishy number four is hiding in a cave,",
          "Come on, little fishy, give us a wave!",
          "They don’t have feet,",
          "They don’t have shoes,",
          "They don’t even know how to tie their shoes!",
          "Wait…",
          "They don’t NEED shoes!"
        ]
      },
      {
        "label": "Chorus – The Pet Frenzy",
        "lines": [
          "PET FRENZY! PET FRENZY!",
          "Everybody’s going crazy!",
          "Big dog, small dog, fishies too,",
          "Everybody’s got a crazy thing to do!",
          "PET FRENZY! PET FRENZY!",
          "Nobody’s being lazy!",
          "Wiggle to the left,",
          "Wiggle to the right,",
          "It’s a pet party morning, noon, and night!"
        ]
      },
      {
        "label": "Verse 3 – The Backyard Gang",
        "lines": [
          "Out in the garden, what’s that green thing?",
          "Praying mantis looking like a tiny green king!",
          "Hands together like he’s saying a prayer,",
          "But he’s really just waiting for a bug over there!",
          "Hummingbird zooming like a mini jet plane,",
          "Flying so fast that he’s hurting my brain!",
          "ZIP ZIP ZIP!",
          "There he goes!",
          "Sticking his beak in a flower’s nose!",
          "Toad by the flowers, sitting on a rock,",
          "Hops three times then he just goes STOP!",
          "Worm in the dirt doing wiggle-wiggle moves,",
          "No arms, no legs, but he’s got the GROOVES!"
        ]
      },
      {
        "label": "Bridge – Backyard Emergency",
        "lines": [
          "Everybody quiet!",
          "I hear something…",
          "Is it a monster?",
          "NO!",
          "Is it a dinosaur?",
          "NO!",
          "Is it a giant chicken?",
          "NOOO!",
          "It’s…",
          "A DOG WALKING DOWN THE STREET!",
          "Hey, you two!",
          "It’s just a DOG!",
          "…",
          "THEY DON’T CARE!"
        ]
      },
      {
        "label": "Final Verse – Total Chaos",
        "lines": [
          "Obi Bear’s running in a big old loop,",
          "Penny’s right behind him like a tiny little troop!",
          "Fish are doing circles, hummingbirds go ZOOM,",
          "Praying mantis dancing like he owns the living room!",
          "Toad goes HOP and the worm goes WIGGLE,",
          "Penny makes a noise and everybody giggles!",
          "Big fluffy Obi and little Penny Pie,",
          "Four fish swimming while the birds fly by!",
          "Everybody’s moving, everybody’s loud,",
          "We got the craziest pet crew in town!"
        ]
      },
      {
        "label": "Final Chorus – Big Finish",
        "lines": [
          "PET FRENZY! PET FRENZY!",
          "Everybody’s going crazy!",
          "Bark bark!",
          "Blub blub!",
          "Hop hop!",
          "Buzz buzz!",
          "PET FRENZY! PET FRENZY!",
          "Our house is super crazy!",
          "Obi Bear!",
          "Penny Pie!",
          "Four little fishies swimming by!",
          "Mantis! Toad!",
          "Worms below!",
          "Hummingbirds putting on a show!",
          "PET FRENZY! PET FRENZY!",
          "EVERYBODY GO CRAZY!"
        ]
      },
      {
        "label": "Outro – Spoken",
        "lines": [
          "Okay.",
          "Obi’s asleep.",
          "Penny’s asleep.",
          "The fish are still swimming.",
          "The toad went home.",
          "I think the frenzy is over.",
          "…",
          "Wait.",
          "WHY IS THERE A WORM IN MY SHOE?!"
        ]
      },
      {
        "label": "Beat Drops",
        "lines": [
          "PET FRENZYYYY!"
        ]
      }
    ]
  },
  {
    "id": "fishy-fishes",
    "title": "Fishy Fishes",
    "description": "The fishes are in the house. Do the scuba!",
    "tag": "Dance",
    "src": "/podcast/songs/fishy-fishes.mp3",
    "durationSeconds": 82,
    "lyrics": [
      {
        "label": "Verse 1",
        "lines": [
          "Fishes are in the house",
          "Oh, fishes in the house",
          "Raise our roof, raise our roof",
          "Do the scuba",
          "Fishy, fishy fishes",
          "Fishy, fishy fishes",
          "Fishy, fishy, swimming all around, zig-zag",
          "Fishy, fishy, swimming in their tank"
        ]
      },
      {
        "label": "Chorus",
        "lines": [
          "Fishes in the house",
          "Yeah",
          "Swimming in their tank, tank, tank",
          "Do the scuba"
        ]
      },
      {
        "label": "Verse 2",
        "lines": [
          "Fishes in the house"
        ]
      }
    ]
  },
  {
    "id": "fishes-in-the-house-remix",
    "title": "Fishes in the House Remix",
    "description": "Fishy Fishes, remixed. The fishes are back in the house. Raise the roof!",
    "tag": "Remix",
    "src": "/podcast/songs/fishes-in-the-house-remix.mp3",
    "durationSeconds": 56,
    "lyrics": [
      {
        "label": "Verse 1",
        "lines": [
          "Fishes are in the house",
          "Oh, fishes in the house",
          "Raise our roof, raise our roof",
          "Do the scuba",
          "Fishy, fishy fishes",
          "Fishy, fishy fishes",
          "Fishy, fishy, swimming all around, zig-zag",
          "Fishy, fishy, swimming in their tank"
        ]
      },
      {
        "label": "Chorus",
        "lines": [
          "Fishes in the house",
          "Yeah",
          "Swimming in their tank, tank, tank",
          "Do the scuba"
        ]
      },
      {
        "label": "Verse 2",
        "lines": [
          "Fishes in the house"
        ]
      }
    ]
  },
  {
    "id": "penny-wenny-wiener-pie",
    "title": "Penny Wenny Wiener Pie",
    "description": "A tiny song for a tiny wiener dog. Penny woo, woo, woo!",
    "tag": "Short & silly",
    "src": "/podcast/songs/penny-wenny-wiener-pie.mp3",
    "durationSeconds": 25,
    "lyrics": [
      {
        "label": "Verse 1",
        "lines": [
          "Little papa chinny",
          "Penny wenny",
          "That little papa chinny"
        ]
      },
      {
        "label": "Chorus",
        "lines": [
          "She is a little weener",
          "Pop, pop, chinny",
          "Penny woo, woo, woo",
          "Penny woo, woo, woo",
          "A penny wenny wenny wenny wenny wenny woo",
          "Penny wenny wenny wenny wenny wenny woo",
          "A penny pie",
          "Penny wenny wenny wenny pop, pie",
          "Penny wenny wenny wenny wenny woo",
          "Woo!"
        ]
      }
    ]
  },
  {
    "id": "me-and-emerson",
    "title": "Me and Emerson",
    "description": "A song about Emerson, who likes to play a bunch (and likes home better). Bring the maracas!",
    "tag": "Friendship",
    "src": "/podcast/songs/me-and-emerson.mp3",
    "durationSeconds": 57,
    "lyrics": [
      {
        "label": "Verse 1",
        "lines": [
          "This is me and Emerson",
          "This is me and Emerson",
          "Emerson is coming, sister",
          "She likes to play a bunch",
          "She's been to Mexico",
          "There's gonna be maracas in this show",
          "Me and Camille and Emerson"
        ]
      },
      {
        "label": "Chorus",
        "lines": [
          "Me and Emerson, me and Emerson",
          "Emerson mostly stays home",
          "She doesn't really care, 'cause she likes home better",
          "Yes, I do"
        ]
      }
    ]
  },
  {
    "id": "me-and-camile",
    "title": "Me and Camile",
    "description": "A song for Camile, Norah's best doll ever, who takes on the world with airplanes. Fasten your seatbelts!",
    "tag": "Friendship",
    "src": "/podcast/songs/me-and-camile.mp3",
    "durationSeconds": 69,
    "lyrics": [
      {
        "label": "Verse 1",
        "lines": [
          "Me and Camile",
          "Have fun together",
          "We like to play",
          "We like to play",
          "Me and Camile",
          "Me, me and Camile",
          "We like to play, play, play",
          "Our sister Emerson comes along with her day",
          "Me and her sister and Camile",
          "Our best friends, we're gonna be best friends forever",
          "Got Camile for Easter, she's my best doll ever",
          "She takes on the world with airplanes and all her fun stuff"
        ]
      }
    ]
  },
  {
    "id": "me-and-camile-v2",
    "title": "Me and Camile (v2)",
    "description": "Take two of Norah's song for Camile, her best doll ever. Same airplanes, same fun, a little shorter!",
    "tag": "Friendship",
    "src": "/podcast/songs/me-and-camile-v2.mp3",
    "durationSeconds": 53,
    "lyrics": [
      {
        "label": "Verse 1",
        "lines": [
          "Me and Camile",
          "Have fun together",
          "We like to play",
          "We like to play",
          "Me and Camile",
          "Me, me and Camile",
          "We like to play, play, play",
          "Our sister Emerson comes along with her day",
          "Me and her sister and Camile",
          "Our best friends, we're gonna be best friends forever",
          "Got Camile for Easter, she's my best doll ever",
          "She takes on the world with airplanes and all her fun stuff"
        ]
      }
    ]
  }
]
