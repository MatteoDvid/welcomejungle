export class OpenAIService {
  static async generateBio(interests: string[], activities: string[], role: string): Promise<string> {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // In production, this would call OpenAI API
    const bioTemplates = [
      `Passionné(e) ${role.toLowerCase()} avec un amour profond pour ${interests.slice(0, 2).join(" et ")}. J'adore découvrir de nouvelles technologies, partager mes connaissances avec mes collègues et créer des solutions innovantes. Quand je ne suis pas en train de coder ou de concevoir, vous me trouverez probablement en train de prendre un ${activities[0]} avec des collègues, discutant des dernières tendances et échangeant des idées créatives. Je crois fermement que les meilleures innovations naissent de la collaboration et de la diversité des perspectives. Toujours prêt(e) à aider, à apprendre et à relever de nouveaux défis ! ✨`,
      
      `${role} créatif(ve) et enthousiaste, passionné(e) par ${interests[0]} et ${interests[1]}. Mon approche du travail combine expertise technique et créativité, toujours dans l'optique de créer des expériences exceptionnelles. J'aime particulièrement les moments de ${activities[0]} avec l'équipe - c'est souvent là que naissent les meilleures idées ! En dehors du travail, je m'investis dans ${interests.slice(2, 4).join(" et ")}, ce qui nourrit ma créativité et m'apporte une perspective unique sur mes projets. Je suis convaincu(e) que l'innovation vient de la diversité des expériences et j'adore partager mes découvertes avec mes collègues. Accessible et toujours prêt(e) pour une discussion enrichissante ! 🚀`,
      
      `${role} passionné(e) qui trouve son énergie dans ${interests[0]} et l'exploration de ${interests[1]}. Mon parcours m'a appris que les meilleures solutions émergent quand on combine expertise technique et empathie humaine. J'adore organiser des sessions de ${activities[0]} spontanées - c'est incroyable comme les conversations informelles peuvent transformer une journée ! Curieux(se) de nature, je suis toujours en quête d'apprentissage, que ce soit en explorant ${interests.slice(2).join(", ")} ou en découvrant de nouvelles méthodes de travail. Je crois que chaque collègue a quelque chose d'unique à apporter, et j'aime créer des espaces où chacun peut s'épanouir et contribuer. Venez me parler de vos projets, je suis toujours partant(e) pour un brainstorming ! ☕`,
      
      `En tant que ${role.toLowerCase()}, je mets ma passion pour ${interests.slice(0, 2).join(" et ")} au service de projets qui me tiennent à cœur. Mon approche se base sur l'écoute, la collaboration et l'innovation continue. Vous me croiserez souvent en train de proposer des ${activities[0]} à l'équipe - j'adore ces moments d'échange qui renforcent les liens et font émerger de nouvelles idées. Mes centres d'intérêt incluent ${interests.join(", ")}, et j'aime partager mes découvertes avec mes collègues. Je crois fermement que la diversité des perspectives enrichit nos projets et notre environnement de travail. Si vous avez envie de discuter d'un projet, d'échanger sur une passion commune ou simplement de prendre une pause créative, n'hésitez pas à venir me voir ! 💡`,
      
      `${role} avec une approche humaine et collaborative du travail. Ma passion pour ${interests[0]} et ${interests[1]} influence ma manière de voir les projets - toujours avec un œil créatif et une volonté d'innover. J'organise régulièrement des ${activities[0]} avec l'équipe parce que je crois que les meilleures collaborations naissent dans la convivialité. Mes autres passions (${interests.slice(2).join(", ")}) m'apportent des perspectives variées que j'adore intégrer dans mon travail. Je suis convaincu(e) que chaque interaction est une opportunité d'apprendre et de grandir ensemble. Que vous ayez besoin d'un regard neuf sur un projet, d'un partenaire de brainstorming ou simplement d'une conversation inspirante, je suis là ! Toujours partant(e) pour découvrir de nouvelles idées et relever des défis ensemble. 🌟`,
    ]

    return bioTemplates[Math.floor(Math.random() * bioTemplates.length)]
  }

  static async suggestActivity(participants: string[], sharedInterests: string[]): Promise<string> {
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const activities = [
      `Coffee & ${sharedInterests[0]} Chat`,
      `${sharedInterests[0]} Brainstorming Session`,
      `Lunch Discussion about ${sharedInterests[0]}`,
      `${sharedInterests[0]} Workshop`,
      `Casual ${sharedInterests[0]} Meetup`,
    ]

    return activities[Math.floor(Math.random() * activities.length)]
  }
}
