const insults = [
  'turd',
  'bench',
  'muffin face',
  'sloppy penguin',
  'cough drop',
  'left-handed revolving door',
  'broken crane',
  'irregular coffee filter',
  'piece of flavorless bubble gum',
  'poo',
  'saggy ankle sock'
]

export default function (prefix = 'you', leadingComma = true) {
  let insult = []
  if (leadingComma) {
    insult.push(',')
  }
  insult.push(prefix)
  insult.push(insults[Math.floor(Math.random() * insults.length)])
  return insult.join(' ')
}
