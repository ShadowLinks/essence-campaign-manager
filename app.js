/* ============================== DATA ============================== */

const TIERS = ['Normal','Iron','Bronze','Silver','Gold','Diamond','Transcendent'];

const DEFAULT_DAMAGE_TYPES = [
  'Acid','Bludgeoning','Bludgeoning (magical)','Bludgeoning (nonmagical)',
  'Piercing','Piercing (magical)','Piercing (nonmagical)',
  'Slashing','Slashing (magical)','Slashing (nonmagical)',
  'Cold','Fire','Force','Lightning','Necrotic','Poison',
  'Psychic','Radiant','Thunder','Shadow','Void','Resonating Force','Disruptive Force','Transcendent',
  'Silver','Cold Iron','Adamantine','Orichalcum'
];

const DEFAULT_CREATURE_TYPES = [
  'Aberration','Beast','Celestial','Construct','Dragon','Elemental','Fey','Fiend',
  'Giant','Humanoid','Monstrosity','Ooze','Plant','Undead','Structure'
];

const DEFAULT_TAGS = ['Shapechanger','Structure','Psychic-Aligned','Shadow-Aligned','Void-Immune','Ethereal'];

const ELEMENTAL_ALIGNMENTS = ['Cold','Fire','Water','Lightning','Earth'];

// --- Essence master list, built from the classification + rarity tables ---
const ESSENCE_KIND = {
  Living: ['Ape','Bat','Bear','Bee','Bird','Cat','Cattle','Coral','Crocodile','Deer','Dog','Duck','Fungus','Heidel','Horse','Fish','Flea','Fox','Frog','Goat','Lizard','Locust','Manatee','Monkey','Mouse','Octopus','Pangolin','Plant','Rabbit','Rat','Shark','Skunk','Sloth','Snake','Spider','Tentacle','Tree','Turtle','Wasp','Whale','Wolf','Wood'],
  Weapon: ['Armour','Axe','Bow','Cage','Chain','Claw','Cloth','Eye','Foot','Fork','Gun','Hammer','Hand','Hook','Knife','Rake','Sceptre','Shield','Ship','Shovel','Sickle','Spear','Spike','Staff','Sword','Technology','Trap','Trowel','Vehicle','Whip'],
  Elemental: ['Blight','Blood','Bone','Cloud','Cold','Corrupt','Crystal','Dark','Dust','Earth','Elemental','Fire','Flesh','Glass','Hair','Ice','Iron','Life','Light','Lightning','Paper','Rune','Sand','Smoke','Thread','Water','Wind'],
  Concept: ['Adept','Balance','Death','Deep','Dimension','Discord','Echo','Feast','Feeble','Gathering','Grazen','Growth','Harmonic','Hunger','Hunt','Knowledge','Lurker','Magic','Malign','Might','Mirror','Moon','Myriad','Needle','Net','Omen','Potent','Pure','Renewal','Resolute','Serene','Shimmer','Sin','Song','Star','Sun','Swift','Vast','Visage','Void','Wing','Zeal','Dance']
};
const ESSENCE_RARITY = {
  Common: ['Adept','Air','Armour','Axe','Bat','Bear','Bird','Bow','Cage','Cat','Cattle','Chain','Cloth','Coral','Crocodile','Deer','Dog','Duck','Earth','Eye','Fire','Fish','Flea','Foot','Fungus','Goat','Grazen','Gun','Hair','Hammer','Hand','Heidel','Hunt','Iron','Knife','Lizard','Locust','Magic','Manatee','Might','Mouse','Needle','Net','Octopus','Pangolin','Paper','Plant','Rabbit','Rake','Rat','Sand','Sceptre','Shark','Shield','Shovel','Sickle','Skunk','Sloth','Snake','Spear','Spider','Staff','Swift','Sword','Technology','Thread','Trap','Tree','Turtle','Vehicle','Wasp','Water','Whale','Whip','Wind','Wolf'],
  Uncommon: ['Balance','Blood','Bone','Claw','Cloud','Cold','Dance','Dark','Death','Dust','Feast','Flesh','Glass','Growth','Ice','Knowledge','Life','Light','Lightning','Mirror','Pure','Song','Venom'],
  Rare: ['Crystal','Deep','Echo','Gathering','Hunger','Moon','Resolute','Serene','Star','Sun','Zeal'],
  Epic: ['Corrupt','Discord','Elemental','Harmonic','Malign','Omen','Potent','Renewal','Rune','Shimmer','Tentacle','Wing'],
  Legendary: ['Dimension','Myriad','Sin','Vast','Visage','Void']
};
function buildEssenceList(){
  const rarityOf = {};
  Object.keys(ESSENCE_RARITY).forEach(r => ESSENCE_RARITY[r].forEach(name => rarityOf[name] = r));
  const kindOf = {};
  Object.keys(ESSENCE_KIND).forEach(k => ESSENCE_KIND[k].forEach(name => kindOf[name] = k));
  const names = new Set([...Object.values(ESSENCE_KIND).flat(), ...Object.values(ESSENCE_RARITY).flat()]);
  return [...names].sort().map(name => ({
    name, kind: kindOf[name] || 'Unclassified', rarity: rarityOf[name] || 'Unclassified'
  }));
}

