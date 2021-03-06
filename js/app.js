// @format
'use strict';

// The width of blocks
const blockWidth = 101;

// The height of blocks
const blockHeight = 83;

// The value to be subtracted in order to center entities vertically
const blockHalfHeight = blockHeight / 2;

/**
 * A superclass to represent a character
 */
class Character {
  /**
   * Draw the character on the screen
   */
  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }
}

/**
 * Enemie the player must avoid
 * @extends Character
 */
class Enemy extends Character {
  /**
   * Create an enemy
   * @param {number} y - The y coordinate of the enemy
   */
  constructor(y) {
    super();

    // The image/sprite for our enemies, this uses
    // a helper to easily load images
    this.sprite = 'images/enemy-bug.png';

    // The initial position of the enemy
    this.startX = -1 * blockWidth * 3;

    // Set the position of the enemy
    this.x = this.startX;
    this.y = y;

    // Set the speed of the enemy
    // Max speed is 500px/sec and min speed is 100px/sec
    this.speed = Math.floor(Math.random() * (500 - 100)) + 100;
  }

  /**
   * @description Update the enemy's position
   * @param {number} dt - A time delta between ticks
   */
  update(dt) {
    // Multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += this.speed * dt;

    // Back to the initial position if the enemy move off screen
    // blockWidth * 5 is the right edge of the canvas
    if (this.x > blockWidth * 5 + blockWidth * 3) {
      this.x = this.startX;
    }

    // Check collision with the player
    if (Math.abs(this.x - player.x) < 75 && this.y === player.y) {
      player.collide();
    }
  }

  /**
   * Update speed of the enemy
   */
  updateSpeed() {
    this.speed += 50;
  }
}

/**
 * The player character
 * @extends Character
 */
class Player extends Character {
  /**
   * Create a player
   */
  constructor() {
    super();

    // The image/sprite for the player, this uses
    // a helper to easily load images
    this.sprite = 'images/char-boy.png';

    // The initial position of the player
    this.startX = blockWidth * 2; // 3th column
    this.startY = blockHeight * 5 - blockHalfHeight; // 6th row

    // Set the position of the player
    this.x = this.startX;
    this.y = this.startY;

    // Whether the player has collided with the enemy or not
    this.collision = false;

    // The lives of the player
    this.lives = 3;
  }

  /**
   * Update the collision property of the player
   */
  collide() {
    this.collision = true;
  }

  /**
   * Update the lives of the player
   */
  loseLife() {
    // Lose a life
    this.lives -= 1;

    // Update the DOM
    document.getElementById('lives').lastElementChild.remove();

    if (0 === this.lives) {
      game.end();
    }
  }

  /**
   * Reset the state of the player
   */
  reset() {
    this.x = this.startX;
    this.y = this.startY;
    this.collision = false;
  }

  /**
   * Update the player's position
   */
  update() {
    if (this.collision) {
      // Back to the initial position if a collision happens
      this.reset();

      // Lose a life
      this.loseLife();
    }
  }

  /**
   * Move the player according to the user input
   * @param {string} key - The key pressed
   */
  handleInput(key) {
    switch (key) {
      case 'left':
        // Move the player to the left
        // 0 is the left edge of the canvas
        this.x -= 0 === this.x ? 0 : blockWidth;
        break;

      case 'up':
        if (blockHalfHeight === this.y) {
          // Go to next level
          game.next();
        } else {
          // Move the player up
          this.y -= blockHeight;
        }

        break;

      case 'right':
        // Move the player to the right
        // blockWidth * 4 is the right edge of the canvas
        this.x += blockWidth * 4 === this.x ? 0 : blockWidth;
        break;

      case 'down':
        // Move the player down
        this.y +=
          blockHeight * 5 - blockHalfHeight === this.y ? 0 : blockHeight;
        break;
    }
  }
}

/**
 * Handle the game states
 */
class Game {
  /**
   * Create a game
   */
  constructor() {
    // The level of the game
    this.level = 1;

    // The score of the game
    this.score = 0;
  }

  /**
   * Go to next level
   */
  next() {
    // Move the player back to the initial position
    player.reset();

    // Update the speed of enemies
    allEnemies.forEach(function(element) {
      element.updateSpeed();
    });

    // Level up
    this.level++;

    // Update the score
    this.score += 100;

    // Update the DOM
    document.getElementById('level').textContent = this.level;
    document.getElementById('score').textContent = this.score;
  }

  /**
   * End the game
   */
  end() {
    const modal = document.getElementById('modal');

    // Modify HTML of the modal
    modal.innerHTML =
      '<h2 class="modal__title">Game Over</h2>' +
      `<p>Your score is<span class="modal__score">${this.score}</span></p>` +
      '</h2>';

    // Display the modal
    modal.classList.add('is-active');

    // Remove the event listener of the keyup event
    document.removeEventListener('keyup', keyup);
  }
}

// Place all enemy objects in an array called allEnemies
const allEnemies = [];

for (let i = 0; i < 6; i++) {
  // Set the y coordinate of the enemy
  // Place two enemies on each line
  const y = blockHeight * ((i % 3) + 1) - blockHalfHeight;

  allEnemies[i] = new Enemy(y);
}

// Place the player object in a variable called player
const player = new Player();

// Place the game object in a variable called game
const game = new Game();

/**
 * This listens for key presses and sends the keys to the
 * Player.handleInput() method.
 * @param {object} e - The event object
 */
function keyup(e) {
  const allowedKeys = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down',
  };

  player.handleInput(allowedKeys[e.keyCode]);
}

/**
 * Hide the modal
 */
function hideModal() {
  document.getElementById('modal').classList.remove('is-active');
}

// Add event listeners
document.addEventListener('keyup', keyup);
document.getElementById('modal__button').addEventListener('click', hideModal);
