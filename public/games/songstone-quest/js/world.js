// World data: overworld screens (16x12 ASCII tiles) and dungeon rooms.
// Legend: . grass/floor  , flowers  % tall grass  : path  s sand  T tree  A pine  b bush  R rock  r cracked boulder
// # cliff/wall  U cave mouth  ~ water  = bridge  Q bridge that appears  F fence  M roof  H house wall  D door
// S sign  p pot  Z statue  L torch  P counter  G tower gate  O pit  X stairs out  + locked door  B big door
// u shutter  c cracked wall  k push block  o pressure plate  w crystal switch  E eye switch  i ice
export const COLS = 16, ROWS = 12

const has = (s, k) => !!s.flags[k]
const stones = (s) => s.stones.filter(Boolean).length

// ------------------------------------------------------------------ overworld
const OW = {
  // Norah's house
  '0,2': { theme: 'meadow', music: 'village', name: "Norah's House", grid: [
    'TTTTTTTbbTTTTTTT',
    'T..MMMM........T',
    'T..HHDH..,.....T',
    'T....:.........T',
    'T,...:::::.....T',
    'T........:..%%.:',
    'T..S.....::::::.',
    'T,......,......T',
    'T...%%.....b...T',
    'T..........b..,T',
    'T.,....T.......T',
    'TTTTTTTTTTTTTTTT'],
  signs: { '3,6': ['NORAH\'S HOUSE', 'North: Whispering Woods.  East: Melody Meadow.'] },
  doors: { '5,2': ['Home sweet home! But the Songstones are not here.'] },
  ents: [
    { t: 'npc', k: 'grandpa', x: 7, y: 3, talk: 'grandpa' },
    { t: 'npc', k: 'potato', x: 3, y: 4, talk: 'potato' },
    { t: 'enemy', k: 'blob', x: 12, y: 9 },
  ] },
  // Melody Meadow west
  '1,2': { theme: 'meadow', music: 'village', name: 'Melody Meadow', grid: [
    'TTTTTTT..TTTTTTT',
    'T.MMM..:...MMM.T',
    'T.HDH..:...HDH.T',
    'T..:...:....:..T',
    'T..:::::::::::.T',
    '......:.Z..:....',
    '......:.....:...',
    'T.,...:::::::..T',
    'T..MMMM..:.....T',
    'T..HHDH..:..%%.T',
    'T,.......:....,T',
    'TTTTTTTTTTTTTTTT'],
  signs: {},
  doors: { '3,2': ['The door is locked. Someone inside is humming... very quietly.'], '12,2': ['A note on the door says: GONE LOOKING FOR MY SONG.'], '5,9': ['It is locked. You hear snoring.'] },
  statue: ['A statue of the first Songkeeper. Its stone ears look sad.'],
  ents: [
    { t: 'npc', k: 'lady', x: 5, y: 3, talk: 'lady' },
    { t: 'npc', k: 'kid', x: 10, y: 6, talk: 'kid' },
    { t: 'npc', k: 'elder', x: 13, y: 3, talk: 'elder' },
  ] },
  // Melody Meadow east (shop)
  '2,2': { theme: 'meadow', music: 'village', name: 'Melody Meadow Market', grid: [
    'TTTTTTT..TTT##TT',
    'T..MMMMM..,MMM.T',
    'T..H...H...HDH.T',
    'T..PPPPP.......T',
    'T.......:......T',
    '........::::::::',
    '..........,.....',
    'T.MMM......FFF.T',
    'T.HDH...%%.F.F.T',
    'T.......,..FFF.T',
    'T.,...S.......,T',
    'TTTTTTTTTTTTTTTT'],
  signs: { '6,10': ['MARKET', 'Walk up to the counter and press A to buy.'] },
  doors: { '12,2': ['Locked. A sign says: BACK SOON.'], '3,8': ['Nobody is home.'] },
  ents: [
    { t: 'npc', k: 'shop', x: 5, y: 2, talk: 'shop' },
    { t: 'shop', item: 'heart', price: 10, x: 4, y: 3 },
    { t: 'shop', item: 'bombs', price: 20, x: 5, y: 3, need: 'bombs' },
    { t: 'shop', item: 'arrows', price: 20, x: 6, y: 3, need: 'bow' },
    { t: 'shop', item: 'heartpiece', price: 100, x: 7, y: 3, once: 'shop-hp' },
    { t: 'npc', k: 'farmer', x: 13, y: 5, talk: 'farmer' },
    { t: 'hp', x: 12, y: 8, id: 'hp-pen' },
  ] },
  // Glimmer Lake south
  '3,2': { theme: 'meadow', music: 'overworld', name: 'Glimmer Lake Shore', grid: [
    'TTTTTTTTTTTTTTTT',
    'T.....s~~~~~~~~T',
    'T....ss~~~~~~~~T',
    'T...ss~~~~ss~~~T',
    'T..ss~~~~~ss~~~T',
    '...s~~~~~~~~~~~T',
    '...ss~~~~~~~~~~T',
    'T...sss~~~~~~~~T',
    'T.,...ss~~~~~~~T',
    'T.S.%..sss~~~~~T',
    'T.b.....ssss~~~T',
    'TTTTTTTTTTTTTTTT'],
  signs: { '2,9': ['Something sparkles on the little island...', 'If only you had something that flies out AND comes back!'] },
  ents: [
    { t: 'hp', x: 10, y: 3, id: 'hp-island' },
    { t: 'enemy', k: 'blob', x: 2, y: 3 },
    { t: 'enemy', k: 'blob', x: 5, y: 9 },
  ] },
  // Whispering Woods west (Leafy Hollow)
  '0,1': { theme: 'woods', music: 'overworld', name: 'Whispering Woods', grid: [
    'TTTTTT####TTTTTT',
    'T...T.##UU##...T',
    'T...T.........%T',
    'T.TTT..,..,..TTT',
    'T......TT.....bT',
    'T.TT%%..........',
    'T..T.....,......',
    'T..TTT.TT..TT..T',
    'T.......T....%.T',
    'T,%%..b.......,T',
    'T....TT..TT....T',
    'TTTTTTT..TTTTTTT'],
  warps: { '8,1': { area: 'leafy' }, '9,1': { area: 'leafy' } },
  ents: [
    { t: 'hp', x: 1, y: 1, id: 'hp-woods' },
    { t: 'enemy', k: 'blob', x: 5, y: 8 },
    { t: 'enemy', k: 'blob', x: 11, y: 5 },
    { t: 'enemy', k: 'buzzbee', x: 12, y: 2 },
  ] },
  // Whispering Woods east
  '1,1': { theme: 'woods', music: 'overworld', name: 'Whispering Woods', grid: [
    'TTTTTTTrrTTTTTTT',
    'T.....T..T.....T',
    'T.%%...S.....b.T',
    'T..TT.......TT.T',
    'T..T...,,......T',
    '...............:',
    '..........::::::',
    'T.TT..T.....T..T',
    'T.....TT.%%....T',
    'T.b........TT..T',
    'T..TT.........,T',
    'TTTTTTT..TTTTTTT'],
  signs: { '7,2': ['NORTH: FROSTY PEAK', 'Those rocks have cracks in them... Something with a big BOOM might clear the way.'] },
  ents: [
    { t: 'enemy', k: 'blob', x: 4, y: 6 },
    { t: 'enemy', k: 'thornback', x: 11, y: 9 },
    { t: 'enemy', k: 'buzzbee', x: 13, y: 3 },
  ] },
  // Glimmer Lake
  '2,1': { theme: 'meadow', music: 'overworld', name: 'Glimmer Lake', grid: [
    'TTTTTTT..TTT~~TT',
    'T......:....~~.T',
    'T..~~~.:....~~wT',
    'T.~~~~~:....~~.T',
    'T.~~~~~:,...~~.T',
    '..~~~~.::::.QQ..',
    '.......::::.QQ..',
    'T,..,..:....~~.T',
    'T......:..%%~~.T',
    'T.%%...:....~~.T',
    'T..S...:....~~.T',
    'TTTTTTT..TTT~~TT'],
  signs: { '3,10': ['GLIMMER LAKE', 'The bridge east is up. A crystal switch on the far bank lowers it.'] },
  switchFlag: 'bridge',
  ents: [
    { t: 'npc', k: 'nug', x: 6, y: 5, talk: 'nug' },
    { t: 'enemy', k: 'buzzbee', x: 4, y: 8 },
    { t: 'enemy', k: 'buzzbee', x: 10, y: 2 },
  ] },
  // Rumble Hills south
  '3,1': { theme: 'hills', music: 'overworld', name: 'Rumble Hills', grid: [
    '#######..#######',
    '#......:.......#',
    '#.RR...:...R...#',
    '#.R....:.,.....#',
    '#......:....RR.#',
    '.......:.......#',
    '...:::::.......#',
    '#.........R....#',
    '#.RR..%%......R#',
    '#...,......RR..#',
    '#..R...........#',
    '################'],
  ents: [
    { t: 'enemy', k: 'thornback', x: 4, y: 9 },
    { t: 'enemy', k: 'crab', x: 11, y: 6 },
    { t: 'enemy', k: 'crab', x: 6, y: 3 },
  ] },
  // Rumble Hills north (Crystal Caverns)
  '3,0': { theme: 'hills', music: 'overworld', name: 'Rumble Hills', grid: [
    '################',
    '#....##UU##....#',
    '#.............R#',
    '#.R..,....rrr..#',
    '#.....R...r.r..#',
    '#.........rrr..#',
    '#..%%..........#',
    '#.....R...,....#',
    '#.R.........R..#',
    '#....:.........#',
    '#......:.......#',
    '#######..#######'],
  warps: { '7,1': { area: 'crystal' }, '8,1': { area: 'crystal' } },
  ents: [
    { t: 'hp', x: 11, y: 4, id: 'hp-hills' },
    { t: 'enemy', k: 'crab', x: 4, y: 8 },
    { t: 'enemy', k: 'thornback', x: 9, y: 7 },
  ] },
  // Frosty Peak east
  '1,0': { theme: 'peak', music: 'overworld', name: 'Frosty Peak', grid: [
    '################',
    '#..A....A...A..#',
    '#......%....A..#',
    '#.A..A.........#',
    '#......b..A....#',
    '..........A....#',
    '...............#',
    '#..A.....A..A..#',
    '#......A.......#',
    '#.A..........A.#',
    '#....A..A..A...#',
    '#######..#######'],
  ents: [
    { t: 'enemy', k: 'snowman', x: 5, y: 6 },
    { t: 'enemy', k: 'bat', x: 11, y: 3 },
    { t: 'enemy', k: 'snowman', x: 12, y: 8 },
  ] },
  // Frost Spire approach
  '0,0': { theme: 'peak', music: 'overworld', name: 'Frosty Peak', grid: [
    '################',
    '#A...##UU##...A#',
    '#..A.........A.#',
    '#....~~~~~.....#',
    '#.A.~~~~~~~..A.#',
    '#...~~~~~~~.....',
    '#....~~~~~......',
    '#.A.........A..#',
    '#....A..A......#',
    '#.A........A...#',
    '#....A....A..A.#',
    '################'],
  warps: { '7,1': { area: 'frost' }, '8,1': { area: 'frost' } },
  ents: [
    { t: 'enemy', k: 'bat', x: 3, y: 8 },
    { t: 'enemy', k: 'bat', x: 12, y: 3 },
    { t: 'enemy', k: 'snowman', x: 9, y: 9 },
  ] },
  // Hush Tower grounds
  '2,0': { theme: 'tower', music: 'tower', name: 'Hush Tower', grid: [
    '################',
    '#....######....#',
    '#....##UU##....#',
    '#..L.##GG##.L..#',
    '#..............#',
    '#.Z..........Z.#',
    '#......::......#',
    '#......::......#',
    '#.%%...::...%%.#',
    '#......::......#',
    '#.....:..:.....#',
    '#######..#######'],
  warps: { '7,2': { area: 'hush' }, '8,2': { area: 'hush' } },
  gate: true,
  statue: ['Three empty sockets glow faintly on the gate. Green, purple and blue.'],
  ents: [
    { t: 'enemy', k: 'wisp', x: 4, y: 7 },
    { t: 'enemy', k: 'wisp', x: 11, y: 7 },
  ] },
}

