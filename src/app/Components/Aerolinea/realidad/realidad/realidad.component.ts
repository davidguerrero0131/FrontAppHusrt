import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-realidad',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './realidad.component.html',
  styleUrl: './realidad.component.css'
})
export class RealidadComponent implements AfterViewInit {
  @ViewChild('wheelCanvas')
  wheelCanvas!: ElementRef<HTMLCanvasElement>;

  canvas!: HTMLCanvasElement;
  ctx!: CanvasRenderingContext2D;

  score = 0;

  spinning = false;

  currentAngle = 0;

  selectedAnswer: number | null = null;

  isCorrect = false;

  answersDisabled = false;

  questionText = '¡Gira la ruleta para comenzar!';

  currentOptions: string[] = [];

  currentQuestion: any = null;

  message = '';

  showInstructions = true;

  showSuccessModal = false;

  showLoseModal = false;

  showWinModal = false;

  colors = [
    "#2E247F",
    "#4B3FAF",
    "#6B63D9",
    "#1BB8B5",
    "#2D2A8C",
    "#5A52C9",
    "#18C6C3",
    "#3A3197",
    "#7B74E8",
    "#14B1AE",
    "#4337A3"
  ];

  allQuestions = [

    {
      q: "¿Qué es la seguridad de la información?",
      options: [
        "Es un sistema operativo",
        "Es el conjunto de medidas para proteger la información",
        "Es un antivirus",
        "Es un tipo de servidor"
      ],
      correct: 1
    },

    {
      q: "¿Qué norma internacional está relacionada con la gestión de seguridad de la información?",
      options: [
        "ISO 9001",
        "ISO 14001",
        "ISO/IEC 27001",
        "ISO 45001"
      ],
      correct: 2
    },

    {
      q: "¿Cuáles son los tres pilares de la seguridad de la información?",
      options: [
        "Velocidad, control y monitoreo",
        "Hardware, software y nube",
        "Confidencialidad, Integridad y Disponibilidad",
        "Usuarios, red y equipos"
      ],
      correct: 2
    },

    {
      q: "¿Qué es un incidente de Seguridad de la Información?",
      options: [
        "Una actualización de software",
        "Un evento que compromete la información",
        "Un daño físico en un computador",
        "Una copia de seguridad"
      ],
      correct: 1
    },

    {
      q: "¿Qué debe hacer un usuario al recibir un correo sospechoso?",
      options: [
        "Abrir los enlaces",
        "Responder el correo",
        "No abrir archivos y reportarlo",
        "Compartirlo con compañeros"
      ],
      correct: 2
    },

    {
      q: "¿Qué consecuencias puede generar compartir historia clínica de un paciente?",
      options: [
        "Mejora de procesos",
        "Pérdidas económicas y sanciones",
        "Aumento de velocidad",
        "Ninguna"
      ],
      correct: 1
    },

    {
      q: "¿Cómo reporto un incidente de Seguridad de la Información?",
      options: [
        "Llamando a recepción",
        "Por WhatsApp",
        "A través del formulario de Almera",
        "Por redes sociales"
      ],
      correct: 2
    },

    {
      q: "¿Qué es el acceso no autorizado?",
      options: [
        "Entrar a información sin permiso",
        "Instalar un software",
        "Crear un usuario",
        "Actualizar un sistema"
      ],
      correct: 0
    },

    {
      q: "¿Qué riesgos existen al compartir usuarios y contraseñas?",
      options: [
        "Mejora la seguridad",
        "Reduce errores",
        "Pérdida de trazabilidad y accesos indebidos",
        "Ningún riesgo"
      ],
      correct: 2
    },

    {
      q: "¿Por qué es importante bloquear el computador al ausentarse?",
      options: [
        "Para ahorrar energía",
        "Para evitar accesos no autorizados",
        "Para actualizar programas",
        "Para reiniciar el sistema"
      ],
      correct: 1
    },

    {
      q: "¿Qué es la ISO/IEC 27001?",
      options: [
        "Un antivirus",
        "Un firewall",
        "Una norma de gestión de seguridad de la información",
        "Un sistema operativo"
      ],
      correct: 2
    }

  ];

  questions = [...this.allQuestions];

  ngAfterViewInit(): void {

    this.canvas = this.wheelCanvas.nativeElement;

    this.ctx = this.canvas.getContext('2d')!;

    this.resizeCanvas();

    window.addEventListener('resize', () => {
      this.resizeCanvas();
    });

  }

  resizeCanvas(): void {

    const size = this.canvas.offsetWidth;

    this.canvas.width = size;

    this.canvas.height = size;

    this.drawWheel();

  }

