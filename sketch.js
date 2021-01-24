var current;
var colonne, ligne;
var complete, fin, chemin;
var t = 50;                                      //t defini la dimension d'une cellule
var grid = [];
var stack = [];
var solv = [];



function setup() {
  //frameRate(5);                           //gere le nombre d'images par seconde
  this.complete = false;
  createCanvas(1000,1000);                    //gere la taille de la fenetre
  colonne = floor(width/t);
  ligne = floor(height/t);
  fin = (colonne*ligne)-1;
  
  for(var y = 0; y < ligne; y++){
     for(var x = 0; x < colonne; x++){
       var cellule = new Cellule(x,y);
       grid.push(cellule);                       //place la cellule(x,y) dans la liste grid
     }
  }
  current = grid[0];                             //defini la cellule en haut à gauche(grid[0]) comme "current cell"
}










function draw() {
  background(51);
  for(var i = 0; i < grid.length; i++){
    grid[i].show();                             //affiche toute les cellules presentes dans la liste grid
  }
  current.startEnd();
  
  
  
  if(this.complete == true){
  current.solved = true;
  var next = current.checkSolve();
  if(next){
    next.solved = true;
    solv.push(current);
    current = next;
    if(current == grid[fin]){
     this.complete = false;
 
    }
  }else if(solv.length > 0){
    current.wrong = true;
    current = solv.pop();
  }
 }
  
  if(this.complete == false){
  current.visite = true;                        //marque la cellule actuelle comme visite
  //current.highlight();
  var suivante = current.checkVoisins();
  if(suivante){                                 //fait passer la "current cell" de la cellule actuelle à celle choisie par la fonction checkvoisin
    suivante.visite = true;
    stack.push(current);                        //mettre la "curret cell" dans la pile
    retireMur(current, suivante);               //appel la fonction retireMur
    current = suivante;
  }else if(stack.length > 0){
    current = stack.pop();
  }else if(current == grid[0]){
    this.complete = true;
  }
 }
}













function index(x,y){                                      
  if(x < 0 || y < 0 || x > colonne-1 || y > ligne-1){      //si "current cell" se situe sur les brods du canvas, alors il ne faut pas chercher des voisins en dehors du canvas, si index=-1, dessus, droite, bas ou gauche sera "undefined" pour empecher cela
    return -1;                                             
  }
  return x + y * colonne;                        //creer un index qui va classer les cellules de façon croissante de la droite vers la gauche puis revenir à la ligne et encore droite vers la gauche etc...
}                                                //pour que je puisse facilement selectioner la cellule du dessus, celle d'en bas, de gauche ou celle de droite avec des coordonées orthonormées