// ------------------------------------------------------------------ dungeons
// Rooms are built from door specs plus optional inner rows (14x10) and tile overrides.
function room(doors, inner, extra) {
  const g = []
  for (let y = 0; y < ROWS; y++) {
    let row = ''
    for (let x = 0; x < COLS; x++) {
      if (x === 0 || y === 0 || x === COLS - 1 || y === ROWS - 1) row += 'W'
      else row += inner ? (inner[y - 1] || '').charAt(x - 1) || '.' : '.'
    }
    g.push(row.split(''))
  }
  const put = (side, ch) => {
    if (!ch) return
    const t = ch === 'o' ? '.' : ch
    if (side === 'n') { g[0][7] = t; g[0][8] = t }
    if (side === 's') { g[ROWS - 1][7] = t; g[ROWS - 1][8] = t }
    if (side === 'w') { g[5][0] = t; g[6][0] = t }
    if (side === 'e') { g[5][COLS - 1] = t; g[6][COLS - 1] = t }
  }
  for (const [k, v] of Object.entries(doors)) put(k, v)
  if (extra) for (const [x, y, ch] of extra) g[y][x] = ch
  return g.map((r) => r.join(''))
}

const DUNGEONS = {
  leafy: {
    name: 'Leafy Hollow', theme: 'leafy', music: 'dungeon', stone: 0,
    start: [1, 2], exit: { screen: [0, 1], tile: [8.5, 2.5] },
    rooms: {
      '1,2': { grid: room({ s: 'X', n: 'o', w: 'o', e: '+' }, [
        '..............', '.L..........L.', '..............', '...p......p...', '..............',
        '..............', '...p......p...', '..............', '.L..........L.', '..............']),
      ents: [{ t: 'enemy', k: 'blob', x: 4, y: 4 }, { t: 'enemy', k: 'blob', x: 11, y: 7 }],
      tip: ['Locked doors need a small key. Look around!'] },
      '0,2': { grid: room({ e: 'o' }, [
        '..............', '..RR......RR..', '..R........R..', '..............', '..............',
        '..............', '..............', '..R........R..', '..RR......RR..', '..............']),
      ents: [{ t: 'chest', x: 3, y: 5, item: 'key' }, { t: 'enemy', k: 'blob', x: 6, y: 3 }, { t: 'enemy', k: 'blob', x: 9, y: 8 }, { t: 'enemy', k: 'buzzbee', x: 10, y: 5 }] },
      '2,2': { grid: room({ w: '+', n: 'u' }, [
        '..............', '.R..........R.', '...o..........', '..............', '.R..........R.',
        '..............', '...k..........', '..............', '.R..........R.', '..............']),
      open: 'plates', tip: ['Push the stone block onto the switch!'] },
      '2,1': { grid: room({ s: 'o' }, [
        '..............', '.OO........OO.', '.OO........OO.', '..............', '..............',
        '..............', '..............', '.OO........OO.', '.OO........OO.', '..............']),
      ents: [{ t: 'chest', x: 7, y: 5, item: 'boomerang' }, { t: 'enemy', k: 'thornback', x: 4, y: 4 }, { t: 'enemy', k: 'thornback', x: 11, y: 7 }] },
      '1,1': { grid: room({ s: 'o', w: 'o', n: 'B' }, [
        '.L.w........L.', '..............', 'OOOOOOQQOOOOOO', 'OOOOOOQQOOOOOO', '..............',
        '..............', '..............', '..p........p..', '..............', '..............']),
      open: 'switch', tip: ['That crystal switch is across the pit. Can something fly over?'],
      ents: [{ t: 'chest', x: 3, y: 2, item: 'heartpiece' }, { t: 'enemy', k: 'blob', x: 4, y: 8 }] },
      '0,1': { grid: room({ e: 'o' }, [
        '..............', '..............', '...L......L...', '..............', '..............',
        '..............', '..............', '...L......L...', '..............', '..............']),
      ents: [{ t: 'chest', x: 7, y: 5, item: 'bigkey', appear: true }, { t: 'enemy', k: 'thornback', x: 4, y: 3 }, { t: 'enemy', k: 'thornback', x: 11, y: 8 }, { t: 'enemy', k: 'blob', x: 4, y: 8 }, { t: 'enemy', k: 'blob', x: 11, y: 3 }],
      open: 'enemies' },
      '1,0': { grid: room({ s: 'B' }, [
        '..............', '.L..........L.', '..............', '..............', '..............',
        '..............', '..............', '..............', '.L..........L.', '..............']),
      boss: 'mole' },
    },
  },
  crystal: {
    name: 'Crystal Caverns', theme: 'crystal', music: 'dungeon', stone: 1,
    start: [1, 3], exit: { screen: [3, 0], tile: [7.5, 2.5] },
    rooms: {
      '1,3': { grid: room({ s: 'X', n: 'o', e: 'o', w: 'c' }, [
        '..............', '.L..........L.', '..............', '..............', '..............',
        '..............', '..............', '..............', '.L..........L.', '..............']),
      ents: [{ t: 'enemy', k: 'crab', x: 4, y: 4 }, { t: 'enemy', k: 'crab', x: 11, y: 7 }],
      tip: ['Cracked walls can be blown open with a bomb.'] },
      '0,3': { grid: room({ e: 'c' }, [
        '..............', '..p.p....p.p..', '..............', '..............', '..............',
        '..............', '..............', '..............', '..p.p....p.p..', '..............']),
      ents: [{ t: 'chest', x: 7, y: 5, item: 'heartpiece' }] },
      '2,3': { grid: room({ w: 'o' }, [
        '..............', '..RR......RR..', '..............', '.....R..R.....', '..............',
        '..............', '.....R..R.....', '..............', '..RR......RR..', '..............']),
      ents: [{ t: 'chest', x: 12, y: 5, item: 'key' }, { t: 'enemy', k: 'thornback', x: 4, y: 5 }, { t: 'enemy', k: 'thornback', x: 10, y: 8 }] },
      '1,2': { grid: room({ s: 'o', n: '+', e: 'u', w: 'c' }, [
        '..............', '.R..........R.', '..............', '..............', '..............',
        '..............', '..............', '..............', '.R..........R.', '..............']),
      open: 'enemies', ents: [{ t: 'enemy', k: 'crab', x: 4, y: 3 }, { t: 'enemy', k: 'crab', x: 11, y: 8 }, { t: 'enemy', k: 'thornback', x: 7, y: 5 }],
      tip: ['Defeat every monster to open the shutter.'] },
      '2,2': { grid: room({ w: 'o' }, [
        '..............', '.L..........L.', '..............', '..............', '..............',
        '..............', '..............', '..............', '.L..........L.', '..............']),
      ents: [{ t: 'chest', x: 8, y: 5, item: 'bombs' }, { t: 'enemy', k: 'buzzbee', x: 5, y: 3 }, { t: 'enemy', k: 'buzzbee', x: 11, y: 8 }] },
      '0,2': { grid: room({ e: 'c' }, [
        '..............', '..o........o..', '..............', '..............', '..............',
        '......k.......', '..............', '..............', '..............', '..............']),
      open: 'plates', ents: [{ t: 'chest', x: 7, y: 8, item: 'bigkey', appear: true }],
      tip: ['Two switches... but only one block. Maybe you can stand on the other one!'] },
      '1,1': { grid: room({ s: '+', n: 'B' }, [
        '..............', '..............', '..............', 'RRRRRRrrRRRRRR', '..............',
        '..............', '..p........p..', '..............', '..p........p..', '..............']),
      ents: [{ t: 'enemy', k: 'crab', x: 4, y: 7 }, { t: 'enemy', k: 'crab', x: 11, y: 7 }] },
      '1,0': { grid: room({ s: 'B' }, [
        '..............', '.L..........L.', '..............', '..............', '..............',
        '..............', '..............', '..............', '.L..........L.', '..............']),
      boss: 'crab' },
    },
  },
  frost: {
    name: 'Frost Spire', theme: 'frost', music: 'dungeon', stone: 2,
    start: [1, 3], exit: { screen: [0, 0], tile: [7.5, 2.5] },
    rooms: {
      '1,3': { grid: room({ s: 'X', n: 'o', w: 'o', e: '+' }, [
        '..............', '..............', '...iiiiiiii...', '..iiiiiiiiii..', '..iiiiiiiiii..',
        '..iiiiiiiiii..', '..iiiiiiiiii..', '...iiiiiiii...', '..............', '..............']),
      ents: [{ t: 'enemy', k: 'bat', x: 4, y: 4 }, { t: 'enemy', k: 'bat', x: 11, y: 6 }],
      tip: ['Careful! Ice is slippery.'] },
      '0,3': { grid: room({ e: 'o' }, [
        'iiiiiiiiiiiiii', 'iiiiiiiiiiiiii', 'iiRiiiiiiiiRii', 'iiiiiiiiiiiiii', 'iiiiiiiiiiiiii',
        'iiiiiiiiiiiiii', 'iiiiiiiiiiiiii', 'iiRiiiiiiiiRii', 'iiiiiiiiiiiiii', 'iiiiiiiiiiiiii']),
      ents: [{ t: 'chest', x: 2, y: 5, item: 'key' }, { t: 'enemy', k: 'snowman', x: 6, y: 3 }, { t: 'enemy', k: 'snowman', x: 9, y: 8 }, { t: 'enemy', k: 'bat', x: 11, y: 5 }] },
      '2,3': { grid: room({ w: '+' }, [
        '..............', '.L..........L.', '..............', '..............', '..............',
        '..............', '..............', '..............', '.L..........L.', '..............']),
      ents: [{ t: 'chest', x: 8, y: 5, item: 'bow' }, { t: 'enemy', k: 'snowman', x: 5, y: 3 }, { t: 'enemy', k: 'snowman', x: 11, y: 8 }] },
      '1,2': { grid: room({ s: 'o', n: 'B', w: 'u', e: 'o' }, [
        '..............', '..............', '..iiiiiiiiii..', '..iiiiiiiiii..', '..iiiiiiiiii..',
        '..iiiiiiiiii..', '..iiiiiiiiii..', '..iiiiiiiiii..', '..............', '..............'], [[3, 0, 'E'], [12, 0, 'E']]),
      open: 'eyes', ents: [{ t: 'enemy', k: 'bat', x: 6, y: 5 }],
      tip: ['Those eyes in the wall are watching you. Maybe an arrow would make them blink!'] },
      '0,2': { grid: room({ e: 'o' }, [
        '..............', '..L........L..', '..............', '..............', '..............',
        '..............', '..............', '..............', '..L........L..', '..............']),
      ents: [{ t: 'chest', x: 7, y: 5, item: 'bigkey', appear: true }, { t: 'enemy', k: 'snowman', x: 4, y: 4 }, { t: 'enemy', k: 'snowman', x: 11, y: 7 }, { t: 'enemy', k: 'bat', x: 7, y: 3 }],
      open: 'enemies' },
      '2,2': { grid: room({ w: 'o' }, [
        '..............', '.........OOOOO', '.........OOOOO', '.........QQ..O',
        '.........QQ..O', '.........OOOOO', '.........OOOOO', '..............', '..............', '..............'], [[15, 2, 'E']]),
      open: 'eyes', ents: [{ t: 'chest', x: 13, y: 4, item: 'heartpiece' }, { t: 'enemy', k: 'bat', x: 5, y: 5 }] },
      '1,1': { grid: room({ s: 'B' }, [
        '..............', '.L..........L.', '..............', '..............', '..............',
        '..............', '..............', '..............', '.L..........L.', '..............']),
      boss: 'owl' },
    },
  },
  hush: {
    name: 'Hush Tower', theme: 'hush', music: 'tower', final: true,
    start: [1, 3], exit: { screen: [2, 0], tile: [7.5, 4.5] },
    rooms: {
      '1,3': { grid: room({ s: 'X', n: 'c' }, [
        '..............', '.L..........L.', '..............', '..Z........Z..', '..............',
        '..............', '..Z........Z..', '..............', '.L..........L.', '..............']),
      ents: [{ t: 'enemy', k: 'wisp', x: 4, y: 5 }, { t: 'enemy', k: 'wisp', x: 11, y: 6 }],
      tip: ['Grumblewick is at the top of the tower. Use everything you have learned!'] },
      '1,2': { grid: room({ s: 'c', n: 'u' }, [
        '..............', '..............', '..RR......RR..', '..............', '..............',
        '..............', '..............', '..RR......RR..', '..............', '..............'], [[3, 0, 'E'], [12, 0, 'E']]),
      open: 'eyes', ents: [{ t: 'chest', x: 7, y: 7, item: 'key' }, { t: 'enemy', k: 'wisp', x: 4, y: 5 }, { t: 'enemy', k: 'thornback', x: 11, y: 5 }] },
      '1,1': { grid: room({ s: 'o', n: '+' }, [
        '.L.w........L.', '..............', 'OOOOOOQQOOOOOO', 'OOOOOOQQOOOOOO', '..............',
        '..............', '..............', '..p........p..', '..............', '..............']),
      open: 'switch', ents: [{ t: 'enemy', k: 'wisp', x: 3, y: 8 }, { t: 'enemy', k: 'crab', x: 12, y: 8 }] },
      '1,0': { grid: room({ s: '+' }, [
        '..............', '.L..........L.', '..............', '..............', '..............',
        '..............', '..............', '..............', '.L..........L.', '..............']),
      boss: 'dark' },
    },
  },
}