// --- Known confluence essence combinations (3 chosen essences -> 1 confluence essence) ---
// Pulled from your campaign notes / the HWFWM Discord bot. "banned" entries are flagged so the
// Confluence Finder warns instead of quietly offering them to a player.
const CANON_CONFLUENCE = [
  {essences:['Gun','Hand','Vehicle'], result:'Action', description:'', source:'canon'},
  {essences:['Adept','Venom','Water'], result:'Alchemy', description:'', source:'canon'},
  {essences:['Iron','Thread','Trap'], result:'Ambush', description:'', source:'canon'},
  {essences:['Rune','Spider','Trap'], result:'Ambush', description:'', source:'canon'},
  {essences:['Earth','Spike','Trap'], result:'Ambush', description:'', source:'canon'},
  {essences:['Fire','Spider','Trap'], result:'Ambush', description:'', source:'canon'},
  {essences:['Dance','Knowledge','Mirror'], result:'Animate', description:'', source:'canon'},
  {essences:['Fungus','Growth','Zeal'], result:'Animate', description:'Restricted in this campaign: induces a compelled transformation.', source:'canon', banned:true},
  {essences:['Dance','Dust','Echo'], result:'Animate', description:'', source:'canon'},
  {essences:['Bone','Death','Magic'], result:'Animate', description:'', source:'canon'},
  {essences:['Cloth','Dance','Magic'], result:'Animate', description:'', source:'canon'},
  {essences:['Bird','Cat','Vast'], result:'Anzu', description:'', source:'canon'},
  {essences:['Myriad','Shield','Sword'], result:'Arsenal', description:'', source:'canon'},
  {essences:['Corrupt','Dimension','Magic'], result:'Avatar', description:'', source:'canon'},
  {essences:['Dark','Tentacle','Void'], result:'Avatar', description:'', source:'canon'},
  {essences:['Hammer','Lightning','Might'], result:'Avatar', description:'', source:'canon'},
  {essences:['Blood','Life','Sun'], result:'Avatar', description:'', source:'canon'},
  {essences:['Dimension','Might','Renewal'], result:'Avatar', description:'', source:'canon'},
  {essences:['Lightning','Might','Sword'], result:'Avatar', description:'', source:'canon'},
  {essences:['Rune','Spear','Tree'], result:'Avatar', description:'', source:'canon'},
  {essences:['Potent','Vast','Water'], result:'Avatar', description:'', source:'canon'},
  {essences:['Corrupt','Magic','Void'], result:'Avatar', description:'', source:'canon'},
  {essences:['Corrupt','Dimension','Potent'], result:'Avatar', description:'', source:'canon'},
  {essences:['Dimension','Tentacle','Void'], result:'Avatar', description:'', source:'canon'},
  {essences:['Elemental','Harmonic','Potent'], result:'Avatar', description:'', source:'canon'},
  {essences:['Dimension','Light','Wing'], result:'Avatar', description:'', source:'canon'},
  {essences:['Eye','Fire','Magic'], result:'Avatar', description:'', source:'canon'},
  {essences:['Elemental','Might','Resolute'], result:'Avatar', description:'', source:'canon'},
  {essences:['Corrupt','Dimension','Might'], result:'Avatar', description:'', source:'canon'},
  {essences:['Magic','Might','Potent'], result:'Avatar', description:'', source:'canon'},
  {essences:['Blood','Bone','Flesh'], result:'Avatar', description:'', source:'canon'},
  {essences:['Iron','Spike','Vast'], result:'Battlefield', description:'', source:'canon'},
  {essences:['Cattle','Earth','Vast'], result:'Behemoth', description:'', source:'canon'},
  {essences:['Balance','Earth','Shield'], result:'Boundary', description:'', source:'canon'},
  {essences:['Dance','Feast','Knife'], result:'Bounty', description:'', source:'canon'},
  {essences:['Hunger','Vast','Void'], result:'Cataclysm', description:'', source:'canon'},
  {essences:['Dimension','Myriad','Sin'], result:'Cataclysm', description:'', source:'canon'},
  {essences:['Fire','Potent','Water'], result:'Cataclysm', description:'', source:'canon'},
  {essences:['Death','Myriad','Void'], result:'Cataclysm', description:'', source:'canon'},
  {essences:['Balance','Magic','Potent'], result:'Chaotic', description:'', source:'canon'},
  {essences:['Adept','Magic','Trap'], result:'Charlatan', description:'', source:'canon'},
  {essences:['Cat','Tentacle','Void'], result:'Chimera', description:'', source:'canon'},
  {essences:['Snake','Spider','Venom'], result:'Chimera', description:'', source:'canon'},
  {essences:['Earth','Pangolin','Shark'], result:'Chimera', description:'', source:'canon'},
  {essences:['Lizard','Spider','Wolf'], result:'Chimera', description:'', source:'canon'},
  {essences:['Death','Iron','Life'], result:'Cyborg', description:'', source:'canon'},
  {essences:['Flesh','Iron','Myriad'], result:'Cyborg', description:'', source:'canon'},
  {essences:['Flesh','Myriad','Technology'], result:'Cyborg', description:'', source:'canon'},
  {essences:['Flesh','Magic','Water'], result:'Cyborg', description:'', source:'canon'},
  {essences:['Death','Flesh','Iron'], result:'Cyborg', description:'', source:'canon'},
  {essences:['Flesh','Iron','Technology'], result:'Cyborg', description:'', source:'canon'},
  {essences:['Flesh','Might','Technology'], result:'Cyborg', description:'', source:'canon'},
  {essences:['Balance','Light','Renewal'], result:'Cycle', description:'', source:'canon'},
  {essences:['Renewal','Sun','Water'], result:'Dawn', description:'', source:'canon'},
  {essences:['Dark','Light','Sun'], result:'Dawn', description:'', source:'canon'},
  {essences:['Fire','Omen','Sun'], result:'Dawn', description:'', source:'canon'},
  {essences:['Hunger','Locust','Plant'], result:'Desolate', description:'', source:'canon'},
  {essences:['Blood','Hunger','Locust'], result:'Desolate', description:'', source:'canon'},
  {essences:['Bone','Dust','Sun'], result:'Desolate', description:'', source:'canon'},
  {essences:['Cold','Hammer','Sickle'], result:'Desolate', description:'', source:'canon'},
  {essences:['Sand','Sun','Wind'], result:'Desolate', description:'', source:'canon'},
  {essences:['Earth','Ice','Wind'], result:'Desolate', description:'', source:'canon'},
  {essences:['Death','Hunger','Plant'], result:'Desolate', description:'', source:'canon'},
  {essences:['Bow','Corrupt','Song'], result:'Discordant', description:'', source:'canon'},
  {essences:['Blood','Dark','Sin'], result:'Doom', description:'', source:'canon'},
  {essences:['Blood','Dark','Omen'], result:'Doom', description:'', source:'canon'},
  {essences:['Blood','Corrupt','Potent'], result:'Doom', description:'', source:'canon'},
  {essences:['Death','Potent','Void'], result:'Doom', description:'', source:'canon'},
  {essences:['Blood','Corrupt','Flesh'], result:'Doom', description:'', source:'canon'},
  {essences:['Blight','Smoke','Venom'], result:'Doom', description:'', source:'canon'},
  {essences:['Death','Potent','Vast'], result:'Doom', description:'', source:'canon'},
  {essences:['Death','Dimension','Zeal'], result:'Doom', description:'', source:'canon'},
  {essences:['Moon','Omen','Sun'], result:'Doom', description:'', source:'canon'},
  {essences:['Growth','Hunger','Void'], result:'Doom', description:'', source:'canon'},
  {essences:['Balance','Omen','Sin'], result:'Doom', description:'', source:'canon'},
  {essences:['Dark','Hunger','Void'], result:'Doom', description:'', source:'canon'},
  {essences:['Corrupt','Feast','Growth'], result:'Doom', description:'', source:'canon'},
  {essences:['Hunger','Magic','Mirror'], result:'Doppelganger', description:'', source:'canon'},
  {essences:['Flesh','Magic','Mirror'], result:'Doppelganger', description:'', source:'canon'},
  {essences:['Magic','Might','Wing'], result:'Dragon', description:'', source:'canon'},
  {essences:['Magic','Potent','Wing'], result:'Dragon', description:'', source:'canon'},
  {essences:['Balance','Dark','Light'], result:'Eclipse', description:'', source:'canon'},
  {essences:['Balance','Moon','Sun'], result:'Eclipse', description:'', source:'canon'},
  {essences:['Balance','Omen','Zeal'], result:'Eclipse', description:'', source:'canon'},
  {essences:['Balance','Death','Life'], result:'Eclipse', description:'', source:'canon'},
  {essences:['Dimension','Moon','Sun'], result:'Eclipse', description:'', source:'canon'},
  {essences:['Earth','Trowel','Vast'], result:'Edifice', description:'', source:'canon'},
  {essences:['Rune','Star','Tree'], result:'Effigy', description:'', source:'canon'},
  {essences:['Dance','Glass','Visage'], result:'Effigy', description:'', source:'canon'},
  {essences:['Blood','Dark','Shimmer'], result:'Effigy', description:'', source:'canon'},
  {essences:['Magic','Might','Swift'], result:'Empower', description:'', source:'canon'},
  {essences:['Blood','Growth','Hunger'], result:'Empower', description:'', source:'canon'},
  {essences:['Might','Renewal','Sin'], result:'Empower', description:'', source:'canon'},
  {essences:['Elemental','Lightning','Sword'], result:'Empower', description:'', source:'canon'},
  {essences:['Frog','Hunger','Void'], result:'Empower', description:'', source:'canon'},
  {essences:['Elemental','Hunger','Potent'], result:'Empower', description:'', source:'canon'},
  {essences:['Balance','Hunger','Magic'], result:'Empower', description:'', source:'canon'},
  {essences:['Lightning','Swift','Sword'], result:'Empower', description:'', source:'canon'},
  {essences:['Balance','Blood','Rune'], result:'Empower', description:'', source:'canon'},
  {essences:['Cat','Magic','Sun'], result:'Empower', description:'', source:'canon'},
  {essences:['Crystal','Magic','Sword'], result:'Empower', description:'', source:'canon'},
  {essences:['Flesh','Growth','Potent'], result:'Empower', description:'', source:'canon'},
  {essences:['Blood','Hunger','Might'], result:'Empower', description:'', source:'canon'},
  {essences:['Cat','Fungus','Renewal'], result:'Fertile', description:'', source:'canon'},
  {essences:['Magic','Pure','Visage'], result:'Fey', description:'', source:'canon'},
  {essences:['Bird','Fire','Wind'], result:'Firebird', description:'', source:'canon'},
  {essences:['Magic','Potent','Shield'], result:'Force', description:'', source:'canon'},
  {essences:['Adept','Magic','Might'], result:'Force', description:'', source:'canon'},
  {essences:['Balance','Might','Potent'], result:'Force', description:'', source:'canon'},
  {essences:['Iron','Lightning','Technology'], result:'Forge', description:'', source:'canon'},
  {essences:['Fire','Iron','Water'], result:'Forge', description:'', source:'canon'},
  {essences:['Fire','Iron','Technology'], result:'Forge', description:'', source:'canon'},
  {essences:['Bird','Fire','Iron'], result:'Forge', description:'', source:'canon'},
  {essences:['Fire','Hammer','Iron'], result:'Forge', description:'', source:'canon'},
  {essences:['Earth','Iron','Shield'], result:'Fortress', description:'', source:'canon'},
  {essences:['Bird','Might','Swift'], result:'Garuda', description:'', source:'canon'},
  {essences:['Might','Swift','Wing'], result:'Garuda', description:'', source:'canon'},
  {essences:['Dimension','Myriad','Rune'], result:'Gate', description:'', source:'canon'},
  {essences:['Dimension','Magic','Void'], result:'Gate', description:'', source:'canon'},
  {essences:['Dimension','Magic','Rune'], result:'Gate', description:'', source:'canon'},
  {essences:['Fire','Mirror','Venom'], result:'Glimeron', description:'', source:'canon'},
  {essences:['Earth','Hair','Snake'], result:'Gorgon', description:'', source:'canon'},
  {essences:['Bird','Cat','Might'], result:'Griffin', description:'', source:'canon'},
  {essences:['Magic','Shield','Void'], result:'Guardian', description:'', source:'canon'},
  {essences:['Shield','Trap','Void'], result:'Guardian', description:'', source:'canon'},
  {essences:['Claw','Malign','Song'], result:'Harpy', description:'', source:'canon'},
  {essences:['Bird','Discord','Song'], result:'Harpy', description:'', source:'canon'},
  {essences:['Discord','Song','Wing'], result:'Harpy', description:'', source:'canon'},
  {essences:['Axe','Hunt','Plant'], result:'Harvest', description:'', source:'canon'},
  {essences:['Earth','Plant','Sickle'], result:'Harvest', description:'', source:'canon'},
  {essences:['Myriad','Renewal','Snake'], result:'Hydra', description:'', source:'canon'},
  {essences:['Life','Magic','Renewal'], result:'Immortal', description:'', source:'canon'},
  {essences:['Growth','Might','Renewal'], result:'Immortal', description:'', source:'canon'},
  {essences:['Blood','Potent','Renewal'], result:'Immortal', description:'', source:'canon'},
  {essences:['Might','Swift','Vehicle'], result:'Juggernaut', description:'', source:'canon'},
  {essences:['Iron','Might','Swift'], result:'Juggernaut', description:'', source:'canon'},
  {essences:['Balance','Magic','Rune'], result:'Karmic', description:'', source:'canon'},
  {essences:['Omen','Rune','Star'], result:'Karmic', description:'', source:'canon'},
  {essences:['Deep','Myriad','Potent'], result:'Kraken', description:'', source:'canon'},
  {essences:['Might','Octopus','Vast'], result:'Kraken', description:'', source:'canon'},
  {essences:['Deep','Might','Octopus'], result:'Kraken', description:'', source:'canon'},
  {essences:['Fish','Vast','Water'], result:'Leviathan', description:'', source:'canon'},
  {essences:['Deep','Might','Vast'], result:'Leviathan', description:'', source:'canon'},
  {essences:['Harmonic','Plant','Water'], result:'Lotus', description:'', source:'canon'},
  {essences:['Plant','Sword','Water'], result:'Lotus', description:'', source:'canon'},
  {essences:['Armour','Magic','Technology'], result:'Magitech', description:'', source:'canon'},
  {essences:['Lightning','Magic','Technology'], result:'Magitech', description:'', source:'canon'},
  {essences:['Cat','Spike','Venom'], result:'Manticore', description:'', source:'canon'},
  {essences:['Foot','Knife','Swift'], result:'Master', description:'', source:'canon'},
  {essences:['Adept','Gathering','Gun'], result:'Master', description:'', source:'canon'},
  {essences:['Adept','Iron','Technology'], result:'Master', description:'', source:'canon'},
  {essences:['Adept','Bow','Swift'], result:'Master', description:'', source:'canon'},
  {essences:['Adept','Myriad','Sword'], result:'Master', description:'', source:'canon'},
  {essences:['Adept','Dance','Sword'], result:'Master', description:'', source:'canon'},
  {essences:['Adept','Fire','Hammer'], result:'Master', description:'', source:'canon'},
  {essences:['Adept','Needle','Thread'], result:'Master', description:'', source:'canon'},
  {essences:['Adept','Foot','Hand'], result:'Master', description:'', source:'canon'},
  {essences:['Adept','Dance','Whip'], result:'Master', description:'', source:'canon'},
  {essences:['Adept','Gun','Swift'], result:'Master', description:'', source:'canon'},
  {essences:['Adept','Gun','Hand'], result:'Master', description:'', source:'canon'},
  {essences:['Dance','Song','Sword'], result:'Master', description:'', source:'canon'},
  {essences:['Adept','Knife','Smoke'], result:'Master', description:'', source:'canon'},
  {essences:['Adept','Magic','Sword'], result:'Master', description:'', source:'canon'},
  {essences:['Cloth','Needle','Thread'], result:'Master', description:'', source:'canon'},
  {essences:['Adept','Swift','Sword'], result:'Master', description:'', source:'canon'},
  {essences:['Adept','Cloth','Needle'], result:'Master', description:'', source:'canon'},
  {essences:['Dance','Sword','Thread'], result:'Master', description:'', source:'canon'},
  {essences:['Adept','Thread','Whip'], result:'Master', description:'', source:'canon'},
  {essences:['Adept','Fire','Iron'], result:'Master', description:'', source:'canon'},
  {essences:['Adept','Magic','Potent'], result:'Master', description:'', source:'canon'},
  {essences:['Life','Pure','Renewal'], result:'Ministration', description:'', source:'canon'},
  {essences:['Cattle','Might','Trap'], result:'Minotaur', description:'', source:'canon'},
  {essences:['Cattle','Hunt','Might'], result:'Minotaur', description:'', source:'canon'},
  {essences:['Fire','Light','Water'], result:'Mirage', description:'', source:'canon'},
  {essences:['Sun','Vast','Water'], result:'Mirage', description:'', source:'canon'},
  {essences:['Sand','Sun','Visage'], result:'Mirage', description:'', source:'canon'},
  {essences:['Earth','Growth','Might'], result:'Monolith', description:'', source:'canon'},
  {essences:['Magic','Might','Staff'], result:'Mystic', description:'', source:'canon'},
  {essences:['Magic','Omen','Vast'], result:'Mystic', description:'', source:'canon'},
  {essences:['Magic','Sword','Wind'], result:'Mystic', description:'', source:'canon'},
  {essences:['Balance','Swift','Wind'], result:'Mystic', description:'', source:'canon'},
  {essences:['Balance','Dimension','Harmonic'], result:'Mystic', description:'', source:'canon'},
  {essences:['Iron','Might','Serene'], result:'Mystic', description:'', source:'canon'},
  {essences:['Dark','Knowledge','Pure'], result:'Mystic', description:'', source:'canon'},
  {essences:['Dark','Song','Vast'], result:'Mystic', description:'', source:'canon'},
  {essences:['Adept','Water','Wind'], result:'Mystic', description:'', source:'canon'},
  {essences:['Balance','Swift','Sword'], result:'Mystic', description:'', source:'canon'},
  {essences:['Harmonic','Knowledge','Pure'], result:'Mystic', description:'', source:'canon'},
  {essences:['Balance','Hand','Iron'], result:'Mystic', description:'', source:'canon'},
  {essences:['Blood','Renewal','Sword'], result:'Mystic', description:'', source:'canon'},
  {essences:['Cloud','Vast','Void'], result:'Nebula', description:'', source:'canon'},
  {essences:['Balance','Mirror','Void'], result:'Nemesis', description:'', source:'canon'},
  {essences:['Earth','Sand','Water'], result:'Oasis', description:'', source:'canon'},
  {essences:['Vast','Vehicle','Water'], result:'Ocean', description:'', source:'canon'},
  {essences:['Bow','Gathering','Myriad'], result:'Onslaught', description:'', source:'canon'},
  {essences:['Might','Swift','Wind'], result:'Onslaught', description:'', source:'canon'},
  {essences:['Growth','Renewal','Zeal'], result:'Onslaught', description:'', source:'canon'},
  {essences:['Gun','Might','Vehicle'], result:'Onslaught', description:'', source:'canon'},
  {essences:['Gun','Vehicle','Wind'], result:'Onslaught', description:'', source:'canon'},
  {essences:['Might','Potent','Vast'], result:'Onslaught', description:'', source:'canon'},
  {essences:['Growth','Might','Zeal'], result:'Onslaught', description:'', source:'canon'},
  {essences:['Adept','Might','Potent'], result:'Onslaught', description:'', source:'canon'},
  {essences:['Might','Potent','Swift'], result:'Onslaught', description:'', source:'canon'},
  {essences:['Hand','Might','Swift'], result:'Onslaught', description:'', source:'canon'},
  {essences:['Adept','Might','Swift'], result:'Onslaught', description:'', source:'canon'},
  {essences:['Fire','Gun','Vehicle'], result:'Onslaught', description:'', source:'canon'},
  {essences:['Gun','Might','Potent'], result:'Onslaught', description:'', source:'canon'},
  {essences:['Myriad','Vast','Visage'], result:'Phantasmagoria', description:'', source:'canon'},
  {essences:['Fire','Renewal','Wing'], result:'Phoenix', description:'', source:'canon'},
  {essences:['Bow','Dark','Hunt'], result:'Predatory', description:'', source:'canon'},
  {essences:['Bow','Hunt','Trap'], result:'Predatory', description:'', source:'canon'},
  {essences:['Spear','Spider','Wing'], result:'Predatory', description:'', source:'canon'},
  {essences:['Bow','Spider','Trap'], result:'Predatory', description:'', source:'canon'},
  {essences:['Chain','Iron','Myriad'], result:'Prison', description:'', source:'canon'},
  {essences:['Shield','Trap','Vast'], result:'Prison', description:'', source:'canon'},
  {essences:['Cage','Rune','Trap'], result:'Prison', description:'', source:'canon'},
  {essences:['Cage','Lightning','Myriad'], result:'Prison', description:'', source:'canon'},
  {essences:['Gathering','Iron','Might'], result:'Prison', description:'', source:'canon'},
  {essences:['Feast','Foot','Rabbit'], result:'Prosperity', description:'', source:'canon'},
  {essences:['Balance','Renewal','Rune'], result:'Prosperity', description:'', source:'canon'},
  {essences:['Magic','Rune','Vast'], result:'Prosperity', description:'', source:'canon'},
  {essences:['Growth','Omen','Sun'], result:'Prosperity', description:'', source:'canon'},
  {essences:['Growth','Renewal','Shield'], result:'Prosperity', description:'', source:'canon'},
  {essences:['Adept','Balance','Renewal'], result:'Prosperity', description:'', source:'canon'},
  {essences:['Balance','Echo','Ice'], result:'Refracting', description:'', source:'canon'},
  {essences:['Bird','Needle','Song'], result:'Resonating', description:'', source:'canon'},
  {essences:['Crystal','Harmonic','Serene'], result:'Resonating', description:'', source:'canon'},
  {essences:['Echo','Swift','Wind'], result:'Resonating', description:'', source:'canon'},
  {essences:['Bird','Might','Vast'], result:'Roc', description:'', source:'canon'},
  {essences:['Blood','Dimension','Goat'], result:'Sacrifice', description:'Restricted in this campaign.', source:'canon', banned:true},
  {essences:['Hunger','Knife','Sun'], result:'Sacrifice', description:'', source:'canon'},
  {essences:['Dimension','Knife','Sin'], result:'Sacrifice', description:'', source:'canon'},
  {essences:['Knowledge','Paper','Serene'], result:'Scribe', description:'', source:'canon'},
  {essences:['Hand','Paper','Rune'], result:'Scribe', description:'', source:'canon'},
  {essences:['Fire','Iron','Snake'], result:'Serpent', description:'', source:'canon'},
  {essences:['Fire','Snake','Wind'], result:'Serpent', description:'', source:'canon'},
  {essences:['Fire','Snake','Water'], result:'Serpent', description:'', source:'canon'},
  {essences:['Paper','Sword','Visage'], result:'Simulacrum', description:'', source:'canon'},
  {essences:['Adept','Bow','Hunt'], result:'Skirmish', description:'', source:'canon'},
  {essences:['Moon','Star','Sun'], result:'Sky', description:'', source:'canon'},
  {essences:['Star','Sun','Vast'], result:'Sky', description:'', source:'canon'},
  {essences:['Cloud','Swift','Wind'], result:'Sky', description:'', source:'canon'},
  {essences:['Swift','Vehicle','Wind'], result:'Soaring', description:'', source:'canon'},
  {essences:['Bird','Swift','Wind'], result:'Soaring', description:'', source:'canon'},
  {essences:['Ship','Water','Wind'], result:'Soaring', description:'', source:'canon'},
  {essences:['Flesh','Magic','Thread'], result:'Sovereign', description:'', source:'canon'},
  {essences:['Dark','Sin','Water'], result:'Sovereign', description:'', source:'canon'},
  {essences:['Adept','Potent','Sceptre'], result:'Sovereign', description:'', source:'canon'},
  {essences:['Adept','Balance','Potent'], result:'Sovereign', description:'', source:'canon'},
  {essences:['Dark','Star','Sun'], result:'Stellar', description:'', source:'canon'},
  {essences:['Lightning','Potent','Wind'], result:'Storm', description:'', source:'canon'},
  {essences:['Deep','Vast','Wind'], result:'Storm', description:'', source:'canon'},
  {essences:['Fire','Potent','Wind'], result:'Storm', description:'', source:'canon'},
  {essences:['Lightning','Magic','Wind'], result:'Storm', description:'', source:'canon'},
  {essences:['Cloud','Crystal','Wind'], result:'Storm', description:'', source:'canon'},
  {essences:['Dust','Ice','Wind'], result:'Storm', description:'', source:'canon'},
  {essences:['Hammer','Lightning','Rune'], result:'Storm', description:'', source:'canon'},
  {essences:['Fire','Gun','Lightning'], result:'Storm', description:'', source:'canon'},
  {essences:['Sand','Vast','Wind'], result:'Storm', description:'', source:'canon'},
  {essences:['Earth','Fire','Wind'], result:'Storm', description:'', source:'canon'},
  {essences:['Flesh','Sin','Visage'], result:'Succubus', description:'Restricted in this campaign.', source:'canon', banned:true},
  {essences:['Hunger','Magic','Sin'], result:'Succubus', description:'', source:'canon'},
  {essences:['Bat','Rabbit','Rat'], result:'Swarm', description:'', source:'canon'},
  {essences:['Dark','Fire','Rat'], result:'Swarm', description:'', source:'canon'},
  {essences:['Fire','Venom','Wasp'], result:'Swarm', description:'', source:'canon'},
  {essences:['Potent','Venom','Wasp'], result:'Swarm', description:'', source:'canon'},
  {essences:['Duck','Flea','Foot'], result:'Swarm', description:'', source:'canon'},
  {essences:['Blood','Myriad','Wing'], result:'Swarm', description:'', source:'canon'},
  {essences:['Magic','Paper','Rune'], result:'Talisman', description:'', source:'canon'},
  {essences:['Bird','Lightning','Vast'], result:'Thunderbird', description:'', source:'canon'},
  {essences:['Dimension','Vast','Void'], result:'Time', description:'', source:'canon'},
  {essences:['Balance','Dimension','Swift'], result:'Time', description:'', source:'canon'},
  {essences:['Balance','Moon','Water'], result:'Tranquil', description:'', source:'canon'},
  {essences:['Corrupt','Death','Serene'], result:'Tranquil', description:'', source:'canon'},
  {essences:['Serene','Tree','Vast'], result:'Tranquil', description:'', source:'canon'},
  {essences:['Deer','Earth','Hammer'], result:'Transfiguration', description:'', source:'canon'},
  {essences:['Bear','Growth','Hand'], result:'Transfiguration', description:'', source:'canon'},
  {essences:['Adept','Elemental','Magic'], result:'Transfiguration', description:'', source:'canon'},
  {essences:['Balance','Earth','Iron'], result:'Transfiguration', description:'', source:'canon'},
  {essences:['Flesh','Growth','Water'], result:'Transfiguration', description:'', source:'canon'},
  {essences:['Bird','Mouse','Whale'], result:'Transfiguration', description:'', source:'canon'},
  {essences:['Hunt','Moon','Wolf'], result:'Transfiguration', description:'', source:'canon'},
  {essences:['Blood','Fire','Iron'], result:'Transfiguration', description:'', source:'canon'},
  {essences:['Axe','Bear','Moon'], result:'Transfiguration', description:'', source:'canon'},
  {essences:['Hunger','Moon','Wolf'], result:'Transfiguration', description:'Restricted in this campaign - shares a name with other Transfiguration combinations above, worth double-checking with your group.', source:'canon', banned:true},
  {essences:['Balance','Fire','Ice'], result:'Transfiguration', description:'', source:'canon'},
  {essences:['Death','Dimension','Magic'], result:'Transgression', description:'', source:'canon'},
  {essences:['Blood','Might','Renewal'], result:'Troll', description:'', source:'canon'},
  {essences:['Moon','Omen','Wind'], result:'Twilight', description:'', source:'canon'},
  {essences:['Dark','Light','Moon'], result:'Twilight', description:'', source:'canon'},
  {essences:['Corrupt','Dance','Flesh'], result:'Undeath', description:'', source:'canon'},
  {essences:['Death','Magic','Sand'], result:'Undeath', description:'', source:'canon'},
  {essences:['Blood','Death','Spider'], result:'Undeath', description:'', source:'canon'},
  {essences:['Bone','Corrupt','Dance'], result:'Undeath', description:'', source:'canon'},
  {essences:['Blood','Death','Duck'], result:'Undeath', description:'', source:'canon'},
  {essences:['Death','Flesh','Hunger'], result:'Undeath', description:'', source:'canon'},
  {essences:['Blood','Death','Wolf'], result:'Undeath', description:'', source:'canon'},
  {essences:['Blood','Death','Snake'], result:'Undeath', description:'', source:'canon'},
  {essences:['Blood','Death','Hunger'], result:'Undeath', description:'', source:'canon'},
  {essences:['Bone','Corrupt','Flesh'], result:'Undeath', description:'', source:'canon'},
  {essences:['Bat','Blood','Death'], result:'Undeath', description:'', source:'canon'},
  {essences:['Blood','Death','Visage'], result:'Undeath', description:'', source:'canon'},
  {essences:['Blood','Corrupt','Dark'], result:'Undeath', description:'', source:'canon'},
  {essences:['Blood','Bone','Corrupt'], result:'Undeath', description:'', source:'canon'},
  {essences:['Blood','Dark','Death'], result:'Undeath', description:'', source:'canon'},
  {essences:['Blood','Death','Sin'], result:'Undeath', description:'', source:'canon'},
  {essences:['Blood','Death','Moon'], result:'Undeath', description:'', source:'canon'},
  {essences:['Blood','Death','Hunt'], result:'Undeath', description:'', source:'canon'},
  {essences:['Mirror','Myriad','Technology'], result:'Unity', description:'', source:'canon'},
  {essences:['Earth','Plant','Vast'], result:'Verdant', description:'', source:'canon'},
  {essences:['Earth','Shovel','Water'], result:'Verdant', description:'', source:'canon'},
  {essences:['Earth','Plant','Rake'], result:'Verdant', description:'', source:'canon'},
  {essences:['Duck','Iron','Vast'], result:'Vessel', description:'', source:'canon'},
  {essences:['Balance','Blood','Hunger'], result:'Vessel', description:'', source:'canon'},
  {essences:['Balance','Life','Needle'], result:'Vessel', description:'', source:'canon'},
  {essences:['Technology','Vehicle','Wind'], result:'Vessel', description:'', source:'canon'},
  {essences:['Knowledge','Technology','Vast'], result:'Vessel', description:'', source:'canon'},
  {essences:['Cloud','Growth','Vehicle'], result:'Vessel', description:'', source:'canon'},
  {essences:['Iron','Sin','Wind'], result:'Vessel', description:'', source:'canon'},
  {essences:['Gathering','Magic','Star'], result:'Vessel', description:'', source:'canon'},
  {essences:['Death','Vehicle','Water'], result:'Vessel', description:'', source:'canon'},
  {essences:['Rat','Swift','Water'], result:'Vessel', description:'', source:'canon'},
  {essences:['Dimension','Vast','Vehicle'], result:'Vessel', description:'', source:'canon'},
  {essences:['Balance','Blood','Crystal'], result:'Vessel', description:'', source:'canon'},
  {essences:['Duck','Iron','Visage'], result:'Vessel', description:'', source:'canon'},
  {essences:['Crystal','Magic','Potent'], result:'Vessel', description:'', source:'canon'},
  {essences:['Dark','Omen','Serene'], result:'Vision', description:'', source:'canon'},
  {essences:['Eye','Magic','Mirror'], result:'Vision', description:'', source:'canon'},
  {essences:['Earth','Fire','Potent'], result:'Volcano', description:'', source:'canon'},
  {essences:['Earth','Fire','Vast'], result:'Volcano', description:'', source:'canon'},
  {essences:['Shark','Water','Wind'], result:'Vortex', description:'', source:'canon'},
  {essences:['Trap','Void','Wind'], result:'Vortex', description:'', source:'canon'},
  {essences:['Deep','Vast','Void'], result:'Vortex', description:'', source:'canon'},
  {essences:['Corrupt','Dimension','Void'], result:'Vortex', description:'', source:'canon'},
  {essences:['Dimension','Hunger','Void'], result:'Vortex', description:'', source:'canon'},
  {essences:['Feast','Magic','Void'], result:'Vortex', description:'', source:'canon'},
  {essences:['Dark','Void','Wind'], result:'Vortex', description:'', source:'canon'},
  {essences:['Dance','Needle','Thread'], result:'Weave', description:'', source:'canon'},
  {essences:['Harmonic','Myriad','Omen'], result:'Weave', description:'', source:'canon'},
  {essences:['Dance','Myriad','Thread'], result:'Weave', description:'', source:'canon'},
  {essences:['Flesh','Hunger','Might'], result:'Wendigo', description:'Restricted in this campaign.', source:'canon', banned:true},
  {essences:['Balance','Blood','Might'], result:'Wrath', description:'', source:'canon'},
  {essences:['Might','Potent','Zeal'], result:'Wrath', description:'', source:'canon'},
  {essences:['Fire','Light','Potent'], result:'Wrath', description:'', source:'canon'},
  {essences:['Adept','Fire','Zeal'], result:'Wrath', description:'', source:'canon'},
  {essences:['Fire','Light','Zeal'], result:'Wrath', description:'', source:'canon'},
  {essences:['Dimension','Light','Potent'], result:'Wrath', description:'', source:'canon'},
  {essences:['Balance','Might','Zeal'], result:'Wrath', description:'', source:'canon'},
  {essences:['Balance','Potent','Zeal'], result:'Wrath', description:'', source:'canon'},
  {essences:['Bird','Vast','Wind'], result:'Ziz', description:'', source:'canon'},
];