function Cellule(x, y) {
  this.x = x;
  this.y = y;
  this.mur = [true, true, true, true];         //creer un array avec 4 parametre en boolean (true or false) qui sert a definir quels murs sont actifs (haut, droite, bas, gauche)
  this.visite = false;
  this.solved = false;
  
  
  
  
  this.checkVoisins = function(){                //fonction qui permet de tester si les voisins de la "current cell" sont visite ou non, si non, en choisir une aléatoirement et la placer dans la liste voisins
    var voisins = [];
    var dessus = grid[index(x    , y - 1)];      //selctionne la cellule au dessus de la "current cell" 
    var droite = grid[index(x + 1, y    )];      //selctionne la cellule à droite de la "current cell" 
    var bas    = grid[index(x    , y + 1)];      //selctionne la cellule en bas de la "current cell" 
    var gauche = grid[index(x - 1, y    )];      //selctionne la cellule à gauche de la "current cell" 
    
    if(dessus && !dessus.visite){
      voisins.push(dessus);                          //si la cellule du dessus est definie(!= -1), et n'est pas visite alors je la met dans la liste voisins
    }
     if(droite && !droite.visite){
      voisins.push(droite);                          //si la cellule de droite est definie(!= -1), et n'est pas visite alors je la met dans la liste voisins
    }
     if(bas && !bas.visite){
      voisins.push(bas);                             //si la cellule d'en dessous est definie(!= -1), et n'est pas visite alors je la met dans la liste voisins
    }
     if(gauche && !gauche.visite){
      voisins.push(gauche);                          //si la cellule de gauche est definie(!= -1), et n'est pas visite alors je la met dans la liste voisins
    }
    
    if(voisins.length > 0){
      var r = floor(random(0, voisins.length));         //si la liste voisins comporte plus d'une valeur, alors j'en choisi un aléatoirement entre les valeurs disponibles
      return voisins[r];
    }else{
      return undefined;                                //si la liste voisins est vide alors return undefined
    }
  }
  
  
  
  
  this.checkSolve = function(){                //fonction qui permet de tester si les voisins de la "current cell" sont visite ou non, si non, en choisir une aléatoirement et la placer dans la liste voisins
    var resolu = [];
    var dessus = grid[index(x    , y - 1)];      //selctionne la cellule au dessus de la "current cell" 
    var droite = grid[index(x + 1, y    )];      //selctionne la cellule à droite de la "current cell" 
    var bas    = grid[index(x    , y + 1)];      //selctionne la cellule en bas de la "current cell" 
    var gauche = grid[index(x - 1, y    )];      //selctionne la cellule à gauche de la "current cell" 
    
    if(dessus && !dessus.solved && dessus.mur[2] == false){
      resolu.push(dessus);                          //si la cellule du dessus est definie(!= -1), et n'est pas visite alors je la met dans la liste voisins
    }
     if(droite && !droite.solved && droite.mur[3] == false){
      resolu.push(droite);                          //si la cellule de droite est definie(!= -1), et n'est pas visite alors je la met dans la liste voisins
    }
     if(bas && !bas.solved && bas.mur[0] == false){
      resolu.push(bas);                             //si la cellule d'en dessous est definie(!= -1), et n'est pas visite alors je la met dans la liste voisins
    }
     if(gauche && !gauche.solved && gauche.mur[1] == false){
      resolu.push(gauche);                          //si la cellule de gauche est definie(!= -1), et n'est pas visite alors je la met dans la liste voisins
    }
    
    if(resolu.length > 0){
      var r = floor(random(0, resolu.length));         //si la liste voisins comporte plus d'une valeur, alors j'en choisi un aléatoirement entre les valeurs disponibles
      return resolu[r];
    }else{
      return undefined;                                //si la liste voisins est vide alors return undefined
    }
  }
  
  
  
  
  
  
  
  
  
  
  this.startEnd = function(){
   noStroke();
    fill(240, 195, 0, 100);
    rect(0, 0, t, t);
    rect(width - t, height - t, width, height);
  }
  
  
  
  this.highlight = function(){
    var x = this.x*t;
    var y = this.y*t;
    noStroke();                                        //colore "current cell" en vert
    fill(0,255,100,100);
    rect(x, y, t, t);
  }
  
  
  
  this.show = function() {                     //definie la fonction show pour afficher les cellules
    var x = this.x*t;
    var y = this.y*t;
    stroke(255);
    
    if(this.mur[0]){
     line(x     ,y     ,x + t ,y    );}                //place une ligne comme mur en haut de la cellule si son parametre égal true
    
    if(this.mur[1]){ 
     line(x + t ,y     ,x + t ,y + t);}                //place une ligne comme mur à droite de la cellule si son parametre égal true
    
    if(this.mur[2]){
     line(x + t ,y + t ,x     ,y + t);}                //place une ligne comme mur en bas de la cellule si son parametre égal true
    
    if(this.mur[3]){
     line(x     ,y + t ,x     ,y    );}                //place une ligne comme mur à gauche de la cellule si son parametre égal true
    
    //if (this.visite){                          //colore en cyan les cellules visite
      //noStroke();
      //fill(0, 255, 255, 100);  
      //rect(x, y, t, t);
    //}
    if (this.solved){
      noStroke();
      fill(102, 102, 102, 100);  
      rect(x, y, t, t);
    }
    
    if (this.wrong){
      noStroke();
      fill(30, 100);
      rect(x, y, t, t);
    }
  }
}















function retireMur(a, b){
  var x = a.x - b.x;         //cette valeur me permet de savoir si la cellule suivante est à gauche ou à droite de la "current cell"
  if(x === 1){
    a.mur[3] = false;        
    b.mur[1] = false;
  }else if(x === -1){
    a.mur[1] = false;
    b.mur[3] = false;
  }
  
   var y = a.y - b.y;         //cette valeur me permet de savoir si la cellule suivante est en dessus ou en bas de la "current cell"
   if(y === 1){
    a.mur[0] = false;        
    b.mur[2] = false;
  }else if(y === -1){
    a.mur[2] = false;
    b.mur[0] = false;
  }
}


