export function getScreen(area, x, y) {
  if (area === 'overworld') return OW[`${x},${y}`] || null
  const d = DUNGEONS[area]
  return d ? d.rooms[`${x},${y}`] || null : null
}
export function dungeon(area) { return DUNGEONS[area] }
export function areaTheme(area, scr) { return area === 'overworld' ? scr.theme : DUNGEONS[area].theme }
export function areaMusic(area, scr) { return area === 'overworld' ? scr.music : DUNGEONS[area].music }
export function areaRooms(area) { return area === 'overworld' ? OW : DUNGEONS[area].rooms }
export const OW_SIZE = [4, 3]

// ------------------------------------------------------------------ dialogue
export const TALK = {
  grandpa: (s) => !s.items.sword
    ? ['Norah! Did you hear it? The music stopped!', 'Grumblewick, that grumpy shadow owl, took the three Songstones. Without them, Melody Meadow has gone quiet.', 'Take my old sword. It is small, but so were you when you first sang!', '__give_sword__']
    : stones(s) === 0 ? ['The first Songstone is hidden in Leafy Hollow, in the Whispering Woods to the north.', 'Press A to swing your sword. Hold A, then let go, for a spin attack!']
    : stones(s) === 1 ? ['You found one! I can almost hear a little tune.', 'The next stone is in the Crystal Caverns, up in Rumble Hills. Cross Glimmer Lake to the east.']
    : stones(s) === 2 ? ['Two Songstones! The birds are humming again.', 'The last one is in the Frost Spire on Frosty Peak. The path north of the woods is blocked by cracked rocks...']
    : ['All three Songstones! Now go to the Hush Tower, north of Glimmer Lake. Bring the music home, Norah!'],
  potato: (s) => !s.items.sword ? ['Woof! (Potato wags her tail. Go talk to Grandpa!)']
    : !s.items.boomerang ? ['Woof woof! (Potato sniffs toward the woods up north. You can cut bushes with your sword!)']
    : !s.flags.bridge ? ['Arf! (Potato looks at the lake. Throw your boomerang at the crystal switch across the water! Press B to use your item.)']
    : !s.items.bombs ? ['Woof! (Potato points her nose east, toward Rumble Hills.)']
    : !s.items.bow ? ['Arf arf! (Potato digs at the ground... BOOM? The cracked rocks north of the woods!)']
    : stones(s) < 3 ? ['Woof! (Potato is proud of you. Find the last Songstone!)']
    : ['AROOOO! (Potato howls a song. The tower is waiting!)'],
  lady: (s) => stones(s) >= 3 ? ['I can hear music again in my heart. Go get it, Norah!'] : ['Usually I sing while I bake. Now my muffins taste... quiet.', 'Tall grass sometimes hides gems. Swing your sword through it!'],
  kid: (s) => !s.items.boomerang ? ['I was going to play my kazoo, but it only goes "pfff".', 'Did you know you can pick up pots? Stand next to one and press A!'] : ['Cool boomerang! It can grab gems and hearts from far away!'],
  elder: (s) => s.heartPieces > 0 ? [`You have ${s.heartPieces % 4} of 4 heart pieces. Collect four for a new heart!`] : ['Heart pieces are hidden all over the land. Find four and your heart grows bigger!'],
  shop: () => ['Welcome! Things are quiet without music, but my prices are LOUD. Ha ha!', 'Walk up to an item and press A to buy it.'],
  farmer: (s) => !s.flags['hp:hp-pen'] ? ['My goats will not dance without music. They just stand there. Staring.', 'Oh! And something shiny fell into my pen. I cannot climb the fence... can you reach it?'] : ['If you run out of bombs, the market sells more.'],
  nug: (s) => !s.flags.bridge ? ['Ribbit! Hi, I am Nug! The bridge is up because the crystal switch is on the other side.', 'I bet a boomerang could reach it. Ribbit!'] : ['Ribbit! The bridge is down! Rumble Hills is just across.'],
}

export const ITEM_TEXT = {
  sword: ['You got Grandpa\'s Sword!', 'Press A (Space) to swing. Hold A and let go for a spin attack!'],
  boomerang: ['You got the Boomerang!', 'Press B (X) to throw it. It stuns monsters, hits switches and grabs things!'],
  bombs: ['You got Bombs!', 'Press B (X) to set one down. Boom! Blast cracked walls and rocks. Pick your item in the menu (Enter).'],
  bow: ['You got the Bow!', 'Press B (X) to shoot an arrow. Hit eye switches and flying monsters!'],
  key: ['You got a Small Key!', 'It opens one locked door in this dungeon.'],
  bigkey: ['You got the Big Key!', 'It opens the big door to the boss!'],
  heartpiece: ['You got a Piece of Heart!'],
  container: ['You got a Heart Container!', 'Your hearts grew by one!'],
  stone0: ['You got the Green Songstone!', 'A soft melody fills the air...'],
  stone1: ['You got the Purple Songstone!', 'The melody grows stronger!'],
  stone2: ['You got the Blue Songstone!', 'All three Songstones! The Hush Tower gate will open now.'],
  gems20: ['You found 20 gems!'],
}
export { has, stones }
