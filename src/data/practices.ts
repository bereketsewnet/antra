export interface Practice {
  id: string
  tag: string
  title: string
  image: string
  short: string
  modules?: string[]
}

export const practices: Practice[] = [
  {
    id: 'org',
    tag: 'Practice 01',
    title: 'Organizational Transformation',
    image: '/assets/consultancy%20assets/org-transformation.webp',
    short: 'Strategy alignment, structure design, change management, and cultural transformation corporate governance and functional transformation. We are usually engaged through implementation, which is the phase where these programs tend to come apart if a firm is not careful.',
    modules: [
      'Organizational transformation programs',
      'Organizational strategy and goals formulations',
      'Compliance and risk management',
      'Reward and compensation formulation',
      'Employees experience survey and action plans',
      'Cultural transformation and policy formulation',
      'Organizational design and change management',
      'Business model transformation including service and product development and design',
    ],
  },
  {
    id: 'leadership',
    tag: 'Practice 02',
    title: 'Leadership Development Programs',
    image: '/assets/consultancy%20assets/leadership-development.webp',
    short: 'Programs for executives and all level managers, designed and delivered in formats that fit how Ethiopian and regional businesses operate. We run cohort programs, intensive workshops, and one-to-one development tracks depending on what the client needs.',
    modules: [
      'Leadership Development Program',
      'Global Leadership Development Program',
      'Strategic Leadership Program',
      'Management Development Program',
      'Supervisory Development Program',
    ],
  },
  {
    id: 'people-mgmt',
    tag: 'Practice 03',
    title: 'Training on People Management',
    image: '/assets/consultancy%20assets/coaching-mentorship.webp',
    short: 'Experienced in talent review and succession planning, performance management, reward and compensation management, employee relations and engagement and union management, strategic HR resource management, HR planning and development, organizational design, workforce planning and development, and competency-based assessment.',
  },
  {
    id: 'talent',
    tag: 'Practice 04',
    title: 'Talent Search & Assessments',
    image: '/assets/consultancy%20assets/talent-search.webp',
    short: 'We help organizations attract, assess, and retain top talent through executive and key talent search, talent mapping, assessment and profiling, onboarding support, and career planning, pre-employment review ensuring the right people are positioned for both immediate impact and future growth.',
  },
  {
    id: 'advisory',
    tag: 'Practice 05',
    title: 'Advisory & Change',
    image: '/assets/consultancy%20assets/org-transformation.webp',
    short: 'Our expertise includes strategy formulation, organizational transformation, change management, project management, leadership and young talent development, SME development, functional and technical capability building. By working closely with our clients, we deliver tailored solutions that address real business challenges and create lasting value.',
  },
  {
    id: 'coaching',
    tag: 'Practice 06',
    title: 'Coaching & Mentorship',
    image: '/assets/consultancy%20assets/coaching-mentorship.webp',
    short: 'One-to-one and team coaching for senior leaders working through transitions, expansion, restructuring, or performance challenges. We provide specialized services in coaching managers, coaching leaders, 360 assessments, career consultation and leadership development.',
  },
]

export function getPracticeById(id: string | undefined): Practice | undefined {
  return practices.find((p) => p.id === id)
}
