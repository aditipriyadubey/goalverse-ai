export type LangCode = 'en' | 'hi' | 'es' | 'fr' | 'pt' | 'ar';

export const RTL_LANGS: LangCode[] = ['ar'];

export const LANGUAGE_LABELS: Record<LangCode, string> = {
  en: 'English',
  hi: 'हिन्दी',
  es: 'Español',
  fr: 'Français',
  pt: 'Português',
  ar: 'العربية',
};

/**
 * Static interface copy, translated up front (this is NOT the AI translation
 * feature — that's a separate live endpoint for free-text fan questions, see
 * the Translate page / navTranslate below).
 * Keeping interface chrome statically translated means the nav and labels
 * never depend on network latency or AI availability.
 */
export const UI_STRINGS: Record<LangCode, Record<string, string>> = {
  en: {
    appName: 'GoalVerse AI',
    tagline: 'Where the Stadium Thinks Like a Team',
    navHome: 'Field',
    navNavigator: 'Navigator',
    navCrowd: 'Crowd Watch',
    navPlanner: 'Match Planner',
    navTranslate: 'Translate',
    navAccessibility: 'Accessibility',
    navEco: 'Eco Score',
    navVolunteer: 'Volunteer Desk',
    navOrganizer: 'Control Room',
    skipToContent: 'Skip to main content',
  },
  hi: {
    appName: 'गोलवर्स एआई',
    tagline: 'जहाँ स्टेडियम एक टीम की तरह सोचता है',
    navHome: 'मैदान',
    navNavigator: 'नेविगेटर',
    navCrowd: 'भीड़ नज़र',
    navPlanner: 'मैच योजना',
    navTranslate: 'अनुवाद',
    navAccessibility: 'सुगमता',
    navEco: 'इको स्कोर',
    navVolunteer: 'स्वयंसेवक डेस्क',
    navOrganizer: 'नियंत्रण कक्ष',
    skipToContent: 'मुख्य सामग्री पर जाएं',
  },
  es: {
    appName: 'GoalVerse AI',
    tagline: 'Donde el Estadio Piensa Como un Equipo',
    navHome: 'Cancha',
    navNavigator: 'Navegador',
    navCrowd: 'Vigilancia de Multitud',
    navPlanner: 'Plan del Día de Partido',
    navTranslate: 'Traducir',
    navAccessibility: 'Accesibilidad',
    navEco: 'Puntaje Ecológico',
    navVolunteer: 'Mesa de Voluntarios',
    navOrganizer: 'Sala de Control',
    skipToContent: 'Saltar al contenido principal',
  },
  fr: {
    appName: 'GoalVerse AI',
    tagline: "Là où le Stade Pense Comme une Équipe",
    navHome: 'Terrain',
    navNavigator: 'Navigateur',
    navCrowd: 'Surveillance de la Foule',
    navPlanner: 'Planificateur de Match',
    navTranslate: 'Traduire',
    navAccessibility: 'Accessibilité',
    navEco: 'Score Écologique',
    navVolunteer: 'Bureau des Bénévoles',
    navOrganizer: 'Salle de Contrôle',
    skipToContent: 'Aller au contenu principal',
  },
  pt: {
    appName: 'GoalVerse AI',
    tagline: 'Onde o Estádio Pensa Como uma Equipe',
    navHome: 'Campo',
    navNavigator: 'Navegador',
    navCrowd: 'Vigilância da Multidão',
    navPlanner: 'Planejador do Dia do Jogo',
    navTranslate: 'Traduzir',
    navAccessibility: 'Acessibilidade',
    navEco: 'Pontuação Ecológica',
    navVolunteer: 'Mesa de Voluntários',
    navOrganizer: 'Sala de Controle',
    skipToContent: 'Pular para o conteúdo principal',
  },
  ar: {
    appName: 'غولفيرس AI',
    tagline: 'حيث يفكر الملعب كفريق واحد',
    navHome: 'الملعب',
    navNavigator: 'الملاح',
    navCrowd: 'مراقبة الحشود',
    navPlanner: 'مخطط يوم المباراة',
    navTranslate: 'ترجمة',
    navAccessibility: 'إمكانية الوصول',
    navEco: 'النقاط البيئية',
    navVolunteer: 'مكتب المتطوعين',
    navOrganizer: 'غرفة التحكم',
    skipToContent: 'الانتقال إلى المحتوى الرئيسي',
  },
};