jsPsych.plugins['boxes'] = (function(){

  var plugin = {};

  plugin.info = {
    name: 'boxes',
    parameters: {
      filled_in_reference: {
        type: jsPsych.plugins.parameterType.HTML_STRING,
        default: undefined
      },
      both_new: {
        type: jsPsych.plugins.parameterType.BOOL,
        default: undefined
      },
      clearboth: {
        type: jsPsych.plugins.parameterType.BOOL,
        default: undefined
      }
    }
  }

  plugin.trial = function(display_element, trial){

    var css_content = "<style>"
        css_content+= ".boxes-big-container { height: 100vh; overflow: hidden; }"
        // css_content+= "body {overflow: hidden;}"
        css_content+= "@keyframes change_color {0% {top:0px; background-color: darkcyan; opacity: 1} 100% {top:500px; background-color: pink; opacity: 0}} "
        css_content+= ".start_animation {animation: change_color .5s;}"
        css_content+= "@keyframes intro {0% {top:0px; transform: translateY(-1000px); }100% {top:0px;  transform:translateY(0px); }}"
        css_content+= ".start_intro_animation {animation: intro .5s;}"
        css_content+= ".around_boxes { position: relative; width:800px; height:350px; top: calc(50% - 175px); left: calc(50% - 400px); } "
        css_content+= "#inside_box_1 { position:absolute; width:350px; height:350px; left: 0px;  border: 1px solid black;  background-color: brown;}"
        css_content+= "#inside_box_2 { position:absolute; width:350px; height:350px; right: 0px; border: 1px solid black; background-color: brown;} "
        css_content+= "</style>"
    display_element.innerHTML = css_content;

    var html_content = "<div class='boxes-big-container'>"
        html_content +="<div class='around_boxes'>"
        html_content+= "<div id='inside_box_1'> </div>"
        html_content+= "<div id='inside_box_2'> </div>"
        html_content += "</div>"
        html_content += "</div>"


    display_element.innerHTML += html_content;


    var grid_cols= trial.grid_cols;
    var grid_rows= trial.grid_rows;
    var square_size = trial.square_size;
    var rotation_reference= trial.rotation_reference;
    var rotation_target= trial.rotation_target;
    var filled_in_reference= trial.filled_in_reference;
    var filled_in_target = trial.reflected? plugin.reflectShape(trial.filled_in_reference): trial.filled_in_reference;
    var html= createSquares(grid_cols, grid_rows, square_size, rotation_reference, filled_in_reference);
    var html_2= createSquares(grid_cols, grid_rows, square_size, rotation_target, filled_in_target);

    document.querySelector('#inside_box_1').innerHTML= html
    document.querySelector('#inside_box_2').innerHTML= html_2


    var both_new = trial.both_new;
    var correct_match = trial.correct_match;

    var lAudio = new Audio ('Wrong.mp3');
    var wAudio = new Audio ('Correct.mp3');

    if(both_new){
       document.querySelector('#inside_box_1').className = "start_intro_animation";
       document.querySelector('#inside_box_2').className = "start_intro_animation";
      // animate both boxes coming from the top of the screen
    } else {
      document.querySelector('#inside_box_2').className = "start_intro_animation";
      // animate only the right box coming from the top of the screen
    }
    var correct = null;

    document.addEventListener("keydown", function(e){

      if (e.keyCode==78){
        document.querySelector('#inside_box_2').addEventListener("animationend", function(){
          display_element.innerHTML = "";
          if(correct_response <= 5){
          }
          end();
        })
        document.querySelector('#inside_box_2').className = "start_animation";

        if(correct_match == 'n'){

          document.querySelector('#inside_box_2').insertAdjacentHTML("afterend", '<img src="check.png" style="width:12%; display:block; margin: auto; ">');
          wAudio.play();
          correct = true;
          if(trial.clearboth){
            document.querySelector('#inside_box_1').className = "start_animation";
          }
        }
        if (correct_match == 'y'){

          document.querySelector('#inside_box_2').insertAdjacentHTML("afterend", '<img src="x.png" style="width:12%; display:block; margin: auto; ">');
          lAudio.play();
          correct = false;
        }
      } else if( e.keyCode == 89){
        document.querySelector('#inside_box_2').addEventListener("animationend", function(){
          display_element.innerHTML = "";
          end();
        })
        document.querySelector('#inside_box_2').className = "start_animation";

        if(correct_match == 'y'){
          document.querySelector('#inside_box_2').insertAdjacentHTML("afterend", '<img src="check.png" style="width:12%; display:block; margin: auto; ">');
          wAudio.play();
          correct = true;
          if(trial.clearboth){
            document.querySelector('#inside_box_1').className = "start_animation";
          }
        }
        if(correct_match == 'n'){

          document.querySelector('#inside_box_2').insertAdjacentHTML("afterend", '<img src="x.png" style="width:12%; display:block; margin: auto; ">');
          lAudio.play();
          correct = false;
        }
      }

    }, {once:true});

    function end(){
      jsPsych.finishTrial({
        correct: correct
      })
    }


  }

  function createSquares(grid_cols, grid_rows, square_size, rotation, filled_in, position_left) {
    var grid_width = square_size * grid_cols;
    var grid_height = square_size * grid_rows;

    var html= "<div style='width:"+grid_width+"px; height:"+grid_height+"px; left:calc(50% - "+(grid_width/2)+"px); top:calc(50% - "+(grid_height/2)+"px);  position:relative; transform:rotate("+rotation+"deg);'>"
    for(row=0; row < grid_rows; row++){
     console.log('new row!')
      for(col=0; col < grid_cols; col++){
        if(filled_in[row][col] == true){
          html+= "<div style='position:absolute; left:"+(col*square_size)+"px; top:"+(row*square_size)+"px; width:"+(square_size-2)+"px; height:"+(square_size-2)+"px; background-color: purple; border: 2px solid black'></div>"
        }
      }
    }
        html += "</div>"
    return html;
  }

  plugin.generateShape=function(nrows, ncols, fill){
      var grid = [];
      // create an array with rows*cols values, and fill of them are true.
      var total_spots = nrows * ncols;
      for(i=0; i < nrows; i++){
        grid[i]=[];
        for(j=0; j< ncols; j++){
          grid[i][j]= false;
        }
      }
      // pick a random starting location
      var row = Math.floor(Math.random()*nrows);
      var col = Math.floor(Math.random()*ncols);
      grid[row][col]= true;

      for(var i=1; i<fill; i++){
        while(grid[row][col] == true){
          if (Math.floor(Math.random()*2) == 0) {
             if (Math.floor(Math.random()*2) == 0){
               if(row<nrows-1){
                 row++;
               }
             }
             else {
               if(row>0){
                 row--
               }
             }
          } else {
            if (Math.floor(Math.random()*2) == 0){
              if(col<ncols-1){
                col++
              }
            }
            else {
              if(col>0){
                col--
              }
            }
          }
        }

        grid[row][col] = true;
      }
      return grid;
  }

  plugin.generateFullShape=function(nrows, ncols, fill){
    var shape= plugin.generateShape(nrows, ncols, fill)
     while(check_full(shape)== false ||
     JSON.stringify(plugin.rotateShape90(shape))== JSON.stringify(shape) ||
     JSON.stringify(plugin.rotateShape180(shape))== JSON.stringify(shape) ||
     JSON.stringify(plugin.rotateShape270(shape))== JSON.stringify(shape) ||
     JSON.stringify(plugin.rotateShape90(plugin.reflectShape(shape)))== JSON.stringify(shape) ||
     JSON.stringify(plugin.rotateShape180(plugin.reflectShape(shape)))== JSON.stringify(shape) ||
     JSON.stringify(plugin.rotateShape270(plugin.reflectShape(shape)))== JSON.stringify(shape))
     {

       shape = plugin.generateShape(nrows, ncols, fill)
     }
     return shape
  };

  function check_full(shape){
    var low= null;
    var high= null;
    var nrows= shape.length;
    var ncols= shape[0].length;
    var row = 0
    var bad_shape = true;
    for(i=0; i < ncols; i++){
      if(shape[row][i]){
        bad_shape = false
      }
    }
    if(bad_shape){
      return false
    }

    var row = nrows - 1
    var bad_shape = true;
    for(i=0; i < ncols; i++){
      if(shape[row][i]){
        bad_shape = false
      }
    }
    if(bad_shape){
      return false
    }

    var col = 0
    var bad_shape = true;
    for(i=0; i < nrows; i++){
      if(shape[i][col]){
        bad_shape = false
      }
    }
    if(bad_shape){
      return false
    }

    var col = ncols - 1
    var bad_shape = true;
    for(i=0; i < nrows; i++){
      if(shape[i][col]){
        bad_shape = false
      }
    }
    if(bad_shape){
      return false
    }

    return true
  }

  plugin.rotateShape180=function(shape){

    var nrows= shape.length;
    var ncols= shape[0].length;
    var max_rows= shape.length - 1;
    var max_cols= shape[0].length - 1;

    var grid= [];

    for(i=0; i < nrows; i++){
      grid[i]=[]
      for(j=0; j< ncols; j++){
        grid[i][j]= false
      }
    }
    for(i=0; i < nrows; i++){
      for(j=0; j< ncols; j++){
        var new_col= max_cols - j
        var new_row= max_rows - i;
        grid[new_row][new_col]= shape[i][j];
      }
    }
    return grid;
  }
  plugin.rotateShape90=function(shape){

    var nrows= shape.length;
    var ncols= shape[0].length;
    var max_rows= shape.length - 1;
    var max_cols= shape[0].length - 1;

    var grid= [];

    for(i=0; i < nrows; i++){
      grid[i]=[]
      for(j=0; j< ncols; j++){
        grid[i][j]= false
      }
    }
    for(i=0; i < nrows; i++){
      for(j=0; j< ncols; j++){
        var new_col= max_rows - i
        var new_row= j;
        grid[new_row][new_col]= shape[i][j];
      }
    }
    return grid;
  }

  plugin.rotateShape270=function(shape){

    var nrows= shape.length;
    var ncols= shape[0].length;
    var max_rows= shape.length - 1;
    var max_cols= shape[0].length - 1;

    var grid= [];

    for(i=0; i < nrows; i++){
      grid[i]=[]
      for(j=0; j< ncols; j++){
        grid[i][j]= false
      }
    }
    for(i=0; i < nrows; i++){
      for(j=0; j< ncols; j++){
        var new_col= i
        var new_row= max_cols - j;
        grid[new_row][new_col]= shape[i][j];
      }
    }
    return grid;
  }

  plugin.reflectShape=function(shape){
    var low= null;
    var high= null;
    var nrows= shape.length;
    var ncols= shape[0].length;
    for(i=0; i < ncols; i++){
      for(j=0; j< nrows; j++){
        if(shape[j][i]== true){
          if(low === null){
            low = i;
          }
          high = i
        }
      }
    }
    var midpoint= (high-low)/2 + low

    var grid= [];

    for(i=0; i < nrows; i++){
      grid[i]=[]
      for(j=0; j< ncols; j++){
        grid[i][j]= false
      }
    }
    for(i=0; i < nrows; i++){
      for(j=0; j< ncols; j++){
        if(shape[i][j]==true) {
        grid[i][(midpoint-j) + midpoint]= true
        }
      }
    }
    return grid;
  }
  return plugin;
  }) ();
