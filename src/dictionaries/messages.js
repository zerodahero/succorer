const messages = {
  affirmative: [
    'mind your {TOPIC}',
    'remember {TOPIC}',
    '{TOPIC} is important',
    'good things come to those who {TOPIC}',
    '{TOPIC} check in',
    'do the {TOPIC} real good-like'
  ],
  negative: [
    'you better not be sucking at {TOPIC}',
    'don\'t be bad at {TOPIC}',
    'try not to be so terrible at {TOPIC}',
    'others do the {TOPIC} better than you'
  ]
}

export default function (topic = 'posture', polarity = ['affirmative']) {
  let choices = []
  const options = ['affirmative', 'negative']
  options.forEach(element => {
    if (polarity.includes(element)) {
      choices.push(...messages[element])
    }
  })

  let choice = choices[Math.floor(Math.random() * choices.length)]
  return choice.replace('{TOPIC}', topic.toLowerCase())
}
