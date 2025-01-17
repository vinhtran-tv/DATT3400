let data = [];
let cx, cy, radius;
let curviness = 20; // Control the curviness (higher = more curvy)

function preload() {
  // Load the CSV file before setup
  table = loadTable('average_color_values.csv', 'csv', 'header');
}

function setup() {
  createCanvas(800, 800);
  
  // Set up center and radius of the circle
  cx = width / 2;
  cy = height / 2;
  radius = 300;

  // Set color mode to HSB for better color manipulation
  colorMode(HSB, 360, 100, 100);

  // Invert background color and set stroke to white
  background(0);  // Dark background
  stroke(255);    // White stroke for the lines
  strokeWeight(0.6); // Thinner lines


  // Load data from CSV file into the data array
  for (let row of table.rows) {
    let avgR = float(row.get('Average R'));
    let avgB = float(row.get('Average B'));
    data.push({
      avgR: avgR,
      avgB: avgB
    });
  }

  // Find the min and max of Average R
  let minR = Math.min(...data.map(d => d.avgR));
  let maxR = Math.max(...data.map(d => d.avgR));

    // Draw faded mountains in the background first
  for (let i = 0; i < data.length; i++) {
    let avgR = data[i].avgR;
    let mountainHeight = map(avgR, minR, maxR, 0, height / 3); // Map Average R to mountain height
    // Set a color for the mountain based on Average R
    let mountainColor = color(avgR-120, 100, 100); // Use Average R for hue, saturation at 80, brightness at 100
    mountainColor.setAlpha(80); // Add transparency for a faded effect
    
    // Draw mountain range with curves
    fill(mountainColor);
    noStroke();
    beginShape();
    for (let x = 0; x <= width; x += width / 2000) {
      let y = height / 2 + sin(TWO_PI * x / width) * mountainHeight + random(-30, 30)+200; // Create curvy mountains
      vertex(x, y);
    }
    vertex(width, height); // Close the shape at the bottom
    vertex(0, height);     // Close the shape at the bottom
    endShape(CLOSE);
  }
  
  // Draw the circle
  fill(0);
  stroke(30,100,100);
  strokeWeight(1);
  ellipse(cx, cy, radius * 2, radius * 2);
  
  // Loop through the data array to draw curved lines
  for (let i = 0; i < data.length; i++) {
    let avgR = data[i].avgR;
    let avgB = data[i].avgB;

    // Map Average R to the top (maxR) and bottom (minR) of the circle
    let angle1 = map(avgR, minR, maxR, PI / 2, 3 * PI / 2);

    // Map Average B to the bottom-right quarter of the circle (angle between PI/4 and 3*PI/4)
    let angle2 = map(avgB, 120, 255, PI / 4, 3 * PI/2);

    // Calculate coordinates for the start point (Average R)
    let x1 = cx + radius * cos(angle1);
    let y1 = cy + radius * sin(angle1);

    // Calculate coordinates for the end point (Average B)
    let x2 = cx + radius * cos(angle2);
    let y2 = cy + radius * sin(angle2);

    // Calculate control points for the Bezier curve
    let ctrlX1 = (x1 + cx) / 2 + random(-curviness, curviness); // Control curviness with variable
    let ctrlY1 = (y1 + cy) / 2 + random(-curviness, curviness);
    let ctrlX2 = (x2 + cx) / 2 + random(-curviness, curviness);
    let ctrlY2 = (y2 + cy) / 2 + random(-curviness, curviness);

     // Map avgR to a color
  let hueValue = map(avgR, minR, maxR, 0, 45); // Map red value to the HSB hue
  stroke(hueValue, 70, 80); // Use full saturation and brightness with mapped hue
    
    // Draw Bezier curve
    strokeWeight(0.6);
    noFill();
    beginShape();
    vertex(x1, y1);
    bezierVertex(ctrlX1, ctrlY1, ctrlX2, ctrlY2, x2, y2);
    endShape();
  }
}
