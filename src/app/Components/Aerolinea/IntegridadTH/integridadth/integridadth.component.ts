import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Situation {
  title: string;
  context: string;
  red: string;
  yellow: string;
  green: string;
  message: string;
}

interface Option {
  text: string;
  color: string;
  icon: string;
  revealed: boolean;
  selected: boolean;
}

@Component({
  selector: 'app-integridadth',
  imports: [CommonModule],
  templateUrl: './integridadth.component.html',
  styleUrl: './integridadth.component.css'
})
export class IntegridadthComponent implements OnDestroy {

  // Estado de la pantalla: 'start', 'game', 'feedback', 'end'
  currentScreen: string = 'start';

  numQuestionsInput: number = 5;
  score: number = 0;
  currentIndex: number = 0;
  timeLeft: number = 10;

  db: Situation[] = [];
  currentSituation?: Situation;
  options: Option[] = [];
  optionsRevealed: boolean = false;

  // Temporizadores
  timerInterval: any;
  readingDelay: any;
  isReading: boolean = false;

  // Feedback State
  feedbackIcon: string = '';
  feedbackTitle: string = '';
  feedbackClass: string = '';
  expectedAction: string = '';
  feedbackMessage: string = '';

  private readonly db_original: Situation[] = [
    {
        title: "HONESTIDAD – 'El registro'",
        context: "Al revisar un registro de atención, notas que una actividad no quedó registrada en el momento en que se realizó. Un compañero te dice: 'Regístrala como si se hubiera hecho en ese momento; total, sí se realizó'.",
        red: "La registro con la hora anterior para que quede completo.",
        yellow: "No hago nada porque la actividad sí se realizó.",
        green: "Informo la situación y realizo el registro de acuerdo con el procedimiento establecido.",
        message: "Ser honesto no es hacer que todo parezca perfecto; es registrar la realidad con transparencia."
    },
    {
        title: "HONESTIDAD – Un error en un registro",
        context: "Después de realizar un registro, notas que cometiste un error. Nadie lo ha detectado.",
        red: "Lo dejo así para evitar problemas.",
        yellow: "Espero a que alguien me diga algo.",
        green: "Informo el error y busco corregirlo.",
        message: "Reconocer un error también es actuar con integridad."
    },
    {
        title: "HONESTIDAD – Objeto encontrado",
        context: "Encuentras dinero u otro objeto de valor en una zona común de la institución.",
        red: "Me lo quedo.",
        yellow: "Pregunto informalmente si alguien lo perdió.",
        green: "Lo entrego siguiendo el procedimiento institucional.",
        message: "Lo correcto sigue siendo correcto aunque nadie esté mirando."
    },
    {
        title: "RESPETO – Usuario alterado",
        context: "Un usuario está molesto y eleva la voz durante la atención.",
        red: "Respondo con el mismo tono.",
        yellow: "Lo ignoro hasta que se calme.",
        green: "Mantengo un trato respetuoso y busco orientar la situación.",
        message: "El respeto también se demuestra en los momentos difíciles."
    },
    {
        title: "RESPETO – Compañero",
        context: "Escuchas a varios compañeros haciendo comentarios negativos sobre otro colaborador que no está presente.",
        red: "Me uno a los comentarios.",
        yellow: "Me quedo escuchando sin intervenir.",
        green: "Evito participar y promuevo un trato respetuoso.",
        message: "Hablar de otros también hace parte de nuestra forma de relacionarnos."
    },
    {
        title: "RESPETO – Diferencias",
        context: "Un compañero tiene una forma de trabajar diferente a la tuya.",
        red: "Digo que su manera está mal.",
        yellow: "Evito trabajar con él.",
        green: "Escucho, dialogo y busco puntos de acuerdo.",
        message: "Las diferencias no deben convertirse en barreras para trabajar en equipo."
    },
    {
        title: "COMPROMISO – Trabajo pendiente",
        context: "Finaliza tu jornada y sabes que queda una tarea importante pendiente que puede afectar al equipo siguiente.",
        red: "Me voy porque ya terminó mi turno.",
        yellow: "Espero que alguien más la encuentre.",
        green: "Informo y dejo claramente establecido el estado de la tarea.",
        message: "El compromiso también significa pensar en quienes continúan nuestro trabajo."
    },
    {
        title: "COMPROMISO – Trabajo en equipo",
        context: "Un compañero necesita apoyo para cumplir una actividad importante y tienes disponibilidad.",
        red: "Digo que no es mi problema.",
        yellow: "Espero a que otra persona lo ayude.",
        green: "Brindo apoyo dentro de mis posibilidades.",
        message: "El compromiso se demuestra cuando entendemos que nuestros resultados también impactan al equipo."
    },
    {
        title: "DILIGENCIA – Solicitud urgente",
        context: "Recibes una solicitud que requiere atención y sabes que retrasarla puede afectar a otra persona.",
        red: "La dejo para después.",
        yellow: "La atiendo cuando tenga tiempo.",
        green: "La gestiono oportunamente o informo si existe alguna dificultad.",
        message: "La diligencia es hacer lo que corresponde, de manera oportuna y responsable."
    },
    {
        title: "DILIGENCIA – Entrega de información",
        context: "Debes entregar información a otra área, pero no estás seguro de que esté completa.",
        red: "La envío así para salir del paso.",
        yellow: "Espero que ellos detecten lo que falta.",
        green: "Verifico la información antes de enviarla.",
        message: "Hacer las cosas bien también es hacerlas con cuidado."
    },
    {
        title: "JUSTICIA – Trato preferencial",
        context: "Un conocido te solicita que le des prioridad sobre otras personas que están esperando.",
        red: "Le doy prioridad porque lo conozco.",
        yellow: "Busco una manera de ayudarlo sin que se note.",
        green: "Respeto los criterios y procedimientos establecidos.",
        message: "La justicia significa actuar sin preferencias ni privilegios indebidos."
    },
    {
        title: "JUSTICIA – Distribución de tareas",
        context: "En tu equipo deben distribuir una tarea adicional.",
        red: "Propongo que siempre la haga la misma persona.",
        yellow: "Dejo que otros decidan.",
        green: "Busco una distribución equitativa de acuerdo con las responsabilidades.",
        message: "Ser justos también significa buscar condiciones equilibradas para todos."
    },
    {
        title: "TOLERANCIA – Diferencia de opinión",
        context: "Durante una reunión, un compañero expresa una opinión diferente a la tuya.",
        red: "Lo interrumpo.",
        yellow: "Ignoro completamente su opinión.",
        green: "Escucho y expreso mi punto de vista con respeto.",
        message: "No tenemos que pensar igual para trabajar juntos."
    },
    {
        title: "TOLERANCIA – Momento de presión",
        context: "Un compañero está teniendo un día difícil y responde de manera poco amable.",
        red: "Le respondo de la misma manera.",
        yellow: "Empiezo una discusión.",
        green: "Mantengo la calma y busco comprender la situación.",
        message: "La tolerancia nos invita a responder con equilibrio, especialmente en situaciones difíciles."
    },
    {
        title: "🚨 SITUACIÓN COMPLEJA – 'El favor'",
        context: "Un compañero te pide que firmes un documento que no revisaste porque 'es urgente y después lo miramos'.",
        red: "Lo firmo para ayudarlo.",
        yellow: "Lo firmo porque confío en él.",
        green: "Me niego a firmarlo hasta verificar la información.",
        message: "Valor: Honestidad / Diligencia. La firma es tu respaldo de responsabilidad."
    },
    {
        title: "🚨 SITUACIÓN COMPLEJA – 'El regalo'",
        context: "Un usuario agradecido por la atención te ofrece un regalo personal.",
        red: "Lo acepto porque fue un gesto de agradecimiento.",
        yellow: "Lo recibo y luego decido qué hacer.",
        green: "Actúo conforme a las orientaciones y normas institucionales.",
        message: "Valor: Honestidad / Integridad. Nuestro deber no está condicionado a beneficios adicionales."
    },
    {
        title: "🚨 SITUACIÓN COMPLEJA – 'El conocido'",
        context: "Llega una persona que conoces y te pide que la atiendas primero porque 'solo necesita una cosa rápida'.",
        red: "La atiendo primero.",
        yellow: "Le digo que espere, pero intento ayudarla antes.",
        green: "Mantengo los criterios de atención establecidos.",
        message: "Valor: Justicia. Todos los usuarios merecen el mismo respeto por su tiempo."
    },
    {
        title: "🚨 SITUACIÓN COMPLEJA – 'No es mi área'",
        context: "Observas una situación que puede afectar la atención de un usuario, pero no corresponde directamente a tus funciones.",
        red: "No hago nada porque no es mi responsabilidad.",
        yellow: "Espero que otra persona actúe.",
        green: "Informo o canalizo la situación con quien corresponda.",
        message: "Valor: Compromiso. El cuidado y servicio es responsabilidad de todos."
    },
    {
        title: "🚨 SITUACIÓN COMPLEJA – 'El comentario'",
        context: "Un compañero hace un comentario despectivo sobre otro colaborador frente a varias personas.",
        red: "Me río para no generar incomodidad.",
        yellow: "No digo nada.",
        green: "Evito normalizar el comentario y promuevo un trato respetuoso.",
        message: "Valor: Respeto / Tolerancia. El silencio ante el irrespeto lo normaliza."
    },
    {
        title: "🚨 SITUACIÓN COMPLEJA – 'El error del compañero'",
        context: "Te das cuenta de que un compañero cometió un error que podría afectar un proceso.",
        red: "Lo oculto para evitarle problemas.",
        yellow: "No digo nada porque no fue mi error.",
        green: "Informo oportunamente para que pueda corregirse.",
        message: "Valor: Honestidad / Compromiso. El objetivo es proteger el proceso y a las personas, no buscar culpables."
    }
  ];