  drawWheel(): void {

    const size = this.canvas.width;

    const center = size / 2;

    const radius = center - 10;

    this.ctx.clearRect(0, 0, size, size);

    if (this.questions.length === 0) return;

    const arc = (2 * Math.PI) / this.questions.length;

    this.questions.forEach((q: any, index: number) => {

      const start = index * arc + this.currentAngle;

      const end = start + arc;

      this.ctx.beginPath();

      this.ctx.moveTo(center, center);

      this.ctx.arc(center, center, radius, start, end);

      this.ctx.fillStyle =
        this.colors[index % this.colors.length];

      this.ctx.fill();

      this.ctx.strokeStyle = '#fff';

      this.ctx.lineWidth = 3;

      this.ctx.stroke();

      this.ctx.save();

      this.ctx.translate(center, center);

      this.ctx.rotate(start + arc / 2);

      this.ctx.textAlign = 'right';

      this.ctx.fillStyle = '#fff';

      const fontSize = size * 0.05;

      this.ctx.font =
        `bold ${fontSize}px Segoe UI`;

      this.ctx.fillText(
        `${index + 1}`,
        radius - 20,
        8
      );

      this.ctx.restore();

    });

    this.ctx.beginPath();

    this.ctx.arc(
      center,
      center,
      size * 0.12,
      0,
      Math.PI * 2
    );

    this.ctx.fillStyle = '#18C6C3';

    this.ctx.fill();

    this.ctx.fillStyle = '#fff';

    this.ctx.textAlign = 'center';

    this.ctx.textBaseline = 'middle';

    this.ctx.font =
      `bold ${size * 0.05}px Segoe UI`;

    this.ctx.fillText(
      'GIRA',
      center,
      center
    );

  }

  spinWheel(): void {

    if (this.spinning || this.questions.length === 0) return;

    this.spinning = true;

    this.questionText = 'Girando la ruleta...';

    this.currentOptions = [];

    this.message = '';

    const extraRotation =
      Math.random() * 360 + 1800;

    const duration = 5000;

    const start = performance.now();

    const initialAngle = this.currentAngle;

    const finalAngle =
      this.currentAngle +
      (extraRotation * Math.PI / 180);

    const animate = (now: number) => {

      const elapsed = now - start;

      const progress =
        Math.min(elapsed / duration, 1);

      const easeOut =
        1 - Math.pow(1 - progress, 4);

      this.currentAngle =
        initialAngle +
        (finalAngle - initialAngle) * easeOut;

      this.drawWheel();

      if (progress < 1) {

        requestAnimationFrame(animate);

      } else {

        this.spinning = false;

        const arc =
          (2 * Math.PI) / this.questions.length;

        const normalized =
          (2 * Math.PI -
            (this.currentAngle % (2 * Math.PI)))
          % (2 * Math.PI);

        const selectedIndex =
          Math.floor(normalized / arc)
          % this.questions.length;

        this.currentQuestion =
          this.questions[selectedIndex];

        this.currentQuestion.index =
          selectedIndex;

        this.showQuestion();

      }

    };

    requestAnimationFrame(animate);

  }

  showQuestion(): void {

    this.questionText =
      this.currentQuestion.q;

    this.currentOptions =
      this.currentQuestion.options;

    this.answersDisabled = false;

    this.selectedAnswer = null;

  }

  checkAnswer(index: number): void {

    this.selectedAnswer = index;

    this.answersDisabled = true;

    if (index === this.currentQuestion.correct) {

      this.isCorrect = true;

      this.score += 5;

      this.message =
        'Respuesta correcta. +5 puntos';

      this.showSuccessModal = true;

      this.questions.splice(
        this.currentQuestion.index,
        1
      );

      this.drawWheel();

      setTimeout(() => {

        this.showSuccessModal = false;

        if (this.questions.length === 0) {

          this.showWinModal = true;

        }

      }, 2000);

    } else {

      this.isCorrect = false;

      this.message =
        'Respuesta incorrecta';

      setTimeout(() => {

        this.showLoseModal = true;

      }, 1000);

    }

  }

  restartGame(): void {

    this.questions = [...this.allQuestions];

    this.score = 0;

    this.currentAngle = 0;

    this.questionText =
      '¡Gira la ruleta para comenzar!';

    this.currentOptions = [];

    this.message = '';

    this.showLoseModal = false;

    this.showWinModal = false;

    this.selectedAnswer = null;

    this.answersDisabled = false;

    this.drawWheel();

  }

  startGame(): void {

    this.showInstructions = false;

  }


}