// --- Type-based automatic resistance/vulnerability/boon rules ---
// Each rule returns an array of damage-profile entries to suggest for a matching monster.
// These are house rules from the campaign's monster revamp notes; edit this array to add more.
const TYPE_RULES = [
  {
    id: 'undead-radiant', label: 'Undead are vulnerable to radiant',
    test: m => m.type === 'Undead',
    build: () => [{ damageType:'Radiant', category:'vulnerability', mode:'double', note:'All undead' }]
  },
  {
    id: 'undead-fire-weakness', label: 'Most undead take extra fire damage',
    test: m => m.type === 'Undead',
    build: () => [{ damageType:'Fire', category:'weakness', extraDamage:5, note:'Most undead take +5 fire damage (from your Monster Revamp notes)' }]
  },
  {
    id: 'giant-nonmagical', label: 'Giants resist nonmagical bludgeoning/piercing/slashing',
    test: m => m.type === 'Giant',
    build: () => ['Bludgeoning (nonmagical)','Piercing (nonmagical)','Slashing (nonmagical)'].map(dt => (
      { damageType:dt, category:'resistance', mode:'halved', note:'A normal-sized weapon barely scratches something this big' }
    ))
  },
  {
    id: 'shapechanger-silver', label: 'Shapechangers are vulnerable to silver',
    test: m => (m.tags||[]).includes('Shapechanger'),
    build: () => [{ damageType:'Silver', category:'vulnerability', mode:'double', note:'Moon metal' }]
  },
  {
    id: 'fey-iron', label: 'Fey are vulnerable to cold iron',
    test: m => m.type === 'Fey',
    build: () => [{ damageType:'Cold Iron', category:'vulnerability', mode:'double', note:'Fairy-tale iron' }]
  },
  {
    id: 'construct-adamantine', label: 'Constructs & structures are vulnerable to adamantine',
    test: m => m.type === 'Construct' || (m.tags||[]).includes('Structure'),
    build: () => [{ damageType:'Adamantine', category:'vulnerability', mode:'double', note:'Hard as diamond, cuts through anything inanimate' }]
  },
  {
    id: 'fiend-celestial-orichalcum', label: 'Fiends & celestials are vulnerable to orichalcum',
    test: m => m.type === 'Fiend' || m.type === 'Celestial',
    build: () => [{ damageType:'Orichalcum', category:'vulnerability', mode:'double', note:'Rare red metal that disrupts outsiders' }]
  },
  {
    id: 'elemental-cycle', label: 'Elementals are vulnerable to the next damage type in the elemental cycle',
    test: m => m.type === 'Elemental' && ELEMENTAL_ALIGNMENTS.includes(m.elementalAlignment),
    build: m => {
      const cycle = { Cold:'Fire', Fire:'Water', Water:'Lightning', Lightning:'Earth', Earth:'Cold' };
      const vuln = cycle[m.elementalAlignment];
      return vuln ? [{ damageType:vuln, category:'vulnerability', mode:'double', note:'Elemental cycle: '+m.elementalAlignment+' is weak to '+vuln }] : [];
    }
  },
  {
    id: 'psychic-aligned', label: 'Psychic-aligned creatures are vulnerable to shadow',
    test: m => (m.tags||[]).includes('Psychic-Aligned'),
    build: () => [{ damageType:'Shadow', category:'vulnerability', mode:'double', note:'The hidden war: light of knowledge vs. darkness of secrets' }]
  },
  {
    id: 'shadow-aligned', label: 'Shadow-aligned creatures are vulnerable to psychic',
    test: m => (m.tags||[]).includes('Shadow-Aligned'),
    build: () => [{ damageType:'Psychic', category:'vulnerability', mode:'double', note:'The hidden war' }]
  },
  {
    id: 'void-universal', label: 'Everything is vulnerable to void unless immune',
    test: m => !(m.tags||[]).includes('Void-Immune'),
    build: () => [{ damageType:'Void', category:'vulnerability', mode:'double', note:'Space, black holes, disintegration - almost never worth statting explicitly' }]
  }
];

function computeTypeDefaults(monster){
  const out = [];
  TYPE_RULES.forEach(rule => { if(rule.test(monster)) out.push(...rule.build(monster).map(e => ({...e, source:'auto', ruleId:rule.id}))); });
  return out;
}
function getEffectiveProfile(monster){
  const manual = monster.damageProfile || [];
  const auto = computeTypeDefaults(monster).filter(a => !manual.some(mm => mm.damageType === a.damageType && mm.category === a.category));
  return [...manual, ...auto];
}

/* ============================== STATE ============================== */

let state = {
  activeTab: 'overview',
  damageTypes: [...DEFAULT_DAMAGE_TYPES],
  creatureTypes: [...DEFAULT_CREATURE_TYPES],
  commonTags: [...DEFAULT_TAGS],
  essences: buildEssenceList(),
  confluenceCombos: [...CANON_CONFLUENCE],
  damageProperties: buildSeedDamageProperties(),
  monsters: buildSeedMonsters(),
  characters: [],
  encounter: { combatants: [], round: 1, activeIndex: -1, tyrannyOfRank: false },
  editingMonsterId: null,
  draftMonster: null,
  editingCharacterId: null,
  draftCharacter: null,
  editingPropertyId: null,
  draftProperty: null,
  variantOfId: null
};

