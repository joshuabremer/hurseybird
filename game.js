// @ts-check

// Hursey Bird
// General settings

/**
 * @type {7} Gravity affecting the bird
 */
const gravity = 2;

/**
 * @type {1} Speed of the game
 */
const speed = 4;

/**
 * @type {number} Height of the bird's jump
 */
const jumpHeight = 5.2;

/**–
 * @type {number} Gap between the pipes
 */
const pipeGap = 310;
/**
 * @type {2} Selected teacher (1-8)
 * Pick a teacher!π
 * 1: mr. newberry
 * 2: ms. lizzy
 * 3: dr. schavel
 * 4: mr. martin
 * 5: ms. moritz
 * 6: ms. torres
 * 7: ms. white
 * 8: nurse brooke
 */

const teacher = 3;
/**
 * Want to see the rest of the code? Scroll down to the see!
 * Hursey Bird Code
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 */

/** @type {HTMLCanvasElement | null} */
const canvas = document.getElementById("canvas");
if (!(canvas instanceof HTMLCanvasElement)) throw new Error("Canvas not found");

/** @type {CanvasRenderingContext2D | null} */
const ctx = canvas.getContext("2d");
if (!ctx) throw new Error("Context not found");

/** @type {HTMLImageElement} */
const img = new Image();
img.src = "https://i.ibb.co/Q9yv5Jk/flappy-bird-set.png";

/** @type {HTMLImageElement} */
const bird = new Image();

/** @type {Record<number, string>} */
const teacherMap = {
  1: "newberry",
  2: "lizzy",
  3: "schavel",
  4: "martin",
  5: "moritz",
  6: "torres",
  7: "white",
  8: "brooke",
  9: "midkiff",
  10: "voell",
  11: "jones",
  12: "gloria",
};

/** @type {number[]} */
const birdSize = [51, 80];
const teacherName = teacherMap[teacher];
if (!teacherName) {
  throw new Error("Invalid teacher number, must be between 1 and 8");
}

bird.src = `./img/${teacherName}.png`;

/** @type {boolean} */
let gamePlaying = false;

/** @type {number} */
const cTenth = canvas.width / 10;

/** @type {number} */
const pipeWidth = 78;

/** @type {number} */
const jump = -1 * jumpHeight;

/** @type {number} */
let index = 0;

/** @type {number} */
let bestScore = 0;

/** @type {number} */
let flight;

/** @type {number} */
let flyHeight;

/** @type {number} */
let currentScore = 0;

/** @type {number[][]} */
let pipes = [];

/**
 * Generate a random pipe location
 * @returns {number}
 */
function pipeLoc() {
  return (
    Math.random() * (canvas.height - (pipeGap + pipeWidth) - pipeWidth) +
    pipeWidth
  );
}

/**
 * Setup the game
 */
function setup() {
  currentScore = 0;
  flight = jump;

  // set initial flyHeight (middle of screen - size of the bird)
  flyHeight = canvas.height / 2 - birdSize[1] / 2;

  // setup first 3 pipes
  pipes = Array(3)
    .fill(0)
    .map((_, i) => [canvas.width + i * (pipeGap + pipeWidth), pipeLoc()]);
}

/**
 * Render the game
 */
function render() {
  index++;

  // background first part
  ctx.drawImage(
    img,
    0,
    0,
    canvas.width,
    canvas.height,
    -((index * (speed / 2)) % canvas.width) + canvas.width,
    0,
    canvas.width,
    canvas.height
  );

  // background second part
  ctx.drawImage(
    img,
    0,
    0,
    canvas.width,
    canvas.height,
    -(index * (speed / 2)) % canvas.width,
    0,
    canvas.width,
    canvas.height
  );

  // pipe display
  if (gamePlaying) {
    pipes.forEach((pipe) => {
      pipe[0] -= speed;

      // top pipe
      ctx.drawImage(
        img,
        432,
        588 - pipe[1],
        pipeWidth,
        pipe[1],
        pipe[0],
        0,
        pipeWidth,
        pipe[1]
      );

      // bottom pipe
      ctx.drawImage(
        img,
        432 + pipeWidth,
        108,
        pipeWidth,
        canvas.height - pipe[1] + pipeGap,
        pipe[0],
        pipe[1] + pipeGap,
        pipeWidth,
        canvas.height - pipe[1] + pipeGap
      );

      // give 1 point & create new pipe
      if (pipe[0] <= -pipeWidth) {
        currentScore++;
        bestScore = Math.max(bestScore, currentScore);

        pipes = [
          ...pipes.slice(1),
          [pipes[pipes.length - 1][0] + pipeGap + pipeWidth, pipeLoc()],
        ];
      }

      // if hit the pipe, end
      if (
        [
          pipe[0] <= cTenth + birdSize[0],
          pipe[0] + pipeWidth >= cTenth,
          pipe[1] > flyHeight || pipe[1] + pipeGap < flyHeight + birdSize[1],
        ].every((elem) => elem)
      ) {
        gamePlaying = false;
        setup();
      }
    });
  }

  // draw bird
  if (gamePlaying) {
    ctx.drawImage(
      bird,
      0,
      0,
      birdSize[0],
      birdSize[1],
      cTenth,
      flyHeight,
      birdSize[0],
      birdSize[1]
    );
    flight += gravity / 10;
    flyHeight = Math.min(flyHeight + flight, canvas.height - birdSize[1]);
  } else {
    ctx.drawImage(
      bird,
      0,
      0,
      birdSize[0],
      birdSize[1],
      canvas.width / 2 - birdSize[0] / 2,
      flyHeight,
      birdSize[0],
      birdSize[1]
    );
    flyHeight = canvas.height / 2 - birdSize[1] / 2;

    ctx.fillText(`Best score : ${bestScore}`, 85, 245);
    ctx.fillText("Click to play", 90, 535);
    ctx.fillText(
      `${capitalizeFirstLetter(teacherMap[teacher])} edition`,
      90,
      600
    );
    ctx.font = "bold 30px courier";
  }

  const bestStoreEl = document.getElementById("bestScore");
  if (!(bestStoreEl instanceof HTMLElement))
    throw new Error("Element not found");
  bestStoreEl.innerHTML = `Best : ${bestScore}`;

  const currentScoreEl = document.getElementById("currentScore");
  if (!(currentScoreEl instanceof HTMLElement))
    throw new Error("Element not found");
  currentScoreEl.innerHTML = `Current : ${currentScore}`;

  window.requestAnimationFrame(render);
}

function capitalizeFirstLetter(val) {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

// launch setup
setup();
img.onload = render;

// start game on click or space bar
document.addEventListener("click", () => (gamePlaying = true));
document.addEventListener("keydown", (event) => {
  if (event.code === "Space") {
    gamePlaying = true;
  }
});

// handle flight on click or space bar
window.onclick = () => (flight = jump);
document.addEventListener("keydown", (event) => {
  if (event.code === "Space") {
    flight = jump;
  }
});

window.onerror = (message, source, lineno, colno, error) => {
  console.error("Error occurred:", message, source, lineno, colno, error);
  alert(
    `An error occurred: ${message}, ${source}, line number: ${lineno}, column: ${colno}`
  );
};
