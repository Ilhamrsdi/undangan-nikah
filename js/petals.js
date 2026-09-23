/**
 * Falling Jasmine Petals (Ronce Melati Jawa & Sunda) & Golden Stardust Particle Engine
 * Creates an ultra-smooth, authentic Indonesian wedding atmosphere.
 */

(function () {
  const canvas = document.getElementById('petal-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const isMobile = window.innerWidth < 768;
  const petalCount = isMobile ? 18 : 32;
  const dustCount = isMobile ? 25 : 50;

  class JasminePetal {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * -height;
      this.size = Math.random() * 8 + 7;
      this.speedY = Math.random() * 1.1 + 0.6;
      this.speedX = Math.random() * 1.2 - 0.6;
      this.rotation = Math.random() * 360;
      this.rotSpeed = Math.random() * 1.2 - 0.6;
      this.flip = Math.random();
      this.flipSpeed = Math.random() * 0.02 + 0.008;
      this.opacity = Math.random() * 0.4 + 0.45;
      // 0 = Maroon Rose Petal, 1 = White Jasmine Blossom, 2 = Single Jasmine Petal
      const typeRand = Math.random();
      if (typeRand < 0.55) {
        this.type = 'maroon-rose';
      } else if (typeRand < 0.8) {
        this.type = 'jasmine-flower';
      } else {
        this.type = 'jasmine-petal';
      }
    }

    update() {
      this.y += this.speedY;
      this.x += Math.sin(this.y * 0.012) * 0.75 + this.speedX;
      this.rotation += this.rotSpeed;
      this.flip += this.flipSpeed;

      if (this.y > height + 25 || this.x > width + 35 || this.x < -35) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.scale(1, Math.sin(this.flip));

      if (this.type === 'maroon-rose') {
        // Velvety Royal Maroon Rose Petal (matching the floral theme)
        ctx.beginPath();
        ctx.moveTo(0, -this.size * 0.8);
        ctx.bezierCurveTo(-this.size * 0.9, -this.size * 0.4, -this.size * 0.75, this.size * 0.8, 0, this.size);
        ctx.bezierCurveTo(this.size * 0.75, this.size * 0.8, this.size * 0.9, -this.size * 0.4, 0, -this.size * 0.8);
        
        const grad = ctx.createLinearGradient(0, -this.size, 0, this.size);
        grad.addColorStop(0, `rgba(163, 30, 52, ${this.opacity})`);
        grad.addColorStop(0.5, `rgba(115, 18, 36, ${this.opacity})`);
        grad.addColorStop(1, `rgba(68, 10, 20, ${this.opacity * 0.9})`);
        ctx.fillStyle = grad;
        ctx.fill();

        // Subtle petal vein highlight
        ctx.beginPath();
        ctx.moveTo(0, -this.size * 0.6);
        ctx.lineTo(0, this.size * 0.6);
        ctx.strokeStyle = `rgba(212, 175, 55, ${this.opacity * 0.25})`;
        ctx.lineWidth = 0.6;
        ctx.stroke();
      } else if (this.type === 'jasmine-flower') {
        // 5-petal sacred white jasmine blossom (Bunga Melati Adat)
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        for (let i = 0; i < 5; i++) {
          ctx.beginPath();
          ctx.ellipse(0, -this.size * 0.7, this.size * 0.35, this.size * 0.65, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.rotate((72 * Math.PI) / 180);
        }
        // Jasmine golden center stamen
        ctx.beginPath();
        ctx.arc(0, 0, this.size * 0.22, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(235, 195, 80, ${this.opacity + 0.25})`;
        ctx.fill();
      } else {
        // Single soft ivory petal
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-this.size / 2, -this.size / 2, -this.size, this.size / 3, 0, this.size);
        ctx.bezierCurveTo(this.size, this.size / 3, this.size / 2, -this.size / 2, 0, 0);
        ctx.fillStyle = `rgba(255, 250, 240, ${this.opacity})`;
        ctx.fill();
      }

      ctx.restore();
    }
  }

  class GoldDust {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2.2 + 0.6;
      this.speedY = Math.random() * -0.35 - 0.1;
      this.speedX = (Math.random() - 0.5) * 0.25;
      this.alpha = Math.random() * 0.65 + 0.25;
      this.pulseSpeed = Math.random() * 0.03 + 0.015;
      this.pulse = Math.random() * Math.PI;
    }

    update() {
      this.y += this.speedY;
      this.x += this.speedX;
      this.pulse += this.pulseSpeed;

      if (this.y < -10) {
        this.y = height + 10;
        this.x = Math.random() * width;
      }
    }

    draw() {
      const currentAlpha = Math.abs(Math.sin(this.pulse)) * this.alpha;
      ctx.save();
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(243, 229, 171, ${currentAlpha})`;
      ctx.shadowBlur = 6;
      ctx.shadowColor = 'rgba(212, 175, 55, 0.85)';
      ctx.fill();
      ctx.restore();
    }
  }

  const petals = Array.from({ length: petalCount }, () => new JasminePetal());
  const dusts = Array.from({ length: dustCount }, () => new GoldDust());

  function animate() {
    ctx.clearRect(0, 0, width, height);

    dusts.forEach((dust) => {
      dust.update();
      dust.draw();
    });

    petals.forEach((petal) => {
      petal.update();
      petal.draw();
    });

    requestAnimationFrame(animate);
  }

  animate();
})();