function uid(){ return 'id'+Date.now().toString(36)+Math.random().toString(36).slice(2,8); }
function h(s){ return (s===undefined||s===null)?'':String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function tierIndex(t){ return TIERS.indexOf(t); }

function blankMonster(){
  return {
    id: uid(), name:'', type:'Beast', subtypes:'', tags:[], elementalAlignment:'', tier:'Iron', cr:'',
    size:'Medium', alignment:'', ac:'', hp:'', hpFormula:'', speed:'30 ft.',
    abilities:{str:10,dex:10,con:10,int:10,wis:10,cha:10},
    savingThrows:'', skills:'', senses:'', languages:'', proficiencyBonus:'+2',
    damageProfile:[], conditionImmunities:'',
    traits:[], actions:[], bonusActions:[], reactions:[], legendaryActions:[],
    environment:'', notes:'', loot:'',
    status:'ready', importWarnings:[], variantOf:''
  };
}
// Reusable named weakness/resistance/vulnerability/boon templates, matching how your own
// Monster Revamp notes track them ("Resonating Force resistance", "Piercing Boon", etc. as
// named properties applied to multiple monsters, not just one-off table rows).
function buildSeedDamageProperties(){
  return [
    {id: uid(), name:'Resonating Force resistance', damageType:'Resonating Force', category:'resistance', mode:'halved', extraDamage:'', note:'Replaces old Acid/Fire/Lightning/Thunder/nonmagical-attack resistances.'},
    {id: uid(), name:'Disruptive Force weakness', damageType:'Disruptive Force', category:'weakness', extraDamage:'', note:'Disables 1 ethereal ability for a round.'},
    {id: uid(), name:'Piercing Boon', damageType:'Piercing', category:'boon', mode:'', extraDamage:'', note:"+1 damage on this creature's melee attacks per instance of piercing damage currently stuck in it (arrows, etc.) - track by hand."},
    {id: uid(), name:'Undead Fire Weakness', damageType:'Fire', category:'weakness', extraDamage:5, note:'Most undead take +5 fire damage.'}
  ];
}
// Two example monsters seeded straight from your Monster Revamp notes (Ghost, Zombie),
// so there's something real in the bestiary to test the tool against. Edit or delete freely.
function buildSeedMonsters(){
  return [
    {
      id: uid(), name:'Ghost', type:'Undead', subtypes:'', tags:['Ethereal'], elementalAlignment:'', tier:'Silver', cr:'4',
      size:'Medium', alignment:'any alignment', ac:'11', hp:'45', hpFormula:'10d8', speed:'0 ft., fly 40 ft. (hover)',
      abilities:{str:7,dex:13,con:10,int:10,wis:12,cha:17},
      savingThrows:'', skills:'', senses:'darkvision 60 ft., passive Perception 11', languages:'any languages it knew in life',
      proficiencyBonus:'+2',
      damageProfile:[
        {damageType:'Resonating Force', category:'resistance', mode:'halved', note:'Replaces the old Acid/Fire/Lightning/Thunder/nonmagical-attack resistances from the stock 5e ghost.', source:'manual'},
        {damageType:'Disruptive Force', category:'weakness', extraDamage:'', note:'Disables 1 ethereal ability for a round.', source:'manual'},
        {damageType:'Necrotic', category:'immunity', mode:'', note:'', source:'manual'},
        {damageType:'Poison', category:'immunity', mode:'', note:'', source:'manual'}
      ],
      conditionImmunities:'Charmed, Frightened, Grappled, Paralyzed, Petrified, Prone, Restrained',
      traits:[
        {name:'Incorporeal Movement', text:"The ghost can move through other creatures and objects as if they were difficult terrain. It takes 5 (1d10) force damage if it ends its turn inside an object."},
        {name:'Etherealness', text:"The ghost can enter the Ethereal Plane from the Material Plane, and vice versa. It is visible on the Material Plane while on the Ethereal Plane, and vice versa, but can't affect or be affected by anything on the other plane."}
      ],
      actions:[{name:'Withering Touch', text:'Melee Spell Attack: +5 to hit, reach 5 ft., one target. Hit: 17 (4d6+3) necrotic damage.'}],
      bonusActions:[], reactions:[], legendaryActions:[],
      environment:'', notes:'Seeded from your Monster Revamp notes as an example - edit or delete freely.', loot:'',
      status:'ready', importWarnings:[], variantOf:''
    },
    {
      id: uid(), name:'Zombie', type:'Undead', subtypes:'', tags:[], elementalAlignment:'', tier:'Iron', cr:'1/4',
      size:'Medium', alignment:'neutral evil', ac:'8', hp:'22', hpFormula:'3d8+9', speed:'20 ft.',
      abilities:{str:13,dex:6,con:16,int:3,wis:6,cha:5},
      savingThrows:'', skills:'', senses:'darkvision 60 ft., passive Perception 8', languages:"understands the languages it knew in life but can't speak",
      proficiencyBonus:'+2',
      damageProfile:[
        {damageType:'Piercing (magical)', category:'boon', mode:'', note:"+1 damage on this zombie's melee attacks for each instance of piercing damage currently stuck in it (arrows, etc.) - track this by hand.", source:'manual'},
        {damageType:'Piercing (nonmagical)', category:'boon', mode:'', note:'Same as above.', source:'manual'},
        {damageType:'Slashing (magical)', category:'vulnerability', mode:'double', note:'Homebrew: zombies fall apart when slashed.', source:'manual'},
        {damageType:'Slashing (nonmagical)', category:'vulnerability', mode:'double', note:'Homebrew: zombies fall apart when slashed.', source:'manual'},
        {damageType:'Poison', category:'immunity', mode:'', note:'', source:'manual'}
      ],
      conditionImmunities:'Poisoned',
      traits:[{name:'Undead Fortitude', text:"If damage reduces the zombie to 0 hit points, it must make a Constitution saving throw with a DC of 5 + the damage taken, unless the damage is radiant or from a critical hit. On a success, the zombie drops to 1 hit point instead."}],
      actions:[{name:'Slam', text:'Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 4 (1d6+1) bludgeoning damage.'}],
      bonusActions:[], reactions:[], legendaryActions:[],
      environment:'', notes:'Seeded as an example - the Fire weakness and Radiant vulnerability are not listed manually here on purpose. Open this monster in the builder and click "Suggest type defaults" to see them pulled in automatically from the Undead type rules.', loot:'',
      status:'ready', importWarnings:[], variantOf:''
    }
  ];
}
function blankCharacter(){
  return {
    // HWFWM-style: 3 essences are chosen, their combination produces a 4th (confluence) essence.
    id: uid(), name:'', player:'', essences:['','',''], essenceTiers:['Iron','Iron','Iron'],
    confluenceEssence:'', confluenceTier:'Iron', powersNotes:'', generalNotes:''
  };
}

/* ============================== PERSISTENCE ============================== */

function exportData(){
  const dump = {
    damageTypes: state.damageTypes, creatureTypes: state.creatureTypes, commonTags: state.commonTags,
    confluenceCombos: state.confluenceCombos, damageProperties: state.damageProperties,
    monsters: state.monsters, characters: state.characters,
    exportedAt: new Date().toISOString()
  };
  const blob = new Blob([JSON.stringify(dump, null, 2)], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'campaign-manager-data.json'; a.click();
  URL.revokeObjectURL(url);
}
function importData(evt){
  const file = evt.target.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try{
      const data = JSON.parse(reader.result);
      if(data.damageTypes) state.damageTypes = data.damageTypes;
      if(data.creatureTypes) state.creatureTypes = data.creatureTypes;
      if(data.commonTags) state.commonTags = data.commonTags;
      if(data.confluenceCombos) state.confluenceCombos = data.confluenceCombos;
      if(data.damageProperties) state.damageProperties = data.damageProperties;
      if(data.monsters) state.monsters = data.monsters;
      if(data.characters) state.characters = data.characters;
      render();
      alert('Import complete.');
    }catch(e){ alert('Could not read that file as campaign JSON: '+e.message); }
  };
  reader.readAsText(file);
  evt.target.value = '';
}

/* ============================== FOUNDRY VTT IMPORT ============================== */
// Best-effort importer for Foundry VTT dnd5e actor data. Foundry's schema has shifted across
// versions (pre-v10 used `data`, v10+ uses `system`) and compendium packs can come as a single
// JSON array, an NDJSON/.db file (one JSON doc per line - the classic NeDB format), or a raw
// LevelDB folder (binary - can't be parsed in a browser; export that to JSON/NDJSON from Foundry
// first, e.g. with a macro that reads the pack and writes out `pack.getDocuments()`).
// Nothing is silently dropped: anything the mapper can't confidently place gets a warning and the
// raw source JSON is tucked into the monster's Notes field so you can cross-check by hand.

const FOUNDRY_SIZE_MAP = {tiny:'Tiny', sm:'Small', med:'Medium', lg:'Large', huge:'Huge', grg:'Gargantuan'};
const FOUNDRY_DAMAGE_MAP = {
  acid:'Acid', bludgeoning:'Bludgeoning', piercing:'Piercing', slashing:'Slashing',
  cold:'Cold', fire:'Fire', force:'Force', lightning:'Lightning', necrotic:'Necrotic',
  poison:'Poison', psychic:'Psychic', radiant:'Radiant', thunder:'Thunder',
  physical:'Bludgeoning'
};
const FOUNDRY_MOVEMENT_KEYS = ['walk','burrow','climb','fly','swim'];

function stripHtml(str){
  if(!str) return '';
  return String(str).replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g,' ').replace(/\s+/g,' ').trim();
}

function importFoundryFile(evt){
  const file = evt.target.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const {monsters, warnings, total} = parseFoundryData(reader.result);
      if(!monsters.length){
        alert('No importable NPC actors found in that file. '+(warnings[0]||'')+'\n\nIf this came from a raw Foundry compendium (LevelDB) folder, export it to JSON/NDJSON first - a browser can\'t read the binary pack format directly.');
        return;
      }
      state.monsters.push(...monsters);
      render();
      const dupeNames = monsters.filter(m => state.monsters.filter(x => x.name===m.name).length>1).length;
      let msg = 'Imported '+monsters.length+' of '+total+' entries into the conversion queue (Bestiary -> filter "Needs conversion").';
      if(dupeNames) msg += '\n'+dupeNames+' share a name with something already in your bestiary - worth a look.';
      if(warnings.length) msg += '\n\n'+warnings.length+' warning(s), e.g.:\n- '+warnings.slice(0,5).join('\n- ');
      alert(msg);
    } catch(e){
      alert('Could not read that as a Foundry export: '+e.message+'\n\nExpected a JSON array/object of actor documents, or an NDJSON (.db) file with one JSON document per line.');
    }
  };
  reader.readAsText(file);
  evt.target.value = '';
}

function parseFoundryData(text){
  let docs = [];
  try {
    const parsed = JSON.parse(text);
    docs = normalizeFoundryDocs(parsed);
  } catch(e){
    // Not a single JSON value - try NDJSON / classic NeDB .db (one JSON object per line).
    docs = text.split('\n').map(line => line.trim()).filter(Boolean).map(line => {
      try { return JSON.parse(line); } catch(e2){ return null; }
    }).filter(Boolean);
  }
  const npcDocs = docs.filter(isLikelyActorDoc);
  const warnings = [];
  const monsters = [];
  npcDocs.forEach((doc, i) => {
    try {
      const m = foundryActorToMonster(doc);
      monsters.push(m);
      if(m.importWarnings.length) warnings.push('"'+(m.name||'#'+i)+'": '+m.importWarnings.join('; '));
    } catch(e){
      warnings.push('Entry #'+i+' ('+(doc && doc.name || 'unnamed')+') failed to import: '+e.message);
    }
  });
  if(docs.length && !npcDocs.length){
    warnings.push('Found '+docs.length+' document(s) but none looked like NPC actors (expected type "npc" with hp/ac data).');
  }
  return {monsters, warnings, total: docs.length};
}

function normalizeFoundryDocs(parsed){
  if(Array.isArray(parsed)) return parsed;
  if(parsed && Array.isArray(parsed.actors)) return parsed.actors;
  if(parsed && Array.isArray(parsed.docs)) return parsed.docs;
  if(parsed && Array.isArray(parsed.entries)) return parsed.entries;
  if(parsed && Array.isArray(parsed.documents)) return parsed.documents;
  if(parsed && (parsed.system || parsed.data) && parsed.name) return [parsed]; // single actor
  if(parsed && typeof parsed === 'object') return Object.values(parsed).filter(v => v && typeof v==='object');
  return [];
}
function isLikelyActorDoc(doc){
  if(!doc || typeof doc!=='object') return false;
  const sys = doc.system || doc.data;
  if(doc.type && doc.type!=='npc' && doc.type!=='character') return false;
  return !!(sys && (sys.attributes && (sys.attributes.hp || sys.attributes.ac)));
}

function foundryActorToMonster(doc){
  const warnings = [];
  const sys = doc.system || doc.data || {};
  const details = sys.details || {};
  const attrs = sys.attributes || {};
  const traits = sys.traits || {};
  const abilitiesSrc = sys.abilities || {};

  const m = blankMonster();
  m.name = doc.name || 'Imported Monster';
  m.status = 'queued';

  // Type
  const rawType = (details.type && (details.type.value || details.type.custom)) || doc.type || '';
  const typeTitled = rawType ? rawType.charAt(0).toUpperCase()+rawType.slice(1) : '';
  if(typeTitled && state.creatureTypes.includes(typeTitled)) m.type = typeTitled;
  else if(typeTitled){ m.type = 'Beast'; warnings.push('Unrecognized creature type "'+rawType+'" - defaulted to Beast, fix in the builder'); }
  if(details.type && details.type.subtype) m.subtypes = details.type.subtype;

  m.cr = details.cr!=null ? String(details.cr) : '';
  m.alignment = details.alignment || '';
  m.size = FOUNDRY_SIZE_MAP[traits.size] || traits.size || 'Medium';

  m.ac = (attrs.ac && (attrs.ac.value!=null ? attrs.ac.value : attrs.ac.flat)) ?? '';
  m.hp = attrs.hp ? (attrs.hp.max ?? attrs.hp.value ?? '') : '';
  m.hpFormula = (attrs.hp && attrs.hp.formula) || '';

  if(attrs.movement){
    const parts = FOUNDRY_MOVEMENT_KEYS
      .filter(k => attrs.movement[k])
      .map(k => (k==='walk' ? '' : k+' ') + attrs.movement[k] + ' ' + (attrs.movement.units||'ft.'));
    m.speed = parts.length ? parts.join(', ') : (attrs.movement.walk ? attrs.movement.walk+' ft.' : '');
  }

  ['str','dex','con','int','wis','cha'].forEach(a => {
    if(abilitiesSrc[a] && abilitiesSrc[a].value!=null) m.abilities[a] = abilitiesSrc[a].value;
  });
  // Proficiency bonus: newer dnd5e (the 2024-rules "Activities" data model) usually doesn't store
  // this on the actor at all - it's derived from CR at runtime. Fall back to the standard CR table.
  if(attrs.prof!=null){
    m.proficiencyBonus = (attrs.prof>=0?'+':'')+attrs.prof;
  } else if(details.cr!=null){
    const cr = Number(details.cr);
    const prof = cr>=29?9:cr>=25?8:cr>=21?7:cr>=17?6:cr>=13?5:cr>=9?4:cr>=5?3:2;
    m.proficiencyBonus = '+'+prof;
  }

  // Senses: older Foundry data models kept this under system.traits.senses; the current model
  // (v13+) moved it to system.attributes.senses as {ranges:{darkvision,blindsight,...}, units, special}.
  const sensesObj = attrs.senses || traits.senses;
  if(sensesObj){
    if(typeof sensesObj === 'string') m.senses = sensesObj;
    else if(sensesObj.ranges){
      const parts = Object.entries(sensesObj.ranges).filter(([,v]) => v).map(([k,v]) => k+' '+v+' '+(sensesObj.units||'ft.'));
      if(sensesObj.special) parts.push(sensesObj.special);
      m.senses = parts.join(', ');
    } else {
      m.senses = stripHtml(JSON.stringify(sensesObj));
      warnings.push('Senses were in an unrecognized shape - imported as raw text, double check it');
    }
  }
  if(traits.languages){
    const langVal = traits.languages.value || [];
    const langCustom = traits.languages.custom || '';
    m.languages = [...langVal, langCustom].filter(Boolean).join(', ');
  }
  if(traits.ci && traits.ci.value && traits.ci.value.length){
    m.conditionImmunities = traits.ci.value.map(c => c.charAt(0).toUpperCase()+c.slice(1)).join(', ');
  }
  if(traits.dm && traits.dm.amount && Object.keys(traits.dm.amount).length){
    warnings.push('This actor has custom damage modifiers (system.traits.dm) - not imported, they don\'t map to a simple resistance/vulnerability, check the raw source below');
  }

  // Damage resistances/immunities/vulnerabilities. `value` holds known codes, `custom` is free text
  // (semicolon-separated in Foundry). `bypasses` (when present) usually means "nonmagical only".
  const mapDamageTrait = (traitObj, category, mode) => {
    if(!traitObj) return;
    const nonmagicalOnly = Array.isArray(traitObj.bypasses) && traitObj.bypasses.length>0;
    (traitObj.value||[]).forEach(code => {
      let dt = FOUNDRY_DAMAGE_MAP[code] || (code.charAt(0).toUpperCase()+code.slice(1));
      if(nonmagicalOnly && ['Bludgeoning','Piercing','Slashing'].includes(dt)) dt += ' (nonmagical)';
      if(!state.damageTypes.includes(dt)){ state.damageTypes.push(dt); }
      m.damageProfile.push({damageType:dt, category, mode, note:'', source:'manual'});
    });
    if(traitObj.custom){
      String(traitObj.custom).split(';').map(s=>s.trim()).filter(Boolean).forEach(custom => {
        m.damageProfile.push({damageType:custom, category, mode, note:'Imported as free text from Foundry - not a standard damage type, review.', source:'manual'});
        warnings.push('Custom '+category+' text "'+custom+'" imported as-is, may need converting to your damage type list');
      });
    }
  };
  mapDamageTrait(traits.dr, 'resistance', 'halved');
  mapDamageTrait(traits.di, 'immunity', '');
  mapDamageTrait(traits.dv, 'vulnerability', 'double');

  // Items -> traits/actions/bonus actions/reactions/legendary actions, by activation type.
  // Older Foundry data models stored a flat system.activation.type on the item. The current
  // "Activities" model (dnd5e v4+/2024 rules) nests one or more activities under
  // system.activities.<id>.activation.type instead - fall back to the first one found there.
  (doc.items||[]).forEach(item => {
    const isys = item.system || item.data || {};
    const text = stripHtml(isys.description && isys.description.value);
    const entry = {name: item.name || 'Unnamed', text: text || '(no description)'};
    let actType = isys.activation && isys.activation.type;
    if(!actType && isys.activities){
      const found = Object.values(isys.activities).map(a => a && a.activation && a.activation.type).find(Boolean);
      if(found) actType = found;
    }
    if(item.type==='weapon' || actType==='action') m.actions.push(entry);
    else if(actType==='legendary') m.legendaryActions.push(entry);
    else if(actType==='reaction') m.reactions.push(entry);
    else if(actType==='bonus') m.bonusActions.push(entry);
    else if(item.type==='feat' || !actType) m.traits.push(entry);
    else { m.traits.push(entry); warnings.push('Item "'+item.name+'" had an unfamiliar activation type ('+actType+') - filed under Traits, move it if needed'); }
  });

  if(m.ac==='' && attrs.ac && attrs.ac.calc && attrs.ac.calc!=='flat'){
    warnings.push('AC uses calc mode "'+attrs.ac.calc+'" and was not stored as a fixed number in the export (Foundry computes it live) - fill it in by hand');
  } else if(!m.ac){
    warnings.push('No AC found');
  }
  if(!m.hp) warnings.push('No HP found - check this actor came from the dnd5e system and the file is not truncated');

  m.importWarnings = warnings;
  const rawSnippet = JSON.stringify(doc).slice(0, 4000);
  m.notes = 'Imported from Foundry VTT - needs conversion to your homebrew rules.'
    + (warnings.length ? '\n\nImport warnings:\n- '+warnings.join('\n- ') : '')
    + '\n\nRaw source (truncated, for cross-checking anything the importer missed):\n' + rawSnippet;
  return m;
}