  ngOnDestroy() {
    this.clearTimers();
  }

  // --- Helpers Aleatoriedad ---
  private shuffleArray(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  private getRandomQuestions(num: number): Situation[] {
    let tempArray = [...this.db_original];
    let selected: Situation[] = [];

    for (let i = 0; i < num; i++) {
      if (tempArray.length === 0) break;
      let randomIndex = Math.floor(Math.random() * tempArray.length);
      selected.push(tempArray[randomIndex]);
      tempArray.splice(randomIndex, 1);
    }
    return selected;
  }

  // --- Lógica de Navegación ---
  updateNumQuestions(event: any) {
    let val = parseInt(event.target.value);
    if (isNaN(val) || val < 1) val = 1;
    if (val > 20) val = 20;
    this.numQuestionsInput = val;
    event.target.value = val;
  }

  startGame() {
    this.db = this.getRandomQuestions(this.numQuestionsInput);
    this.currentIndex = 0;
    this.score = 0;
    this.loadQuestion();
  }

  forceEndGame() {
    this.clearTimers();
    this.endGame();
  }

  loadQuestion() {
    if (this.currentIndex >= this.db.length) {
      this.endGame();
      return;
    }

    this.currentSituation = this.db[this.currentIndex];
    this.optionsRevealed = false;

    const rawOptions: Option[] = [
      { text: this.currentSituation.red, color: 'red', icon: '🔴', revealed: false, selected: false },
      { text: this.currentSituation.yellow, color: 'yellow', icon: '🟡', revealed: false, selected: false },
      { text: this.currentSituation.green, color: 'green', icon: '🟢', revealed: false, selected: false }
    ];

    this.shuffleArray(rawOptions);
    this.options = rawOptions;

    this.currentScreen = 'game';
    this.clearTimers();

    this.timeLeft = 10;
    this.isReading = true;

    this.readingDelay = setTimeout(() => {
      this.isReading = false;
      this.startTimer();
    }, 2000);
  }

  startTimer() {
    this.timeLeft = 10;
    clearInterval(this.timerInterval);

    this.timerInterval = setInterval(() => {
      this.timeLeft--;
      if (this.timeLeft <= 0) {
        clearInterval(this.timerInterval);
        this.processTimeout();
      }
    }, 1000);
  }

  selectAnswer(selectedOpt: Option) {
    if (this.optionsRevealed) return; // Prevenir doble clic

    this.clearTimers();
    this.optionsRevealed = true;

    // Revelar todos
    this.options.forEach(opt => opt.revealed = true);
    // Marcar el seleccionado
    selectedOpt.selected = true;

    setTimeout(() => {
      this.showFeedback(selectedOpt.color);
    }, 1500);
  }

  processTimeout() {
    this.optionsRevealed = true;
    this.options.forEach(opt => opt.revealed = true);

    setTimeout(() => {
      this.showFeedback('timeout');
    }, 1500);
  }

  showFeedback(resultColor: string) {
    this.expectedAction = this.currentSituation!.green;
    this.feedbackMessage = this.currentSituation!.message;

    if (resultColor === 'green') {
      this.score++;
      this.feedbackTitle = '¡DECISIÓN CORRECTA!';
      this.feedbackClass = 'correct';
      this.feedbackIcon = '🟢';
    } else if (resultColor === 'timeout') {
      this.feedbackTitle = '¡TIEMPO AGOTADO!';
      this.feedbackClass = 'timeout';
      this.feedbackIcon = '⏰';
    } else {
      this.feedbackTitle = 'DECISIÓN INCORRECTA';
      this.feedbackClass = 'incorrect';
      this.feedbackIcon = resultColor === 'red' ? '🔴' : '🟡';
    }

    this.currentScreen = 'feedback';
  }

  nextQuestion() {
    this.currentIndex++;
    this.loadQuestion();
  }

  endGame() {
    this.currentScreen = 'end';
  }

  resetGame() {
    this.currentScreen = 'start';
  }

  private clearTimers() {
    if (this.readingDelay) clearTimeout(this.readingDelay);
    if (this.timerInterval) clearInterval(this.timerInterval);
  }
}
