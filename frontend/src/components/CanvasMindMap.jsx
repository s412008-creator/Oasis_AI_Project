import React, { useRef, useEffect } from 'react';

// Old Money Colors
const BRANCH_COLORS = [
  "#D4AF37", // Classic Gold
  "#8C7322", // Darker Gold
  "#C07A4E", // Rust
  "#5C7457", // Sage Green
  "#5B7290", // Slate Blue
];

export default function CanvasMindMap({ data }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !data) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let scale = 1;
    let offsetX = 0;
    let offsetY = 0;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    let CW = 0;
    let CH = 0;

    const wrapText = (text, x, y, maxWidth, lineHeight) => {
      if (!text) return;
      const words = text.split(" ");
      let line = "";
      const lines = [];
      for (const word of words) {
        const test = line ? `${line} ${word}` : word;
        if (ctx.measureText(test).width > maxWidth && line) {
          lines.push(line);
          line = word;
        } else {
          line = test;
        }
      }
      if (line) lines.push(line);
      const startY = y - ((lines.length - 1) * lineHeight) / 2;
      lines.forEach((l, i) => ctx.fillText(l, x, startY + i * lineHeight));
    };

    const draw = () => {
      ctx.clearRect(0, 0, CW, CH);
      const cx = CW / 2 + offsetX;
      const cy = CH / 2 + offsetY;
      const branches = data.branches || [];
      const count = branches.length;

      ctx.save();

      branches.forEach((branch, i) => {
        const angle = (2 * Math.PI / count) * i - Math.PI / 2;
        const bDist = 160 * scale;
        const bx = cx + bDist * Math.cos(angle);
        const by = cy + bDist * Math.sin(angle);
        const color = BRANCH_COLORS[i % BRANCH_COLORS.length];

        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(bx, by);
        ctx.strokeStyle = color + "99";
        ctx.lineWidth = 2.5 * scale;
        ctx.stroke();

        const br = 32 * scale;
        ctx.beginPath();
        ctx.arc(bx, by, br, 0, 2 * Math.PI);
        ctx.fillStyle = color + "33";
        ctx.fill();
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = "#E8E6D9"; // Cream
        ctx.font = `${Math.max(10, 13 * scale)}px 'Lato', sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        wrapText(branch.label, bx, by, br * 1.8, 14 * scale);

        const children = branch.children || [];
        children.forEach((child, j) => {
          const cAngle = angle + (j - (children.length - 1) / 2) * 0.55;
          const cDist = 120 * scale;
          const childX = bx + cDist * Math.cos(cAngle);
          const childY = by + cDist * Math.sin(cAngle);

          ctx.beginPath();
          ctx.moveTo(bx, by);
          ctx.lineTo(childX, childY);
          ctx.strokeStyle = color + "55";
          ctx.lineWidth = 1.5 * scale;
          ctx.stroke();

          const cr = 24 * scale;
          ctx.beginPath();
          ctx.arc(childX, childY, cr, 0, 2 * Math.PI);
          ctx.fillStyle = "#212220"; // bg-raised
          ctx.fill();
          ctx.strokeStyle = color + "99";
          ctx.lineWidth = 1.5;
          ctx.stroke();

          ctx.fillStyle = color;
          ctx.font = `${Math.max(9, 11 * scale)}px 'Lato', sans-serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          wrapText(child, childX, childY, cr * 1.8, 12 * scale);
        });
      });

      // Center node
      const radius = 48 * scale;
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
      grad.addColorStop(0, "#D4AF37");
      grad.addColorStop(1, "#8C7322");
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
      ctx.fillStyle = grad;
      ctx.fill();

      ctx.fillStyle = "#ffffff";
      ctx.font = `bold ${Math.max(11, 14 * scale)}px 'Playfair Display', serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      wrapText(data.center, cx, cy, radius * 1.8, 15 * scale);

      ctx.restore();
    };

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.parentElement.getBoundingClientRect();
      const w = rect.width;
      const h = Math.max(500, rect.height || 500);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.scale(dpr, dpr);
      CW = w;
      CH = h;
      draw();
    };

    resize();
    window.addEventListener('resize', resize);

    const onWheel = (e) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      scale = Math.min(Math.max(scale * delta, 0.3), 3);
      draw();
    };

    const onMouseDown = (e) => {
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
    };
    const onMouseMove = (e) => {
      if (!dragging) return;
      offsetX += e.clientX - lastX;
      offsetY += e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      draw();
    };
    const onMouseUp = () => { dragging = false; };
    const onMouseLeave = () => { dragging = false; };

    let lastTouchDist = 0;
    const onTouchStart = (e) => {
      if (e.touches.length === 1) {
        dragging = true;
        lastX = e.touches[0].clientX;
        lastY = e.touches[0].clientY;
      } else if (e.touches.length === 2) {
        lastTouchDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
      }
    };
    const onTouchMove = (e) => {
      e.preventDefault();
      if (e.touches.length === 1 && dragging) {
        offsetX += e.touches[0].clientX - lastX;
        offsetY += e.touches[0].clientY - lastY;
        lastX = e.touches[0].clientX;
        lastY = e.touches[0].clientY;
        draw();
      } else if (e.touches.length === 2) {
        const dist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        scale = Math.min(Math.max(scale * (dist / lastTouchDist), 0.3), 3);
        lastTouchDist = dist;
        draw();
      }
    };
    const onTouchEnd = () => { dragging = false; };

    canvas.addEventListener("wheel", onWheel, { passive: false });
    canvas.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    canvas.addEventListener("mouseleave", onMouseLeave);

    canvas.addEventListener("touchstart", onTouchStart, { passive: false });
    canvas.addEventListener("touchmove", onTouchMove, { passive: false });
    canvas.addEventListener("touchend", onTouchEnd);

    return () => {
      window.removeEventListener('resize', resize);
      canvas.removeEventListener("wheel", onWheel);
      canvas.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      canvas.removeEventListener("mouseleave", onMouseLeave);
      canvas.removeEventListener("touchstart", onTouchStart);
      canvas.removeEventListener("touchmove", onTouchMove);
      canvas.removeEventListener("touchend", onTouchEnd);
    };
  }, [data]);

  return (
    <div style={{ width: '100%', height: '500px', cursor: 'grab', position: 'relative' }}>
      <canvas ref={canvasRef} style={{ display: 'block' }} />
    </div>
  );
}