/* ============================== DAMAGE RESOLUTION ============================== */

function resolveDamage(profile, damageType, amount, attackerTierIdx, defenderTierIdx, tyrannyOn){
  const log = [];
  let dmg = amount;
  const imm = profile.find(p => p.damageType===damageType && p.category==='immunity');
  if(imm){ log.push('Immune to '+damageType+' -> 0 damage.'); return {amount:0, log}; }
  const vuln = profile.find(p => p.damageType===damageType && p.category==='vulnerability');
  const res = profile.find(p => p.damageType===damageType && p.category==='resistance');
  if(vuln){
    if(vuln.mode==='negatesResistance'){ log.push('Vulnerable to '+damageType+' - negates any resistance, normal damage.'); }
    else { dmg = dmg*2; log.push('Vulnerable to '+damageType+' - damage doubled.'); }
  } else if(res){
    if(res.mode==='boon'){ log.push('Resistant (boon form) to '+damageType+' - full damage, but boon triggers: '+(res.note||'see stat block')+'.'); }
    else { dmg = Math.floor(dmg/2); log.push('Resistant to '+damageType+' - damage halved.'); }
  }
  const weak = profile.find(p => p.damageType===damageType && p.category==='weakness' && Number(p.extraDamage));
  if(weak){ const extra = Number(weak.extraDamage)||0; dmg += extra; log.push('Weakness: +'+extra+' extra '+damageType+' damage'+(weak.note?' ('+weak.note+')':'')+'.'); }
  const boon = profile.find(p => p.damageType===damageType && p.category==='boon');
  if(boon){ log.push('Boon triggers: '+(boon.note||'see stat block')+'.'); }
  if(tyrannyOn && attackerTierIdx!=null && attackerTierIdx>=0 && defenderTierIdx!=null && defenderTierIdx>=0){
    const diff = defenderTierIdx - attackerTierIdx;
    if(diff>=2){ dmg=0; log.push('Tyranny of Rank: attacker is 2+ tiers below defender - negligible, 0 damage (override if wrong).'); }
    else if(diff===1){ dmg=Math.floor(dmg/2); log.push('Tyranny of Rank: attacker is 1 tier below defender - damage halved.'); }
  }
  return {amount:dmg, log};
}

/* ============================== RENDER SHELL ============================== */

const TABS = [
  {id:'overview', label:'Overview'},
  {id:'bestiary', label:'Bestiary'},
  {id:'builder', label:'Monster Builder'},
  {id:'essences', label:'Essences'},
  {id:'combat', label:'Combat Tracker'}
];

function render(){
  const nav = document.getElementById('tab-nav');
  nav.innerHTML = TABS.map(t => `<button class="${state.activeTab===t.id?'active':''}" onclick="setTab('${t.id}')">${t.label}</button>`).join('');
  const main = document.getElementById('tab-content');
  if(state.activeTab==='overview') main.innerHTML = renderOverview();
  else if(state.activeTab==='bestiary') main.innerHTML = renderBestiary();
  else if(state.activeTab==='builder') main.innerHTML = renderBuilder();
  else if(state.activeTab==='essences') main.innerHTML = renderEssences();
  else if(state.activeTab==='combat') main.innerHTML = renderCombat();
}
function setTab(id){
  if(state.activeTab==='builder') captureBuilderForm();
  state.activeTab = id;
  render();
}

/* ============================== OVERVIEW TAB ============================== */

function renderOverview(){
  return `
  <div class="card">
    <h2>How this works</h2>
    <div class="helptext">
      <p><strong>Bestiary</strong> holds every finished monster. <strong>Monster Builder</strong> is where you create or edit one -
      it auto-suggests resistances/vulnerabilities based on creature type (see house rules below) and shows you traits/actions
      already used on other monsters of the same type. <strong>Combat Tracker</strong> pulls combatants straight from the bestiary
      and does the resistance/vulnerability/immunity math for you when you log damage. <strong>Essences</strong> is the He Who
      Fights With Monsters power system: pick 3 essences for a character, look up (or record) the 4th (confluence) essence
      they produce, and track tiers.</p>
      <p><strong>Damage resolution order</strong> used by the Combat Tracker: immunity (0 dmg) &gt; vulnerability (double, or
      negates resistance - you choose per entry) &gt; resistance (halved, or a full-damage "boon" that triggers something else) &gt;
      weakness (an optional flat bonus amount of that damage type, like the undead fire weakness in your notes) &gt;
      optional Tyranny of Rank scaling (attacker tier vs. defender tier). A weakness can also just be a non-damage effect
      (disadvantage on a save, a condition landing easier, etc.) with no flat bonus set - those are shown on the stat block
      for you to apply by hand.</p>
      <p><strong>House rules baked into the auto-suggestions</strong> (edit the <code>TYPE_RULES</code> array near the top of the
      script to add more): undead vulnerable to radiant &middot; giants resist nonmagical bludgeoning/piercing/slashing &middot;
      shapechangers vulnerable to silver &middot; fey vulnerable to cold iron &middot; constructs/structures vulnerable to
      adamantine &middot; fiends &amp; celestials vulnerable to orichalcum &middot; elementals vulnerable to the next damage type
      in the cycle cold&rarr;fire&rarr;water&rarr;lightning&rarr;earth&rarr;cold &middot; tag a monster Psychic-Aligned or
      Shadow-Aligned for the hidden psychic/shadow war &middot; everything is vulnerable to void unless tagged Void-Immune.
      These are suggestions only - the builder never forces them onto a monster, you click "Suggest type defaults" to add them
      and can delete or edit any row afterward.</p>
      <p>Data lives only in this browser tab while you work. Use <strong>Export JSON</strong> often to save your campaign to a
      file, and <strong>Import JSON</strong> to load it back in (also how you'd hand a copy to a co-DM, or move it between
      devices). Nothing is sent anywhere.</p>
    </div>
  </div>
  <div class="card">
    <h2>Manage lists</h2>
    <div class="two-col">
      <div>
        <h3>Damage types <span class="badge">${state.damageTypes.length}</span></h3>
        <div class="pill-row">${state.damageTypes.map(d => `<span class="tag">${h(d)} <span class="close-x" onclick="removeFromList('damageTypes','${h(d)}')">&times;</span></span>`).join('')}</div>
        <div class="row-actions" style="margin-top:0.5rem;">
          <input id="new-damage-type" placeholder="e.g. Bleed" style="width:auto;flex:1;">
          <button class="btn small" onclick="addToList('damageTypes','new-damage-type')">Add</button>
        </div>
      </div>
      <div>
        <h3>Creature types <span class="badge">${state.creatureTypes.length}</span></h3>
        <div class="pill-row">${state.creatureTypes.map(d => `<span class="tag">${h(d)} <span class="close-x" onclick="removeFromList('creatureTypes','${h(d)}')">&times;</span></span>`).join('')}</div>
        <div class="row-actions" style="margin-top:0.5rem;">
          <input id="new-creature-type" placeholder="e.g. Spirit" style="width:auto;flex:1;">
          <button class="btn small" onclick="addToList('creatureTypes','new-creature-type')">Add</button>
        </div>
        <h3 style="margin-top:1rem;">Common tags <span class="badge">${state.commonTags.length}</span></h3>
        <div class="pill-row">${state.commonTags.map(d => `<span class="tag">${h(d)} <span class="close-x" onclick="removeFromList('commonTags','${h(d)}')">&times;</span></span>`).join('')}</div>
        <div class="row-actions" style="margin-top:0.5rem;">
          <input id="new-tag" placeholder="e.g. Swarm" style="width:auto;flex:1;">
          <button class="btn small" onclick="addToList('commonTags','new-tag')">Add</button>
        </div>
      </div>
    </div>
  </div>
  <div class="card">
    <div style="display:flex; justify-content:space-between; align-items:center;">
      <h2 style="border:none;">Damage property library <span class="badge">${state.damageProperties.length}</span></h2>
    </div>
    <p class="muted">Named, reusable weaknesses/resistances/vulnerabilities/boons - matching how your Monster Revamp notes track things like "Resonating Force resistance" or "Piercing Boon" as one named property applied to several monsters, instead of retyping it each time. Use "+ Add from library" in the Monster Builder's damage profile section to apply one.</p>
    <div id="damage-property-list">${renderDamagePropertyList()}</div>
    <div id="damage-property-form">${renderDamagePropertyForm()}</div>
  </div>
  <div class="card">
    <h3>Snapshot</h3>
    <p class="muted">${state.monsters.length} monster(s) in the bestiary (${state.monsters.filter(m=>m.status==='queued').length} awaiting conversion) &middot; ${state.characters.length} essence character sheet(s) &middot; ${state.confluenceCombos.length} confluence combo(s) recorded &middot; ${state.damageProperties.length} damage propert${state.damageProperties.length===1?'y':'ies'} in the library &middot; ${state.encounter.combatants.length} combatant(s) in the current encounter.</p>
  </div>`;
}
function renderDamagePropertyList(){
  if(!state.damageProperties.length) return '<p class="empty">No reusable properties yet.</p>';
  return `<table><thead><tr><th>Name</th><th>Damage type</th><th>Category</th><th>Effect</th><th></th></tr></thead><tbody>
    ${state.damageProperties.map(p => `<tr>
      <td>${h(p.name)}</td>
      <td>${h(p.damageType)}</td>
      <td><span class="tag ${p.category}">${p.category}${p.mode?' ('+h(p.mode)+')':''}${p.extraDamage?' +'+h(p.extraDamage):''}</span></td>
      <td class="muted">${h(p.note||'')}</td>
      <td class="row-actions">
        <button class="btn small secondary" onclick="editDamageProperty('${p.id}')">Edit</button>
        <button class="btn small danger" onclick="deleteDamageProperty('${p.id}')">Delete</button>
      </td>
    </tr>`).join('')}
  </tbody></table>`;
}
function editDamageProperty(id){
  const p = state.damageProperties.find(x => x.id===id);
  if(!p) return;
  state.editingPropertyId = id;
  state.draftProperty = JSON.parse(JSON.stringify(p));
  document.getElementById('damage-property-form').innerHTML = renderDamagePropertyForm();
}
function deleteDamageProperty(id){
  if(!confirm('Delete this reusable property? Monsters that already used it keep their copy of the effect - this only removes it from the picker.')) return;
  state.damageProperties = state.damageProperties.filter(x => x.id!==id);
  document.getElementById('damage-property-list').innerHTML = renderDamagePropertyList();
}
function newDamageProperty(){
  state.editingPropertyId = null;
  state.draftProperty = {id: uid(), name:'', damageType: state.damageTypes[0], category:'resistance', mode:'halved', extraDamage:'', note:''};
  document.getElementById('damage-property-form').innerHTML = renderDamagePropertyForm();
}
function renderDamagePropertyForm(){
  if(!state.draftProperty) return `<button class="btn small secondary" style="margin-top:0.6rem;" onclick="newDamageProperty()">+ New reusable property</button>`;
  const p = state.draftProperty;
  return `<div class="suggest-box" style="margin-top:0.6rem;">
    <div class="grid grid-4">
      <div><label>Name</label><input id="prop-name" value="${h(p.name)}" placeholder="e.g. Undead Fire Weakness"></div>
      <div><label>Damage type</label><select id="prop-type">${state.damageTypes.map(dt => `<option ${p.damageType===dt?'selected':''}>${h(dt)}</option>`).join('')}</select></div>
      <div><label>Category</label><select id="prop-cat" onchange="changeDraftPropertyCategory(this.value)">${['resistance','immunity','vulnerability','weakness','boon'].map(c => `<option ${p.category===c?'selected':''}>${c}</option>`).join('')}</select></div>
      <div><label>${p.category==='weakness'?'Flat extra dmg':'Mode'}</label>${p.category==='weakness'
        ? `<input id="prop-extradmg" type="number" value="${h(p.extraDamage||'')}">`
        : (p.category==='resistance' ? `<select id="prop-mode">${['halved','boon'].map(mo=>`<option ${p.mode===mo?'selected':''}>${mo}</option>`).join('')}</select>`
          : p.category==='vulnerability' ? `<select id="prop-mode">${['double','negatesResistance'].map(mo=>`<option ${p.mode===mo?'selected':''}>${mo}</option>`).join('')}</select>`
          : `<span class="muted">n/a</span>`)}
      </div>
    </div>
    <div style="margin-top:0.5rem;"><label>Effect / description</label><textarea id="prop-note" placeholder="What actually happens (flavor, trigger, etc.)">${h(p.note||'')}</textarea></div>
    <div class="row-actions" style="margin-top:0.6rem;">
      <button class="btn secondary" onclick="cancelDamagePropertyForm()">Cancel</button>
      <button class="btn" onclick="saveDamageProperty()">Save property</button>
    </div>
  </div>`;
}
function changeDraftPropertyCategory(cat){
  captureDamagePropertyForm();
  state.draftProperty.category = cat;
  state.draftProperty.mode = cat==='resistance' ? 'halved' : (cat==='vulnerability' ? 'double' : '');
  document.getElementById('damage-property-form').innerHTML = renderDamagePropertyForm();
}
function captureDamagePropertyForm(){
  const p = state.draftProperty;
  if(!p || document.getElementById('prop-name')===null) return;
  p.name = document.getElementById('prop-name').value;
  p.damageType = document.getElementById('prop-type').value;
  p.note = document.getElementById('prop-note').value;
  const modeEl = document.getElementById('prop-mode');
  if(modeEl) p.mode = modeEl.value;
  const extraEl = document.getElementById('prop-extradmg');
  if(extraEl) p.extraDamage = extraEl.value;
}
function cancelDamagePropertyForm(){
  state.editingPropertyId = null;
  state.draftProperty = null;
  document.getElementById('damage-property-form').innerHTML = renderDamagePropertyForm();
}
function saveDamageProperty(){
  captureDamagePropertyForm();
  const p = state.draftProperty;
  if(!p.name || !p.name.trim()){ alert('Give the property a name first.'); return; }
  const idx = state.damageProperties.findIndex(x => x.id===p.id);
  if(idx>=0) state.damageProperties[idx] = p; else state.damageProperties.push(p);
  state.editingPropertyId = null;
  state.draftProperty = null;
  document.getElementById('damage-property-list').innerHTML = renderDamagePropertyList();
  document.getElementById('damage-property-form').innerHTML = renderDamagePropertyForm();
}
function addToList(listName, inputId){
  const input = document.getElementById(inputId);
  const val = input.value.trim();
  if(!val) return;
  if(!state[listName].includes(val)) state[listName].push(val);
  render();
}
function removeFromList(listName, val){
  state[listName] = state[listName].filter(x => x !== val);
  render();
}

/* ============================== BESTIARY TAB ============================== */

let bestiaryFilter = {search:'', type:'', tier:'', status:''};

function filteredBestiary(){
  return state.monsters.filter(m => {
    if(bestiaryFilter.search && !m.name.toLowerCase().includes(bestiaryFilter.search.toLowerCase())) return false;
    if(bestiaryFilter.type && m.type !== bestiaryFilter.type) return false;
    if(bestiaryFilter.tier && m.tier !== bestiaryFilter.tier) return false;
    if(bestiaryFilter.status && (m.status||'ready') !== bestiaryFilter.status) return false;
    return true;
  });
}
function renderBestiary(){
  const list = filteredBestiary();
  const queuedCount = state.monsters.filter(m => m.status==='queued').length;
  return `
  <div class="card">
    <div class="search-bar">
      <input placeholder="Search by name..." value="${h(bestiaryFilter.search)}" oninput="bestiaryFilter.search=this.value; renderBestiaryList();">
      <select onchange="bestiaryFilter.type=this.value; renderBestiaryList();">
        <option value="">All types</option>
        ${state.creatureTypes.map(t => `<option ${bestiaryFilter.type===t?'selected':''}>${h(t)}</option>`).join('')}
      </select>
      <select onchange="bestiaryFilter.tier=this.value; renderBestiaryList();">
        <option value="">All tiers</option>
        ${TIERS.map(t => `<option ${bestiaryFilter.tier===t?'selected':''}>${t}</option>`).join('')}
      </select>
      <select onchange="bestiaryFilter.status=this.value; renderBestiaryList();">
        <option value="">All (ready + queue)</option>
        <option value="ready" ${bestiaryFilter.status==='ready'?'selected':''}>Ready only</option>
        <option value="queued" ${bestiaryFilter.status==='queued'?'selected':''}>Needs conversion (${queuedCount})</option>
      </select>
      <button class="btn secondary" onclick="document.getElementById('foundry-import-file').click()">Import Foundry file</button>
      <input type="file" id="foundry-import-file" accept=".json,.db,.txt,application/json" style="display:none" onchange="importFoundryFile(event)">
      <button class="btn" onclick="newMonster()">+ New Monster</button>
    </div>
    ${queuedCount ? `<p class="muted">${queuedCount} monster(s) imported and waiting for conversion to your homebrew rules. <a href="#" onclick="bestiaryFilter.status='queued'; render(); return false;" style="color:var(--accent2);">Show them</a>.</p>` : ''}
    <div id="bestiary-list">${renderBestiaryListInner(list)}</div>
  </div>
  <div id="bestiary-detail"></div>`;
}
function renderBestiaryListInner(list){
  if(!list.length) return `<div class="empty">No monsters match. ${state.monsters.length? 'Try clearing filters, or ':''}click "New Monster" to open the builder.</div>`;
  return list.map(m => `
    <div class="list-item" onclick="viewMonster('${m.id}')">
      <div><strong>${h(m.name||'(unnamed)')}</strong> ${m.status==='queued'?'<span class="badge" style="color:var(--warn);border-color:var(--warn);">NEEDS CONVERSION</span>':''} <span class="muted">${h(m.type)}${m.subtypes?' ('+h(m.subtypes)+')':''} &middot; ${h(m.tier)} tier${m.cr?' &middot; CR '+h(m.cr):''}${m.variantOf?' &middot; variant of '+h(m.variantOf):''}</span></div>
      <div class="row-actions" onclick="event.stopPropagation();">
        <button class="btn small secondary" onclick="editMonster('${m.id}')">Edit</button>
        <button class="btn small secondary" onclick="duplicateMonster('${m.id}')">Quick duplicate</button>
        <button class="btn small secondary" onclick="openVariantForm('${m.id}')">Duplicate as variant...</button>
        <button class="btn small danger" onclick="deleteMonster('${m.id}')">Delete</button>
      </div>
    </div>`).join('');
}
function renderBestiaryList(){
  document.getElementById('bestiary-list').innerHTML = renderBestiaryListInner(filteredBestiary());
}
function viewMonster(id){
  const m = state.monsters.find(x => x.id===id);
  if(!m) return;
  const profile = getEffectiveProfile(m);
  document.getElementById('bestiary-detail').innerHTML = `
  <div class="card">
    <div style="display:flex; justify-content:space-between; align-items:start;">
      <h2 style="border:none;">${h(m.name)} <span class="badge">${h(m.tier)}</span>${m.status==='queued'?' <span class="badge" style="color:var(--warn);border-color:var(--warn);">NEEDS CONVERSION</span>':''}</h2>
      <span class="close-x" onclick="document.getElementById('bestiary-detail').innerHTML=''">&times; close</span>
    </div>
    ${m.status==='queued' ? `<div class="suggest-box">This monster came from a Foundry import and hasn't been converted to your homebrew rules yet.${m.importWarnings&&m.importWarnings.length? ' Importer warnings: '+m.importWarnings.map(h).join('; '):''} <button class="btn small" style="margin-top:0.4rem;" onclick="markConverted('${m.id}')">Mark as converted</button> <button class="btn small secondary" onclick="editMonster('${m.id}')">Open in builder</button></div>` : ''}
    <p class="muted">${h(m.size)} ${h(m.type)}${m.subtypes?' ('+h(m.subtypes)+')':''}, ${h(m.alignment)||'unaligned'} ${m.cr? '&middot; CR '+h(m.cr):''}</p>
    <div class="grid grid-4">
      <div><label>AC</label>${h(m.ac)}</div>
      <div><label>HP</label>${h(m.hp)} ${m.hpFormula?'('+h(m.hpFormula)+')':''}</div>
      <div><label>Speed</label>${h(m.speed)}</div>
      <div><label>Prof. Bonus</label>${h(m.proficiencyBonus)}</div>
    </div>
    <div class="grid grid-6" style="margin-top:0.5rem;">
      ${['str','dex','con','int','wis','cha'].map(a => `<div><label>${a.toUpperCase()}</label>${h(m.abilities[a])}</div>`).join('')}
    </div>
    <p class="muted" style="margin-top:0.5rem;">${m.savingThrows?'<strong>Saves</strong> '+h(m.savingThrows)+'. ':''}${m.skills?'<strong>Skills</strong> '+h(m.skills)+'. ':''}${m.senses?'<strong>Senses</strong> '+h(m.senses)+'. ':''}${m.languages?'<strong>Languages</strong> '+h(m.languages)+'.':''}</p>
    <div class="section-title">Damage profile (effective, incl. auto type defaults)</div>
    <div class="pill-row">
      ${profile.length? profile.map(p => `<span class="tag ${p.category} ${p.source==='auto'?'auto':''}" title="${h(p.note||'')}">${p.category==='resistance'&&p.mode==='boon'?'Boon (resist)':p.category} ${h(p.damageType)}${p.extraDamage?' (+'+h(p.extraDamage)+')':''}${p.source==='auto'?' *':''}</span>`).join('') : '<span class="muted">None set.</span>'}
    </div>
    ${m.conditionImmunities? `<p class="muted"><strong>Condition immunities</strong> ${h(m.conditionImmunities)}</p>`:''}
    ${renderTraitBlock('Traits', m.traits)}
    ${renderTraitBlock('Actions', m.actions)}
    ${renderTraitBlock('Bonus Actions', m.bonusActions)}
    ${renderTraitBlock('Reactions', m.reactions)}
    ${renderTraitBlock('Legendary Actions', m.legendaryActions)}
    ${m.loot? `<div class="section-title">Loot</div><p class="muted">${h(m.loot)}</p>`:''}
    ${m.notes? `<div class="section-title">Notes</div><p class="muted">${h(m.notes)}</p>`:''}
  </div>`;
}
function renderTraitBlock(title, arr){
  if(!arr || !arr.length) return '';
  return `<div class="section-title">${title}</div>` + arr.map(t => `<p><strong>${h(t.name)}.</strong> ${h(t.text)}</p>`).join('');
}
function newMonster(){
  state.editingMonsterId = null;
  state.draftMonster = blankMonster();
  state.activeTab = 'builder';
  render();
}
function editMonster(id){
  const m = state.monsters.find(x => x.id===id);
  if(!m) return;
  state.editingMonsterId = id;
  state.draftMonster = JSON.parse(JSON.stringify(m));
  state.activeTab = 'builder';
  render();
}
function duplicateMonster(id){
  const m = state.monsters.find(x => x.id===id);
  if(!m) return;
  const copy = JSON.parse(JSON.stringify(m));
  copy.id = uid(); copy.name = copy.name + ' (copy)';
  state.monsters.push(copy);
  render();
}
function deleteMonster(id){
  if(!confirm('Delete this monster from the bestiary?')) return;
  state.monsters = state.monsters.filter(x => x.id!==id);
  document.getElementById('bestiary-detail').innerHTML = '';
  render();
}
function markConverted(id){
  const m = state.monsters.find(x => x.id===id);
  if(!m) return;
  m.status = 'ready';
  viewMonster(id);
  renderBestiaryList();
}

/* ---- Duplicate as a new tier/variant ---- */
function openVariantForm(id){
  const m = state.monsters.find(x => x.id===id);
  if(!m) return;
  const nextTier = TIERS[Math.min(TIERS.length-1, tierIndex(m.tier)+1)];
  document.getElementById('bestiary-detail').innerHTML = `
  <div class="card">
    <div style="display:flex; justify-content:space-between; align-items:start;">
      <h2 style="border:none;">Duplicate "${h(m.name)}" as a variant</h2>
      <span class="close-x" onclick="document.getElementById('bestiary-detail').innerHTML=''">&times; close</span>
    </div>
    <p class="muted">Makes a full copy you can hand-tune - useful for reskinning the same stat block at a tougher tier, or a themed variant (elite, champion, minion, etc.). The multiplier/adjustment below are just a quick starting point, not real 5e math - expect to tweak the result in the builder afterward.</p>
    <div class="grid grid-4">
      <div><label>New name</label><input id="variant-name" value="${h(m.name)} (${nextTier})"></div>
      <div><label>New tier</label><select id="variant-tier">${TIERS.map(t => `<option ${t===nextTier?'selected':''}>${t}</option>`).join('')}</select></div>
      <div><label>HP multiplier</label><input id="variant-hpmult" type="number" step="0.1" value="1"></div>
      <div><label>AC adjustment</label><input id="variant-acadj" type="number" value="0"></div>
    </div>
    <div style="margin-top:0.5rem;"><label>What changed (added to Notes)</label><textarea id="variant-notes" placeholder="e.g. Bigger, meaner cousin - add a legendary action or two."></textarea></div>
    <div class="row-actions" style="margin-top:0.6rem;">
      <button class="btn secondary" onclick="document.getElementById('bestiary-detail').innerHTML=''">Cancel</button>
      <button class="btn" onclick="createVariant('${m.id}')">Create variant &amp; open in builder</button>
    </div>
  </div>`;
}
function createVariant(id){
  const orig = state.monsters.find(x => x.id===id);
  if(!orig) return;
  const copy = JSON.parse(JSON.stringify(orig));
  copy.id = uid();
  copy.name = document.getElementById('variant-name').value.trim() || (orig.name+' (variant)');
  copy.tier = document.getElementById('variant-tier').value;
  const hpMult = parseFloat(document.getElementById('variant-hpmult').value) || 1;
  const acAdj = parseInt(document.getElementById('variant-acadj').value, 10) || 0;
  const origHp = parseInt(orig.hp, 10);
  if(!isNaN(origHp) && hpMult!==1) copy.hp = String(Math.max(1, Math.round(origHp * hpMult)));
  const origAc = parseInt(orig.ac, 10);
  if(!isNaN(origAc) && acAdj) copy.ac = String(origAc + acAdj);
  copy.variantOf = orig.name;
  const extraNotes = document.getElementById('variant-notes').value.trim();
  copy.notes = 'Variant of "'+orig.name+'"'+(hpMult!==1?' - HP x'+hpMult:'')+(acAdj?' - AC '+(acAdj>0?'+':'')+acAdj:'')+'.'+(extraNotes? ' '+extraNotes:'')+(orig.notes? '\n\nOriginal notes: '+orig.notes:'');
  state.monsters.push(copy);
  editMonster(copy.id);
}

/* ============================== MONSTER BUILDER TAB ============================== */

function ensureDraft(){ if(!state.draftMonster) state.draftMonster = blankMonster(); }

function captureBuilderForm(){
  if(state.activeTab!=='builder' || !state.draftMonster) return;
  const d = state.draftMonster;
  const val = id => { const el = document.getElementById(id); return el ? el.value : undefined; };
  if(document.getElementById('m-name')===null) return; // form not mounted
  d.name = val('m-name'); d.type = val('m-type'); d.subtypes = val('m-subtypes');
  d.elementalAlignment = val('m-elemental') || '';
  d.tier = val('m-tier'); d.cr = val('m-cr'); d.size = val('m-size'); d.alignment = val('m-alignment');
  d.ac = val('m-ac'); d.hp = val('m-hp'); d.hpFormula = val('m-hpformula'); d.speed = val('m-speed');
  ['str','dex','con','int','wis','cha'].forEach(a => { const v = val('m-'+a); if(v!==undefined) d.abilities[a] = v; });
  d.savingThrows = val('m-saves'); d.skills = val('m-skills'); d.senses = val('m-senses');
  d.languages = val('m-languages'); d.proficiencyBonus = val('m-pb');
  d.conditionImmunities = val('m-condimm'); d.notes = val('m-notes');
  d.environment = val('m-environment'); d.loot = val('m-loot');
  d.damageProfile.forEach((p,i) => {
    p.damageType = val('dp-type-'+i) ?? p.damageType;
    p.category = val('dp-cat-'+i) ?? p.category;
    p.mode = val('dp-mode-'+i) ?? p.mode;
    p.note = val('dp-note-'+i) ?? p.note;
    const extra = val('dp-extradmg-'+i);
    if(extra !== undefined) p.extraDamage = extra;
  });
  ['traits','actions','bonusActions','reactions','legendaryActions'].forEach(key => {
    (d[key]||[]).forEach((t,i) => {
      t.name = val(key+'-name-'+i) ?? t.name;
      t.text = val(key+'-text-'+i) ?? t.text;
    });
  });
}

function renderBuilder(){
  ensureDraft();
  const d = state.draftMonster;
  return `
  <div class="card">
    <div style="display:flex; justify-content:space-between; align-items:center;">
      <h2 style="border:none;">${state.editingMonsterId? 'Edit Monster' : 'New Monster'}${d.status==='queued'?' <span class="badge" style="color:var(--warn);border-color:var(--warn);">NEEDS CONVERSION</span>':''}</h2>
      <div class="row-actions">
        ${d.status==='queued' ? `<button class="btn secondary" onclick="markDraftConverted()">Mark as converted</button>` : ''}
        <button class="btn secondary" onclick="cancelBuilder()">Cancel</button>
        <button class="btn" onclick="saveMonster()">Save to Bestiary</button>
      </div>
    </div>
    ${d.status==='queued' && d.importWarnings && d.importWarnings.length ? `<div class="suggest-box">Importer warnings: ${d.importWarnings.map(h).join('; ')}</div>` : ''}

    <div class="section-title">Basics</div>
    <div class="grid grid-4">
      <div><label>Name</label><input id="m-name" value="${h(d.name)}"></div>
      <div><label>Type</label><select id="m-type" onchange="onTypeChange(this.value)">${state.creatureTypes.map(t => `<option ${d.type===t?'selected':''}>${h(t)}</option>`).join('')}</select></div>
      <div><label>Subtype(s)</label><input id="m-subtypes" placeholder="e.g. Shapechanger, Goblinoid" value="${h(d.subtypes)}"></div>
      <div><label>Tier</label><select id="m-tier">${TIERS.map(t => `<option ${d.tier===t?'selected':''}>${t}</option>`).join('')}</select></div>
    </div>
    <div class="grid grid-4" style="margin-top:0.6rem;">
      <div><label>CR (optional)</label><input id="m-cr" value="${h(d.cr)}"></div>
      <div><label>Size</label><input id="m-size" value="${h(d.size)}"></div>
      <div><label>Alignment</label><input id="m-alignment" value="${h(d.alignment)}"></div>
      ${d.type==='Elemental' ? `<div><label>Elemental alignment</label><select id="m-elemental">${['',...ELEMENTAL_ALIGNMENTS].map(e => `<option ${d.elementalAlignment===e?'selected':''}>${e}</option>`).join('')}</select></div>` : `<div><label>Elemental alignment</label><input id="m-elemental" value="${h(d.elementalAlignment)}" placeholder="(n/a unless type = Elemental)"></div>`}
    </div>

    <div class="section-title">Tags <span class="muted" style="text-transform:none;">(drives auto rules like Shapechanger/Structure/Psychic-Aligned/Shadow-Aligned/Void-Immune)</span></div>
    <div class="pill-row">
      ${state.commonTags.map(t => `<label style="display:inline-flex;align-items:center;gap:0.3rem;width:auto;text-transform:none;font-size:0.8rem;"><input type="checkbox" style="width:auto;" ${((d.tags||[]).includes(t))?'checked':''} onchange="toggleTag('${h(t)}', this.checked)"> ${h(t)}</label>`).join('')}
    </div>

    <div class="section-title">Defenses</div>
    <div class="grid grid-4">
      <div><label>AC</label><input id="m-ac" value="${h(d.ac)}"></div>
      <div><label>HP</label><input id="m-hp" value="${h(d.hp)}"></div>
      <div><label>HP formula</label><input id="m-hpformula" placeholder="e.g. 8d10+16" value="${h(d.hpFormula)}"></div>
      <div><label>Speed</label><input id="m-speed" value="${h(d.speed)}"></div>
    </div>

    <div class="section-title">Ability scores</div>
    <div class="grid grid-6">
      ${['str','dex','con','int','wis','cha'].map(a => `<div><label>${a.toUpperCase()}</label><input id="m-${a}" value="${h(d.abilities[a])}"></div>`).join('')}
    </div>
    <div class="grid grid-4" style="margin-top:0.6rem;">
      <div><label>Saving throws</label><input id="m-saves" value="${h(d.savingThrows)}"></div>
      <div><label>Skills</label><input id="m-skills" value="${h(d.skills)}"></div>
      <div><label>Senses</label><input id="m-senses" value="${h(d.senses)}"></div>
      <div><label>Languages</label><input id="m-languages" value="${h(d.languages)}"></div>
    </div>
    <div class="grid grid-4" style="margin-top:0.6rem;">
      <div><label>Proficiency bonus</label><input id="m-pb" value="${h(d.proficiencyBonus)}"></div>
      <div><label>Condition immunities</label><input id="m-condimm" value="${h(d.conditionImmunities)}"></div>
    </div>

    <div class="section-title">Damage profile <span class="muted" style="text-transform:none;">(resistance/immunity/vulnerability/weakness/boon)</span></div>
    <div class="row-actions" style="margin-bottom:0.5rem; flex-wrap:wrap;">
      <button class="btn small secondary" onclick="suggestTypeDefaults()">Suggest type defaults</button>
      <button class="btn small secondary" onclick="addDamageRow()">+ Add blank row</button>
      <select id="library-pick" style="width:auto;">
        <option value="">-- add from library --</option>
        ${state.damageProperties.map(p => `<option value="${p.id}">${h(p.name)} (${p.category})</option>`).join('')}
      </select>
      <button class="btn small secondary" onclick="addRowFromLibrary()">+ Add from library</button>
    </div>
    ${renderDamageRows(d)}

    <div class="section-title">Traits &amp; Actions</div>
    ${renderTraitEditor('traits','Traits')}
    ${renderTraitEditor('actions','Actions')}
    ${renderTraitEditor('bonusActions','Bonus Actions')}
    ${renderTraitEditor('reactions','Reactions')}
    ${renderTraitEditor('legendaryActions','Legendary Actions')}

    <div class="section-title">Suggested from other ${h(d.type)} monsters in your bestiary</div>
    ${renderSuggestions(d)}

    <div class="section-title">Environment / Loot / Notes</div>
    <div class="grid grid-3">
      <div><label>Environment</label><input id="m-environment" value="${h(d.environment||'')}"></div>
      <div><label>Loot</label><textarea id="m-loot" placeholder="Loot table, monster core, drops...">${h(d.loot||'')}</textarea></div>
      <div><label>Notes</label><textarea id="m-notes">${h(d.notes)}</textarea></div>
    </div>
  </div>`;
}

function onTypeChange(newType){
  captureBuilderForm();
  state.draftMonster.type = newType;
  render();
}
function toggleTag(tag, checked){
  captureBuilderForm();
  const d = state.draftMonster;
  d.tags = d.tags || [];
  if(checked){ if(!d.tags.includes(tag)) d.tags.push(tag); }
  else { d.tags = d.tags.filter(t => t!==tag); }
  render();
}
function renderDamageRows(d){
  if(!d.damageProfile.length) return '<p class="muted">No manual entries yet. Try "Suggest type defaults" or add a row.</p>';
  return `<table><thead><tr><th>Damage type</th><th>Category</th><th>Mode / extra dmg</th><th>Note</th><th></th></tr></thead><tbody>
    ${d.damageProfile.map((p,i) => `<tr>
      <td><select id="dp-type-${i}">${state.damageTypes.map(dt => `<option ${p.damageType===dt?'selected':''}>${h(dt)}</option>`).join('')}</select></td>
      <td><select id="dp-cat-${i}" onchange="changeDamageCategory(${i}, this.value)">${['resistance','immunity','vulnerability','weakness','boon'].map(c => `<option ${p.category===c?'selected':''}>${c}</option>`).join('')}</select></td>
      <td>${renderModeSelect(p,i)}</td>
      <td><input id="dp-note-${i}" value="${h(p.note||'')}" placeholder="flavor / trigger text"></td>
      <td class="row-actions">
        <button class="btn small secondary" title="Save this row as a reusable named property" onclick="promoteRowToLibrary(${i})">Save as property</button>
        <button class="btn small danger" onclick="removeDamageRow(${i})">&times;</button>
      </td>
    </tr>`).join('')}
  </tbody></table>`;
}
function renderModeSelect(p,i){
  if(p.category==='resistance') return `<select id="dp-mode-${i}">${['halved','boon'].map(m => `<option ${p.mode===m?'selected':''}>${m}</option>`).join('')}</select>`;
  if(p.category==='vulnerability') return `<select id="dp-mode-${i}">${['double','negatesResistance'].map(m => `<option ${p.mode===m?'selected':''}>${m}</option>`).join('')}</select>`;
  if(p.category==='weakness') return `<input id="dp-extradmg-${i}" type="number" value="${h(p.extraDamage||'')}" placeholder="flat extra dmg (optional)">`;
  return `<span class="muted">n/a</span>`;
}
function changeDamageCategory(i, cat){
  captureBuilderForm();
  state.draftMonster.damageProfile[i].category = cat;
  state.draftMonster.damageProfile[i].mode = cat==='resistance' ? 'halved' : (cat==='vulnerability' ? 'double' : '');
  render();
}
function addDamageRow(){
  captureBuilderForm();
  state.draftMonster.damageProfile.push({damageType:state.damageTypes[0], category:'resistance', mode:'halved', note:'', source:'manual'});
  render();
}
function removeDamageRow(i){
  captureBuilderForm();
  state.draftMonster.damageProfile.splice(i,1);
  render();
}
function addRowFromLibrary(){
  captureBuilderForm();
  const propId = document.getElementById('library-pick').value;
  if(!propId) return;
  const prop = state.damageProperties.find(p => p.id===propId);
  if(!prop) return;
  state.draftMonster.damageProfile.push({damageType:prop.damageType, category:prop.category, mode:prop.mode, extraDamage:prop.extraDamage, note:prop.note, source:'manual', linkedPropertyId:prop.id});
  render();
}
function promoteRowToLibrary(i){
  captureBuilderForm();
  const row = state.draftMonster.damageProfile[i];
  const name = prompt('Name this reusable property (e.g. "Undead Fire Weakness"):', row.damageType+' '+row.category);
  if(!name || !name.trim()) return;
  state.damageProperties.push({id: uid(), name: name.trim(), damageType: row.damageType, category: row.category, mode: row.mode||'', extraDamage: row.extraDamage||'', note: row.note||''});
  row.linkedPropertyId = state.damageProperties[state.damageProperties.length-1].id;
  render();
}
function suggestTypeDefaults(){
  captureBuilderForm();
  const d = state.draftMonster;
  const defaults = computeTypeDefaults(d);
  defaults.forEach(def => {
    const exists = d.damageProfile.some(p => p.damageType===def.damageType && p.category===def.category);
    if(!exists) d.damageProfile.push({damageType:def.damageType, category:def.category, mode:def.mode, note:def.note, source:'auto'});
  });
  if(!defaults.length) alert("No automatic rules match this monster's current type/tags/elemental alignment.");
  render();
}

function renderTraitEditor(key, label){
  const d = state.draftMonster;
  const arr = d[key] || [];
  return `<h3>${label}</h3>
  ${arr.map((t,i) => `<div class="grid grid-2" style="margin-bottom:0.4rem;">
    <div><label>Name</label><input id="${key}-name-${i}" value="${h(t.name)}"></div>
    <div style="position:relative;"><label>Text</label><textarea id="${key}-text-${i}">${h(t.text)}</textarea>
      <button class="btn small danger" style="position:absolute;top:0;right:0;" onclick="removeTraitRow('${key}',${i})">&times;</button>
    </div>
  </div>`).join('')}
  <button class="btn small secondary" onclick="addTraitRow('${key}')">+ Add ${label.toLowerCase()}</button>`;
}
function addTraitRow(key){
  captureBuilderForm();
  state.draftMonster[key] = state.draftMonster[key] || [];
  state.draftMonster[key].push({name:'', text:''});
  render();
}
function removeTraitRow(key,i){
  captureBuilderForm();
  state.draftMonster[key].splice(i,1);
  render();
}

function renderSuggestions(d){
  const others = state.monsters.filter(m => m.type===d.type && m.id!==d.id);
  if(!others.length) return '<p class="muted">No other bestiary monsters of this type yet - suggestions fill in as you build out the bestiary.</p>';
  const tally = {};
  ['traits','actions','bonusActions','reactions'].forEach(key => {
    others.forEach(m => (m[key]||[]).forEach(t => {
      if(!t.name) return;
      const k = key+'::'+t.name;
      tally[k] = tally[k] || {key, name:t.name, text:t.text, count:0};
      tally[k].count++;
    }));
  });
  const list = Object.values(tally).sort((a,b) => b.count-a.count).slice(0,15);
  if(!list.length) return "<p class=\"muted\">Other monsters of this type don't have named traits/actions yet.</p>";
  return '<div class="suggest-box">' + list.map(t => `
    <div class="list-item" style="cursor:default;">
      <div><strong>${h(t.name)}</strong> <span class="muted">(${t.key}, used by ${t.count} monster${t.count>1?'s':''})</span><br><span class="muted">${h(t.text).slice(0,140)}${t.text.length>140?'...':''}</span></div>
      <button class="btn small secondary" onclick="addSuggestedTrait('${t.key}','${h(t.name).replace(/'/g,"&#39;")}')">+ Add</button>
    </div>`).join('') + '</div>';
}
function addSuggestedTrait(key, name){
  captureBuilderForm();
  const [arrKey] = key.split('::');
  const source = state.monsters.flatMap(m => m[arrKey]||[]).find(t => t.name===name);
  if(!source) return;
  state.draftMonster[arrKey] = state.draftMonster[arrKey] || [];
  if(state.draftMonster[arrKey].some(t => t.name===name)) return;
  state.draftMonster[arrKey].push({name: source.name, text: source.text});
  render();
}

function cancelBuilder(){
  state.draftMonster = null;
  state.editingMonsterId = null;
  state.activeTab = 'bestiary';
  render();
}
function markDraftConverted(){
  captureBuilderForm();
  state.draftMonster.status = 'ready';
  render();
}
function saveMonster(){
  captureBuilderForm();
  const d = state.draftMonster;
  if(!d.name || !d.name.trim()){ alert('Give the monster a name first.'); return; }
  const idx = state.monsters.findIndex(m => m.id===d.id);
  if(idx>=0) state.monsters[idx] = d; else state.monsters.push(d);
  state.editingMonsterId = d.id;
  alert('Saved "'+d.name+'" to the bestiary.');
  state.draftMonster = null;
  state.editingMonsterId = null;
  state.activeTab = 'bestiary';
  render();
}

/* ============================== ESSENCES TAB ============================== */

let essenceFilter = {search:'', kind:'', rarity:''};
let confluencePick = ['','',''];

function renderEssences(){
  const list = state.essences.filter(e => {
    if(essenceFilter.search && !e.name.toLowerCase().includes(essenceFilter.search.toLowerCase())) return false;
    if(essenceFilter.kind && e.kind!==essenceFilter.kind) return false;
    if(essenceFilter.rarity && e.rarity!==essenceFilter.rarity) return false;
    return true;
  });
  return `
  <div class="card">
    <h2>Essence library <span class="badge">${state.essences.length}</span></h2>
    <p class="muted">Pulled from your classification + rarity tables. Names present in one table but missing from the other are marked "Unclassified" - fix them up here or via Export/Import.</p>
    <div class="search-bar">
      <input placeholder="Search essence..." value="${h(essenceFilter.search)}" oninput="essenceFilter.search=this.value; renderEssenceLibrary();">
      <select onchange="essenceFilter.kind=this.value; renderEssenceLibrary();">
        <option value="">All kinds</option>
        ${['Living','Weapon','Elemental','Concept','Unclassified'].map(k => `<option ${essenceFilter.kind===k?'selected':''}>${k}</option>`).join('')}
      </select>
      <select onchange="essenceFilter.rarity=this.value; renderEssenceLibrary();">
        <option value="">All rarities</option>
        ${['Common','Uncommon','Rare','Epic','Legendary','Unclassified'].map(r => `<option ${essenceFilter.rarity===r?'selected':''}>${r}</option>`).join('')}
      </select>
    </div>
    <div id="essence-library">${renderEssenceLibraryInner(list)}</div>
  </div>

  <div class="card">
    <h2>Confluence finder</h2>
    <p class="muted">Pick 0-3 essences to filter the ${state.confluenceCombos.length} known/recorded confluences - leave slots on "any" to browse broadly, fill in all 3 to look up (or record) one exact combination. Combining 3 essences produces a 4th, the confluence essence. Banned combinations are flagged.</p>
    <div class="grid grid-4">
      ${[0,1,2].map(i => `<div><label>Essence ${i+1}</label><select onchange="confluencePick[${i}]=this.value; onConfluenceFilterChange();">
        <option value="">-- any --</option>
        ${state.essences.map(e => `<option ${confluencePick[i]===e.name?'selected':''}>${h(e.name)}</option>`).join('')}
      </select></div>`).join('')}
      <div><label>Filter by result name</label><input value="${h(confluenceNameFilter)}" oninput="confluenceNameFilter=this.value; onConfluenceFilterChange();" placeholder="e.g. Dragon"></div>
    </div>
    <div id="confluence-section" style="margin-top:0.6rem;">${renderConfluenceSection()}</div>
  </div>

  <div class="card">
    <div style="display:flex; justify-content:space-between; align-items:center;">
      <h2 style="border:none;">Character essence sheets</h2>
      <button class="btn" onclick="newCharacter()">+ New Character</button>
    </div>
    <div id="character-list">${renderCharacterList()}</div>
    <div id="character-detail">${state.editingCharacterId!==null || state.draftCharacter ? renderCharacterForm() : ''}</div>
  </div>`;
}
function renderEssenceLibraryInner(list){
  if(!list.length) return '<p class="empty">No essences match that filter.</p>';
  return `<table><thead><tr><th>Name</th><th>Kind</th><th>Rarity</th></tr></thead><tbody>
    ${list.map(e => `<tr><td>${h(e.name)}</td><td>${h(e.kind)}</td><td>${h(e.rarity)}</td></tr>`).join('')}
  </tbody></table>`;
}
function renderEssenceLibrary(){
  const list = state.essences.filter(e => {
    if(essenceFilter.search && !e.name.toLowerCase().includes(essenceFilter.search.toLowerCase())) return false;
    if(essenceFilter.kind && e.kind!==essenceFilter.kind) return false;
    if(essenceFilter.rarity && e.rarity!==essenceFilter.rarity) return false;
    return true;
  });
  document.getElementById('essence-library').innerHTML = renderEssenceLibraryInner(list);
}
function comboKey(names){ return [...names].map(n => (n||'').toLowerCase()).sort().join('|'); }

let confluenceNameFilter = '';
let confluenceListRef = []; // the most recently rendered filtered list, indexed for removeConfluenceMatch

function matchingConfluences(){
  const selected = confluencePick.filter(Boolean);
  return state.confluenceCombos.filter(c => {
    if(!selected.every(e => c.essences.includes(e))) return false;
    if(confluenceNameFilter && !c.result.toLowerCase().includes(confluenceNameFilter.toLowerCase())) return false;
    return true;
  });
}
function onConfluenceFilterChange(){
  document.getElementById('confluence-section').innerHTML = renderConfluenceSection();
}
function renderConfluenceSection(){
  const selected = confluencePick.filter(Boolean);
  const matches = matchingConfluences();
  confluenceListRef = matches;
  let saveForm = '';
  const exactExists = matches.some(c => comboKey(c.essences)===comboKey(selected));
  if(selected.length===3 && !exactExists){
    saveForm = `<div class="suggest-box">
      <p>No known/recorded confluence for <strong>${selected.map(h).join(' + ')}</strong> yet. Decide with your group (or check the HWFWM Discord bot), then save it here so it's on hand next time:</p>
      <div class="grid grid-2">
        <div><label>Confluence essence name</label><input id="new-confluence-name"></div>
        <div><label>Description / notes</label><input id="new-confluence-desc"></div>
      </div>
      <button class="btn small" style="margin-top:0.5rem;" onclick='saveConfluence(${JSON.stringify(selected)})'>Save this combination</button>
    </div>`;
  }
  const summary = selected.length===0 && !confluenceNameFilter
    ? `Showing all ${matches.length} known combinations - pick 1-3 essences (or type a result name) to narrow it down.`
    : `${matches.length} combination(s) match${selected.length? ' ' + selected.map(h).join(' + ') : ''}${confluenceNameFilter? ' and contain "'+h(confluenceNameFilter)+'"':''}.`;
  return `<div class="muted" style="margin-bottom:0.4rem;">${summary}</div>
    ${saveForm}
    <div id="confluence-match-list">${renderConfluenceMatchList(matches)}</div>`;
}
function renderConfluenceMatchList(matches){
  if(!matches.length) return '<p class="empty">No combinations match.</p>';
  return matches.map((c,i) => `<div class="list-item" style="cursor:default;">
    <div>${c.essences.map(h).join(' + ')} &rarr; <strong>${h(c.result)}</strong> ${c.banned?'<span class="badge" style="color:var(--danger);border-color:var(--danger);">BANNED</span>':`<span class="badge">${h(c.source)}</span>`}<br><span class="muted">${h(c.description||'')}</span></div>
    <button class="btn small danger" onclick="removeConfluenceMatch(${i})">&times;</button>
  </div>`).join('');
}
function removeConfluenceMatch(i){
  const combo = confluenceListRef[i];
  if(!combo) return;
  const realIdx = state.confluenceCombos.indexOf(combo);
  if(realIdx>=0) state.confluenceCombos.splice(realIdx,1);
  document.getElementById('confluence-section').innerHTML = renderConfluenceSection();
}
function saveConfluence(picks){
  const name = document.getElementById('new-confluence-name').value.trim();
  if(!name){ alert('Give the confluence essence a name first.'); return; }
  const desc = document.getElementById('new-confluence-desc').value.trim();
  state.confluenceCombos.push({essences:picks, result:name, description:desc, source:'homebrew'});
  document.getElementById('confluence-section').innerHTML = renderConfluenceSection();
}

function newCharacter(){
  state.editingCharacterId = null;
  state.draftCharacter = blankCharacter();
  render();
}
function renderCharacterList(){
  if(!state.characters.length) return '<p class="empty">No character sheets yet.</p>';
  return state.characters.map(c => `<div class="list-item" onclick="editCharacter('${c.id}')">
    <div><strong>${h(c.name||'(unnamed)')}</strong> <span class="muted">${c.player?'played by '+h(c.player)+' &middot; ':''}${c.essences.filter(Boolean).join(', ')}${c.confluenceEssence?' &rarr; '+h(c.confluenceEssence):''}</span></div>
    <div class="row-actions" onclick="event.stopPropagation();">
      <button class="btn small danger" onclick="deleteCharacter('${c.id}')">Delete</button>
    </div>
  </div>`).join('');
}
function editCharacter(id){
  const c = state.characters.find(x => x.id===id);
  if(!c) return;
  state.editingCharacterId = id;
  state.draftCharacter = JSON.parse(JSON.stringify(c));
  render();
}
function deleteCharacter(id){
  if(!confirm('Delete this character sheet?')) return;
  state.characters = state.characters.filter(x => x.id!==id);
  render();
}
function captureCharacterForm(){
  const c = state.draftCharacter;
  if(!c || document.getElementById('c-name')===null) return;
  c.name = document.getElementById('c-name').value;
  c.player = document.getElementById('c-player').value;
  [0,1,2].forEach(i => {
    c.essences[i] = document.getElementById('c-essence-'+i).value;
    c.essenceTiers[i] = document.getElementById('c-tier-'+i).value;
  });
  c.confluenceEssence = document.getElementById('c-confluence').value;
  c.confluenceTier = document.getElementById('c-confluence-tier').value;
  c.powersNotes = document.getElementById('c-powers').value;
  c.generalNotes = document.getElementById('c-notes').value;
}
function renderCharacterForm(){
  const c = state.draftCharacter;
  return `<div class="card" style="margin-top:1rem;">
    <div style="display:flex; justify-content:space-between; align-items:center;">
      <h3>${state.editingCharacterId? 'Edit character' : 'New character'}</h3>
      <div class="row-actions">
        <button class="btn secondary" onclick="cancelCharacterForm()">Cancel</button>
        <button class="btn" onclick="saveCharacter()">Save</button>
      </div>
    </div>
    <div class="grid grid-2">
      <div><label>Name</label><input id="c-name" value="${h(c.name)}"></div>
      <div><label>Player</label><input id="c-player" value="${h(c.player)}"></div>
    </div>
    <div class="section-title">Essences <span class="muted" style="text-transform:none;">(3 chosen essences - use the Confluence Finder above for the 4th)</span></div>
    <div class="grid grid-3">
      ${[0,1,2].map(i => `<div>
        <label>Essence ${i+1}</label>
        <select id="c-essence-${i}">
          <option value="">-- choose --</option>
          ${state.essences.map(e => `<option ${c.essences[i]===e.name?'selected':''}>${h(e.name)}</option>`).join('')}
        </select>
        <select id="c-tier-${i}" style="margin-top:0.3rem;">${TIERS.map(t => `<option ${c.essenceTiers[i]===t?'selected':''}>${t}</option>`).join('')}</select>
      </div>`).join('')}
    </div>
    <div class="grid grid-2" style="margin-top:0.6rem;">
      <div><label>Confluence essence</label><input id="c-confluence" value="${h(c.confluenceEssence)}" placeholder="use the Confluence Finder above, then paste the result here"></div>
      <div><label>Confluence tier</label><select id="c-confluence-tier">${TIERS.map(t => `<option ${c.confluenceTier===t?'selected':''}>${t}</option>`).join('')}</select></div>
    </div>
    <div class="section-title">Powers</div>
    <textarea id="c-powers" placeholder="List powers per essence/tier - freeform, since you're still deciding exact power counts per tier.">${h(c.powersNotes)}</textarea>
    <div class="section-title">General notes</div>
    <textarea id="c-notes">${h(c.generalNotes)}</textarea>
  </div>`;
}
function cancelCharacterForm(){
  state.draftCharacter = null;
  state.editingCharacterId = null;
  render();
}
function saveCharacter(){
  captureCharacterForm();
  const c = state.draftCharacter;
  if(!c.name || !c.name.trim()){ alert('Give the character a name first.'); return; }
  const idx = state.characters.findIndex(x => x.id===c.id);
  if(idx>=0) state.characters[idx] = c; else state.characters.push(c);
  state.draftCharacter = null;
  state.editingCharacterId = null;
  render();
}

/* ============================== COMBAT TRACKER TAB ============================== */

let combatPick = {monsterId:'', name:'', hp:'', ac:'', tier:'Iron'};
let damageForm = {combatantId:'', amount:10, damageType: DEFAULT_DAMAGE_TYPES[0], attackerTier:''};

function renderCombat(){
  const enc = state.encounter;
  const sorted = [...enc.combatants].sort((a,b) => (b.initiative||0)-(a.initiative||0));
  return `
  <div class="card">
    <h2>Add combatant</h2>
    <div class="grid grid-4">
      <div><label>From bestiary</label>
        <select onchange="pickBestiaryCombatant(this.value)">
          <option value="">-- custom --</option>
          ${state.monsters.map(m => `<option value="${m.id}">${h(m.name)}</option>`).join('')}
        </select>
      </div>
      <div><label>Name</label><input id="cb-name" value="${h(combatPick.name)}" oninput="combatPick.name=this.value"></div>
      <div><label>Max HP</label><input id="cb-hp" value="${h(combatPick.hp)}" oninput="combatPick.hp=this.value"></div>
      <div><label>AC</label><input id="cb-ac" value="${h(combatPick.ac)}" oninput="combatPick.ac=this.value"></div>
    </div>
    <div class="grid grid-4" style="margin-top:0.5rem;">
      <div><label>Tier</label><select id="cb-tier" onchange="combatPick.tier=this.value">${TIERS.map(t => `<option ${combatPick.tier===t?'selected':''}>${t}</option>`).join('')}</select></div>
      <div><label>Initiative</label><input id="cb-init" type="number" value="0"></div>
      <div style="align-self:end;"><button class="btn" onclick="addCombatant()">+ Add to encounter</button></div>
    </div>
  </div>

  <div class="card">
    <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem;">
      <h2 style="border:none;">Encounter - Round ${enc.round}</h2>
      <div class="row-actions">
        <label style="display:flex;align-items:center;gap:0.4rem;width:auto;text-transform:none;font-size:0.85rem;"><input type="checkbox" style="width:auto;" ${enc.tyrannyOfRank?'checked':''} onchange="enc.tyrannyOfRank=this.checked"> Auto-apply Tyranny of Rank</label>
        <button class="btn secondary" onclick="nextTurn()">Next turn</button>
        <button class="btn secondary" onclick="resetEncounter()">Reset encounter</button>
      </div>
    </div>
    ${!sorted.length ? '<p class="empty">No combatants yet.</p>' : sorted.map((c) => renderCombatant(c, enc)).join('')}
  </div>

  <div class="card">
    <h2>Log damage / healing</h2>
    <div class="grid grid-4">
      <div><label>Target</label><select id="dmg-target" onchange="damageForm.combatantId=this.value">
        <option value="">-- choose --</option>
        ${enc.combatants.map(c => `<option value="${c.id}">${h(c.name)}</option>`).join('')}
      </select></div>
      <div><label>Amount (negative = heal)</label><input id="dmg-amount" type="number" value="${damageForm.amount}" oninput="damageForm.amount=Number(this.value)"></div>
      <div><label>Damage type</label><select id="dmg-type" onchange="damageForm.damageType=this.value">
        ${state.damageTypes.map(dt => `<option ${damageForm.damageType===dt?'selected':''}>${h(dt)}</option>`).join('')}
      </select></div>
      <div><label>Attacker tier (for Tyranny of Rank)</label><select id="dmg-atktier" onchange="damageForm.attackerTier=this.value">
        <option value="">n/a</option>
        ${TIERS.map(t => `<option ${damageForm.attackerTier===t?'selected':''}>${t}</option>`).join('')}
      </select></div>
    </div>
    <button class="btn" style="margin-top:0.6rem;" onclick="applyDamage()">Apply</button>
    <div class="section-title">Log</div>
    <div class="log" id="combat-log">${(enc.log||[]).slice().reverse().map(l => `<div>${h(l)}</div>`).join('') || '<div class="muted">No actions logged yet.</div>'}</div>
  </div>`;
}
function renderCombatant(c, enc){
  const pct = c.maxHp>0 ? Math.max(0, Math.min(100, Math.round(100*c.hp/c.maxHp))) : 0;
  const isActive = enc.combatants[enc.activeIndex] && enc.combatants[enc.activeIndex].id===c.id;
  return `<div class="combatant ${isActive?'active':''}">
    <div style="display:flex; justify-content:space-between; align-items:center;">
      <div><strong>${h(c.name)}</strong> <span class="muted">AC ${h(c.ac)} &middot; Tier ${h(c.tier)} &middot; Init <input type="number" value="${c.initiative}" style="width:60px;display:inline-block;" onchange="setInitiative('${c.id}', this.value)"></span></div>
      <div class="row-actions">
        ${(c.damageProfile&&c.damageProfile.length) ? '<span class="muted">'+c.damageProfile.length+' defense entries</span>' : ''}
        <button class="btn small danger" onclick="removeCombatant('${c.id}')">Remove</button>
      </div>
    </div>
    <div class="muted">HP ${c.hp} / ${c.maxHp}</div>
    <div class="hp-bar"><div style="width:${pct}%; background:${pct<25?'var(--danger)':pct<60?'var(--warn)':'var(--good)'}"></div></div>
  </div>`;
}
function pickBestiaryCombatant(monsterId){
  if(!monsterId){ combatPick = {monsterId:'', name:'', hp:'', ac:'', tier:'Iron'}; renderCombatMainOnly(); return; }
  const m = state.monsters.find(x => x.id===monsterId);
  if(!m) return;
  combatPick = {monsterId, name:m.name, hp:m.hp||'10', ac:m.ac||'10', tier:m.tier||'Iron'};
  renderCombatMainOnly();
}
function renderCombatMainOnly(){ render(); }
function addCombatant(){
  const init = Number(document.getElementById('cb-init').value)||0;
  const monster = combatPick.monsterId ? state.monsters.find(m => m.id===combatPick.monsterId) : null;
  const maxHp = Number(combatPick.hp)||10;
  state.encounter.combatants.push({
    id: uid(), name: combatPick.name || (monster? monster.name : 'Combatant'),
    monsterId: combatPick.monsterId || null,
    hp: maxHp, maxHp,
    ac: combatPick.ac || '10',
    tier: combatPick.tier || 'Iron',
    initiative: init,
    damageProfile: monster ? getEffectiveProfile(monster) : []
  });
  combatPick = {monsterId:'', name:'', hp:'', ac:'', tier:'Iron'};
  render();
}
function removeCombatant(id){
  state.encounter.combatants = state.encounter.combatants.filter(c => c.id!==id);
  render();
}
function setInitiative(id, val){
  const c = state.encounter.combatants.find(x => x.id===id);
  if(c) c.initiative = Number(val)||0;
  render();
}
function nextTurn(){
  const enc = state.encounter;
  if(!enc.combatants.length) return;
  const sorted = [...enc.combatants].sort((a,b) => (b.initiative||0)-(a.initiative||0));
  let idx = sorted.findIndex(c => enc.combatants[enc.activeIndex] && c.id===enc.combatants[enc.activeIndex].id);
  idx = (idx+1) % sorted.length;
  if(idx===0) enc.round++;
  enc.activeIndex = enc.combatants.findIndex(c => c.id===sorted[idx].id);
  render();
}
function resetEncounter(){
  if(!confirm('Clear all combatants and reset the encounter?')) return;
  state.encounter = { combatants: [], round: 1, activeIndex: -1, tyrannyOfRank: state.encounter.tyrannyOfRank, log: [] };
  render();
}
function applyDamage(){
  const enc = state.encounter;
  const target = enc.combatants.find(c => c.id===damageForm.combatantId);
  if(!target){ alert('Pick a target first.'); return; }
  const amount = damageForm.amount||0;
  enc.log = enc.log || [];
  if(amount < 0){
    const heal = -amount;
    target.hp = Math.min(target.maxHp, target.hp + heal);
    enc.log.push(target.name+' heals '+heal+' HP (now '+target.hp+'/'+target.maxHp+').');
  } else {
    const result = resolveDamage(target.damageProfile||[], damageForm.damageType, amount, tierIndex(damageForm.attackerTier), tierIndex(target.tier), enc.tyrannyOfRank);
    target.hp = Math.max(0, target.hp - result.amount);
    enc.log.push(target.name+' takes '+result.amount+' '+damageForm.damageType+' damage (now '+target.hp+'/'+target.maxHp+'). '+result.log.join(' '));
  }
  render();
}

/* ============================== INIT ============================== */
render();
